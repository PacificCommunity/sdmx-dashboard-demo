import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import Accessibility from "highcharts/modules/accessibility";
import ExportData from "highcharts/modules/export-data";
import * as Highcharts from 'highcharts';
import { useEffect, useState } from "react";
import { SDMXParser } from 'sdmx-json-parser';
import { parseTextExpr } from '@/app/utils/parseTextExpr';

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts);
    Accessibility(Highcharts);
    ExportData(Highcharts)
}

const Chart = ({config, loadedCallback}) => {

    const [ready, setReady] = useState(false)
    const [chartId, setChartId] = useState('chart-1')
    const [hcOptions, setHcOptions] = useState({})

    const sdmxParser = new SDMXParser();

    const sortByDimensionName = (data: any, dimension: string) => {
        return data.sort((a, b) => {
        if (a[dimension] < b[dimension]) {
            return -1;
        }
        if (a[dimension] > b[dimension]) {
            return 1;
        }
        return 0;
        });
    };

    

    /**
     * Extract Highcharts chart type from chart expression in yaml.
     * @param chartExpr
     * @returns {String}
     */
    const processChartExpr = (chartExpr: string) => {
        const chartType = chartExpr.split(',')[0];
        switch (chartType) {
            case 'BARS':
                return 'bar'
                break;
            case 'LINES':
                return 'line'
                break;
            case 'PIE':
                return 'pie'
                break;
            default:
                break;
        }
    }


    useEffect(() => {
        const url = config.DATA;
        const xAxisConcept = config.xAxisConcept;
        const chartType = processChartExpr(config.chartType);
        const hcExtraOptions = {};

        sdmxParser.getDatasets(url, {
            headers: new Headers({
                Accept: "application/vnd.sdmx.data+json;version=2.0.0",
            })
        }).then((dataset: any) => {
            const data = sdmxParser.getData();
            const rawDimensions = sdmxParser.getRawDimensions();
            const dimensionSingleValues = {};
            rawDimensions
                .filter((rawDimension: any) => rawDimension.values.length === 1)
                .forEach((rawDimension: any) => {
                dimensionSingleValues[rawDimension.id] =
                    rawDimension.values[0].name;
                });

            const titleObj = parseTextExpr(config.Title, rawDimensions);
            const subTitleObj = parseTextExpr(config.Subtitle, rawDimensions);
            let seriesData = [];
            let dataLabels = [];
            let xAxisValue = [];
            if(chartType == 'line') {
                // for (multiple) line charts, we create multiple series for each legendConcept dimension values and using xAxisConcept as the x-axis dimension
                // TODO in case any other dimension has multiple values, we fix them to their latest value and display a select field to change their value.
                if(config.legendConcept != "") {
                    const serieDimensions = rawDimensions.find((dimension:any) => dimension.id == config.legendConcept);
                    if (xAxisConcept == "TIME_PERIOD") {
                        // we assume that line charts have a time dimension represented on x-axis
                        const timeDimension = rawDimensions.find((dimension:any) => dimension.id == "TIME_PERIOD");
                        const freqDimension = rawDimensions.find((dimension:any) => dimension.id == "FREQ");
                        let unit = '';
                        let dateTimeLabelFormats = {
                            year: "%Y",
                            month: "%b",
                        }
                        let xAxisLabelformat = '';
                        if(freqDimension.values[0].id == "A") {
                            unit = "year";
                            xAxisLabelformat = "{value:%Y}";
                        } else if(freqDimension.values[0].id == "Q" || freqDimension.values[0].id == 'M') {
                            unit = "month";
                            xAxisLabelformat = "{value:%b %Y}";
                        }
                        hcExtraOptions["xAxis"] = {
                            type: "datetime",
                            units: [[unit]],
                            labels: {
                                format: xAxisLabelformat
                            }
                        }
                    }
                    serieDimensions.values.forEach((serieDimension:any) => {
                        // a serie is created for each of the serie's dimension value
                        const serieData = data.filter((val:any) => val[config.legendConcept] == serieDimension.name);
                        const sortedData = sortByDimensionName(serieData, xAxisConcept);
                        const yAxisValue = sortedData.map((val: any) => {
                            return {
                            ...dimensionSingleValues,
                            ...val,
                            y: val["value"],
                            x: Date.UTC(val[xAxisConcept].split('-')[0], (val[xAxisConcept].split('-').length > 1 ? val[xAxisConcept][1]: 1), (val[xAxisConcept].split('-').length > 2 ? val[xAxisConcept].split('-')[2]: 1)) 
                            };
                        });
                        seriesData.push({
                            name: serieDimension.name,
                            data: yAxisValue
                        });
                    });
                }
            } else {
                // other chart type (bar, pie) only one serie is created using the dimension specified in xAxisConcept
                const sortedData = sortByDimensionName(data, xAxisConcept);
                xAxisValue = sortedData.map((val: any) => {
                    return val[xAxisConcept];
                });
                hcExtraOptions["xAxis"] = {
                    categories: xAxisValue
                }
                const yAxisValue = sortedData.map((val: any) => {
                    return {
                        ...dimensionSingleValues,
                        ...val,
                        y: val["value"],
                        name: (xAxisConcept?val[xAxisConcept]:val[config.legendConcept]),
                    };
                });

                if(config.LabelsYN) {
                    hcExtraOptions["plotOptions"] = {
                        [chartType]: {
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    if(config.Unit == '%') {
                                        if(chartType == "pie") {
                                            return `${this.point?.name}: ${this.point?.percentage.toFixed(config.Decimals)} %`
                                        } else {
                                            return `${this.point?.percentage.toFixed(config.Decimals)} %`
                                        }
                                    } else {
                                        return `${this.point?.y?.toLocaleString()}`
                                    }
                                }
                            }
                        }
                    }
                }

                seriesData = [{
                    name: titleObj.text,
                    data: yAxisValue,
                },];
            }
            // const seriesData = [{
            //     name: titleObj.text,
            //     data: yAxisValue,
            // },];
            loadedCallback(true);
            setHcOptions({
                chart: {
                    type: chartType,
                },
                title: {
                    text: titleObj.text,
                    style: titleObj.hcStyle,
                    align: titleObj.align
                },
                subtitle: {
                    text: subTitleObj.text,
                    style: subTitleObj.hcStyle,
                    align: subTitleObj.align
                },
                legend: {
                    enabled: config.legendLoc == 'HIDE' ? false : true,
                    align: 'right'//config.legendLoc.toLowerCase()
                },
                series:seriesData,
                ...hcExtraOptions,
            });
        });
    }, [config]);

    return (
        <HighchartsReact
          highcharts={Highcharts}
          options={hcOptions}
        />
    )
}

export default Chart;
