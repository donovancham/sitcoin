import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';

import NftMarketContext from '../context/NFTMarket';

export default function Marketplace() {
    return (
        <NftMarketContext>
            <Container>
            </Container>
        </NftMarketContext>
    )
}