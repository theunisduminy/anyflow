import mermaid from 'mermaid';

export const initializeMermaid = () => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    look: 'classic',
    securityLevel: 'loose',
    logLevel: 3,
    fontFamily: 'sans-serif',
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      curve: 'basis',
      // Add some spacing controls
      rankSpacing: 30,
      nodeSpacing: 30,
      padding: 15,
    },
    sequence: {
      diagramMarginX: 50,
      diagramMarginY: 10,
      actorMargin: 50,
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
    },
    gantt: {
      titleTopMargin: 25,
      barHeight: 20,
      barGap: 4,
      topPadding: 50,
      leftPadding: 75,
      gridLineStartPadding: 35,
      fontSize: 11,
      sectionFontSize: 11,
      numberSectionStyles: 4,
    },
    er: {
      diagramPadding: 20,
      layoutDirection: 'TB',
      minEntityWidth: 100,
      minEntityHeight: 75,
      entityPadding: 15,
      stroke: 'gray',
      fill: 'honeydew',
      fontSize: 12,
    },
    pie: {
      textPosition: 0.5,
    },
  });
  console.log('Mermaid initialized');
};
