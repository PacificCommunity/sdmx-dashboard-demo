'use client';

import React, { useRef, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Spinner } from 'react-bootstrap';
import Chart from '@/app/components/chart';


export default function Page({ params }: { params: { dashfile: string } }) {

  const [ready, setReady] = useState(false)

  const [chartId, setChartId] = useState('chart-1')
  const [dashConfig, setDashConfig] = useState([])
  const [chartConfig, setChartConfig] = useState({})

  const loadJsonFile = async (filename: string) => {
    const res = await fetch(`/api/config/${filename}`)

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

    return (
      <div key={`container-${chartId}`} className="container-fluid">
        <div className="text-center my-3">
          <Form.Select size='lg'
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                const value = parseInt(event.target.value);
                setChartConfig(dashConfig[value]);
              }}
          >
            {
              dashConfig.map((option, index) => (
                <option key={`option-${index}`} value={index}>{option.Title.split(',')[0]}</option>
              ))
            }
          </Form.Select>
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
        {
          ready ? (
            renderVisual()
          ) : (
            <div className='text-center align-middle my-3'>
              <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )
        }
      </div>
    </main>
  )
}
