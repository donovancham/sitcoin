import { createContext, useContext, useState, useEffect } from 'react'
import { connectSamurai, useWalletContext } from './WalletContext';
import nftMarket from '../../build/contracts/NFTMarket.json'


/**
 * @fileOverview The NFT Marketplace Context
 * @author Donovan Cham
 * 
 * @example
 * import NftMarketContext from '../context/NFTMarketContext'
 * import Marketplace from '../components/Marketplace'
 * 
 * export default function Homepage {
 *   return (
 *      <NftMarketContext>
 *        <Marketplace />
 *      </NftMarketContext>
 *   )
 * }
 */

/**
 * Context for NFT Marketplace. Gets information from `NFTMarket` contract 
 * and stores in states to be used in other components.
 * 
 * @see {@link module:Marketplace|Marketplace}
 * @module NftMarketProvider
 */



/**
 * Creates the NFT Market context that allows components to access states
 * @type {Context<any>} 
 */
const NftMarketContext = createContext()

/**
 * Load the `NFTMarket` contract address
 * @type {String}
 */
const nftMarketAddress = process.env.NEXT_PUBLIC_NFTMARKET_ADDRESS

export default function NftMarketProvider({ children }) {

    /**
     * Loads context variables from the wallet context. Requires this 
     * provider context to be wrapped inside the wallet context provider 
     * to be able to get the wallet context information.
     * 
     * @see {@link module:WalletProvider|WalletContext}
     * @const WalletContextState
     * @property {String} account - The wallet address of the user
     * @property {Dispatch<SetStateAction<String>>} setAccount - Sets 
     * the account for the user
     * @property {Object} web3 - The web3 instance
     * @property {Number} refresh - The refresh state counter
     */
    const {
        account,
        setAccount,
        web3,
        refresh,
    } = useWalletContext()

    /**
     * The context states required from the `NFTMarketContext`. States 
     * loaded hold information about the NFTs in the market and their 
     * statuses.
     * 
     * @const {Object} NFTMarketContextState
     * @property {Object} nftMarketContract The `NFTMarket` contract instance
     * @property {Dispatch<SetStateAction<Object>>} setNftMarketContract 
     * Sets the `NFTMarket` contract instance
     * @property {Array<Object>} allMarketItems Contains all listed NFTs 
     * @property {Dispatch<SetStateAction<Object>>} setAllMarketItems 
     * Sets the `allMarketItems` state
     * @property {Number} allMarketItemsCount The number of listed NFTs
     * @property {Dispatch<SetStateAction<Number>>} setAllMarketItemsCount 
     * Sets the `allMarketItemsCount` state
     * @property {Array<Object>} unsoldItems Contains all unsold NFTs
     * @property {Dispatch<SetStateAction<Object>>} setUnsoldItems 
     * Sets the `unsoldItems` state
     * @property {Number} unsoldItemsCount The number of unsold NFTs
     * @property {Dispatch<SetStateAction<Number>>} setUnsoldItemsCount 
     * Sets the `unsoldItemsCount` state
     * @property {Number} totalMarketItems Items currently in market, 
     * excludes unlisted items
     * @property {Dispatch<SetStateAction<Number>>} setTotalMarketItems 
     * Sets the `totalMarketItems` state
     * @property {Number} totalNftCount All NFTs minted since contract creation
     * @property {Dispatch<SetStateAction<Number>>} setTotalNftCount 
     * Sets the `totalNftCount` state
     * @property {Array<Object>} myOwnedNfts Contains all owned NFTs
     * @property {Dispatch<SetStateAction<Object>>} setMyOwnedNfts 
     * Sets the `myOwnedNfts` state
     * @property {Number} myOwnedNftCount The number of owned NFTs
     * @property {Dispatch<SetStateAction<Number>>} setMyOwnedNftCount 
     * Sets the `myOwnedNftCount` state
     * @property {Array<Object>} myNftCreations Contains all NFT creations 
     * @property {Dispatch<SetStateAction<Object>>} setMyNftCreations 
     * Sets the `myNftCreations` state
     * @property {Number} myCreationCount The number of NFT creations
     * @property {Dispatch<SetStateAction<Number>>} setMyCreationCount 
     * Sets the `myCreationCount` state
     * @property {Boolean} approvalStatus Indicates whether the `NFTMarket` 
     * contract is approved by the user to handle item sales on the user's 
     * behalf
     * @property {Dispatch<SetStateAction<Boolean>>} setApprovalStatus 
     * Sets the `approvalStatus` state
     */
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
    const [approvalStatus, setApprovalStatus] = useState(false)

    useEffect(() => {
        /**
         * Initializes wallet connection and ensures that the functions 
         * and the `NFTMarket` contract instance. If `NFTMarket` is loaded, 
         * market info for the context states will be loaded. Should be 
         * executed sequentially.
         * 
         * @async
         * @function init
         * @see {@link module:WalletProvider.connectSamurai|connectSamurai}
         * @see {@link module:NftMarketProvider~initMarketContract|initMarketContract}
         * @see {@link module:NftMarketProvider~getMarketInfo|getMarketInfo}
         */
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

    /**
     * Initialize the contract object and set the state.
     * 
     * @async
     * @function initMarketContract
     */
    const initMarketContract = async () => {
        // Initialize Contract object
        let contract = await new web3.platon.Contract(nftMarket.abi, nftMarketAddress)
        setNftMarketContract(contract)
    }

    /**
     * Gets the market information from the `NFTMarket` contract.
     * 
     * @async
     * @function getMarketInfo
     */
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

        // Get approval status
        let approved = await nftMarketContract.methods
            .isApprovedForAll(account, nftMarketContract.options.address)
            .call({ from: account })
            .catch((error) => {
                console.log(error)
                Report.failure(
                    'Error',
                    `${error.message} (${error.code})`,
                    'Okay'
                )
            }) 
        
        setApprovalStatus(approved)
    }

    /**
     * Array of states to be shared to other components.
     * 
     * @const nftMarketState
     * @property {Object} nftMarketContract The `NFTMarket` contract instance
     * @property {Array<Object>} allMarketItems Contains all listed NFTs 
     * @property {Number} allMarketItemsCount The number of listed NFTs
     * @property {Array<Object>} unsoldItems Contains all unsold NFTs
     * @property {Number} unsoldItemsCount The number of unsold NFTs
     * @property {Number} totalMarketItems NFTs in market, excluding unlisted
     * @property {Number} totalNftCount All NFTs minted since contract creation
     * @property {Array<Object>} myOwnedNfts Contains all owned NFTs
     * @property {Number} myOwnedNftCount The number of owned NFTs
     * @property {Array<Object>} myNftCreations Contains all NFT creations 
     * @property {Number} myCreationCount The number of NFT creations
     * @property {Boolean} approvalStatus Indicates whether the `NFTMarket` 
     * contract is approved by the user to handle item sales on the user's 
     * behalf
     * @property {function} getMarketInfo Refreshes all states by getting 
     * the market information from the `NFTMarket` contract
     */
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
        approvalStatus,
        getMarketInfo,
    }

    return (
        <NftMarketContext.Provider value={nftMarketState}>
            {children}
        </NftMarketContext.Provider>
    )
}

/**
 * Calling this function from another component allows access to the 
 * state array that is shared.
 * 
 * @function useNftMarketContext
 * @returns {Object} The state array that is shared
 */
export function useNftMarketContext() {
    return useContext(NftMarketContext)
}