'use client';

import React, { useState } from 'react';
import Title from '@/app/components/title';
import Chart from '@/app/components/chart';

/**
 * Return div/col with component corresponding to chart type
 * 
 * @todo create component with type = VALUE
 * 
 * @param config Dashboard element configuration
 * @param loadedCallback set to true when ready
 * @returns 
 */
const Cell = ({ config, loadedCallback }) => {

    const [ready, setReady] = useState(false)

    const conditionalBoardComponent = () => {

        switch (config.chartType) {
            case 'BARS':
            case 'LINES':
            case 'PIE':
                return <Chart
                    config={config}
                    loadedCallback={loadedCallback}
                />
            case 'TITLE':
            case 'FOOTER':
                return <Title
                    config={config}
                    loadedCallback={loadedCallback}
                />
            default:
                return <p className="text-danger">[{config.chartType}]<br />{config.Title}</p>
        }

    }

    return (
        <div className={`${config.className} bg-light border`}>
            {conditionalBoardComponent()}
        </div>
    )
}

export default Cell;