
import React from 'react';

interface NavbarProps {
  onLogin: () => void;
  isLoggedIn: boolean;
  address: string | null;
  setAddress: (addr: string | null) => void;
  isConnecting?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, isLoggedIn, address, setAddress, isConnecting }) => {
  if (isLoggedIn) return null; // Hide navbar in dashboard

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-neon flex items-center justify-center relative">
             <div className="w-1.5 h-1.5 bg-white"></div>
          </div>
          <div className="text-white font-black text-lg tracking-tighter">SENTINEL_SYS</div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="hidden md:flex items-center gap-8 mr-4">
              <a href="#" className="text-[9px] font-black tracking-widest text-gray-500 hover:text-neon transition-all uppercase">Network</a>
              <a href="#" className="text-[9px] font-black tracking-widest text-gray-500 hover:text-neon transition-all uppercase">Ledger</a>
              <a href="#" className="text-[9px] font-black tracking-widest text-gray-500 hover:text-neon transition-all uppercase">Nodes</a>
           </div>

           <button 
             onClick={onLogin}
             disabled={isConnecting}
             className="bg-neon text-black px-6 py-2 font-black text-[10px] tracking-widest uppercase border border-neon hover:bg-black hover:text-neon transition-all flex items-center gap-3 disabled:opacity-50"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
