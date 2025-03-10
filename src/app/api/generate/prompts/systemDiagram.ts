import { BASE_PROMPT } from './types';

export const systemDiagramPrompt = `${BASE_PROMPT}

Create a system diagram that shows components, services, and their interactions. Use appropriate shapes and connections.

SYSTEM DIAGRAM SYNTAX GUIDELINES:
1. Start with 'requirementDiagram'
2. Define requirements:
   <type> [name] {
       id: [unique id]
       text: [description]
       risk: [low|medium|high]
       verifymethod: [analysis|demonstration|inspection|test]
   }
   Types: requirement, functionalRequirement, interfaceRequirement, performanceRequirement, physicalRequirement, designConstraint
3. Define elements:
   element [name] {
       type: [element type]
       docRef: [reference]
   }
4. Define relationships:
   [source] - [relationship] -> [destination]
   Relationships: contains, copies, derives, satisfies, verifies, refines, traces

Example of valid syntax:
\`\`\`mermaid
flowchart LR
    User((User)) -->|Request| LB[Load Balancer]
    
    subgraph Services
        LB -->|Forward| S1[Service A]
        LB -->|Forward| S2[Service B]
        S1 <-->|Internal| S2
    end
    
    subgraph Data
        DB1[(Primary DB)]
        DB2[(Replica DB)]
        DB1 -->|Sync| DB2
    end
    
    S1 -->|Read/Write| DB1
    S2 -->|Read| DB2
    
    S1 -->|Notify| Q[Message Queue]
    Q -->|Process| W[Worker Service]
\`\`\``;
