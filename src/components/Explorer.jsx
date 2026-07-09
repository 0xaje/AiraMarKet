import React, { useState, useEffect } from 'react';
import { getActiveNetworkName } from '../lib/network';

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
  const [proposalTabs, setProposalTabs] = useState({}); // marketId => tabName ('explainability', 'confidence', 'evidence', 'registry')

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
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(query) ||
      p.signalId.toLowerCase().includes(query) ||
      (p.ipfsHash && p.ipfsHash.toLowerCase().includes(query));

    const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
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
    return vote === 'APPROVE' ? 'text-bullish-green' : 'text-bearish-red';
  };

  const setTab = (proposalId, tabName) => {
    setProposalTabs(prev => ({
      ...prev,
      [proposalId]: tabName
    }));
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
            const currentTab = proposalTabs[p.id] || 'explainability';
            
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
                  <div className="border-t border-outline-variant/40 bg-surface-variant/5">
                    
                    {/* Visual Tab Selection Header */}
                    <div className="flex border-b border-outline-variant/40 bg-surface-variant/20 px-5 gap-4">
                      {['explainability', 'confidence', 'evidence', 'registry'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setTab(p.id, tab)}
                          className={`py-3 text-[10px] font-bold uppercase tracking-wider font-mono border-b-2 transition-all ${currentTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                        >
                          {tab === 'explainability' ? 'Intelligence Report' :
                           tab === 'confidence' ? 'Confidence Distribution' :
                           tab === 'evidence' ? 'Supporting Evidence' : 'On-Chain Registry'}
                        </button>
                      ))}
                    </div>

                    {/* Tab Body Contents */}
                    <div className="p-5 text-xs">
                      
                      {/* TAB 1: Intelligence Report */}
                      {currentTab === 'explainability' && (
                        <div className="flex flex-col gap-5">
                          <div className="bg-surface border border-outline-variant p-5 rounded-xl space-y-4 shadow-sm">
                            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
                              <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-widest">Protocol Intelligence Report</span>
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-mono rounded font-bold uppercase">Consensus Secured</span>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h4 className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-wider mb-1">Executive Summary</h4>
                                <p className="text-xs text-on-surface leading-relaxed font-medium">
                                  {p.intelligenceReport?.summary || `This intelligence report aggregates the consensus evaluations from Analyst, Risk, and Compliance agents for proposal "${p.title}".`}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                  <h4 className="text-[10px] font-bold text-bullish-green font-mono uppercase tracking-wider">Supporting Evidence</h4>
                                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-on-surface-variant">
                                    {p.intelligenceReport?.supportingEvidence && Array.isArray(p.intelligenceReport.supportingEvidence) ? (
                                      p.intelligenceReport.supportingEvidence.map((e, i) => <li key={i}>{e}</li>)
                                    ) : (
                                      <li>Verifiable metrics from data provider feed logs.</li>
                                    )}
                                  </ul>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-[10px] font-bold text-bearish-red font-mono uppercase tracking-wider">Conflicting Evidence</h4>
                                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-on-surface-variant">
                                    {p.intelligenceReport?.contradictingEvidence && Array.isArray(p.intelligenceReport.contradictingEvidence) ? (
                                      p.intelligenceReport.contradictingEvidence.map((e, i) => <li key={i}>{e}</li>)
                                    ) : (
                                      <li>No high-severity conflicting historical indicators logged.</li>
                                    )}
                                  </ul>
                                </div>
                              </div>

                              <div className="pt-2">
                                <h4 className="text-[10px] font-bold text-amber-600 font-mono uppercase tracking-wider mb-1">Risk Observations</h4>
                                <ul className="list-disc pl-4 space-y-1 text-[11px] text-on-surface-variant">
                                  {p.intelligenceReport?.riskFactors && Array.isArray(p.intelligenceReport.riskFactors) ? (
                                    p.intelligenceReport.riskFactors.map((r, i) => <li key={i}>{r}</li>)
                                  ) : (
                                    <li>Volatility offsets and protocol execution timeline bounds.</li>
                                  )}
                                </ul>
                              </div>

                              <div className="border-t border-outline-variant/60 pt-3 grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider block">Final Confidence</span>
                                  <span className="text-sm font-bold text-primary">{(p.confidence * 100).toFixed(0)}% Secure</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider block">Final Recommendation</span>
                                  <span className="text-sm font-bold text-on-surface">{p.intelligenceReport?.recommendedDecision || (p.status === 'REJECTED' ? 'REJECT' : 'APPROVE')}</span>
                                </div>
                              </div>

                              <div className="border-t border-outline-variant/60 pt-3">
                                <span className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider block mb-1">Consensus Result</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                  {p.decisionReason}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: Confidence Distribution visual indicators */}
                      {currentTab === 'confidence' && (
                        <div className="flex flex-col gap-5">
                          <span className="font-bold uppercase tracking-widest text-[9px] font-mono text-on-surface-variant block">Consensus Confidence distribution</span>
                          <div className="flex flex-col gap-4 bg-surface border border-outline-variant p-4 rounded-xl">
                            {p.evaluations.map(ev => {
                              const dynamicParam = matchingAudit?.auditTrail.find(a => a.agentName === ev.agentName);
                              const displayConfidence = ev.confidence;
                              const adjustedConfidence = dynamicParam ? dynamicParam.adjustedConfidence : (ev.confidence * (agentNameMultiplier(ev.agentName)));
                              
                              return (
                                <div key={ev.id} className="flex flex-col gap-1.5">
                                  <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                                    <span className="text-on-surface">{ev.agentName}</span>
                                    <span className="text-on-surface-variant">
                                      Raw: {(displayConfidence * 100).toFixed(0)}% | Adjusted: {(adjustedConfidence * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  {/* Progress bar container */}
                                  <div className="w-full h-2.5 bg-surface-variant/40 rounded-full overflow-hidden border border-outline-variant/20 flex">
                                    <div 
                                      className="bg-primary rounded-full transition-all duration-500" 
                                      style={{ width: `${displayConfidence * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-[10px] text-on-surface-variant/70 italic leading-normal mt-0.5">
                                    "{ev.reasoning}"
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* TAB 3: Supporting Evidence details */}
                      {currentTab === 'evidence' && (
                        <div className="flex flex-col gap-4">
                          <span className="font-bold uppercase tracking-widest text-[9px] font-mono text-on-surface-variant block">Supporting Evidence metadata</span>
                          <div className="bg-surface border border-outline-variant p-4 rounded-xl flex flex-col gap-3">
                            <div className="font-mono text-[11px] leading-relaxed flex flex-col gap-2">
                              <div><span className="opacity-60 block text-[9px] uppercase tracking-wider">Summary</span> {p.supportingEvidence}</div>
                              <div className="border-t border-outline-variant/30 pt-2 mt-1">
                                <span className="opacity-60 block text-[9px] uppercase tracking-wider mb-1">Verifiable Evidence CID</span>
                                {p.ipfsHash ? (
                                  <span className="text-primary font-bold select-all break-all">{p.ipfsHash}</span>
                                ) : (
                                  <span className="text-bearish-red italic">No IPFS hashes attached</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: On-Chain Registry transaction logs */}
                      {currentTab === 'registry' && (
                        <div className="flex flex-col gap-4">
                          <span className="font-bold uppercase tracking-widest text-[9px] font-mono text-on-surface-variant block">GIWA Settlement coordinate details</span>
                          <div className="bg-surface border border-outline-variant p-4 rounded-xl flex flex-col gap-3 font-mono text-[11px]">
                            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                              <span className="opacity-60">Settlement Ledger</span>
                              <span className="font-bold text-on-surface">GIWA Sepolia L2 Network</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-outline-variant/30 pb-2">
                              <span className="opacity-60 text-[9px] uppercase tracking-wider">Transaction hash</span>
                              {matchingTransparency?.txHash ? (
                                <a 
                                  href={`https://sepolia-explorer.giwa.io/tx/${matchingTransparency.txHash}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary underline font-bold select-all break-all flex items-center gap-1"
                                >
                                  {matchingTransparency.txHash}
                                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                                </a>
                              ) : (
                                <span className="text-amber-500 italic">Oracle resolution pending transaction</span>
                              )}
                            </div>
                            {matchingAudit && (
                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                  <span className="opacity-60 text-[9px] block">Weighted Score</span>
                                  <span className="font-bold">{(matchingAudit.weightedScore * 100).toFixed(1)}%</span>
                                </div>
                                <div>
                                  <span className="opacity-60 text-[9px] block">Compound Probability</span>
                                  <span className="font-bold">{(matchingAudit.approvalProbability * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

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

// Simple fallback helper for confidence scaling
function agentNameMultiplier(name) {
  if (name === 'RiskAgent') return 0.95;
  if (name === 'ComplianceAgent') return 1.05;
  return 1.0;
}
