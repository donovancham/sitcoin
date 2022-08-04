import { useIpfsContext } from '../context/IpfsContext';

/**
 * Component for IPFS, used to display IPFS connection information. This 
 * should be removed when IPFS is implemented on the backend as 
 * {@link IpfsContext} will be sufficient for the backend functionality.
 * 
 * @module Ipfs
 * @todo Remove once IPFS testing completed and no requirement for debug
 */

export default function Ipfs() {
    const { ipfs, setIpfs, id, version, isOnline } = useIpfsContext()

    // Returns when ipfs is not connected
    if (!ipfs || !id) {
        return <h4>Connecting to IPFS...</h4>
    }

    // Renders the information of the IPFS node connected
    return (
        <div>
            <h4 data-test="id">ID: {id.toString()}</h4>
            <h4 data-test="version">Version: {version}</h4>
            <h4 data-test="status">Status: {isOnline ? 'Online' : 'Offline'}</h4>
        </div>
    )
}