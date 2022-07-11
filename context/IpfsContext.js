import { createContext, useContext, useState, useEffect } from 'react'
import { create } from 'ipfs-http-client'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useRouter } from "next/router";


const IpfsContext = createContext()

export default function IpfsProvider({ children }) {
    // Configured to connect to locally running `ipfs daemon` instance
    const localNode = "http://localhost:5001"
    const router = useRouter()

    const [id, setId] = useState(null);
    const [ipfs, setIpfs] = useState(null);
    const [version, setVersion] = useState(null);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const init = async () => {
            // If IPFS is already running, skip other steps
            if (ipfs) return

            try {
                // Attempts to connect to IPFS
                const node = await create(localNode)

                // Gets information about the node
                const nodeId = await node.id();
                const nodeVersion = await node.version();
                const nodeIsOnline = node.isOnline();

                // Sets the information of the nodes in the state
                setIpfs(node);
                setId(nodeId.id);
                setVersion(nodeVersion.version);
                setIsOnline(nodeIsOnline);
            }
            catch (e) {
                Notify.failure(`The IPFS node is not connected. Please restart the IPFS node and try again. ${e}`)
            }
        }

        init()

    }, [ipfs]);

    const ipfsState = {
        ipfs,
        setIpfs,
        id,
        version,
        isOnline,
    }

    return (
        <IpfsContext.Provider value={ipfsState}>
            {children}
        </IpfsContext.Provider>
    )
}

export function useIpfsContext() {
    return useContext(IpfsContext)
}