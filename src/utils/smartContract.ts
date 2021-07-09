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

    // Get token updated data.
    const tokenData = await contract.idToNFT(eventArgs.tokenId)

    // Get NFT IPFS metadata.
    const response = await fetch(eventArgs.tokenURI)

    // Push the NFT data.
    const nft = {
      id: eventArgs.tokenId,
      sellingPrice: tokenData.sellingPrice,
      dailyLicensePrice: tokenData.dailyLicensePrice,
      uri: eventArgs.tokenURI,
      artist: tokenData.artist,
      owner: tokenData.owner,
      metadata: { ...(await response.json()) }
    }

    nfts.push(nft)
  }

  return nfts
}

/**
 * Retrieve every Token Purchased event from the smart contract events.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @returns Array<TokenPurchasedEvent> - Array containing the data from the Token Purchased events.
 */
export async function retrieveTokenPurchasedEvent(contract: Contract) {
  // Filter to 'TokenPurchased' smart contract event.
  const filter = contract.filters.TokenPurchased()
  const tokenPurchasedEvents = await contract.queryFilter(filter)

  const purchases: any[] = []
  const last = tokenPurchasedEvents.length

  for (
    let i = tokenPurchasedEvents.length - 1;
    i >= tokenPurchasedEvents.length - last;
    i--
  ) {
    // Get event info.
    const purchase = tokenPurchasedEvents[i].args as any

    // Push the data.
    purchases.push(purchase)
  }

  return purchases
}

/**
 * Retrieve every License Purchased event from the smart contract events.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @returns Array<TokenPurchasedEvent> - Array containing the data from the License Purchased events.
 */
export async function retrieveLicensePurchasedEvent(contract: Contract) {
  // Filter to 'LicensePurchased' smart contract event.
  const filter = contract.filters.LicensePurchased()
  const licensePurchasedEvents = await contract.queryFilter(filter)

  const purchases: any[] = []
  const last = licensePurchasedEvents.length

  for (
    let i = licensePurchasedEvents.length - 1;
    i >= licensePurchasedEvents.length - last;
    i--
  ) {
    // Get event info.
    const purchase = licensePurchasedEvents[i].args as any

    // Push the data.
    purchases.push(purchase)
  }

  return purchases
}
