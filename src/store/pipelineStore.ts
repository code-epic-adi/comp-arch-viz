import { create } from 'zustand';

// Pipeline stages
export type PipelineStage = 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';

// Instruction types
export type InstructionType = 'LOAD' | 'STORE' | 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'BRANCH' | 'JUMP';

// Hazard types
export type HazardType = 'DATA' | 'CONTROL' | 'STRUCTURAL' | 'NONE' | 'FORWARDED' | 'PREDICTED' | 'STALLED' | 'WAW' | 'WAR';

// Structural hazard settings
interface StructuralHazardSettings {
  sharedALU: boolean;         // Single ALU for all operation types
  sharedMemory: boolean;      // Single memory port (read/write conflicts)
  sharedRegisters: boolean;   // Register file has limited ports
  limitedMultiplier: boolean; // Limited multiplier units
}

// Instruction representation
export interface Instruction {
  id: string;
  type: InstructionType;
  opcode: string;
  operands: string[];
  stages: {
    [key in PipelineStage]?: {
      cycleStart: number;
      cycleEnd: number;
      stalled: boolean;
      hazard: HazardType;
    };
  };
  completed: boolean;
  currentStage: PipelineStage | null;
}

// Performance statistics
interface PipelineStats {
  totalCycles: number;
  instructionsCompleted: number;
  cpi: number;
  stallCycles: number;
  dataDependencies: number;
  controlHazards: number;
  structuralHazards: number;
  speedup: number;
  efficiency: number;
  throughput: number;
  // History arrays for trend visualization
  cpiHistory: number[];
  stallHistory: number[];
  speedupHistory: number[];
  efficiencyHistory: number[];
  throughputHistory: number[];
}

// Interface for store state
interface PipelineState {
  // Simulation state
  instructions: Instruction[];
  currentCycle: number;
  isRunning: boolean;
  speed: number;
  simulationEnded: boolean;
  
  // Pipeline stages occupancy
  stageOccupancy: {
    [key in PipelineStage]: Instruction | null;
  };
  
  // Statistics
  stats: PipelineStats;
  
  // Settings
  hazardDetection: boolean;
  dataForwarding: boolean;
  branchPrediction: boolean;
  branchPredictionAccuracy: number;
  warHazardDetection: boolean;  // Write-After-Read hazard detection
  wawHazardDetection: boolean;  // Write-After-Write hazard detection
  loadUseHazardDelay: number;   // Configurable delay cycles for load-use hazards
  structuralHazardSettings: StructuralHazardSettings;
  
  // Actions
  addInstruction: (type: InstructionType, opcode: string, operands: string[]) => void;
  removeInstruction: (id: string) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSpeed: (speed: number) => void;
  toggleHazardDetection: () => void;
  toggleDataForwarding: () => void;
  toggleBranchPrediction: () => void;
  toggleWARHazardDetection: () => void;
  toggleWAWHazardDetection: () => void;
  setLoadUseHazardDelay: (cycles: number) => void;
  setStructuralHazardSettings: (settings: Partial<StructuralHazardSettings>) => void;
  setBranchPredictionAccuracy: (accuracy: number) => void;
}

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create store
export const usePipelineStore = create<PipelineState>((set, get) => ({
  // Simulation state
  instructions: [],
  currentCycle: 0,
  isRunning: false,
  speed: 1,
  simulationEnded: false,
  
  // Pipeline stages occupancy
  stageOccupancy: {
    IF: null,
    ID: null,
    EX: null,
    MEM: null,
    WB: null
  },
  
  // Statistics
  stats: {
    totalCycles: 0,
    instructionsCompleted: 0,
    cpi: 0,
    stallCycles: 0,
    dataDependencies: 0,
    controlHazards: 0,
    structuralHazards: 0,
    speedup: 0,
    efficiency: 0,
    throughput: 0,
    cpiHistory: [],
    stallHistory: [],
    speedupHistory: [],
    efficiencyHistory: [],
    throughputHistory: []
  },
  
  // Settings
  hazardDetection: true,
  dataForwarding: false,
  branchPrediction: false,
  branchPredictionAccuracy: 0.8,
  warHazardDetection: false,
  wawHazardDetection: false,
  loadUseHazardDelay: 1,
  structuralHazardSettings: {
    sharedALU: false,
    sharedMemory: true,
    sharedRegisters: false,
    limitedMultiplier: true
  },
  
  // Actions
  addInstruction: (type, opcode, operands) => set((state) => {
    const newInstruction: Instruction = {
      id: generateId(),
      type,
      opcode,
      operands,
      stages: {},
      completed: false,
      currentStage: null
    };
    
    return {
      instructions: [...state.instructions, newInstruction],
      simulationEnded: false // Reset simulation ended flag when adding new instructions
    };
  }),
  
  removeInstruction: (id) => set((state) => ({
    instructions: state.instructions.filter(instruction => instruction.id !== id)
  })),
  
  startSimulation: () => {
    const state = get();
    if (state.instructions.length === 0) return;
    
    // If we have a timer running, don't start another one
    if (state.isRunning) return;
    
    set({ isRunning: true, simulationEnded: false });
    
    const runSimulation = () => {
      const currentState = get();
      if (!currentState.isRunning) return;
      
      // Advance one cycle
      get().stepSimulation();
      
      // Check if simulation is complete (all instructions finished)
      const allCompleted = currentState.instructions.every(instr => instr.completed);
      const noActiveStages = Object.values(currentState.stageOccupancy).every(stage => stage === null);
      
      if (allCompleted && noActiveStages) {
        set({ isRunning: false, simulationEnded: true });
        return;
      }
      
      // Continue simulation
      setTimeout(runSimulation, 1000 / currentState.speed);
    };
    
    // Start the simulation loop
    setTimeout(runSimulation, 1000 / state.speed);
  },
  
  pauseSimulation: () => set({ isRunning: false }),
  
  resetSimulation: () => set((state) => ({
    currentCycle: 0,
    isRunning: false,
    simulationEnded: false,
    instructions: state.instructions.map(instruction => ({
      ...instruction,
      stages: {},
      completed: false,
      currentStage: null
    })),
    stageOccupancy: {
      IF: null,
      ID: null,
      EX: null,
      MEM: null,
      WB: null
    },
    stats: {
      totalCycles: 0,
      instructionsCompleted: 0,
      cpi: 0,
      stallCycles: 0,
      dataDependencies: 0,
      controlHazards: 0,
      structuralHazards: 0,
      speedup: 0,
      efficiency: 0,
      throughput: 0,
      cpiHistory: [],
      stallHistory: [],
      speedupHistory: [],
      efficiencyHistory: [],
      throughputHistory: []
    }
  })),
  
  stepSimulation: () => set((state) => {
    // Skip if no instructions or simulation ended
    if (state.instructions.length === 0) return state;
    
    // Increment cycle counter
    const nextCycle = state.currentCycle + 1;
    
    // Copy of instructions to be updated
    const updatedInstructions = [...state.instructions];
    
    // Tracking for stage occupancy in this cycle
    const nextStageOccupancy = { ...state.stageOccupancy };
    
    // Stats copy
    let updatedStats = { ...state.stats };
    updatedStats.totalCycles = nextCycle;

    // Track stalls in this cycle for statistics
    let newDataHazards = 0;
    let newControlHazards = 0;
    let newStructuralHazards = 0;
    let newStallCycles = 0;
    
    // Process instructions in reverse order (to handle pipeline correctly)
    // Processing WB -> MEM -> EX -> ID -> IF
    
    // Step 1: Process WB stage
    if (nextStageOccupancy.WB) {
      const instr = updatedInstructions.find(i => i.id === nextStageOccupancy.WB?.id);
      if (instr) {
        instr.completed = true;
        instr.currentStage = null;
        nextStageOccupancy.WB = null;
        updatedStats.instructionsCompleted++;
      }
    }
    
    // MEM to WB
    if (nextStageOccupancy.MEM) {
      nextStageOccupancy.WB = nextStageOccupancy.MEM;
      const instruction = updatedInstructions.find(i => i.id === nextStageOccupancy.MEM?.id);
      if (instruction) {
        instruction.currentStage = 'WB';
        // Preserve hazard type when moving stages
        const hazardType = instruction.stages.MEM?.hazard || 'NONE';
        instruction.stages.WB = {
          cycleStart: nextCycle,
          cycleEnd: nextCycle,
          stalled: false,
          hazard: hazardType
        };
      }
      nextStageOccupancy.MEM = null;
    }
    
    // EX to MEM
    if (nextStageOccupancy.EX) {
      nextStageOccupancy.MEM = nextStageOccupancy.EX;
      const instruction = updatedInstructions.find(i => i.id === nextStageOccupancy.EX?.id);
      if (instruction) {
        instruction.currentStage = 'MEM';
        // Preserve hazard type when moving stages
        const hazardType = instruction.stages.EX?.hazard || 'NONE';
        instruction.stages.MEM = {
          cycleStart: nextCycle,
          cycleEnd: nextCycle,
          stalled: false,
          hazard: hazardType
        };
      }
      nextStageOccupancy.EX = null;
    }
    
    // ID to EX
    if (nextStageOccupancy.ID) {
      // Check for hazards
      let hazardDetected = false;
      let hazardType: HazardType = 'NONE';
      
      if (state.hazardDetection) {
        // Simple data hazard detection - check if any instruction in EX, MEM, or WB uses operands
        const instruction = updatedInstructions.find(i => i.id === nextStageOccupancy.ID?.id);
        if (instruction) {
          // RAW (Read-After-Write) hazard detection
          const sourceRegisters = instruction.operands.slice(1); // Assume operands[0] is destination
          
          // If any instruction in later stages writes to a register we need to read
          const dataHazardInstruction = updatedInstructions.find(i => 
            (i.currentStage === 'EX' || i.currentStage === 'MEM') && 
            i.operands[0] && sourceRegisters.includes(i.operands[0])
          );
          
          if (dataHazardInstruction) {
            // Always record the data hazard for visualization
            hazardType = state.dataForwarding ? 'FORWARDED' : 'DATA';
            
            // Only stall if data forwarding is disabled
            if (!state.dataForwarding) {
              hazardDetected = true;
              updatedStats.dataDependencies++;
              
              // Stall the pipeline
              if (instruction.stages.ID) {
                instruction.stages.ID.stalled = true;
                instruction.stages.ID.cycleEnd = nextCycle; // Extend the stage duration
                updatedStats.stallCycles++;
                newStallCycles++;
              }
            }
          }
          
          // Load-Use hazard special case with configurable delay
          if (instruction.type === 'LOAD' && state.loadUseHazardDelay > 0) {
            // Find instructions that use the loaded value
            const loadDestReg = instruction.operands[0]; // Register being loaded into
            const useInstructions = updatedInstructions.filter(i => 
              !i.completed && 
              i !== instruction && 
              i.operands.slice(1).includes(loadDestReg)
            );
            
            if (useInstructions.length > 0) {
              // Apply delay based on the configuration
              hazardType = 'DATA'; // Mark as a data hazard
              
              // If there's an instruction that will use this value, stall for configured cycles
              if (!state.dataForwarding || state.loadUseHazardDelay > 1) {
                hazardDetected = true;
                updatedStats.dataDependencies++;
                
                // Stall for the configured number of cycles
                if (instruction.stages.ID) {
                  instruction.stages.ID.stalled = true;
                  instruction.stages.ID.cycleEnd = nextCycle + state.loadUseHazardDelay - 1;
                  updatedStats.stallCycles += state.loadUseHazardDelay;
                  newStallCycles++;
                }
              }
            }
          }
          
          // WAR (Write-After-Read) hazard detection
          if (state.warHazardDetection) {
            const destRegister = instruction.operands[0]; // Register being written to
            
            // Check if any instruction in earlier stages reads from the register we're writing to
            const warHazardInstruction = updatedInstructions.find(i => 
              i.currentStage === 'ID' && 
              i !== instruction &&
              i.operands.slice(1).includes(destRegister)
            );
            
            if (warHazardInstruction) {
              hazardType = 'WAR';
              hazardDetected = true;
              updatedStats.dataDependencies++;
              
              // Stall the pipeline
              if (instruction.stages.ID) {
                instruction.stages.ID.stalled = true;
                instruction.stages.ID.cycleEnd = nextCycle; // Extend the stage duration
                updatedStats.stallCycles++;
                newStallCycles++;
              }
            }
          }
          
          // WAW (Write-After-Write) hazard detection
          if (state.wawHazardDetection) {
            const destRegister = instruction.operands[0]; // Register being written to
            
            // Check if any instruction in pipeline stages writes to the same register
            const wawHazardInstruction = updatedInstructions.find(i => 
              (i.currentStage === 'ID' || i.currentStage === 'EX' || i.currentStage === 'MEM') && 
              i !== instruction &&
              i.operands[0] === destRegister
            );
            
            if (wawHazardInstruction) {
              hazardType = 'WAW';
              hazardDetected = true;
              updatedStats.dataDependencies++;
              
              // Stall the pipeline
              if (instruction.stages.ID) {
                instruction.stages.ID.stalled = true;
                instruction.stages.ID.cycleEnd = nextCycle; // Extend the stage duration
                updatedStats.stallCycles++;
                newStallCycles++;
              }
            }
          }
          
          // Check for control hazards (branch instructions)
          if (instruction.type === 'BRANCH' || instruction.type === 'JUMP') {
            // Always record the control hazard for visualization
            hazardType = state.branchPrediction ? 'PREDICTED' : 'CONTROL';
            
            // Only stall if branch prediction is disabled
            if (!state.branchPrediction) {
              hazardDetected = true;
              updatedStats.controlHazards++;
              
              // Stall the pipeline for branch resolution
              if (instruction.stages.ID) {
                instruction.stages.ID.stalled = true;
                instruction.stages.ID.cycleEnd = nextCycle; // Extend the stage duration
                updatedStats.stallCycles++;
                newStallCycles++;
              }
            }
          }
          
          // Check for structural hazards based on settings
          const checkStructuralHazard = () => {
            const { structuralHazardSettings } = state;
            
            // Check for ALU conflicts if shared ALU setting is enabled
            if (structuralHazardSettings.sharedALU && 
                ['ADD', 'SUB', 'MUL', 'DIV'].includes(instruction.type)) {
              return updatedInstructions.some(i => 
                i.currentStage === 'EX' && 
                ['ADD', 'SUB', 'MUL', 'DIV'].includes(i.type) &&
                i !== instruction
              );
            }
            
            // Check for multiplier conflicts if limited multiplier setting is enabled
            if (structuralHazardSettings.limitedMultiplier && 
                ['MUL', 'DIV'].includes(instruction.type)) {
              return updatedInstructions.some(i => 
                i.currentStage === 'EX' && 
                ['MUL', 'DIV'].includes(i.type) &&
                i !== instruction
              );
            }
            
            // Check for memory conflicts if shared memory setting is enabled
            if (structuralHazardSettings.sharedMemory && 
                ['LOAD', 'STORE'].includes(instruction.type)) {
              return updatedInstructions.some(i => 
                i.currentStage === 'MEM' && 
                ['LOAD', 'STORE'].includes(i.type) &&
                i !== instruction
              );
            }
            
            // Check for register file conflicts if shared register file setting is enabled
            if (structuralHazardSettings.sharedRegisters) {
              // In decode stage, instructions read from register file
              // In writeback stage, instructions write to register file
              const regFileConflict = updatedInstructions.some(i => 
                i.currentStage === 'WB' && 
                instruction.type !== 'JUMP' && // JUMP doesn't read registers in most RISC designs
                i !== instruction
              );
              
              return regFileConflict;
            }
            
            return false;
          };
          
          const structuralHazardDetected = checkStructuralHazard();
          
          // Structural hazards take precedence over other hazards for visualization
          if (structuralHazardDetected) {
            hazardDetected = true;
            hazardType = 'STRUCTURAL';
            updatedStats.structuralHazards++;
            
            // Stall the pipeline for resource availability
            if (instruction.stages.ID) {
              instruction.stages.ID.stalled = true;
              instruction.stages.ID.cycleEnd = nextCycle; // Extend the stage duration
              updatedStats.stallCycles++;
              newStallCycles++;
            }
          }
          
          // Apply the detected hazard type to the instruction
          if (instruction.stages.ID) {
            instruction.stages.ID.hazard = hazardType;
          }
        }
      }
      
      if (!hazardDetected) {
        nextStageOccupancy.EX = nextStageOccupancy.ID;
        const instruction = updatedInstructions.find(i => i.id === nextStageOccupancy.ID?.id);
        if (instruction) {
          instruction.currentStage = 'EX';
          // Preserve hazard type when moving to EX stage
          instruction.stages.EX = {
            cycleStart: nextCycle,
            cycleEnd: nextCycle,
            stalled: false,
            hazard: hazardType
          };
        }
        nextStageOccupancy.ID = null;
      }
    }
    
    // IF to ID
    if (nextStageOccupancy.IF && !nextStageOccupancy.ID) {
      nextStageOccupancy.ID = nextStageOccupancy.IF;
      const instruction = updatedInstructions.find(i => i.id === nextStageOccupancy.IF?.id);
      if (instruction) {
        instruction.currentStage = 'ID';
        // Preserve hazard type when moving stages
        const hazardType = instruction.stages.IF?.hazard || 'NONE';
        instruction.stages.ID = {
          cycleStart: nextCycle,
          cycleEnd: nextCycle,
          stalled: false,
          hazard: hazardType
        };
      }
      nextStageOccupancy.IF = null;
    }
    
    // Fetch new instruction if IF is empty and we have more instructions
    if (!nextStageOccupancy.IF) {
      const nextInstruction = updatedInstructions.find(i => i.currentStage === null && !i.completed);
      if (nextInstruction) {
        nextInstruction.currentStage = 'IF';
        nextInstruction.stages.IF = {
          cycleStart: nextCycle,
          cycleEnd: nextCycle,
          stalled: false,
          hazard: 'NONE'
        };
        nextStageOccupancy.IF = nextInstruction;
      }
    }
    
    // Check if simulation should end (all instructions completed and no more in pipeline)
    const allCompleted = updatedInstructions.every(instr => instr.completed);
    const noActiveStages = Object.values(nextStageOccupancy).every(stage => stage === null);
    
    // Update performance metrics
    updatedStats.stallCycles = newStallCycles;
    
    // Calculate CPI - Cycles Per Instruction
    updatedStats.cpi = updatedStats.totalCycles / Math.max(1, updatedStats.instructionsCompleted);
    
    // Calculate throughput - Instructions per cycle
    updatedStats.throughput = updatedStats.instructionsCompleted / updatedStats.totalCycles;
    
    // Calculate speedup compared to non-pipelined (assuming 5 cycles per instruction)
    const nonPipelinedCycles = updatedStats.instructionsCompleted * 5; // 5 cycles per instruction in non-pipelined
    updatedStats.speedup = updatedStats.instructionsCompleted / updatedStats.totalCycles;
    
    // Calculate efficiency - Actual speedup / Ideal speedup (number of stages)
    const idealSpeedup = 5; // 5 stages in the pipeline
    updatedStats.efficiency = (updatedStats.speedup / idealSpeedup) * 100; // As percentage
    
    // Update history arrays for trend visualization
    updatedStats.cpiHistory[nextCycle] = updatedStats.cpi;
    updatedStats.stallHistory[nextCycle] = updatedStats.stallCycles;
    updatedStats.speedupHistory[nextCycle] = updatedStats.speedup;
    updatedStats.efficiencyHistory[nextCycle] = updatedStats.efficiency;
    updatedStats.throughputHistory[nextCycle] = updatedStats.throughput;
    
    return {
      currentCycle: nextCycle,
      instructions: updatedInstructions,
      stageOccupancy: nextStageOccupancy,
      stats: updatedStats,
      simulationEnded: allCompleted && noActiveStages
    };
  }),
  
  setSpeed: (speed) => set({ speed }),
  
  toggleHazardDetection: () => set((state) => ({
    hazardDetection: !state.hazardDetection
  })),
  
  toggleDataForwarding: () => set((state) => ({
    dataForwarding: !state.dataForwarding
  })),
  
  toggleBranchPrediction: () => set((state) => ({
    branchPrediction: !state.branchPrediction
  })),
  
  toggleWARHazardDetection: () => set((state) => ({
    warHazardDetection: !state.warHazardDetection
  })),
  
  toggleWAWHazardDetection: () => set((state) => ({
    wawHazardDetection: !state.wawHazardDetection
  })),
  
  setLoadUseHazardDelay: (cycles) => set({
    loadUseHazardDelay: cycles
  }),
  
  setStructuralHazardSettings: (settings) => set((state) => ({
    structuralHazardSettings: {
      ...state.structuralHazardSettings,
      ...settings
    }
  })),
  
  setBranchPredictionAccuracy: (accuracy) => set({
    branchPredictionAccuracy: accuracy
  })
})); 