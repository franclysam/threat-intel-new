import React, { useState, useEffect, useRef } from 'react';
import { getGlobalStats } from "../services/Apiservice";

const Hero = ({ onLogin, isConnecting, address }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    totalReports: 0,
    maliciousFiles: 0,
    activeNodes: "18.4K", // Mocked for design
    poolValue: "4.2M" // Mocked for design
  });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    const loadStats = async () => {
      try {
        const data = await getGlobalStats();
        setStats(prev => ({
          ...prev,
          totalReports: data.totalReports,
          maliciousFiles: data.maliciousFiles
        }));
      } catch (error) {
        console.error("Error loading hero stats:", error);
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const handleTilt = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 20, y: -y * 20 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="relative min-h-[120vh] flex items-center justify-center px-4 overflow-hidden pt-20 perspective-1000">

      {/* Dynamic Data Stream Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-neon text-[8px] font-bold whitespace-nowrap"
            style={{
              left: `${i * 5}%`,
              animation: `data-stream ${3 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translateY(${scrollY * 0.2}px)`
            }}
          >
            {Array.from({ length: 50 }).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
          </div>
        ))}
      </div>

      {/* Parallax Geometric Layers */}
      <div
        className="absolute w-full h-full pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div
          className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] border border-neon/5 rounded-full"
          style={{ transform: `scale(${1 + scrollY * 0.0005}) rotate(${scrollY * 0.02}deg)` }}
        ></div>
        <div
          className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] border border-white/5"
          style={{ transform: `scale(${1 - scrollY * 0.0002}) rotate(${-scrollY * 0.05}deg)` }}
        ></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">

        {/* Left Side: Branding */}
        <div
          className="relative p-4 md:p-8 animate-in fade-in slide-in-from-left-8 duration-700"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          <div className="corner-tl"></div>
          <div className="corner-bl"></div>

          <div className="flex items-start gap-4 mb-4 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 border border-neon flex items-center justify-center bg-black relative overflow-hidden group shrink-0">
              <div className="w-2 h-2 bg-white z-10 group-hover:scale-[10] transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-neon/10 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest text-white leading-none glitch" data-text="SENTINEL_SYS">SENTINEL_SYS</h1>
              <div className="text-neon text-[8px] md:text-[10px] font-bold tracking-[0.3em] mt-1 uppercase">Decentralized_Defense_Mesh</div>
              <div className="text-neon text-[10px] md:text-xs mt-3 flex items-center gap-2">
                <span className="animate-pulse tracking-widest">[ SYSTEM_ONLINE ]</span>
              </div>
            </div>
          </div>

          <div className="space-y-[-0.5rem] md:space-y-[-1rem] select-none">
            <div
              className="text-[40px] md:text-[80px] font-black leading-none text-white tracking-tighter opacity-90 transition-transform duration-75"
              style={{ transform: `translateX(${mousePos.x * 0.2}px)` }}
            >
              RAW DATA
            </div>
            <div
              className="text-[60px] md:text-[120px] font-black leading-none text-white tracking-tighter flex items-end transition-transform duration-75"
              style={{ transform: `translateX(${mousePos.x * -0.2}px)` }}
            >
              MESH_PRO
              <div className="w-8 md:w-16 h-2 md:h-4 bg-white mb-3 md:mb-6 ml-4 animate-pulse"></div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 max-w-md">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[8px] md:text-[9px] mb-2 border-l border-neon/30 pl-4">
              SECURE YOUR INFRASTRUCTURE.
            </p>
            <p className="text-white font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase leading-relaxed">
              Real-time threat interception using a globally distributed node architecture.
            </p>
          </div>

          <div className="mt-12 md:mt-20 flex gap-6 md:gap-12">
            {[
              { label: 'Signals_Verified', value: stats.totalReports },
              { label: 'Threats_Blocked', value: stats.maliciousFiles }
            ].map((stat, i) => (
              <div key={i} className="group relative overflow-hidden p-1 md:p-2">
                <div className="text-[7px] md:text-[9px] text-gray-700 font-bold uppercase tracking-widest border-l-2 border-gray-900 pl-4 mb-1 md:mb-2 group-hover:border-neon transition-colors">{stat.label}</div>
                <div className="text-3xl md:text-5xl font-black text-white ml-2 md:ml-4 tracking-tighter group-hover:text-neon transition-colors">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Panel */}
        <div
          className="relative animate-in fade-in slide-in-from-right-8 duration-700 lg:mt-0 mt-12"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div
            ref={containerRef}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
            className="bg-[#080808]/90 backdrop-blur-xl border border-gray-900 p-6 md:p-12 relative shadow-[0_0_100px_rgba(0,0,0,1)] transition-transform duration-200 ease-out preserve-3d"
            style={{ transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` }}
          >
            <div className="corner-tl -translate-x-2 -translate-y-2"></div>
            <div className="corner-br translate-x-2 translate-y-2"></div>

            <h2 className="text-white text-[10px] md:text-xs font-black tracking-[0.4em] mb-8 md:mb-12 border-b border-gray-900 pb-6 uppercase flex items-center justify-between">
              Access_Terminal
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-neon"></span>
                <span className="w-1 h-1 bg-neon opacity-50"></span>
                <span className="w-1 h-1 bg-neon opacity-20"></span>
              </div>
            </h2>

            <div className="space-y-8 md:space-y-10 transform-style-3d">
              <div style={{ transform: 'translateZ(30px)' }}>
                <label className="block text-[8px] md:text-[9px] text-gray-600 font-black tracking-[0.4em] uppercase mb-4">Uplink_Identity_Core</label>
                <div className={`bg-black border p-4 md:p-6 flex items-center transition-all duration-500 ${address ? 'border-neon/50 bg-neon/5' : 'border-gray-800'}`}>
                  <span className={`text-[9px] md:text-[10px] font-bold tracking-widest uppercase font-mono truncate w-full ${address ? 'text-neon' : 'text-gray-700'}`}>
                    {address || '>>> AWAITING_AUTHENTICATION_STREAM'}
                  </span>
                </div>
              </div>

              <div className="space-y-4" style={{ transform: 'translateZ(50px)' }}>
                <button
                  onClick={onLogin}
                  disabled={isConnecting}
                  className="w-full bg-neon text-black font-black py-6 md:py-8 px-8 flex items-center justify-between group hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <span className="tracking-[0.5em] text-[10px] md:text-xs relative z-10">
                    {isConnecting ? 'INTERCEPTING...' : 'INITIATE_UPLINK'}
                  </span>
                  {!isConnecting ? (
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  ) : (
                    <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full relative z-10"></div>
                  )}
                </button>
                <div className="text-[7px] text-gray-600 font-bold tracking-[0.5em] text-center uppercase">
                  End-to-End Encrypted Handshake Active
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-16 flex justify-between items-center opacity-30">
              <div className="text-[8px] md:text-[10px] font-bold text-gray-400">NODE_VER_3.1.2_STABLE</div>
              <div className="text-[7px] md:text-[8px] font-bold text-gray-500 tracking-widest uppercase">Verified_Security_Layer</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes data-stream {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .transform-style-3d { transform: translateZ(20px); }
      `}</style>
    </div>
  );
};

export default Hero;