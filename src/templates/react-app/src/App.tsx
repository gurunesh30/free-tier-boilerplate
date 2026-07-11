import React from 'react';

// ---------------------------------------------------------------------------
// Katana — hand-drawn SVG, laid diagonally across the scene like a still
// frame after the cut has already landed.
// ---------------------------------------------------------------------------

function Katana() {
  return (
    <svg
      viewBox="0 0 640 160"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(140vw, 1100px)',
        transform: 'translate(-50%, -50%) rotate(-8deg)',
        opacity: 0.16,
        filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.08))',
        pointerEvents: 'none',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* blade */}
      <path
        d="M20 92 C 140 78, 320 66, 470 56 C 500 54, 520 50, 536 42 L 560 30"
        stroke="#e5e7eb"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* blade highlight */}
      <path
        d="M24 88 C 150 75, 320 63, 468 53"
        stroke="#f8fafc"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* tip */}
      <path d="M536 42 L 560 30 L 546 52 Z" fill="#e5e7eb" />
      {/* habaki (collar) */}
      <rect x="14" y="86" width="16" height="14" rx="1" fill="#9ca3af" transform="rotate(-6 22 93)" />
      {/* tsuba (guard) */}
      <ellipse cx="0" cy="98" rx="14" ry="22" fill="#111318" stroke="#6b7280" strokeWidth="2" />
      {/* tsuka (handle) */}
      <path
        d="M-10 90 C -50 96, -95 104, -132 112"
        stroke="#1c1f26"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* handle wrap ito pattern */}
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1={-18 - i * 16}
          y1={91 + i * 3}
          x2={-30 - i * 16}
          y2={104 + i * 3}
          stroke="#4b5563"
          strokeWidth="2"
        />
      ))}
      {/* pommel */}
      <circle cx="-134" cy="113" r="7" fill="#6b7280" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Ambient ash — a handful of drifting motes for atmosphere, respects
// prefers-reduced-motion.
// ---------------------------------------------------------------------------

function Ash() {
  const motes = Array.from({ length: 14 });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {motes.map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i * 1.7) % 9;
        const duration = 9 + (i % 5) * 1.6;
        const size = 2 + (i % 3);
        return (
          <span
            key={i}
            className="ash-mote"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function App() {
  return (
    <div
      style={{
        position: 'relative',
        fontFamily: "'Georgia', 'Iowan Old Style', 'Noto Serif', serif",
        padding: '4rem 2rem',
        textAlign: 'center',
        background:
          'radial-gradient(ellipse at 50% 30%, #1a1a1c 0%, #0a0a0b 55%, #050505 100%)',
        color: '#e5e7eb',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes drift {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.35; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .ash-mote {
          position: absolute;
          bottom: -10px;
          background: #9ca3af;
          border-radius: 50%;
          animation-name: drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rise-1 { animation: riseIn 0.7s ease-out both; }
        .rise-2 { animation: riseIn 0.7s ease-out 0.15s both; }
        .rise-3 { animation: riseIn 0.7s ease-out 0.3s both; }
        .rise-4 { animation: riseIn 0.7s ease-out 0.45s both; }
        @media (prefers-reduced-motion: reduce) {
          .ash-mote { animation: none; opacity: 0.25; }
          .rise-1, .rise-2, .rise-3, .rise-4 { animation: none; opacity: 1; }
        }
      `}</style>

      <Katana />
      <Ash />

      {/* vignette edge */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 220px rgba(0,0,0,0.75)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
        <p
          className="rise-1"
          style={{
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginBottom: '1.25rem',
          }}
        >
          The cut is made
        </p>

        <h1
          className="rise-2"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.05,
            margin: 0,
            marginBottom: '0.5rem',
            color: '#f8fafc',
            letterSpacing: '0.02em',
          }}
        >
          Your Stack Is Forged
        </h1>

        <div
          className="rise-2"
          style={{
            width: 64,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #6b7280, transparent)',
            margin: '1.5rem auto',
          }}
        />

        <p
          className="rise-3"
          style={{
            fontSize: '1.125rem',
            color: '#a1a1aa',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          The project has been scaffolded in one clean stroke. Return to your
          terminal to confirm your providers connected — no wasted motion, no
          second swing.
        </p>

        <div
          className="rise-4"
          style={{
            marginTop: '2.5rem',
            padding: '1rem 1.5rem',
            background: '#111114',
            borderRadius: '2px',
            border: '1px solid #2a2a2e',
            display: 'inline-block',
          }}
        >
          <code style={{ color: '#d4d4d8', fontFamily: "'Courier New', monospace", fontSize: '0.95rem' }}>
            Edit src/App.tsx to get started
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;