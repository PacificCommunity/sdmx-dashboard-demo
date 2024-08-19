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
                                <DashboardWrapper className="mt-3" uri={dashfound.raw} />
                                <hr className="my-4" />
                                <dl>
                                    <dt>Config file</dt>
                                    <dd><a href={`${dashfound.raw}`} target="_blank">{dashfound.uri}</a></dd>
                                    <dt>Last update</dt>
                                    <dd>{dashfound.date.toString()}</dd>
                                    <dt>React Component</dt>
                                    <dd>
                                        <pre>
                                            &lt;SDMXDashboard url={`{"${dashfound.raw}"}`} /&gt;
                                        </pre>
                                    </dd>
                                </dl>
                            </>
                        ) : (
                            <p className="text-danger">Dashboard config not found</p>
                        )}
                    </div>

                </div>
            </div >
        </>
    )

}
