import { Contract, ethers } from "ethers"
import React from "react"
import { ProviderContextType } from "../context/ProviderContextType"
import config from "../config"
import IPFS from "ipfs-api"

// Hook for handling the custom Metamask provider.
export default function useProviderContext(): ProviderContextType {
  let [_provider, setProvider] = React.useState<any>() // MetaMask raw provider.
  let [_ethersProvider, setEthersProvider] = React.useState<any>() // Ethers Web3-wrapped provider.
  let [_ethersSigner, setEthersSigner] = React.useState<any>() // Signer object for the current connected account with MetaMask.
  let [_smartContract, setSmartContract] = React.useState<any>()
  let [_ipfs, setIpfs] = React.useState<any>()

  React.useEffect(() => {
    const init = async () => {
      // Check for an injected provider in the browser.
      try {
        // Ethereum injected provider on global window object.
        const ethereumProvider = window.ethereum

        startApp(ethereumProvider)
      } catch (error) {
        throw error
      }

      /**
       * Handle the entire logic for bootstrapping the DApp w/ Metamask and Ethersjs (provider, current signer, etc.).
       * @param _ethereumProvider any - Injected Ethereum provider in the browser.
       */
      async function startApp(_ethereumProvider: any) {
        if (!_ethereumProvider.isMetaMask) {
          alert("Do you have multiple wallets installed?")
          return
        }

        // Request Metamask account connection permissions.
        await _ethereumProvider.request({ method: "eth_accounts" })

        // Wrap the Metamask provider to Ethers Web3Provider.
        const _ethersProvider = new ethers.providers.Web3Provider(
          _ethereumProvider
        )

        // Get the current Signer if the Metamask account is already connected.
        const signer = _ethersProvider.getSigner(
          (await _ethersProvider.listAccounts())[0]
        )
        setEthersSigner(signer)

        // Listener for account changes.
        _ethereumProvider.on(
          "accountsChanged",
          async (accounts: Array<string>) => {
            if (accounts[0] !== signer._address) {
              let signer = _ethersProvider.getSigner(
                (await _ethersProvider.listAccounts())[0]
              )
              setEthersSigner(signer)
            }
          }
        )

        // Listener for network changes.
        _ethereumProvider.on("chainChanged", (chainId: string) => {
          window.location.reload()
        })

        // Set the DigitalArt smart contract instance.
        setSmartContract(
          new Contract(config.contractAddress, config.abi, signer)
        )

        // Set the providers.
        setProvider(_ethereumProvider)
        setEthersProvider(_ethersProvider)
        setIpfs(
          new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" })
        )
      }
    }

    init()
  }, [])

  /**
   * Connect the Metamask account w/ the DApp.
   */
  const handleOnConnect = async () => {
    await _provider.request({ method: "eth_requestAccounts" })

    let signer = await _ethersProvider.getSigner(
      (
        await _ethersProvider.listAccounts()
      )[0]
    )
    localStorage.setItem("user_address", signer._address)

    setEthersSigner(signer)
  }

  return {
    _ethersProvider,
    _ethersSigner,
    _smartContract,
    _ipfs,
    handleOnConnect
  }
}
