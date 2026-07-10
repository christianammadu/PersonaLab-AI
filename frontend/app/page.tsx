'use client';
import { useState } from 'react';

interface SummaryData { average: number; positive: number; neutral: number; negative: number; }
interface PersonaResponse { name: string; role: string; rating: number; feedback: string; }

export default function Home() {
  const [productDesc, setProductDesc] = useState('');
  const [responses, setResponses] = useState<PersonaResponse[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runSimulation = async () => {
    setLoading(true); setError(''); setSummary(null); setResponses([]);
    
    // Self-correcting network layer to avoid port matching issues
    const endpoints = [
      `http://localhost:8000/test?product_desc=${encodeURIComponent(productDesc)}`,
      `http://127.0.0.1:8000/test?product_desc=${encodeURIComponent(productDesc)}`
    ];

    let success = false;
    for (const url of endpoints) {
      if (success) break;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setResponses(data.responses || []);
          setSummary(data.summary || null);
          success = true;
          break;
        }
      } catch (err) {
        // Fallback to try the next local route mapping alternative
      }
    }

    if (!success) {
      setError('Could not connect to backend server. Make sure uvicorn is running on port 8000.');
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '40px', color: '#e2e8f0', fontFamily: 'sans-serif' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}>
        <h1 style={{ color: '#00adb5', textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>PersonaLab AI</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '5px' }}>Validate copies instantly using target psychological focus swarms</p>
        
        <p style={{ color: '#94a3b8', fontWeight: 'bold', marginTop: '25px', marginBottom: '8px' }}>1. Paste your advertisement or marketing concept:</p>
        <textarea
          rows={5} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', boxSizing: 'border-box' }}
          placeholder="e.g., Enter marketing copy here..."
          value={productDesc} onChange={(e) => setProductDesc(e.target.value)}
        />
        <button onClick={runSimulation} disabled={loading} style={{ width: '100%', backgroundColor: '#00adb5', color: '#0f172a', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', border: 'none', marginTop: '15px' }}>
          {loading ? 'Running Behavior Engines...' : 'Launch Simulation'}
        </button>

        {error && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '8px', color: '#fff' }}>
            <strong>Connection Trouble:</strong> {error}
          </div>
        )}

        {summary && (
          <div style={{ marginTop: '35px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
            <h2 style={{ color: '#38bdf8', margin: '0 0 15px 0', fontSize: '1.3rem' }}>Market Sentiment Distribution Dashboard</h2>
            <div style={{ display: 'flex', gap: '4px', height: '24px', backgroundColor: '#334155', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${summary.positive}%`, backgroundColor: '#22c55e' }} />
              <div style={{ width: `${summary.neutral}%`, backgroundColor: '#eab308' }} />
              <div style={{ width: `${summary.negative}%`, backgroundColor: '#ef4444' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
              <span style={{ color: '#4ade80' }}>🟢 Positive: {summary.positive}%</span>
              <span style={{ color: '#facc15' }}>🟡 Neutral: {summary.neutral}%</span>
              <span style={{ color: '#f87171' }}>🔴 Negative: {summary.negative}%</span>
            </div>
          </div>
        )}

        {responses.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#38bdf8', marginBottom: '15px' }}>Individual Persona Responses</h3>
            {responses.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #334155' }}>
                <strong style={{ color: '#00adb5', fontSize: '1.1rem' }}>{item.name}</strong> 
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}> — {item.role}</span>
                <div style={{ color: '#f59e0b', margin: '6px 0' }}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#cbd5e1', lineHeight: '1.4' }}>"{item.feedback}"</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}