import React, { useState, useEffect } from 'react';
import ReportTab from './dashboard/Reportstab';
import ScannerTab from './dashboard/ScannerTab';
import CommunityTab from './dashboard/Communitytab';
import RewardsTab from './dashboard/Rewardstab';
import ProfileTab from './dashboard/Profiletab';
import { getUserStats } from '../services/Apiservice';

const DashboardTab = {
  REPORTS: 'reports',
  SCANNER: 'scanner',
  COMMUNITY: 'community',
  REWARDS: 'rewards',
  PROFILE: 'profile'
};

const Dashboard = ({ onLogout, userAddress }) => {
  const [activeTab, setActiveTab] = useState(DashboardTab.REPORTS);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userAddress) return;
    const loadBalance = async () => {
      try {
        const stats = await getUserStats(userAddress);
        if (stats && stats.tokensEarned !== undefined) {
          setTokenBalance(stats.tokensEarned.toString());
        }
      } catch (error) {
        console.error('Error loading balance:', error);
      }
    };
    loadBalance();
    const interval = setInterval(loadBalance, 10000); // Polling every 10s for real-time updates
    return () => clearInterval(interval);
  }, [userAddress]);

  const renderTabContent = () => {
    switch (activeTab) {
      case DashboardTab.REPORTS: return <ReportTab userAddress={userAddress} />;
      case DashboardTab.SCANNER: return <ScannerTab />;
      case DashboardTab.COMMUNITY: return <CommunityTab userAddress={userAddress} />;
      case DashboardTab.REWARDS: return <RewardsTab userAddress={userAddress} />;
      case DashboardTab.PROFILE: return <ProfileTab userAddress={userAddress} onLogout={onLogout} />;
      default: return <ReportTab userAddress={userAddress} />;
    }
  };

  const navItems = [
    {
      id: DashboardTab.REPORTS, label: 'COMMAND CENTER', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
      )
    },
    {
      id: DashboardTab.SCANNER, label: 'DIAGNOSTICS', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      )
    },
    {
      id: DashboardTab.COMMUNITY, label: 'INTEL LEDGER', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      )
    },
    {
      id: DashboardTab.REWARDS, label: 'VAULT_ACCESS', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      )
    },
    {
      id: DashboardTab.PROFILE, label: 'IDENTITY_CORE', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      )
    },
  ];

  return (
    <div className="flex min-h-screen bg-black overflow-hidden font-mono">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-gray-900 flex flex-col pt-6 pb-0 z-[70] transition-transform duration-300 transform lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-8 mb-16 flex items-start gap-3">
          <div className="w-10 h-10 border border-neon flex items-center justify-center relative">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute inset-0 border border-white/10 m-1"></div>
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-tighter">SENTINEL</div>
            <div className="text-neon text-[8px] font-bold tracking-[0.2em]">CONTROL PANEL</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-6 px-8 py-5 text-[10px] font-black tracking-[0.2em] transition-all relative group ${activeTab === item.id
                ? 'bg-gradient-to-r from-neon/10 to-transparent text-neon'
                : 'text-gray-600 hover:text-gray-300'
                }`}
            >
              {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon shadow-[0_0_10px_#DFFF00]"></div>}
              <span className={`${activeTab === item.id ? 'text-neon' : 'text-gray-700'}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-6 px-8 py-6 text-[10px] font-black tracking-[0.2em] text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-all group border-t border-gray-900 uppercase"
        >
          <svg className="w-5 h-5 text-red-600 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          TERMINATE_SESSION
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 lg:h-24 border-b border-gray-900 flex items-center justify-between px-6 lg:px-12 bg-black/50 backdrop-blur-sm z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-neon p-2 -ml-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-xl lg:text-3xl font-black text-white tracking-tighter">UPLINK_TERMINAL <span className="text-neon">01</span></h1>
              </div>
              <div className="hidden sm:flex items-center gap-2 mt-1">
                <div className="text-[9px] text-gray-600 font-bold tracking-[0.3em] uppercase">Status: </div>
                <div className="text-[9px] text-gray-400 font-bold tracking-[0.3em] uppercase">Encrypted_Active</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-10">
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="SEARCH_IOC"
                className="bg-[#080808] border border-gray-800 py-3 px-12 text-[9px] font-bold tracking-widest text-white focus:border-neon focus:ring-0 outline-none w-48 lg:w-64"
              />
              <svg className="w-3 h-3 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="flex items-center gap-4 lg:gap-8">
              <div className="text-right">
                <div className="text-[7px] text-gray-600 font-bold tracking-widest uppercase mb-1">
                  {userAddress ? `${userAddress.slice(0, 6)}...` : 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-neon" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="text-xs lg:text-sm font-black text-neon tracking-tighter">{tokenBalance} RWT</span>
                </div>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#111111] border border-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">
                USR
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-black relative">
          <div className="bg-grid absolute inset-0 opacity-10 pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto space-y-8 lg:y-12">

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                { label: 'Threat_Vectors', value: '1,248', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.807-.475-3.503-1.308-4.972a1 1 0 00-1.422-.313 1.03 1.03 0 00-.314.313c-.432.618-.83 1.165-1.127 1.583-.23.325-.453.58-.655.772a1 1 0 01-1.378-1.448c.55-.523 1.21-1.108 1.566-1.595.501-.686.815-1.333 1.056-2.052a10.275 10.275 0 00.221-1.15z" clipRule="evenodd" /></svg> },
                { label: 'Mesh_Nodes', value: '8,924', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
                { label: 'Sync_Latency', value: '1.2MS', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                { label: 'Network_Load', value: '32%', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
              ].map((m, i) => (
                <div key={i} className="bg-[#080808] border border-gray-900 p-4 lg:p-8 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 mb-2 lg:mb-4">
                    <span className="text-gray-700">{m.icon}</span>
                    <span className="text-[7px] lg:text-[8px] text-gray-500 font-bold tracking-[0.3em] uppercase">{m.label}</span>
                  </div>
                  <div className={`text-xl lg:text-4xl font-black tracking-tighter ${i === 0 ? 'text-neon' : 'text-white'}`}>{m.value}</div>
                </div>
              ))}
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-500">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
