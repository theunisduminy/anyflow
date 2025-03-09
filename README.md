# AnyFlow

Convert natural language descriptions into beautiful visual diagrams using AI-powered Mermaid code generation.

## Overview

AnyFlow is a modern web application that bridges the gap between natural language and visual diagrams. Using the power of AI, it transforms your text descriptions into professional Mermaid diagrams, making it perfect for creating:

- Process flows and flowcharts
- Entity-Relationship Diagrams (ERD)
- System architecture diagrams
- And more!

## ✨ Features

- 🤖 **AI-Powered Generation**: Leverages OpenAI's API to understand and convert text descriptions into accurate diagrams
- 📊 **Multiple Diagram Types**: 
  - Process Flow Diagrams
  - Extended Entity-Relationship Diagrams (EERD)
  - System Architecture Diagrams
- 🔄 **Interactive Refinement**: Iteratively improve your diagrams with follow-up prompts
- 📋 **Code Export**: Copy generated Mermaid code directly to your clipboard
- 🎨 **Modern UI/UX**: Built with TailwindCSS and shadcn/ui for a beautiful, responsive experience
- ⚡ **Fast Performance**: Built on Next.js for optimal performance and SEO

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- pnpm package manager
- OpenAI API key

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

3. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:
     ```env
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage Guide

1. **Select Diagram Type**
   - Choose from the available diagram types in the dropdown menu
   - Each type is optimized for specific use cases

2. **Enter Description**
   - Write a natural language description of your desired diagram
   - Be as specific as possible for better results

3. **Generate Diagram**
   - Click "Generate Diagram" to create your initial visualization
   - The AI will process your description and generate appropriate Mermaid code

4. **Refine Your Diagram**
   - Use the follow-up prompt field to make adjustments
   - Request changes like "make the arrows bidirectional" or "add a new node"
   - Click "Refine Diagram" to apply changes

5. **Export**
   - Use the "Copy Code" button to get the Mermaid code
   - Paste the code in any Mermaid-compatible editor

## 🛠️ Technology Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) 14
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration**: [OpenAI API](https://platform.openai.com/)
- **Diagramming**: [Mermaid](https://mermaid.js.org/)

## 🚀 Deployment

Deploy easily on Vercel:

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Configure the `OPENAI_API_KEY` environment variable
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �� Acknowledgments

- Thanks to OpenAI for providing the AI capabilities
- Thanks to the Mermaid.js team for the amazing diagramming tool
- Thanks to all contributors and users of AnyFlow

---

Made with ❤️ by [Your Name]
