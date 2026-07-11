import React from 'react';

// ---------------------------------------------------------------------------
// Katana — Redrawn with precise, rigid geometry to look unmistakably like
// a warrior's sword (slight upward curve, flat handle, distinct guard).
// ---------------------------------------------------------------------------
function Katana() {
  return (
    <svg
      viewBox="0 0 1000 100"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(160vw, 1400px)',
        transform: 'translate(-50%, -50%) rotate(-15deg)',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.45,
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blade-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="handle-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#111" />
          <stop offset="50%" stopColor="#333" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
      </defs>

      {/* Tsuka (Handle) */}
      <rect x="100" y="44" width="140" height="16" rx="2" fill="url(#handle-gradient)" />
      
      {/* Handle Wrap Texture (Ito) */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M${105 + i * 15} 44 L${115 + i * 15} 60 M${115 + i * 15} 44 L${105 + i * 15} 60`}
          stroke="#000"
          strokeWidth="1.5"
          opacity="0.8"
        />
      ))}

      {/* Pommel (Kashira) */}
      <rect x="94" y="43" width="8" height="18" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />

      {/* Tsuba (Guard) */}
      <rect x="240" y="34" width="8" height="36" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />

      {/* Habaki (Collar) */}
      <rect x="248" y="45" width="18" height="14" fill="#475569" />

      {/* Blade - Solid geometric shape with a subtle, realistic curve */}
      <path
        d="M266 45 Q 600 40 940 32 L 965 42 L 920 54 Q 600 50 266 57 Z"
        fill="url(#blade-gradient)"
      />

      {/* Bo-hi (Blood Groove / Fuller) */}
      <path
        d="M270 48 Q 600 44 880 39"
        stroke="#1e293b"
        strokeWidth="2.5"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Crimson Leaves — Vibrant red maple/autumn leaves cutting through the gray.
// ---------------------------------------------------------------------------
function CrimsonLeaves() {
  const leaves = Array.from({ length: 24 });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {leaves.map((_, i) => {
        const left = (i * 17) % 100;
        const delay = (i * 0.7) % 12;
        const duration = 6 + (i % 6) * 1.5;
        const size = 12 + (i % 5) * 8;
        const rotationStart = (i * 45) % 360;
        
        // Blur leaves in the foreground/background for depth of field
        const blurAmount = i % 4 === 0 ? 'blur(3px)' : i % 5 === 0 ? 'blur(1px)' : 'none';

        return (
          <svg
            key={i}
            className="crimson-leaf"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              fill: '#dc2626', // Vibrant Blood Red
              filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.4)) ${blurAmount}`,
              '--rot-start': `${rotationStart}deg`,
              '--rot-end': `${rotationStart + 540}deg`,
            } as React.CSSProperties}
          >
            {/* Maple Leaf Path */}
            <path d="M11.4 1.5c-.2-.4-.8-.4-1 0L8.6 6 4 5c-.4-.1-.7.2-.6.5l1.6 4.3-4.5 1.5c-.4.1-.5.7-.1 1l4.2 2.6-2 5c-.1.4.3.7.7.5l4.5-2.8 2.6 4.4c.2.4.8.4 1 0l2.6-4.4 4.5 2.8c.4.2.8-.1.7-.5l-2-5 4.2-2.6c.4-.3.3-.9-.1-1l-4.5-1.5 1.6-4.3c.1-.4-.2-.7-.6-.5l-4.6 1L11.4 1.5z" />
          </svg>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Application - Cinematic Grayscale with Red Accents
// ---------------------------------------------------------------------------
function App() {
  return (
    <div
      style={{
        position: 'relative',
        fontFamily: "'Cinzel', 'Georgia', serif",
        padding: '4rem 2rem',
        textAlign: 'center',
        // Moody gradient: Dark stormy sky fading into the white pampas grass field
        background: 'linear-gradient(180deg, #09090b 0%, #18181b 40%, #52525b 70%, #e4e4e7 100%)',
        color: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Cinematic wind-swept leaf animation */
        @keyframes driftAndSpin {
          0% { 
            transform: translateY(-10vh) translateX(-5vw) rotate(var(--rot-start)) scale(1); 
            opacity: 0; 
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(110vh) translateX(25vw) rotate(var(--rot-end)) scale(0.7); 
            opacity: 0; 
          }
        }
        .crimson-leaf {
          position: absolute;
          top: -30px;
          animation-name: driftAndSpin;
          animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
          animation-iteration-count: infinite;
        }

        /* Slow cinematic text reveals */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .cinematic-reveal-1 { animation: fadeUp 1.2s ease-out 0.2s both; }
        .cinematic-reveal-2 { animation: fadeUp 1.2s ease-out 0.6s both; }
        .cinematic-reveal-3 { animation: fadeUp 1.2s ease-out 1.0s both; }

        @media (prefers-reduced-motion: reduce) {
          .crimson-leaf { animation: none; opacity: 0.6; top: 50%; }
          .cinematic-reveal-1, .cinematic-reveal-2, .cinematic-reveal-3 { 
            animation: none; opacity: 1; filter: none; transform: none; 
          }
        }
      `}</style>

      {/* Atmospheric dark vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 250px rgba(0,0,0,0.85)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Katana />
      <CrimsonLeaves />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 700 }}>
        <p
          className="cinematic-reveal-1"
          style={{
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            color: '#a1a1aa',
            marginBottom: '1.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          The storm approaches
        </p>

        <h1
          className="cinematic-reveal-2"
          style={{
            fontSize: 'clamp(3rem, 7vw, 5rem)',
            lineHeight: 1.1,
            margin: '0 0 1rem 0',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 400,
            textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          Your Stack <br />Is Forged
        </h1>

        <div
          className="cinematic-reveal-2"
          style={{
            width: 120,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #dc2626, transparent)',
            margin: '2rem auto',
          }}
        />

        <p
          className="cinematic-reveal-3"
          style={{
            fontSize: '1.15rem',
            color: '#d4d4d8',
            lineHeight: 1.8,
            maxWidth: 540,
            margin: '0 auto',
            fontFamily: "sans-serif",
            fontWeight: 300,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          The project has been scaffolded in one clean stroke. Return to your
          terminal to confirm your providers connected. The path forward is clear.
        </p>

        <div
          className="cinematic-reveal-3"
          style={{
            marginTop: '3.5rem',
            padding: '1rem 2rem',
            background: 'rgba(9, 9, 11, 0.6)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(82, 82, 91, 0.4)',
            borderLeft: '4px solid #dc2626',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <code style={{ 
            color: '#e4e4e7', 
            fontFamily: "'Courier New', monospace", 
            fontSize: '0.95rem',
            letterSpacing: '0.05em'
          }}>
            Edit <span style={{ color: '#dc2626' }}>src/App.tsx</span> to begin
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;