'use client';

import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Chart from '@/app/components/chart';

const Cell = ({ config, loadedCallback }) => {

    const [ready, setReady] = useState(false)

    return (
        <div className={`${config.className} bg-light`}>
            {(config.chartType == 'BARS' || config.chartType == 'LINES' || config.chartType == 'PIE') ? (

                <Chart
                    config={config}
                    loadedCallback={(state: boolean) => setReady(state)}
                />
            ) : (
                <p>{config.Title}</p>)
            }
        </div>
    )
}

export default Cell;