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
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DOMPurify from 'isomorphic-dompurify';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

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
        getMarketInfo,
    } = useNftMarketContext()

    const [createNftFormShow, setCreateNftFormShow] = useState(false)
    const [createNftValidated, setCreateNftValidated] = useState(false)

    // Form validation criteria for minting NFT
    const [validated, setValidated] = useState(false);
    const [nftNameValidated, setNftNameValidated] = useState(false);
    const [nftPriceValidated, setNftPriceValidated] = useState(false);

    // Functions for displaying or hiding nft form modal
    const handleCreateNftFormShow = () => setCreateNftFormShow(true)
    const handleCreateNftFormClose = () => setCreateNftFormShow(false)

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

        let content = []
        content.push(
            <Container fluid>
                {tabNavElement(title, myCreationCount)}
                <Row className='justify-content-md-center'>
                    <Col md='auto'>
                        <Button variant='primary' size='lg' onClick={handleCreateNftFormShow}>
                            Create NFT
                        </Button>
                    </Col>
                </Row>
            </Container >
        )

        // Check if there are any items on the market currently
        if (myCreationCount != 0) {
            // Add the cards displaying NFT items
        }

        return content
    }

    function createNft(event) {
        // Prevents page from reloading
        event.preventDefault();

        // Pre-check elements loaded before proceeding
        if (nftMarketContract === undefined) {
            Notify.failure('Please connect wallet before transferring', {
                clickToClose: true
            })
        }
        else {
            const form = event.currentTarget;
            console.log(`Form Valid? ${form.checkValidity()}`)

            const name = DOMPurify.sanitize(document.querySelector('#nftName').value)
            const price = DOMPurify.sanitize(document.querySelector('#nftPrice').value)

            // Prompt confirmation from user
            Confirm.show(
                'Confirm Action',
                `Are you sure you want to create '${name}' with a price of ${price} SITC?`,
                'Mint NFT',
                'Cancel',
                async () => {
                    if (form.checkValidity() === true && nftNameValidated && nftPriceValidated) {
                        Loading.hourglass('Minting a new NFT...')

                        // FUTURE UPGRADE: IPFS URI Metadata storage
                        const URI = 'ipfsHash'

                        // Create NFT here
                        await nftMarketContract.methods.mint(name, URI, price, nftMarketContract.options.address)
                            .estimateGas({ from: account })
                            .then(async (gasAmount) => {
                                console.log(`Estimated gas = ${gasAmount}`)
                                await nftMarketContract.methods.mint(name, URI, price, nftMarketContract.options.address).send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                                .then((receipt) => {
                                    console.log(receipt)
                                    Report.success(
                                        'Success',
                                        `NFT <strong>"${name}" (${price} SITC)</strong> has been minted successfully!`,
                                        'Okay'
                                    )

                                    // Update market info
                                    getMarketInfo()
                                })
                                .catch((error) => {
                                    console.log(error)
                                    Report.failure(
                                        'Error',
                                        `${error.message} (${error.code})`,
                                        'Okay'
                                    )
                                })
                            })
                            .catch((error) => {
                                console.log(error)
                                Report.failure(
                                    'Error',
                                    `${error.message} (${error.code})`,
                                    'Okay'
                                )
                            })

                        Loading.remove()
                    }
                }
            )

            // Reset the modal
            setCreateNftFormShow(false)
        }
    }

    function validateNftName(name) {
        // Check if name is entered
        if (name === '' || name === undefined) {
            return false
        }

        return true
    }

    function validateNftPrice(price) {
        // Chops off any decimal places and converts to number
        const amt = Math.floor(Number(price))

        console.log(`Price: ${amt}`)

        // Ensure price is more than 0
        if (amt <= 0) {
            return false
        }

        return true
    }

    function checkValid() {
        if (nftNameValidated && nftPriceValidated) {
            return true
        }
        return false
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

            {/* Create NFT Form Modal */}
            <Modal show={createNftFormShow} onHide={handleCreateNftFormClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create NFT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={createNftValidated} onSubmit={createNft}>
                        {/* Address Input */}
                        <Form.Group className="mb-3" controlId="nftName">
                            <Form.Label className='h6'>NFT Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Name of NFT"
                                onChange={() => {
                                    // Sanitize user inputs before processing
                                    const name = DOMPurify.sanitize(document.querySelector('#nftName').value)

                                    // Set valid state according to server side validation rules
                                    validateNftName(name) ? setNftNameValidated(true) : setNftNameValidated(false)

                                    // Check if form is validated and ready to submit
                                    checkValid() ? setValidated(true) : setValidated(false)
                                    console.log(`Validated: ${validated}`)
                                }}
                                isValid={nftNameValidated}
                                isInvalid={!nftNameValidated}
                            />
                            {/* Valid Feedback */}
                            <Form.Control.Feedback>
                                Ok!
                            </Form.Control.Feedback>
                            {/* Invalid Feedback */}
                            <Form.Control.Feedback type='invalid'>
                                Please enter a name for your NFT
                            </Form.Control.Feedback>
                        </Form.Group>
                        {/* Amount input */}
                        <Form.Group className="mb-3" controlId="nftPrice">
                            <Form.Label className='h6'>Selling Price</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Selling price of NFT"
                                onChange={() => {
                                    // Sanitize user inputs before processing
                                    const price = DOMPurify.sanitize(document.querySelector('#nftPrice').value)

                                    // Set valid state according to server side validation rules
                                    validateNftPrice(price) ? setNftPriceValidated(true) : setNftPriceValidated(false)

                                    // Check if form is validated and ready to submit
                                    checkValid() ? setCreateNftValidated(true) : setCreateNftValidated(false)
                                    console.log(`Validated: ${createNftValidated}`)
                                }}
                                isValid={nftPriceValidated}
                                isInvalid={!nftPriceValidated}
                            />
                            {/* Valid Feedback */}
                            <Form.Control.Feedback>
                                Ok!
                            </Form.Control.Feedback>
                            {/* Invalid Feedback */}
                            <Form.Control.Feedback type='invalid'>
                                Price cannot be 0 or less
                            </Form.Control.Feedback>
                        </Form.Group>
                        {/* More form elements can be added in the future with IPFS support for metadata */}
                        {/* Submit button */}
                        <Button variant="success" type="submit">
                            Mint!
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
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