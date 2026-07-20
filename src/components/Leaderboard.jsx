import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { getNativeCurrencySymbol, getActiveNetworkName } from '../lib/network';

export default function Leaderboard({ profileData }) {
  const { address: walletAddress } = useAccount();
  const [filterType, setFilterType] = useState('ALL NODES');

  const currencySymbol = getNativeCurrencySymbol();

  // Multi-Agent Swarm Nodes & Verified Participants focusing on Decision Transparency
  const baseNodes = [
    {
      id: 'node_1',
      rank: 1,
      name: 'AnalystAgent',
      role: 'Signal Ingestion & Probability Modeling',
      address: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
      calibrationScore: '96.2%',
      proposalsEvaluated: 428,
      status: 'VERIFIED ON GIWA',
      type: 'Agent'
    },
    {
      id: 'node_2',
      rank: 2,
      name: 'RiskAgent',
      role: 'Order Book Depth & Volatility Safeguards',
      address: '0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      calibrationScore: '94.5%',
      proposalsEvaluated: 428,
      status: 'VERIFIED ON GIWA',
      type: 'Agent'
    },
    {
      id: 'node_3',
      rank: 3,
      name: 'ComplianceAgent',
      role: 'Oracle Policy & Dispute Timelock Audits',
      address: '0x3f8a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      calibrationScore: '98.1%',
      proposalsEvaluated: 428,
      status: 'VERIFIED ON GIWA',
      type: 'Agent'
    },
    {
      id: 'node_4',
      rank: 4,
      name: 'GiwaWhale_01',
      role: 'External Liquidity & Signal Validator',
      address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      calibrationScore: '94.2%',
      proposalsEvaluated: 114,
      status: 'VERIFIED ON GIWA',
      type: 'Trader'
    }
  ];

  // Inject connected user into calibration registry if wallet is connected
  const userEntry = walletAddress ? {
    id: 'user_self',
    rank: 5,
    name: profileData?.nickname || 'Connected Participant',
    role: 'Wallet Signer & Market Creator',
    address: walletAddress,
    avatar: profileData?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    calibrationScore: '100.0%',
    proposalsEvaluated: 2,
    status: 'ACTIVE PARTICIPANT',
    isUser: true,
    type: 'User'
  } : null;

  const allEntries = userEntry ? [...baseNodes, userEntry] : baseNodes;

  const filteredEntries = allEntries.filter(entry => {
    if (filterType === 'SWARM AGENTS') return entry.type === 'Agent';
    if (filterType === 'VERIFIED TRADERS') return entry.type === 'Trader' || entry.type === 'User';
    return true;
  });

  return (
    <main className="pt-24 pb-12 px-4 w-full flex flex-col items-center max-w-6xl mx-auto z-10 flex-grow">
      {/* Header Banner */}
      <div className="w-full mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-mono font-bold text-primary uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Decision Transparency Registry
        </div>
        <h2 className="serif-heading text-3xl md:text-4xl text-on-surface mb-2">Decision Transparency & Agent Calibration</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
          Verifiable telemetry, node calibration scores, and decision accuracy audit trails for multi-agent oracle nodes on {getActiveNetworkName()}.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Total Decisions Audited</span>
          <span className="text-2xl font-bold font-mono text-on-surface mt-2">1,420</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Consensus Agreement</span>
          <span className="text-2xl font-bold font-mono text-bullish-green mt-2">94.8%</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Avg Resolution Speed</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">2.4 Blocks</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Active Swarm Nodes</span>
          <span className="text-lg font-bold font-mono text-on-surface mt-2 flex items-center gap-1">
            <span>🤖</span> 3 Swarm Nodes
          </span>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="w-full flex justify-between items-center mb-6 bg-surface/50 border border-outline-variant p-2.5 rounded-xl">
        <div className="flex items-center gap-2 bg-surface-variant/40 rounded-lg p-1 font-mono">
          {['ALL NODES', 'SWARM AGENTS', 'VERIFIED TRADERS'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${filterType === type ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {type}
            </button>
          ))}
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">
          AUDITED REAL-TIME ON GIWA
        </span>
      </div>

      {/* Decision Transparency Table */}
      <div className="w-full bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mb-8">
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="bg-surface-variant/50 border-b border-outline-variant text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-mono">
                <th className="px-6 py-4">Node / Participant</th>
                <th className="px-6 py-4">Domain & Protocol Role</th>
                <th className="px-6 py-4 text-center">Calibration Score</th>
                <th className="px-6 py-4 text-center">Proposals Evaluated</th>
                <th className="px-6 py-4 text-right">Transparency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filteredEntries.map((entry) => {
                const isUser = entry.isUser;
                return (
                  <tr 
                    key={entry.id} 
                    className={`transition-colors ${isUser ? 'bg-primary/10 hover:bg-primary/15 font-semibold' : 'hover:bg-surface-variant/20'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={entry.avatar} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full border border-outline-variant object-cover" 
                        />
                        <div>
                          <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                            {entry.name}
                            {isUser && <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-mono uppercase">YOU</span>}
                          </div>
                          <div className="font-mono text-[10px] text-on-surface-variant/60 select-all">
                            {entry.address.substring(0, 6)}...{entry.address.substring(entry.address.length - 4)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-mono text-on-surface font-medium block">
                        {entry.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-bold text-sm text-bullish-green">{entry.calibrationScore}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-sm text-on-surface font-semibold">{entry.proposalsEvaluated}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 bg-bullish-green/10 text-bullish-green border border-bullish-green/30 rounded">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verifiable Consensus Audit Highlight */}
      <div className="w-full bg-surface-variant/30 border border-outline-variant/60 rounded-xl p-6 text-left">
        <h3 className="serif-heading text-lg text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">verified_user</span>
          How Decision Transparency Works
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Every decision proposal in AIRA Protocol undergoes multi-agent evaluation where <strong>AnalystAgent</strong>, <strong>RiskAgent</strong>, and <strong>ComplianceAgent</strong> register independent confidence votes. Consensus scores and Evidence Packages are anchored on-chain to ensure 100% public auditability without relying on opaque centralized Oracles.
        </p>
      </div>
    </main>
  );
}
