# Features

## Instructions

1. **Initial Input Area**

   - Add a textarea styled with TailwindCSS where users can enter the initial description of the diagram (e.g., "A customer places an order").
   - Add a dropdown menu styled with TailwindCSS to select the diagram type, with options: "Process Flow", "EERD", and "System Diagram".

2. **Follow-Up Prompt Area**

   - Add a second textarea that appears only after the initial diagram has been generated.
   - This textarea allows users to input follow-up prompts to refine the diagram (e.g., "Add a payment step after the order").

3. **Generate/Refine Button**

   - Add a button styled with TailwindCSS labeled "Generate" to create the initial diagram from the user's description and selected diagram type.
   - After the initial diagram is generated, change the button label to "Refine" to allow users to submit follow-up prompts.
   - Ensure the button is disabled during API calls to prevent multiple submissions.

4. **Diagram Display Area**

   - Add a section styled with TailwindCSS to display the generated Mermaid code as a visual diagram using the Mermaid library.
   - Ensure the diagram updates automatically when new Mermaid code is generated or refined.

5. **Loading Indicator**

   - Display a loading spinner styled with TailwindCSS while the application is waiting for the API response during generation or refinement.

6. **Error Handling**

   - Display error messages styled with TailwindCSS if the API call fails or if the AI cannot generate valid Mermaid code.
   - Ensure the error message is clear and instructs the user on how to proceed (e.g., "Please try rephrasing your description").

7. **State Management**

   - Use React hooks (`useState`) to manage the following states:
     - Initial input description.
     - Selected diagram type.
     - Follow-up prompt input.
     - Generated Mermaid code.
     - Conversation history for maintaining context with the AI.
     - Loading state.
     - Error messages.

8. **API Integration**

   - Create a NextJS API route at `/pages/api/generate.ts` to handle requests to the OpenAI API.
   - In the API route, construct a conversation history that includes the initial prompt and any follow-up prompts.
   - Send the conversation history to the OpenAI API to generate or refine the Mermaid code.
   - Ensure the API route securely handles the OpenAI API key using environment variables.

9. **Optional Features**

   - Add a "Copy Code" button to allow users to copy the generated Mermaid code to their clipboard.
   - Add an "Export Diagram" button to export the rendered diagram as an image (PNG or SVG).
   - Add a "Reset" button to clear all inputs and start over with a new diagram.

10. **Deployment**
    - Ensure the application can be deployed on Vercel.
    - Set the `OPENAI_API_KEY` as an environment variable in Vercel to securely handle the API key.
