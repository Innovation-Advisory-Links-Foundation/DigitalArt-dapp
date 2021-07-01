import { Contract } from "ethers"
import React from "react"

// Type for the Provider Context object.
export type ProviderContextType = {
  _ethersProvider: any
  _ethersSigner: any
  _smartContract: Contract
  _ipfs: any
  handleOnConnect: () => {}
  retrieveNfts: () => Promise<any[]>
}

export default React.createContext<ProviderContextType | null>(null)
