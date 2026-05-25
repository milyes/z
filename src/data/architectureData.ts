import { ArchitectureLayer, DesignPrinciple, SimulationScenario } from '../types';

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    number: 1,
    name: "Governance & Observability Stack",
    shortName: "Governance",
    description: "Operates as the foundational security layer enforcing kernel protection, sovereign policy, real-time threat analysis, and runtime monitoring.",
    color: "amber",
    techStack: ["TPM 2.0", "HSM client", "eBPF hooks", "Sovereign Constitutional Engine", "Rust Shield"],
    subComponents: [
      {
        id: "tpm_hsm",
        name: "Runtime Monitoring + Anomaly Detection",
        description: "Cryptographic hardware anchoring with TPM 2.0 and HSM secure key attestation to prevent host telemetry or hardware tampering.",
        metrics: { "Node Attestations": "99.99%", "Active HSM Keys": 64, "TPM Enclave Temp": "38°C" },
        status: "active"
      },
      {
        id: "netsecure_ebpf",
        name: "NetSecurePro Shield & eBPF",
        description: "Kernel-level system-call interceptors and eBPF socket monitoring targeting anomalous system activities or unauthorized root privilege escalation.",
        metrics: { "Kernel Events Scanned/s": 14200, "eBPF Sandbox Latency": "0.18ms", "Blocked Syscalls (24h)": 4 },
        status: "active"
      },
      {
        id: "constitutional_ai",
        name: "Constitutional AI Enforcement Engine",
        description: "Dual-guardrail safety model enforcing sovereign, un-tamperable state bylaws, alignment constraints, and system-level guidelines on inputs and outputs.",
        metrics: { "Guardrail Compliance Rate": "100.0%", "Token Filtering Speed": "0.45ms", "Enforced Core Directives": "Z-H202.v1" },
        status: "active"
      }
    ]
  },
  {
    number: 2,
    name: "Serving & Inference Engine",
    shortName: "Serving",
    description: "Acts as the air-gapped ingress controller organizing mTLS sessions, continuous batching execution, and high-performance inference load balancing.",
    color: "blue",
    techStack: ["mTLS Gateway", "VLLM Native Router", "KV-Cache Manager", "Continuous Batching Scheduler"],
    subComponents: [
      {
        id: "mtls_gateway",
        name: "Inference API Gateway & mTLS",
        description: "Zero-Trust mutual TLS gateway terminating traffic directly to isolated, air-gapped node clusters with hardware-bound certificates.",
        metrics: { "mTLS Handshake Speed": "2.4ms", "Concurrent Channels": 810, "Cert Validity": "98 days remaining" },
        status: "active"
      },
      {
        id: "kv_cache",
        name: "Optimized KV-Cache Manager",
        description: "Implements page-centric paging techniques to store context key-value states dynamically, reducing memory waste to near zero.",
        metrics: { "KV-Cache Capacity Hit": "72.4%", "Prefilled Tokens/s": 48200, "Memory Reuse Factor": "4.8x" },
        status: "active"
      },
      {
        id: "batching_balancer",
        name: "Continuous Batching & Dynamic Load Balancer",
        description: "Schedules iteration-level steps for incoming prompts to bypass queue waits, routing load to the lowest latency available tensor-enclaves.",
        metrics: { "Queue Queuing Delay": "0.8ms", "Scheduling Iteration Pitch": "0.2ms", "Available GPU Enclaves": 8 },
        status: "active"
      }
    ]
  },
  {
    number: 3,
    name: "Orchestration & Agentic Core",
    shortName: "Orchestration",
    description: "Orchestrates complex cognitive processes by breaking down statements, assigning sub-agents, and checking execution paths with multi-pass evaluation.",
    color: "cyan",
    techStack: ["ReAct Framework", "Tree-of-Thoughts Core", "Hierarchical Task Scheduler", "Parallel Execution Core"],
    subComponents: [
      {
        id: "planning_scheduler",
        name: "Hierarchical Planning Manager & Task Scheduler",
        description: "Decomposes complex requests into directed acyclic graphs (DAGs) and matches specialized sub-agents with individual task targets.",
        metrics: { "Max Planner Depth": "12 steps", "Planning Accuracy": "98.2%", "DAG Compile Cost": "14ms" },
        status: "active"
      },
      {
        id: "multi_agent",
        name: "Multi-Agent ReAct Framework",
        description: "Drives autonomous Plan-and-Execute agent loops with instant feedback evaluations. Supports expert-to-expert alignment handovers.",
        metrics: { "Active Autonomous Agents": 5, "Agent Cooperation Ratio": "99.1%", "Avg Loop Iterations": 2.4 },
        status: "active"
      },
      {
        id: "reasoning_engine",
        name: "Advanced Reasoning (ToT + CoT + Self-Consistency)",
        description: "Evaluates multi-candidate decision trees. Employs competitive path reasoning, majority-voting consistency, and verification constraints before dispatching actions.",
        metrics: { "ToT Candidates Spawned": 4, "Self-Consistency Rate": "97.8%", "Verification Success Rate": "99.4%" },
        status: "active"
      },
      {
        id: "tool_caller",
        name: "Parallel Tool Use & Function Calling",
        description: "Generates multiple, concurrent secure tool dispatches, parses their JSON structures, and aggregates outcomes into context memory lanes.",
        metrics: { "Concurrent Tool Streams": 8, "Function Dispatch Latency": "1.2ms", "Tool Parsing Safety": "100.0%" },
        status: "active"
      }
    ]
  },
  {
    number: 4,
    name: "Retrieval & Augmentation Layer",
    shortName: "Retrieval",
    description: "Provides zero-trust local reference queries from multi-layered repositories, re-ranking documents dynamically to prevent context poisoning.",
    color: "emerald",
    techStack: ["Hybrid BM25", "ColBERT / Cohere Re-ranker", "Multi-Vector Retriever", "GraphRAG Engine"],
    subComponents: [
      {
        id: "rag_pipeline",
        name: "Advanced RAG Pipeline",
        description: "Orchestrates semantic query rewriting, hybrid keyword + dense embeddings lookup, and robust Cohere-driven top-N relevance re-ranking.",
        metrics: { "Query Re-ranking Gain": "+14.8%", "Dense Match Latency": "12.4ms", "Context Noise Reduction": "88%" },
        status: "active"
      },
      {
        id: "graph_rag",
        name: "Multi-Vector & Graph RAG Engine",
        description: "Maps data relationships into rich entity grids, traversing connected node dependencies to retrieve high-context semantic neighborhoods.",
        metrics: { "Traversed Graph Rings": 3, "Entity Nodes Loaded": 4200, "Graph Relationship Clarity": "96.4%" },
        status: "active"
      },
      {
        id: "memory_system",
        name: "Multi-Level Memory System",
        description: "Saves transient observations in Short-term memory, archives persistent data in Long-term database layers, and records complete events in Episodic logs.",
        metrics: { "Episodic Recall Accuracy": "94.2%", "Working Memory Swap": "180µs", "Long-term Vector Index Ratio": "100%" },
        status: "active"
      }
    ]
  },
  {
    number: 5,
    name: "Models Layer",
    shortName: "Models",
    description: "Hosts the sovereign intelligence engines. Uses sparse multi-expert routers and precision-squeezed offline-capable edge configurations.",
    color: "purple",
    techStack: ["Sparsely Gated MoE Routing", "QLoRA Adaptations", "INT4 / INT8 quantization", "Llama/Qwen edge nodes"],
    subComponents: [
      {
        id: "moe_architecture",
        name: "Mixture of Experts Architecture (MoE)",
        description: "Applies a fast, sparsely gated router to pipe input tokens to the two most highly optimized network experts, isolating system computational overhead.",
        metrics: { "Active Expert Allocations": "2 of 16", "Router Gating Confidence": "99.4%", "Unused Compute Salvaged": "42%" },
        status: "active"
      },
      {
        id: "quantized_llm",
        name: "Quantized Core LLMs (4-bit & 8-bit)",
        description: "Executes precision-quantized sovereign weights on edge-accelerated nodes, enabling full localized LLM operation with zero remote telemetry risk.",
        metrics: { "Core Weight Precision": "INT4", "Weights VRAM Footprint": "12.8 GB", "Edge SLM Activation Speed": "48 tok/s" },
        status: "active"
      },
      {
        id: "domain_experts",
        name: "Domain-Specific Expert Models",
        description: "Fine-tuned, highly concentrated SLMs optimized for cryptographic validations, code compiling, threat detection, and sovereign auditing.",
        metrics: { "Cryptographic Accuracy": "99.98%", "SecFineTune Match Delta": "+32%", "LOB Specialists Configured": 4 },
        status: "active"
      }
    ]
  },
  {
    number: 6,
    name: "Data & Persistence Layer",
    shortName: "Data",
    description: "Guarantees storage privacy, real-time index synchronization, and secure, tamper-proof local system state saves.",
    color: "red",
    techStack: ["VectorDB Cluster", "RocksDB WAL", "Feature Store", "AES-256-GCM Enclave"],
    subComponents: [
      {
        id: "ingestion_pipeline",
        name: "Real-time & Batch Ingestion Pipeline",
        description: "Dual-engine loader parsing streaming audit metrics, file storage pools, and operational telemetry logs through memory-isolated conduits.",
        metrics: { "Max Streaming Speed": "45 MB/s", "Parser Integrity Validation": "Verified", "Queue Backpressure Level": "0%" },
        status: "active"
      },
      {
        id: "vectordb_feature",
        name: "VectorDB + Feature Store + Graph Database",
        description: "Holds transactional structures and fast vector dimensions in decoupled layouts, maintaining absolute relational mapping sync in real-time.",
        metrics: { "Total Vectors Indexed": "2,400,000", "State Match Query Speed": "1.8ms", "RocksDB Write Latency": "0.12ms" },
        status: "active"
      },
      {
        id: "aes_encryption",
        name: "AES-256-GCM Hardware-Bound Encryption",
        description: "Forces continuous encryption on all physical data-at-rest volumes and memory-to-disk states, utilizing hardware-bound keys.",
        metrics: { "Encryption Latency Penalty": "0.04ms", "Keys Rotated (24h)": 1, "Enclave Vault Integrity": "FIPS 140-3 Level 4" },
        status: "active"
      }
    ]
  }
];

export const DESIGN_PRINCIPLES: DesignPrinciple[] = [
  {
    name: "Sovereign Execution & Offline-First",
    tagline: "Air-gapped capability by design",
    description: "Functions completely isolated from public internet clouds, executing intelligence tasks natively on internal hardware pools to eliminate third-party data exhaust.",
    status: "fully_operational",
    icon: "ShieldAlert"
  },
  {
    name: "Cryptographic Immutable Audit Ledger",
    tagline: "Un-alterable historical tracking",
    description: "Every decision, tool dispatch, and security threat evaluation is written to a localized, content-hashed cryptographic ledger to ensure transparent external validation.",
    status: "fully_operational",
    icon: "Lock"
  },
  {
    name: "Explainable AI (Decision Trace)",
    tagline: "Clear cognitive accountability",
    description: "Decouples standard neural execution, exporting real-time step-by-step rationales, ToT decision vectors, and source attributions for every compiled response.",
    status: "fully_operational",
    icon: "MessageSquareCode"
  },
  {
    name: "Zero Trust Architecture",
    tagline: "Verify every access, continuously",
    description: "Enforces end-to-end mTLS authentication for model enclaves, rigorous eBPF system call filtering, and multi-pass safety guardrails on all operations.",
    status: "fully_operational",
    icon: "Key"
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "scen_intrusion",
    title: "Scenario 1: System Kernel Intrusion Event",
    description: "A simulated kernel attack attempt to mount unauthorized root modules. Traces dynamic eBPF detection, HSM alert triggering, Constitutional guardrail isolation, and Ledger committing.",
    prompt: "RECOVERY UNIT: Attempting to mount system path '/dev/mem_bypass_0' bypassing the standard kernel page-table restrictions.",
    steps: [
      {
        layerNumber: 1,
        componentId: "netsecure_ebpf",
        title: "eBPF System Hack Countered",
        explanation: "The eBPF kernel agent detects an unauthorized sys-call interface request targeting path '/dev/mem_bypass_0'. Immediately halts the thread and flags the source PID.",
        status: "alert",
        metricUpdate: { key: "Blocked Syscalls (24h)", value: 5 },
        durationMs: 1400
      },
      {
        layerNumber: 1,
        componentId: "constitutional_ai",
        title: "Constitutional Safety Enforcement",
        explanation: "Under constitutional bylaws, raw memory manipulation is restricted. The guardrail overrides standard thread dispatch and prepares a cryptographic security exception log.",
        status: "processing",
        metricUpdate: { key: "Guardrail Compliance Rate", value: "100.0%" },
        durationMs: 1200
      },
      {
        layerNumber: 2,
        componentId: "mtls_gateway",
        title: "API Gateway session revoked",
        explanation: "API ingress points revoke the specific client's mTLS token authorization in under 1ms, preventing any further traffic submission.",
        status: "success",
        metricUpdate: { key: "Active mTLS Streams", value: "Terminated" },
        durationMs: 900
      },
      {
        layerNumber: 6,
        componentId: "aes_encryption",
        title: "Secure Ledger Audit Pipeline Lock",
        explanation: "The incident metadata, caller token, and kernel memory address are packed inside an AES-256-GCM enclave. A tamper-proof block is dispatched for permanent persistence.",
        status: "success",
        metricUpdate: { key: "Ledger Tamper State", value: "Secured" },
        durationMs: 1500
      }
    ]
  },
  {
    id: "scen_graph_rag",
    title: "Scenario 2: Graph-RAG Sovereign Query",
    description: "Traces a sensitive sovereign intelligence query. Walks through mTLS validation, agent task breakdown, Graph-RAG neighborhood traversal, sparse MoE dispatch, and final secure logging.",
    prompt: "QUERY: Verify legal alignment of military supply chain components across Sector-7 and test relationship to registered secure suppliers.",
    steps: [
      {
        layerNumber: 2,
        componentId: "mtls_gateway",
        title: "Zero Trust Ingress Verified",
        explanation: "mTLS payload decrypted and caller signature validated via internal hardware root certificate. Request directed to isolation sandbox for orchestration.",
        status: "success",
        metricUpdate: { key: "Concurrent Channels", value: 811 },
        durationMs: 800
      },
      {
        layerNumber: 3,
        componentId: "planning_scheduler",
        title: "Hierarchical Query Decomposing",
        explanation: "Planning Manager parses query and determines it requires: Layer 4 sovereign entity lookup, Graph route plotting, and Layer 5 precision model routing.",
        status: "processing",
        metricUpdate: { key: "Active Autonomous Agents", value: 3 },
        durationMs: 1100
      },
      {
        layerNumber: 4,
        componentId: "graph_rag",
        title: "Entity Graph & Vector RAG Scanned",
        explanation: "Traverses GraphRAG clusters for 'Sector-7 supply logs' and retrieves verified relationship vectors, eliminating out-of-bounds knowledge pollution.",
        status: "success",
        metricUpdate: { key: "Traversed Graph Rings", value: 3 },
        durationMs: 1600
      },
      {
        layerNumber: 5,
        componentId: "moe_architecture",
        title: "Sparse MoE Allocation Triggered",
        explanation: "Token flows sorted. Fast sparse routers assign the query to Expert 3 (Supply Chain Compliance) and Expert 8 (Legal Alignment Verification) to build accurate inferences.",
        status: "success",
        metricUpdate: { key: "Active Expert Allocations", value: "Expert 3 + Expert 8" },
        durationMs: 1300
      },
      {
        layerNumber: 6,
        componentId: "vectordb_feature",
        title: "AES-256 State Persistence Write",
        explanation: "Scribbles the trace of query-answering alignment, context graphs, logic nodes, and hardware cycles directly into the encrypted, localized block database.",
        status: "success",
        metricUpdate: { key: "Total Vectors Indexed", value: "2,400,001" },
        durationMs: 1000
      }
    ]
  },
  {
    id: "scen_agent_tree",
    title: "Scenario 3: Multi-Agent ToT Reasoning & Tool Dispatch",
    description: "Runs a complex reasoning loop requiring parallel tool usage. Traces Tree-of-Thought (ToT) evaluation, parallel tool calls, self-consistency checks, and response signing.",
    prompt: "AGENT_ORCHESTRATOR: Cross-reference threat telemetry with active policies and execute automatic safe-mode isolations.",
    steps: [
      {
        layerNumber: 3,
        componentId: "reasoning_engine",
        title: "Tree-of-Thoughts Path Evaluation",
        explanation: "Reasoning core spawns 4 candidate mitigation branches. Path 3 (Proactive safe isolation of threat nodes) achieves 98.4% logical score in ToT self-consistency check.",
        status: "processing",
        metricUpdate: { key: "ToT Candidates Spawned", value: 4 },
        durationMs: 1400
      },
      {
        layerNumber: 3,
        componentId: "tool_caller",
        title: "Parallel Tool Use & Dynamic Execution",
        explanation: "Dispatches 3 secure sandboxed tool calls simultaneously: node status inspect, firewall block rule commit, and cryptographic health sign-off.",
        status: "success",
        metricUpdate: { key: "Concurrent Tool Streams", value: 3 },
        durationMs: 1500
      },
      {
        layerNumber: 4,
        componentId: "memory_system",
        title: "Episodic Recollection Commit",
        explanation: "Records full ReAct chain of actions and tool results inside episodic working memory cells, ensuring long-term audit traceability.",
        status: "success",
        metricUpdate: { key: "Episodic Recall Accuracy", value: "94.6%" },
        durationMs: 1000
      },
      {
        layerNumber: 1,
        componentId: "constitutional_ai",
        title: "Constitutional Safety Enforcement Output Review",
        explanation: "The compiled mitigation proposal undergoes a final safety pass against sovereign core files, signing off on the isolation commands.",
        status: "success",
        metricUpdate: { key: "Guardrail Compliance Rate", value: "100.0%" },
        durationMs: 1100
      }
    ]
  }
];
