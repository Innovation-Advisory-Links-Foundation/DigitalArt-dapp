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
   * @param tokenURI <BigNumber> - The IPFS url where to retrieve NFT metadata.
   * @param owner <BigNumber> - The address of the owner of the NFT.
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
