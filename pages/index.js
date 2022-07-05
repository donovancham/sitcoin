import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import Link from 'next/link'
import { Col, Row, Button } from 'react-bootstrap'
import Web3 from 'web3'

export default function Index() {
    const [account, setAccount] = useState()
    const [address, setAddress] = useState()

    useEffect( () => {
        // Load Account everytime
        async function loadAccounts() {
            const web3 = new Web3(Web3.givenProvder || 'wss://devnetopenapi2.platon.network/ws')
            const accounts = await Web3.eth.requestAccounts()

            setAccount[accounts[0]]
        }

        loadAccounts()
        
    }, [account])


    return (
        <React.Fragment>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h1>SIT Metaverse</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Account: {account}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button className="center" variant="primary" size="lg" active>
                        Connect Wallet
                    </Button>{' '}
                </Col>
            </Row>
        </React.Fragment>
    )
}