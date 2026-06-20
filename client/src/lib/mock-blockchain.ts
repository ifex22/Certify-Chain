import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Mock Data Store
interface Cert {
  id: number;
  to: string;
  ipfsHash: string;
  recipientEmailHash: string;
  issuedAt: number;
}

const MOCK_CERTS: Record<number, Cert> = {
  101: {
    id: 101,
    to: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    ipfsHash: "QmXyZ...MOCK_HASH_1",
    recipientEmailHash: ethers.keccak256(ethers.toUtf8Bytes("user@example.com")),
    issuedAt: Date.now() - 10000000
  }
};

// Helper to simulate delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useMockBlockchain = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    await delay(800); // Fake connection delay
    
    const win = window as any;
    // Check if real metamask is present, otherwise mock
    if (win.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(win.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length) setAccount(accounts[0]);
      } catch (e) {
        console.warn("Metamask connection failed, falling back to mock", e);
        setAccount("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      }
    } else {
      // Mock account
      setAccount("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    }
    setIsConnecting(false);
  };

  const getCertificate = async (id: number) => {
    await delay(500);
    if (MOCK_CERTS[id]) {
      return MOCK_CERTS[id];
    }
    throw new Error("Certificate not found");
  };

  const issueCertificate = async (to: string, ipfsHash: string, email: string) => {
    await delay(1500); // Mining delay
    const newId = Math.floor(Math.random() * 1000) + 200;
    MOCK_CERTS[newId] = {
      id: newId,
      to,
      ipfsHash,
      recipientEmailHash: ethers.keccak256(ethers.toUtf8Bytes(email)),
      issuedAt: Date.now()
    };
    return newId;
  };

  return {
    account,
    connectWallet,
    isConnecting,
    getCertificate,
    issueCertificate
  };
};

// Mock Supabase Auth
export const useMockAuth = () => {
  const [user, setUser] = useState<{email: string} | null>(null);
  
  const login = async (email: string) => {
    await delay(600);
    setUser({ email });
    localStorage.setItem('mock_user', JSON.stringify({ email }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  useEffect(() => {
    const stored = localStorage.getItem('mock_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return { user, login, logout };
};
