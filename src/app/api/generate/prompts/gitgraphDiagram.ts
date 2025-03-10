import { BASE_PROMPT } from './types';

export const gitgraphDiagramPrompt = `${BASE_PROMPT}

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
