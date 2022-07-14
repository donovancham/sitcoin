import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Web3 from 'web3'

const WalletContext = createContext()

export default function WalletProvider({ children }) {
    const router = useRouter()
    const [account, setAccount] = useState()
    const [network, setNetwork] = useState()
    const [web3, setWeb3] = useState()
    const [web3a, setWeb3a] = useState()

    // Run this whenever something in dependency array is changed
    // Dependency array currently has accounts and network set as dependency
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
            ? Notify.info('Web3 object already loaded')
            : setWeb3(new Web3(platon))

        // Configure network tracker
        
        // Load other items


    }, [account])

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
        // Requests the browser wallet to connect to the network.
        let accounts = await web3.platon.requestAccounts()
        return accounts[0]
    }
    catch (e) {
        // User Rejected connection wallet connection
        // Get message of error
        console.log(`Error code: ${e.code}`)
        console.log(`Error message: ${e.message}`)
        return false
    }
}

export function useWalletContext() {
    return useContext(WalletContext)
}