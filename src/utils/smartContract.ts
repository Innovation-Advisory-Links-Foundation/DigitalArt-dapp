import { Contract } from "ethers"

/**
 * Retrieve every NFT from the smart contract events.
 * @returns Array<NFT> - Array containing the NFTs.
 */
export async function retrieveNfts(contract: Contract) {
  // Filter to 'TokenMinted' smart contract event.
  const filter = contract.filters.TokenMinted()
  const tokenMintedEvents = await contract.queryFilter(filter)

  const nfts: any[] = []
  const last = tokenMintedEvents.length

  for (
    let i = tokenMintedEvents.length - 1;
    i >= tokenMintedEvents.length - last;
    i--
  ) {
    // Get event info.
    const eventArgs = tokenMintedEvents[i].args as any
    console.log(eventArgs)
    // Get NFT IPFS metadata.
    const response = await fetch(eventArgs.tokenURI)

    // Push the NFT data.
    const nft = {
      id: eventArgs.tokenId,
      sellingPrice: eventArgs.sellingPrice,
      dailyLicensePrice: eventArgs.dailyLicensePrice,
      uri: eventArgs.tokenURI,
      artist: eventArgs.owner,
      owner: eventArgs.owner,
      metadata: { ...(await response.json()) }
    }

    nfts.push(nft)
  }

  return nfts
}
