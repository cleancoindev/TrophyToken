import Web3 from "web3";

const getWeb3 = async (requireAccounts, resolve, reject) => {
  // Modern dapp browsers...
  if (requireAccounts) {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Accounts now exposed
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    // Legacy dapp browsers...
    } else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const web3 = new Web3(window.web3.currentProvider);
      console.log("Injected web3 detected.");
      resolve(web3);
    }
  }

  let defaultNetwork;
  if (process.env.NODE_ENV === 'production') {
    defaultNetwork = process.env.REACT_APP_PROD_NETWORK;
  } else {
    defaultNetwork = process.env.REACT_APP_DEV_NETWORK;
  }
  const provider = new Web3.providers.HttpProvider(defaultNetwork);
  const web3 = new Web3(provider);
  console.log("No web3 instance injected, using default provider.");
  resolve(web3);
}

const getWeb3Promise = requireAccounts =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", () => {
      getWeb3(requireAccounts, resolve, reject);
    });

    // If document is already loaded, no race conditions are possible.
    if (document.readyState === 'complete') {
      getWeb3(requireAccounts, resolve, reject);
    }
  });

export default getWeb3Promise;
