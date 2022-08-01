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
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

import { connectSamurai, useWalletContext } from '../context/WalletContext';
import NftMarketContext, { useNftMarketContext } from '../context/NFTMarketContext';

export default function Marketplace() {
    const {
        account,
        allowance,
        refresh,
        setRefresh,
        tokenContract,
        tokenBalance,
        web3
    } = useWalletContext()

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
        approvalStatus,
        getMarketInfo,
    } = useNftMarketContext()

    // General form validation state
    const [validated, setValidated] = useState(false)

    // Form validation criteria for minting NFT
    const [createNftFormShow, setCreateNftFormShow] = useState(false)
    const [createNftValidated, setCreateNftValidated] = useState(false)
    const [nftNameValidated, setNftNameValidated] = useState(false)
    const [nftPriceValidated, setNftPriceValidated] = useState(false)

    // Form validation criteria for increasing allowance
    const [allowanceFormShow, setAllowanceFormShow] = useState(false)
    const [allowanceFormValidated, setAllowanceFormValidated] = useState(false)
    const [amountValidated, setAmountValidated] = useState(false)
    const [optionSelected, setOptionSelected] = useState()
    const [optionValidated, setOptionValidated] = useState(false)

    // Functions for displaying or hiding nft form modal
    const handleCreateNftFormShow = () => {
        setCreateNftValidated(false)
        setCreateNftFormShow(true)
    }
    const handleCreateNftFormClose = () => setCreateNftFormShow(false)

    // Functions for displaying or hiding allowance form modal
    const handleAllowanceFormShow = () => {
        setAllowanceFormValidated(false)
        setAllowanceFormShow(true)
    }
    const handleAllowanceFormClose = () => setAllowanceFormShow(false)

    function viewNfts(title, nftCount, nftArray) {
        // Create the content list to be returned
        let content = []
        content.push(
            <Container fluid>
                <div className='px-4 py-5 my-5 text-center'>
                    <h1 className='display-5 fw-bold'>{title}</h1>
                    <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4">
                            Current Item Count: {nftCount}
                        </p>
                    </div>
                </div>
                <Row className='justify-content-md-center'>
                    <Col md='auto'>
                        <Button variant='primary' size='lg' onClick={handleCreateNftFormShow}>
                            Create NFT
                        </Button>
                    </Col>
                    <Col md='auto'>
                        <Button
                            variant={approvalStatus ? 'success' : 'outline-danger'}
                            size='lg'
                            onClick={approveMarket}
                            disabled={approvalStatus}>
                            {approvalStatus ? 'Market Approved' : 'Approve Market'}
                        </Button>
                    </Col>
                    <Col md='auto'>
                        <Button variant='outline-dark' size='lg' onClick={handleAllowanceFormShow}>
                            Manage Allowance
                        </Button>
                    </Col>
                </Row>
            </Container >
        )

        // Check if there are any items on the market currently
        if (nftCount != 0 && nftArray !== undefined) {
            // Add the cards displaying NFT items
            content.push(
                <Table responsive>
                    <thead>
                        {nftArray.map((nft) => (
                            <th>
                                {nftItemCard(nft)}
                            </th>
                        ))}
                    </thead>
                </Table>
            )
        }

        return content
    }

    const nftItemCard = (nft) => {
        const zeroAddress = 'lat1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq542u6a'
        // Decode from bech32 to hex has issues, have to do inefficient conversion from hex to bech
        const author = web3.utils.toBech32Address('lat', nft['author'])

        let owner = web3.utils.toBech32Address('lat', nft['owner'])
        // Check if owner is 0 address, set the owner to author
        if (owner === zeroAddress) {
            owner = author
        }

        let seller = web3.utils.toBech32Address('lat', nft['seller'])
        // Check if seller is 0 address, set the seller to author
        if (seller === zeroAddress) {
            seller = author
        }

        return (
            <Card style={{ width: '31rem', margin: '25px' }}>
                <Card.Body>
                    <Image src='/static/nft_placeholder.png' alt={nft['description'] + ' image'} fluid />
                    <Card.Title>
                        <Row>
                            <Col sm={8} className='display-6'>
                                {nft['description']}
                            </Col>
                            <Col sm={4} className='text-muted text-end'>
                                ID: {nft['tokenId']}
                            </Col>
                        </Row>
                    </Card.Title>
                    <Table striped="columns">
                        <thead />
                        <tbody>
                            <tr>
                                <td class='lead'>Creator</td>
                                <td class='text-end h6'>{author}</td>
                            </tr>
                            <tr>
                                <td class='lead'>Owner</td>
                                <td class='text-end h6'>{owner}</td>
                            </tr>
                            <tr>
                                <td class='lead'>Price</td>
                                <td class='text-end h6'>{nft['price']} SITC</td>
                            </tr>
                            {/* Next JS Conditional Rendering */}
                            {
                                // Show seller if NFT is up for sale
                                nft['published'] &&
                                <tr>
                                    <td class='lead'>Seller</td>
                                    <td class='text-end h6'>{seller}</td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                    {/* Buy button to buy NFTs */}
                    {
                        // Ensure user does not own displayed NFT
                        (owner !== account ? author !== account : false) && !nft['sold'] &&
                        <Button variant='outline-primary' onClick={async () => { await buyNft(nft['tokenId'], nft['price']) }}>
                            Buy NFT
                        </Button>
                    }
                    {/* Allow listing item when item is not published */}
                    {
                        // Check if published
                        !nft['published'] &&
                        // Ensure at least owned or is author if not owned
                        (owner === account ? true : author === account) &&
                        <Button variant='warning' onClick={() => { sellNft(nft['tokenId']) }}>
                            Sell NFT
                        </Button>
                    }
                    {/* Allow unlisting item when owned */}
                    {
                        // Check if published
                        nft['published'] &&
                        // Ensure Item is not sold already
                        !nft['sold'] &&
                        // Ensure at least owned or is author if not owned
                        (owner === account ? true : author === account) &&
                        <Button variant='danger' onClick={() => { unlistNft(nft['tokenId']) }}>
                            Unlist NFT
                        </Button>
                    }
                    {/* Creator Status */}
                    {
                        // Ensure item is created by usr
                        author === account &&
                        <Button variant='outline-primary' disabled>
                            Creator
                        </Button>
                    }
                    {/* Ownership Status */}
                    {
                        // Ensure item is owned
                        owner === account &&
                        <Button variant='outline-danger' disabled>
                            Owned
                        </Button>
                    }
                    {/* Sold Status */}
                    {
                        // Ensure Item is already sold
                        nft['sold'] &&
                        <Button variant='outline-success' disabled>
                            Sold
                        </Button>
                    }
                </Card.Body>
            </Card>
        )
    }

    async function grantAllowance(amount) {
        if (amount > tokenBalance) {
            Report.warning(
                'Unable to process',
                `You do not have ${amount} SITC in wallet balance.`,
                'Okay'
            )
        }
        else {
            // Give allowance to Market Contract to allow transfer of funds
            Confirm.show(
                'Give Allowance',
                `Would you allow Market Contract to manage ${amount} SITC on your behalf?`,
                'Confirm',
                'Cancel',
                async () => {
                    Loading.hourglass('Giving allowance...')

                    // Create market item to list item for sale and change status
                    await tokenContract.methods.increaseAllowance(nftMarketContract.options.address, amount)
                        .estimateGas({ from: account })
                        .then(async (gasAmount) => {
                            console.log(`Estimated gas = ${gasAmount}`)
                            await tokenContract.methods.increaseAllowance(nftMarketContract.options.address, amount)
                                .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                                .then(async (receipt) => {
                                    console.log(receipt)
                                    Report.success(
                                        'Allowance Granted',
                                        `Granted Market an allowance of ${amount} SITC.`,
                                        'Okay'
                                    )

                                    // Update Allowance
                                    setRefresh(refresh + 1)
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
            )
        }
    }

    async function removeAllowance(amount) {
        // Ensure that allowance to be removed is within existing allowance scope
        if (allowance < amount) {
            Report.warning(
                'Unable to process',
                `You do not have ${amount} SITC granted to Market. Current grant: ${allowance} SITC`,
                'Okay'
            )
        }
        else {
            // Give allowance to Market Contract to allow transfer of funds
            Confirm.show(
                'Remove Allowance',
                `Would you like to ${amount} SITC granted to Market Contract?`,
                'Confirm',
                'Cancel',
                async () => {
                    Loading.hourglass('Removing allowance...')

                    // Create market item to list item for sale and change status
                    await tokenContract.methods.decreaseAllowance(nftMarketContract.options.address, amount)
                        .estimateGas({ from: account })
                        .then(async (gasAmount) => {
                            console.log(`Estimated gas = ${gasAmount}`)
                            await tokenContract.methods.decreaseAllowance(nftMarketContract.options.address, amount)
                                .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                                .then(async (receipt) => {
                                    console.log(receipt)
                                    Report.success(
                                        'Allowance Removed',
                                        `Removed ${amount} SITC from Market allowance.`,
                                        'Okay'
                                    )

                                    // Update Allowance
                                    setRefresh(refresh + 1)
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
            )
        }
    }

    function approveMarket() {
        // Ensure that the market is approved to execute functions before being able to execute functions
        Confirm.show(
            'Approval required',
            'Please approve NFTMarket contract to manage item sales on your behalf.',
            'Confirm',
            'Cancel',
            async () => {
                Loading.dots('Approving Market...')
                await nftMarketContract.methods
                    .setApprovalForAll(nftMarketContract.options.address, true)
                    .estimateGas({ from: account })
                    .then(async (gasAmount) => {
                        console.log(`Estimated gas = ${gasAmount}`)
                        await nftMarketContract.methods
                            .setApprovalForAll(nftMarketContract.options.address, true)
                            .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                            .then(async (receipt) => {
                                Report.info(
                                    'Approval Success',
                                    `Market has been approved to manage NFT sales on your behalf.`,
                                    'Okay'
                                )
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
        )
    }

    async function buyNft(tokenId, price) {
        // Request for allowance when not enough
        if (allowance < price) {
            Report.warning(
                'Not enough allowance',
                `Please use the "Manage Allowance" button to grant at least ${price} SITC in allowance to Market Contract.`,
                'Okay'
            )
        }
        else {
            // Prompt confirmation from user
            Confirm.show(
                'Buy NFT',
                `Are you sure you want to buy NFT #${tokenId}?`,
                'Confirm',
                'Cancel',
                async () => {
                    Loading.hourglass('Buying NFT...')

                    // Create market item to list item for sale and change status
                    await nftMarketContract.methods.purchaseItem(tokenId)
                        .estimateGas({ from: account })
                        .then(async (gasAmount) => {
                            console.log(`Estimated gas = ${gasAmount}`)
                            await nftMarketContract.methods.purchaseItem(tokenId)
                                .send({ from: account, gas: Math.floor(gasAmount * 1.4) })
                                .then((receipt) => {
                                    console.log(receipt)
                                    Report.success(
                                        'Success',
                                        `NFT #${tokenId} has been bought successfully!`,
                                        'Okay'
                                    )

                                    // Update market info
                                    getMarketInfo()

                                    // Update Allowance
                                    setRefresh(refresh + 1)
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
            )
        }
    }

    function sellNft(tokenId) {
        if (approvalStatus === true) {
            // Prompt confirmation from user
            Confirm.show(
                'Create Sale Listing',
                `Are you sure you want to create a sale listing NFT #${tokenId} for sale?`,
                'Confirm',
                'Cancel',
                async () => {
                    Loading.hourglass('Listing NFT for sale...')

                    // Create market item to list item for sale and change status
                    await nftMarketContract.methods.createItem(tokenId)
                        .estimateGas({ from: account })
                        .then(async (gasAmount) => {
                            console.log(`Estimated gas = ${gasAmount}`)
                            await nftMarketContract.methods.createItem(tokenId)
                                .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                                .then((receipt) => {
                                    console.log(receipt)
                                    Report.success(
                                        'Success',
                                        `NFT #${tokenId}" has been listed for sale successfully!`,
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
            )
        }
        else {
            // Show error message
            Report.warning(
                'No approval granted',
                'Please use the \'Approve Market\' button to grant the market contract permissions to manage NFT sales on your behalf',
                'Okay'
            )
        }
    }

    function unlistNft(tokenId) {
        if (approvalStatus === true) {
            // Prompt confirmation from user
            Confirm.show(
                'Unlist NFT',
                `Are you sure you want to unlist NFT #${tokenId}?`,
                'Confirm',
                'Cancel',
                async () => {
                    Loading.hourglass('Unlisting NFT...')

                    // Create market item to list item for sale and change status
                    await nftMarketContract.methods.unlistItem(tokenId)
                        .estimateGas({ from: account })
                        .then(async (gasAmount) => {
                            console.log(`Estimated gas = ${gasAmount}`)
                            await nftMarketContract.methods.unlistItem(tokenId)
                                .send({ from: account, gas: Math.floor(gasAmount * 1.1) })
                                .then((receipt) => {
                                    console.log(receipt)
                                    Report.success(
                                        'Success',
                                        `NFT #${tokenId}" has been unlisted successfully!`,
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
            )
        }
        else {
            // Show error message
            Report.warning(
                'No approval granted',
                'Please use the \'Approve Market\' button to grant the market contract permissions to manage NFT sales on your behalf',
                'Okay'
            )
        }
    }

    function manageAllowance(event) {
        // Prevents page from reloading
        event.preventDefault();

        // Pre-check elements loaded before proceeding
        if (tokenContract === undefined) {
            Notify.failure('Please connect wallet to continue.', {
                clickToClose: true
            })
        }
        else {
            const form = event.currentTarget;
            console.log(`Form Valid? ${form.checkValidity()}`)

            const amount = DOMPurify.sanitize(document.querySelector('#allowanceAmount').value)

            if (optionSelected === 1) {
                // Selected increase allowance
                grantAllowance(amount)
            }
            else {
                // Selected decrease allowance
                removeAllowance(amount)
            }
        }
    }

    function createNft(event) {
        // Prevents page from reloading
        event.preventDefault();

        // Pre-check elements loaded before proceeding
        if (nftMarketContract === undefined) {
            Notify.failure('Please wait for Market Contract to connect.', {
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
                'Create new NFT',
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
                                            `NFT "${name}" (${price} SITC) has been minted successfully!`,
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

    function validateNumber(num) {
        // Chops off any decimal places and converts to number
        const amt = Math.floor(Number(num))

        console.log(`Number to validate: ${amt}`)

        // Ensure price is more than 0
        if (amt <= 0) {
            return false
        }

        return true
    }

    function checkNftFormValid() {
        if (nftNameValidated && nftPriceValidated) {
            return true
        }
        return false
    }

    function checkAllowanceFormValid() {
        return amountValidated && optionValidated
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
                        {
                            account
                                ? viewNfts('All Items', allMarketItemsCount, allMarketItems)
                                : 'Please click Connect Button to refresh'
                        }
                    </Tab>
                    {/* View all unsold items tab */}
                    <Tab eventKey="unsoldItems" title="Unsold Listings">
                        {
                            account
                                ? viewNfts('Unsold Items', unsoldItemsCount, unsoldItems)
                                : 'Please click Connect Button to refresh'
                        }
                    </Tab>
                    {/* View my owned NFTs tab */}
                    <Tab eventKey="myNFTs" title="My NFTs">
                        {
                            account
                                ? viewNfts('My NFTs', myOwnedNftCount, myOwnedNfts)
                                : 'Please click Connect Button to refresh'
                        }
                    </Tab>
                    {/* View my creations tab */}
                    <Tab eventKey="myCreations" title="My Creations">
                        {
                            account
                                ? viewNfts('My Creations', myCreationCount, myNftCreations)
                                : 'Please click Connect Button to refresh'
                        }
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
                                    checkNftFormValid() ? setValidated(true) : setValidated(false)
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
                                    validateNumber(price) ? setNftPriceValidated(true) : setNftPriceValidated(false)

                                    // Check if form is validated and ready to submit
                                    checkNftFormValid() ? setCreateNftValidated(true) : setCreateNftValidated(false)
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

            {/* Allowance Management Modal Form */}
            <Modal show={allowanceFormShow} onHide={handleAllowanceFormClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Allowance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={allowanceFormValidated} onSubmit={manageAllowance}>
                        {/* Display Current Allowance */}
                        <div className="h3 text-primary">
                            Current Allowance:
                            <div className="h4 text-info">{allowance} SITC</div>
                        </div>
                        <div className="h3 text-success">
                            Wallet Balance:
                            <div className="h4 text-dark">{tokenBalance} SITC</div>
                        </div>

                        {/* Amount input */}
                        <Form.Group className="mb-3" controlId="allowanceAmount">
                            <Form.Label className='h6'>Allowance Amount</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Allowance to grant or remove"
                                onChange={() => {
                                    if (document.querySelector('#decreaseAllowance').checked === false &&
                                        document.querySelector('#increaseAllowance').checked === false) {
                                        // Since both are not checked, options should be invalid
                                        setOptionValidated(false)
                                    }

                                    // Sanitize user inputs before processing
                                    const amount = DOMPurify.sanitize(document.querySelector('#allowanceAmount').value)

                                    // Set valid state according to server side validation rules
                                    validateNumber(amount) ? setAmountValidated(true) : setAmountValidated(false)

                                    // Check if form is validated and ready to submit
                                    checkAllowanceFormValid() ? setAllowanceFormValidated(true) : setAllowanceFormValidated(false)
                                    console.log(`Validated: ${allowanceFormValidated}`)
                                }}
                                isValid={amountValidated}
                                isInvalid={!amountValidated}
                            />
                            {/* Valid Feedback */}
                            <Form.Control.Feedback>
                                Ok!
                            </Form.Control.Feedback>
                            {/* Invalid Feedback */}
                            <Form.Control.Feedback type='invalid'>
                                Amount cannot be 0 or less
                            </Form.Control.Feedback>
                        </Form.Group>
                        {/* Option Selection for increase or decrease */}
                        <Form.Group className="mb-3" controlId="allowanceOption">
                            <Form.Label className='h6'>Allowance Management Options</Form.Label>
                            <div>
                                {/* Option for increase allowance */}
                                <Form.Check
                                    inline
                                    id="increaseAllowance"
                                    type="radio"
                                >
                                    <Form.Check.Input
                                        required
                                        type="radio"
                                        name="allowanceOption"
                                        onChange={() => {
                                            if (document.querySelector('#decreaseAllowance').checked === false &&
                                                document.querySelector('#increaseAllowance').checked === false) {
                                                // Since both are not checked, options should be invalid
                                                setOptionValidated(false)
                                            }
                                            else if (document.querySelector('#increaseAllowance').checked) {
                                                setOptionSelected(1)
                                                setOptionValidated(true)
                                            }

                                            // Check if form is validated and ready to submit
                                            checkAllowanceFormValid() ? setAllowanceFormValidated(true) : setAllowanceFormValidated(false)
                                            console.log(`Validated: ${allowanceFormValidated}`)
                                        }}
                                        isValid={optionValidated}
                                        isInvalid={!optionValidated}
                                    />
                                    <Form.Check.Label>Give Allowance</Form.Check.Label>
                                    <Form.Control.Feedback type="valid">
                                        Ok!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Please Select an option
                                    </Form.Control.Feedback>
                                </Form.Check>
                                {/* Option for decrease allowance */}
                                <Form.Check
                                    inline
                                    id="decreaseAllowance"
                                    type="radio"
                                >
                                    <Form.Check.Input
                                        required
                                        type="radio"
                                        name="allowanceOption"
                                        onChange={() => {
                                            if (document.querySelector('#decreaseAllowance').checked === false &&
                                                document.querySelector('#increaseAllowance').checked === false) {
                                                // Since both are not checked, options should be invalid
                                                setOptionValidated(false)
                                            }
                                            else if (document.querySelector('#decreaseAllowance').checked) {
                                                setOptionSelected(2)
                                                setOptionValidated(true)
                                            }

                                            console.log(`OptionValid: ${optionValidated}`)

                                            // Check if form is validated and ready to submit
                                            checkAllowanceFormValid() ? setAllowanceFormValidated(true) : setAllowanceFormValidated(false)
                                            console.log(`Validated: ${allowanceFormValidated}`)
                                        }}
                                        isValid={optionValidated}
                                        isInvalid={!optionValidated}
                                    />
                                    <Form.Check.Label>Remove Allowance</Form.Check.Label>
                                    <Form.Control.Feedback type="valid">
                                        Ok!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Please Select an option
                                    </Form.Control.Feedback>
                                </Form.Check>
                            </div>
                        </Form.Group>
                        {/* Submit button */}
                        <Button variant="success" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </NftMarketContext >
    )
}