import { useIpfsContext } from '../context/IpfsContext';

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