import React from 'react';
import { usePipelineStore, HazardType } from '../../store/pipelineStore';

// Info content for different hazard types
const hazardInfo: Record<HazardType, { title: string, description: string }> = {
  'DATA': {
    title: 'Data Hazard',
    description: 'Occurs when an instruction depends on the result of a previous instruction that hasn\'t completed execution. Common types include Read-After-Write (RAW), Write-After-Read (WAR), and Write-After-Write (WAW) hazards.'
  },
  'CONTROL': {
    title: 'Control Hazard',
    description: 'Occurs when the next instruction to execute depends on the result of a branch instruction. The pipeline might have fetched incorrect instructions after a branch before knowing the branch outcome.'
  },
  'STRUCTURAL': {
    title: 'Structural Hazard',
    description: 'Occurs when multiple instructions need the same hardware resource at the same time, causing a resource conflict that requires stalling the pipeline.'
  },
  'NONE': {
    title: 'No Hazard',
    description: 'No pipeline hazards are present, allowing instructions to flow through the pipeline without stalls or forwarding.'
  },
  'FORWARDED': {
    title: 'Data Forwarding Active',
    description: 'A data hazard is present, but data forwarding is used to resolve it by directly passing results between pipeline stages, avoiding stalls.'
  },
  'PREDICTED': {
    title: 'Branch Prediction Active',
    description: 'A control hazard from a branch instruction is present, but branch prediction is used to speculatively execute instructions based on the predicted branch outcome.'
  },
  'STALLED': {
    title: 'Pipeline Stalled',
    description: 'Pipeline execution is stalled due to a hazard that could not be resolved by forwarding or prediction techniques.'
  },
  'WAW': {
    title: 'Write-After-Write Hazard',
    description: 'Occurs when an instruction tries to write to a register that a previous instruction (still in the pipeline) will also write to. This can lead to incorrect results if the writes happen in the wrong order.'
  },
  'WAR': {
    title: 'Write-After-Read Hazard',
    description: 'Occurs when an instruction tries to write to a register that a previous instruction (still in the pipeline) needs to read. This can lead to incorrect results if the write happens before the read is complete.'
  }
};

// Info content for pipeline stages
const stageInfo = {
  'IF': {
    title: 'Instruction Fetch (IF)',
    description: 'Fetches the next instruction from memory using the program counter (PC) and increments the PC for the next cycle.',
    keyComponents: ['Program Counter', 'Instruction Memory', 'PC Incrementer']
  },
  'ID': {
    title: 'Instruction Decode (ID)',
    description: 'Decodes the instruction, reads register values, and detects hazards. Control signals are generated for later stages.',
    keyComponents: ['Register File', 'Control Unit', 'Hazard Detection Unit']
  },
  'EX': {
    title: 'Execute (EX)',
    description: 'Performs the actual operation (ALU operations, address calculations, branch condition evaluation).',
    keyComponents: ['ALU', 'Forwarding Unit', 'Branch Address Calculator']
  },
  'MEM': {
    title: 'Memory Access (MEM)',
    description: 'Accesses data memory for load/store instructions. Completes the branch execution by updating PC if needed.',
    keyComponents: ['Data Memory', 'Branch Resolution']
  },
  'WB': {
    title: 'Write Back (WB)',
    description: 'Writes results back to the register file for instructions that produce a value.',
    keyComponents: ['Register Write Logic']
  }
};

// Info about pipeline performance improvements
const performanceImprovements = [
  {
    name: 'Data Forwarding',
    description: 'Forwards results from later pipeline stages back to earlier stages to resolve data hazards without stalling.',
    impact: 'Can significantly reduce pipeline stalls due to data hazards.'
  },
  {
    name: 'Branch Prediction',
    description: 'Predicts the outcome of branch instructions to avoid stalling the pipeline on control hazards.',
    impact: 'Reduces pipeline stalls due to control hazards, especially for branches with predictable patterns.'
  },
  {
    name: 'Out-of-Order Execution',
    description: 'Allows instructions to execute as soon as their operands are available, regardless of program order.',
    impact: 'Increases instruction-level parallelism and overall throughput.'
  },
  {
    name: 'Superscalar Design',
    description: 'Multiple instructions can be fetched, decoded, and executed in parallel in each cycle.',
    impact: 'Increases throughput by executing multiple instructions simultaneously.'
  }
];

const PipelineInfoPanel: React.FC = () => {
  const { hazardDetection, dataForwarding, branchPrediction, stats } = usePipelineStore();
  
  return (
    <div className="pipeline-info-panel">
      <div className="info-section">
        <h3>5-Stage RISC Pipeline</h3>
        <p>
          The classic 5-stage RISC pipeline divides instruction execution into five distinct stages.
          Each stage performs a specific part of instruction execution, allowing multiple instructions
          to be processed simultaneously at different stages.
        </p>
        
        <div className="pipeline-diagram">
          <div className="pipeline-stage-info">
            {Object.entries(stageInfo).map(([stage, info]) => (
              <div key={stage} className="stage-info-box">
                <h4>{info.title}</h4>
                <p>{info.description}</p>
                <div className="components-list">
                  <strong>Key Components:</strong>
                  <ul>
                    {info.keyComponents.map((component, index) => (
                      <li key={index}>{component}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Pipeline Hazards</h3>
        <p>
          Pipeline hazards are situations that prevent the next instruction in the instruction stream
          from executing in the designated clock cycle. The three main types of hazards are:
        </p>
        
        <div className="hazards-info">
          {Object.entries(hazardInfo).filter(([key]) => key !== 'NONE').map(([type, info]) => (
            <div key={type} className={`hazard-info-box ${type.toLowerCase()}`}>
              <h4>{info.title}</h4>
              <p>{info.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="info-section">
        <h3>Performance Optimizations</h3>
        <p>
          Several techniques can be employed to improve pipeline performance by reducing stalls
          and increasing throughput:
        </p>
        
        <div className="optimizations-info">
          {performanceImprovements.map((improvement, index) => (
            <div 
              key={index} 
              className={`optimization-info-box ${
                (improvement.name === 'Data Forwarding' && dataForwarding) ||
                (improvement.name === 'Branch Prediction' && branchPrediction) ? 
                'active' : ''
              }`}
            >
              <h4>{improvement.name}</h4>
              <p>{improvement.description}</p>
              <div className="impact">
                <strong>Impact:</strong> {improvement.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="info-section">
        <h3>Performance Metrics</h3>
        <p>
          Key metrics for evaluating pipeline performance:
        </p>
        
        <div className="metrics-info">
          <div className="metric-info-box">
            <h4>Cycles Per Instruction (CPI)</h4>
            <p>
              The average number of clock cycles required to execute a single instruction.
              Ideal CPI for a perfect pipeline would be 1.0, but hazards and stalls increase this value.
              Current CPI: <strong>{stats.cpi.toFixed(2)}</strong>
            </p>
          </div>
          
          <div className="metric-info-box">
            <h4>Instruction Throughput</h4>
            <p>
              The number of instructions completed per unit time.
              Higher throughput indicates better pipeline performance.
              Current throughput: <strong>{stats.instructionsCompleted > 0 && stats.totalCycles > 0 ? 
                (stats.instructionsCompleted / stats.totalCycles).toFixed(2) : '0.00'} instructions/cycle</strong>
            </p>
          </div>
          
          <div className="metric-info-box">
            <h4>Speedup</h4>
            <p>
              The ratio of sequential execution time to pipelined execution time.
              For a 5-stage pipeline with no hazards, the theoretical maximum speedup is 5x.
              Estimated speedup: <strong>{stats.instructionsCompleted > 0 ? 
                (stats.instructionsCompleted * 5 / stats.totalCycles).toFixed(2) : '0.00'}x</strong>
            </p>
          </div>
          
          <div className="metric-info-box">
            <h4>Pipeline Efficiency</h4>
            <p>
              The percentage of pipeline stages that are busy during program execution.
              Higher efficiency indicates better utilization of the pipeline.
              Current efficiency: <strong>{stats.instructionsCompleted > 0 && stats.totalCycles > 0 ? 
                (stats.instructionsCompleted * 5 / (stats.totalCycles * 5) * 100).toFixed(1) : '0.0'}%</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineInfoPanel; 