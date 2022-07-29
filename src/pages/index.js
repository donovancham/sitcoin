import React, { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import Wallet from '../components/Wallet'
import Ipfs from '../components/Ipfs'
import IpfsContext from '../context/IpfsContext'
import Marketplace from '../components/Marketplace'
import NftMarketContext from '../context/NFTMarket'

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
            <NftMarketContext>
                <Marketplace />
            </NftMarketContext>
            {/* <IpfsContext>
                <Ipfs />
            </IpfsContext> */}
            {/* <IpfsComponent /> */}
        </Layout>
    )
}