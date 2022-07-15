import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Image from "next/image";

import { connectSamurai, useWalletContext } from '../context/WalletContext';

export default function Header() {
    const { setAccount, web3 } = useWalletContext()

    return (
        <Navbar variant="light" sticky="top">
            <Container>
                <Image src="/static/token.png" width="45" height="45" />
                <Navbar.Brand href="/">
                    SIT Metaverse
                </Navbar.Brand>
                <Nav.Link href="#action1">Home</Nav.Link>
                <Nav.Link href="#action1">Home</Nav.Link>
                <Nav.Link href="#action1">Home</Nav.Link>
                <Navbar.Collapse className="justify-content-end">
                    {/* Connect Wallet Button */}
                    <Navbar.Text>
                        {/* Error Alert message that will pop-up when install fails */}
                        <Button variant="outline-success" size="md" onClick={async () => {
                            // Ensure that samurai connected
                            let result = await connectSamurai(web3)
                            if (result !== false) {
                                // Sets wallet account
                                setAccount(result)
                            }
                        }}>
                            Connect Wallet
                        </Button>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}