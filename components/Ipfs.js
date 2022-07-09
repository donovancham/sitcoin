import { useState, useEffect } from 'react'
import { create } from 'ipfs-http-client'
import { Report } from 'notiflix/build/notiflix-report-aio';
import { useRouter } from "next/router";

/**
 * Initializes the IPFS node
 * 
 * @returns Renders the connected IPFS node information
 */
const IpfsComponent = () => {
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
                const node = await create(localNode)
                console.log(node)

                const nodeId = await node.id();
                const nodeVersion = await node.version();
                const nodeIsOnline = node.isOnline();

                setIpfs(node);
                setId(nodeId.id);
                setVersion(nodeVersion.version);
                setIsOnline(nodeIsOnline);
            }
            catch (e) {
                Report.failure(
                    'Connection Error',
                    `The IPFS node is not connected. ${e}`,
                    'Retry',
                    () => {
                        router.reload()
                    }
                )
            }
        }

        init()
    }, [ipfs]);

    if (!ipfs || !id) {
        return <h4>Connecting to IPFS...</h4>
    }

    return (
        <div>
            <h4 data-test="id">ID: {id.toString()}</h4>
            <h4 data-test="version">Version: {version}</h4>
            <h4 data-test="status">Status: {isOnline ? 'Online' : 'Offline'}</h4>
        </div>
    )
}

export default IpfsComponent