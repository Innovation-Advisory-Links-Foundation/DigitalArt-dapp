/// <reference types="react-scripts" />

// Extends the global window object with the ethereum property for Metamask provider.
interface EthereumProvider {
  isMetaMask?: boolean
}
declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export default global
