import { createContext, useContext, useState, useEffect } from 'react'

const IdentityContext = createContext()

export default function IdentityProvider({ children }) {
    const [] = useState();

    useEffect(() => {

    }, [])

    const identityState = {

    }

    return (
        <IdentityContext.Provider value={identityState}>
            {children}
        </IdentityContext.Provider>
    )
}

export function useIdentityContext() {
    return useContext(IdentityContext)
}