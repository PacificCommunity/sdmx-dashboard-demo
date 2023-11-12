"use client"

import React from "react";

import { dashboards, dashboardsLoading } from "../offbar";

import Link from "next/link";
import Spinner from 'react-bootstrap/Spinner';
import { SlashCircle, ClipboardData, PlusCircleDotted, CodeSlash } from 'react-bootstrap-icons';

import DeleteButton from '@/app/components/deleteButton'

const Homebar = () => {

    return (
        <div className="list-group list-group-flush">
            {
                dashboardsLoading.value ? (
                    <div className="list-group-item text-center py-4 opacity-25">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (dashboards.value.length > 0 ?
                    (
                        dashboards.value.map((item: any) => (
                            <div className='list-group-item list-group-item-action p-3' key={item.uri}>
                                <Link
                                    href={`/chart/${item.uri}`}
                                    title={`Last updated on ${new Date(item.date).toString()}`}
                                    className=''
                                >
                                    <ClipboardData className="me-2" />{item.name}
                                </Link>
                                <DeleteButton uri={item.uri} />
                                <Link
                                    href={`/api/yaml/${item.uri}`}
                                    target='_blank'
                                    className='btn btn-info btn-sm float-end me-2'
                                >
                                    <CodeSlash />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="list-group-item text-center py-4 text-muted"><SlashCircle className="me-2" />No YAML file found</div>
                    )
                )
            }
            <Link
                href='/upload'
                className='list-group-item list-group-item-action p-3'
            >
                <PlusCircleDotted className="me-2" />Upload new file
            </Link>
        </div>
    )

}

export default Homebar