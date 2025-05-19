# Computer Architecture Visualization Tool

An interactive educational tool that demonstrates computer architecture concepts through two main modules: Memory Hierarchy and CPU Pipeline.

## Overview

This project provides visual simulations of key computer architecture concepts to help students understand:
1. How data flows between different levels of memory hierarchy
2. How instructions are processed through a CPU pipeline

## Features

### Memory Hierarchy Module

- **Memory Hierarchy Visualization**: Interactive visualization showing data flow between memory levels
- **Data Flow Simulation**: Simulate different memory access patterns with customizable scenarios
- **Memory Components State**: Real-time view of data contents in each memory layer (Registers, Cache, RAM, Disk)
- **Memory Performance**: Display of access times for different memory components
- **Memory Hierarchy Relationships**: Interactive diagram showing how components interact during memory operations
- **Memory Concepts**: Educational content explaining key memory hierarchy concepts with quizzes

### CPU Pipeline Module

- **5-Stage Pipeline Visualization**: Visual representation of the classic 5-stage RISC pipeline (IF, ID, EX, MEM, WB)
- **Pipeline Control Panel**: Controls for executing instructions through the pipeline
- **Pipeline Information Panel**: Detailed information about pipeline execution and hazards
- **Hazard Detection**: Visualization of data, control, and structural hazards
- **Performance Statistics**: Real-time metrics on pipeline performance

## Technologies Used

- React with TypeScript
- Framer Motion for animations
- Zustand for state management

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/computer-architecture-visualization.git
   cd computer-architecture-visualization
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Memory Hierarchy Tab

1. **Select a Simulation**: Choose from predefined simulation scenarios
2. **Start Simulation**: Click the Start button to begin the visualization
3. **Watch Data Flow**: Observe how data moves between memory components
4. **View Component States**: See the current data contents in each memory layer
5. **Explore Memory Operations**: Click on operations in the Memory Interconnections section to see different data paths
6. **Learn Concepts**: Study the educational content in the Memory Concepts section

### CPU Pipeline Tab

1. **Add Instructions**: Use the control panel to add instructions to the pipeline
2. **Execute Pipeline**: Step through execution cycles or run continuously
3. **Observe Hazards**: Watch for pipeline hazards (data, control, structural)
4. **View Performance**: Monitor statistics about pipeline efficiency
5. **Analyze Behavior**: Study how different instructions interact in the pipeline

## Project Structure

```
src/
├── components/
│   ├── memory/             # Memory hierarchy components
│   │   ├── MemoryHierarchy.tsx
│   │   ├── EnhancedControlPanel.tsx
│   │   ├── EnhancedHardwareComponents.tsx
│   │   ├── MemoryMetrics.tsx
│   │   ├── MemoryInterconnections.tsx
│   │   ├── MemoryEducation.tsx
│   │   └── MemoryComponents.css
│   └── visualization/      # Pipeline visualization components
│       ├── PipelineVisualization.tsx
│       ├── PipelineControlPanel.tsx
│       ├── PipelineInfoPanel.tsx
│       └── DataFlow.tsx
├── store/                  # State management
│   ├── dataFlowStore.ts    # Memory hierarchy state
│   └── pipelineStore.ts    # Pipeline state
├── utils/                  # Utility functions
│   └── simulationUtils.ts
└── App.tsx                 # Main application with tab navigation
```

## Educational Context

This visualization tool aims to help students and educators understand:

### Memory Hierarchy Concepts
- Memory hierarchy organization and characteristics
- Cache hit and miss scenarios
- Page faults and virtual memory
- Write-back and write-through policies
- Memory access time differences across components

### CPU Pipeline Concepts
- Instruction pipelining fundamentals
- Pipeline stages and their functions
- Pipeline hazards and their resolution
- Performance implications of pipelining
- Advanced concepts like data forwarding and branch prediction

## Acknowledgements

- Developed as a Computer Architecture and Organization project
- Inspired by the need for interactive educational tools in computer science education
