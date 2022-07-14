import React, { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import Wallet from '../components/Wallet'
import WalletContext from '../context/WalletContext'
import Ipfs from '../components/Ipfs'
import IpfsContext from '../context/IpfsContext'

export default function Index() {
    return (
        <Layout>
            {/* main app container */}
            <div className="jumbotron p-4">
                <div className="container text-center">
                    <h1>SIT Metaverse</h1>
                </div>
            </div>
            {/* <WalletContext>
                <Wallet />
            </WalletContext> */}
            {/* <IpfsContext>
                <Ipfs />
            </IpfsContext> */}
            {/* <IpfsComponent /> */}
        </Layout>
    )
}