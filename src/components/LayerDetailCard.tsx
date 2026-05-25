import { useState } from 'react';
import { ArchitectureLayer, SubComponent } from '../types';
import { Cpu, CheckCircle, AlertTriangle, XCircle, Sliders, Settings2, Info } from 'lucide-react';

interface LayerDetailCardProps {
  layer: ArchitectureLayer;
  onUpdateComponentStatus: (layerNum: number, compId: string, status: SubComponent['status']) => void;
  onUpdateMetric: (layerNum: number, compId: string, key: string, value: string | number) => void;
}

export default function LayerDetailCard({
  layer,
  onUpdateComponentStatus,
  onUpdateMetric,
}: LayerDetailCardProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'control'>('details');
  const [editingCompId, setEditingCompId] = useState<string | null>(null);

  // Helper color mappings for layer headings
  const textColors: { [key: string]: string } = {
    amber: "text-amber-400",
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    red: "text-red-400",
  };

  const bgColors: { [key: string]: string } = {
    amber: "bg-amber-950/20 border-amber-500/30",
    blue: "bg-blue-950/20 border-blue-500/30",
    cyan: "bg-cyan-950/20 border-cyan-500/30",
    emerald: "bg-emerald-950/20 border-emerald-500/30",
    purple: "bg-purple-950/20 border-purple-500/30",
    red: "bg-red-950/20 border-red-500/30",
  };

  const badgeColors: { [key: string]: string } = {
    active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border border-red-500/20",
    idle: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  };

  const StatusIcon = ({ status }: { status: SubComponent['status'] }) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-400" id="status-icon-active" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" id="status-icon-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" id="status-icon-error" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-400" id="status-icon-default" />;
    }
  };

  return (
    <div 
      className={`border rounded-xl transition-all duration-300 overflow-hidden backdrop-blur-md ${bgColors[layer.color] || 'border-slate-800'}`}
      id={`layer-card-${layer.number}`}
    >
      {/* Header element */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 uppercase tracking-wider`}>
            Layer {layer.number}
          </span>
          <h3 className={`text-lg font-sans font-medium mt-1 tracking-tight flex items-center gap-2 ${textColors[layer.color]}`}>
            <Cpu className="w-5 h-5 flex-shrink-0" />
            {layer.name}
          </h3>
        </div>
        
        {/* Navigation tabs for this Card */}
        <div className="flex bg-black/30 p-0.5 rounded-lg border border-white/5 self-start">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              activeTab === 'details'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            id={`tab-details-l${layer.number}`}
          >
            Subsystems
          </button>
          <button
            onClick={() => setActiveTab('control')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1 ${
              activeTab === 'control'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            id={`tab-control-l${layer.number}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Controls
          </button>
        </div>
      </div>

      <div className="p-5">
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {layer.description}
        </p>

        {activeTab === 'details' ? (
          <div className="space-y-4" id={`layer-subsystems-list-l${layer.number}`}>
            {layer.subComponents.map((comp) => (
              <div 
                key={comp.id} 
                className="bg-black/20 hover:bg-black/30 border border-white/5 hover:border-white/10 rounded-lg p-3.5 transition-all"
                id={`subcomp-${comp.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={comp.status} />
                    <span className="text-sm font-medium text-slate-100 font-sans">{comp.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${badgeColors[comp.status]}`}>
                    {comp.status}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {comp.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-black/10 p-2 rounded border border-white/5">
                  {Object.entries(comp.metrics).map(([key, val]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono uppercase truncate">{key}</span>
                      <span className="text-xs font-mono font-medium text-slate-200 mt-0.5 truncate">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5" id={`layer-controls-list-l${layer.number}`}>
            <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Simulate hardware faults or fine-tune subsystem status to observe real-time governance feedback.</span>
            </div>

            {layer.subComponents.map((comp) => (
              <div 
                key={comp.id} 
                className="bg-black/30 border border-white/5 rounded-lg p-4 space-y-3"
                id={`control-subcomp-${comp.id}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-200 uppercase tracking-wide">{comp.name}</span>
                  <div className="flex gap-1.5">
                    {(['active', 'warning', 'error'] as SubComponent['status'][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateComponentStatus(layer.number, comp.id, st)}
                        className={`text-[10px] font-mono px-2 py-1 rounded border transition-all ${
                          comp.status === st 
                            ? st === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-semibold'
                              : st === 'warning'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 font-semibold'
                              : 'bg-red-500/10 text-red-400 border-red-500/40 font-semibold'
                            : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'
                        }`}
                        id={`btn-status-${comp.id}-${st}`}
                      >
                        {st.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Metrics Customizer Form */}
                <div className="space-y-2 border-t border-white/5 pt-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase flex items-center gap-1">
                    <Settings2 className="w-3 h-3" /> Micro-Metrics Tuning
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(comp.metrics).map(([key, val]) => (
                      <div key={key} className="bg-black/20 p-2 rounded flex items-center justify-between border border-white/5">
                        <span className="text-[10px] text-slate-500 font-mono font-medium max-w-[120px] truncate">{key}</span>
                        {editingCompId === `${comp.id}-${key}` ? (
                          <input 
                            type="text"
                            defaultValue={String(val)}
                            onBlur={(e) => {
                              onUpdateMetric(layer.number, comp.id, key, e.target.value);
                              setEditingCompId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onUpdateMetric(layer.number, comp.id, key, (e.target as HTMLInputElement).value);
                                setEditingCompId(null);
                              }
                            }}
                            className="bg-black text-[11px] font-mono border border-white/20 text-emerald-400 rounded px-1 w-24 text-right outline-none focus:border-emerald-500"
                            autoFocus
                          />
                        ) : (
                          <button 
                            onClick={() => setEditingCompId(`${comp.id}-${key}`)}
                            className="text-xs font-mono text-slate-300 hover:text-emerald-400 underline decoration-dotted transition-colors hover:cursor-pointer"
                            title="Click to tune variable"
                            id={`edit-metric-${comp.id}-${key}`}
                          >
                            {String(val)}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack Tags footer */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Tech Stack:</span>
          {layer.techStack.map((tech) => (
            <span 
              key={tech} 
              className="text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
