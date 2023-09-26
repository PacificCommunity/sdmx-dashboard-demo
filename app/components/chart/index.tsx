import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import Accessibility from "highcharts/modules/accessibility";
import ExportData from "highcharts/modules/export-data";
import * as Highcharts from 'highcharts';
import { useEffect, useState } from "react";
// @ts-ignore
import { SDMXParser } from 'sdmx-json-parser';
import { parseTextExpr } from '@/app/utils/parseTextExpr';
import { parseDataExpr } from "@/app/utils/parseDataExpr";

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts);
    Accessibility(Highcharts);
    ExportData(Highcharts)
}

const Chart = ({config, loadedCallback} : {config: any, loadedCallback: any}) => {

    const [ready, setReady] = useState(false)
    const [chartId, setChartId] = useState('chart-1')
    const [hcOptions, setHcOptions] = useState({})

    const sdmxParser = new SDMXParser();

    const sortByDimensionName = (data: any, dimension: string) => {
        return data.sort((a: any, b: any) => {
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
        const dataObjs = parseDataExpr(config.DATA);

        const chartType = processChartExpr(config.chartType);
        if (!chartType) {
            throw new Error('Chart type not defined');
        }
        const hcExtraOptions : any = {};

        let seriesData : any[] = [];
        let dataLabels = [];
        let xAxisValue = [];
        let titleObj : any = {};
        let subTitleObj :any = {};

        const dataObj = dataObjs[0]; // TODO handle multiple data objects

        const dataFlowUrl = dataObj.dataFlowUrl;
        sdmxParser.getDatasets(dataFlowUrl, {
            headers: new Headers({
                Accept: "application/vnd.sdmx.data+json;version=2.0.0",
            })
        }).then(() => {
            const data = sdmxParser.getData();
            const dimensions = sdmxParser.getRawDimensions();

            titleObj = parseTextExpr(config.Title, dimensions);
            subTitleObj = parseTextExpr(config.Subtitle, dimensions);

            // check if xAxisConcept exists in data
            if(config.xAxisConcept) {
                const xAxisDimension = dimensions.find((dimension:any) => dimension.id == config.xAxisConcept);
                if(!xAxisDimension) {
                    throw new Error(`xAxisConcept ${config.xAxisConcept} not found in dataflow`);
                }
            }
            // check if legendConcept exists in dataFlow
            if(config.legendConcept) {
                const legendDimension = dimensions.find((dimension:any) => dimension.id == config.legendConcept);
                if(!legendDimension) {
                    throw new Error(`legendConcept ${config.legendConcept} not found in dataflow`);
                }
            }

            const xAxisConcept = config.xAxisConcept;
            if(chartType == 'line') {
                // for (multiple) line charts, we create multiple series for each legendConcept dimension values and using xAxisConcept as the x-axis dimension
                // TODO in case any other dimension has multiple values, we fix them to their latest value and display a select field to change their value.
                if(config.legendConcept != "") {
                    const serieDimensions = dimensions.find((dimension:any) => dimension.id == config.legendConcept);
                    if (xAxisConcept == "TIME_PERIOD") {
                        // we assume that line charts have a time dimension represented on x-axis
                        const timeDimension = dimensions.find((dimension:any) => dimension.id == "TIME_PERIOD");
                        const freqDimension = dimensions.find((dimension:any) => dimension.id == "FREQ");
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
                            //...dimensionSingleValues,
                            ...val,
                            y: val["value"],
                            x: Date.UTC(val[xAxisConcept].split('-')[0], (val[xAxisConcept].split('-').length > 1 ? val[xAxisConcept].split('-')[1]: 1), (val[xAxisConcept].split('-').length > 2 ? val[xAxisConcept].split('-')[2]: 1))
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
                        //...dimensionSingleValues,
                        ...val,
                        y: val["value"], // TODO apply operation if provided
                        name: (xAxisConcept?val[xAxisConcept]:val[config.legendConcept]),
                    };
                });

                if(config.LabelsYN) {
                    hcExtraOptions["plotOptions"] = {
                        [chartType]: {
                            dataLabels: {
                                enabled: true,
                                formatter: function(this: any) {
                                    debugger;
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
