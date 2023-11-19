import Cell from '@/app/components/cell';
import { loadDashboardConfig } from '@/app/utils/loadDashboardConfig';
import { loadDashboards } from '@/app/utils/loadDashboards'

import Offbar from "@/app/components/navigation/offbar"

export default async function Page({ params }: { params: { dashfile: string } }) {

    const dashboards = await loadDashboards()

    // declare pageData type
    type pageDataType = {
        dashId: string,
        dashConfig: Array<any>
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

    const loadAndParse = async (fileId: string): Promise<pageDataType> => {

        const data = await loadDashboardConfig(fileId)

        let layout = new Array()
        let row = -1
        data.Rows.forEach((element: {
            Row: number;
            chartType: string;
            className?: string;
            colorScheme?: string;
        }) => {
            if (element.Row !== row) {
                row = element.Row
                layout[row] = new Array()
            }
            element.className = parseColSize(element.chartType)
            element.colorScheme = element.chartType.split(',')[2]?.trim()
            element.chartType = element.chartType.split(',')[0]
            layout[row].push(element)
        })

        // return pageDataType object
        return {
            dashId: data.dashID,
            dashConfig: layout
        }

    }

    const pageData: pageDataType = await loadAndParse(params.dashfile);

    return (
        <>
            <Offbar dashboards={dashboards} />
            <div id="page-content-wrapper">
                <div key={`container-${pageData.dashId}`} className="container-fluid mt-2">
                    {
                        pageData.dashConfig.map((row, index) => (
                            <div key={`row-${index}`} className="row mb-3 display-flex">
                                {
                                    row.map((element: any, index: string) => (
                                        <Cell key={`col-${index}`} config={element} />
                                    )
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )

}
