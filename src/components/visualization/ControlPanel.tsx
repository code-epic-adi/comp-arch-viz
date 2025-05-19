import React, { useState } from 'react';
import { useDataFlowStore } from '../../store/dataFlowStore';
import { simulations } from '../../utils/simulationUtils';

const ControlPanel: React.FC = () => {
  const [selectedSimulation, setSelectedSimulation] = useState<string>('cacheHit');
  const [isExpanded, setIsExpanded] = useState(true);
  
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
    <div className="card">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '0.5rem'
      }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#333' }}>
          Simulation Controls
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '0.5rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#555',
              marginBottom: '0.25rem'
            }}>
              Select Simulation
            </label>
            <select
              value={selectedSimulation}
              onChange={(e) => setSelectedSimulation(e.target.value)}
              disabled={!!activeSimulation}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '0.375rem',
                backgroundColor: 'white'
              }}
            >
              {simulationOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#555',
              marginBottom: '0.25rem'
            }}>
              Simulation Speed
            </label>
            <select
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '0.375rem',
                backgroundColor: 'white'
              }}
            >
              {speedOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            paddingTop: '0.5rem' 
          }}>
            {!activeSimulation ? (
              <button
                onClick={handleStartSimulation}
                className="button button-primary"
                style={{ flex: 1 }}
              >
                ▶️ Start
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button
                    onClick={resumeSimulation}
                    className="button button-primary"
                    style={{ flex: 1 }}
                  >
                    ▶️ Resume
                  </button>
                ) : (
                  <button
                    onClick={pauseSimulation}
                    className="button button-primary"
                    style={{ flex: 1 }}
                  >
                    ⏸️ Pause
                  </button>
                )}
                
                <button
                  onClick={stopSimulation}
                  className="button button-danger"
                  style={{ flex: 1 }}
                >
                  ⏹️ Stop
                </button>
              </>
            )}
            
            <button
              onClick={resetAll}
              className="button button-secondary"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 