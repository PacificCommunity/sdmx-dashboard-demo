"use client"

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { SlashCircle, ClipboardData, PlusCircleDotted } from 'react-bootstrap-icons';

const Offbar = ({ dashboards }: any) => {

    const [show, setShow] = useState(false);
    const [sideLoading, setSideLoading] = useState(true)
    const [sideList, setSideList] = useState([])

    const currentRoute = usePathname()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        setSideList(dashboards)
        setSideLoading(false)
    }, [dashboards])

    return (
        <>
            <Button variant="link" onClick={handleShow} className="menu-button py-1 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
            </Button>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title><Link href="/" onClick={handleClose}>Dashboards</Link></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
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
                                    sideList.map((item: any) => (
                                        <Link
                                            key={item.uri}
                                            href={`/chart/${item.uri}`}
                                            title={`Last updated on ${new Date(item.date).toString()}`}
                                            onClick={handleClose}
                                            className={`list-group-item list-group-item-action p-3 ${currentRoute == '/chart/' + item.uri ? 'active' : ''}`}
                                            prefetch={false}
                                        >
                                            <ClipboardData className="me-2" />{item.name}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="list-group-item text-center py-4 text-muted"><SlashCircle className="me-2" />No JSON file found</div>
                                )
                            )
                        }
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}


export default Offbar