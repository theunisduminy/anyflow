import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BASE_PROMPT,
  flowchartPrompt,
  sequenceDiagramPrompt,
  classDiagramPrompt,
  stateDiagramPrompt,
  entityRelationshipDiagramPrompt,
  userJourneyPrompt,
  ganttChartPrompt,
  pieChartPrompt,
  quadrantChartPrompt,
  requirementDiagramPrompt,
  gitGraphDiagramPrompt,
  mindmapPrompt,
  timelinePrompt,
  sankeyDiagramPrompt,
  xyChartPrompt,
  systemDiagramPrompt,
} from './prompts';

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
        { error: 'Missing required fields: diagramType, description' },
        { status: 400 },
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
            }`,
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
        { status: 422 },
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
  switch (diagramType) {
    case 'Flowchart':
      return flowchartPrompt;

    case 'Sequence Diagram':
      return sequenceDiagramPrompt;

    case 'Class Diagram':
      return classDiagramPrompt;

    case 'State Diagram':
      return stateDiagramPrompt;

    case 'Entity Relationship Diagram':
    case 'EERD':
      return entityRelationshipDiagramPrompt;

    case 'User Journey':
      return userJourneyPrompt;

    case 'Gantt Chart':
      return ganttChartPrompt;

    case 'Pie Chart':
      return pieChartPrompt;

    case 'Quadrant Chart':
      return quadrantChartPrompt;

    case 'Requirement Diagram':
      return requirementDiagramPrompt;

    case 'Gitgraph Diagram':
      return gitGraphDiagramPrompt;

    case 'Mindmap':
      return mindmapPrompt;

    case 'Timeline':
      return timelinePrompt;

    case 'Sankey Diagram':
      return sankeyDiagramPrompt;

    case 'XY Chart':
      return xyChartPrompt;

    default:
      return `${BASE_PROMPT}

Create a diagram based on the description. Use appropriate Mermaid syntax.`;
  }
}
