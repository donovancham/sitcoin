import React, { createContext, useContext, useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { useRouter } from 'next/router'
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Web3 from 'web3'

const WalletContext = createContext()
const platonMainnet = 100
const platonDevnet = 210309

export default function WalletProvider({ children }) {

    const router = useRouter()
    const [account, setAccount] = useState()
    const [network, setNetwork] = useState()
    const [web3, setWeb3] = useState()
    const [web3a, setWeb3a] = useState()

    // Runs once during rendering phase.
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
            return
        }

        // Loads web3 instance from samurai wallet when page loads
        web3
            ? Notify.info('Web3 object already loaded', {
                clickToClose: true
            })
            : setWeb3(new Web3(platon));

        // Change handler for the account switching
        platon.on('accountsChanged', (accounts) => {
            // Handle the new accounts, or lack thereof.
            // "accounts" will always be an array, but it can be empty.
            accounts.length
                // Truthy: Set new account as main account being used
                ? setAccount(accounts[0])
                // Falsy: Show error message
                : Notify.warning('Account is not connected. Please connect account for more actions', {
                    clickToClose: true
                });

            // Get balances again

        });

        // Change handler for chain change
        platon.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            console.log(`New Chain ID: ${chainId}`);
            window.location.reload();
        });

        // Handle connection errors
        platon.on('disconnect', (error) => {
            Report.failure(
                'Connection Error',
                `Network was disconnected. Please reload page. Error Message: ${error}`,
                'Reload',
                () => {
                    window.location.reload();
                }
            )
        });

        // Configure network
        console.log(`Current Chain: ${platon.networkVersion}`)

        platon.networkVersion === platonMainnet
            ? setNetwork('PlatON Main Network')
            : setNetwork('PlatON Test Network')

        console.log(`Current Network: ${network}`)

        // Load other items

    })

    const walletState = {
        account,
        setAccount,
        web3
    }

    return (
        <WalletContext.Provider value={walletState}>
            {children}
        </WalletContext.Provider>
    )
}

/**
 * Connects to Samurai wallet on browser.
 * 
 * @param {Web3} web3 
 * @returns The address of the account connected on success. Returns false on failure.
 */
export async function connectSamurai(web3) {
    try {
        console.log(`Current Address: ${platon.selectedAddress}`)

        // Check if account is already connected
        if (platon.selectedAddress == undefined) {
            // Requests the browser wallet to connect to the network.
            let accounts = await web3.platon.requestAccounts()

            Notify.success('Connected to SIT Metaverse', {
                clickToClose: true
            })

            console.log(`Accounts: ${accounts}`)
        }
        else {
            Notify.info('Account already connected', {
                clickToClose: true
            })
        }

        return true;
    }
    catch (e) {
        // User Rejected connection wallet connection
        // Get message of error
        console.log(`Error code: ${e.code}`)
        console.log(`Error message: ${e.message}`)
        Notify.failure(`${e.code}: ${e.message}`, {
            clickToClose: true
        })
        return false
    }
}

export function useWalletContext() {
    return useContext(WalletContext)
}