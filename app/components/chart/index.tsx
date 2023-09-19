import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import Accessibility from "highcharts/modules/accessibility";
import ExportData from "highcharts/modules/export-data";
import * as Highcharts from 'highcharts';
import { useEffect, useState } from "react";
import { SDMXParser } from 'sdmx-json-parser';
import { parseOperandTextExpr, parseTextExpr } from '@/app/utils/parseTextExpr';
import { parseDataExpr } from "@/app/utils/parseDataExpr";

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
            case 'DRILLDOWN':
                return 'drilldown'
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
        const hcExtraOptions = {};

        let seriesData : any[] = [];
        let xAxisValue = [];
        let titleObj = {};
        let subTitleObj = {};

        const dataPromises = dataObjs.map((dataObj) => {
            const parser = new SDMXParser();
            return parser.getDatasets(dataObj.dataFlowUrl, {
                headers: new Headers({
                    Accept: "application/vnd.sdmx.data+json;version=2.0.0",
                })
            }).then(() => {
                let data = parser.getData();
                const attributes = parser.getAttributes();
                // if alternate label specified in the DATA field, the label is appended to the data with key xAxisConcept
                if (dataObj.alternateLabel) {
                    data.forEach((dataItem, index, data) => {
                        data[index][config.xAxisConcept] = dataObj.alternateLabel;
                    });
                }
                // if operation specified in the DATA field, it is applied here whether the operand is an attribute or another SDMX request
                if (dataObj.operator) {
                    if (dataObj.operand.startsWith('{')) {
                        // operand is an attribute
                        const operandValue = parseOperandTextExpr(dataObj.operand, data[0], attributes);
                        data.forEach((dataItem, index, data) => {
                            data[index].value = eval(`${data[index].value} ${dataObj.operator} ${operandValue}`);
                        });
                        return [data, parser.getRawDimensions()];
                    } else {
                        // operand is another SDMX request
                        const parserOperand = new SDMXParser();
                        return parserOperand.getDatasets(dataObj.operand, {
                            headers: new Headers({
                                Accept: "application/vnd.sdmx.data+json;version=2.0.0",
                            })
                        }).then(() => {
                            const dataOperand = parserOperand.getData();
                            const operandValue = dataOperand[0].value;
                            data.forEach((dataItem, index, data) => {
                                data[index].value = eval(`${data[index].value} ${dataObj.operator} ${operandValue}`);
                            });
                            return [data, parser.getRawDimensions()];
                        });
                    }
                } else {
                    return [data, parser.getRawDimensions()];
                }
            })
        });
        Promise.all(dataPromises).then((sdmxObjs) => {
            sdmxObjs.forEach((sdmxObj) => {
                const data = sdmxObj[0];
                const dimensions = sdmxObj[1];

                titleObj = parseTextExpr(config.Title, dimensions);
                subTitleObj = parseTextExpr(config.Subtitle, dimensions);

                // check if xAxisConcept exists in data
                if(config.xAxisConcept && config.xAxisConcept != 'MULTI') {
                    const xAxisDimension = dimensions.find((dimension:any) => dimension.id == config.xAxisConcept);
                    if(!xAxisDimension) {
                        throw new Error(`xAxisConcept ${config.xAxisConcept} not found in dataflow`);
                    }
                }
                // check if legendConcept exists in dataFlow
                if(config.legendConcept && config.legendConcept != 'MULTI') {
                    const legendDimension = dimensions.find((dimension:any) => dimension.id == config.legendConcept);
                    if(!legendDimension) {
                        throw new Error(`legendConcept ${config.legendConcept} not found in dataflow`);
                    }
                }

                let xAxisConcept = config.xAxisConcept;
                let legendConcept = config.legendConcept;

                if(chartType == 'line') {
                    // in case xAxisConcept is empty, we use TIME_PERIOD
                    xAxisConcept = config.xAxisConcept || 'TIME_PERIOD';
                    // in case legendConcept is empty, we use the first dimension which is not TIME_PERIOD
                    legendConcept = config.legendConcept || dimensions.find((dimension:any) => dimension.id != 'TIME_PERIOD')['id']
                    // for (multiple) line charts, we create multiple series for each legendConcept dimension values and using xAxisConcept as the x-axis dimension
                    // TODO in case any other dimension has multiple values, we fix them to their latest value and display a select field to change their value.
                    let serieDimensions = dimensions.find((dimension:any) => dimension.id == legendConcept);
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
                } else if(chartType == 'drilldown') {
                    // TODO
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
                            ...val,
                            y: val["value"],
                            name: xAxisConcept?val[xAxisConcept]:val[config.legendConcept],
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

                    // append data to the serie
                    if(seriesData.length == 0) {
                        seriesData = [{
                            name: titleObj.text,
                            data: yAxisValue,
                        },];
                    } else {
                        seriesData[0].data.push(...yAxisValue);
                    }
                }
            });
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
        })
    }, [config]);

    return (
        <HighchartsReact
          highcharts={Highcharts}
          options={hcOptions}
        />
    )
}

export default Chart;
