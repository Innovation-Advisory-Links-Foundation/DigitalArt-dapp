import { BigNumber } from "ethers"

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

export type TokenPurchasedEvent = {
  tokenId: number
  oldOwner: string
  newOwner: string
  price: number
}

export type LicensePurchasedEvent = {
  tokenId: number
  durationInDays: number
  price: number
  endDateInMillis: number
  sender: string
}
