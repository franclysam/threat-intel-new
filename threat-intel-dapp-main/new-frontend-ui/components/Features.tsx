
import React, { useEffect, useRef } from 'react';

const FEATURES = [
  {
    title: 'CROWDSOURCED_INTEL',
    description: 'Leverage the power of a global network of researchers reporting real-time threat data directly to the ledger.',
    icon: (
      <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: 'NEURAL_SCANNER',
    description: 'Deep neural analysis of binaries and link structures to identify zero-day exploits and obfuscated patterns.',
    icon: (
      <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: 'PROOF_OF_VALIDATION',
    description: 'Decentralized consensus mechanism ensures that every threat report is triple-verified by peer nodes.',
    icon: (
      <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'TOKENIZED_INCENTIVES',
    description: 'Earn native $STN assets for every verified report, data contribution, or peer validation performed.',
    icon: (
      <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const Features: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      { threshold: 0.1 }
    );

    const children = scrollRef.current?.children;
    if (children) {
      Array.from(children).forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-[#050505] border-t border-gray-900 font-mono relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 relative z-10">
          <div className="max-w-xl">
             <div className="text-neon text-[10px] font-black tracking-[0.4em] uppercase mb-4 animate-pulse">Tactical_Capabilities</div>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">RESILIENT_SECURITY_ECOSYSTEM</h2>
             <p className="text-gray-500 text-xs font-bold leading-relaxed tracking-widest uppercase">Decoupling identity from security validation.</p>
          </div>
          <div className="hidden md:block">
             <div className="w-48 h-1 bg-neon shadow-[0_0_20px_#DFFF00] animate-width-cycle"></div>
          </div>
        </div>
        
        <div ref={scrollRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className="feature-card relative group p-10 bg-[#080808] border border-gray-900 transition-all duration-700 overflow-hidden transform-gpu"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-30 transition-opacity">
                 <div className="text-[80px] font-black text-white leading-none -rotate-12 translate-x-4">{idx + 1}</div>
              </div>
              
              <div className="w-14 h-14 border border-gray-800 bg-black flex items-center justify-center mb-8 group-hover:border-neon group-hover:bg-neon/10 transition-all group-hover:scale-110 duration-500 relative">
                <div className="absolute inset-0 border border-neon/30 scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-spin-slow"></div>
                {feature.icon}
              </div>
              
              <h3 className="text-sm font-black text-white mb-4 tracking-[0.3em] uppercase group-hover:text-neon transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-[10px] text-gray-500 font-bold leading-relaxed tracking-widest uppercase">
                {feature.description}
              </p>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-neon scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .feature-card {
          opacity: 0;
          transform: translateY(100px) scale(0.9) rotate(3deg);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .feature-card.reveal {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(0);
        }
        @keyframes width-cycle {
          0%, 100% { width: 48px; }
          50% { width: 192px; }
        }
        .animate-width-cycle {
          animation: width-cycle 4s infinite ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Features;
