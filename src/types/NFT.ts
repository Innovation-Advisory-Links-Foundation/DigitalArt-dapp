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
