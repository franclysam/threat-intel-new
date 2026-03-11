
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RewardTransaction } from '../../types';

const DATA = [
  { name: 'MON', rewards: 20 },
  { name: 'TUE', rewards: 45 },
  { name: 'WED', rewards: 30 },
  { name: 'THU', rewards: 85 },
  { name: 'FRI', rewards: 60 },
  { name: 'SAT', rewards: 95 },
  { name: 'SUN', rewards: 110 },
];

const TRANSACTIONS: RewardTransaction[] = [
  { id: 'TX_881', date: 'OCT 25, 2023', amount: 50, type: 'Submission', status: 'Completed' },
  { id: 'TX_442', date: 'OCT 24, 2023', amount: 15, type: 'Validation', status: 'Completed' },
  { id: 'TX_109', date: 'OCT 22, 2023', amount: -100, type: 'Withdrawal', status: 'Completed' },
  { id: 'TX_002', date: 'OCT 20, 2023', amount: 50, type: 'Submission', status: 'Completed' },
];

const RewardsTab: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter">VAULT_LEDGER</h2>
          <p className="text-gray-600 text-[9px] font-bold tracking-widest uppercase mt-1">Asset accumulation and governance staking</p>
        </div>
        <button className="bg-neon text-black font-black px-8 py-3 text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(223,255,0,0.3)] hover:brightness-110">
          EXECUTE_WITHDRAWAL
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { label: 'Available_Liquidity', value: '452.80', unit: '$STN', footer: '+12%_DELTA_7D', footerColor: 'text-neon' },
          { label: 'Cumulative_Earnings', value: '1,240', unit: '$STN', footer: 'RANK_#420_NODE', footerColor: 'text-gray-500' },
          { label: 'Locked_Staking', value: '500.00', unit: '$STN', footer: 'YIELD_8.5%_APY', footerColor: 'text-neon' },
        ].map((card, i) => (
          <div key={i} className="bg-[#080808] border border-gray-900 p-8">
            <div className="text-gray-600 text-[8px] font-black uppercase tracking-[0.3em] mb-4">{card.label}</div>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-5xl font-black text-white tracking-tighter">{card.value}</span>
              <span className="text-neon font-black text-xs pb-1">{card.unit}</span>
            </div>
            <div className={`text-[9px] font-bold tracking-widest uppercase ${card.footerColor}`}>{card.footer}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#050505] border border-gray-900 p-10">
        <h3 className="text-sm font-black text-white tracking-[0.3em] uppercase mb-10">Earnings_Flow_Diagnostic</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DFFF00" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#DFFF00" stopOpacity={0}/>
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

      <div className="bg-black border border-gray-900 overflow-hidden">
        <div className="p-8 border-b border-gray-900 flex justify-between items-center">
          <h3 className="text-sm font-black text-white tracking-[0.3em] uppercase">Transaction_Ledger</h3>
          <button className="text-neon text-[9px] font-black tracking-widest uppercase">[ EXPORT_CSV ]</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#050505] text-gray-600 text-[8px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">TX_HASH</th>
                <th className="px-8 py-5">TIMESTAMP</th>
                <th className="px-8 py-5">VECTOR_TYPE</th>
                <th className="px-8 py-5">QUANTITY</th>
                <th className="px-8 py-5">SETTLEMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-neon/5 transition-all group">
                  <td className="px-8 py-5 font-mono text-[10px] text-gray-400 group-hover:text-neon">{tx.id}</td>
                  <td className="px-8 py-5 text-[10px] text-gray-500">{tx.date}</td>
                  <td className="px-8 py-5 text-[10px]">
                    <span className={`font-black tracking-widest uppercase ${tx.amount > 0 ? 'text-neon' : 'text-orange-500'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[10px] font-black text-white">
                    {tx.amount > 0 ? '+' : ''}{tx.amount} $STN
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-green-500 text-[9px] font-black tracking-widest uppercase">
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

export default RewardsTab;
