import { DataItem, MemoryComponent } from "../store/dataFlowStore";

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Generate a random hexadecimal value
export const generateHexValue = (length: number = 8): string => {
  return '0x' + Array.from({ length }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Simulate delay with configurable duration
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Predefined simulation scenarios
export const simulations = {
  // Cache hit scenario
  cacheHit: async (
    addData: (item: DataItem) => void,
    moveData: (id: string, source: MemoryComponent, destination: MemoryComponent) => void,
    speed: number
  ) => {
    // Generate data
    const dataId = generateId();
    const dataValue = generateHexValue();
    
    // Add data to cache
    addData({
      id: dataId,
      value: dataValue,
      location: 'cache'
    });
    
    // After delay, move to register
    await delay(2000 / speed);
    moveData(dataId, 'cache', 'register');
    
    return dataId;
  },
  
  // Cache miss scenario
  cacheMiss: async (
    addData: (item: DataItem) => void,
    moveData: (id: string, source: MemoryComponent, destination: MemoryComponent) => void,
    speed: number
  ) => {
    // Generate data
    const dataId = generateId();
    const dataValue = generateHexValue();
    
    // Add data to RAM
    addData({
      id: dataId,
      value: dataValue,
      location: 'ram'
    });
    
    // Move to cache
    await delay(2000 / speed);
    moveData(dataId, 'ram', 'cache');
    
    // Move to register
    await delay(1500 / speed);
    moveData(dataId, 'cache', 'register');
    
    return dataId;
  },
  
  // Page fault scenario
  pageFault: async (
    addData: (item: DataItem) => void,
    moveData: (id: string, source: MemoryComponent, destination: MemoryComponent) => void,
    speed: number
  ) => {
    // Generate data
    const dataId = generateId();
    const dataValue = generateHexValue();
    
    // Add data to disk
    addData({
      id: dataId,
      value: dataValue,
      location: 'disk'
    });
    
    // Move to RAM (page in)
    await delay(3000 / speed);
    moveData(dataId, 'disk', 'ram');
    
    // Move to cache
    await delay(2000 / speed);
    moveData(dataId, 'ram', 'cache');
    
    // Move to register
    await delay(1500 / speed);
    moveData(dataId, 'cache', 'register');
    
    return dataId;
  },
  
  // Write back scenario
  writeBack: async (
    addData: (item: DataItem) => void,
    moveData: (id: string, source: MemoryComponent, destination: MemoryComponent) => void,
    speed: number
  ) => {
    // Generate data
    const dataId = generateId();
    const dataValue = generateHexValue();
    
    // Add data to register (processor generated)
    addData({
      id: dataId,
      value: dataValue,
      location: 'register'
    });
    
    // Write to cache
    await delay(1500 / speed);
    moveData(dataId, 'register', 'cache');
    
    // Write back to RAM
    await delay(2500 / speed);
    moveData(dataId, 'cache', 'ram');
    
    return dataId;
  }
}; 