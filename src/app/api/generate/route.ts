import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { GoogleGenerativeAI } from '@google/generative-ai';

type ModelType = 'OPEN_AI' | 'GEMINI';

const MODEL: ModelType = (process.env.MODEL as ModelType) || 'GEMINI';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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

    // Prepare messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: description },
    ] as ChatCompletionMessageParam[];

    let content: string;

    if (MODEL === 'OPEN_AI') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      });
      content = response.choices[0]?.message?.content ?? '';
      if (!content) throw new Error('No content received from OpenAI');
    } else {
      const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
      // Combine all messages into a single prompt for Gemini
      const prompt = messages
        .map(
          (msg) =>
            `${msg.role === 'system' ? 'Instructions' : msg.role}:\n${
              msg.content
            }`
        )
        .join('\n\n');

      const response = await model.generateContent(prompt);
      const result = await response.response;
      content = result.text();
      if (!content) throw new Error('No content received from Gemini');
    }

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
  } catch (error: unknown) {
    console.error('Error generating diagram:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to generate diagram';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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

FLOWCHART SYNTAX GUIDELINES:
1. Start with 'flowchart' followed by direction (TD, LR, RL, BT)
   - TD = top-down, LR = left-right, RL = right-left, BT = bottom-top
2. Define nodes with unique IDs and optional shapes: A[Rectangle], B(Rounded), C{Diamond}, D>Asymmetric]
3. Connect nodes with arrows: A --> B, A --text--> B, A -.-> B (dotted), A ==> B (thick)
4. Group related nodes with subgraphs if needed
5. Use appropriate shapes for different steps:
   - Rectangles [text] for processes/actions
   - Diamonds {text} for decisions
   - Rounded rectangles (text) for start/end points
   - Circles ((text)) for connections

Example of valid syntax:
\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[Result 1]
    D --> E
    E --> F[End]
\`\`\``;

    case 'Sequence Diagram':
      return `${basePrompt}

Create a sequence diagram that shows how processes operate with one another and in what order.

SEQUENCE DIAGRAM SYNTAX GUIDELINES:
1. Start with 'sequenceDiagram'
2. Define participants in order of appearance: 'participant A' or 'actor B'
3. Show interactions with arrows:
   - A->>B: Message (solid arrow with open head)
   - A-->>B: Response (dashed arrow with open head)
   - A->B: Message (solid arrow with closed head)
   - A-->B: Response (dashed arrow with closed head)
4. Group related actions with:
   - alt/else for alternatives
   - opt for optional actions
   - loop for repeated actions
   - par for parallel actions
5. Add notes with: Note left of A, Note right of B, or Note over A,B
6. Use activate/deactivate to show lifeline activation

Example of valid syntax:
\`\`\`mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant Database
    
    User->>Frontend: Enter credentials
    activate Frontend
    Frontend->>API: Send login request
    activate API
    API->>Database: Validate credentials
    activate Database
    Database-->>API: Return user data
    deactivate Database
    API-->>Frontend: Authentication response
    deactivate API
    
    alt successful login
        Frontend-->>User: Show dashboard
    else failed login
        Frontend-->>User: Show error message
    end
    deactivate Frontend
\`\`\``;

    case 'Class Diagram':
      return `${basePrompt}

Create a class diagram that shows the structure of a system by showing its classes, attributes, operations, and the relationships among objects.

CLASS DIAGRAM SYNTAX GUIDELINES:
1. Start with 'classDiagram'
2. Define classes with attributes and methods:
   - Class Name
   - Class attributes: +public, -private, #protected
   - Class methods: methods()
3. Show relationships between classes:
   - Inheritance: ClassA --|> ClassB (B inherits from A)
   - Composition: ClassA *-- ClassB (A contains B)
   - Aggregation: ClassA o-- ClassB (A has B)
   - Association: ClassA --> ClassB (A uses B)
4. Add labels to relationships: ClassA "1" --> "many" ClassB
5. Define methods with parameters: +method(param1, param2)
6. Use <<interface>> or <<abstract>> for special class types

Example of valid syntax:
\`\`\`mermaid
classDiagram
    class Animal {
        +int age
        +String gender
        +isMammal()
        +mate()
    }
    class Duck {
        +String beakColor
        +swim()
        +quack()
    }
    class Fish {
        -int sizeInFeet
        -canEat()
    }
    class Zebra {
        +bool isWild
        +run()
    }
    
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    
    class Student {
        +String studentId
        +String name
    }
    class Course {
        +String courseId
        +String title
    }
    Student "many" --> "many" Course: enrolls
\`\`\``;

    case 'State Diagram':
      return `${basePrompt}

Create a state diagram that shows the different states of a system and the transitions between them.

STATE DIAGRAM SYNTAX GUIDELINES:
1. Start with 'stateDiagram-v2' (MUST use v2 version)
2. Define states as simple text or with [*] for start/end states
3. Define transitions between states with arrows: StateA --> StateB
4. Add labels to transitions: StateA --> StateB: Event
5. Use compound states to group related states:
   state "Name" as compoundState {
       State1 --> State2
   }
6. Use forks and joins for parallel states
7. Use notes to add additional information

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

ERD SYNTAX GUIDELINES:
1. Start with 'erDiagram'
2. Define entities with attributes:
   - ENTITY {
       type attribute
   }
3. Define relationships between entities:
   - ENTITY1 ||--o{ ENTITY2 : "relationship"
   - First character: Entity1 cardinality (1, o, |)
   - Second character: Relationship type (-, .)
   - Third and fourth characters: Entity2 cardinality (1, o, |, })
4. Cardinality symbols:
   - | = exactly one
   - o = zero or one
   - || = one or more
   - }| = zero or more
5. Use descriptive relationship labels

Example of valid syntax:
\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        string id
        string name
        string email
        string address
    }
    ORDER ||--|{ LINE_ITEM : contains
    ORDER {
        string id
        date created_at
        string status
    }
    LINE_ITEM {
        string id
        int quantity
        float price
    }
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    PRODUCT {
        string id
        string name
        float price
        string category
    }
\`\`\``;

    case 'User Journey':
      return `${basePrompt}

Create a user journey diagram that shows the steps a user takes to complete a task.

USER JOURNEY SYNTAX GUIDELINES:
1. Start with 'journey'
2. Add a title with 'title [Your Title]'
3. Organize steps into sections with 'section [Section Name]'
4. Define tasks with ratings (1-5) and actors:
   - Task name: rating: Actor1, Actor2
   - Rating 1 = very negative, 5 = very positive
5. Tasks are displayed in sequence within their sections
6. Multiple actors can be assigned to a task

Example of valid syntax:
\`\`\`mermaid
journey
    title User Shopping Journey
    section Browse Website
      Find product: 3: User
      View details: 4: User
      Read reviews: 3: User
    section Purchase
      Add to cart: 5: User
      Checkout: 3: User, System
      Enter payment: 2: User, System
    section Post-Purchase
      Receive confirmation: 5: User, System
      Track shipping: 4: User
      Receive product: 5: User
\`\`\``;

    case 'Gantt Chart':
      return `${basePrompt}

Create a Gantt chart that shows project schedules with tasks, durations, and dependencies.

GANTT CHART SYNTAX GUIDELINES:
1. Start with 'gantt'
2. Add a title with 'title [Your Title]'
3. Define date format with 'dateFormat YYYY-MM-DD'
4. Organize tasks into sections with 'section [Section Name]'
5. Define tasks with:
   - Task name : taskID, startDate, duration
   - Task name : after taskID, duration
6. Define milestones with:
   - Milestone : milestone, date
7. Set dependencies with 'after' keyword
8. Specify durations in days (d), hours (h), minutes (m), seconds (s)
9. Use 'excludes' to specify non-working days

Example of valid syntax:
\`\`\`mermaid
gantt
    title Project Development Schedule
    dateFormat  YYYY-MM-DD
    
    section Planning
    Project kickoff       :milestone, 2023-01-15, 0d
    Requirements gathering :a1, 2023-01-15, 10d
    System design         :a2, after a1, 15d
    
    section Development
    Frontend development  :b1, after a2, 25d
    Backend development   :b2, after a2, 30d
    API integration       :b3, after b1, 5d
    
    section Testing
    Unit testing          :c1, after b2, 10d
    Integration testing   :c2, after b3, 7d
    User acceptance       :c3, after c2, 7d
    
    section Deployment
    Training              :d1, after c3, 5d
    Go Live               :milestone, after d1, 0d
\`\`\``;

    case 'Pie Chart':
      return `${basePrompt}

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

    case 'Quadrant Chart':
      return `${basePrompt}

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

    case 'Requirement Diagram':
      return `${basePrompt}

Create a requirement diagram that shows system requirements and their relationships.

REQUIREMENT DIAGRAM SYNTAX GUIDELINES:
1. Start with 'requirementDiagram' (case sensitive)
2. Define requirements with:
   requirement [name] {
       id: [unique identifier]
       text: [description]
       risk: [low, medium, high]
       verifymethod: [analysis, demonstration, inspection, test]
   }
3. Define elements (implementations) with:
   element [name] {
       type: [element type]
       docRef: [reference document]
   }
4. Define relationships between elements with:
   [element1] - [relationship] -> [element2]
5. Relationship types:
   - contains: hierarchical relationship
   - copies: duplication relationship
   - derives: derived from another requirement
   - satisfies: implementation satisfies requirement
   - verifies: test verifies requirement
   - refines: further refinement of requirement
   - traces: traceability relationship
6. Requirement types (case sensitive):
   - requirement (default)
   - functionalRequirement
   - interfaceRequirement
   - performanceRequirement
   - physicalRequirement
   - designConstraint

Example of valid syntax:
\`\`\`mermaid
    requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    functionalRequirement test_req2 {
    id: 1.1
    text: the second test text.
    risk: low
    verifymethod: inspection
    }

    performanceRequirement test_req3 {
    id: 1.2
    text: the third test text.
    risk: medium
    verifymethod: demonstration
    }

    interfaceRequirement test_req4 {
    id: 1.2.1
    text: the fourth test text.
    risk: medium
    verifymethod: analysis
    }

    physicalRequirement test_req5 {
    id: 1.2.2
    text: the fifth test text.
    risk: medium
    verifymethod: analysis
    }

    designConstraint test_req6 {
    id: 1.2.3
    text: the sixth test text.
    risk: medium
    verifymethod: analysis
    }

    element test_entity {
    type: simulation
    }

    element test_entity2 {
    type: word doc
    docRef: reqs/test_entity
    }

    element test_entity3 {
    type: "test suite"
    docRef: github.com/all_the_tests
    }


    test_entity - satisfies -> test_req2
    test_req - traces -> test_req2
    test_req - contains -> test_req3
    test_req3 - contains -> test_req4
    test_req4 - derives -> test_req5
    test_req5 - refines -> test_req6
    test_entity3 - verifies -> test_req5
    test_req <- copies - test_entity2
\`\`\``;

    case 'Gitgraph Diagram':
      return `${basePrompt}

Create a Git graph diagram that shows Git commits and branches.

GITGRAPH SYNTAX GUIDELINES:
1. Start with 'gitGraph'
2. Define commits with 'commit' (creates a commit on current branch)
3. Create branches with 'branch [branch-name]'
4. Switch between branches with 'checkout [branch-name]'
5. Merge branches with 'merge [branch-name]'
6. Add commit messages with 'commit "message"'
7. Add tags with 'commit id:"tag-name"'
8. Customize with:
   - commit id:"ID" tag:"TAG" type:NORMAL|REVERSE|HIGHLIGHT
   - branch order:[order-number]
9. Branch order determines vertical position (lower number = higher)

Example of valid syntax:
\`\`\`mermaid
gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout develop
    merge feature
    commit
    checkout main
    merge develop
    commit tag:"v1.0.0"
\`\`\``;

    case 'C4 Diagram':
      return `${basePrompt}

Create a C4 diagram that shows the structure of a software system.

C4 DIAGRAM SYNTAX GUIDELINES:
1. Start with 'C4Context' (for context diagrams)
2. Define boundaries with:
   - Enterprise_Boundary(id, "name") { ... }
   - System_Boundary(id, "name") { ... }
3. Define elements:
   - Person(id, "name", "description")
   - System(id, "name", "description")
   - System_Ext(id, "name", "description") (external system)
   - Container(id, "name", "technology", "description")
   - Component(id, "name", "technology", "description")
4. Define relationships:
   - Rel(from, to, "label", "technology")
   - Rel_Back(from, to, "label", "technology")
5. Style relationships:
   - UpdateRelStyle(from, to, "style", "color")
6. Use C4Dynamic for dynamic diagrams and C4Deployment for deployment diagrams

Example of valid syntax:
\`\`\`mermaid
    C4Context
      title System Context diagram for Internet Banking System
      Enterprise_Boundary(b0, "BankBoundary0") {
        Person(customerA, "Banking Customer A", "A customer of the bank, with personal bank accounts.")
        Person(customerB, "Banking Customer B")
        Person_Ext(customerC, "Banking Customer C", "desc")

        Person(customerD, "Banking Customer D", "A customer of the bank, <br/> with personal bank accounts.")

        System(SystemAA, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")

        Enterprise_Boundary(b1, "BankBoundary") {

          SystemDb_Ext(SystemE, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

          System_Boundary(b2, "BankBoundary2") {
            System(SystemA, "Banking System A")
            System(SystemB, "Banking System B", "A system of the bank, with personal bank accounts. next line.")
          }

          System_Ext(SystemC, "E-mail system", "The internal Microsoft Exchange e-mail system.")
          SystemDb(SystemD, "Banking System D Database", "A system of the bank, with personal bank accounts.")

          Boundary(b3, "BankBoundary3", "boundary") {
            SystemQueue(SystemF, "Banking System F Queue", "A system of the bank.")
            SystemQueue_Ext(SystemG, "Banking System G Queue", "A system of the bank, with personal bank accounts.")
          }
        }
      }

      BiRel(customerA, SystemAA, "Uses")
      BiRel(SystemAA, SystemE, "Uses")
      Rel(SystemAA, SystemC, "Sends e-mails", "SMTP")
      Rel(SystemC, customerA, "Sends e-mails to")

      UpdateElementStyle(customerA, $fontColor="red", $bgColor="grey", $borderColor="red")
      UpdateRelStyle(customerA, SystemAA, $textColor="blue", $lineColor="blue", $offsetX="5")
      UpdateRelStyle(SystemAA, SystemE, $textColor="blue", $lineColor="blue", $offsetY="-10")
      UpdateRelStyle(SystemAA, SystemC, $textColor="blue", $lineColor="blue", $offsetY="-40", $offsetX="-50")
      UpdateRelStyle(SystemC, customerA, $textColor="red", $lineColor="red", $offsetX="-50", $offsetY="20")

      UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
\`\`\``;

    case 'Mindmap':
      return `${basePrompt}

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

    case 'Timeline':
      return `${basePrompt}

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

    case 'Sankey Diagram':
      return `${basePrompt}

Create a Sankey diagram that shows flow quantities in a system.

SANKEY DIAGRAM SYNTAX GUIDELINES:
1. Start with 'sankey-beta' (MUST use beta version)
2. Define nodes with values:
   - Node [value]
3. Define links between nodes:
   - Source --> Target [value]
4. Values represent the width of the flow
5. Flows are automatically balanced
6. Node names with spaces must use quotes: 'Node Name'
7. All values must be numeric and positive

Example of valid syntax:
\`\`\`mermaid
---
config:
  sankey:
    showValues: false
---
sankey-beta

Agricultural 'waste',Bio-conversion,124.729
Bio-conversion,Liquid,0.597
Bio-conversion,Losses,26.862
Bio-conversion,Solid,280.322
Bio-conversion,Gas,81.144
Biofuel imports,Liquid,35
Biomass imports,Solid,35
Coal imports,Coal,11.606
Coal reserves,Coal,63.965
Coal,Solid,75.571
District heating,Industry,10.639
District heating,Heating and cooling - commercial,22.505
District heating,Heating and cooling - homes,46.184
Electricity grid,Over generation / exports,104.453
Electricity grid,Heating and cooling - homes,113.726
Electricity grid,H2 conversion,27.14
Electricity grid,Industry,342.165
Electricity grid,Road transport,37.797
Electricity grid,Agriculture,4.412
Electricity grid,Heating and cooling - commercial,40.858
Electricity grid,Losses,56.691
Electricity grid,Rail transport,7.863
Electricity grid,Lighting & appliances - commercial,90.008
Electricity grid,Lighting & appliances - homes,93.494
Gas imports,Ngas,40.719
Gas reserves,Ngas,82.233
Gas,Heating and cooling - commercial,0.129
Gas,Losses,1.401
Gas,Thermal generation,151.891
Gas,Agriculture,2.096
Gas,Industry,48.58
Geothermal,Electricity grid,7.013
H2 conversion,H2,20.897
H2 conversion,Losses,6.242
H2,Road transport,20.897
Hydro,Electricity grid,6.995
Liquid,Industry,121.066
Liquid,International shipping,128.69
Liquid,Road transport,135.835
Liquid,Domestic aviation,14.458
Liquid,International aviation,206.267
Liquid,Agriculture,3.64
Liquid,National navigation,33.218
Liquid,Rail transport,4.413
Marine algae,Bio-conversion,4.375
Ngas,Gas,122.952
Nuclear,Thermal generation,839.978
Oil imports,Oil,504.287
Oil reserves,Oil,107.703
Oil,Liquid,611.99
Other waste,Solid,56.587
Other waste,Bio-conversion,77.81
Pumped heat,Heating and cooling - homes,193.026
Pumped heat,Heating and cooling - commercial,70.672
Solar PV,Electricity grid,59.901
Solar Thermal,Heating and cooling - homes,19.263
Solar,Solar Thermal,19.263
Solar,Solar PV,59.901
Solid,Agriculture,0.882
Solid,Thermal generation,400.12
Solid,Industry,46.477
Thermal generation,Electricity grid,525.531
Thermal generation,Losses,787.129
Thermal generation,District heating,79.329
Tidal,Electricity grid,9.452
UK land based bioenergy,Bio-conversion,182.01
Wave,Electricity grid,19.013
Wind,Electricity grid,289.366
\`\`\``;

    case 'XY Chart':
      return `${basePrompt}

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

    case 'System Diagram':
      return `${basePrompt}

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
    W -->|Store Results| DB1
    
    S2 -->|Call| ES{{External API}}
    ES -->|Response| S2
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
