import { BigNumber, Contract } from "ethers"
import { NFT } from "../types/NFT"
import { retrieveNft } from "./nft"

/**
 * Bind a listener to the DigitalArt smart contract NFT mint event.
 * @param contract <Contract> - The DigitalArt smart contract istance.
 * @param listener <(NFT) => void> - A listener for NFT mint event (Transfer).
 * @returns
 */
export function onNFTMinted(
  contract: Contract,
  listener: (nft: NFT) => void
): () => void {
  /**
   * Prepare a function for updating the state when a new NFT is minted.
   * @param tokenId <BigNumber> - BigNumber representation of the NFT unique identifier
   */
  const getNFT = async (from: string, to: string, tokenId: BigNumber) => {
    const nft = await retrieveNft(contract, Number(tokenId))

    listener(nft)
  }

  // Set listener handler for Transfer event.
  contract.on("Transfer", getNFT)

  // Event bind.
  return contract.off.bind(contract, "Transfer", getNFT)
}
