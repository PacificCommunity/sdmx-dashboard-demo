"use client"

import React, { useState } from 'react'
import { useRouter } from "next/navigation";

import { confirmAlert } from 'react-confirm-alert'

import { Trash } from 'react-bootstrap-icons'
import Spinner from 'react-bootstrap/Spinner';

import './styles.custom.css'

const DeleteButton = ({ uri }: { uri: string }) => {

    const [btnState, setBtnState] = useState(true);

    const confirmDelete = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: `Are you sure to delete ${uri} ?`,
            buttons: [
                {
                    label: 'Yes, delete it!',
                    className: 'btn btn-danger' + (btnState ? '' : 'disabled'),
                    onClick: () => onConfirm()
                },
                {
                    label: 'No, keep it.',
                    className: 'btn btn-secondary'
                }
            ]
        });
    }

    const onConfirm = async () => {
        setBtnState(false);
        await deleteDashboard(uri)
    }

    const deleteDashboard = async (uri: string) => {
        const response = await fetch(`/api/yaml/${uri}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            window.location.reload()
        } else {
            alert('Could not delete dashboard');
        }
    }

    return (
        <button
            className={`btn btn-danger btn-sm float-end ${btnState ? '' : 'disabled'}`}
            onClick={confirmDelete}
        >
            {btnState ? <Trash /> : <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Deleting...</span>
            </Spinner>}
        </button>
    )

}

export default DeleteButton;