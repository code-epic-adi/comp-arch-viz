import React, { useState } from 'react';
import { useDataFlowStore } from '../../store/dataFlowStore';

const MemoryInterconnections: React.FC = () => {
  const activeSimulation = useDataFlowStore(state => state.activeSimulation);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  
  // Function to highlight a specific operation path
  const highlightOperation = (operation: string) => {
    if (activeOperation === operation) {
      setActiveOperation(null); // Toggle off if already active
    } else {
      setActiveOperation(operation);
    }
  };
  
  // Get class name based on whether path is active
  const getPathClassName = (path: string) => {
    return activeOperation === path ? 'operation-path active-path' : 'operation-path';
  };
  
  // Get class name for component based on active operation
  const getComponentClassName = (component: string) => {
    const baseClass = `diagram-component ${component}`;
    
    if (!activeOperation) return baseClass;
    
    switch (component) {
      case 'cpu':
        return `${baseClass} ${activeOperation ? 'active-component' : ''}`;
      case 'cache':
        return `${baseClass} ${activeOperation ? 'active-component' : ''}`;
      case 'ram':
        return `${baseClass} ${['cache-miss', 'page-fault', 'write-back'].includes(activeOperation || '') ? 'active-component' : ''}`;
      case 'disk':
        return `${baseClass} ${activeOperation === 'page-fault' ? 'active-component' : ''}`;
      default:
        return baseClass;
    }
  };
  
  // Get class name for diagram arrows based on active operation
  const getArrowClassName = (arrowType: string) => {
    const baseClass = `diagram-arrow ${arrowType}`;
    
    if (!activeOperation) return baseClass;
    
    switch (activeOperation) {
      case 'cache-hit':
        return arrowType === 'right' || arrowType === 'up right-offset' 
          ? `${baseClass} active-arrow` : baseClass;
      case 'cache-miss':
        return arrowType === 'right' || arrowType === 'down left-offset' || arrowType === 'up right-offset'
          ? `${baseClass} active-arrow` : baseClass;
      case 'page-fault':
        return arrowType === 'right' || arrowType === 'down left-offset' || arrowType === 'horizontal bidirectional'
          ? `${baseClass} active-arrow` : baseClass;
      case 'write-back':
        return arrowType === 'right' || arrowType === 'down left-offset'
          ? `${baseClass} active-arrow` : baseClass;
      default:
        return baseClass;
    }
  };
  
  return (
    <div className="memory-interconnections-container">
      <div className="interconnections-grid">
        <div className="interconnection-diagram">
          <div className="diagram-title">Memory Access Patterns</div>
          
          <div className="diagram-box">
            <div className="diagram-row">
              <div className={getComponentClassName('cpu')}>
                <div className="component-label">CPU</div>
                <div className="component-icon">CPU</div>
              </div>
              <div className={getArrowClassName('right')}>
                <div className="arrow-label">Load/Store Instructions</div>
                <div className="arrow-line"></div>
                <div className="arrow-head right">→</div>
              </div>
              <div className={getComponentClassName('cache')}>
                <div className="component-label">Cache</div>
                <div className="component-icon">L1/L2</div>
              </div>
            </div>
            
            <div className="diagram-row">
              <div className={getArrowClassName('down left-offset')}>
                <div className="arrow-label">Cache Miss</div>
                <div className="arrow-line"></div>
                <div className="arrow-head">↓</div>
              </div>
              
              <div className={getArrowClassName('up right-offset')}>
                <div className="arrow-label">Cache Hit</div>
                <div className="arrow-line"></div>
                <div className="arrow-head">↑</div>
              </div>
            </div>
            
            <div className="diagram-row">
              <div className={getComponentClassName('ram')}>
                <div className="component-label">RAM</div>
                <div className="component-icon">RAM</div>
              </div>
              <div className={getArrowClassName('horizontal bidirectional')}>
                <div className="arrow-label">Page In/Out</div>
                <div className="arrow-line"></div>
                <div className="arrow-head left">←</div>
                <div className="arrow-head right">→</div>
              </div>
              <div className={getComponentClassName('disk')}>
                <div className="component-label">Disk</div>
                <div className="component-icon">HDD</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="memory-operations">
          <div className="operation-title">Common Memory Operations</div>
          <div className="operation-grid">
            <div 
              className={`operation-item ${activeOperation === 'cache-hit' ? 'active-operation' : ''}`}
              onClick={() => highlightOperation('cache-hit')}
            >
              <div className="operation-name">Cache Hit</div>
              <div className="operation-description">
                Data found in cache, quickly returned to CPU
              </div>
              <div className={getPathClassName('cache-hit')}>CPU → Cache → CPU</div>
              <div className="operation-metrics">
                <span className="metric-label">Latency:</span>
                <span className="metric-value">1-10 cycles</span>
              </div>
            </div>
            
            <div 
              className={`operation-item ${activeOperation === 'cache-miss' ? 'active-operation' : ''}`}
              onClick={() => highlightOperation('cache-miss')}
            >
              <div className="operation-name">Cache Miss</div>
              <div className="operation-description">
                Data not in cache, must fetch from RAM
              </div>
              <div className={getPathClassName('cache-miss')}>CPU → Cache → RAM → Cache → CPU</div>
              <div className="operation-metrics">
                <span className="metric-label">Latency:</span>
                <span className="metric-value">100-300 cycles</span>
              </div>
            </div>
            
            <div 
              className={`operation-item ${activeOperation === 'page-fault' ? 'active-operation' : ''}`}
              onClick={() => highlightOperation('page-fault')}
            >
              <div className="operation-name">Page Fault</div>
              <div className="operation-description">
                Data not in RAM, must fetch from disk
              </div>
              <div className={getPathClassName('page-fault')}>CPU → Cache → RAM → Disk → RAM → Cache → CPU</div>
              <div className="operation-metrics">
                <span className="metric-label">Latency:</span>
                <span className="metric-value">Millions of cycles</span>
              </div>
            </div>
            
            <div 
              className={`operation-item ${activeOperation === 'write-back' ? 'active-operation' : ''}`}
              onClick={() => highlightOperation('write-back')}
            >
              <div className="operation-name">Write Back</div>
              <div className="operation-description">
                Modified data in cache written back to RAM
              </div>
              <div className={getPathClassName('write-back')}>CPU → Cache → RAM</div>
              <div className="operation-metrics">
                <span className="metric-label">Latency:</span>
                <span className="metric-value">50-200 cycles</span>
              </div>
            </div>
          </div>
          
          <div className="operation-instruction">
            Click on an operation to highlight its data path in the diagram above
          </div>
        </div>
        
        <div className="simulation-status">
          {activeSimulation ? (
            <div className="active-simulation">
              <div className="status-label">Active Simulation:</div>
              <div className="status-value">{activeSimulation}</div>
              <div className="status-indicator active"></div>
              <div className="simulation-tip">
                Watch the diagram above to see data flow through the memory hierarchy
              </div>
            </div>
          ) : (
            <div className="simulation-hint">
              Start a simulation above to see how data flows through memory components
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryInterconnections;
