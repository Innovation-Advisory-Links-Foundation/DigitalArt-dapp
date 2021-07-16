import { BigNumber, Contract } from "ethers"
import { NFT } from "../types/Blockchain"

/**
 * Bind a listener to the DigitalArt smart contract NFT mint event.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @param listener <(NFT) => void> - A listener for NFT mint event (TokenMinted).
 * @returns
 */
export function onNFTMinted(
  contract: Contract,
  listener: (nft: NFT) => void
): () => void {
  /**
   * Prepare a function for updating the state when a new NFT is minted.
   * @param tokenId <BigNumber> - BigNumber representation of the NFT unique identifier.
   * @param sellingPrice <BigNumber> - BigNumber representation of the NFT selling price.
   * @param dailyLicensePrice <BigNumber> - BigNumber representation of the NFT daily license price.
   * @param tokenURI <string> - The IPFS url where to retrieve NFT metadata.
   * @param owner <string> - The address of the owner of the NFT.
   */
  const getNFT = async (
    tokenId: BigNumber,
    sellingPrice: BigNumber,
    dailyLicensePrice: BigNumber,
    tokenURI: string,
    owner: string
  ) => {
    // Get metadata from IPFS uri.
    const response = await fetch(tokenURI)

    const nft = {
      id: Number(tokenId),
      sellingPrice: Number(sellingPrice),
      dailyLicensePrice: Number(dailyLicensePrice),
      uri: tokenURI,
      owner,
      artist: owner,
      metadata: await response.json()
    }

    listener(nft)
  }

  // Set listener handler for TokenMinted event.
  contract.on("TokenMinted", getNFT)

  // Event bind.
  return contract.off.bind(contract, "TokenMinted", getNFT)
}

/**
 * Bind a listener to the DigitalArt smart contract NFT token purchased event.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @param listener <(BigNumber) => void> - A listener for NFT token purchased event (TokenPurchased).
 * @returns
 */
export function onNFTPurchased(
  contract: Contract,
  listener: (tokenId: BigNumber, newOwner: string) => void
): () => void {
  /**
   * Prepare a function for updating the state when a NFT is purchased.
   * @param tokenId <BigNumber> - BigNumber representation of the NFT unique identifier.
   * @param oldOwner <string> - The address of the old owner of the NFT.
   * @param newOwner <string> - The address of the new owner of the NFT.
   * @param price <BigNumber> - BigNumber representation of the amount paid to buy the NFT.
   * @param timestamp <BigNumber> - Date and time when the tx has been sent.
   */
  const getPurchasedTokenId = async (
    tokenId: BigNumber,
    oldOwner: string,
    newOwner: string,
    price: BigNumber,
    timestamp: BigNumber
  ) => {
    listener(tokenId, newOwner)
  }

  // Set listener handler for TokenMinted event.
  contract.on("TokenPurchased", getPurchasedTokenId)

  // Event bind.
  return contract.off.bind(contract, "TokenPurchased", getPurchasedTokenId)
}

/**
 * Bind a listener to the DigitalArt smart contract NFT selling price updated event.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @param listener <(NFT) => void> - A listener for NFT selling price updated event (SellingPriceUpdated).
 * @returns
 */
export function onSellingPriceUpdated(
  contract: Contract,
  listener: (tokenId: BigNumber, newSellingPrice: BigNumber) => void
): () => void {
  /**
   * Prepare a function for updating the state when there is a change in the NFT selling price.
   * @param tokenId <BigNumber> - BigNumber representation of the NFT unique identifier.
   * @param oldSellingPrice <BigNumber> - BigNumber representation of the NFT old selling price.
   * @param newSellingPrice <BigNumber> - BigNumber representation of the NFT new selling price.
   */
  const getNewSellingPrice = async (
    tokenId: BigNumber,
    oldSellingPrice: BigNumber,
    newSellingPrice: BigNumber
  ) => {
    listener(tokenId, newSellingPrice)
  }

  // Set listener handler for SellingPriceUpdated event.
  contract.on("SellingPriceUpdated", getNewSellingPrice)

  // Event bind.
  return contract.off.bind(contract, "SellingPriceUpdated", getNewSellingPrice)
}

/**
 * Bind a listener to the DigitalArt smart contract NFT daily license price updated event.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @param listener <(NFT) => void> - A listener for NFT daily license price updated event (DailyLicensePriceUpdated).
 * @returns
 */
export function onDailyLicensePriceUpdated(
  contract: Contract,
  listener: (tokenId: BigNumber, newDailyLicensePrice: BigNumber) => void
): () => void {
  /**
   * Prepare a function for updating the state when there is a change in the NFT daily license price.
   * @param tokenId <BigNumber> - BigNumber representation of the NFT unique identifier.
   * @param oldDailyLicensePrice <BigNumber> - BigNumber representation of the NFT old daily license price.
   * @param newDailyLicensePrice <BigNumber> - BigNumber representation of the NFT new daily license price.
   */
  const getNewDailyLicensePrice = async (
    tokenId: BigNumber,
    oldDailyLicensePrice: BigNumber,
    newDailyLicensePrice: BigNumber
  ) => {
    listener(tokenId, newDailyLicensePrice)
  }

  // Set listener handler for DailyLicensePriceUpdated event.
  contract.on("DailyLicensePriceUpdated", getNewDailyLicensePrice)

  // Event bind.
  return contract.off.bind(
    contract,
    "DailyLicensePriceUpdated",
    getNewDailyLicensePrice
  )
}
