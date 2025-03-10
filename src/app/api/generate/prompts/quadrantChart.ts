import { BASE_PROMPT } from './types';

export const quadrantChartPrompt = `${BASE_PROMPT}

Create a quadrant chart that divides data into four sections.

QUADRANT CHART SYNTAX GUIDELINES:
1. Start with 'quadrantChart'
2. Add a title with 'title [Your Title]'
3. Define axes with:
   - x-axis [Left Label] --> [Right Label]
   - y-axis [Bottom Label] --> [Top Label]
4. Define quadrant titles with:
   - quadrant-1: [Top Right]
   - quadrant-2: [Top Left]
   - quadrant-3: [Bottom Left]
   - quadrant-4: [Bottom Right]
5. Plot points with:
   - [Point Name]: [x, y]
6. Coordinates range from 0 to 1 (0,0 is bottom-left)

Example of valid syntax:
\`\`\`mermaid
quadrantChart
    title Product Portfolio Analysis
    x-axis Low Market Share --> High Market Share
    y-axis Low Growth Rate --> High Growth Rate
    quadrant-1 Stars
    quadrant-2 Question Marks
    quadrant-3 Dogs
    quadrant-4 Cash Cows
    Product A: [0.7, 0.8]
    Product B: [0.45, 0.23]
    Product C: [0.57, 0.69]
    Product D: [0.78, 0.34]
    Product E: [0.40, 0.34]
    Product F: [0.35, 0.78]
\`\`\``;
