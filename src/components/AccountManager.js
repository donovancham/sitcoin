

export async function setIdentityData(name, nickname, claim, proof) {
    let proofData = {
        claim: claim,
        proof: proof,
    }
    
    let accountData = {
        name: name,
        nickname: nickname,
    }

    // Maybe encrypt data here

    return accountData
}