import { Container, Col, Button } from 'react-bootstrap'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { connectSamurai, useWalletContext } from '../context/WalletContext';

export default function Wallet() {
    const { account, setAccount, web3 } = useWalletContext()

    return (
        <Container>
            {/* Error Alert message that will pop-up when install fails */}
            {/* <h2>PlatON Wallet</h2> */}
            <Button variant="outline-success" size="md" onClick={async () => {
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
            {/* <p>Your Address: {account}</p> */}
            <Button variant="outline-secondary" size="md" onClick={async () => {

            }}>
                Login
            </Button>
        </Container>
    )
}