"use client"

import React, { useState } from "react";
import Link from "next/link";
// import { CaretLeftFill, CaretRightFill } from 'react-bootstrap-icons'
// import Logo from "./Logo";
// import Button from "./Button";

const Sidebar = () => {

    const [sideToggle, setSideToggle] = useState(false)

    const handleClick = () => {
        setSideToggle(!sideToggle)
    }

    return (
        <div className={`border-end bg-white ${sideToggle?'sb-sidenav-toggled':''}`} id="sidebar-wrapper">
            <button onClick={handleClick}></button>
            <div className="sidebar-heading border-bottom bg-light">
                Dashboards
            </div>
            <div className="list-group list-group-flush">
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/chartpage">Example 1</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/chartpage">Example 2</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/chartpage">Example 3</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/chartpage">Example 4</a>
                <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/chartpage">Example 5</a>
            </div>
        </div>
    )
}

export default Sidebar