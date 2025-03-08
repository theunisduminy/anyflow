# AI Diagram Generator

A Next.js application that converts text descriptions into visual diagrams using AI-generated Mermaid code.

## Features

- Convert text descriptions into visual diagrams using AI
- Select from different diagram types: Process Flow, EERD, and System Diagram
- Refine diagrams with follow-up prompts
- Copy generated Mermaid code to clipboard
- Responsive design with TailwindCSS and shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- An OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/diagram-ai.git
cd diagram-ai
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Select a diagram type from the dropdown menu.
2. Enter a description of the diagram you want to create.
3. Click "Generate Diagram" to create the initial diagram.
4. Use the follow-up prompt field to refine your diagram.
5. Click "Refine Diagram" to update the diagram based on your follow-up prompt.
6. Use the "Copy Code" button to copy the generated Mermaid code to your clipboard.

## Deployment

This application can be deployed on Vercel:

1. Push your code to a GitHub repository.
2. Import the repository in Vercel.
3. Add the `OPENAI_API_KEY` environment variable in the Vercel project settings.
4. Deploy the application.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI API](https://platform.openai.com/)
- [Mermaid](https://mermaid.js.org/)

## License

This project is licensed under the MIT License.
