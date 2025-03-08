import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { diagramType, description, history = [] } = await request.json();

    if (!diagramType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Construct system prompt based on diagram type
    const systemPrompt = getSystemPrompt(diagramType);

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: description },
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Extract Mermaid code from response
    const content = response.choices[0].message.content || '';
    const mermaidCode = extractMermaidCode(content);

    if (!mermaidCode) {
      return NextResponse.json(
        { error: 'Failed to generate valid Mermaid code' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      mermaidCode,
      fullResponse: content,
    });
  } catch (error: any) {
    console.error('Error generating diagram:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate diagram' },
      { status: 500 }
    );
  }
}

// Helper function to extract Mermaid code from response
function extractMermaidCode(content: string): string | null {
  // Match content between ```mermaid and ``` tags
  const mermaidMatch = content.match(/```mermaid\n([\s\S]*?)```/);
  if (mermaidMatch && mermaidMatch[1]) {
    return mermaidMatch[1];
  }

  // If no mermaid tag, try to find any code block
  const codeBlockMatch = content.match(/```([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1];
  }

  return null;
}

// Helper function to get system prompt based on diagram type
function getSystemPrompt(diagramType: string): string {
  const basePrompt = `You are an expert at creating Mermaid diagrams. Your task is to generate ONLY valid Mermaid code based on the user's description.

CRITICAL INSTRUCTIONS:
1. ONLY output the raw Mermaid code wrapped in \`\`\`mermaid and \`\`\` tags.
2. DO NOT include any explanations, comments, or text outside the code block.
3. DO NOT use %% comments within the Mermaid code.
4. DO NOT use // comments within the Mermaid code.
5. DO NOT modify the syntax or structure of the Mermaid code in any way that would break its rendering.
6. Ensure proper spacing and indentation in the Mermaid code.
7. Keep the diagram simple and focused on the key elements.
8. Ensure all nodes are properly connected.
9. Use standard Mermaid syntax without experimental features.`;

  switch (diagramType) {
    case 'Process Flow':
      return `${basePrompt}

Create a flowchart diagram that shows a process flow. Use appropriate shapes and connections.
Example of valid syntax:
\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Another Action]
    C --> E[End]
    D --> E
\`\`\``;

    case 'EERD':
      return `${basePrompt}

Create an entity-relationship diagram (ERD) that shows entities, attributes, and relationships. Use appropriate notation.
Example of valid syntax:
\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date orderDate
    }
\`\`\``;

    case 'System Diagram':
      return `${basePrompt}

Create a system diagram that shows components, services, and their interactions. Use appropriate shapes and connections.
Example of valid syntax:
\`\`\`mermaid
flowchart LR
    User -->|Request| LoadBalancer
    LoadBalancer -->|Forward| ServiceA
    LoadBalancer -->|Forward| ServiceB
    ServiceA -->|Query| Database
    ServiceB -->|Query| Database
\`\`\``;

    default:
      return `${basePrompt}

Example of valid syntax:
\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Another Action]
    C --> E[End]
    D --> E
\`\`\``;
  }
}
