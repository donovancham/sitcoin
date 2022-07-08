import React, { useState, useEffect } from 'react'
import { Container, Row, Button } from 'react-bootstrap'
import { connectSamurai } from './PlatonWeb3'
import { useRouter } from 'next/router'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import Web3 from 'web3'

export default function Wallet() {
    var web3;
    const router = useRouter()
    const [account, setAccount] = useState()
    const [network, setNetwork] = useState()

    // Run this whenever the site something in dependency array is changed
    // Dependency array currently has accounts and network set as dependency
    useEffect(() => {
        // Ensure that PlatON provider is detected
        if (typeof window.platon === 'undefined') {
            Report.info(
                'Please Install Samurai',
                'Samurai Wallet is required to connect with the SIT Metaverse.',
                'Install Samurai',
                () => {
                    router.push('https://devdocs.platon.network/docs/en/Samurai_user_manual#installation')
                }
            )
        }
        else {
            // Initiate web3 connection
            web3 = new Web3(platon)
        }

    }, [account])

    return (
        <Container>
            {/* Error Alert message that will pop-up when install fails */}
            <h2>PlatON Wallet</h2>
            <Button variant="primary" size="md" onClick={async () => {
                // Ensure that samurai connected
                let result = await connectSamurai(web3)
                if (result !== false) {
                    Notify.success('Connected to SIT Metaverse')
                    // Sets wallet account
                    setAccount(result)
                }
                else {
                    Notify.failure('Please allow permissions from wallet to connect account.')
                }
            }}>
                Connect Wallet
            </Button>
            <p>Your Address: {account}</p>
        </Container>
    )
}