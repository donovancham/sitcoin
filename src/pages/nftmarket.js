import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'
import Marketplace from '../components/Marketplace'
import NftMarketContext from '../context/NFTMarketContext'
import { connectSamurai } from '../context/WalletContext'

export default function Index() {
    return (
        <Layout>
            {/* main app container */}
            <div className="jumbotron p-4">
                <div className="container text-center">
                    <h1 className='display-1'>NFT Market</h1>
                </div>
            </div>

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