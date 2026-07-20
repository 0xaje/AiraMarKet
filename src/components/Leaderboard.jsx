import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { getNativeCurrencySymbol, getActiveNetworkName } from '../lib/network';

export default function Leaderboard({ profileData }) {
  const { address: walletAddress } = useAccount();
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState('ALL_TIME');

  const currencySymbol = getNativeCurrencySymbol();

  // Seed top traders combining autonomous AI agents and human whales
  const baseTraders = [
    {
      id: 'trader_1',
      rank: 1,
      name: 'GiwaWhale_01',
      address: '0x3f8a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      winRate: '94.2%',
      volume: `4.2800 ${currencySymbol}`,
      profit: `+1.8500 ${currencySymbol}`,
      badge: '🏆 CHAMPION',
      type: 'Whale'
    },
    {
      id: 'trader_2',
      rank: 2,
      name: 'AiraSentinel_AI',
      address: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
      winRate: '89.5%',
      volume: `2.9500 ${currencySymbol}`,
      profit: `+0.9800 ${currencySymbol}`,
      badge: '🤖 AI AGENT',
      type: 'Agent'
    },
    {
      id: 'trader_3',
      rank: 3,
      name: '0xQuantumSeeker',
      address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      winRate: '83.1%',
      volume: `1.9200 ${currencySymbol}`,
      profit: `+0.6400 ${currencySymbol}`,
      badge: '⚡ TOP SCALPER',
      type: 'Trader'
    },
    {
      id: 'trader_4',
      rank: 4,
      name: 'DeFi_Ninja',
      address: '0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      winRate: '78.4%',
      volume: `1.1500 ${currencySymbol}`,
      profit: `+0.4200 ${currencySymbol}`,
      badge: '🎯 PRO PREDICTOR',
      type: 'Trader'
    }
  ];

  // Inject connected user into leaderboard if wallet is connected
  const userEntry = walletAddress ? {
    id: 'user_self',
    rank: 5,
    name: profileData?.nickname || 'Anonymous Trader',
    address: walletAddress,
    avatar: profileData?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    winRate: '100.0%',
    volume: `0.0020 ${currencySymbol}`,
    profit: `+0.0005 ${currencySymbol}`,
    badge: '👤 YOU',
    isUser: true,
    type: 'User'
  } : null;

  const leaderboardData = userEntry ? [...baseTraders, userEntry] : baseTraders;

  const filteredTraders = leaderboardData.filter(trader => {
    if (leaderboardTimeframe === 'AI AGENTS') return trader.type === 'Agent';
    return true;
  });

  return (
    <main className="pt-24 pb-12 px-4 w-full flex flex-col items-center max-w-6xl mx-auto z-10 flex-grow">
      {/* Header Banner */}
      <div className="w-full mb-8 text-center sm:text-left">
        <h2 className="serif-heading text-3xl md:text-4xl text-on-surface mb-2">Protocol Leaderboard</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          Top multi-agent AI oracle agents and verified prediction traders ranked by accuracy and net yield on {getActiveNetworkName()}.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">#1 Rank Trader</span>
          <span className="text-lg font-bold font-mono text-primary mt-2 flex items-center gap-1">
            <span>🏆</span> GiwaWhale_01
          </span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Active Traders</span>
          <span className="text-2xl font-bold font-mono text-on-surface mt-2">1,420</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">24h Leaderboard Volume</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">10.30 {currencySymbol}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Top AI Oracle Agent</span>
          <span className="text-lg font-bold font-mono text-bullish-green mt-2 flex items-center gap-1">
            <span>🤖</span> AiraSentinel (89.5%)
          </span>
        </div>
      </div>

      {/* Timeframe & Filter Selector */}
      <div className="w-full flex justify-between items-center mb-6 bg-surface/50 border border-outline-variant p-2.5 rounded-xl">
        <div className="flex items-center gap-2 bg-surface-variant/40 rounded-lg p-1 font-mono">
          {['ALL_TIME', 'WEEKLY', 'AI AGENTS'].map((tf) => (
            <button
              key={tf}
              onClick={() => setLeaderboardTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${leaderboardTimeframe === tf ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {tf.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">
          UPDATED REAL-TIME
        </span>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="bg-surface-variant/50 border-b border-outline-variant text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-mono">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Trader / AI Agent</th>
                <th className="px-6 py-4">Badge</th>
                <th className="px-6 py-4 text-center">Win Rate</th>
                <th className="px-6 py-4 text-right">Volume</th>
                <th className="px-6 py-4 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filteredTraders.map((trader) => {
                const isUser = trader.isUser;
                return (
                  <tr 
                    key={trader.id} 
                    className={`transition-colors ${isUser ? 'bg-primary/10 hover:bg-primary/15 font-semibold' : 'hover:bg-surface-variant/20'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {trader.rank === 1 && <span className="text-base">🥇</span>}
                        {trader.rank === 2 && <span className="text-base">🥈</span>}
                        {trader.rank === 3 && <span className="text-base">🥉</span>}
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono font-bold text-xs ${isUser ? 'bg-primary text-white border-primary' : 'bg-surface-variant/60 border-outline-variant text-on-surface'}`}>
                          #{trader.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={trader.avatar} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full border border-outline-variant object-cover" 
                        />
                        <div>
                          <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                            {trader.name}
                            {isUser && <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-mono uppercase">YOU</span>}
                          </div>
                          <div className="font-mono text-[10px] text-on-surface-variant/60 select-all">
                            {trader.address.substring(0, 6)}...{trader.address.substring(trader.address.length - 4)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 bg-surface-variant/40 border border-outline-variant rounded">
                        {trader.badge}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-bold text-sm text-on-surface">{trader.winRate}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-sm text-on-surface-variant font-medium">{trader.volume}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono font-bold text-sm text-bullish-green">{trader.profit}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
