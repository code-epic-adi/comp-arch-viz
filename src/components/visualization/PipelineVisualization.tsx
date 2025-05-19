import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore, Instruction, PipelineStage, HazardType } from '../../store/pipelineStore';

// Colors for different hazard types
const hazardColors: Record<string, string> = {
  'DATA': '#f87171',         // Red for data hazards
  'CONTROL': '#fb923c',      // Orange for control hazards
  'STRUCTURAL': '#fbbf24',   // Yellow for structural hazards
  'NONE': 'transparent',
  'FORWARDED': '#38bdf8',    // Blue for data forwarding
  'PREDICTED': '#a78bfa',    // Purple for branch prediction
  'STALLED': '#ef4444'       // Bright red for stalled pipelines
};

// Animation variants for pipeline elements
const pipelineBlockVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    transition: { duration: 0.2 } 
  }
};

const activeStageVariants = {
  inactive: { 
    backgroundColor: "#f8fafc",
    borderColor: "#ddd",
    scale: 1
  },
  active: { 
    backgroundColor: "#ecfdf5",
    borderColor: "#10b981",
    scale: 1.05,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30
    }
  }
};

const PipelineVisualization: React.FC = () => {
  const {
    instructions,
    currentCycle,
    stageOccupancy,
    stats,
    hazardDetection,
    dataForwarding,
    branchPrediction
  } = usePipelineStore();

  // Track visualization container size
  const containerRef = useRef<HTMLDivElement>(null);

  // Get total instruction count for sizing
  const totalInstructions = instructions.length;
  
  // Pipeline stages
  const stages: PipelineStage[] = ['IF', 'ID', 'EX', 'MEM', 'WB'];
  
  return (
    <div className="pipeline-visualization" ref={containerRef}>
      <motion.div 
        className="pipeline-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3>5-Stage Pipeline Visualization</h3>
        <motion.div 
          className="cycle-counter"
          animate={{ scale: [1, 1.1, 1], backgroundColor: ["#4a6fa5", "#3a5f95", "#4a6fa5"] }}
          transition={{ duration: 0.5, times: [0, 0.5, 1], repeat: 0, repeatDelay: 0 }}
          key={currentCycle} // Force re-render on cycle change
        >
          Cycle: {currentCycle}
        </motion.div>
      </motion.div>
      
      {/* Color Legend */}
      <div className="hazard-legend">
        <h4>Pipeline Event Legend</h4>
        <div className="legend-items">
          {Object.entries(hazardColors).filter(([key]) => key !== 'NONE').map(([type, color]) => (
            <div key={type} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: color }}></div>
              <div className="legend-label">
                {type === 'DATA' && 'Data Hazard'} 
                {type === 'CONTROL' && 'Control Hazard'}
                {type === 'STRUCTURAL' && 'Structural Hazard'}
                {type === 'FORWARDED' && 'Data Forwarding'}
                {type === 'PREDICTED' && 'Branch Prediction'}
                {type === 'STALLED' && 'Pipeline Stall'}
              </div>
            </div>
          ))}
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#6ea8fe' }}></div>
            <div className="legend-label">Normal Execution</div>
          </div>
        </div>
      </div>

      <div className="pipeline-container">
        {/* Stage Headers */}
        <div className="pipeline-stages">
          {stages.map((stage, index) => (
            <motion.div 
              key={stage} 
              className="pipeline-stage-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="stage-name">{stage}</div>
              <div className="stage-description">
                {stage === 'IF' && 'Instruction Fetch'}
                {stage === 'ID' && 'Instruction Decode'}
                {stage === 'EX' && 'Execute'}
                {stage === 'MEM' && 'Memory Access'}
                {stage === 'WB' && 'Write Back'}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Pipeline Grid */}
        <div className="pipeline-grid">
          {/* Timeline - Shows cycle numbers */}
          <div className="pipeline-timeline">
            {Array.from({ length: Math.max(currentCycle, 10) }, (_, i) => (
              <motion.div 
                key={i} 
                className="timeline-cell"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.02 * i }}
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="instructions-container">
            {instructions.map((instruction, index) => (
              <motion.div 
                key={instruction.id} 
                className="instruction-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="instruction-label">
                  {instruction.opcode} {instruction.operands.join(', ')}
                </div>
                
                <div className="instruction-timeline">
                  {/* Render blocks for each stage the instruction has been in */}
                  <AnimatePresence>
                    {stages.map(stage => {
                      const stageInfo = instruction.stages[stage];
                      if (!stageInfo) return null;
                      
                      const startOffset = stageInfo.cycleStart - 1;
                      const duration = stageInfo.cycleEnd - stageInfo.cycleStart + 1;
                      
                      return (
                        <motion.div
                          key={`${instruction.id}-${stage}`}
                          className={`pipeline-block ${stageInfo.stalled ? 'stalled' : ''}`}
                          variants={pipelineBlockVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          data-hazard={stageInfo.hazard}
                          style={{
                            left: `${startOffset * 40}px`,
                            width: `${duration * 40 - 4}px`,
                            backgroundColor: stageInfo.hazard !== 'NONE' ? hazardColors[stageInfo.hazard] : undefined
                          }}
                        >
                          {stage}
                          {stageInfo.stalled && (
                            <motion.div 
                              className="stall-indicator"
                              animate={{ 
                                rotate: [0, 15, -15, 0],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                repeatType: "reverse" 
                              }}
                            >
                              ⚠
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pipeline Statistics */}
      <motion.div 
        className="pipeline-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4>Performance Statistics</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">CPI:</div>
            <motion.div 
              className="stat-value"
              key={stats.cpi.toFixed(2)}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              {stats.cpi.toFixed(2)}
            </motion.div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Instructions:</div>
            <motion.div 
              className="stat-value"
              key={stats.instructionsCompleted}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              {stats.instructionsCompleted} / {totalInstructions}
            </motion.div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Cycles:</div>
            <motion.div 
              className="stat-value"
              key={stats.totalCycles}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              {stats.totalCycles}
            </motion.div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Stall Cycles:</div>
            <motion.div 
              className="stat-value"
              key={stats.stallCycles}
              animate={{ scale: [1, 1.1, 1], color: stats.stallCycles > 0 ? ["#2a3f5f", "#ef4444", "#2a3f5f"] : "#2a3f5f" }}
              transition={{ duration: 0.8 }}
            >
              {stats.stallCycles}
            </motion.div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Data Hazards:</div>
            <motion.div 
              className="stat-value"
              key={stats.dataDependencies}
              animate={{ scale: [1, 1.1, 1], color: stats.dataDependencies > 0 ? ["#2a3f5f", "#f87171", "#2a3f5f"] : "#2a3f5f" }}
              transition={{ duration: 0.8 }}
            >
              {stats.dataDependencies}
            </motion.div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Control Hazards:</div>
            <motion.div 
              className="stat-value"
              key={stats.controlHazards}
              animate={{ scale: [1, 1.1, 1], color: stats.controlHazards > 0 ? ["#2a3f5f", "#fb923c", "#2a3f5f"] : "#2a3f5f" }}
              transition={{ duration: 0.8 }}
            >
              {stats.controlHazards}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Currently Active Stages */}
      <div className="active-stages">
        <h4>Active Pipeline Stages</h4>
        <div className="stages-grid">
          {stages.map(stage => (
            <motion.div 
              key={stage} 
              className={`stage-box ${stageOccupancy[stage] ? 'active' : 'empty'}`}
              variants={activeStageVariants}
              animate={stageOccupancy[stage] ? "active" : "inactive"}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="stage-title">{stage}</div>
              <div className="stage-content">
                {stageOccupancy[stage] ? (
                  <motion.div 
                    className="instruction-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    key={stageOccupancy[stage]?.id}
                  >
                    {stageOccupancy[stage]?.opcode} {stageOccupancy[stage]?.operands.join(', ')}
                  </motion.div>
                ) : (
                  <div className="empty-stage">Empty</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Hazard and Forwarding Settings Status */}
      <div className="pipeline-settings">
        <motion.div 
          className={`setting-item ${hazardDetection ? 'enabled' : 'disabled'}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="setting-icon">🚧</div>
          <div className="setting-text">Hazard Detection</div>
        </motion.div>
        <motion.div 
          className={`setting-item ${dataForwarding ? 'enabled' : 'disabled'}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="setting-icon">⏩</div>
          <div className="setting-text">Data Forwarding</div>
        </motion.div>
        <motion.div 
          className={`setting-item ${branchPrediction ? 'enabled' : 'disabled'}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="setting-icon">🔮</div>
          <div className="setting-text">Branch Prediction</div>
        </motion.div>
      </div>
    </div>
  );
};

export default PipelineVisualization; 