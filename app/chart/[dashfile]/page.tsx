'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import Chart from '@/pages/component/chart';


export default function Page({ params }: { params: { dashfile: string } }) {

  const [ready, setReady] = useState(false)

  const [chartId, setChartId] = useState('chart-1')
  const [dashConfig, setDashConfig] = useState([])
  const [chartConfig, setChartConfig] = useState({})

  const loadJsonFile = async (filename: string) => {
    const res = await fetch(`/uploads/${filename}`)

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return await res.json()
}

  useEffect(() => {
    loadJsonFile(params.dashfile).then((data) => {
      const filteredConfig = data.Rows.filter(( row: { Data: null; } ) => {
        // filter out charts not supported
        return /^(BARS|PIE|LINES)/.test(row.chartType)
      });
      setDashConfig(filteredConfig)
      setChartConfig(filteredConfig[0])
      setReady(true)
    });
  }, [])

  const renderVisual = () =>  {

    const selectOptions = dashConfig.map((config, index) => ({
      value: index,
      label: config.Title.split(',')[0]
    }));

    const defaultChartIndex = 0;

    return (
      <div key={`container-${chartId}`} className="container-fluid">
        <div className="text-center my-3">
          <Select
              defaultValue={defaultChartIndex}
              style={{ width: 420 }}
              options={selectOptions}
              onChange={(value: number) => {
                setReady(false);
                setChartConfig(dashConfig[value]);
              }}
            />
        </div>
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
