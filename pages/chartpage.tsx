'use client';

import { NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { useState } from 'react';
import { SDMXParser } from 'sdmx-json-parser';
import Chart from '@/pages/component/chart';


const ChartPage: NextPage = () => {

  const [chartType, setChartType] = useState('bar')
  const [title, setTitle] = useState('Status in employment {$TIME_PERIOD}, [DIN, 15, Bold, Italics, LEFT]')
  const [unitLoc, setUnitLoc] = useState('hidden')
  const [decimals, setDecimals] = useState(0)
  const [labelsYN, setLabelsYN] = useState(true)
  const [legendConcept, setLegendConcept] = useState('')
  const [legendLoc, setLegendLoc] = useState('HIDE')
  const [xAxisConcept, setXAxisConcept] = useState('STE')
  const [yAxisConcept, setYAxisConcept] = useState('OBS_VALUE')
  const [downloadYN, setDownloadYN] = useState('')
  const [url, setUrl] = useState('https://www.ilo.org/sdmx/rest/data/ILO,DF_EMP_TEMP_SEX_AGE_STE_NB,1.0/CHL.A..SEX_T.AGE_YTHADULT_YGE15.STE_ICSE93_6+STE_ICSE93_5+STE_ICSE93_4+STE_ICSE93_3+STE_ICSE93_2+STE_ICSE93_1?endPeriod=2022&lastNObservations=1')

  const [ready, setReady] = useState(false)

  const [chartId, setChartId] = useState('chart-1')

  const [hcOptions, setHcOptions] = useState({})


  const renderVisual = () =>  {
    console.log("rendering");

    const chartConfig = {
      chartType: 'bar',
      Title: 'Status in employment {$TIME_PERIOD}, [DIN, 14, Bold, Italics, LEFT]',
      Subtitle: '',
      Unit: '',
      unitLoc: 'HIDE',
      Decimals: 0,
      LabelsYN: true,
      legendConcept: '',
      legendLoc: 'HIDE',
      xAxisConcept:  'STE',
      yAxisConcept: 'OBS_VALUE',
      downloadYN: '',
      dataLink: '',
      metadataLink: '',
      DATA: "https://www.ilo.org/sdmx/rest/data/ILO,DF_EMP_TEMP_SEX_AGE_STE_NB,1.0/CHL.A..SEX_T.AGE_YTHADULT_YGE15.STE_ICSE93_6+STE_ICSE93_5+STE_ICSE93_4+STE_ICSE93_3+STE_ICSE93_2+STE_ICSE93_1?endPeriod=2022&lastNObservations=1"
    }


    return (
      <div key={`container-${chartId}`}>
        <Chart
          config={chartConfig}
          loadedCallback={(state: boolean) => setReady(state)}
        />
          {/* <HighchartsReact
            highcharts={Highcharts}
            options={hcOptions}
          /> */}
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative place-items-center ">

        <Spin key={`loader`} spinning={!ready}>
          {renderVisual()}
        </Spin>
      </div>
    </main>
  )
}

export default ChartPage;