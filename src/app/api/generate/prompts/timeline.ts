import { BASE_PROMPT } from './types';

export const timelinePrompt = `${BASE_PROMPT}

Create a timeline diagram that shows events in chronological order.

TIMELINE SYNTAX GUIDELINES:
1. Start with 'timeline'
2. Add a title with 'title [Your Title]'
3. Define time points with a date/time followed by a colon
4. Add events under time points with indentation
5. Multiple events can be listed under a single time point
6. Time points are displayed in the order they appear in the code

Example of valid syntax:
\`\`\`mermaid
timeline
    title Project Timeline
    
    2023-01-15 : Project kickoff
                : Team formation
    2023-02-01 : Requirements finalized
    2023-02-15 : Design phase
                : Architecture decisions
                : UI mockups approved
    2023-03-10 : Development starts
    2023-04-20 : Alpha release
    2023-05-15 : Beta testing
    2023-06-01 : Version 1.0 release
\`\`\``;
