import React from 'react';
import { useDataFlowStore } from '../../store/dataFlowStore';

const MemoryMetrics: React.FC = () => {
  const { activeSimulation } = useDataFlowStore();
  
  // Access time calculations (in ns)
  const getAccessTimeForSimulation = () => {
    switch(activeSimulation) {
      case 'cacheHit': return '2 ns';
      case 'cacheMiss': return '100 ns';
      case 'pageFault': return '10 ms';
      case 'writeBack': return '2-100 ns';
      default: return 'N/A';
    }
  };
  
  return (
    <div className="memory-metrics">
      <div className="metric-card wide">
        <div className="metric-header">
          <span className="metric-label">Memory Access Times</span>
        </div>
        <div className="access-times">
          <div className="access-time-item">
            <span className="component-name">Registers</span>
            <span className="access-value">~1 ns</span>
          </div>
          <div className="access-time-item">
            <span className="component-name">Cache</span>
            <span className="access-value">2-10 ns</span>
          </div>
          <div className="access-time-item">
            <span className="component-name">RAM</span>
            <span className="access-value">50-100 ns</span>
          </div>
          <div className="access-time-item">
            <span className="component-name">Disk</span>
            <span className="access-value">5-10 ms</span>
          </div>
        </div>
        <div className="current-access">
          <span>Current Access: </span>
          <span className="current-access-value">{getAccessTimeForSimulation()}</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryMetrics; 