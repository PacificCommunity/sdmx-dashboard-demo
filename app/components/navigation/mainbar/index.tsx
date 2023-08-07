"use client"

import React from "react";
import { Container, Navbar } from "react-bootstrap"

const Mainbar = () => {
    return (
        <Navbar bg="light">
            <Container className="justify-content-center">
                <Navbar.Brand href="/">Dashboard Creator</Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default Mainbar