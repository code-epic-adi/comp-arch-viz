import React, { useState } from 'react';
import PipelineVisualization from './components/visualization/PipelineVisualization';
import PipelineControlPanel from './components/visualization/PipelineControlPanel';
import PipelineInfoPanel from './components/visualization/PipelineInfoPanel';
import MemoryHierarchy from './components/memory/MemoryHierarchy';
import './components/visualization/PipelineVisualization.css';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'memory' | 'pipeline'>('memory');
  
  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div className="title-area">
            <div className="icon-highlight">📟</div>
            <h1 className="title">Computer Architecture Visualization</h1>
          </div>
          <a 
            href="https://code-epic-adi.netlify.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            ℹ️ About
          </a>
        </div>
      </header>
      
      <div className="tab-navigation container">
        <button 
          className={`tab-button ${activeTab === 'memory' ? 'active' : ''}`} 
          onClick={() => setActiveTab('memory')}
        >
          Memory Hierarchy
        </button>
        <button 
          className={`tab-button ${activeTab === 'pipeline' ? 'active' : ''}`} 
          onClick={() => setActiveTab('pipeline')}
        >
          CPU Pipeline
        </button>
      </div>
      
      <main className="container main-content">
        {activeTab === 'memory' && (
          <MemoryHierarchy />
        )}
        
        {activeTab === 'pipeline' && (
          <>
            <div className="grid-layout">
              <div>
                <PipelineVisualization />
              </div>
              <div>
                <PipelineControlPanel />
              </div>
            </div>
            
            <div className="pipeline-info-container">
              <PipelineInfoPanel />
            </div>
          </>
        )}
      </main>
      
      <footer className="footer container">
        © {new Date().getFullYear()} Computer Architecture and Organization Project. 
        Developed as an educational visualization tool.
      </footer>
    </div>
  );
}

export default App;
