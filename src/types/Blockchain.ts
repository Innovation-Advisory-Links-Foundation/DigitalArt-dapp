import { BigNumber } from "ethers"

/** SMART CONTRACT OBJECTS */
export type NFT = {
  id: number
  sellingPrice: number
  dailyLicensePrice: number
  uri: string
  artist: string
  owner: string
  metadata: NFTMetadata
}

export type NFTMetadata = {
  title: string
  description: string
  creator: string
  year: number
  image: string
}

/** SMART CONTRACT EVENTS */
export type TokenPurchasedEvent = {
  tokenId: number
  oldOwner: string
  newOwner: string
  price: number
  timestamp: number
}

export type LicensePurchasedEvent = {
  tokenId: number
  durationInDays: number
  price: number
  endDateInMillis: number
  sender: string
  timestamp: number
}

/** TX INPUT DATA */
export type SafeMintTxInputData = {
  title: string
  description: string
  creator: string
  year: string
  image: any
  sellingPrice: string
  dailyLicensePrice: string
}

export type BuyNFTInputData = {
  id: number
  txValue: BigNumber
}

export type BuyLicenseInputData = {
  id: number
  days: number
  txValue: BigNumber
}

export type UpdateSellingPriceInputData = {
  tokenId: number
  newSellingPrice: string
}

export type UpdateDailyLicensePriceInputData = {
  tokenId: number
  newDailyLicensePrice: string
}
