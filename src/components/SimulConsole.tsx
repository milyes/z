import { useState, useEffect, useRef, FormEvent } from 'react';
import { SimulationScenario, SimulationStep } from '../types';
import { Play, Terminal, AlertTriangle, ShieldCheck, Cpu, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface SimulConsoleProps {
  scenarios: SimulationScenario[];
  activeScenario: SimulationScenario | null;
  onSelectScenario: (scenario: SimulationScenario) => void;
  isSimulating: boolean;
  currStepIndex: number;
  onRunSimulation: (customPrompt?: string) => void;
  simulationSteps: SimulationStep[];
}

export default function SimulConsole({
  scenarios,
  activeScenario,
  onSelectScenario,
  isSimulating,
  currStepIndex,
  onRunSimulation,
  simulationSteps,
}: SimulConsoleProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeScenario && !isSimulating) {
      setTerminalLogs([
        `[SYSTEM_BOOT] Z-H202.ia Sovereign Core initialized`,
        `[INFO] Loaded standard scenario: ${activeScenario.title}`,
        `[DOCK] Gateway ready for secure mTLS payloads`,
        `[INPUT_AWAIT] Enter user prompt parameters or select run below.`
      ]);
    }
  }, [activeScenario, isSimulating]);

  // Append logs as step increments
  useEffect(() => {
    if (isSimulating && currStepIndex >= 0 && simulationSteps[currStepIndex]) {
      const step = simulationSteps[currStepIndex];
      const timeStr = new Date().toISOString().split('T')[1].slice(0, 8);
      
      const newLogs = [
        `[${timeStr}] [LAYER ${step.layerNumber}] >>> Executing: ${step.title}`,
        `[${timeStr}] [STATUS: ${step.status.toUpperCase()}] ${step.explanation}`,
      ];

      if (step.metricUpdate) {
        newLogs.push(`[${timeStr}] [SYS_METRIC] Modified '${step.metricUpdate.key}' ---> '${step.metricUpdate.value}'`);
      }

      setTerminalLogs((prev) => [...prev, ...newLogs]);
    }
  }, [isSimulating, currStepIndex, simulationSteps]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleCustomRun = (e: FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onRunSimulation(customPrompt);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[560px]" id="simul-console">
      {/* Console Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
            Sovereign Decoupler Sandbox & Flow Tracing
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            SEC_ENCLAVE_LIVE
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
        {/* Left Column: Preset Selector */}
        <div className="lg:col-span-2 border-r border-white/5 p-4 flex flex-col justify-between bg-slate-950/40">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                1. Select Operational Scenario
              </h4>
              <div className="space-y-1.5">
                {scenarios.map((scen) => {
                  const isActive = activeScenario?.id === scen.id;
                  return (
                    <button
                      key={scen.id}
                      onClick={() => !isSimulating && onSelectScenario(scen)}
                      disabled={isSimulating}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex flex-col gap-1 hover:cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-black/20 border-white/5 text-slate-400 hover:bg-black/40 hover:text-white'
                      }`}
                      id={`scen-selector-${scen.id}`}
                    >
                      <span className="font-semibold text-slate-200">{scen.title}</span>
                      <span className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {scen.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Manual Prompt Input Option */}
            <form onSubmit={handleCustomRun} className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">
                Or Inject Custom Trace Vector
              </h4>
              <div className="space-y-2">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  disabled={isSimulating}
                  placeholder="Enter custom sovereign AI instructions or simulated threats to compile..."
                  className="w-full h-20 bg-black/40 border border-white/5 rounded-lg p-2.5 text-xs font-mono text-emerald-400 placeholder-slate-600 outline-none focus:border-emerald-500/30 transition-all resize-none"
                  id="custom-prompt-input"
                />
                <button
                  type="submit"
                  disabled={isSimulating || !customPrompt.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5 hover:cursor-pointer"
                  id="btn-inject-custom"
                >
                  <Cpu className="w-4 h-4" />
                  Compile & Inject Vector
                </button>
              </div>
            </form>
          </div>

          <div className="border-t border-white/5 pt-3 mt-4">
            <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300 block mb-1">ToT Alignment Note:</span>
              Self-Consistency checks evaluate output safety on constitutional buffers dynamically.
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Diagram Trace + Log Feed */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden bg-slate-950/60">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/20">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Execution Trace</span>
              <p className="text-xs font-semibold text-slate-100 mt-0.5 max-w-[280px] lg:max-w-[340px] truncate" id="current-scenario-title">
                {activeScenario ? activeScenario.title : "Ready"}
              </p>
            </div>
            {!isSimulating ? (
              <button
                onClick={() => onRunSimulation()}
                className="bg-emerald-500 text-slate-950 font-sans px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-emerald-400 flex items-center gap-1 hover:cursor-pointer"
                id="btn-trigger-simulation"
              >
                <Play className="w-3.5 h-3.5 fill-black" /> Trace Flow
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Layer {simulationSteps[currStepIndex]?.layerNumber || "?"}</span>
              </div>
            )}
          </div>

          {/* Graphical Step Bubble Map */}
          <div className="p-4 bg-slate-950/80 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center justify-between px-2">
              {[1, 2, 3, 4, 5, 6].map((lNum) => {
                const stepIdxInSimulation = simulationSteps.findIndex((s) => s.layerNumber === lNum);
                const step = stepIdxInSimulation !== -1 ? simulationSteps[stepIdxInSimulation] : null;

                const isProcessed = isSimulating && currStepIndex >= stepIdxInSimulation && stepIdxInSimulation !== -1;
                const isCurrent = isSimulating && currStepIndex === stepIdxInSimulation;
                const isAlertState = step?.status === 'alert';

                let bgClass = "bg-slate-800 border-slate-700 text-slate-400";
                if (isCurrent) {
                  bgClass = isAlertState 
                    ? "bg-red-500 text-white border-red-400 ring-2 ring-red-500/40 animate-pulse"
                    : "bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-500/40 animate-pulse";
                } else if (isProcessed) {
                  bgClass = isAlertState
                    ? "bg-red-950/40 border-red-500 text-red-400"
                    : "bg-emerald-950/40 border-emerald-500 text-emerald-400";
                }

                return (
                  <div key={lNum} className="flex items-center flex-1 last:flex-none">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-all ${bgClass}`}
                      title={`Layer ${lNum} Trace Step`}
                      id={`bubble-step-l${lNum}`}
                    >
                      L{lNum}
                    </div>
                    {lNum < 6 && (
                      <div className="flex-1 h-[2px] mx-1 bg-gradient-to-r relative overflow-hidden bg-slate-800">
                        {isSimulating && currStepIndex >= lNum - 1 && (
                          <div 
                            className={`absolute inset-0 h-full w-1/2 rounded animate-ping ${
                              isAlertState ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                            style={{ animationDuration: '1.2s' }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Detail Explanation Card during simulation */}
            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg min-h-[64px] flex items-start gap-2.5">
              {isSimulating && simulationSteps[currStepIndex] ? (
                <>
                  {simulationSteps[currStepIndex].status === 'alert' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Layer {simulationSteps[currStepIndex].layerNumber} Operational Check
                    </span>
                    <h5 className="text-xs font-semibold text-white mt-0.5">
                      {simulationSteps[currStepIndex].title}
                    </h5>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {simulationSteps[currStepIndex].explanation}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 animate-ping"></span>
                  <span>Awaiting execution trace payload trigger. Click "Trace Flow" upstream.</span>
                </div>
              )}
            </div>
          </div>

          {/* Simulated Terminal logs container */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-1 bg-black/60 scrollbar-thin scrollbar-thumb-slate-800" id="terminal-feed">
            <div className="flex items-center gap-2 text-slate-500 border-b border-white/5 pb-2 mb-2 font-mono uppercase text-[10px] tracking-wider">
              <Terminal className="w-3.5 h-3.5" /> HSM-ATTESTED CONSOLE LOGS
            </div>
            {terminalLogs.map((log, idx) => {
              const isAlert = log.includes("[STATUS: ALERT]") || log.includes("Hack Countered") || log.includes("anomalous") || log.includes("Intrusion");
              const isMetric = log.includes("[SYS_METRIC]");
              const colorClass = isAlert 
                ? "text-red-400" 
                : isMetric 
                ? "text-amber-300" 
                : log.includes("success") || log.includes("Secured") || log.includes("Active")
                ? "text-emerald-400"
                : "text-slate-300";

              return (
                <div key={idx} className={colorClass} id={`log-item-${idx}`}>
                  {log}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
