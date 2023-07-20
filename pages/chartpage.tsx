'use client';

import { NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import { Select, Spin } from 'antd';
import { useState } from 'react';
import { SDMXParser } from 'sdmx-json-parser';
import Chart from '@/pages/component/chart';


const ChartPage: NextPage = () => {

  const chartConfigs = [{
    chartType: 'BARS',
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
  }, {
    chartType: 'LINES, double',
    Title: 'Participation rates,[DIN, 14, Bold, Italics, CENTER]',
    Subtitle: '',
    Unit: '',
    unitLoc: '',
    Decimals: 0,
    LabelsYN: false,
    legendConcept: 'SEX',
    legendLoc: 'BOTTOM',
    xAxisConcept: 'TIME_PERIOD',
    yAxisConcept: 'OBS_VALUE',
    downloadYN: '',
    dataLink: '',
    metadataLink: '', 
    DATA: "https://www.ilo.org/sdmx/rest/data/ILO,DF_EAP_DWAP_SEX_AGE_RT,1.0/CHL.A..SEX_O+SEX_F+SEX_M+SEX_T.AGE_YTHADULT_YGE15?startPeriod=2010&endPeriod=2022"
  }, {
    chartType: 'PIE',
    Title:  'Employment,[DIN, 14, Bold, Italics, LEFT]',
    Subtitle: '',
    Unit: '%',
    unitLoc: 'SUFFIX',
    Decimals: 0,
    LabelsYN:  'Yes',
    legendConcept: '', 
    legendLoc: 'HIDE',
    xAxisConcept: 'ECO',
    yAxisConcept: '', 
    downloadYN: '',
    dataLink: '',
    metadataLink: '', 
    DATA: 'https://www.ilo.org/sdmx/rest/data/ILO,DF_EMP_TEMP_SEX_ECO_NB,1.0/CHL.A..SEX_T.ECO_SECTOR_X+ECO_SECTOR_SER+ECO_SECTOR_IND+ECO_SECTOR_AGR?endPeriod=2022&lastNObservations=1'
  }, {
    chartType: 'PIE',
    Title:  'Persons outside the labour force by sex',
    Subtitle: '{$TIME_PERIOD}',
    Unit: '%',
    unitLoc: 'SUFFIX',
    Decimals: 0,
    LabelsYN:  'Yes',
    legendConcept: 'SEX',
    legendLoc: 'RIGHT',
    xAxisConcept: null,
    yAxisConcept: null,
    downloadYN: null, 
    dataLink: null,
    metadataLink: null, 
    DATA: 'https://www.ilo.org/sdmx/rest/data/ILO,DF_EIP_TEIP_SEX_AGE_NB,1.0/CHL.A..SEX_F+SEX_M.AGE_AGGREGATE_TOTAL?endPeriod=2022&lastNObservations=1&dimensionAtObservation=AllDimensions'
  }, {
    chartType: 'PIE',
    Title:  'Employment by economic activity',
    Subtitle:  '{$TIME_PERIOD}',
    Unit: '%',
    unitLoc: 'SUFFIX',
    Decimals: 0,
    LabelsYN:  'Yes',
    legendConcept: 'ECO',
    legendLoc: 'HIDE',
    xAxisConcept: null,
    yAxisConcept: null,
    downloadYN: null,
    dataLink: null,
    metadataLink: null,
    DATA: 'https://www.ilo.org/sdmx/rest/data/ILO,DF_EMP_TEMP_SEX_ECO_NB,1.0/CHL.A..SEX_T.ECO_SECTOR_X+ECO_SECTOR_SER+ECO_SECTOR_IND+ECO_SECTOR_AGR?endPeriod=2022&lastNObservations=1'
  }, {
    chartType: 'LINES, double',
    Title: 'Labour Force participation rates',
    Subtitle: null,
    Unit: null,
    unitLoc: null,
    Decimals: 0,
    LabelsYN: 'No',
    legendConcept: 'SEX',
    legendLoc: 'BOTTOM',
    xAxisConcept: 'TIME_PERIOD',
    yAxisConcept: 'OBS_VALUE',
    downloadYN: null,
    dataLink: null,
    metadataLink: null,
    DATA: 'https://www.ilo.org/sdmx/rest/data/ILO,DF_EAP_DWAP_SEX_AGE_RT,1.0/CHL.A..SEX_O+SEX_F+SEX_M+SEX_T.AGE_YTHADULT_YGE15?startPeriod=2010&endPeriod=2022'
  }, {
    chartType: 'BARS',
    Title:  'Status in employment',
    Subtitle:  '{$TIME_PERIOD}',
    Unit: null,
    unitLoc: 'HIDE',
    Decimals: 0,
    LabelsYN: 'Yes',
    legendConcept: null,
    legendLoc: 'HIDE',
    xAxisConcept:  'STE',
    yAxisConcept: 'OBS_VALUE',
    downloadYN: null,
    dataLink: null,
    metadataLink: null,
    DATA: 'https://www.ilo.org/sdmx/rest/data/ILO,DF_EMP_TEMP_SEX_AGE_STE_NB,1.0/CHL.A..SEX_T.AGE_YTHADULT_YGE15.STE_ICSE93_6+STE_ICSE93_5+STE_ICSE93_4+STE_ICSE93_3+STE_ICSE93_2+STE_ICSE93_1?endPeriod=2022&lastNObservations=1'
  }]

  const [ready, setReady] = useState(false)

  const [chartId, setChartId] = useState('chart-1')
  const [chartConfig, setChartConfig] = useState(chartConfigs[0])

  const [hcOptions, setHcOptions] = useState({})


  const renderVisual = () =>  {

    const selectOptions = chartConfigs.map((config, index) => ({
      value: index,
      label: config.Title.split(',')[0]
    }));

    const defaultChartIndex = 0;

    return (
      <div key={`container-${chartId}`}>
        <Select
          defaultValue={defaultChartIndex}
          style={{ width: 420 }}
          options={selectOptions}
          onChange={(value: number) => {
            setReady(false);
            setChartConfig(chartConfigs[value]);
          }}
        />
        <Chart
          config={chartConfig}
          loadedCallback={(state: boolean) => setReady(state)}
        />
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