interface DiagramExample {
  explanation: string;
  code: string;
}

export const diagramExamples: Record<string, DiagramExample> = {
  Flowchart: {
    explanation:
      'Flowcharts visualize processes or workflows using connected nodes. They use different shapes to represent different types of steps: rectangles for processes, diamonds for decisions, and rounded rectangles for start/end points. Arrows show the flow direction and can be labeled to explain conditions.',
    code: `flowchart TD
  Start((Start))
  Process1[Initial Process]
  Decision{Is Valid?}
  SubProcess[[Subroutine]]
  Data[(Database)]
  Error[Error Handling]
  Success[Success Outcome]
  End((END))

  subgraph Preparation Phase
    Start --> Process1
    Process1 -->|Check| Decision
  end

  Decision -->|Yes| SubProcess
  Decision -->|No| Error
  SubProcess --> Data
  Data -.->|Update| Success
  Error ===> End
  Success --> End`,
  },
  'Sequence Diagram': {
    explanation:
      'Sequence diagrams show how processes interact with each other in a time-ordered sequence. They display participants (actors/systems) as vertical lifelines and messages between them as horizontal arrows. You can show activation, loops, alternatives, and notes for additional context.',
    code: `sequenceDiagram
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
    deactivate Frontend`,
  },
  'Class Diagram': {
    explanation:
      'Class diagrams represent the structure of a system by showing classes, attributes, methods, and relationships between classes. They use UML notation to show inheritance, composition, aggregation, and association relationships. Access modifiers (+public, -private, #protected) can be specified for attributes and methods.',
    code: `classDiagram
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
    Student "many" --> "many" Course: enrolls`,
  },
  'State Diagram': {
    explanation:
      'State diagrams illustrate the different states of a system and the transitions between them. They show how an entity responds to events by changing from one state to another. States can be simple or composite (containing nested states), and transitions can be labeled with events that trigger them.',
    code: `stateDiagram-v2
  direction LR
  [*] --> StateA
  StateA --> StateB : Event1
  StateA --> StateC : Event2
  StateB : Description for StateB
  state StateC {
    [*] --> SubState1
    SubState1 --> SubState2
    --
    [*] --> SubState3
    SubState3 --> SubState4
  }
  StateC --> StateD : Event3
  state ChoiceState <<choice>>
  StateD --> ChoiceState
  ChoiceState --> StateE : Condition1
  ChoiceState --> StateF : Condition2
  StateE --> [*]
  StateF --> [*]
  note right of StateA
    This is a note for StateA.
  end note
  note left of StateD : Note for StateD
  classDef important fill:#f96,stroke:#333,stroke-width:2px;
  class StateA,StateD important`,
  },
  'Entity Relationship Diagram': {
    explanation:
      "ERD diagrams show the relationships between entities in a database or system. They define entities with their attributes and the cardinality of relationships (one-to-one, one-to-many, many-to-many). Mermaid uses crow's foot notation for cardinality and allows defining attributes within entity blocks.",
    code: `erDiagram
USER {
  int user_id PK
  string username
  string email
  int address_id FK
}
ADDRESS {
  int address_id PK
  string street
  string city
  string postal_code
  int country_id FK
}
COUNTRY {
  int country_id PK
  string country_name
}
ORDER {
  int order_id PK
  date order_date
  float total_amount
  int user_id FK
}
PRODUCT {
  int product_id PK
  string product_name
  float price
}
ORDER_ITEM {
  int order_item_id PK
  int order_id FK
  int product_id FK
  int quantity
}
USER ||--|{ ORDER : "places"
ORDER ||--|{ ORDER_ITEM : "includes"
PRODUCT ||--|{ ORDER_ITEM : "is included in"
USER }|..|{ ADDRESS : "resides at"
ADDRESS ||--|| COUNTRY : "located in"`,
  },
  'Gantt Chart': {
    explanation:
      'Gantt charts display project schedules with tasks, durations, and dependencies. They show tasks as horizontal bars along a timeline, with the length representing duration. Tasks can be organized into sections, and dependencies between tasks can be defined. Milestones can be marked at specific points in time.',
    code: `gantt
title Project Development Timeline
dateFormat  YYYY-MM-DD
axisFormat  %b %d, %Y
excludes    weekends
section Planning
Define project scope       :done,    p1, 2025-01-01, 2025-01-05
Identify stakeholders      :done,    p2, after p1, 2d
section Development
Design phase               :crit,    d1, after p2, 7d
Implementation             :active,  d2, after d1, 14d
Testing                    :         d3, after d2, 7d
section Deployment
Deployment preparation     :         dp1, after d3, 3d
Final deployment           :milestone, dp2, after dp1, 0d`,
  },
  'Pie Chart': {
    explanation:
      'Pie charts show the composition of a whole by dividing it into proportional segments. Each segment represents a category with a value that determines its size relative to the whole. Pie charts are useful for showing percentage distributions and comparing parts to the whole.',
    code: `pie
    title Distribution of Customer Types
    "Enterprise" : 45.2
    "Small Business" : 30.8
    "Consumer" : 24.0`,
  },
  'User Journey': {
    explanation:
      'User Journey diagrams visualize the path a user takes through a system, showing their experience and interactions. Each step is rated on a scale of 1-5 (1=very negative, 5=very positive) to indicate user satisfaction. Steps are organized into sections representing different stages of the journey, and multiple actors can be assigned to each step.',
    code: `journey
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
      Receive product: 5: User`,
  },
  'Quadrant Chart': {
    explanation:
      'Quadrant charts divide data into four sections based on two axes, useful for prioritization and strategic planning. Points are plotted with x,y coordinates ranging from 0 to 1, where (0,0) is the bottom-left corner. Each quadrant can be labeled to describe the characteristics of items in that section.',
    code: `quadrantChart
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
    Product F: [0.35, 0.78]`,
  },
  'Requirement Diagram': {
    explanation:
      'Requirement diagrams show system requirements and their relationships, following SysML v1.6 specifications. Requirements have properties like ID, text description, risk level, and verification method. Elements represent implementations that satisfy requirements. Relationships between requirements and elements can be of various types: contains, satisfies, derives, verifies, refines, copies, or traces.',
    code: `    requirementDiagram

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
    test_req <- copies - test_entity2`,
  },
  'Gitgraph Diagram': {
    explanation:
      'Gitgraph diagrams visualize Git branch operations and commit history. They show branches as parallel lines with commits as nodes. Operations like branch creation, checkout, commit, and merge are represented sequentially. Tags can be added to specific commits, and branch order can be customized.',
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
    commit
    checkout develop
    merge feature
    commit
    checkout main
    merge develop
    commit tag:"v1.0.0"`,
  },
  Mindmap: {
    explanation:
      'Mindmaps organize information hierarchically around a central concept. They use indentation to define hierarchy levels and can use different node shapes (default, square, rounded, circle, bang, cloud, hexagon) to distinguish between different types of information. Icons and styling classes can be added for visual enhancement.',
    code: `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid`,
  },
  Timeline: {
    explanation:
      'Timeline diagrams show events or milestones in chronological order. Each time point is defined with a date/time followed by a colon, and multiple events can be listed under a single time point with indentation. Time points are displayed in the order they appear in the code, making it easy to visualize project timelines or historical events.',
    code: `timeline
    title Major Technological Advancements
    section The Early Years
        1960s : Introduction of COBOL
               : Development of ARPANET
    section Personal Computing Era
        1970s : Release of the first microprocessor
               : Introduction of the Apple II
        1980s : IBM PC launched
               : Emergence of MS-DOS
               : Introduction of the Macintosh
    section The Internet Age
        1990s : World Wide Web goes public
               : Introduction of Windows 95
               : Rise of dot-com companies
        2000s : Launch of social media platforms
               : Introduction of the iPhone
               : Emergence of cloud computing
    section Modern Era
        2010s : Advancement in artificial intelligence
               : Growth of blockchain technology
        2020s : Expansion of 5G networks
               : Developments in quantum computing`,
  },
  'Sankey Diagram': {
    explanation:
      "Sankey diagrams visualize flow quantities, where the width of arrows is proportional to the flow rate. Nodes represent entities with values, and links between nodes show the flow amount. They're useful for visualizing energy transfers, material flows, or budget allocations where proportional representation is important.",
    code: `sankey-beta

%% source,target,value
Electricity grid,Over generation / exports,104.453
Electricity grid,Heating and cooling - homes,113.726
Electricity grid,H2 conversion,27.14
`,
  },
  'XY Chart': {
    explanation:
      'XY charts plot data points on a two-dimensional graph, useful for showing relationships between variables. They support both line and bar series, with customizable axes and titles. The x-axis can be categorical (labels) or numerical (min to max range), and multiple data series can be displayed on the same chart for comparison.',
    code: `%%{init: { "themeVariables": {"xyChart": {"backgroundColor": "#f0f0f0", "titleColor": "#333333", "xAxisLabelColor": "#666666", "xAxisTitleColor": "#333333", "xAxisTickColor": "#666666", "xAxisLineColor": "#666666", "yAxisLabelColor": "#666666", "yAxisTitleColor": "#333333", "yAxisTickColor": "#666666", "yAxisLineColor": "#666666", "plotColorPalette": "#ff0000, #00ff00, #0000ff"} } }}%%
xychart-beta horizontal
    title "Monthly Sales and Profit Analysis"
    x-axis ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    y-axis "Amount ($)" 0 --> 12000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [4500, 5800, 7000, 8000, 9000, 10000, 10500, 9800, 8800, 8000, 6500, 5500]`,
  },
};
