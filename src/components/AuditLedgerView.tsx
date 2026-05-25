import { useState } from 'react';
import { LedgerEvent } from '../types';
import { Lock, FileSignature, AlertOctagon, RotateCcw, Database, ShieldAlert } from 'lucide-react';

interface AuditLedgerViewProps {
  ledger: LedgerEvent[];
  onResetLedger: () => void;
  onTamperBlock: (index: number) => void;
  onVerifyLedger: () => boolean;
}

export default function AuditLedgerView({
  ledger,
  onResetLedger,
  onTamperBlock,
  onVerifyLedger,
}: AuditLedgerViewProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);

  const triggerVerification = () => {
    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate microsecond delay for crypto checks
    setTimeout(() => {
      const isValid = onVerifyLedger();
      setVerificationResult(isValid ? 'success' : 'failed');
      setIsVerifying(false);
    }, 700);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl" id="audit-ledger-module">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-base font-sans font-medium text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            Cryptographic Immutable Audit Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-Trust Sovereign Chain-of-Custody logs capturing continuous system-state decisions.
          </p>
        </div>
        
        {/* Ledger actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={triggerVerification}
            disabled={isVerifying}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors hover:cursor-pointer"
            id="btn-verify-chains"
          >
            <FileSignature className="w-4 h-4" />
            {isVerifying ? 'Verifying Hashes...' : 'Verify Chain Integrity'}
          </button>
          
          <button
            onClick={onResetLedger}
            className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all hover:cursor-pointer"
            id="btn-reset-ledgers"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Ledger
          </button>
        </div>
      </div>

      {/* Verification Flash Alert Banner */}
      {verificationResult && (
        <div 
          className={`p-3.5 rounded-lg border text-xs flex items-center gap-3 animate-fadeIn duration-200 ${
            verificationResult === 'success'
              ? 'bg-emerald-900/20 border-emerald-500/40 text-emerald-300'
              : 'bg-red-900/20 border-red-500/40 text-red-300'
          }`}
          id="verification-badge-banner"
        >
          {verificationResult === 'success' ? (
            <>
              <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <strong className="block font-sans">Chain Integrity Validated!</strong>
                <span className="font-mono text-[11px] text-emerald-400/80">All SHA-256 checksum chains match logically. System state verified tamper-proof.</span>
              </div>
            </>
          ) : (
            <>
              <AlertOctagon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <strong className="block font-sans">INTEGRITY BREACH IDENTIFIED!</strong>
                <span className="font-mono text-[11px] text-red-400/80">Cryptographic hash dispute at altered index block. Previous hash reference failed.</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Blockchain visual scrolling card list */}
      <div 
        className="space-y-3 max-h-[380px] overflow-y-auto pr-1 flex flex-col scrollbar-thin scrollbar-thumb-slate-800"
        id="blockchain-ledger-cards"
      >
        {ledger.map((evt) => {
          return (
            <div 
              key={evt.index}
              className={`border rounded-lg p-4 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                evt.isTampered
                  ? 'bg-red-950/20 border-red-500/40 hover:border-red-500'
                  : 'bg-black/20 border-white/5 hover:border-white/10'
              }`}
              id={`ledger-block-node-${evt.index}`}
            >
              {evt.isTampered && (
                <div className="absolute top-0 right-0 bg-red-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-bl select-none">
                  TAMPERED BLOCK
                </div>
              )}

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold bg-white/5 border border-white/10 text-emerald-400 px-2 py-0.5 rounded">
                    BLOCK #{evt.index}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {evt.timestamp}
                  </span>
                  <span className="text-[10px] uppercase font-mono bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/5">
                    Layer {evt.layer} Origin
                  </span>
                </div>

                <div className="font-mono text-xs text-slate-200 bg-slate-950/40 p-2.5 rounded border border-white/5 overflow-x-auto truncate">
                  <strong className="text-slate-400 font-sans block text-[10px] uppercase tracking-wider mb-0.5">ACTION PAYLOAD:</strong>
                  {evt.action}: {evt.payload}
                </div>

                {/* Hashes Container block info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="truncate">
                    <span className="text-slate-500 block">PREVIOUS BLOCK HASH:</span>
                    <span className="text-slate-400 truncate block">{evt.previousHash}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500 block">CURRENT BLOCK HASH:</span>
                    <span className="text-slate-300 truncate font-semibold block">{evt.hash}</span>
                  </div>
                </div>
              </div>

              {/* Action right hand: Tamper threat simulation injection */}
              <div className="flex md:flex-col items-stretch gap-1.5 self-start md:self-center">
                {!evt.isTampered ? (
                  <button
                    onClick={() => onTamperBlock(evt.index)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1 hover:cursor-pointer"
                    title="Simulate external sector corruption attack"
                    id={`btn-tamper-block-${evt.index}`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Simulate Tamper
                  </button>
                ) : (
                  <div className="text-[10px] font-mono text-red-400 flex items-center gap-1 bg-red-950/40 p-2 rounded border border-red-500/20">
                    <Database className="w-3.5 h-3.5 animate-pulse" />
                     Hash Dispute!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
