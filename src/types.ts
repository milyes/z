export interface SubComponent {
  id: string;
  name: string;
  description: string;
  metrics: { [key: string]: number | string };
  status: 'active' | 'warning' | 'error' | 'idle';
}

export interface ArchitectureLayer {
  number: number;
  name: string;
  shortName: string;
  description: string;
  color: string; // Tailwind color class or hex
  subComponents: SubComponent[];
  techStack: string[];
}

export interface DesignPrinciple {
  name: string;
  tagline: string;
  description: string;
  status: 'fully_operational' | 'enforced';
  icon: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  steps: SimulationStep[];
}

export interface SimulationStep {
  layerNumber: number;
  componentId: string;
  title: string;
  explanation: string;
  status: 'success' | 'alert' | 'processing';
  metricUpdate?: { key: string; value: string | number };
  durationMs: number;
}

export interface LedgerEvent {
  index: number;
  timestamp: string;
  layer: number;
  action: string;
  payload: string;
  previousHash: string;
  hash: string;
  isTampered?: boolean;
}
