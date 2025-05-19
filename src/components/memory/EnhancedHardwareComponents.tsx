import React from 'react';
import { useDataFlowStore } from '../../store/dataFlowStore';

const EnhancedHardwareComponents: React.FC = () => {
  const { activeSimulation, registers, cache, ram, disk } = useDataFlowStore();
  
  // Convert data items to strings for display
  const renderDataValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };
  
  return (
    <div className="enhanced-hardware-components">
      <div className="hardware-components-container">
        <div className="hardware-grid">
          <div className="hardware-item cpu-item">
            <div className="component-header">
              <div className="component-icon cpu-icon">CPU</div>
              <h4>CPU Registers</h4>
            </div>
            <div className="component-data">
              {registers && registers.length > 0 ? (
                <div className="data-content">
                  {registers.map((reg, index) => (
                    <div key={index} className="data-row">
                      <span className="data-label">R{index}:</span>
                      <span className="data-value">{renderDataValue(reg)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No data present</div>
              )}
            </div>
          </div>
          
          <div className="hardware-item cache-item">
            <div className="component-header">
              <div className="component-icon cache-icon">L1/L2</div>
              <h4>Cache Memory</h4>
            </div>
            <div className="component-data">
              {cache && cache.length > 0 ? (
                <div className="data-content">
                  {cache.map((item, index) => (
                    <div key={index} className="data-row">
                      <span className="data-label">Block {index}:</span>
                      <span className="data-value">{renderDataValue(item)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No data present</div>
              )}
            </div>
          </div>
          
          <div className="hardware-item ram-item">
            <div className="component-header">
              <div className="component-icon ram-icon">RAM</div>
              <h4>RAM</h4>
            </div>
            <div className="component-data">
              {ram && ram.length > 0 ? (
                <div className="data-content">
                  {ram.map((item, index) => (
                    <div key={index} className="data-row">
                      <span className="data-label">Addr {index * 4}:</span>
                      <span className="data-value">{renderDataValue(item)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No data present</div>
              )}
            </div>
          </div>
          
          <div className="hardware-item disk-item">
            <div className="component-header">
              <div className="component-icon disk-icon">HDD</div>
              <h4>Hard Disk</h4>
            </div>
            <div className="component-data">
              {disk && disk.length > 0 ? (
                <div className="data-content">
                  {disk.map((item, index) => (
                    <div key={index} className="data-row">
                      <span className="data-label">Block {index}:</span>
                      <span className="data-value">{renderDataValue(item)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No data present</div>
              )}
            </div>
          </div>
        </div>
        
        {!activeSimulation && (
          <div className="hardware-empty-state">
            <p>Run a simulation to see data moving through memory components</p>
            <div className="empty-state-arrow">↑</div>
          </div>
        )}
        
        <div className="hardware-info">
          <div className="info-item">
            <div className="info-icon">CPU</div>
            <span className="info-text">Fastest access (nanoseconds), smallest capacity (bytes)</span>
          </div>
          <div className="info-item">
            <div className="info-icon">L1/L2</div>
            <span className="info-text">Fast access (nanoseconds), small capacity (KB to MB)</span>
          </div>
          <div className="info-item">
            <div className="info-icon">RAM</div>
            <span className="info-text">Medium access (microseconds), medium capacity (GB)</span>
          </div>
          <div className="info-item">
            <div className="info-icon">HDD</div>
            <span className="info-text">Slow access (milliseconds), large capacity (TB)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHardwareComponents;
