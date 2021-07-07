import React from "react"
import { NFT } from "../types/NFT"
import { MintNFTInputData } from "../types/TXInputData"

// Type for the Provider Context object.
export type ProviderContextType = {
  _nfts: Array<NFT>
  mintNFT: (data: MintNFTInputData) => Promise<any>
  _signerAddress: string
}

export default React.createContext<ProviderContextType | null>(null)
