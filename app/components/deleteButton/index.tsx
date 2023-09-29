"use client"

import React from 'react'

import { confirmAlert } from 'react-confirm-alert'

import { Trash } from 'react-bootstrap-icons'

import './styles.custom.css'

const DeleteButton = ({ uri }: { uri: string }) => {

    const confirmDelete = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: `Are you sure to delete ${uri} ?`,
            buttons: [
                {
                    label: 'Yes, delete it!',
                    className: 'btn btn-danger',
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
        }
    }

    return (
        <button
            className='btn btn-danger btn-sm float-end'
            onClick={confirmDelete}
        >
            <Trash />
        </button>
    )

}

export default DeleteButton;