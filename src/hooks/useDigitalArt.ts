import React from "react"
import { DigitalArtContextType } from "../context/DigitalArtContext"
import { DigitalArt } from "../types/DigitalArt"
import {
  retrieveLicensePurchasedEvent,
  retrieveNfts,
  retrieveTokenPurchasedEvent
} from "../utils/smartContract"
import { onNFTMinted } from "../utils/listeners"
import {
  SafeMintTxInputData,
  NFT,
  BuyNFTInputData,
  BuyLicenseInputData
} from "../types/Blockchain"

// Hook for handling the custom Metamask provider.
export default function useDigitalArtContext(
  digitalArt: DigitalArt | undefined
): DigitalArtContextType {
  // The address of the current signer.
  const [_signerAddress, setSignerAddress] = React.useState<string>("")
  // All NFTs minted and recorded in the smart contract.
  const [_nfts, setNfts] = React.useState<Array<NFT>>([])

  React.useEffect(() => {
    ;(async function () {
      // Check if MetaMask is properly connected, so we get a Signer object for the current account.
      if (digitalArt?.signer._address) {
        // Update signer.
        setSignerAddress(digitalArt.signer._address)

        // Read data from smart contracts.
        const nfts = await retrieveNfts(digitalArt.contract)

        // State update.
        if (nfts.length > 0) {
          setNfts(nfts)
        }
      }
    })()
  }, [digitalArt?.signer._address])

  // Listen to smart contract mint token events.
  React.useEffect(() => {
    if (digitalArt) {
      return onNFTMinted(digitalArt.contract, (nft) => {
        setNfts(
          _nfts.length === 0 ||
            Number(nft.id) !== Number(_nfts[_nfts.length - 1].id)
            ? [..._nfts, nft]
            : [..._nfts]
        )
      })
    }
  }, [digitalArt?.signer._address, _nfts])

  /**
   * Upload the image to IPFS and mint the NFT.
   * @param data <SafeMintTxInputData> - Necessary data to mint a NFT.
   */
  async function mintNFT(data: SafeMintTxInputData) {
    if (digitalArt) {
      // Upload image to IPFS.
      const imageCID = await digitalArt.ipfs.add(Buffer.from(data.image))

      // Upload NFT metadata to IPFS.
      const doc = JSON.stringify({
        title: data.title,
        description: data.description,
        creator: data.creator,
        year: data.year,
        image: `https://ipfs.io/ipfs/${imageCID[0].hash}`
      })
      const metadataCID = await digitalArt.ipfs.add(Buffer.from(doc))

      // Send the tx.
      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .safeMint(
          `https://ipfs.io/ipfs/${metadataCID[0].hash}`,
          data.sellingPrice,
          data.dailyLicensePrice
        )

      // Wait for tx confirmation.
      await tx.wait()
    }
  }

  /**
   * Buy the NFT.
   * @param data <BuyNFTInputData> - Necessary data to buy a NFT.
   */
  async function buyNFT(data: BuyNFTInputData) {
    if (digitalArt) {
      // Send the tx.
      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .purchaseNFT(data.id, { value: data.txValue })

      // Wait for tx confirmation.
      await tx.wait()
    }
  }

  /**
   * Buy a license of usage for a specific NFT.
   * @param data <BuyLicenseInputData> - Necessary data to buy a license for a specific NFT.
   */
  async function buyLicense(data: BuyLicenseInputData) {
    if (digitalArt) {
      // Send the tx.
      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .purchaseLicense(data.id, data.days, { value: data.txValue })

      // Wait for tx confirmation.
      await tx.wait()
    }
  }

  /**
   * Return the 'TokenPurchased' smart contract event for a specific NFT.
   * @param tokenId <number> - Unique identifier of the NFT.
   */
  async function getTokenPurchasedEventsForNFT(tokenId: number) {
    if (digitalArt) {
      // Get the TokenPurchased events.
      const purchases = await retrieveTokenPurchasedEvent(digitalArt.contract)

      // Filter for token id.
      const nftPurchases = purchases.filter(
        (purchase) => Number(purchase.tokenId) === tokenId
      )

      return nftPurchases
    }
  }

  /**
   * Return the 'LicensePurchased' smart contract event for a specific NFT.
   * @param tokenId <number> - Unique identifier of the NFT.
   */
  async function getLicensePurchasedEventsForNFT(tokenId: number) {
    if (digitalArt) {
      // Get the LicensesPurchased events.
      const purchases = await retrieveLicensePurchasedEvent(digitalArt.contract)

      // Filter for token id.
      const licensesPurchases = purchases.filter(
        (purchase) => Number(purchase.tokenId) === tokenId
      )

      return licensesPurchases
    }
  }

  return {
    _signerAddress,
    _nfts,
    mintNFT,
    buyNFT,
    buyLicense,
    getTokenPurchasedEventsForNFT,
    getLicensePurchasedEventsForNFT
  }
}
