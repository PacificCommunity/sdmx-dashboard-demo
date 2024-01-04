import { loadDashboards } from '@/app/utils/loadDashboards'

import Offbar from "@/app/components/navigation/offbar"

import DashboardWrapper from "@/app/components/dashboardWrapper"

export default async function Page({ params }: { params: { dashfile: string } }) {

    const dashboards = await loadDashboards()

    const dashsearch = dashboards.filter((item: any) => item.name === params.dashfile)

    const dashfound = dashsearch.length > 0 ? dashsearch[0] : false

    return (
        <>
            <Offbar dashboards={dashboards} />
            <div id="page-content-wrapper">
                <div className="container-fluid mt-5 mt-sm-0">
                    <div className="p-1 p-md-3">
                        <h2>{params.dashfile} dashboard</h2>
                        {dashfound ? (
                            <>
                                <p>Last update: {dashfound.date.toString()}</p>
                                <p>Link to config file: <a href={`${dashfound.raw}`} target="_blank">{dashfound.raw}</a></p>
                                <h4>HTML</h4>
                                <pre>
                                    &lt;div
                                    class=&quot;sdmx-dashboard-react&quot;
                                    data-url=&quot;{dashfound.raw}&quot;&gt;&lt;/div&gt;
                                </pre>
                                <h4>React</h4>
                                <pre>
                                    &lt;SDMXDashboard dashUrl={`{${dashfound.raw}}`} /&gt;
                                </pre>
                            </>
                        ) : (
                            <p className="text-danger">Dashboard config not found</p>
                        )}
                    </div>
                    <DashboardWrapper className="mt-3" uri={dashfound.raw} />
                </div>
            </div >
        </>
    )

}
