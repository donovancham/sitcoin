import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import Wallet from '../components/Wallet'
import Layout from '../components/Layout'


export default function Index() {

    return (
        <Layout>
            {/* main app container */}
            <div className="jumbotron p-4">
                <div className="container text-center">
                    <h1>SIT Metaverse</h1>
                </div>
            </div>
            <Wallet />
        </Layout>
    )
}