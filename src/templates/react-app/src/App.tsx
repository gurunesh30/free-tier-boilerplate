import React from 'react';

function App() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      padding: '4rem 2rem', 
      textAlign: 'center',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#38bdf8' }}>
        SaaS Template Generated! 🚀
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px' }}>
        Your project folder has been scaffolded successfully. Check your terminal output to see if your SaaS providers connected successfully!
      </p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
        <code style={{ color: '#f472b6' }}>Edit src/App.tsx to get started</code>
      </div>
    </div>
  );
}

export default App;