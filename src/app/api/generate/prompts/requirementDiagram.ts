import { BASE_PROMPT } from './types';

export const requirementDiagramPrompt = `${BASE_PROMPT}

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
