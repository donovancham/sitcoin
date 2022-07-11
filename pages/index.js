import React, { useState, useEffect } from 'react'
import { Link } from 'next/link'
import { Col, Row } from 'react-bootstrap'
import Wallet from '../components/Wallet'
import Layout from '../components/Layout'
import WalletContext from '../context/WalletContext'

export default function Index() {
    return (
        <Layout>
            {/* main app container */}
            <div className="jumbotron p-4">
                <div className="container text-center">
                    <h1>SIT Metaverse</h1>
                </div>
            </div>
            <WalletContext>
                <Wallet />
            </WalletContext>
            {/* <IpfsComponent /> */}
        </Layout>
    )
}