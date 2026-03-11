import React, { useState } from 'react';

const Navbar = ({ onLogin, isLoggedIn, address, isConnecting }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoggedIn) return null; // Hide navbar in dashboard

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-6 md:py-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto bg-black/20 backdrop-blur-md border border-white/5 p-4 md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-neon flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 bg-white"></div>
          </div>
          <div className="text-white font-black text-lg tracking-tighter">SENTINEL_SYS</div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8 mr-4">
            <a href="#features" className="text-[9px] font-black tracking-widest text-gray-500 hover:text-neon transition-all uppercase">Network</a>
            <a href="#about" className="text-[9px] font-black tracking-widest text-gray-500 hover:text-neon transition-all uppercase">Ledger</a>
            <a href="#docs" className="text-[9px] font-black tracking-widest text-gray-500 hover:text-neon transition-all uppercase">Nodes</a>
          </div>

          <button
            onClick={onLogin}
            disabled={isConnecting}
            className="hidden md:flex bg-neon text-black px-6 py-2 font-black text-[10px] tracking-widest uppercase border border-neon hover:bg-black hover:text-neon transition-all items-center gap-3 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                CONNECTING...
              </>
            ) : address ? (
              `[ ${address.slice(0, 6)}...${address.slice(-4)} ]`
            ) : (
              'CONNECT_WALLET'
            )}
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neon p-2"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/95 z-[90] p-12 flex flex-col justify-center gap-12 pointer-events-auto animate-in fade-in duration-300">
          <div className="flex flex-col gap-8 text-center">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-widest text-white hover:text-neon uppercase">Network</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-widest text-white hover:text-neon uppercase">Ledger</a>
            <a href="#docs" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-widest text-white hover:text-neon uppercase">Nodes</a>
          </div>

          <button
            onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
            disabled={isConnecting}
            className="bg-neon text-black px-8 py-4 font-black text-sm tracking-widest uppercase border border-neon hover:bg-black hover:text-neon transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isConnecting ? 'CONNECTING...' : address ? `[ ${address.slice(0, 6)}... ]` : 'CONNECT_WALLET'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
