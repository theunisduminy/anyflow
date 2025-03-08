export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const DIAGRAM_TYPES = [
  'Flowchart',
  'Sequence Diagram',
  'Class Diagram',
  'State Diagram',
  'Entity Relationship Diagram',
  'User Journey',
  'Gantt Chart',
  'Pie Chart',
  'Quadrant Chart',
  'Requirement Diagram',
  'Gitgraph Diagram',
  'C4 Diagram',
  'Mindmap',
  'Timeline',
  'Sankey Diagram',
  'XY Chart',
  'Block Diagram',
  'Process Flow',
  'System Diagram',
];
