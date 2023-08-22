"use client"

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Spinner from 'react-bootstrap/Spinner';


const Sidebar = () => {

    const [sideToggle, setSideToggle] = useState(false)
    const [sideLoading, setSideLoading] = useState(true)
    const [sideList, setSideList] = useState([])

    const currentRoute = usePathname()

    const getJsonFiles = async () => {
        const res = await fetch('/api/config')

        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }

        return await res.json()
    }

    useEffect(() => {
        getJsonFiles().then((data) => {
            setSideList(data)
            setSideLoading(false)
        });

    }, [])

    const handleClick = () => {
        setSideToggle(!sideToggle)
    }

    return (
        <div className={`border-end text-light bg-dark ${sideToggle ? 'sb-sidenav-toggled' : ''}`} id="sidebar-wrapper">
            <button onClick={handleClick}></button>
            <div className="sidebar-heading border-bottom border-secondary">
                <Link href="/">Dashboards</Link>
            </div>
            <div className="list-group list-group-flush">
                {
                    sideLoading ? (
                        <div className="list-group-item text-center py-4 opacity-25">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (sideList.length > 0 ?
                        (
                            sideList.map((item) => (
                                <Link
                                    key={item.uri}
                                    href={`/chart/${item.uri}`}
                                    title={`Last updated on ${new Date(item.date).toString()}`}
                                    className={`list-group-item list-group-item-action p-3 ${currentRoute == '/chart/'+item.uri?'active':''}`}
                                >
                                    {item.name}
                                </Link>
                            )
                            )
                        ) : (
                            <div className="list-group-item text-center py-4 text-secondary">No YAML file found</div>
                        )
                    )
                }
            </div>
        </div>
    )
}

export default Sidebar