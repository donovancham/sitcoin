import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Web3 from 'web3'

import sitcoin from '../../build/contracts/SITcoin.json'

// Creates the context that can be wrapped around consumers to deliver context
const WalletContext = createContext()
const platonMainnet = 100
const platonDevnet = 210309

const sitcoinAddress = process.env.NEXT_PUBLIC_SITCOIN_ADDRESS

export default function WalletProvider({ children }) {

    const router = useRouter()
    const [account, setAccount] = useState()
    const [network, setNetwork] = useState()
    const [web3, setWeb3] = useState()
    const [tokenContract, setTokenContract] = useState()
    const [tokenName, setTokenName] = useState()
    const [tokenSymbol, setTokenSymbol] = useState()
    const [tokenSupply, setTokenSupply] = useState()
    const [tokenBalance, setTokenBalance] = useState()
    const [refresh, setRefresh] = useState(0)

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
        else {
            if (web3 === undefined) {
                initializeWeb3();

                // Configure network
                console.log(`Current Chain: ${platon.networkVersion}`)
    
                platon.networkVersion === platonMainnet
                    ? setNetwork('PlatON Main Network')
                    : setNetwork('PlatON Test Network')
    
                console.log(`Current Network: ${network}`)
            }

            if (account) {
                getContractInfo();
            }

            // Change handler for the account switching
            platon.on('accountsChanged', (accounts) => {
                // Handle the new accounts, or lack thereof.
                // "accounts" will always be an array, but it can be empty.
                console.log('Account change event fired')

                accounts.length
                    // Truthy: Set new account as main account being used
                    ? setAccount(accounts[0])
                    // Falsy: Show error message
                    : Notify.warning('Account is not connected. Please connect account for more actions', {
                        clickToClose: true
                    });

                // Get information from token contract
                getContractInfo()
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
        }

    }, [account, network, refresh])

    const initializeWeb3 = async () => {
        // Initialize web3 instance
        let web3Instance = new Web3(platon)
        // Initialize Contract object
        let contract = await new web3Instance.platon.Contract(sitcoin.abi, sitcoinAddress)

        console.log(`Contract Obj: ${tokenContract}`)

        // Loads web3 instance from samurai wallet when page loads
        web3
            ? Notify.info('Web3 object already loaded', {
                clickToClose: true
            })
            : setWeb3(web3Instance);

        // Pre-loads the contract instance
        tokenContract
            ? Notify.info('Contract object already loaded', {
                clickToClose: true
            })
            : setTokenContract(contract)
    }

    const getContractInfo = async () => {
        try {
            // Get Token Name
            let name = await tokenContract.methods.name().call({ from: account })
            setTokenName(name)
            console.log(`Contract Name: ${tokenName}`)

            // Get Token Symbol
            let symbol = await tokenContract.methods.symbol().call({ from: account })
            setTokenSymbol(symbol)
            console.log(`Symbol: ${tokenSymbol}`)

            // Get Token Supply
            let supply = await tokenContract.methods.totalSupply().call({ from: account })
            setTokenSupply(supply)
            console.log(`Supply: ${tokenSupply}`)

            // Get User's token balance
            let balance = await tokenContract.methods.balanceOf(account).call({ from: account })
            setTokenBalance(balance)
            console.log(`Current Account Balance: ${tokenBalance}`)

            return true
        }
        catch (e) {
            return false
        }
    }

    // State variables for other pages to get context
    const walletState = {
        account,
        setAccount,
        network,
        tokenContract,
        tokenName,
        tokenSymbol,
        tokenSupply,
        tokenBalance,
        web3,
        refresh,
        setRefresh,
        getContractInfo,
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
        // console.log(`Current Address: ${platon.selectedAddress}`)

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
            Notify.info('Account already connected. Refreshing Info...', {
                clickToClose: true
            })
        }

        return platon.selectedAddress
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