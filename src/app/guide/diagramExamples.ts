interface DiagramExample {
  explanation: string;
  code: string;
}

export const diagramExamples: Record<string, DiagramExample> = {
  Flowchart: {
    explanation:
      'Flowcharts visualize processes or workflows using connected nodes. Perfect for showing step-by-step procedures or decision trees.',
    code: `graph TD
    A[Start] --> B{Is it raining?}
    B -->|Yes| C[Take umbrella]
    B -->|No| D[Enjoy the weather]
    C --> E[End]
    D --> E`,
  },
  'Sequence Diagram': {
    explanation:
      'Sequence diagrams show how processes interact with each other in a time-ordered sequence. Great for illustrating system interactions or API flows.',
    code: `sequenceDiagram
    participant User
    participant Client
    participant Server
    User->>Client: Click Login
    Client->>Server: POST /login
    Server-->>Client: Return Token
    Client-->>User: Show Dashboard`,
  },
  'Class Diagram': {
    explanation:
      'Class diagrams represent the structure of a system by showing classes, attributes, methods, and relationships between classes.',
    code: `classDiagram
    class Animal {
      +String name
      +makeSound()
    }
    class Dog {
      +bark()
    }
    class Cat {
      +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  'State Diagram': {
    explanation:
      'State diagrams illustrate the different states of a system and the transitions between them.',
    code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
  },
  'Entity Relationship Diagram': {
    explanation:
      'ERD diagrams show the relationships between entities in a database or system.',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
      string name
      string email
    }
    ORDER {
      int orderNumber
      date orderDate
    }`,
  },
  'Gantt Chart': {
    explanation:
      'Gantt charts display project schedules with tasks, durations, and dependencies.',
    code: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements :a1, 2024-01-01, 7d
    Design      :a2, after a1, 5d
    section Development
    Coding      :after a2, 10d
    Testing     :5d`,
  },
  'Pie Chart': {
    explanation:
      'Pie charts show the composition of a whole by dividing it into proportional segments.',
    code: `pie title Market Share
    "Product A" : 40
    "Product B" : 30
    "Product C" : 30`,
  },
  'User Journey': {
    explanation:
      'User Journey diagrams visualize the path a user takes through a system, showing their experience and interactions.',
    code: `journey
    title User Shopping Experience
    section Browse
      View Products: 5: User
      Search: 4: User
      Filter Results: 3: User
    section Purchase
      Add to Cart: 5: User
      Checkout: 3: User, System
      Payment: 3: User, System
    section Post-Purchase
      Order Confirmation: 5: System
      Tracking: 4: User, System`,
  },
  'Quadrant Chart': {
    explanation:
      'Quadrant charts divide data into four sections, useful for prioritization and strategic planning.',
    code: `quadrantChart
    title Prioritization Matrix
    x-axis Low Priority --> High Priority
    y-axis Low Effort --> High Effort
    quadrant-1 Quick Wins
    quadrant-2 Major Projects
    quadrant-3 Fill Ins
    quadrant-4 Time Sinks
    Task A: [0.4, 0.3]
    Task B: [0.8, 0.7]
    Task C: [0.3, 0.8]
    Task D: [0.7, 0.2]`,
  },
  'Requirement Diagram': {
    explanation:
      'Requirement diagrams show system requirements and their relationships, useful for software planning.',
    code: `requirementDiagram
    requirement System {
      id: 1
      text: The system must handle user authentication
      risk: high
      verifymethod: test
    }
    element AuthModule {
      type: module
    }
    System - satisfies -> AuthModule`,
  },
  'Gitgraph Diagram': {
    explanation:
      'Gitgraph diagrams visualize Git branch operations and commit history.',
    code: `gitGraph
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
    checkout main
    merge feature`,
  },
  'C4 Diagram': {
    explanation:
      'C4 diagrams show the architecture of software systems at different levels of detail.',
    code: `C4Context
    title System Context diagram for Internet Banking System
    Enterprise_Boundary(b0, "BankingSystem") {
      Person(customer, "Banking Customer", "A customer of the bank")
      System(banking_system, "Internet Banking System", "Allows customers to view their bank accounts")
    }
    Rel(customer, banking_system, "Uses")`,
  },
  Mindmap: {
    explanation:
      'Mindmaps organize information hierarchically around a central concept.',
    code: `mindmap
    root((Project))
      Planning
        Timeline
        Resources
        Budget
      Development
        Frontend
        Backend
        Database
      Testing
        Unit Tests
        Integration
        QA`,
  },
  Timeline: {
    explanation:
      'Timeline diagrams show events or milestones in chronological order.',
    code: `timeline
    title Project Timeline
    section Planning
      Requirements : 2024-01
      Design : 2024-02
    section Development
      Phase 1 : 2024-03 : 2024-04
      Phase 2 : 2024-05 : 2024-06
    section Launch
      Beta : 2024-07
      Release : 2024-08`,
  },
  'Sankey Diagram': {
    explanation:
      'Sankey diagrams visualize flow quantities, where the width of arrows is proportional to the flow rate.',
    code: `sankey-beta
    Traffic,Website,100
    Website,Homepage,60
    Website,Blog,40
    Homepage,Product,40
    Homepage,About,20
    Blog,Product,30
    Blog,Contact,10`,
  },
  'XY Chart': {
    explanation:
      'XY charts plot data points on a two-dimensional graph, useful for showing relationships between variables.',
    code: `xychart-beta
    title "Sales Growth"
    x-axis [jan, feb, mar, apr, may, jun]
    y-axis "Sales (K)" 0 --> 100
    line [10, 20, 45, 32, 67, 89]
    bar [5, 15, 30, 25, 50, 70]`,
  },
  'Block Diagram': {
    explanation:
      'Block diagrams show the high-level structure of a system using connected blocks.',
    code: `graph TD
    subgraph Main[Main System]
    direction LR
    end
    
    subgraph IO[Input/Output]
    direction LR
    Input[Input Module]
    Output[Output Module]
    end
    
    subgraph Processing[Processing Layer]
    direction LR
    DB[(Database)]
    API[API Service]
    Logic[Business Logic]
    end
    
    Main --> IO
    Input --> Logic
    Logic --> DB
    Logic --> API
    API --> Output
    
    style Main fill:#f9f,stroke:#333,stroke-width:2px
    style IO fill:#bbf,stroke:#333,stroke-width:1px
    style Processing fill:#dfd,stroke:#333,stroke-width:1px`,
  },
  'Process Flow': {
    explanation:
      'Process flow diagrams illustrate the steps and decisions in a business process or workflow.',
    code: `graph LR
    A[Start] --> B{Input Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Request New Input]
    C --> E[Save Results]
    D --> B
    E --> F[End]`,
  },
  'System Diagram': {
    explanation:
      'System diagrams show the components and interactions within a complex system.',
    code: `graph TB
    subgraph Frontend
    UI[User Interface]
    Forms[Forms]
    end
    subgraph Backend
    API[API Server]
    Auth[Authentication]
    DB[(Database)]
    end
    UI --> API
    Forms --> API
    API --> Auth
    API --> DB`,
  },
};
