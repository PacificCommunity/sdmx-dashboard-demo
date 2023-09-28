'use client';

import React, { useState } from 'react';
import Title from '@/app/components/title';
import Value from '@/app/components/value';
import Chart from '@/app/components/chart';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Return div/col with component corresponding to chart type
 * 
 * @todo create component with type = VALUE
 * 
 * @param config Dashboard element configuration
 * @param loadedCallback set to true when ready
 * @returns 
 */
const Cell = ({ config, loadedCallback }: {config: any, loadedCallback: any}) => {

    const [ready, setReady] = useState(false)

    const conditionalBoardComponent = () => {

        switch (config.chartType) {
            case 'BARS':
            case 'LINES':
            case 'DRILLDOWN':
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
            case 'VALUE':
                return <Value
                    config={config}
                    loadedCallback={loadedCallback}
                />
            default:
                return <p className="text-danger">[{config.chartType}]<br />{config.Title}</p>
        }

    }

    const fallbackRender = ({ error, resetErrorBoundary }: {error: any, resetErrorBoundary: any}) => {
        return (
            <div className="text-danger">
                <p>Something went wrong:</p>
                <pre style={{ color: "red" }}>{error.message}</pre>
            </div>
        )
    }


    return (
        <ErrorBoundary
            fallbackRender={fallbackRender}
            onReset={() => {}}
        >
            <div className={`${config.className} bg-light`}>
                {conditionalBoardComponent()}
            </div>

        </ErrorBoundary>
    )
}

export default Cell;