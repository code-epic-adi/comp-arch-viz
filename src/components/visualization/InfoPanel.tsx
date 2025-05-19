import React from 'react';
import { useDataFlowStore } from '../../store/dataFlowStore';

const InfoPanel: React.FC = () => {
  const activeSimulation = useDataFlowStore(state => state.activeSimulation);
  
  // Simulation explanations
  const simulationInfo = {
    cacheHit: {
      title: 'Cache Hit',
      description: 'A cache hit occurs when the processor requests data that is already present in the cache memory. Since cache memory is much faster than main memory (RAM), this results in a quick data retrieval without having to access slower memory layers.',
      steps: [
        'Processor requests data',
        'Data is found in cache (cache hit)',
        'Data is transferred from cache to CPU register',
        'Operation completes quickly, without accessing RAM'
      ]
    },
    cacheMiss: {
      title: 'Cache Miss',
      description: 'A cache miss happens when the processor requests data that is not present in the cache but exists in RAM. The system must retrieve the data from the slower main memory and load it into the cache before sending it to the CPU registers.',
      steps: [
        'Processor requests data',
        'Data not found in cache (cache miss)',
        'System looks for data in RAM',
        'Data found in RAM is loaded into cache',
        'Data is transferred from cache to CPU register'
      ]
    },
    pageFault: {
      title: 'Page Fault',
      description: 'A page fault occurs when the processor references a memory page that is not currently loaded in RAM. The operating system must load the requested page from disk (secondary storage) into RAM before it can be accessed.',
      steps: [
        'Processor requests data',
        'Data not found in cache or RAM (page fault)',
        'System retrieves data from disk (slow)',
        'Data is loaded from disk into RAM',
        'Data is then loaded from RAM into cache',
        'Finally, data is transferred to CPU register'
      ]
    },
    writeBack: {
      title: 'Write Back',
      description: 'Write back is a caching policy where data is initially written to the cache and only later written to the main memory when the cache line is about to be replaced. This reduces the number of write operations to the slower main memory.',
      steps: [
        'Processor generates data and stores it in register',
        'Data is written to cache memory (fast)',
        'After some time, modified data is written back to RAM',
        'This allows multiple write operations to cache before updating RAM'
      ]
    }
  };
  
  const defaultInfo = {
    title: 'Memory Hierarchy Simulation',
    description: 'This visualization demonstrates how data moves between different components of the memory hierarchy in a computer system. Select a simulation from the control panel to see it in action.',
    steps: [
      'CPU Registers: Fastest but smallest storage, directly accessed by the processor',
      'Cache Memory: Very fast memory that stores recently accessed data',
      'RAM (Main Memory): Larger but slower than cache, holds active programs and data',
      'Hard Disk: Largest but slowest storage, retains data when power is off'
    ]
  };
  
  const info = activeSimulation ? simulationInfo[activeSimulation as keyof typeof simulationInfo] : defaultInfo;
  
  return (
    <div className="card">
      <div className="component-header">
        <div className="component-icon" style={{ backgroundColor: '#034078' }}>
          <span style={{ color: 'white' }}>ℹ️</span>
        </div>
        <h3>{info.title}</h3>
      </div>
      
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        {info.description}
      </p>
      
      <div style={{ backgroundColor: '#f9f9f9', padding: '0.75rem', borderRadius: '0.375rem' }}>
        <h4 style={{ fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>Process:</h4>
        <ul style={{ paddingLeft: '0', listStyleType: 'none' }}>
          {info.steps.map((step, index) => (
            <li 
              key={index}
              style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}
            >
              <span style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '50%',
                backgroundColor: '#034078',
                color: 'white',
                fontSize: '0.75rem',
                marginRight: '0.5rem',
                marginTop: '0.125rem'
              }}>
                {index + 1}
              </span>
              <span style={{ color: '#444' }}>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoPanel; 