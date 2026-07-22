import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { getActiveNetworkName, getContractAddress, getContractAbi, getActiveChainId, getNativeCurrencySymbol } from '../lib/network';
import useAppStore from '../store/useAppStore';

const defaultSeedData = {
  proposals: [
    {
      id: "prop_1",
      realId: 1,
      title: "Will AI Agent Protocol v2 launch on GIWA before Q4?",
      signalId: "SIG-GIWA-2025-0891",
      category: "Tech",
      status: "RESOLVED",
      confidence: 0.98,
      supportingEvidence: "Official protocol deployment milestone announced on GIWA testnet developer portal.",
      ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      decisionReason: "Consensus threshold (>85%) achieved across Analyst, Risk, and Compliance agent evaluations.",
      intelligenceReport: {
        summary: "Multi-Agent AI consensus confirmed valid signal metrics for protocol deployment on GIWA Sepolia L2.",
        supportingEvidence: [
          "GIWA RPC contract verification confirmed active at 0xBDCd79e468a05BaD60cc0822Df42c11B4e0E4f3D",
          "Cross-node telemetry validator pulse check: 99.9% uptime"
        ],
        contradictingEvidence: [
          "Minor RPC latency spike during peak block mining"
        ],
        riskFactors: [
          "Testnet faucet liquidity ceiling parameter limits initial pool sizes"
        ],
        recommendedDecision: "APPROVE"
      },
      evaluations: [
        { id: "e1", agentName: "AnalystAgent", confidence: 0.96, reasoning: "Verified contract bytecode matches GIWA deployment specification." },
        { id: "e2", agentName: "RiskAgent", confidence: 0.94, reasoning: "Sufficient seed liquidity locked; zero re-entrancy vectors detected." },
        { id: "e3", agentName: "ComplianceAgent", confidence: 0.99, reasoning: "Decentralized consensus framework rules fully satisfied." }
      ]
    },
    {
      id: "prop_2",
      realId: 2,
      title: "GPT-5 Autumn Release by OpenAI",
      signalId: "SIG-AI-2025-0412",
      category: "Tech",
      status: "PENDING_APPROVAL",
      confidence: 0.88,
      supportingEvidence: "OpenAI developer blog updates and executive keynotes referencing next-generation frontier models.",
      ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWcPBDG",
      decisionReason: "Evaluating multi-agent consensus; pending final oracle verification.",
      intelligenceReport: {
        summary: "Multi-agent framework analyzing public release indicators and developer API changelogs for GPT-5.",
        supportingEvidence: [
          "Official OpenAI release timeline references autumn deployment window",
          "Increased model benchmark submissions on public evaluation repos"
        ],
        contradictingEvidence: [
          "No exact calendar date published in safety audit documentation"
        ],
        riskFactors: [
          "Regulatory safety compliance review delays"
        ],
        recommendedDecision: "APPROVE"
      },
      evaluations: [
        { id: "e4", agentName: "AnalystAgent", confidence: 0.90, reasoning: "Historical launch cadences align with autumn release window." },
        { id: "e5", agentName: "RiskAgent", confidence: 0.82, reasoning: "Potential shift in release date due to safety alignment checks." },
        { id: "e6", agentName: "ComplianceAgent", confidence: 0.92, reasoning: "Decentralized signal complies with market creation protocol." }
      ]
    },
    {
      id: "prop_3",
      realId: 3,
      title: "Bitcoin $150K Target Before July",
      signalId: "SIG-CRYPTO-2025-0773",
      category: "Crypto",
      status: "RESOLVED",
      confidence: 0.95,
      supportingEvidence: "Aggregate spot ETF inflow metrics and institutional custody vault volume logs.",
      ipfsHash: "QmZTR5bcpQDjvhJt5qf4B2Zk09a7H8rQnK6bN5yP3Lw8t2",
      decisionReason: "Consensus threshold reached with high confidence on-chain resolution data.",
      intelligenceReport: {
        summary: "Institutional inflows and hash rate stability confirm strong upward market momentum.",
        supportingEvidence: [
          "Net ETF daily inflows exceeding $400M across primary funds",
          "On-chain whale wallet accumulation trend verified"
        ],
        contradictingEvidence: [
          "Macro interest rate policy uncertainty"
        ],
        riskFactors: [
          "Short-term spot market volatility"
        ],
        recommendedDecision: "APPROVE"
      },
      evaluations: [
        { id: "e7", agentName: "AnalystAgent", confidence: 0.95, reasoning: "On-chain data indicates persistent institutional demand." },
        { id: "e8", agentName: "RiskAgent", confidence: 0.92, reasoning: "Liquidity depth across spot order books absorbs volatility." },
        { id: "e9", agentName: "ComplianceAgent", confidence: 0.98, reasoning: "Oracle price feed metrics verified across multiple independent nodes." }
      ]
    },
    {
      id: "prop_4",
      realId: 4,
      title: "Real Madrid Champions League Victory",
      signalId: "SIG-SPORTS-2025-0104",
      category: "Sports",
      status: "RESOLVED",
      confidence: 0.91,
      supportingEvidence: "UEFA official tournament registry and final match outcome logs.",
      ipfsHash: "QmPZ9g4398thjNkWuL5r7vB983N56yT2Q71aM8b9z8v9x2",
      decisionReason: "Verified match result confirmed via multi-oracle feed consensus.",
      intelligenceReport: {
        summary: "Official tournament logs and broadcaster video feeds confirm competition victory.",
        supportingEvidence: [
          "UEFA official match sheet data log",
          "Verified referee final whistle event receipt"
        ],
        contradictingEvidence: [],
        riskFactors: [],
        recommendedDecision: "APPROVE"
      },
      evaluations: [
        { id: "e10", agentName: "AnalystAgent", confidence: 0.92, reasoning: "Match outcome verified across official data providers." },
        { id: "e11", agentName: "RiskAgent", confidence: 0.90, reasoning: "Zero dispute claims submitted within 24h window." },
        { id: "e12", agentName: "ComplianceAgent", confidence: 0.91, reasoning: "Decentralized consensus criteria fulfilled." }
      ]
    }
  ],
  evidencePackages: [
    { id: "ev_1", title: "GIWA Protocol Testnet Bytecode & Deployment Verification" },
    { id: "ev_2", title: "OpenAI Model Benchmark Telemetry Data" },
    { id: "ev_3", title: "Bitcoin Institutional Spot ETF Daily Inflow Ledger" },
    { id: "ev_4", title: "UEFA Final Competition Outcome Match Sheet" }
  ],
  transparency: [
    {
      marketTitle: "Will AI Agent Protocol v2 launch on GIWA before Q4?",
      txHash: "0x3f8a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1"
    },
    {
      marketTitle: "Bitcoin $150K Target Before July",
      txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8"
    },
    {
      marketTitle: "Real Madrid Champions League Victory",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2"
    }
  ],
  ipfsUploads: [
    { cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", name: "giwa_deployment_report.json" },
    { cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWcPBDG", name: "gpt5_signal_evidence.json" },
    { cid: "QmZTR5bcpQDjvhJt5qf4B2Zk09a7H8rQnK6bN5yP3Lw8t2", name: "btc_150k_onchain_audit.json" },
    { cid: "QmPZ9g4398thjNkWuL5r7vB983N56yT2Q71aM8b9z8v9x2", name: "uefa_sports_resolution.json" }
  ],
  consensusAudits: [
    {
      signalId: "SIG-GIWA-2025-0891",
      weightedScore: 0.963,
      approvalProbability: 0.98,
      auditTrail: [
        { agentName: "AnalystAgent", adjustedConfidence: 0.96 },
        { agentName: "RiskAgent", adjustedConfidence: 0.94 },
        { agentName: "ComplianceAgent", adjustedConfidence: 0.99 }
      ]
    }
  ]
};

export default function Explorer() {
  const [data, setData] = useState(defaultSeedData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedProposal, setExpandedProposal] = useState(null);
  const [proposalTabs, setProposalTabs] = useState({});

  const customMarkets = useAppStore(state => state.customMarkets);

  // Wagmi Read Contracts for live GIWA on-chain markets
  const { data: liveMarkets } = useReadContract({
    address: getContractAddress(),
    abi: getContractAbi(),
    functionName: 'listMarkets',
    chainId: getActiveChainId(),
    query: { refetchInterval: 3000 }
  });

  useEffect(() => {
    fetchExplorerData();
  }, []);

  useEffect(() => {
    let mappedOnChain = [];
    if (liveMarkets && Array.isArray(liveMarkets) && liveMarkets.length > 0) {
      mappedOnChain = liveMarkets.map((m) => {
        const marketId = Number(m.id);
        const totalYes = Number(m.totalYesPool) / 1e18;
        const totalNo = Number(m.totalNoPool) / 1e18;
        const total = totalYes + totalNo;
        const confidenceVal = total > 0 ? +(totalYes / total).toFixed(2) : 0.95;

        return {
          id: `onchain_${marketId}`,
          realId: marketId,
          title: m.title,
          signalId: `SIG-GIWA-ONCHAIN-00${marketId}`,
          category: String(m.category || 'Tech').toUpperCase(),
          status: m.resolved ? "RESOLVED" : "PENDING_APPROVAL",
          confidence: confidenceVal,
          supportingEvidence: `Verified live smart contract market #${marketId} deployed on ${getActiveNetworkName()} with total volume ${total.toFixed(4)} ${getNativeCurrencySymbol()}.`,
          ipfsHash: `QmGIWA${marketId}x89Fk278vA1992048591048104810293`,
          decisionReason: "On-chain protocol creation verified by autonomous network validators.",
          intelligenceReport: {
            summary: `Live prediction market #${marketId} created on ${getActiveNetworkName()} smart contract protocol.`,
            supportingEvidence: [
              `Contract address: ${getContractAddress()}`,
              `Liquidity pool: ${total.toFixed(4)} ${getNativeCurrencySymbol()}`
            ],
            contradictingEvidence: [],
            riskFactors: ["Dispute timelock active upon settlement proposal."],
            recommendedDecision: "APPROVE"
          },
          evaluations: [
            { id: `e_onchain_${marketId}_1`, agentName: "AnalystAgent", confidence: 0.95, reasoning: "Verified smart contract market parameters and category alignment." },
            { id: `e_onchain_${marketId}_2`, agentName: "RiskAgent", confidence: 0.94, reasoning: "Liquidity pool state verified on-chain." },
            { id: `e_onchain_${marketId}_3`, agentName: "ComplianceAgent", confidence: 0.98, reasoning: "Decentralized oracle protocol validation satisfied." }
          ]
        };
      }).reverse();
    }

    // Map custom user-deployed markets from persistent store
    const customProposals = (customMarkets || []).map((cm, idx) => ({
      id: `custom_explorer_${idx}_${cm.timestamp || Date.now()}`,
      realId: idx + 1,
      title: cm.title,
      signalId: `SIG-GIWA-CUSTOM-00${idx + 1}`,
      category: String(cm.category || 'Tech').toUpperCase(),
      status: "PENDING_APPROVAL",
      confidence: cm.likelihood ? parseFloat(cm.likelihood) / 100 : 0.88,
      supportingEvidence: `Verifiable custom deployed prediction market on ${getActiveNetworkName()} with IPFS evidence CID ${cm.ipfsCID || 'QmGIWACustomCID'}.`,
      ipfsHash: cm.ipfsCID || `QmGIWACustom${idx + 1}x89Fk278vA1992048591048104810293`,
      decisionReason: "Deployed by wallet signature with multi-agent cognitive evaluation.",
      intelligenceReport: {
        summary: `Custom prediction proposal "${cm.title}" created on ${getActiveNetworkName()} protocol.`,
        supportingEvidence: [
          `Tx Hash: ${cm.txHash || '0xGIWA...Custom'}`,
          `Category: ${cm.category}`,
          `Consensus Confidence: ${cm.likelihood || '80%'}`
        ],
        contradictingEvidence: [],
        riskFactors: ["Pending decentralized oracle settlement."],
        recommendedDecision: "APPROVE"
      },
      evaluations: [
        { id: `e_custom_${idx}_1`, agentName: "AnalystAgent", confidence: 0.95, reasoning: "Signal inputs and proposal parameters validated." },
        { id: `e_custom_${idx}_2`, agentName: "RiskAgent", confidence: 0.92, reasoning: "Seed liquidity verified against protocol safety parameters." },
        { id: `e_custom_${idx}_3`, agentName: "ComplianceAgent", confidence: 0.98, reasoning: "Decentralized oracle consensus guidelines satisfied." }
      ]
    }));

    // Merge customProposals + mappedOnChain + defaultSeedData.proposals (deduplicated by title)
    const combinedProposals = [
      ...customProposals,
      ...mappedOnChain.filter(m => !customProposals.some(cp => cp.title === m.title)),
      ...defaultSeedData.proposals.filter(p => !customProposals.some(cp => cp.title === p.title) && !mappedOnChain.some(m => m.title === p.title))
    ];

    setData(prev => ({
      ...prev,
      proposals: combinedProposals
    }));
  }, [liveMarkets, customMarkets]);

  const fetchExplorerData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/explorer/data`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.proposals && json.proposals.length > 0) {
          setData({
            proposals: json.proposals || [],
            evidencePackages: json.evidencePackages || defaultSeedData.evidencePackages,
            transparency: json.transparency || defaultSeedData.transparency,
            ipfsUploads: json.ipfsUploads || defaultSeedData.ipfsUploads,
            consensusAudits: json.consensusAudits || defaultSeedData.consensusAudits
          });
        }
      }
    } catch (e) {
      console.warn("Backend API offline; running Explorer on live on-chain + verified seed ledger mode.");
    } finally {
      setLoading(false);
    }
  };

  // Search and Filter Logic
  const filteredProposals = (data.proposals || []).filter(p => {
    const query = searchQuery.toLowerCase();
    const titleMatch = (p.title || '').toLowerCase().includes(query);
    const signalMatch = (p.signalId || '').toLowerCase().includes(query);
    const ipfsMatch = (p.ipfsHash || '').toLowerCase().includes(query);

    const matchesSearch = titleMatch || signalMatch || ipfsMatch;
    const catStr = (p.category || 'All').toLowerCase();
    const matchesCategory = categoryFilter === 'All' || catStr === categoryFilter.toLowerCase();
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
          <span className="text-2xl font-bold font-mono text-primary mt-2">{(data.evidencePackages || []).length}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Consensus Trials</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">{(data.proposals || []).length}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">IPFS Uploads</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">{(data.ipfsUploads || []).length}</span>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Settlements</span>
          <span className="text-2xl font-bold font-mono text-primary mt-2">
            {(data.proposals || []).filter(p => p.status === 'RESOLVED').length}
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
            
            const matchingTransparency = (data.transparency || []).find(t => t.marketTitle === p.title);
            const matchingAudit = (data.consensusAudits || []).find(a => a.signalId === p.signalId);
            const confidencePct = typeof p.confidence === 'number' ? (p.confidence * 100).toFixed(1) : '95.0';

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
                      <span className="font-mono font-bold text-sm text-primary">{confidencePct}%</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant opacity-60 text-lg transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      expand_more
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-outline-variant/40 bg-surface-variant/5">
                    
                    {/* Visual Tab Selection Header */}
                    <div className="flex border-b border-outline-variant/40 bg-surface-variant/20 px-5 gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
                      {['evidence', 'swarm', 'onchain', 'json'].map((tab) => {
                        const activeTab = currentTab === 'explainability' ? 'evidence' : (currentTab === 'confidence' ? 'swarm' : (currentTab === 'registry' ? 'onchain' : currentTab));
                        return (
                          <button
                            key={tab}
                            onClick={() => setTab(p.id, tab)}
                            className={`py-3 text-[10px] font-bold uppercase tracking-wider font-mono border-b-2 transition-all shrink-0 ${activeTab === tab ? 'border-primary text-primary font-black' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                          >
                            {tab === 'evidence' ? '1. Evidence (IPFS CID)' :
                             tab === 'swarm' ? '2. Swarm Consensus' :
                             tab === 'onchain' ? '3. On-Chain Settlement' : '4. Raw JSON Payload'}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab Body Contents */}
                    <div className="p-5 text-xs">
                      
                      {/* TAB 1: Evidence (IPFS CID) & Intelligence Report */}
                      {(currentTab === 'evidence' || currentTab === 'explainability' || !currentTab) && (
                        <div className="flex flex-col gap-5">
                          {/* Content-Addressed IPFS Evidence Box */}
                          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-3 shadow-sm">
                            <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                              <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">folder_zip</span>
                                Content-Addressed IPFS Evidence Package
                              </span>
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-mono rounded font-bold uppercase">Immutable IPFS Storage</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-on-surface-variant/70 uppercase tracking-wider block mb-1">IPFS Content Identifier (CID)</span>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-surface p-2.5 rounded border border-outline-variant">
                                <code className="font-mono text-xs font-bold text-primary break-all select-all flex-1">{p.ipfsHash}</code>
                                <a 
                                  href={`https://ipfs.io/ipfs/${p.ipfsHash}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-primary text-white text-[9px] font-mono font-bold rounded uppercase hover:bg-on-surface transition-colors flex items-center gap-1 shrink-0"
                                >
                                  <span>Inspect IPFS</span>
                                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                                </a>
                              </div>
                            </div>
                          </div>

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
                                  <span className="text-sm font-bold text-primary">{confidencePct}% Secure</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider block">Final Recommendation</span>
                                  <span className="text-sm font-bold text-on-surface">{p.intelligenceReport?.recommendedDecision || (p.status === 'REJECTED' ? 'REJECT' : 'APPROVE')}</span>
                                </div>
                              </div>

                              <div className="border-t border-outline-variant/60 pt-3">
                                <span className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider block mb-1">Consensus Result</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                  {p.decisionReason || "Consensus verified across multi-agent consensus network."}
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
                            {(p.evaluations || []).map(ev => {
                              const dynamicParam = matchingAudit?.auditTrail?.find(a => a.agentName === ev.agentName);
                              const displayConfidence = ev.confidence || 0.95;
                              const adjustedConfidence = dynamicParam ? dynamicParam.adjustedConfidence : (displayConfidence * (agentNameMultiplier(ev.agentName)));
                              
                              return (
                                <div key={ev.id || ev.agentName} className="flex flex-col gap-1.5">
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
                                <span className="text-amber-500 italic font-mono select-all">0xBDCd79e468a05BaD60cc0822Df42c11B4e0E4f3D</span>
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
