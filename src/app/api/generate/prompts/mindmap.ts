import { BASE_PROMPT } from './types';

export const mindmapPrompt = `${BASE_PROMPT}

Create a mindmap diagram that shows hierarchical information.

MINDMAP SYNTAX GUIDELINES:
1. Start with 'mindmap'
2. Define the root node with text or with root((text)) for a circle
3. Use indentation to define hierarchy levels
4. Node shapes:
   - Default: no brackets
   - Square: [text]
   - Rounded: (text)
   - Circle: ((text))
   - Bang: )text(
   - Cloud: )text(
   - Hexagon: {{text}}
5. Use '::' to add styling classes to nodes
6. Icons can be added with FontAwesome syntax: fa:fa-icon

Example of valid syntax:
\`\`\`mermaid
mindmap
    root((Project Plan))
        Planning
            Requirements
            Timeline
            Resources
        Development
            Frontend
                UI Design
                Implementation
            Backend
                API Design
                Database
                Implementation
        Testing
            Unit Tests
            Integration Tests
            User Acceptance
        Deployment
            Staging
            Production
\`\`\``;
