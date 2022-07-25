import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Image from "next/image";
import Link from 'next/link'

import { connectSamurai, useWalletContext } from '../context/WalletContext';

export default function Header() {
    const { setRefresh, account, setAccount, web3 } = useWalletContext()

    const connectButton = () => {
        return (
            <Button variant="outline-success" size="md" onClick={async () => {
                // Ensure that samurai connected
                let result = await connectSamurai(web3)
                if (result !== false) {
                    if (account === undefined) {
                        // Sets wallet account
                        setAccount(result)
                    }
                    else {
                        // Refresh information
                        setRefresh(true)
                    }
                }
            }}>
                Connect Wallet
            </Button>
        )
    }

    const connectedButton = () => {
        return (
            <Button variant="success" size="md" disabled>
                Connected
            </Button>
        )
    }

    const refreshButton = () => {
        return (
            <Button variant="outline-dark" size="md" onClick={async () => {
                // Ensure that samurai connected
                let result = await connectSamurai(web3)
                if (result !== false) {
                    // Refresh information
                    setRefresh(true)
                }
            }}>
                Refresh
            </Button>
        )
    }

    return (
        <Navbar variant="light" sticky="top" className='bg-light bg-gradient'>
            <Container>
                <Image src="/static/token.png" width="45" height="45" />
                <Navbar.Brand href="/">
                    SIT Metaverse
                </Navbar.Brand>
                {/* Insert any navigation links you need here */}
                {/* <Nav.Link href="/">Home</Nav.Link> */}
                <Navbar.Collapse className="justify-content-end">
                    {/* Refresh Button */}
                    <Navbar.Text>
                        {/* Show refresh button once account connected */}
                        {account ? refreshButton() : ''}
                    </Navbar.Text>
                    {/* Connect Wallet Button */}
                    <Navbar.Text>
                        {/* Error Alert message that will pop-up when install fails */}
                        {account ? connectedButton() : connectButton()}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}