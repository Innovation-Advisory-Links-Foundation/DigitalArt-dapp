import { Contract, providers } from "ethers"

export type DigitalArt = {
  injectedProvider: any
  provider: providers.Web3Provider
  signer: providers.JsonRpcSigner
  contract: Contract
  ipfs: any
}
