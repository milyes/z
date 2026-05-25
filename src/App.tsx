import { useState, useEffect } from 'react';
import { ARCHITECTURE_LAYERS, DESIGN_PRINCIPLES, SIMULATION_SCENARIOS } from './data/architectureData';
import { ArchitectureLayer, LedgerEvent, SubComponent, SimulationScenario } from './types';
import LayerDetailCard from './components/LayerDetailCard';
import SimulConsole from './components/SimulConsole';
import SecurityConsole from './components/SecurityConsole';
import AuditLedgerView from './components/AuditLedgerView';
import { Shield, ShieldAlert, AlertTriangle, Layers, Lock, MessageSquareCode, Key, Activity, Heart, Eye } from 'lucide-react';

// A simple deterministic hash helper that behaves like an authentic SHA-256 builder
function generateMockSha256(contentString: string): string {
  let hash = 0;
  for (let i = 0; i < contentString.length; i++) {
    const char = contentString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Convert to absolute hex-like output
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `0X${hex}E2B4AC5D${hex.substring(2)}F0994119B`;
}

export default function App() {
  const [layers, setLayers] = useState<ArchitectureLayer[]>(() => {
    // Deep copy to prevent mutating static definitions
    return JSON.parse(JSON.stringify(ARCHITECTURE_LAYERS));
  });
  
  const [selectedLayerNum, setSelectedLayerNum] = useState<number>(1);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>(() => SIMULATION_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currStepIndex, setCurrStepIndex] = useState(-1);
  const [simulationSteps, setSimulationSteps] = useState(SIMULATION_SCENARIOS[0].steps);

  const [constitutionalSafety, setConstitutionalSafety] = useState(true);
  const [ebpfShield, setEbpfShield] = useState(true);
  const [mtlsVerification, setMtlsVerification] = useState(true);

  // Initial State audit ledger history
  const [auditLedger, setAuditLedger] = useState<LedgerEvent[]>([]);

  // Pre-populate ledger on birth
  useEffect(() => {
    const genesisTime = "2026-05-25T20:42:00Z";
    const hsmTime = "2026-05-25T21:00:00Z";
    
    const genesisHashPre = "0000000000000000000000000000000000000000000000000000000000000000";
    const genesisPayload = "SYSTEM_GENESIS: Sovereign state bootstrap and cold enclaves allocation.";
    const genesisHash = generateMockSha256(`0-${genesisTime}-${genesisPayload}-${genesisHashPre}`);
    
    const block1Payload = "ATTESTATION: TPM 2.0 attestation authorized for 6 host core sockets.";
    const block1Hash = generateMockSha256(`1-${hsmTime}-${block1Payload}-${genesisHash}`);

    const initialLedger: LedgerEvent[] = [
      {
        index: 0,
        timestamp: genesisTime,
        layer: 1,
        action: "GENESIS_BOOT",
        payload: genesisPayload,
        previousHash: genesisHashPre,
        hash: genesisHash
      },
      {
        index: 1,
        timestamp: hsmTime,
        layer: 1,
        action: "HSM_ATTEST",
        payload: block1Payload,
        previousHash: genesisHash,
        hash: block1Hash
      }
    ];

    setAuditLedger(initialLedger);
  }, []);

  // Update selected layers
  const currentLayer = layers.find(l => l.number === selectedLayerNum) || layers[0];

  const handleUpdateComponentStatus = (layerNum: number, compId: string, status: SubComponent['status']) => {
    setLayers(prev => {
      return prev.map(l => {
        if (l.number === layerNum) {
          const updatedSubs = l.subComponents.map(sub => {
            if (sub.id === compId) {
              return { ...sub, status };
            }
            return sub;
          });
          return { ...l, subComponents: updatedSubs };
        }
        return l;
      });
    });

    // Write a ledger entry on status update
    setAuditLedger(prev => {
      const prevBlock = prev[prev.length - 1];
      const prevHash = prevBlock ? prevBlock.hash : "000000000";
      const timestamp = new Date().toISOString();
      const action = `STATUS_TUNE_L${layerNum}`;
      const payload = `Subcomp '${compId}' manually toggled to [${status.toUpperCase()}] status.`;
      const nextIndex = prev.length;
      const nextHash = generateMockSha256(`${nextIndex}-${timestamp}-${payload}-${prevHash}`);

      return [
        ...prev,
        {
          index: nextIndex,
          timestamp,
          layer: layerNum,
          action,
          payload,
          previousHash: prevHash,
          hash: nextHash
        }
      ];
    });
  };

  const handleUpdateMetric = (layerNum: number, compId: string, key: string, value: string | number) => {
    setLayers(prev => {
      return prev.map(l => {
        if (l.number === layerNum) {
          const updatedSubs = l.subComponents.map(sub => {
            if (sub.id === compId) {
              const updatedMetrics = { ...sub.metrics, [key]: value };
              return { ...sub, metrics: updatedMetrics };
            }
            return sub;
          });
          return { ...l, subComponents: updatedSubs };
        }
        return l;
      });
    });
  };

  // Triggering Simulation Runs
  const handleSelectScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    setSimulationSteps(scenario.steps);
    setCurrStepIndex(-1);
    setIsSimulating(false);
  };

  const handleRunSimulation = (customPromptText?: string) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrStepIndex(0);

    let activeSteps = simulationSteps;

    // Compile dynamic steps if custom prompt in use
    if (customPromptText) {
      const customScenarioTitle = "Custom Compiled Injected Scenario";
      activeSteps = [
        {
          layerNumber: 1,
          componentId: "constitutional_ai",
          title: "Custom Sovereign Input Scanning",
          explanation: `Analyzing custom vector: "${customPromptText.substring(0, 60)}..." against constitutional logic.`,
          status: constitutionalSafety ? "success" : "alert",
          durationMs: 1200
        },
        {
          layerNumber: 2,
          componentId: "mtls_gateway",
          title: "Dynamic Network Slicing Routing",
          explanation: "mTLS payload decrypted and caller signature validated via internal certificates.",
          status: "success",
          durationMs: 1000
        },
        {
          layerNumber: 3,
          componentId: "planning_scheduler",
          title: "Planning Agent Core Decomposing",
          explanation: "Hierarchical planner spawns sub-nodes and establishes execution DAG.",
          status: "success",
          durationMs: 1100
        },
        {
          layerNumber: 4,
          componentId: "rag_pipeline",
          title: "High-Context Augmented Traversal",
          explanation: "Running Hybrid + Multi-vector search on secure node layers.",
          status: "success",
          durationMs: 1200
        },
        {
          layerNumber: 5,
          componentId: "moe_architecture",
          title: "Quantum Sparse Expert Allocation",
          explanation: "Router assigns payload to optimized localized weights.",
          status: "success",
          durationMs: 1300
        },
        {
          layerNumber: 6,
          componentId: "aes_encryption",
          title: "Cryptographic Persistence Pipeline Write",
          explanation: "Injected query trace successfully signed and encrypted with AES-256.",
          status: "success",
          durationMs: 1100
        }
      ];
      setSimulationSteps(activeSteps);
    }

    // Sequentially step through layers with timers
    let currentStep = 0;
    
    const executeStep = () => {
      if (currentStep < activeSteps.length) {
        setCurrStepIndex(currentStep);
        const step = activeSteps[currentStep];

        // Apply metric updates if defined
        if (step.metricUpdate) {
          handleUpdateMetric(step.layerNumber, step.componentId, step.metricUpdate.key, step.metricUpdate.value);
        }

        // Apply visual warnings to the actual component status if the step fails/alerts!
        if (step.status === 'alert') {
          handleUpdateComponentStatus(step.layerNumber, step.componentId, 'warning');
        }

        // Post Audit ledger record of step completion
        setAuditLedger(prev => {
          const prevBlock = prev[prev.length - 1];
          const prevHash = prevBlock ? prevBlock.hash : "000000000";
          const timestamp = new Date().toISOString();
          const action = `SIMUL_TRACE_L${step.layerNumber}`;
          const pld = `Simulated step '${step.title}' finished with status [${step.status.toUpperCase()}].`;
          const nextIndex = prev.length;
          const nextHash = generateMockSha256(`${nextIndex}-${timestamp}-${pld}-${prevHash}`);

          return [
            ...prev,
            {
              index: nextIndex,
              timestamp,
              layer: step.layerNumber,
              action,
              payload: pld,
              previousHash: prevHash,
              hash: nextHash
            }
          ];
        });

        currentStep++;
        setTimeout(executeStep, step.durationMs);
      } else {
        setIsSimulating(false);
      }
    };

    setTimeout(executeStep, 400);
  };

  // Safe manual alarm trigger
  const handleTriggerSecurityAlert = (
    alertTitle: string,
    threatLevel: 'INFO' | 'MEDIUM' | 'CRITICAL',
    vector: string,
    mitigation: string,
    layerTrigger: number
  ) => {
    // Write incident directly into the absolute Ledger Block index chain!
    setAuditLedger(prev => {
      const prevBlock = prev[prev.length - 1];
      const prevHash = prevBlock ? prevBlock.hash : "000000000";
      const timestamp = new Date().toISOString();
      const action = "INCIDENT_AUDIT_ALARM";
      const payload = `THREAT [${threatLevel}] IN ${alertTitle.substring(0, 40)}: Mitigation [${mitigation.substring(0, 40)}...]`;
      const nextIndex = prev.length;
      const nextHash = generateMockSha256(`${nextIndex}-${timestamp}-${payload}-${prevHash}`);

      return [
        ...prev,
        {
          index: nextIndex,
          timestamp,
          layer: layerTrigger,
          action,
          payload,
          previousHash: prevHash,
          hash: nextHash
        }
      ];
    });
  };

  const handleResetLedger = () => {
    const freshTimestamp = new Date().toISOString();
    const payload = "SYSTEM_LEDGER_RESET: Re-booting ledger genesis structures.";
    const hash = generateMockSha256(`0-${freshTimestamp}-${payload}-0000000000000000000000000000000000000000000000000000000000000000`);

    setAuditLedger([
      {
        index: 0,
        timestamp: freshTimestamp,
        layer: 1,
        action: "GENESIS_REBOOT",
        payload,
        previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
        hash
      }
    ]);
  };

  const handleTamperBlock = (index: number) => {
    setAuditLedger((prev) => {
      return prev.map((block) => {
        if (block.index === index) {
          // Alter the hash or payload to breach verification hashes
          return {
            ...block,
            payload: "TAMPER ALERT: Malicious rewrite of sovereign system parameters.",
            hash: "0X_CORRUPTED_HASH_BREACH_99999",
            isTampered: true,
          };
        }
        return block;
      });
    });
  };

  const handleVerifyLedger = (): boolean => {
    // Check if hashes chain properly
    for (let i = 1; i < auditLedger.length; i++) {
      const currentBlock = auditLedger[i];
      const previousBlock = auditLedger[i - 1];

      // If the current block previousHash does not match the actual previous hash, it is broken
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      // Check recalculated hash block
      const recompiledHash = generateMockSha256(
        `${currentBlock.index}-${currentBlock.timestamp}-${currentBlock.payload}-${currentBlock.previousHash}`
      );
      
      if (!currentBlock.isTampered && currentBlock.hash !== recompiledHash) {
        return false;
      }
    }
    return true;
  };

  // Principal icon mapping
  const renderPrincipleIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <Shield className="w-5 h-5 text-amber-400" id="princ-icon-shield" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-emerald-400" id="princ-icon-lock" />;
      case 'MessageSquareCode':
        return <MessageSquareCode className="w-5 h-5 text-cyan-400" id="princ-icon-msg" />;
      case 'Key':
        return <Key className="w-5 h-5 text-blue-400" id="princ-icon-key" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" id="princ-icon-act" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative antialiased" id="root-container">
      {/* Background visual abstract accents */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none select-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Cyber tactical header element */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3.5" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-600/20 to-emerald-600/20 rounded-lg border border-slate-700/60 shadow-lg">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase font-semibold">
                  Z-H202 CORE
                </span>
                <span className="text-slate-600 font-mono text-xs">|</span>
                <span className="text-slate-400 text-xs font-mono">SOVEREIGN TECH</span>
              </div>
              <h1 className="text-lg font-sans font-medium mt-0.5 tracking-tight text-slate-100">
                Sovereign Intelligent Architecture Explorer (2024)
              </h1>
            </div>
          </div>

          {/* Secure State Indicators */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-slate-300 uppercase tracking-widest text-[9px]">
                STATE: CLOSED-LOOP AIR-GAPPED
              </span>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-500 font-mono block">TRUSTED OPERATOR</span>
              <span className="text-xs font-mono text-emerald-400" id="user-email-display">gfbleu@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6 z-10" id="app-main">
        {/* Bento grid layout: Key Systems Overview & Design Core */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="bento-overview">
          
          {/* Dashboard Metrics Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl lg:col-span-1 border-t-2 border-t-emerald-500">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Enclave Diagnostics</span>
              <h3 className="text-base font-sans font-medium text-slate-100 mt-1">
                Real-Time Sovereignty Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-500 block">Ledger Blocks</span>
                <span className="text-xl font-mono text-emerald-400 mt-1 block" id="block-count-stat">
                  {auditLedger.length} Blocks
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-500 block">Defense Valves</span>
                <span className="text-xl font-mono text-emerald-400 mt-1 block" id="defense-valves-stat">
                  {[constitutionalSafety, ebpfShield, mtlsVerification].filter(Boolean).length} / 3 ON
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-500 block">TPM Integrity</span>
                <span className="text-xl font-mono text-emerald-400 mt-1 block">
                  100% SECURE
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono uppercase text-slate-500 block">Enclave Host</span>
                <span className="text-xl font-mono text-emerald-400 mt-1 block">
                  AIR-GAPPED
                </span>
              </div>
            </div>

            {/* Quick alert bar */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 text-[11px] p-2.5 rounded-lg text-emerald-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 animate-ping" />
              <span>Diagnostic pipelines are listening for unauthorized VM hooks recursively.</span>
            </div>
          </div>

          {/* Core Design Principles Carousel Slider Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl lg:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Architectural Pillars</span>
              <h3 className="text-base font-sans font-medium text-slate-100 mt-1">
                Sovereign Guardrails & Design Guidelines
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5" id="design-pillars-grid">
              {DESIGN_PRINCIPLES.map((princ) => (
                <div 
                  key={princ.name} 
                  className="bg-black/20 border border-white/5 rounded-lg p-3.5 transition-all hover:bg-black/30 hover:border-white/10"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded bg-white/5 border border-white/10 flex-shrink-0 mt-0.5">
                      {renderPrincipleIcon(princ.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-sans font-medium text-slate-200">
                        {princ.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        {princ.tagline}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        {princ.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blueprint Section: Highly Interactive Circular Vector Layers visualizer */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="architecture-blueprint">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Interactive Component Map</span>
              <h2 className="text-base font-sans font-medium text-slate-100 mt-1 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                Z-H202.ia Layer Core Mapping Protocol
              </h2>
            </div>
            
            <span className="text-xs text-slate-400 font-mono bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg">
              Click any layer below to inspect modules & parameters
            </span>
          </div>

          {/* Graphical Layer stack map grids */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2" id="blueprint-buttons-row">
            {layers.map((l) => {
              const isSelected = selectedLayerNum === l.number;
              const hasAlert = l.subComponents.some((sb) => sb.status === 'warning' || sb.status === 'error');

              // Visual coloring values
              const colorSchemes: { [key: string]: string } = {
                amber: "from-amber-500/15 to-transparent border-amber-500/30 hover:border-amber-500",
                blue: "from-blue-500/15 to-transparent border-blue-500/30 hover:border-blue-500",
                cyan: "from-cyan-500/15 to-transparent border-cyan-500/30 hover:border-cyan-500",
                emerald: "from-emerald-500/15 to-transparent border-emerald-500/30 hover:border-emerald-500",
                purple: "from-purple-500/15 to-transparent border-purple-500/30 hover:border-purple-500",
                red: "from-red-500/15 to-transparent border-red-500/30 hover:border-red-500",
              };

              const activeBorderSchemes: { [key: string]: string } = {
                amber: "border-amber-400 ring-1 ring-amber-500/30 bg-amber-500/10",
                blue: "border-blue-400 ring-1 ring-blue-500/30 bg-blue-500/10",
                cyan: "border-cyan-400 ring-1 ring-cyan-500/30 bg-cyan-500/10",
                emerald: "border-emerald-400 ring-1 ring-emerald-500/30 bg-emerald-500/10",
                purple: "border-purple-400 ring-1 ring-purple-500/30 bg-purple-500/10",
                red: "border-red-400 ring-1 ring-red-500/30 bg-red-500/10",
              };

              const glowDots: { [key: string]: string } = {
                amber: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
                blue: "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
                cyan: "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]",
                emerald: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
                purple: "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
                red: "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]",
              };

              return (
                <button
                  key={l.number}
                  onClick={() => setSelectedLayerNum(l.number)}
                  className={`p-4 rounded-xl border text-left bg-gradient-to-b transition-all duration-300 relative group flex flex-col justify-between h-32 hover:cursor-pointer ${
                    isSelected 
                      ? activeBorderSchemes[l.color] 
                      : colorSchemes[l.color]
                  }`}
                  id={`blueprint-btn-layer-${l.number}`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                        LAYER 0{l.number}
                      </span>
                      {hasAlert ? (
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] animate-ping" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${glowDots[l.color]}`} />
                      )}
                    </div>
                    <h4 className="text-xs font-sans font-medium text-slate-100 group-hover:text-white mt-2 leading-tight">
                      {l.shortName}
                    </h4>
                  </div>

                  <span className="text-[9px] font-mono text-slate-500 truncate group-hover:text-slate-400 block max-w-full">
                    {l.subComponents.length} subsystems
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Master Control Layout Split: Selected Layer Inspector vs Dynamic Simulation Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="master-split-container">
          {/* Selected Layer Details (Dynamic based on selected card above) */}
          <div className="space-y-4" id="layer-inspect-panel">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Layer Analysis</span>
              <span className="text-slate-700 font-mono text-xs">/</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Subsystem Inspector</span>
            </div>
            <LayerDetailCard 
              layer={currentLayer}
              onUpdateComponentStatus={handleUpdateComponentStatus}
              onUpdateMetric={handleUpdateMetric}
            />
          </div>

          {/* Simulation & Flow Tracing Terminal */}
          <div className="space-y-4" id="simul-console-panel">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Aynchronous Sandbox</span>
              <span className="text-slate-700 font-mono text-xs">/</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Real-Time Tracer</span>
            </div>
            <SimulConsole 
              scenarios={SIMULATION_SCENARIOS}
              activeScenario={activeScenario}
              onSelectScenario={handleSelectScenario}
              isSimulating={isSimulating}
              currStepIndex={currStepIndex}
              onRunSimulation={handleRunSimulation}
              simulationSteps={simulationSteps}
            />
          </div>
        </div>

        {/* Threat interceptor dashboard & Cryptographic ledger log list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2" id="ledger-security-split">
          {/* Security Controller */}
          <SecurityConsole 
            onTriggerSecurityAlert={handleTriggerSecurityAlert}
            constitutionalSafety={constitutionalSafety}
            setConstitutionalSafety={setConstitutionalSafety}
            ebpfShield={ebpfShield}
            setEbpfShield={setEbpfShield}
            mtlsVerification={mtlsVerification}
            setMtlsVerification={setMtlsVerification}
          />

          {/* Ledger audit */}
          <AuditLedgerView 
            ledger={auditLedger}
            onResetLedger={handleResetLedger}
            onTamperBlock={handleTamperBlock}
            onVerifyLedger={handleVerifyLedger}
          />
        </div>
      </main>

      {/* Cyber tactical footer element */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-8 mt-12 text-center text-xs text-slate-500 font-mono" id="app-footer-info">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500/60" />
            <span>ZCORE Kernel Enclave v2.4.0 — SHA-256 Verifiable State Core</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Audit Key: FIPS-140-3</span>
            <span>•</span>
            <span className="text-slate-400">Offline-First Sovereign Ledger Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
