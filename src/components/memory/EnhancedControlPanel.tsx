import React, { useState } from 'react';
import { useDataFlowStore } from '../../store/dataFlowStore';
import { simulations } from '../../utils/simulationUtils';

const EnhancedControlPanel: React.FC = () => {
  const [selectedSimulation, setSelectedSimulation] = useState<string>('cacheHit');
  
  const {
    activeSimulation,
    isPaused,
    simulationSpeed,
    addDataItem,
    moveData,
    resetAll,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    setSimulationSpeed
  } = useDataFlowStore();
  
  const handleStartSimulation = async () => {
    if (activeSimulation) return;
    
    startSimulation(selectedSimulation);
    
    try {
      switch (selectedSimulation) {
        case 'cacheHit':
          await simulations.cacheHit(addDataItem, moveData, simulationSpeed);
          break;
        case 'cacheMiss':
          await simulations.cacheMiss(addDataItem, moveData, simulationSpeed);
          break;
        case 'pageFault':
          await simulations.pageFault(addDataItem, moveData, simulationSpeed);
          break;
        case 'writeBack':
          await simulations.writeBack(addDataItem, moveData, simulationSpeed);
          break;
      }
      
      // Automatically stop after completion
      stopSimulation();
    } catch (error) {
      console.error('Simulation error:', error);
      stopSimulation();
    }
  };
  
  const simulationOptions = [
    { id: 'cacheHit', label: 'Cache Hit' },
    { id: 'cacheMiss', label: 'Cache Miss' },
    { id: 'pageFault', label: 'Page Fault' },
    { id: 'writeBack', label: 'Write Back' }
  ];
  
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' }
  ];
  
  return (
    <div className="control-panel-container">
      <div className="control-grid">
        <div className="control-field">
          <label className="control-label">Select Simulation</label>
          <select
            className="control-select"
            value={selectedSimulation}
            onChange={(e) => setSelectedSimulation(e.target.value)}
            disabled={!!activeSimulation}
          >
            {simulationOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-field">
          <label className="control-label">Simulation Speed</label>
          <select
            className="control-select"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          >
            {speedOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="control-actions">
        {!activeSimulation ? (
          <button
            onClick={handleStartSimulation}
            className="control-button primary"
          >
            ▶️ Start Simulation
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={resumeSimulation}
                className="control-button primary"
              >
                ▶️ Resume
              </button>
            ) : (
              <button
                onClick={pauseSimulation}
                className="control-button primary"
              >
                ⏸️ Pause
              </button>
            )}
            
            <button
              onClick={stopSimulation}
              className="control-button danger"
            >
              ⏹️ Stop
            </button>
          </>
        )}
        
        <button
          onClick={resetAll}
          className="control-button secondary"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default EnhancedControlPanel;
