# Business Requirements Document

## Instructions

- Build a NextJS application that converts user-provided text descriptions into visual diagrams using AI-generated Mermaid code.
- Allow users to select a diagram type from a dropdown menu with options: "Process Flow", "EERD", and "System Diagram".
- Provide a textarea for users to input an initial description of the diagram they want to create.
- Include a second textarea that appears after the initial diagram is generated, allowing users to input follow-up prompts to refine the diagram.
- Use the OpenAI API to generate and refine Mermaid code based on the user's initial input and subsequent follow-up prompts.
- Render the generated Mermaid code as a visual diagram on the page using the Mermaid library.
- Ensure that users cannot manually edit the Mermaid code; all refinements must be made through follow-up prompts.
- Style the application using TailwindCSS to create a clean, responsive, and user-friendly interface.
- Implement error handling to display user-friendly messages if the AI fails to generate valid Mermaid code or if there are issues with the API calls.
- Use NextJS API routing to handle requests to the OpenAI API securely.
- Ensure the application is deployable on Vercel, with environment variables set for the OpenAI API key.
