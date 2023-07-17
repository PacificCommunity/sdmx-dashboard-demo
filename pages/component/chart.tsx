import { HighchartsReact } from "highcharts-react-official";
import * as Highcharts from 'highcharts';
import { useEffect, useState } from "react";
import { SDMXParser } from 'sdmx-json-parser';

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

    const processTitleExpr = (titleExpr: string, dimensions: any) => {
        const titleTextExpr = titleExpr.split(',')[0];
        const titleStylesExpr = titleExpr.split(',')[1];
        let titleObj:any = {};
        if(titleStylesExpr) {
            const titleStyles = titleExpr.split('[')[1].split(']')[0].split(',');
            if(titleStyles.length != 5) {
                throw new Error('Invalid title style expression for row');
            }
            titleObj['style'] = {
                fontType: titleStyles[0],
                fontSize: titleStyles[1],
                fontWeight: titleStyles[2],
                fontTransform: titleStyles[3],
                fontLocation: titleStyles[4]
            }
        }
        let titleText = titleTextExpr;
        for (const match of titleTextExpr.matchAll(/\{\$([^{}]*)\}/g)) {
            const dim = dimensions.find((dimension:any) => dimension.id == match[1]);
            titleText = titleText.replace(match[0], dim.values[0].name);
        }
        titleObj['text'] = titleText;
        return titleObj;
    }


    useEffect(() => {
        const url = config.DATA;
        const xAxisConcept = config.xAxisConcept;
        const chartType = config.chartType;

        sdmxParser.getDatasets(url).then((dataset: any) => {
            console.log(dataset);
            const data = sdmxParser.getData();
            const rawDimensions = sdmxParser.getRawDimensions();
            const rawDimensionValues = {};
            rawDimensions
                .filter((rawDimension: any) => rawDimension.values.length === 1)
                .forEach((rawDimension: any) => {
                rawDimensionValues[rawDimension.id] =
                    rawDimension.values[0].name;
                });

            const sortedData = sortByDimensionName(data, xAxisConcept);
            const xAxisValue = sortedData.map((val: any) => {
                return val[xAxisConcept];
            });
            const yAxisValue = sortedData.map((val: any) => {
                return {
                ...rawDimensionValues,
                ...val,
                y: val["value"],
                };
            });
            const titleObj = processTitleExpr(config.Title, rawDimensions);
            const seriesData = [{
                name: titleObj.text,
                data: yAxisValue,
            },];
            loadedCallback(true);
            setHcOptions({
                chart: {
                type: chartType,
                },
                title: {
                    text: titleObj.text,
                },
                xAxis: {
                    categories: xAxisValue
                },
                series: seriesData
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