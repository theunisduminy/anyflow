import { BASE_PROMPT } from './types';

export const xyChartPrompt = `${BASE_PROMPT}

Create an XY chart that shows data points on a two-dimensional grid.

XY CHART SYNTAX GUIDELINES:
1. Start with 'xychart-beta'
2. Add a title with 'title "[Your Title]"'
3. Define x-axis with:
   - x-axis "[Label]" [min] --> [max]
   - x-axis [value1, value2, ...]
4. Define y-axis with:
   - y-axis "[Label]" [min] --> [max]
5. Define data series with:
   - line [value1, value2, ...]
   - bar [value1, value2, ...]
6. Multiple series can be defined
7. Series length must match x-axis values length

Example of valid syntax:
\`\`\`mermaid
xychart-beta
    title "Monthly Sales Performance"
    x-axis [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Revenue ($1000s)" 0 --> 100
    
    line [10, 20, 30, 40, 50, 60, 70, 60, 50, 40, 30, 20]
    bar [5, 15, 25, 35, 45, 55, 65, 55, 45, 35, 25, 15]
\`\`\``;
