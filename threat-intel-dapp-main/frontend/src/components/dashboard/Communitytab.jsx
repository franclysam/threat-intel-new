import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const CommunityTab = ({ userAddress }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('history', (history) => {
            if (Array.isArray(history)) {
                setMessages(history.slice(-100)); // Load last 100 messages
            }
        });

        socketRef.current.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const sender = userAddress === "0xDEV_USER_ANONYMOUS"
            ? "DEV_OPS"
            : `${userAddress?.slice(0, 6)}...${userAddress?.slice(-4)}`;

        const messageData = {
            user: sender,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOfficial: userAddress === "0xDEV_USER_ANONYMOUS"
        };

        socketRef.current.emit('message', messageData);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)]">
            <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase">COMMUNITY_FORUM</h2>
                <p className="text-gray-600 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mt-1">Global node collaboration channel</p>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-black border border-gray-900 p-4 md:p-6 space-y-4 md:space-y-6 mb-4 custom-scrollbar"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-800">
                        <div className="text-[10px] font-black tracking-[0.5em] animate-pulse">AWAITING_SIGNAL...</div>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.user === 'DEV_OPS' || msg.user === 'You' || msg.user?.startsWith(userAddress?.slice(0, 6)) ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${(msg.user === 'DEV_OPS' || msg.user === 'You' || msg.user?.startsWith(userAddress?.slice(0, 6))) ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-[9px] md:text-[10px] font-bold ${msg.isOfficial ? 'text-neon' : 'text-gray-600'}`}>
                                {msg.user}
                                {msg.isOfficial && ' (SYS)'}
                            </span>
                            <span className="text-[7px] md:text-[8px] text-gray-700">{msg.time}</span>
                        </div>
                        <div className={`max-w-[90%] md:max-w-[80%] px-4 md:px-5 py-2 md:py-3 text-[10px] md:text-xs tracking-wider border ${(msg.user === 'DEV_OPS' || msg.user === 'You' || (userAddress && msg.user?.startsWith(userAddress.slice(0, 6)))) ? 'bg-neon text-black border-neon font-bold' :
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
                    placeholder="ENTER_DATA..."
                    className="w-full bg-[#080808] border border-gray-800 py-4 md:py-5 px-4 md:px-8 text-white text-[10px] md:text-xs font-bold tracking-widest focus:border-neon outline-none pr-24 md:pr-32"
                />
                <button
                    onClick={sendMessage}
                    className="absolute right-2 top-2 bottom-2 bg-neon text-black px-4 md:px-8 font-black text-[9px] md:text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 hover:brightness-110 active:scale-95"
                >
                    <span className="hidden sm:inline">SEND</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
            </div>
        </div>
    );
};

export default CommunityTab;
