import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { useWalletContext } from './WalletContext';

import nftMarket from '../../build/contracts/NFTMarket.json'

// Creates the context that can be wrapped around consumers to deliver context
const NftMarketContext = createContext()

// Load the nftMarket Address
const nftMarketAddress = process.env.NEXT_PUBLIC_NFTMARKET_ADDRESS

export default function NftMarketProvider({ children }) {

    // Load context variables
    const {
        account,
        web3,
        tokenContract,
    } = useWalletContext()

    const [nftMarketContract, setNftMarketContract] = useState()
    const [allMarketItems, setAllMarketItems] = useState()
    const [unsoldItems, setUnsoldItems] = useState()
    // Items currently in market, excludes unlisted items
    const [totalMarketItems, setTotalMarketItems] = useState()
    // All items minted since contract creation
    const [totalNftCount, setTotalNftCount] = useState()
    const [myOwnedNfts, setMyOwnedNfts] = useState()
    const [myOwnedNftCount, setMyOwnedNftCount] = useState()
    const [myNftCreations, setMyNftCreations] = useState()
    const [myCreationCount, setMyCreationCount] = useState()

    useEffect(() => {
        const initMarketContract = async () => {
            // Initialize Contract object
            let contract = await new web3.platon.Contract(nftMarket.abi, nftMarketAddress)
            setNftMarketContract(contract)
        }

        const getMarketInfo = async () => {
            // Get the all items published on the market
            let listings = await nftMarketContract.methods.getAllMarketItems().call({ from: account })
            setAllMarketItems(listings)
            console.log(`Market Listings: ${allMarketItems}`)

            // Get the all unsold items published on the market
            let unsoldListings = await nftMarketContract.methods.getUnsoldItems().call({ from: account })
            setUnsoldItems(unsoldListings)
            console.log(`Unsold Items: ${unsoldItems}`)

            // Get total number of items on the market, excluding unlisted items
            let listingCount = await nftMarketContract.methods.getTotalMarketItems().call({ from: account })
            setTotalMarketItems(listingCount)
            console.log(`Market listing count: ${totalMarketItems}`)

            // Get total count
            let nftCount = await nftMarketContract.methods.getTotalNFTCount().call({ from: account })
            setTotalNftCount(nftCount)
            console.log(`Total NFT Count: ${totalNftCount}`)

            // Get the total number of NFT owned (minted and bought) by the user
            let myNfts, numberOfNfts = await nftMarketContract.methods.myOwnedNFTs().call({ from: account })
            setMyOwnedNfts(myNfts)
            setMyOwnedNftCount(numberOfNfts)
            console.log(`My owned NFTs (${myOwnedNftCount}): ${myOwnedNfts}`)

            // Get all the NFT that is created by the author
            // Get number of NFTs the author created
            let nftCreations, creationCount = await nftMarketContract.methods.getMyNFTCreations().call({ from: account })
            setMyNftCreations(nftCreations)
            setMyCreationCount(creationCount)
            console.log(`My NFT Creations (${myCreationCount}): ${myNftCreations}`)
        }

        if (web3 !== undefined) {
            // Set NFT Market contract instance
            nftMarketContract
                // Gets all market info each time
                ? getMarketInfo()
                // Initialize contract object
                : initMarketContract()
        }
    }, [web3])

    // State variables for other pages to get context
    const nftMarketState = {
        nftMarketContract,
        allMarketItems,
        unsoldItems,
        totalMarketItems,
        totalNftCount,
        myOwnedNfts,
        myOwnedNftCount,
        myNftCreations,
        myCreationCount,
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