import React, { useState, useEffect } from 'react';
import { connectWallet, onAccountsChanged, onChainChanged, disconnectWallet } from './utils/Web3';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#dashboard' && walletAddress) {
        setIsLoggedIn(true);
      } else if (hash === '#dashboard' && !walletAddress) {
        // Redirect back to landing if no wallet
        window.location.hash = '';
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [walletAddress]);

  // Listen for account and network changes
  useEffect(() => {
    // Account changes
    onAccountsChanged((newAddress) => {
      if (newAddress) {
        setWalletAddress(newAddress);
      } else {
        handleLogout();
      }
    });

    // Network changes
    onChainChanged(() => {
      // Reload page on network change for safety
      window.location.reload();
    });
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      window.location.hash = 'dashboard';
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    setWalletAddress(null);
    window.location.hash = '';
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen selection:bg-[#DFFF00]/30 selection:text-black">
      <Navbar
        onLogin={handleConnectWallet}
        isLoggedIn={isLoggedIn}
        address={walletAddress}
        isConnecting={isConnecting}
      />

      {!isLoggedIn ? (
        <main>
          <Hero
            onLogin={handleConnectWallet}
            isConnecting={isConnecting}
            address={walletAddress}
          />



          <Features />

          <footer className="py-12 border-t border-gray-900 bg-black text-center text-gray-600 text-[10px] font-bold tracking-[0.2em] uppercase">
            <div className="max-w-7xl mx-auto px-4">
              <p>&copy; 2025 SENTINEL_SYS. DECENTRALIZED_DEFENSE_MESH. ALL_SIGNALS_RESERVED.</p>
              <div className="flex justify-center gap-8 mt-6">
                <a href="#" className="hover:text-neon transition-colors">[ PROTOCOL ]</a>
                <a href="#" className="hover:text-neon transition-colors">[ GOVERNANCE ]</a>
                <a href="#" className="hover:text-neon transition-colors">[ GITHUB ]</a>
                <a href="#" className="hover:text-neon transition-colors">[ API_DOCS ]</a>
              </div>
            </div>
          </footer>
        </main>
      ) : (
        <Dashboard onLogout={handleLogout} userAddress={walletAddress} />
      )}
    </div>
  );
};

export default App;
