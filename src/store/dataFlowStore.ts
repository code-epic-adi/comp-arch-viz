import { create } from 'zustand';

// Types for memory components
export type MemoryComponent = 'register' | 'cache' | 'ram' | 'disk';

// Data representation for visualization
export interface DataItem {
  id: string;
  value: string;
  location: MemoryComponent;
  isMoving?: boolean;
  source?: MemoryComponent;
  destination?: MemoryComponent;
}

// Interface for store state
interface DataFlowState {
  // Data in different components
  registers: DataItem[];
  cache: DataItem[];
  ram: DataItem[];
  disk: DataItem[];
  
  // Active simulation
  activeSimulation: string | null;
  simulationSpeed: number;
  isPaused: boolean;
  
  // Actions
  addDataItem: (item: DataItem) => void;
  moveData: (id: string, source: MemoryComponent, destination: MemoryComponent) => void;
  removeDataItem: (id: string) => void;
  startSimulation: (name: string) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  resetAll: () => void;
}

// Create store
export const useDataFlowStore = create<DataFlowState>((set) => ({
  registers: [],
  cache: [],
  ram: [],
  disk: [],
  
  activeSimulation: null,
  simulationSpeed: 1,
  isPaused: false,
  
  addDataItem: (item: DataItem) => set((state) => {
    // Add to the correct location
    const location = item.location;
    const targetArray = state[location === 'register' ? 'registers' : location] as DataItem[];
    
    return {
      [location === 'register' ? 'registers' : location]: [...targetArray, item]
    };
  }),
  
  moveData: (id: string, source: MemoryComponent, destination: MemoryComponent) => set((state) => {
    // Find the item
    const sourceArray = source === 'register' ? state.registers : state[source] as DataItem[];
    const item = sourceArray.find((item: DataItem) => item.id === id);
    
    if (!item) return state;
    
    // Mark it as moving
    const updatedItem = {
      ...item,
      isMoving: true,
      source,
      destination,
      location: destination
    };
    
    const destArray = destination === 'register' ? state.registers : state[destination] as DataItem[];
    
    // Remove from source and add to destination
    return {
      [source === 'register' ? 'registers' : source]: sourceArray.filter((item: DataItem) => item.id !== id),
      [destination === 'register' ? 'registers' : destination]: [...destArray, updatedItem]
    };
  }),
  
  removeDataItem: (id: string) => set((state) => {
    // Find and remove from all locations
    return {
      registers: state.registers.filter(item => item.id !== id),
      cache: state.cache.filter(item => item.id !== id),
      ram: state.ram.filter(item => item.id !== id),
      disk: state.disk.filter(item => item.id !== id)
    };
  }),
  
  startSimulation: (name: string) => set({
    activeSimulation: name,
    isPaused: false
  }),
  
  pauseSimulation: () => set({ isPaused: true }),
  
  resumeSimulation: () => set({ isPaused: false }),
  
  stopSimulation: () => set({
    activeSimulation: null,
    isPaused: false
  }),
  
  setSimulationSpeed: (speed: number) => set({ simulationSpeed: speed }),
  
  resetAll: () => set({
    registers: [],
    cache: [],
    ram: [],
    disk: [],
    activeSimulation: null,
    isPaused: false
  })
})); 