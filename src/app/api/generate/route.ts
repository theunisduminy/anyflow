import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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
      messages: messages as ChatCompletionMessageParam[],
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
  } catch (error: Error | unknown) {
    console.error('Error generating diagram:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to generate diagram',
      },
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
    case 'Flowchart':
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

    case 'Sequence Diagram':
      return `${basePrompt}

Create a sequence diagram that shows how processes operate with one another and in what order.
Example of valid syntax:
\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
\`\`\``;

    case 'Class Diagram':
      return `${basePrompt}

Create a class diagram that shows the structure of a system by showing its classes, attributes, operations, and the relationships among objects.
Example of valid syntax:
\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
\`\`\``;

    case 'State Diagram':
      return `${basePrompt}

Create a state diagram that shows the different states of a system and the transitions between them.
Example of valid syntax:
\`\`\`mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\``;

    case 'Entity Relationship Diagram':
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

    case 'User Journey':
      return `${basePrompt}

Create a user journey diagram that shows the steps a user takes to complete a task.
Example of valid syntax:
\`\`\`mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
\`\`\``;

    case 'Gantt Chart':
      return `${basePrompt}

Create a Gantt chart that shows project schedules with tasks, durations, and dependencies.
Example of valid syntax:
\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2014-01-12, 12d
    another task     :24d
\`\`\``;

    case 'Pie Chart':
      return `${basePrompt}

Create a pie chart that shows the distribution of values.
Example of valid syntax:
\`\`\`mermaid
pie
    title Key elements in Product X
    "Calcium" : 42.96
    "Potassium" : 50.05
    "Magnesium" : 10.01
    "Iron" :  5
\`\`\``;

    case 'Quadrant Chart':
      return `${basePrompt}

Create a quadrant chart that divides data into four sections.
Example of valid syntax:
\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
\`\`\``;

    case 'Requirement Diagram':
      return `${basePrompt}

Create a requirement diagram that shows system requirements and their relationships.
Example of valid syntax:
\`\`\`mermaid
requirementDiagram
    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req
\`\`\``;

    case 'Gitgraph Diagram':
      return `${basePrompt}

Create a Git graph diagram that shows Git commits and branches.
Example of valid syntax:
\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
\`\`\``;

    case 'C4 Diagram':
      return `${basePrompt}

Create a C4 diagram that shows the structure of a software system.
Example of valid syntax:
\`\`\`mermaid
C4Context
    title System Context diagram for Internet Banking System
    Enterprise_Boundary(b0, "BankBoundary") {
      Person(customer, "Banking Customer", "A customer of the bank, with personal bank accounts")
      System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments")
    }
    System_Ext(mail_system, "E-mail system", "The internal Microsoft Exchange e-mail system")
    Rel(customer, banking_system, "Uses")
    Rel(banking_system, mail_system, "Sends e-mails", "SMTP")
    UpdateRelStyle(customer, banking_system, $offsetY="-40")
\`\`\``;

    case 'Mindmap':
      return `${basePrompt}

Create a mindmap diagram that shows hierarchical information.
Example of valid syntax:
\`\`\`mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
\`\`\``;

    case 'Timeline':
      return `${basePrompt}

Create a timeline diagram that shows events in chronological order.
Example of valid syntax:
\`\`\`mermaid
timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter
\`\`\``;

    case 'Sankey Diagram':
      return `${basePrompt}

Create a Sankey diagram that shows flow quantities in a system.
Example of valid syntax:
\`\`\`mermaid
sankey-beta
    Agricultural 'waste' [301]
    Bio-conversion [50]
    Liquid [169]
    Losses [193]
    Solid [92]
    Gas [40]
    
    Agricultural 'waste' --> Bio-conversion [10]
    Bio-conversion --> Liquid [20]
    Bio-conversion --> Solid [30]
    Bio-conversion --> Gas [40]
    Liquid --> Losses [5]
    Solid --> Losses [5]
    Gas --> Losses [20]
\`\`\``;

    case 'XY Chart':
      return `${basePrompt}

Create an XY chart that shows data points on a two-dimensional grid.
Example of valid syntax:
\`\`\`mermaid
xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 0 --> 100000
    bar [30000, 50000, 20000, 40000, 35000, 45000, 55000, 25000, 30000, 40000, 35000, 60000]
    line [28000, 48000, 22000, 38000, 33000, 43000, 53000, 23000, 28000, 38000, 33000, 58000]
\`\`\``;

    case 'Block Diagram':
      return `${basePrompt}

Create a block diagram that shows the structure of a system with blocks and connections.
Example of valid syntax:
\`\`\`mermaid
block-beta
    columns 1
    block:my-block
        columns 3
        space:space1
        block:block1
        space:space2
        block:block2
        space:space3
        block:block3
        space:space4
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
