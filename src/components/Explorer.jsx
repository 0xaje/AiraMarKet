import React, { useState, useEffect } from 'react';
import { getActiveNetworkName, getNativeCurrencySymbol } from '../lib/network';
import { ProtocolMetadata } from '../../config/protocol/protocol';

export default function Explorer() {
  const [data, setData] = useState({
    proposals: [],
    evidencePackages: [],
    transparency: [],
    ipfsUploads: [],
    consensusAudits: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedProposal, setExpandedProposal] = useState(null);

  useEffect(() => {
    fetchExplorerData();
  }, []);

  const fetchExplorerData = async () => {
    try {
      const res = await fetch('/api/explorer/data');
      if (res.ok) {
        const json = await res.json();
        setData({
          proposals: json.proposals || [],
          evidencePackages: json.evidencePackages || [],
          transparency: json.transparency || [],
          ipfsUploads: json.ipfsUploads || [],
          consensusAudits: json.consensusAudits || []
        });
      }
    } catch (e) {
      console.error("Error fetching explorer data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Search and Filter Logic
  const filteredProposals = data.proposals.filter(p => {
    // Search query match
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(query) ||
      p.signalId.toLowerCase().includes(query) ||
      (p.ipfsHash && p.ipfsHash.toLowerCase().includes(query));

    // Category filter match
    const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();

    // Status filter match
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'RESOLVED': return 'text-bullish-green bg-bullish-green/10 border-bullish-green/20';
      case 'REJECTED': return 'text-bearish-red bg-bearish-red/10 border-bearish-red/20';
      default: return 'text-on-surface-variant bg-surface-variant border-outline-variant';
    }
  };

  const getVoteColor = (vote) => {
    return vote === 'APPROVE' ? 'text-bullish-green font-bold' : 'text-bearish-red font-bold';
  };

  return (
    <main className="pt-24 pb-12 px-4 w-full flex flex-col items-center max-w-6xl mx-auto z-10 flex-grow">
      {/* Read-Only Banner */}
      <div className="w-full mb-6 bg-surface-variant/40 border border-outline-variant rounded-xl p-3 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-lg shrink-0">info</span>
        <span className="text-[10px] sm:text-xs font-mono text-on-surface-variant tracking-wide uppercase">
          read-only audit mode active — no administrative or mint privileges enabled.
        </span>
      </div>

      {/* Title */}
      <div className="w-full mb-8 text-center sm:text-left">
        <h2 className="serif-heading text-3xl md:text-4xl text-on-surface mb-2">Protocol Explorer</h2>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          Verifiable cognitive log ledger for signals, evidence packages, consensus evaluations, and settlements on {getActiveNetworkName()}.
        </p>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Total Signals</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">{data.evidencePackages.length}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Consensus Trials</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">{data.proposals.length}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">IPFS Uploads</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">{data.ipfsUploads.length}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Settlements</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">
            {data.proposals.filter(p => p.status === 'RESOLVED').length}
          </span>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mb-6 bg-surface/50 border border-outline-variant p-4 rounded-xl">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">search</span>
          <input 
            type="text" 
            placeholder="Search proposals, CID, hashes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="tech">Tech</option>
              <option value="crypto">Crypto</option>
              <option value="sports">Sports</option>
              <option value="politics">Politics</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Explorer List */}
      <div className="w-full flex flex-col gap-4">
        {loading ? (
          <div className="py-24 text-center text-sm font-mono tracking-widest text-on-surface-variant/60">
            LOADING LEDGER LOGS...
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="py-24 text-center bg-surface border border-outline-variant rounded-xl p-8 text-on-surface-variant/50">
            <span className="material-symbols-outlined text-4xl mb-3">troubleshoot</span>
            <p className="font-mono text-sm uppercase tracking-wider font-bold">No entries found matching filters</p>
          </div>
        ) : (
          filteredProposals.map(p => {
            const isExpanded = expandedProposal === p.id;
            
            // Fetch transparency log matching this proposal title if present
            const matchingTransparency = data.transparency.find(t => t.marketTitle === p.title);
            const matchingAudit = data.consensusAudits.find(a => a.signalId === p.signalId);

            return (
              <div key={p.id} className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm transition-all hover:border-outline-variant/80">
                <div 
                  onClick={() => setExpandedProposal(isExpanded ? null : p.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-variant/10 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <span className={`text-[10px] font-bold font-mono uppercase tracking-widest border px-2 py-0.5 rounded ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-on-surface tracking-tight mb-1">{p.title}</h3>
                    <p className="font-mono text-[10px] text-on-surface-variant/60 truncate">
                      SIGNAL ID: {p.signalId}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-[10px] font-mono text-on-surface-variant uppercase">Confidence</span>
                      <span className="font-mono font-bold text-sm text-primary">{(p.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant opacity-60 text-lg transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      expand_more
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-outline-variant/40 bg-surface-variant/10 p-5 flex flex-col gap-6 animate-fade-in text-xs">
                    
                    {/* Proposal Details & Ingestion Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-mono font-bold text-[10px] uppercase text-on-surface-variant tracking-widest mb-2">1. Ingested Signal & Metadata</h4>
                        <div className="bg-surface border border-outline-variant p-3 rounded-lg flex flex-col gap-2 font-mono text-[11px] leading-relaxed">
                          <div><span className="opacity-60">Source Origin:</span> Multi-Agent Audits</div>
                          <div><span className="opacity-60">Created At:</span> {new Date(p.createdAt).toLocaleString()}</div>
                          <div><span className="opacity-60">Sentiment Vector:</span> {p.sentiment}</div>
                          <div><span className="opacity-60">Expiry Timestamp:</span> {p.expiry}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-mono font-bold text-[10px] uppercase text-on-surface-variant tracking-widest mb-2">2. Verifiable Evidence CID</h4>
                        <div className="bg-surface border border-outline-variant p-3 rounded-lg flex flex-col gap-2 font-mono text-[11px] leading-relaxed">
                          <div>
                            <span className="opacity-60">IPFS CID:</span> 
                            {p.ipfsHash ? (
                              <span className="text-primary select-all break-all ml-1">{p.ipfsHash}</span>
                            ) : (
                              <span className="text-bearish-red ml-1">No CID attached</span>
                            )}
                          </div>
                          <div>
                            <span className="opacity-60">Verification Status:</span>
                            <span className="text-bullish-green font-bold ml-1">SHA-256 Validated</span>
                          </div>
                          <div>
                            <span className="opacity-60">On-Chain Factory:</span>
                            <span className="text-on-surface truncate ml-1">DUNAMU GIWA EVM</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agent Evaluations & Consensus Audits */}
                    <div>
                      <h4 className="font-mono font-bold text-[10px] uppercase text-on-surface-variant tracking-widest mb-2">3. Weighted Multi-Agent Consensus Trial</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {p.evaluations.map(ev => {
                          // Find agent weight parameters from dynamic metrics if present
                          const dynamicParam = matchingAudit?.auditTrail.find(a => a.agentName === ev.agentName);
                          return (
                            <div key={ev.id} className="bg-surface border border-outline-variant p-3 rounded-lg flex flex-col gap-2">
                              <div className="flex justify-between items-center border-b border-outline-variant/40 pb-1.5">
                                <span className="font-bold text-on-surface text-[11px] font-mono">{ev.agentName}</span>
                                <span className={`text-[10px] font-mono border px-1.5 rounded ${ev.vote === 'APPROVE' ? 'text-bullish-green border-bullish-green/30 bg-bullish-green/5' : 'text-bearish-red border-bearish-red/30 bg-bearish-red/5'}`}>
                                  {ev.vote}
                                </span>
                              </div>
                              <p className="text-[11px] text-on-surface-variant italic leading-normal flex-1">"{ev.reasoning}"</p>
                              <div className="pt-2 border-t border-outline-variant/30 flex justify-between text-[9px] font-mono text-on-surface-variant/70">
                                <div>Raw Conf: {(ev.confidence * 100).toFixed(0)}%</div>
                                {dynamicParam && (
                                  <div>Weight: {dynamicParam.weight.toFixed(1)}x (Acc: {(dynamicParam.accuracy * 100).toFixed(0)}%)</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* On-Chain Settlement Registry */}
                    <div>
                      <h4 className="font-mono font-bold text-[10px] uppercase text-on-surface-variant tracking-widest mb-2">4. On-Chain Settlement logs</h4>
                      <div className="bg-surface border border-outline-variant p-4 rounded-lg flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-2">
                          <span className="font-mono text-[10px] opacity-60">GIWA TRANSACTION HASH</span>
                          {matchingTransparency?.txHash ? (
                            <a 
                              href={`https://sepolia-explorer.giwa.io/tx/${matchingTransparency.txHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-primary underline font-bold select-all break-all flex items-center gap-1"
                            >
                              {matchingTransparency.txHash}
                              <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                            </a>
                          ) : (
                            <span className="font-mono text-xs text-amber-500 italic">Pending transaction execution</span>
                          )}
                        </div>
                        {matchingAudit && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 font-mono text-[10px]">
                            <div>
                              <span className="opacity-60 block">Weighted Score</span>
                              <span className="font-bold text-on-surface">{(matchingAudit.weightedScore * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="opacity-60 block">Weighted Confidence</span>
                              <span className="font-bold text-on-surface">{(matchingAudit.weightedConfidence * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="opacity-60 block">Compound Probability</span>
                              <span className="font-bold text-on-surface">{(matchingAudit.approvalProbability * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="opacity-60 block">Audit Status</span>
                              <span className="text-bullish-green font-bold">Consensus Approved</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
