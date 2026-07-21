import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtocolMetadata } from '../../config/protocol/protocol';

export default function Landing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('evidence');
  const [demoStep, setDemoStep] = useState(0); // 0: Start, 1 to 8: Steps

  const steps = [
    {
      id: 'evidence',
      title: '1. Evidence Ingestion',
      subtitle: 'Deterministic Cryptographic Packages',
      description: 'Signals from feeds are collected, validated, and normalized into standard Evidence Packages. Every input goes through strict key-sorting to create a tamper-proof hash.',
      badge: 'evidence validation',
      details: [
        'Normalized Input: Topic metadata, signal parameters, timestamps, and model enums.',
        'Deterministic Serializer: Sorts all JSON object keys alphabetically.',
        'Integrity Anchor: Generates a deterministic SHA-256 signature locally before upload.'
      ],
      code: `// Deterministic Key Sorting
function serialize(payload) {
  const sorted = sortKeysAlphabetically(payload);
  const jsonString = JSON.stringify(sorted);
  return sha256(jsonString);
}`
    },
    {
      id: 'debate',
      title: '2. Multi-Agent Debate',
      subtitle: 'Interactive Peer-Review Swarms',
      description: 'Agents do not vote in isolation. The Agent Debate Engine initiates a sequential challenge loop where Risk and Compliance review the Analyst before locking consensus.',
      badge: 'swarm consensus',
      details: [
        'Turn 1 (Analyst): Proposes signal and submits initial feasibility arguments.',
        'Turn 2 (Risk): Audits proposal, notes volatility indicators, and asks questions.',
        'Turn 3 (Compliance): Analyzes policy parameters and flags licensing conditions.',
        'Turn 4 (Resolution): Analyst addresses issues, and Consensus resolves final positions.'
      ],
      code: `// Debate Lifecycle Transition enums
enum DebateStatus {
  INITIATED,
  RISK_REVIEW,
  COMPLIANCE_REVIEW,
  ANALYST_RESPONSE,
  CONCLUDED
}`
    },
    {
      id: 'ipfs',
      title: '3. Storage Layer',
      subtitle: 'IPFS Evidence Anchoring Framework',
      description: 'Supports IPFS evidence anchoring for high-availability metadata logging and cryptographic multihash verification.',
      badge: 'ipfs registry',
      details: [
        'Provider Adapters: Sequential failover support for Pinata, Web3.Storage, and gateway nodes.',
        'CID Validation: Enforces base58 regex patterns before logging metrics.',
        'Telemetry Logging: Tracks latencies, package sizes, and node status.'
      ],
      code: `// Content Identifier format validation
const cidRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{55,59})$/;
if (!cidRegex.test(cid)) {
  throw new Error("Invalid IPFS CID");
}`
    },
    {
      id: 'giwa',
      title: '4. GIWA Transaction Ledger',
      subtitle: 'On-Chain Execution & Auditing',
      description: 'Decisions are finalized by writing the Evidence Package CID and target parameters to the smart contract on Dunamu\'s high-performance L2 ledger.',
      badge: 'on-chain settlement',
      details: [
        'Contract Methods: Triggers on-chain deployment and resolution events.',
        'Gas Optimization: Legacy gas settings enable consistent execution.',
        'Public Audits: Anyone can fetch the IPFS CID from on-chain logs and audit it locally.'
      ],
      code: `// On-chain log verification
const match = localComputedHash === onChainLoggedHash;
if (match) {
  console.log("Decision Integrity Verified");
}`
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep);

  const handleNextDemoStep = () => {
    if (demoStep < 8) setDemoStep(prev => prev + 1);
  };

  const handleResetDemo = () => {
    setDemoStep(0);
  };

  return (
    <main className="relative pt-32 pb-16 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center px-4 md:px-8 flex-grow w-full max-w-5xl mx-auto z-10">
      <div className="w-full text-center flex flex-col items-center flex-grow justify-center max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 mb-6 bg-surface shadow-sm text-[9px] font-bold tracking-[0.25em] text-primary uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          AIRA PROTOCOL v{ProtocolMetadata.protocolVersion}
        </div>
        
        {/* Hero Title */}
        <h1 className="serif-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] mb-6 text-on-surface tracking-tight font-black max-w-4xl">
          Transparent AI <span className="italic text-primary bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">Decisions</span>. Verifiable on GIWA.
        </h1>
        
        {/* Tagline / Subtitle */}
        <p className="max-w-2xl mx-auto text-on-surface-variant text-xs sm:text-sm md:text-base font-medium leading-relaxed mb-8 opacity-90 px-4">
          AIRA aggregates decentralized multi-agent consensus streams to normalize real-world signals into verifiable Evidence Packages. We bridge cognitive reasoning with trustless execution, permanently anchoring audits on-chain via the high-performance GIWA OP Stack L2.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4 w-full mb-12">
          <button 
            className="w-full sm:w-auto px-7 py-3.5 bg-primary text-white rounded-lg font-extrabold text-[10px] tracking-[0.2em] uppercase hover:bg-on-surface hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            onClick={() => navigate('/feed')}
          >
            <span className="material-symbols-outlined text-sm">play_circle</span>
            <span>Try Live Demo</span>
          </button>
          <button 
            className="w-full sm:w-auto px-7 py-3.5 bg-surface border border-outline text-on-surface rounded-lg font-bold text-[10px] tracking-[0.2em] uppercase hover:border-primary hover:text-primary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            onClick={() => navigate('/creator')}
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Consensus Engine</span>
          </button>
          <button 
            className="w-full sm:w-auto px-7 py-3.5 bg-surface-variant/50 border border-outline-variant text-on-surface-variant rounded-lg font-bold text-[10px] tracking-[0.2em] uppercase hover:border-primary hover:text-primary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            onClick={() => navigate('/explorer')}
          >
            <span className="material-symbols-outlined text-sm">account_tree</span>
            <span>View Architecture</span>
          </button>
        </div>

        {/* Guided Demonstration Simulator Dashboard */}
        <div className="w-full max-w-3xl mb-12 p-6 md:p-8 bg-surface border border-outline rounded-2xl text-left shadow-lg">
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/60 pb-4">
            <div>
              <span className="text-[8px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-1 block">Live presentation sandbox</span>
              <h3 className="text-lg font-bold text-on-surface tracking-tight font-display">
                AIRA Protocol Lifecycle Simulator
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-[9px] font-bold font-mono text-on-surface-variant uppercase">
              {demoStep === 0 ? 'READY' : `STEP ${demoStep} / 8`}
            </span>
          </div>

          {demoStep === 0 && (
            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Experience the end-to-end verifiable AI timeline of the AIRA Protocol in under two minutes. Step through signal ingestion, peer agent reviews, on-chain execution, and browser-side cryptographic audit validation.
              </p>
              <button
                onClick={handleNextDemoStep}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-[9px] tracking-wider uppercase rounded-lg shadow-md transition-all font-mono"
              >
                Start Guided Simulation
              </button>
            </div>
          )}

          {demoStep > 0 && (
            <div className="space-y-6">
              {/* Simulation Screen Content */}
              <div className="bg-surface-variant/30 border border-outline-variant rounded-xl p-5 min-h-[140px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-widest">
                      {demoStep === 1 && 'Ingesting Signal'}
                      {demoStep === 2 && 'Evidence Package Prepared'}
                      {demoStep === 3 && 'Multi-Agent Swarm Debate'}
                      {demoStep === 4 && 'Consensus Verdict reached'}
                      {demoStep === 5 && 'Human review checkpoint'}
                      {demoStep === 6 && 'Distributed IPFS Storage'}
                      {demoStep === 7 && 'GIWA L2 Settlement'}
                      {demoStep === 8 && 'Explorer Audit matching'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  </div>

                  {demoStep === 1 && (
                    <div className="space-y-1 text-xs text-on-surface">
                      <p className="font-mono text-[10px] text-on-surface-variant">[ORACLE_INGEST] Ingesting breaking analytics stream feed...</p>
                      <p className="font-semibold mt-1">Topic: "Ethereum average gas fees drop below 1 Gwei after EIP stabilization"</p>
                      <p className="text-on-surface-variant">Classified Category: Crypto | Provider: Etherscan</p>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="space-y-2 text-xs text-on-surface">
                      <p className="font-mono text-[10px] text-on-surface-variant">[EVIDENCE_SERVICE] Normalizing parameters and performing alphabetic key sorting...</p>
                      <div className="bg-surface p-3 border border-outline-variant rounded font-mono text-[10px] text-on-surface-variant break-all select-all">
                        Computed Hash Signature: e407ac250ab1a318d1a4dbc8296c7606f32f04b6f3fdf9420f13d80bee71b0dc
                      </div>
                    </div>
                  )}

                  {demoStep === 3 && (
                    <div className="space-y-1.5 text-xs font-mono text-on-surface-variant leading-relaxed">
                      <p className="text-[11px]"><strong className="text-primary">[Analyst]</strong> Ethereum fee drops scaling retail. Proposal: APPROVE.</p>
                      <p className="text-[11px]"><strong className="text-primary">[Risk]</strong> Feasibility audit: Low fees indicate volume offsets. Challenge submitted.</p>
                      <p className="text-[11px]"><strong className="text-primary">[Compliance]</strong> Verified licensing. Audit complete.</p>
                    </div>
                  )}

                  {demoStep === 4 && (
                    <div className="space-y-2 text-xs text-on-surface">
                      <p className="font-mono text-[10px] text-on-surface-variant">[CONSENSUS_ENGINE] Aggregating swarm weights and calculating confidence...</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider">Weighted Score</p>
                          <p className="font-bold text-sm text-on-surface">72.4% (Threshold: 66%)</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider">Consensus Confidence</p>
                          <p className="font-bold text-sm text-primary">77.2% Approved</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {demoStep === 5 && (
                    <div className="space-y-3">
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        The proposal has passed the AI Swarm consensus gate. Please simulate human validation to deploy the proposal registry to the blockchain ledger.
                      </p>
                      <button
                        onClick={handleNextDemoStep}
                        className="px-5 py-2.5 bg-bullish text-white font-mono text-[9px] tracking-wider uppercase font-bold rounded hover:opacity-90 transition-opacity"
                      >
                        Approve & Deploy On-Chain
                      </button>
                    </div>
                  )}

                  {demoStep === 6 && (
                    <div className="space-y-1 text-xs text-on-surface">
                      <p className="font-mono text-[10px] text-on-surface-variant">[IPFS_SERVICE] Pinning Evidence Package metadata object to distributed nodes...</p>
                      <p className="font-bold mt-1 text-primary break-all select-all font-mono">
                        Distributed CID: QmW5RMmYSALsLZkVy4izmHhAiUh91zjMqZKpMATvC4dic4
                      </p>
                    </div>
                  )}

                  {demoStep === 7 && (
                    <div className="space-y-1 text-xs text-on-surface">
                      <p className="font-mono text-[10px] text-on-surface-variant">[GIWA_LEDGER] Submitting registry log transaction to AiraMarketProtocol at 0xBDCd79e468a05BaD60cc0822Df42c11B4e0E4f3D...</p>
                      <p className="font-bold text-on-surface break-all select-all font-mono mt-1">
                        Tx Hash: 0x8aeee03dfa7b4cedd0a802dfb54db580e3f9c0449b7aafb9fb1d3cbdad801be4
                      </p>
                    </div>
                  )}

                  {demoStep === 8 && (
                    <div className="space-y-3">
                      <p className="font-mono text-[10px] text-on-surface-variant">[BROWSER_AUDIT] Downloading IPFS payload, sorting keys, and matching signatures...</p>
                      <div className="bg-surface p-3.5 border border-outline-variant rounded space-y-2 font-mono text-[9px] tracking-tight">
                        <div className="flex justify-between">
                          <span className="opacity-60">Local Computed Signature:</span>
                          <span className="font-bold">e407ac25...</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">GIWA On-Chain Block Signature:</span>
                          <span className="font-bold">e407ac25...</span>
                        </div>
                      </div>
                      <div className="p-3 bg-bullish-green/5 border border-bullish-green/20 rounded flex items-center gap-2 text-bullish-green text-xs font-bold font-mono uppercase">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Decision Integrity Verified on GIWA Sepolia Testnet
                      </div>
                    </div>
                  )}
                </div>

                {demoStep !== 5 && (
                  <div className="mt-4 flex items-center gap-3 pt-3 border-t border-outline-variant/60">
                    {demoStep < 8 ? (
                      <button
                        onClick={handleNextDemoStep}
                        className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-[9px] tracking-wider uppercase rounded transition-colors font-mono"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        onClick={handleResetDemo}
                        className="px-4 py-2 bg-surface hover:bg-primary-container border border-outline-variant text-on-surface-variant hover:text-primary font-bold text-[9px] tracking-wider uppercase rounded transition-colors font-mono"
                      >
                        Restart Walkthrough
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Showcasing the Flagship Application: AIRA Markets */}
        <div className="w-full max-w-3xl mb-16 p-6 md:p-8 bg-surface-variant/40 rounded-2xl border border-outline-variant backdrop-blur-sm text-left flex flex-col md:flex-row items-center gap-6 hover:border-primary/30 transition-all">
          <div className="flex-grow">
            <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-2 block">
              Flagship Application
            </span>
            <h3 className="text-lg md:text-xl font-bold text-on-surface mb-2 font-display">
              AIRA Markets: Parametric Prediction & Risk Resolution
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
              The first reference application built on the AIRA Protocol. AIRA Markets utilizes the protocol's verifiable AI decision layer to structure, verify, and resolve prediction markets and binary options pools trustlessly.
            </p>
          </div>
          <button
            onClick={() => navigate('/feed')}
            className="w-full md:w-auto px-6 py-3 bg-surface hover:bg-primary hover:text-white text-on-surface border border-outline rounded-lg font-bold text-[9px] tracking-wider uppercase transition-all shrink-0 font-mono"
          >
            Launch AIRA Markets
          </button>
        </div>

        {/* Interactive Protocol Walkthrough */}
        <div className="w-full text-left mt-6">
          <div className="mb-6">
            <h2 className="serif-heading text-2xl md:text-3xl text-on-surface mb-2">
              Interactive Protocol Walkthrough
            </h2>
            <p className="text-xs text-on-surface-variant max-w-xl font-medium">
              Interactive protocol walkthrough that allows reviewers to understand the full AI decision lifecycle within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-stretch">
            {/* Steps Navigation Sidebar */}
            <div className="col-span-1 md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {steps.map(step => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-bold shrink-0 md:shrink ${
                    activeStep === step.id
                      ? 'bg-primary/5 border-primary text-primary shadow-sm'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary/20'
                  }`}
                >
                  <p className="font-mono text-[8px] uppercase tracking-widest opacity-80 mb-0.5">{step.subtitle}</p>
                  <p className="text-xs md:text-sm tracking-tight">{step.title}</p>
                </button>
              ))}
            </div>

            {/* Step Details Main Display Panel */}
            <div className="col-span-1 md:col-span-8 bg-surface-variant/20 border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="inline-block px-2.5 py-0.5 rounded bg-primary-container text-primary font-mono text-[8px] tracking-wider font-extrabold uppercase">
                  {currentStep.badge}
                </div>
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-on-surface leading-tight">
                  {currentStep.title}: {currentStep.subtitle}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  {currentStep.description}
                </p>

                <div className="space-y-2 mt-4">
                  <h4 className="text-[9px] font-bold tracking-widest text-primary uppercase font-mono">technical details</h4>
                  <ul className="space-y-1.5">
                    {currentStep.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant font-medium leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Snippet / Terminal log Block */}
              <div className="mt-6 border border-outline-variant bg-surface rounded-xl p-4 overflow-x-auto shadow-sm">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-outline-variant/60">
                  <span className="font-mono text-[8px] text-on-surface-variant/50 uppercase tracking-widest">specification snippet</span>
                  <span className="w-2 h-2 rounded-full bg-bullish-green/40"></span>
                </div>
                <pre className="font-mono text-[10px] text-on-surface-variant leading-5 whitespace-pre font-medium">
                  {currentStep.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
