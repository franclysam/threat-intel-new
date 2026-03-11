
import React, { useState } from 'react';
import { ChatMessage } from '../../types';

const CommunityTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'SentinelBot', text: 'Welcome to the SentinelNet Community Channel. Share insights and collaborate with other researchers.', time: '09:00', isOfficial: true },
    { id: '2', user: 'CyberSage', text: 'Has anyone else seen the spike in malicious PDF attachments recently?', time: '10:45' },
    { id: '3', user: 'SecureDev_22', text: 'Yes! Mostly coming from Russian IPs. I submitted a report on the Dashboard.', time: '11:02' },
    { id: '4', user: 'SentinelBot', text: 'Report verified by 12 validators. 50 $SENT tokens rewarded to SecureDev_22.', time: '11:15', isOfficial: true },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white tracking-tighter">COMMUNITY_FORUM</h2>
        <p className="text-gray-600 text-[9px] font-bold tracking-widest uppercase mt-1">Global node operator collaboration channel</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-black border border-gray-900 p-6 space-y-6 mb-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 mb-1 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
              <span className={`text-[10px] font-bold ${msg.isOfficial ? 'text-neon' : 'text-gray-600'}`}>
                {msg.user}
                {msg.isOfficial && ' (SYSTEM)'}
              </span>
              <span className="text-[8px] text-gray-700">{msg.time}</span>
            </div>
            <div className={`max-w-[80%] px-5 py-3 text-xs tracking-wider border ${
              msg.user === 'You' ? 'bg-neon text-black border-neon font-bold' : 
              msg.isOfficial ? 'bg-neon/5 text-neon border-neon/20' : 
              'bg-[#080808] text-gray-400 border-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="ENTER_TRANSMISSION_DATA..."
          className="w-full bg-[#080808] border border-gray-800 py-5 px-8 text-white text-xs font-bold tracking-widest focus:border-neon outline-none pr-24"
        />
        <button 
          onClick={sendMessage}
          className="absolute right-3 top-3 bottom-3 bg-neon text-black px-6 font-black text-[10px] tracking-widest uppercase transition-all"
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default CommunityTab;
