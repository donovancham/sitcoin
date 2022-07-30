import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { connectSamurai, useWalletContext } from '../context/WalletContext';
import NftMarketContext, { useNftMarketContext } from '../context/NFTMarketContext';

export default function Marketplace() {
    const { account, setAccount, web3 } = useWalletContext()

    const {
        nftMarketContract,
        allMarketItems,
        allMarketItemsCount,
        unsoldItems,
        unsoldItemsCount,
        totalMarketItems,
        totalNftCount,
        myOwnedNfts,
        myOwnedNftCount,
        myNftCreations,
        myCreationCount,
    } = useNftMarketContext()

    function viewAllMarketItems() {
        const title = 'All Items'

        // Check if there are any items on the market currently
        if (allMarketItemsCount == 0) {
            return tabNavElement(title, allMarketItemsCount)
        }
        else {
            return (
                <Container fluid>
                    {tabNavElement(title, allMarketItemsCount)}
                </Container>
            )
        }
    }

    function viewUnsoldItems() {
        const title = 'Unsold Items'

        // Check if there are any items on the market currently
        if (unsoldItemsCount == 0) {
            return tabNavElement(title, unsoldItemsCount)
        }
        else {
            return (
                <Container fluid>
                    {tabNavElement(title, unsoldItemsCount)}
                </Container>
            )
        }
    }

    function viewMyNfts() {
        const title = 'My NFTs'

        // Check if there are any items on the market currently
        if (myOwnedNftCount == 0) {
            return tabNavElement(title, myOwnedNftCount)
        }
        else {
            return (
                <Container fluid>
                    {tabNavElement(title, myOwnedNftCount)}
                </Container>
            )
        }
    }

    function viewMyCreations() {
        const title = 'My Creations'

        // Check if there are any items on the market currently
        if (myCreationCount == 0) {
            return (
                <Container fluid>
                    {tabNavElement(title, myCreationCount)}
                    <Row className='justify-content-md-center'>
                        <Col md='auto'>
                            <Button variant='primary' size='lg' onclick={'a'}>Create NFT</Button>
                        </Col>
                    </Row>
                </Container>
            )
        }
        else {
            return (
                <Container fluid>
                    {tabNavElement(title, myCreationCount)}
                    <Row className='justify-content-md-center'>
                        <Col md='auto'>
                            <Button variant='primary' size='lg' onclick={'a'}>Create NFT</Button>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }

    return (
        <NftMarketContext>
            <Container>
                <Tabs
                    defaultActiveKey="allMarketItems"
                    id="nft-marketplace"
                    className="mb-3"
                    fill
                >
                    {/* View all Market items tab */}
                    <Tab eventKey="allMarketItems" title="All Listings">
                        {account ? viewAllMarketItems() : 'Please click Connect Button to refresh'}
                    </Tab>
                    {/* View all unsold items tab */}
                    <Tab eventKey="unsoldItems" title="Unsold Listings">
                        {account ? viewUnsoldItems() : 'Please click Connect Button to refresh'}
                    </Tab>
                    {/* View my owned NFTs tab */}
                    <Tab eventKey="myNFTs" title="My NFTs">
                        {account ? viewMyNfts() : 'Please click Connect Button to refresh'}
                    </Tab>
                    {/* View my creations tab */}
                    <Tab eventKey="myCreations" title="My Creations">
                        {account ? viewMyCreations() : 'Please click Connect Button to refresh'}
                    </Tab>
                </Tabs>
            </Container>
        </NftMarketContext>
    )
}

const tabNavElement = (title, count) => {
    return (
        <Container fluid>
            <div className='px-4 py-5 my-5 text-center'>
                <h1 className='display-5 fw-bold'>{title}</h1>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">
                        Current Item Count: {count}
                    </p>
                </div>
            </div>
        </Container>
    )
}