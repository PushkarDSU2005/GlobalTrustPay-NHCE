import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';

const Web3Context = createContext();

export function useWeb3() {
  return useContext(Web3Context);
}

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to use this application.");
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      setAccount(currentAccount);

      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const currentSigner = await browserProvider.getSigner();
      setSigner(currentSigner);

      const networkStats = await browserProvider.getNetwork();
      setNetwork(networkStats.name !== 'unknown' ? networkStats.name : 'Custom Network');

      const balanceWei = await browserProvider.getBalance(currentAccount);
      setBalance(parseFloat(formatEther(balanceWei)).toFixed(4));
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet(); // refresh balance, signer, etc.
        } else {
          setAccount(null);
          setBalance('0');
          setSigner(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const value = {
    connectWallet,
    account,
    balance,
    network,
    provider,
    signer,
    isConnecting
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
