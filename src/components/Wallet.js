import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Placeholder from 'react-bootstrap/Placeholder';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import Form from 'react-bootstrap/Form';
import DOMPurify from 'isomorphic-dompurify';

import { useWalletContext } from '../context/WalletContext';

export default function Wallet() {
    // Load context variables
    const {
        account,
        network,
        tokenContract,
        tokenName,
        tokenSymbol,
        tokenSupply,
        tokenBalance,
        web3,
        getContractInfo,
    } = useWalletContext()

    const notConnected = 'Loading...'

    // Form validation criteria for transferring tokens
    const [validated, setValidated] = useState(false);

    const transferFunds = async (to, amount) => {
        // Execute Transfer
        Loading.hourglass('Executing Transfer...')

        await tokenContract.methods.transfer(to, amount).estimateGas({ from: account })
            .then( async (gasAmount) => {
                console.log(`Estimated gas = ${gasAmount}`)
                await tokenContract.methods.transfer(to, amount).send({ from: account, gas: gasAmount * 2 })
                .then( (receipt) => {
                    console.log(receipt)

                    Report.success(
                        'Transfer Successful',
                        `

                        <div class="container-lg">
                            <ul class="list-group list-group-horizontal">
                                <li class="list-group-item list-group-item-primary col-md-4">Transaction Hash</li>
                                <li class="list-group-item list-group-item-action">${receipt.transactionHash}</li>
                            </ul>
                            <ul class="list-group list-group-horizontal">
                                <li class="list-group-item list-group-item-primary col-md-4">Transaction Hash</li>
                                <li class="list-group-item list-group-item-action col-md-6">${receipt.transactionHash}</li>
                            </ul>
                            <ul class="list-group list-group-horizontal">
                                <li class="list-group-item list-group-item-dark col-md-4">Gas</li>
                                <li class="list-group-item list-group-item-action">
                                    ${
                                    // Convert to von first before converting back to LAT
                                    web3.utils.fromVon(
                                        web3.utils.toVon(receipt.cumulativeGasUsed.toString(), 'gvon'),
                                        'lat'
                                    ) + ' ' + 'LAT'
                                    }
                                </li>
                            </ul>
                            <ul class="list-group list-group-horizontal">
                                <li class="list-group-item list-group-item-danger col-md-4">From</li>
                                <li class="list-group-item list-group-item-action">${receipt.events.Transfer.returnValues.from}</li>
                            </ul>
                            <ul class="list-group list-group-horizontal">
                                <li class="list-group-item list-group-item-success col-md-4">To</li>
                                <li class="list-group-item list-group-item-action">${receipt.events.Transfer.returnValues.to}</li>
                            </ul>
                            <ul class="list-group list-group-horizontal">
                                <li class="list-group-item list-group-item-warning col-md-4">Amount</li>
                                <li class="list-group-item list-group-item-action">
                                    ${receipt.events.Transfer.returnValues.value + ' ' + tokenSymbol}
                                </li>
                            </ul>
                            <ul class="list-group list-group-horizontal">
                                <li class="list-group-item list-group-item-info col-md-4">Status</li>
                                <li class="list-group-item list-group-item-action">${receipt.status}</li>
                            </ul>
                        </div>
                        `,
                        'Okay',
                        {
                            width: '650px',
                            messageMaxLength: 3000,
                            plainText: false
                        }
                    )

                    // Update States
                    getContractInfo()
                    

                    Loading.remove()
                })
                .catch( (error) => {
                    console.log(error)
                    Report.failure(
                        'Error',
                        `${error.message} (${error.code})`,
                        'Okay'
                    )
                    
                    Loading.remove()
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const validateAmount = (amount) => {
        // Chops off any decimal places and converts to number
        const amt = Math.floor(Number(amount))

        if (amt <= 0) {
            Notify.failure('Amount cannot be 0 or less.', {
                clickToClose: true
            })
            return false
        }

        if (amt > tokenBalance) {
            Notify.failure('Amount cannot be more than what you own.', {
                clickToClose: true
            })
            return false
        }

        return true
    }

    const transferTokens = (event) => {
        if (tokenBalance === undefined) {
            Notify.failure('Please connect wallet before transferring', {
                clickToClose: true
            })
            event.preventDefault();
            event.stopPropagation();
            return
        }

        const form = event.currentTarget;

        // Sanitize user inputs before processing
        const address = DOMPurify.sanitize(document.querySelector('#transferAddress').value)
        const amount = DOMPurify.sanitize(document.querySelector('#transferAmount').value)

        console.log(`Form Valid? ${form.checkValidity()}`)

        // Runs Client-side validation before server-side
        // Check if form is valid according to HTML validation
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            // Check if address is valid
            if (web3.utils.isBech32Address(address) === false) {
                Notify.failure('Address is not PlatON bech32 format!', {
                    clickToClose: true
                })
                event.preventDefault();
                event.stopPropagation();
            }
            // Ensure sending to another address, not self
            else if (address == account) {
                Notify.failure('Cannot send yourself SIT coins! Please input another address.', {
                    clickToClose: true
                })
                event.preventDefault();
                event.stopPropagation();
            }
            // Check if amount is valid
            else if (validateAmount(amount) === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            else {
                transferFunds(address, amount);
            }
        }

        setValidated(true);
    };

    return (
        <Container>

            <Tab.Container id='wallet-info' defaultActiveKey='network'>
                <Card className='bg-light'>
                    <Card.Header>
                        <Nav variant="pills" defaultActiveKey="#network">
                            <Nav.Item>
                                <Nav.Link eventKey='network' href='#network'>Network</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='wallet' href='#wallet'>Wallet</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='transfer' href='#transfer'>Transfer</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Tab.Content>
                        {/* Network Tab */}
                        <Tab.Pane eventKey='network' title='network'>
                            <Card.Body>
                                <Card.Title>Network Overview</Card.Title>
                                {/* Network information */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='danger' className='col-md-4'>
                                        <h5>Network Connected</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item action>
                                        {network ? network : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                                {/* SITcoin Total Supply */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='warning' className='col-md-4'>
                                        <h5>Token Supply</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item action>
                                        {tokenSupply ? tokenSupply : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Tab.Pane>
                        {/* Wallet Tab */}
                        <Tab.Pane eventKey='wallet' title='Wallet'>
                            <Card.Body>
                                <Card.Title>My Wallet</Card.Title>
                                {/* Account Address */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='primary' className='col-md-4'>
                                        <h5>Wallet Address</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item action>
                                        {account ? account : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                                {/* Account Currency */}
                                <ListGroup horizontal>
                                    <ListGroup.Item variant='info' className='col-md-4'>
                                        <h5>{tokenName} {' '}Balance</h5>
                                    </ListGroup.Item>
                                    <ListGroup.Item action>
                                        {tokenBalance ? tokenBalance + ' ' + tokenSymbol : notConnected}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Tab.Pane>
                        {/* Transfer Tab */}
                        <Tab.Pane eventKey='transfer' title='Transfer'>
                            <Card.Body>
                                <Card.Title>Transfer Tokens</Card.Title>
                                {/* Transfer tokens form */}
                                <Form noValidate validated={validated} onSubmit={transferTokens}>
                                    {/* Address Input */}
                                    <Form.Group className="mb-3" controlId="transferAddress">
                                        <Form.Label className='h6'>Receiver Address</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Receiver Address"
                                            size='lg'
                                        />
                                        {/* Valid Feedback */}
                                        <Form.Control.Feedback>
                                            Ok!
                                        </Form.Control.Feedback>
                                        {/* Invalid Feedback */}
                                        <Form.Control.Feedback type='invalid'>
                                            Please enter a valid ATON bech32 address (E.g. lat1rd8c02e905rguunal8ck77ftct0jph2v6zj7cq)
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {/* Amount input */}
                                    <Form.Group className="mb-3" controlId="transferAmount">
                                        <Form.Label className='h6'>Amount</Form.Label>
                                        <Form.Control
                                            required
                                            type="number"
                                            placeholder="SITC to transfer"
                                        />
                                        {/* Valid Feedback */}
                                        <Form.Control.Feedback>
                                            Ok!
                                        </Form.Control.Feedback>
                                        {/* Invalid Feedback */}
                                        <Form.Control.Feedback type='invalid'>
                                            Please enter a positive number
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {/* Submit button */}
                                    <Button variant="success" type="submit">
                                        Transfer
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Tab.Pane>
                    </Tab.Content>
                </Card>
            </Tab.Container>

        </Container >
    )

}