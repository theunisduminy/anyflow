import mermaid from 'mermaid';
import { MutableRefObject, RefObject } from 'react';

type ContainerRef =
  | RefObject<HTMLDivElement>
  | MutableRefObject<HTMLDivElement | null>;

export const renderDiagram = async (
  containerRef: ContainerRef,
  code: string,
  isReady: boolean,
  isFullScreen: boolean,
  setDiagramHeight: (height: number | null) => void
) => {
  if (!containerRef.current || !code || !isReady) {
    console.log('Skipping render - prerequisites not met:', {
      containerExists: !!containerRef.current,
      codeExists: !!code,
      isReady,
    });
    return;
  }

  const container = containerRef.current;

  try {
    console.log('Starting render with code:', code);

    // Clear previous content
    container.innerHTML = '';

    // Create the diagram container
    const diagramContainer = document.createElement('div');
    diagramContainer.className = 'mermaid';
    diagramContainer.style.background = 'white';
    diagramContainer.textContent = code;

    // Add to DOM
    container.appendChild(diagramContainer);

    // Force a small delay to ensure DOM is ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Render the diagram
    await mermaid.run({
      nodes: [diagramContainer],
      suppressErrors: false,
    });

    // Check if rendering worked
    const svg = container.querySelector('svg');
    if (svg) {
      console.log('SVG rendered successfully');

      // Allow SVG to use its natural size
      svg.style.maxWidth = 'none';
      svg.style.height = 'auto';
      svg.style.display = 'block';
      svg.removeAttribute('width');
      svg.setAttribute('height', isFullScreen ? '100%' : 'auto');

      // Get the original dimensions from viewBox
      const viewBox = svg.getAttribute('viewBox');
      if (viewBox) {
        const [, , , height] = viewBox.split(' ').map(Number);

        // Determine if we're in full-screen mode based on className
        const isFullScreenClass =
          container.className.includes('max-w-[80vw]') ||
          container.className.includes('max-h-[80vh]');

        // Use either the prop or the class detection
        const effectiveFullScreen = isFullScreen || isFullScreenClass;

        // Update container height only if not in full screen mode
        if (!effectiveFullScreen) {
          setDiagramHeight(height + 40); // Add padding to original height
        }
      }
    } else {
      console.error('No SVG found after rendering');
      throw new Error('Failed to render diagram - no SVG produced');
    }
  } catch (error) {
    console.error('Error rendering diagram:', error);

    // Show error message
    if (container) {
      container.innerHTML = `
        <div class="p-4 text-red-500 border border-red-300 rounded bg-red-50">
          <p class="font-medium">Error rendering diagram</p>
          <p class="text-sm mt-1">Failed to render the diagram. Please check the Mermaid syntax.</p>
          <details class="mt-2">
            <summary class="cursor-pointer text-sm font-medium">View Mermaid Code</summary>
            <pre class="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">${code
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')}</pre>
          </details>
          <details class="mt-2">
            <summary class="cursor-pointer text-sm font-medium">Error Details</summary>
            <pre class="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">${String(
              error
            )
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')}</pre>
          </details>
        </div>
      `;
    }
  }
};
