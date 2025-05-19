import React, { useState } from 'react';
import { usePipelineStore, InstructionType } from '../../store/pipelineStore';

const PipelineControlPanel: React.FC = () => {
  const {
    instructions,
    isRunning,
    speed,
    hazardDetection,
    dataForwarding,
    branchPrediction,
    warHazardDetection,
    wawHazardDetection,
    loadUseHazardDelay,
    structuralHazardSettings,
    addInstruction,
    removeInstruction,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    stepSimulation,
    setSpeed,
    toggleHazardDetection,
    toggleDataForwarding,
    toggleBranchPrediction,
    toggleWARHazardDetection,
    toggleWAWHazardDetection,
    setLoadUseHazardDelay,
    setStructuralHazardSettings
  } = usePipelineStore();

  // Form state for adding new instructions
  const [instructionType, setInstructionType] = useState<InstructionType>('ADD');
  const [opcode, setOpcode] = useState('ADD');
  const [operand1, setOperand1] = useState('R1');
  const [operand2, setOperand2] = useState('R2');
  const [operand3, setOperand3] = useState('R3');

  // Predefined instruction templates
  const instructionTemplates = [
    { type: 'ADD' as InstructionType, opcode: 'ADD', operands: ['R1', 'R2', 'R3'] },
    { type: 'SUB' as InstructionType, opcode: 'SUB', operands: ['R4', 'R5', 'R6'] },
    { type: 'LOAD' as InstructionType, opcode: 'LW', operands: ['R2', '4(R1)'] },
    { type: 'STORE' as InstructionType, opcode: 'SW', operands: ['R3', '8(R1)'] },
    { type: 'BRANCH' as InstructionType, opcode: 'BEQ', operands: ['R4', 'R5', 'LABEL'] },
    { type: 'JUMP' as InstructionType, opcode: 'J', operands: ['TARGET'] }
  ];

  // Add a predefined sequence for DATA hazard demo
  const addDataHazardSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence that will cause data hazards
    addInstruction('ADD', 'ADD', ['R1', 'R2', 'R3']);
    addInstruction('ADD', 'ADD', ['R4', 'R1', 'R5']); // Uses R1 from previous instruction
    addInstruction('SUB', 'SUB', ['R6', 'R4', 'R7']); // Uses R4 from previous instruction
  };

  // Add a predefined sequence for control hazard demo
  const addControlHazardSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence with branch instructions
    addInstruction('ADD', 'ADD', ['R1', 'R2', 'R3']);
    addInstruction('BRANCH', 'BEQ', ['R1', 'R0', 'SKIP']);
    addInstruction('ADD', 'ADD', ['R4', 'R5', 'R6']); // May be skipped
    addInstruction('SUB', 'SUB', ['R7', 'R8', 'R9']); // Target of branch
  };

  // Add a predefined sequence for structural hazard demo
  const addStructuralHazardSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence that demonstrates structural hazards (resource conflicts)
    // Case 1: Multiple MUL operations that conflict for the multiply unit
    addInstruction('MUL', 'MUL', ['R1', 'R2', 'R3']); // MUL operation takes multiple cycles
    addInstruction('MUL', 'MUL', ['R4', 'R5', 'R6']); // Conflict for the multiply unit
    addInstruction('ADD', 'ADD', ['R7', 'R8', 'R9']); // No conflict with ADD unit
    
    // Case 2: Memory access conflict
    addInstruction('LOAD', 'LW', ['R10', '0(R11)']); // Memory access
    addInstruction('STORE', 'SW', ['R12', '4(R13)']); // Another memory access
    
    // Enable hazard detection to see structural hazards
    if (!hazardDetection) {
      toggleHazardDetection();
    }
  };

  // Add a predefined sequence to demonstrate data forwarding benefits
  const addDataForwardingSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence that benefits from data forwarding
    addInstruction('ADD', 'ADD', ['R1', 'R2', 'R3']);
    addInstruction('SUB', 'SUB', ['R4', 'R1', 'R5']); // Uses R1 from previous instruction
    addInstruction('ADD', 'ADD', ['R6', 'R4', 'R7']); // Uses R4 from previous instruction
    addInstruction('LOAD', 'LW', ['R8', '0(R1)']); // Uses R1 from first instruction
    
    // Enable data forwarding for demonstration
    if (!dataForwarding) {
      toggleDataForwarding();
    }
  };

  // Add a predefined sequence to demonstrate branch prediction benefits
  const addBranchPredictionSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence with multiple branches to demonstrate branch prediction
    addInstruction('ADD', 'ADD', ['R1', 'R2', 'R3']);
    addInstruction('BRANCH', 'BEQ', ['R1', 'R0', 'SKIP1']);
    addInstruction('ADD', 'ADD', ['R4', 'R5', 'R6']); // May be skipped
    addInstruction('BRANCH', 'BEQ', ['R4', 'R5', 'SKIP2']);
    addInstruction('SUB', 'SUB', ['R7', 'R8', 'R9']); // May be skipped
    addInstruction('ADD', 'ADD', ['R10', 'R11', 'R12']); // Target of branch
    
    // Enable branch prediction for demonstration
    if (!branchPrediction) {
      toggleBranchPrediction();
    }
  };

  // Add a complex pipeline dependency example
  const addPipelineDependencySequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence with various dependencies
    addInstruction('LOAD', 'LW', ['R1', '0(R2)']); // Memory dependency
    addInstruction('ADD', 'ADD', ['R3', 'R1', 'R4']); // RAW dependency on R1
    addInstruction('STORE', 'SW', ['R3', '4(R2)']); // RAW dependency on R3
    addInstruction('SUB', 'SUB', ['R1', 'R5', 'R6']); // WAW dependency on R1
    addInstruction('MUL', 'MUL', ['R7', 'R1', 'R3']); // RAW dependencies on R1 and R3
    addInstruction('BRANCH', 'BEQ', ['R3', 'R0', 'SKIP']); // Control dependency
    addInstruction('ADD', 'ADD', ['R8', 'R9', 'R10']); // May be skipped
  };

  // Add a predefined sequence to demonstrate memory conflict hazards
  const addMemoryConflictSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence with memory conflict hazards
    addInstruction('LOAD', 'LW', ['R1', '0(R2)']); // Load from memory
    addInstruction('STORE', 'SW', ['R3', '4(R2)']); // Store to memory (same base register)
    addInstruction('LOAD', 'LW', ['R4', '8(R2)']); // Another load from memory
    addInstruction('ADD', 'ADD', ['R5', 'R1', 'R3']); // Uses loaded values
    
    // Enable hazard detection
    if (!hazardDetection) {
      toggleHazardDetection();
    }
  };

  // Add a predefined sequence to demonstrate pipeline bubbles
  const addPipelineBubbleSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence that shows pipeline bubbles due to dependencies
    addInstruction('LOAD', 'LW', ['R1', '0(R2)']); // Load value into R1
    addInstruction('ADD', 'ADD', ['R3', 'R1', 'R4']); // Uses R1 (bubble)
    addInstruction('SUB', 'SUB', ['R5', 'R3', 'R6']); // Uses R3 (bubble)
    addInstruction('MUL', 'MUL', ['R7', 'R5', 'R8']); // Uses R5 (bubble)
    
    // Enable hazard detection and disable data forwarding
    if (!hazardDetection) {
      toggleHazardDetection();
    }
    if (dataForwarding) {
      toggleDataForwarding();
    }
  };

  // Add a sequence to demonstrate WAW (Write After Write) hazards
  const addWAWHazardSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence with WAW hazards
    addInstruction('ADD', 'ADD', ['R1', 'R2', 'R3']); // Writes to R1
    addInstruction('MUL', 'MUL', ['R1', 'R4', 'R5']); // Also writes to R1 (WAW hazard)
    addInstruction('SUB', 'SUB', ['R6', 'R1', 'R7']); // Reads from R1 (RAW hazard)
    
    // Enable hazard detection
    if (!hazardDetection) {
      toggleHazardDetection();
    }
    
    // Enable WAW hazard detection
    if (!wawHazardDetection) {
      toggleWAWHazardDetection();
    }
  };

  // Add a sequence to demonstrate WAR (Write After Read) hazards
  const addWARHazardSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence with WAR hazards
    addInstruction('ADD', 'ADD', ['R1', 'R2', 'R3']); // R1 = R2 + R3
    addInstruction('SUB', 'SUB', ['R4', 'R2', 'R5']); // R4 = R2 - R5, reads R2
    addInstruction('MUL', 'MUL', ['R2', 'R6', 'R7']); // Writes to R2 (WAR hazard with previous instruction)
    
    // Enable hazard detection
    if (!hazardDetection) {
      toggleHazardDetection();
    }
    
    // Enable WAR hazard detection
    if (!warHazardDetection) {
      toggleWARHazardDetection();
    }
  };

  // Add a sequence to demonstrate load-use hazards
  const addLoadUseHazardSequence = () => {
    // Clear existing instructions
    instructions.forEach(instr => removeInstruction(instr.id));
    
    // Add a sequence with load-use hazards
    addInstruction('LOAD', 'LW', ['R1', '0(R2)']); // Load into R1
    addInstruction('ADD', 'ADD', ['R3', 'R1', 'R4']); // Use R1 immediately (load-use hazard)
    addInstruction('SUB', 'SUB', ['R5', 'R3', 'R6']); // Use result of ADD
    
    // Enable hazard detection
    if (!hazardDetection) {
      toggleHazardDetection();
    }
    
    // Set load-use hazard delay to 2 cycles
    setLoadUseHazardDelay(2);
  };

  // Function to handle change in load-use hazard delay
  const handleLoadUseDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 5) {
      setLoadUseHazardDelay(value);
    }
  };

  // Function to handle change in structural hazard settings
  const handleStructuralHazardChange = (key: string, value: boolean) => {
    setStructuralHazardSettings({
      ...structuralHazardSettings,
      [key]: value
    });
  };

  // Handle form submission to add a new instruction
  const handleAddInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    const operands = [operand1];
    if (operand2) operands.push(operand2);
    if (operand3) operands.push(operand3);
    
    addInstruction(instructionType, opcode, operands);
    
    // Reset form after adding
    setOpcode('');
    setOperand1('');
    setOperand2('');
    setOperand3('');
  };

  // Apply an instruction template
  const applyTemplate = (template: { type: InstructionType, opcode: string, operands: string[] }) => {
    setInstructionType(template.type);
    setOpcode(template.opcode);
    setOperand1(template.operands[0] || '');
    setOperand2(template.operands[1] || '');
    setOperand3(template.operands[2] || '');
  };

  return (
    <div className="pipeline-control-panel">
      <div className="panel-section">
        <h3>Pipeline Control</h3>
        <div className="control-buttons">
          {!isRunning ? (
            <button 
              className="control-button start"
              onClick={startSimulation}
              disabled={instructions.length === 0}
            >
              <span className="button-icon">▶</span>
              Start Simulation
            </button>
          ) : (
            <button 
              className="control-button pause"
              onClick={pauseSimulation}
            >
              <span className="button-icon">⏸</span>
              Pause Simulation
            </button>
          )}
          <button 
            className="control-button step"
            onClick={stepSimulation}
            disabled={isRunning || instructions.length === 0}
          >
            <span className="button-icon">⏯</span>
            Step Forward
          </button>
          <button 
            className="control-button reset"
            onClick={resetSimulation}
          >
            <span className="button-icon">⟲</span>
            Reset Simulation
          </button>
        </div>
        
        <div className="speed-control">
          <label>Simulation Speed:</label>
          <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.5" 
            value={speed} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            disabled={isRunning}
          />
          <span className="speed-value">{speed}x</span>
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Pipeline Settings</h3>
        <div className="settings-grid">
          {/* Basic Hazard Settings */}
          <div className="settings-group">
            <h4>Basic Settings</h4>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="hazard-detection" 
                checked={hazardDetection} 
                onChange={toggleHazardDetection}
                disabled={isRunning}
              />
              <label htmlFor="hazard-detection">Hazard Detection</label>
              <div className="setting-description">
                Detect and handle pipeline hazards
              </div>
            </div>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="data-forwarding" 
                checked={dataForwarding} 
                onChange={toggleDataForwarding}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="data-forwarding">Data Forwarding</label>
              <div className="setting-description">
                Forward data from later stages to resolve dependencies
              </div>
            </div>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="branch-prediction" 
                checked={branchPrediction} 
                onChange={toggleBranchPrediction}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="branch-prediction">Branch Prediction</label>
              <div className="setting-description">
                Predict branch outcomes to avoid stalls
              </div>
            </div>
          </div>
          
          {/* Advanced Hazard Settings */}
          <div className="settings-group">
            <h4>Advanced Hazard Settings</h4>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="waw-hazard" 
                checked={wawHazardDetection} 
                onChange={toggleWAWHazardDetection}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="waw-hazard">WAW Hazard Detection</label>
              <div className="setting-description">
                Detect Write-After-Write hazards
              </div>
            </div>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="war-hazard" 
                checked={warHazardDetection} 
                onChange={toggleWARHazardDetection}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="war-hazard">WAR Hazard Detection</label>
              <div className="setting-description">
                Detect Write-After-Read hazards
              </div>
            </div>
            <div className="setting-item">
              <label htmlFor="load-use-delay">Load-Use Hazard Delay:</label>
              <input 
                type="number" 
                id="load-use-delay" 
                value={loadUseHazardDelay}
                onChange={handleLoadUseDelayChange}
                min={0}
                max={5}
                disabled={isRunning || !hazardDetection}
              />
              <div className="setting-description">
                Cycles to stall after a load instruction when its result is used
              </div>
            </div>
          </div>
          
          {/* Structural Hazard Settings */}
          <div className="settings-group">
            <h4>Structural Hazard Settings</h4>
            <div className="setting-description">
              Configure which functional units are shared
            </div>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="shared-alu" 
                checked={structuralHazardSettings.sharedALU} 
                onChange={(e) => handleStructuralHazardChange('sharedALU', e.target.checked)}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="shared-alu">Shared ALU</label>
            </div>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="shared-memory" 
                checked={structuralHazardSettings.sharedMemory} 
                onChange={(e) => handleStructuralHazardChange('sharedMemory', e.target.checked)}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="shared-memory">Shared Memory Unit</label>
            </div>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="shared-registers" 
                checked={structuralHazardSettings.sharedRegisters} 
                onChange={(e) => handleStructuralHazardChange('sharedRegisters', e.target.checked)}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="shared-registers">Shared Register File</label>
            </div>
            <div className="setting-item">
              <input 
                type="checkbox" 
                id="limited-multiplier" 
                checked={structuralHazardSettings.limitedMultiplier} 
                onChange={(e) => handleStructuralHazardChange('limitedMultiplier', e.target.checked)}
                disabled={isRunning || !hazardDetection}
              />
              <label htmlFor="limited-multiplier">Limited Multiplier Units</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="panel-section">
        <h3>Instructions</h3>
        <div className="instructions-control">
          <div className="current-instructions">
            <h4>Current Instruction Set</h4>
            <div className="instructions-list">
              {instructions.length === 0 ? (
                <div className="no-instructions">No instructions added yet.</div>
              ) : (
                <div className="instructions-table">
                  <div className="table-header">
                    <div className="header-cell">#</div>
                    <div className="header-cell">Instruction</div>
                    <div className="header-cell">Actions</div>
                  </div>
                  {instructions.map((instruction, index) => (
                    <div className="table-row" key={instruction.id}>
                      <div className="table-cell">{index + 1}</div>
                      <div className="table-cell instruction-text">
                        {instruction.opcode} {instruction.operands.join(', ')}
                      </div>
                      <div className="table-cell">
                        <button 
                          className="remove-button"
                          onClick={() => removeInstruction(instruction.id)}
                          disabled={isRunning}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="add-instruction">
            <h4>Add New Instruction</h4>
            <form onSubmit={handleAddInstruction}>
              <div className="form-group">
                <label htmlFor="instruction-type">Type:</label>
                <select 
                  id="instruction-type" 
                  value={instructionType}
                  onChange={(e) => setInstructionType(e.target.value as InstructionType)}
                  disabled={isRunning}
                >
                  <option value="ADD">Arithmetic</option>
                  <option value="LOAD">Load</option>
                  <option value="STORE">Store</option>
                  <option value="BRANCH">Branch</option>
                  <option value="JUMP">Jump</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="instruction-opcode">Opcode:</label>
                <input 
                  type="text" 
                  id="instruction-opcode" 
                  placeholder="e.g., ADD, SUB, LW"
                  value={opcode}
                  onChange={(e) => setOpcode(e.target.value)}
                  disabled={isRunning}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="instruction-operand1">Operand 1:</label>
                <input 
                  type="text" 
                  id="instruction-operand1" 
                  placeholder="e.g., R1, 0(R2)"
                  value={operand1}
                  onChange={(e) => setOperand1(e.target.value)}
                  disabled={isRunning}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="instruction-operand2">Operand 2:</label>
                <input 
                  type="text" 
                  id="instruction-operand2" 
                  placeholder="e.g., R2, 4(R3)"
                  value={operand2}
                  onChange={(e) => setOperand2(e.target.value)}
                  disabled={isRunning}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="instruction-operand3">Operand 3:</label>
                <input 
                  type="text" 
                  id="instruction-operand3" 
                  placeholder="e.g., R3, LABEL"
                  value={operand3}
                  onChange={(e) => setOperand3(e.target.value)}
                  disabled={isRunning}
                />
              </div>
              
              <button 
                type="submit" 
                className="add-button"
                disabled={isRunning || !opcode || !operand1}
              >
                Add Instruction
              </button>
            </form>
          </div>
        </div>
        
        <div className="instruction-templates">
          <h4>Predefined Instruction Sequences</h4>
          <div className="templates-grid">
            <button 
              className="template-button"
              onClick={addDataHazardSequence}
              disabled={isRunning}
            >
              Data Hazard Demo
            </button>
            <button 
              className="template-button"
              onClick={addControlHazardSequence}
              disabled={isRunning}
            >
              Control Hazard Demo
            </button>
            <button 
              className="template-button"
              onClick={addStructuralHazardSequence}
              disabled={isRunning}
            >
              Structural Hazard Demo
            </button>
            <button 
              className="template-button"
              onClick={addWAWHazardSequence}
              disabled={isRunning}
            >
              WAW Hazard Demo
            </button>
            <button 
              className="template-button"
              onClick={addWARHazardSequence}
              disabled={isRunning}
            >
              WAR Hazard Demo
            </button>
            <button 
              className="template-button"
              onClick={addLoadUseHazardSequence}
              disabled={isRunning}
            >
              Load-Use Hazard Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineControlPanel; 