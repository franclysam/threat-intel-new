
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
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

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d84F92";
    setWalletAddress(mockAddress);
    setIsConnecting(false);
    window.location.hash = 'dashboard';
  };

  const handleLogout = () => {
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
        setAddress={setWalletAddress} 
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
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
