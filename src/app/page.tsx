import { DiagramGenerator } from '@/components/DiagramGenerator';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <main className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-bold tracking-tight">
            Generate diagrams with AI
          </h1>
          <p className="text-gray-500 mt-2">
            Convert text descriptions into visual diagrams using AI
          </p>
        </div>

        <DiagramGenerator />
      </div>

      <Toaster />
    </main>
  );
}
