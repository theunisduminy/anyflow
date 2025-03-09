import { DiagramGenerator } from '@/components/DiagramGenerator';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <main className="min-h-screen max-w-6xl px-6 mx-auto">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-bold tracking-tight">
            Generate diagrams with AI
          </h1>
          <p className="text-muted-foreground mt-2">
            Convert text descriptions into visual diagrams using AI
          </p>
        </div>
        <DiagramGenerator />
      </div>
      <Toaster />
    </main>
  );
}
