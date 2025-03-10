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
  'Mindmap',
  'Timeline',
  'Sankey Diagram',
  'XY Chart',
  'Process Flow',
  'System Diagram',
];
