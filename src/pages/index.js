import React, { useState, useEffect } from 'react'

import Ipfs from '../components/Ipfs'
import IpfsContext from '../context/IpfsContext'
import Marketplace from '../components/Marketplace'
import NftMarketContext from '../context/NFTMarketContext'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import Layout from '../components/Layout'
import Wallet from '../components/Wallet'

export default function Index() {
    return (
        <Layout>
            {/* main app container */}
            <div className="jumbotron p-4">
                <div className="container text-center">
                    <h1 className='display-1'>SIT Metaverse</h1>
                </div>
            </div>

            <Wallet />
            {/* <IpfsContext>
                <Ipfs />
            </IpfsContext> */}
            {/* <IpfsComponent /> */}
        </Layout>
    )
}