import React, { useState } from 'react';
import DataFlow from '../visualization/DataFlow';
import MemoryMetrics from './MemoryMetrics';
import MemoryEducation from './MemoryEducation';
import EnhancedControlPanel from './EnhancedControlPanel';
import EnhancedHardwareComponents from './EnhancedHardwareComponents';
import MemoryInterconnections from './MemoryInterconnections';
import './MemoryComponents.css';

const MemoryHierarchy: React.FC = () => {
  const [showGuide, setShowGuide] = useState<boolean>(true);
  
  // Save that user has seen the guide
  const dismissGuide = () => {
    localStorage.setItem('hasSeenMemoryGuide', 'true');
    setShowGuide(false);
  };
  
  return (
    <div className="memory-hierarchy-container">
      {/* Header Section */}
      <div className="memory-header">
        <h2 className="memory-title">Memory Hierarchy</h2>
        <p className="memory-subtitle">Explore how data flows through different levels of computer memory</p>
      </div>
      
      {/* Welcome Guide */}
      {showGuide && (
        <div className="welcome-guide">
          <div className="guide-content">
            <h3>Welcome to the Memory Hierarchy Explorer!</h3>
            <p>This interactive tool helps you understand how computer memory works across different levels - from fast CPU registers to slower storage devices.</p>
            <ul className="guide-features">
              <li><strong>Visualize</strong> - See data flow between memory levels in real-time</li>
              <li><strong>Analyze</strong> - View performance metrics that update as you make changes</li>
              <li><strong>Learn</strong> - Access educational resources about memory concepts</li>
            </ul>
            <div className="guide-actions">
              <button className="button button-primary" onClick={dismissGuide}>Get Started</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="memory-grid">
        {/* Main Visualization Section */}
        <div className="memory-section visualization-section">
          <div className="section-header">
            <h3 className="section-title">Memory Hierarchy Visualization</h3>
            <p className="section-description">See how data flows between different memory levels</p>
          </div>
          <div className="visualization-container">
            <DataFlow />
          </div>
        </div>
        
        {/* Control Panel Section */}
        <div className="memory-section control-section">
          <div className="section-header">
            <h3 className="section-title">Data Flow Simulation</h3>
            <p className="section-description">Simulate how data moves through the memory hierarchy</p>
          </div>
          <EnhancedControlPanel />
        </div>
        
        {/* Hardware Components Section - Moved directly below Control Panel */}
        <div className="memory-section components-section">
          <div className="section-header">
            <h3 className="section-title">Memory Components State</h3>
            <p className="section-description">Current data contents of each memory layer</p>
          </div>
          <EnhancedHardwareComponents />
        </div>
        
        {/* Memory Performance Section */}
        <div className="memory-section metrics-section">
          <div className="section-header">
            <h3 className="section-title">Memory Performance</h3>
            <p className="section-description">Memory access times for different components</p>
          </div>
          <MemoryMetrics />
        </div>
        
        {/* Memory Interconnections Section */}
        <div className="memory-section interconnections-section">
          <div className="section-header">
            <h3 className="section-title">Memory Hierarchy Relationships</h3>
            <p className="section-description">How components interact during memory operations</p>
          </div>
          <MemoryInterconnections />
        </div>
        
        {/* Education Section */}
        <div className="memory-section education-section">
          <div className="section-header">
            <h3 className="section-title">Memory Concepts</h3>
            <p className="section-description">Learn about key memory hierarchy concepts</p>
          </div>
          <MemoryEducation />
        </div>
      </div>
      
      {/* Quick Help Footer */}
      <div className="quick-help-footer">
        <div className="help-tips">
          <div className="help-item">
            <span className="help-icon">💡</span>
            <span className="help-text">Run simulations to see data flow through the memory hierarchy</span>
          </div>
          <div className="help-item">
            <span className="help-icon">📊</span>
            <span className="help-text">Watch memory components update in real-time</span>
          </div>
          <div className="help-item">
            <span className="help-icon">🔄</span>
            <span className="help-text">Reset components to try different scenarios</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryHierarchy; 