"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Spinner from 'react-bootstrap/Spinner';


const Sidebar = () => {

    const [sideToggle, setSideToggle] = useState(false)
    const [sideLoading, setSideLoading] = useState(true)
    const [sideList, setSideList] = useState([])

    const getJsonFiles = async () => {
        const res = await fetch('/api/listfiles')

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
        <div className={`border-end bg-white ${sideToggle ? 'sb-sidenav-toggled' : ''}`} id="sidebar-wrapper">
            <button onClick={handleClick}></button>
            <div className="sidebar-heading border-bottom bg-light">
                Dashboards
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
                                <Link key={item.path} href={`/chart/${item.path}`} className="list-group-item list-group-item-action list-group-item-light p-3">
                                    {item.name}
                                </Link>
                            )
                            )
                        ) : (
                            <div className="list-group-item text-center py-4 text-muted">No YAML file found</div>
                        )
                    )
                }
            </div>
        </div>
    )
}

export default Sidebar