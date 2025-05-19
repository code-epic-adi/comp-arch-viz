import React from 'react';
import { useDataFlowStore, MemoryComponent } from '../../store/dataFlowStore';

const DataFlow: React.FC = () => {
  const registers = useDataFlowStore(state => state.registers);
  const cache = useDataFlowStore(state => state.cache);
  const ram = useDataFlowStore(state => state.ram);
  const disk = useDataFlowStore(state => state.disk);
  
  // Define components and their details
  const components = [
    { id: 'register', label: 'Registers', color: '#FF5722', dataCount: registers.length },
    { id: 'cache', label: 'Cache', color: '#2196F3', dataCount: cache.length },
    { id: 'ram', label: 'RAM', color: '#4CAF50', dataCount: ram.length },
    { id: 'disk', label: 'Hard Disk', color: '#9C27B0', dataCount: disk.length }
  ];
  
  // Check if there's any moving data
  const hasMovingData = [
    ...registers.filter(item => item.isMoving),
    ...cache.filter(item => item.isMoving),
    ...ram.filter(item => item.isMoving),
    ...disk.filter(item => item.isMoving)
  ].length > 0;

  return (
    <div className="card">
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        color: '#333'
      }}>
        Data Flow Visualization
      </h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 0',
        position: 'relative',
        height: '100px'
      }}>
        {components.map((component, index) => (
          <React.Fragment key={component.id}>
            {/* Component Node */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: component.color,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                position: 'relative'
              }}>
                {component.dataCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#FF5722',
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {component.dataCount}
                  </div>
                )}
                {component.label.slice(0, 3)}
              </div>
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.75rem',
                color: '#666'
              }}>
                {component.label}
              </div>
            </div>
            
            {/* Connection Line */}
            {index < components.length - 1 && (
              <div style={{ 
                height: '2px', 
                backgroundColor: '#ccc',
                flex: 1,
                margin: '0 0.5rem',
                position: 'relative',
                top: '-15px'
              }}>
                {hasMovingData && (
                  <div style={{
                    position: 'absolute',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: 'gold',
                    border: '2px solid orange',
                    top: '-6px',
                    animation: 'dataDot 3s infinite'
                  }}></div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <style>
        {`
          @keyframes dataDot {
            0% { transform: translateX(0); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default DataFlow; 