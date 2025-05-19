import React, { useState } from 'react';
import './MemoryEducation.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface EducationalContent {
  id: string;
  title: string;
  content: string;
  relatedComponents?: string[];
  diagram?: string;
  quiz?: QuizQuestion[];
}

const MemoryEducation: React.FC = () => {
  const [activeContent, setActiveContent] = useState<string>('intro');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  
  // Educational content
  const educationalContent: EducationalContent[] = [
    {
      id: 'intro',
      title: 'Memory Hierarchy Basics',
      content: `
        <p>The memory hierarchy in modern computers is designed to balance speed, cost, and capacity. 
        As we move from the CPU registers to disk storage, capacity increases while speed decreases.</p>
        
        <p>The hierarchy consists of:</p>
        <ul>
          <li><strong>CPU Registers</strong>: Fastest but smallest storage, directly accessed by the processor.</li>
          <li><strong>Cache Memory</strong>: Very fast SRAM that stores recently accessed data.</li>
          <li><strong>Main Memory (RAM)</strong>: Larger but slower than cache, holds active programs and data.</li>
          <li><strong>Secondary Storage (Disk)</strong>: Largest but slowest storage, retains data when power is off.</li>
        </ul>
        
        <p>This hierarchy works based on the principles of temporal locality (recently accessed data will likely be accessed again soon) 
        and spatial locality (data near recently accessed data will likely be accessed soon).</p>
        
        <p>In the visualization above, you can see how data flows between these different levels, with faster components at the top and slower, larger components at the bottom.</p>
      `,
      relatedComponents: ['visualization-section', 'components-section'],
      quiz: [
        {
          id: 1,
          question: "Which memory component has the lowest access time?",
          options: ["Hard Disk", "RAM", "Cache", "CPU Registers"],
          correctAnswer: 3,
          explanation: "CPU registers have the lowest access time (typically less than 1 nanosecond) as they are built directly into the processor."
        },
        {
          id: 2,
          question: "What principle states that recently accessed data will likely be accessed again soon?",
          options: ["Data coherence", "Temporal locality", "Spatial locality", "Memory consistency"],
          correctAnswer: 1,
          explanation: "Temporal locality is the principle that recently accessed data will likely be accessed again soon. This is why caching recently used data improves performance."
        }
      ]
    },
    {
      id: 'cache',
      title: 'Cache Organization',
      content: `
        <p>Cache memory is organized into blocks or lines, typically 64 bytes each. There are three main cache mapping techniques:</p>
        
        <ol>
          <li><strong>Direct Mapped Cache</strong>: Each memory block maps to exactly one cache line. Simple but can lead to conflicts.</li>
          <li><strong>Fully Associative Cache</strong>: Memory blocks can map to any cache line. Flexible but complex to implement.</li>
          <li><strong>Set Associative Cache</strong>: A compromise where memory blocks map to a specific set of cache lines.</li>
        </ol>
        
        <p>Each cache line contains:</p>
        <ul>
          <li><strong>Tag</strong>: Identifies which memory address the cached data belongs to</li>
          <li><strong>Data</strong>: The actual cached information</li>
          <li><strong>Status bits</strong>: Including validity and dirty bits</li>
        </ul>
        
        <p>When the CPU requests data, the cache controller checks if it's present in the cache (a hit) or not (a miss).</p>
        
        <p>Try running different simulations to see how cache hits and misses affect performance.</p>
      `,
      relatedComponents: ['control-section', 'metrics-section'],
      quiz: [
        {
          id: 3,
          question: "In a direct-mapped cache, how many cache lines can a memory block map to?",
          options: ["Any cache line", "A set of cache lines", "Exactly one cache line", "No cache lines"],
          correctAnswer: 2,
          explanation: "In a direct-mapped cache, each memory block maps to exactly one possible location in the cache, determined by a simple address mapping function."
        },
        {
          id: 4,
          question: "What does the 'dirty bit' in a cache line indicate?",
          options: ["The cache line contains corrupted data", "The cache line contains data that has been modified but not yet written back to main memory", "The cache line is invalid", "The cache line contains frequently accessed data"],
          correctAnswer: 1,
          explanation: "The dirty bit indicates that the data in the cache has been modified but not yet written back to main memory, meaning the cache and memory are inconsistent."
        }
      ]
    },
    {
      id: 'virtual',
      title: 'Virtual Memory',
      content: `
        <p>Virtual memory is a memory management technique that provides an idealized abstraction of the storage resources 
        available to a program. It creates the illusion of a very large, contiguous memory space regardless of actual physical memory constraints.</p>
        
        <p>Key concepts include:</p>
        <ul>
          <li><strong>Pages</strong>: Fixed-size blocks of virtual memory (typically 4KB)</li>
          <li><strong>Frames</strong>: Corresponding blocks in physical memory</li>
          <li><strong>Page Table</strong>: Maps virtual pages to physical frames</li>
          <li><strong>Translation Lookaside Buffer (TLB)</strong>: Cache for page table entries</li>
        </ul>
        
        <p>When a program accesses memory using a virtual address, the memory management unit (MMU) translates it to a physical address. 
        If the page isn't in physical memory, a page fault occurs, and the operating system loads the required page from disk.</p>
        
        <p>In the Memory Interconnections section, you can observe how page faults affect system performance by seeing the data path from disk to RAM.</p>
      `,
      relatedComponents: ['interconnections-section', 'components-section'],
      quiz: [
        {
          id: 5,
          question: "What happens during a page fault?",
          options: ["The program crashes", "The CPU fetches data from the cache", "The OS loads the required page from disk to RAM", "The virtual memory system is disabled"],
          correctAnswer: 2,
          explanation: "A page fault occurs when a program accesses a page that is mapped in the virtual address space but not loaded in physical memory. The OS must load the required page from disk into RAM before execution can continue."
        },
        {
          id: 6,
          question: "What is the purpose of the Translation Lookaside Buffer (TLB)?",
          options: ["To store frequently used data", "To cache recent virtual-to-physical address translations", "To manage disk storage", "To encrypt memory contents"],
          correctAnswer: 1,
          explanation: "The TLB is a special cache that stores recent virtual-to-physical address translations, speeding up the address translation process by avoiding page table lookups."
        }
      ]
    },
    {
      id: 'performance',
      title: 'Memory Performance Optimization',
      content: `
        <p>Memory performance can be optimized through various techniques:</p>
        
        <ul>
          <li><strong>Cache Prefetching</strong>: Proactively loading data into cache before it's needed</li>
          <li><strong>Memory Interleaving</strong>: Spreading memory across multiple banks to allow parallel access</li>
          <li><strong>Write Buffering</strong>: Temporarily storing writes to reduce wait times</li>
          <li><strong>Cache Replacement Policies</strong>: Algorithms like LRU (Least Recently Used) to decide which cache lines to evict</li>
          <li><strong>Memory-Level Parallelism</strong>: Issuing multiple memory operations simultaneously</li>
        </ul>
        
        <p>Performance metrics include:</p>
        <ul>
          <li><strong>Average Memory Access Time (AMAT)</strong>: Average time to access memory across the hierarchy</li>
          <li><strong>Memory Access Times</strong>: The time required to access each level of the memory hierarchy</li>
        </ul>
        
        <p>The Memory Performance section shows these statistics as you experiment with different simulations.</p>
      `,
      relatedComponents: ['metrics-section', 'control-section'],
      quiz: [
        {
          id: 7,
          question: "What is the AMAT (Average Memory Access Time) formula?",
          options: [
            "Hit Time + Miss Rate × Miss Penalty",
            "Hit Rate × Hit Time + Miss Rate × Miss Time",
            "Hit Time + Miss Time",
            "Miss Rate / Hit Rate"
          ],
          correctAnswer: 0,
          explanation: "AMAT = Hit Time + Miss Rate × Miss Penalty. This formula calculates the average time to access memory by considering both cache hits and misses."
        },
        {
          id: 8,
          question: "Which cache replacement policy evicts the least recently used item first?",
          options: ["FIFO (First In, First Out)", "Random Replacement", "LRU (Least Recently Used)", "MRU (Most Recently Used)"],
          correctAnswer: 2,
          explanation: "LRU (Least Recently Used) policy evicts the cache line that hasn't been accessed for the longest time, based on the principle of temporal locality."
        }
      ]
    },
    {
      id: 'interconnections',
      title: 'Memory Interconnections',
      content: `
        <p>The memory hierarchy components are interconnected through various buses and controllers that manage data flow:</p>
        
        <ul>
          <li><strong>Memory Controller</strong>: Manages data transfer between CPU and main memory</li>
          <li><strong>Cache Controller</strong>: Handles cache lookups, replacements, and coherence</li>
          <li><strong>System Bus</strong>: Main communication pathway between CPU, memory, and I/O devices</li>
          <li><strong>Memory Bus</strong>: Specialized bus for memory transfers</li>
        </ul>
        
        <p>Common memory operations include:</p>
        <ul>
          <li><strong>Cache Hit</strong>: Data found in cache, quickly returned to CPU</li>
          <li><strong>Cache Miss</strong>: Data not in cache, must fetch from RAM</li>
          <li><strong>Page Fault</strong>: Data not in RAM, must fetch from disk</li>
          <li><strong>Write Back</strong>: Modified data in cache written back to RAM</li>
        </ul>
        
        <p>The Memory Interconnections diagram illustrates these relationships and data paths between components.</p>
      `,
      relatedComponents: ['interconnections-section', 'visualization-section'],
      quiz: [
        {
          id: 9,
          question: "What is the longest data path in the memory hierarchy?",
          options: ["CPU to Cache", "Cache to RAM", "RAM to Disk", "CPU to Disk"],
          correctAnswer: 3,
          explanation: "The CPU to Disk path is the longest, involving CPU → Cache → RAM → Disk, which occurs during a page fault when data must be retrieved from secondary storage."
        },
        {
          id: 10,
          question: "Which memory operation has the lowest latency?",
          options: ["Cache Hit", "Cache Miss", "Page Fault", "Disk Access"],
          correctAnswer: 0,
          explanation: "A cache hit has the lowest latency since the data is already in the fast cache memory and can be quickly returned to the CPU without accessing slower memory levels."
        }
      ]
    }
  ];
  
  // Get current content
  const currentContent = educationalContent.find(content => content.id === activeContent) || educationalContent[0];
  
  // Handle quiz answer selection
  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  // Toggle explanation visibility
  const toggleExplanation = (questionId: number) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Check if answer is correct
  const isCorrectAnswer = (questionId: number, selectedAnswer: number | null) => {
    const question = currentContent.quiz?.find(q => q.id === questionId);
    return question && selectedAnswer === question.correctAnswer;
  };
  
  // Navigate to related component
  const navigateToComponent = (selector: string) => {
    const element = document.querySelector(`.${selector}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Add temporary highlight
      element.classList.add('tour-highlight');
      setTimeout(() => {
        element.classList.remove('tour-highlight');
      }, 2000);
    }
  };
  
  return (
    <div className="card memory-education">
      <h3 className="card-title">Memory Hierarchy Learning Center</h3>
      
      <div className="education-tabs">
        {educationalContent.map(content => (
          <button
            key={content.id}
            className={`tab-button ${activeContent === content.id ? 'active' : ''}`}
            onClick={() => {
              setActiveContent(content.id);
              setQuizAnswers({});
              setShowExplanations({});
            }}
          >
            {content.title}
          </button>
        ))}
      </div>
      
      <div className="education-content">
        <h4>{currentContent.title}</h4>
        
        <div 
          className="content-text"
          dangerouslySetInnerHTML={{ __html: currentContent.content }}
        />
        
        {currentContent.relatedComponents && currentContent.relatedComponents.length > 0 && (
          <div className="related-components">
            <div className="related-title">Related Components:</div>
            <div className="related-links">
              {currentContent.relatedComponents.map((component, index) => (
                <button 
                  key={index} 
                  className="related-link"
                  onClick={() => navigateToComponent(component)}
                >
                  {component === 'visualization-section' ? 'Visualization' : 
                   component === 'components-section' ? 'Hardware Components' :
                   component === 'interconnections-section' ? 'Memory Interconnections' :
                   component === 'control-section' ? 'Data Flow Simulation' :
                   component === 'metrics-section' ? 'Memory Performance' : component}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {currentContent.quiz && currentContent.quiz.length > 0 && (
          <div className="quiz-section">
            <h4>Test Your Knowledge</h4>
            
            {currentContent.quiz.map(question => (
              <div key={question.id} className="quiz-question">
                <p className="question-text">{question.question}</p>
                
                <div className="radio-options-list">
                  {question.options.map((option, index) => (
                    <label key={index} className="radio-option">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={quizAnswers[question.id] === index}
                        onChange={() => handleAnswerSelect(question.id, index)}
                      />
                      <span className="option-text">{option}</span>
                    </label>
                  ))}
                </div>
                
                {quizAnswers[question.id] !== undefined && (
                  <div className={`answer-feedback ${isCorrectAnswer(question.id, quizAnswers[question.id]) ? 'correct' : 'incorrect'}`}>
                    <div className="feedback-header">
                      <span className="feedback-icon">
                        {isCorrectAnswer(question.id, quizAnswers[question.id]) ? '✓' : '✗'}
                      </span>
                      <span className="feedback-text">
                        {isCorrectAnswer(question.id, quizAnswers[question.id]) ? 'Correct!' : 'Incorrect'}
                      </span>
                      <button 
                        className="explanation-toggle"
                        onClick={() => toggleExplanation(question.id)}
                      >
                        {showExplanations[question.id] ? 'Hide Explanation' : 'Show Explanation'}
                      </button>
                    </div>
                    
                    {showExplanations[question.id] && (
                      <div className="answer-explanation">
                        {question.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryEducation; 