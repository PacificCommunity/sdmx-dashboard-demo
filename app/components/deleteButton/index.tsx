'use client';

import React from 'react';

import { Trash } from 'react-bootstrap-icons';

const DeleteButton = ({ uri }: { uri: string }) => {

    const confirmDelete = () => {
        if (window.confirm('Are you sure you want to delete this dashboard?')) {
            onConfirm();
        } else {
            onAbort();
        }
        
    }

    const onConfirm = async () => {
        await deleteDashboard(uri)
    }

    const onAbort = () => {
        // nothing
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