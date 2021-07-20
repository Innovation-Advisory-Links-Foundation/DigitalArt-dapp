import React from "react"
import { DigitalArtContextType } from "../context/DigitalArtContext"
import { DigitalArt } from "../types/DigitalArt"
import {
  retrieveLicensePurchasedEvent,
  retrieveNfts,
  retrieveTokenPurchasedEvent
} from "../utils/smartContract"
import {
  onDailyLicensePriceUpdated,
  onNFTMinted,
  onNFTPurchased,
  onSellingPriceUpdated
} from "../utils/listeners"
import {
  SafeMintTxInputData,
  NFT,
  BuyNFTInputData,
  BuyLicenseInputData,
  UpdateSellingPriceInputData,
  UpdateDailyLicensePriceInputData
} from "../types/Blockchain"
import webDetect from "../utils/webDetection"

// Hook for handling the custom Digital Art context istance.
export default function useDigitalArtContext(
  digitalArt: DigitalArt | undefined
): DigitalArtContextType {
  // The address of the current tx signer.
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

        if (nfts.length > 0) {
          // State update.
          setNfts(nfts)
        }
      }
    })()
  }, [digitalArt?.signer._address])

  // Set up a listener for NFT minted smart contract event.
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

  // Set up a listener for NFT purchased smart contract event.
  React.useEffect(() => {
    if (digitalArt) {
      return onNFTPurchased(digitalArt.contract, (tokenId, newOwner) => {
        setNfts(
          _nfts.length === 0
            ? [..._nfts]
            : _nfts.map((nft) => {
                if (Number(nft.id) === Number(tokenId)) {
                  nft.sellingPrice = 0
                  nft.dailyLicensePrice = 0
                  nft.owner = newOwner
                }
                return nft
              })
        )
      })
    }
  }, [digitalArt?.signer._address, _nfts])

  // Set up a listener for NFT selling price updated smart contract event.
  React.useEffect(() => {
    if (digitalArt) {
      return onSellingPriceUpdated(
        digitalArt.contract,
        (tokenId, newSellingPrice) => {
          setNfts(
            _nfts.length === 0
              ? [..._nfts]
              : _nfts.map((nft) => {
                  if (Number(nft.id) === Number(tokenId))
                    nft.sellingPrice = Number(newSellingPrice)

                  return nft
                })
          )
        }
      )
    }
  }, [digitalArt?.signer._address, _nfts])

  // Set up a listener for NFT daily license price updated smart contract event.
  React.useEffect(() => {
    if (digitalArt) {
      return onDailyLicensePriceUpdated(
        digitalArt.contract,
        (tokenId, newDailyLicensePrice) => {
          setNfts(
            _nfts.length === 0
              ? [..._nfts]
              : _nfts.map((nft) => {
                  if (Number(nft.id) === Number(tokenId))
                    nft.dailyLicensePrice = Number(newDailyLicensePrice)

                  return nft
                })
          )
        }
      )
    }
  }, [digitalArt?.signer._address, _nfts])

  /**
   * Upload the image to IPFS and sends a tx to mint the NFT.
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
   * Send a tx to buy the NFT.
   * @param data <BuyNFTInputData> - Necessary data to buy a NFT.
   */
  async function buyNFT(data: BuyNFTInputData) {
    if (digitalArt) {
      // Send the tx.
      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .purchaseNFT(data.id, Date.now(), { value: data.txValue })

      // Wait for tx confirmation.
      await tx.wait()
    }
  }

  /**
   * Send a tx to buy a license of usage for a specific NFT.
   * @param data <BuyLicenseInputData> - Necessary data to buy a license for a specific NFT.
   */
  async function buyLicense(data: BuyLicenseInputData) {
    if (digitalArt) {
      // Send the tx.
      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .purchaseLicense(data.id, data.days, Date.now(), {
          value: data.txValue
        })

      // Wait for tx confirmation.
      await tx.wait()
    }
  }

  /**
   * Send a tx to update the selling price for a specific NFT.
   * @param data <UpdateSellingPriceInputData> - Necessary data to update the selling price for a specific NFT.
   */
  async function updateSellingPrice(data: UpdateSellingPriceInputData) {
    if (digitalArt) {
      // Send the tx.
      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .updateSellingPrice(data.tokenId, data.newSellingPrice)

      // Wait for tx confirmation.
      await tx.wait()
    }
  }

  /**
   * Send a tx to update the daily license price for a specific NFT.
   * @param data <UpdateDailyLicensePriceInputData> - Necessary data to update the daily license price for a specific NFT.
   */
  async function updateDailyLicensePrice(
    data: UpdateDailyLicensePriceInputData
  ) {
    if (digitalArt) {
      // Send the tx.
      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .updateDailyLicensePrice(data.tokenId, data.newDailyLicensePrice)

      // Wait for tx confirmation.
      await tx.wait()
    }
  }

  /**
   * Return the 'TokenPurchased' smart contract events for a specific NFT.
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
   * Return the 'LicensePurchased' smart contract events for a specific NFT.
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
    updateSellingPrice,
    updateDailyLicensePrice,
    getTokenPurchasedEventsForNFT,
    getLicensePurchasedEventsForNFT
  }
}
