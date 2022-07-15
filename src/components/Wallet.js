import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Placeholder from 'react-bootstrap/Placeholder';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { useWalletContext } from '../context/WalletContext';

export default function Wallet() {
    const {
        account,
        network,
        tokenContract,
        tokenName,
        tokenSymbol,
        tokenSupply,
        tokenBalance,
        web3
    } = useWalletContext()

    return (
        <Container>

            <Tab.Container id='wallet-info' defaultActiveKey='account'>
                <Card className='bg-light'>
                    <Card.Header>
                        <Nav variant="pills" defaultActiveKey="#account">
                            <Nav.Item>
                                <Nav.Link eventKey='account' href='#account'>Account</Nav.Link>
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
                        {/* Account Tab */}
                        <Tab.Pane eventKey='account' title='Account'>
                            <Card.Body>
                                <Card.Title>Account Overview</Card.Title>

                                <Card.Text>
                                    <ButtonGroup size='lg' className='mb-2'>
                                        <Button variant='danger' size='md' disabled>
                                            Network Connected ==={'>'} 
                                        </Button>{' '}
                                        <Button variant='dark' size='md' disabled>
                                            {network
                                                ? network
                                                : <Placeholder xs={6} />}
                                        </Button>
                                    </ButtonGroup>
                                </Card.Text>
                            </Card.Body>
                        </Tab.Pane>
                        {/* Wallet Tab */}
                        <Tab.Pane eventKey='wallet' title='Wallet'>
                            <Card.Body>
                                <Card.Title>My Wallet</Card.Title>
                                <Card.Text>
                                    Account ==={'>'} {' '} {account
                                        ? account
                                        : <Placeholder xs={6} />}
                                </Card.Text>
                            </Card.Body>
                        </Tab.Pane>
                        {/* Transfer Tab */}
                        <Tab.Pane eventKey='transfer' title='Transfer'>
                            <Card.Body>
                                <Card.Title>Transfer Tokens</Card.Title>
                                <Card.Text>
                                    Transfer Tokens
                                </Card.Text>
                            </Card.Body>
                        </Tab.Pane>
                    </Tab.Content>
                </Card>
            </Tab.Container>

        </Container>
    )

}