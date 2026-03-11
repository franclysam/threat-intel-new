import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { transferTokens, claimRewards, getPendingRewards } from '../../services/Rewardservice';

const DATA = [
  { name: 'MON', rewards: 20 },
  { name: 'TUE', rewards: 45 },
  { name: 'WED', rewards: 30 },
  { name: 'THU', rewards: 85 },
  { name: 'FRI', rewards: 60 },
  { name: 'SAT', rewards: 95 },
  { name: 'SUN', rewards: 110 },
];

const Rewardstab = ({ userAddress, tokenBalance }) => {
  const [claiming, setClaiming] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [pendingRewards, setPendingRewards] = useState('0');

  useEffect(() => {
    if (!userAddress) return;

    let active = true;
    const loadPendingRewards = async () => {
      try {
        const pending = await getPendingRewards(userAddress);
        if (!active) return;
        setPendingRewards(parseFloat(pending || '0').toFixed(2));
      } catch (error) {
        if (!active) return;
        setPendingRewards('0.00');
      }
    };

    loadPendingRewards();
    const interval = setInterval(loadPendingRewards, 60000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [userAddress]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await claimRewards();
      alert('Rewards claimed successfully!');
      const pending = await getPendingRewards(userAddress);
      setPendingRewards(parseFloat(pending || '0').toFixed(2));
    } catch (error) {
      alert('Failed to claim rewards: ' + (error?.message || 'Contract error'));
    } finally {
      setClaiming(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAddress || !transferAmount) {
      alert('Please enter both address and amount');
      return;
    }

    setTransferring(true);
    try {
      await transferTokens(transferAddress, transferAmount);
      alert('Transfer successful!');
      setTransferAddress('');
      setTransferAmount('');
    } catch (error) {
      alert('Transfer failed: ' + (error?.message || 'Transaction rejected'));
    } finally {
      setTransferring(false);
    }
  };

  const transactions = [
    { id: 'TX_881', date: 'OCT 25, 2025', amount: 50, type: 'SUBMISSION', status: 'Completed' },
    { id: 'TX_442', date: 'OCT 24, 2025', amount: 15, type: 'VALIDATION', status: 'Completed' },
    { id: 'TX_109', date: 'OCT 22, 2025', amount: -100, type: 'WITHDRAWAL', status: 'Completed' },
    { id: 'TX_002', date: 'OCT 20, 2025', amount: 50, type: 'SUBMISSION', status: 'Completed' },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase">VAULT_LEDGER</h2>
          <p className="text-gray-600 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mt-1">Asset accumulation and governance staking</p>
        </div>
        <button
          onClick={handleClaim}
          disabled={claiming || Number(pendingRewards) <= 0}
          className="w-full sm:w-auto bg-neon text-black font-black px-8 py-3 text-[9px] md:text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(223,255,0,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          {claiming ? 'PROCESSING...' : 'CLAIM_REWARDS'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[
          { label: 'Available_Liquidity', value: tokenBalance, unit: '$RWT', footer: '+12%_DELTA_7D', footerColor: 'text-neon' },
          { label: 'Pending_Settlement', value: pendingRewards, unit: '$RWT', footer: 'ACCUMULATING...', footerColor: 'text-yellow-500' },
          { label: 'Total_Earned', value: (parseFloat(tokenBalance) + parseFloat(pendingRewards)).toFixed(2), unit: '$RWT', footer: 'YIELD_8.5%_APY', footerColor: 'text-neon' },
        ].map((card, i) => (
          <div key={i} className="bg-[#080808] border border-gray-900 p-6 md:p-8 group hover:border-neon transition-colors">
            <div className="text-gray-600 text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] mb-4 group-hover:text-neon">{card.label}</div>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{card.value}</span>
              <span className="text-neon font-black text-[10px] md:text-xs pb-1">{card.unit}</span>
            </div>
            <div className={`text-[8px] md:text-[9px] font-bold tracking-widest uppercase ${card.footerColor}`}>{card.footer}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#050505] border border-gray-900 p-6 md:p-10">
          <h3 className="text-[12px] md:text-sm font-black text-white tracking-[0.3em] uppercase mb-8 md:mb-10 border-l border-neon/50 pl-4">Earnings_Flow</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DFFF00" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#DFFF00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#111111" />
                <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #DFFF00', borderRadius: '0px' }}
                  itemStyle={{ color: '#DFFF00' }}
                />
                <Area type="stepAfter" dataKey="rewards" stroke="#DFFF00" fillOpacity={1} fill="url(#colorRewards)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#080808] border border-gray-900 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="text-[12px] md:text-sm font-black text-white tracking-[0.3em] uppercase mb-8 border-l border-neon/50 pl-4">TRANSFER_ASSETS</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[7px] md:text-[8px] font-black text-gray-600 tracking-widest uppercase mb-3">Target_Descriptor</label>
              <input
                type="text"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="0X..."
                className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-white outline-none focus:border-neon transition-all"
              />
            </div>
            <div>
              <label className="block text-[7px] md:text-[8px] font-black text-gray-600 tracking-widest uppercase mb-3">Asset_Quantity</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black border border-gray-800 p-4 text-[10px] md:text-xs font-bold text-white outline-none focus:border-neon transition-all"
              />
            </div>
            <button
              onClick={handleTransfer}
              disabled={transferring}
              className="w-full bg-black border border-neon text-neon font-black py-5 text-[9px] md:text-[10px] tracking-[0.3em] uppercase hover:bg-neon hover:text-black transition-all disabled:opacity-50 active:scale-95"
            >
              {transferring ? 'INITIATING...' : 'EXECUTE_TRANSFER'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black border border-gray-900 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-900 flex justify-between items-center bg-[#050505]/50">
          <h3 className="text-[12px] md:text-sm font-black text-white tracking-[0.3em] uppercase">Transaction_Ledger</h3>
          <button className="text-neon text-[8px] md:text-[9px] font-black tracking-widest uppercase hover:underline shrink-0">[ EXPORT ]</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#050505] text-gray-600 text-[8px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-6 md:px-8 py-5">TX_HASH</th>
                <th className="px-6 md:px-8 py-5">TIMESTAMP</th>
                <th className="px-6 md:px-8 py-5">TYPE</th>
                <th className="px-6 md:px-8 py-5">QUANTITY</th>
                <th className="px-6 md:px-8 py-5">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neon/5 transition-all group">
                  <td className="px-6 md:px-8 py-4 md:py-5 font-mono text-[9px] md:text-[10px] text-gray-400 group-hover:text-neon transition-colors">{tx.id}</td>
                  <td className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] text-gray-500 font-bold">{tx.date}</td>
                  <td className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px]">
                    <span className={`font-black tracking-widest uppercase ${tx.amount > 0 ? 'text-neon/70' : 'text-orange-500/70'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-white whitespace-nowrap">
                    {tx.amount > 0 ? '+' : ''}{tx.amount} $RWT
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-5">
                    <span className="text-green-500 text-[8px] md:text-[9px] font-black tracking-widest uppercase">
                      [ {tx.status} ]
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rewardstab;
