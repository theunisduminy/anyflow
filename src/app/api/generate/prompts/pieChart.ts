import { BASE_PROMPT } from './types';

export const pieChartPrompt = `${BASE_PROMPT}

Create a pie chart that shows the distribution of values.

PIE CHART SYNTAX GUIDELINES:
1. Start with 'pie'
2. Add a title with 'title [Your Title]'
3. Define slices with:
   - "Label" : value
4. Values determine the relative size of each slice
5. Labels should be in quotes
6. Values can be decimals or integers
7. The sum of values doesn't need to equal 100

Example of valid syntax:
\`\`\`mermaid
pie
    title Distribution of Customer Types
    "Enterprise" : 45.2
    "Small Business" : 30.8
    "Consumer" : 24.0
\`\`\``;
