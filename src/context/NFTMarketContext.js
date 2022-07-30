import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { connectSamurai, useWalletContext } from './WalletContext';

import nftMarket from '../../build/contracts/NFTMarket.json'

// Creates the context that can be wrapped around consumers to deliver context
const NftMarketContext = createContext()

// Load the nftMarket Address
const nftMarketAddress = process.env.NEXT_PUBLIC_NFTMARKET_ADDRESS

export default function NftMarketProvider({ children }) {

    // Load context variables
    const {
        account,
        setAccount,
        web3,
        refresh,
    } = useWalletContext()

    const [nftMarketContract, setNftMarketContract] = useState()
    const [allMarketItems, setAllMarketItems] = useState()
    const [allMarketItemsCount, setAllMarketItemsCount] = useState()
    const [unsoldItems, setUnsoldItems] = useState()
    const [unsoldItemsCount, setUnsoldItemsCount] = useState()
    const [totalMarketItems, setTotalMarketItems] = useState()          // Items currently in market, excludes unlisted items
    const [totalNftCount, setTotalNftCount] = useState()                // All items minted since contract creation
    const [myOwnedNfts, setMyOwnedNfts] = useState()
    const [myOwnedNftCount, setMyOwnedNftCount] = useState()
    const [myNftCreations, setMyNftCreations] = useState()
    const [myCreationCount, setMyCreationCount] = useState()

    useEffect(() => {
        // Put all functions in async mode to load sequentially
        const init = async () => {
            // Load wallet settings
            if (account === undefined) {
                console.log(account)
                // Sets wallet account
                setAccount(await connectSamurai(web3))
                console.log(account)
            }

            // Ensure web3 is loaded
            if (web3 !== undefined) {
                // Set NFT Market contract instance
                if (nftMarketContract === undefined) {
                    // Initialize contract object
                    await initMarketContract()
                }

                // Gets all market info each time
                if (nftMarketContract !== undefined) {
                    await getMarketInfo()
                }
            }
        }

        init()

    }, [account, nftMarketContract, refresh])

    const initMarketContract = async () => {
        // Initialize Contract object
        let contract = await new web3.platon.Contract(nftMarket.abi, nftMarketAddress)
        setNftMarketContract(contract)
    }

    const getMarketInfo = async () => {
        // Get the all items published on the market
        let listings = await nftMarketContract.methods.getAllMarketItems().call({ from: account })
        setAllMarketItems(listings['allItems'])
        setAllMarketItemsCount(listings['count'])
        console.log(`Market Listings (${allMarketItemsCount}): `)
        console.log(allMarketItems)

        // Get the all unsold items published on the market
        let unsoldListings = await nftMarketContract.methods.getUnsoldItems().call({ from: account })
        setUnsoldItems(unsoldListings['unsold'])
        setUnsoldItemsCount(unsoldListings['count'])
        console.log(`Unsold Items (${unsoldItemsCount}): `)
        console.log(unsoldItems)

        // Get total number of items on the market, excluding unlisted items
        let listingCount = await nftMarketContract.methods.getTotalMarketItems().call({ from: account })
        setTotalMarketItems(listingCount)
        console.log(`Market listing count: ${totalMarketItems}`)

        // Get total count
        let nftCount = await nftMarketContract.methods.getTotalNFTCount().call({ from: account })
        setTotalNftCount(nftCount)
        console.log(`Total NFT Count: ${totalNftCount}`)

        // Get the total number of NFT owned (minted and bought) by the user
        let myNfts = await nftMarketContract.methods.myOwnedNFTs().call({ from: account })
        setMyOwnedNfts(myNfts['_myNFTs'])
        setMyOwnedNftCount(myNfts['count'])
        console.log(`My owned NFTs (${myOwnedNftCount}): `)
        console.log(myOwnedNfts)

        // Get all the NFT that is created by the author
        // Get number of NFTs the author created
        let nftCreations = await nftMarketContract.methods.getMyNFTCreations().call({ from: account })
        setMyNftCreations(nftCreations['_myNFTs'])
        setMyCreationCount(nftCreations['count'])
        console.log(`My NFT Creations (${myCreationCount}): `)
        console.log(myNftCreations)
    }

    // State variables for other pages to get context
    const nftMarketState = {
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
    }

    return (
        <NftMarketContext.Provider value={nftMarketState}>
            {children}
        </NftMarketContext.Provider>
    )
}

export function useNftMarketContext() {
    return useContext(NftMarketContext)
}