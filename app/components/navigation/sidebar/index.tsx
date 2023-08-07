"use client"

import React, { useState } from "react";
import Link from "next/link";
// import Logo from "./Logo";
// import Button from "./Button";

const Sidebar = () => {

    const [sideToggle, setSideToggle] = useState(false)

    const handleClick = () => {
        setSideToggle(!sideToggle)
    }

    return (
        <div className={`border-end bg-white ${sideToggle?'sb-sidenav-toggled':''}`} id="sidebar-wrapper">
            <button onClick={handleClick}>Toggle</button>
            <div className="sidebar-heading border-bottom bg-light">
                Dashboards
            </div>
            <div className="list-group list-group-flush">
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Dashboard</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Shortcuts</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Overview</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Events</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Profile</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Status</a>
            </div>
        </div>
    )
}

export default Sidebar