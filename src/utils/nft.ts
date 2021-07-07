import { Contract } from "ethers"

/**
 * Retrieve every NFT from the smart contract events.
 * @returns Array<NFT> - Array containing the NFTs.
 */
export async function retrieveNfts(contract: Contract) {
  // Filter to 'Transfer' smart contract event.
  const filter = contract.filters.Transfer()
  const transferEvents = await contract.queryFilter(filter)

  const nfts: any[] = []
  const last = transferEvents.length

  for (
    let i = transferEvents.length - 1;
    i >= transferEvents.length - last;
    i--
  ) {
    // Get event info.
    const eventArgs = transferEvents[i].args as any

    // Get NFT blockchain data.
    const nftData = await contract.idToNFT(eventArgs.tokenId.toNumber())

    // Get NFT IPFS metadata.
    const response = await fetch(nftData.uri)

    // Push the NFT data.
    const nft = { ...nftData, metadata: { ...(await response.json()) } }
    nfts.push(nft)
  }

  return nfts
}

/**
 * Retrieve an NFT with a given id.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @param id <number> - The unique identifier of the NFT.
 * @returns NFT - The NFT data.
 */
export async function retrieveNft(contract: Contract, id: number) {
  // Read blockchain smart contract data.
  let nftData = await contract.idToNFT(id)

  // Get metadata from IPFS uri.
  const response = await fetch(nftData.uri)

  const nft = { ...nftData, metadata: { ...(await response.json()) } }
  return nft
}
