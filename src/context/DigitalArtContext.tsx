import React from "react"
import { SafeMintTxInputData, NFT } from "../types/Blockchain"

// Type for the context object for Digital Art core business logic.
export type DigitalArtContextType = {
  _signerAddress: string
  _nfts: Array<NFT>
  mintNFT: (data: SafeMintTxInputData) => Promise<any>
}

export default React.createContext<DigitalArtContextType | null>(null)
