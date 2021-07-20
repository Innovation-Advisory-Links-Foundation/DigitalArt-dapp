import { Contract, providers, Wallet } from "ethers"

export type DigitalArt = {
  injectedProvider: any
  provider: providers.Web3Provider
  signer: providers.JsonRpcSigner
  marketplaceSigner: Wallet
  contract: Contract
  ipfs: any
}
