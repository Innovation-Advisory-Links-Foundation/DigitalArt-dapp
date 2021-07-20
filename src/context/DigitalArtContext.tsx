import React from "react"
import {
  SafeMintTxInputData,
  NFT,
  BuyNFTInputData,
  BuyLicenseInputData,
  UpdateDailyLicensePriceInputData,
  UpdateSellingPriceInputData,
  RecordIPRInfringmentAttemptsInputData
} from "../types/Blockchain"

// Type for the context object for Digital Art core business logic.
export type DigitalArtContextType = {
  _signerAddress: string
  _nfts: Array<NFT>
  mintNFT: (data: SafeMintTxInputData) => Promise<any>
  buyNFT: (data: BuyNFTInputData) => Promise<any>
  buyLicense: (data: BuyLicenseInputData) => Promise<any>
  updateSellingPrice: (data: UpdateSellingPriceInputData) => Promise<any>
  updateDailyLicensePrice: (
    data: UpdateDailyLicensePriceInputData
  ) => Promise<any>
  recordIPRInfringementAttempts: (
    data: RecordIPRInfringmentAttemptsInputData
  ) => Promise<any>
  getTokenPurchasedEventsForNFT: (tokenId: number) => Promise<any>
  getLicensePurchasedEventsForNFT: (tokenId: number) => Promise<any>
  getInfringmentAttemptsRecordedEventForNFT: (tokenId: number) => Promise<any>
}

export default React.createContext<DigitalArtContextType | null>(null)
