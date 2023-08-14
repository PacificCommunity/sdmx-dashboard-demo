'use client';

import React, { useRef, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Spinner } from 'react-bootstrap';
import Cell from '@/app/components/cell';


export default function Page({ params }: { params: { dashfile: string } }) {

  const [ready, setReady] = useState(false)

  const [dashId, setDashId] = useState('dashboard-1')
  const [dashConfig, setDashConfig] = useState([])
  const [dashLayout, setDashLayout] = useState([])
  const [chartConfig, setChartConfig] = useState({})

  const loadJsonFile = async (filename: string) => {
    const res = await fetch(`/api/config/${filename}`)

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }

    return await res.json()
  }

  const parseColSize = (chartExpr: string) => {
    let chartType = chartExpr.split(',')[0]
    if (chartType == 'TITLE' || chartType == 'FOOTER') {
      // Title and Footer are full width (3 columns)
      return 'col-12'
    }
    try {
      const colSize = chartExpr.split(',')[1].trim().toUpperCase();
      switch (colSize) {
        case 'DOUBLE':
          return 'col-12 col-md-8'
          break;
        case 'TRIPLE':
          return 'col-12'
          break;
        case 'SINGLE':
        default:
          return 'col-12 col-md-4'
          break;
      }
    } catch (e) { }
    // single by default
    return 'col-12 col-md-4'
  }

  useEffect(() => {
    loadJsonFile(params.dashfile).then((data) => {
      let layout = new Array()
      let row = -1
      data.Rows.forEach((element: {
        Row: number;
        chartType: string;
        className?: string;
      }) => {
        if (element.Row !== row) {
          row = element.Row
          layout[row] = new Array()
        }
        element.className = parseColSize(element.chartType)
        element.chartType = element.chartType.split(',')[0]
        layout[row].push(element)
      })
      setDashId(data.dashID)
      setDashConfig(layout)
      console.log(layout)
      setReady(true)
    });
  }, [])

  const renderVisual = () => {

    return (
      <div key={`container-${dashId}`} className="container-fluid">
        {
          dashConfig.map((row, index) => (
            <div key={`row-${index}`} className="row">
              {
                row.map((element, index) => (
                  <Cell key={`col-${index}`} config={element} loadedCallback={(state: boolean) => setReady(state)} />
                )
                )
              }
            </div>
          ))
        }
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
