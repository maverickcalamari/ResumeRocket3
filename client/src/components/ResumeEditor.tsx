
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Undo, Redo, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface ResumeEditorProps {
  resume?: {
    id: number;
    originalContent: string;
    industry: string;
  };
  onUpdate: (resume: any) => void;
}

export default function ResumeEditor({ resume, onUpdate }: ResumeEditorProps) {
  if (!resume || !resume.originalContent) {
    return <p className="text-sm text-gray-500">No resume loaded.</p>;
  }

  const [content, setContent] = useState(resume.originalContent);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          originalContent: content,
          industry: resume.industry 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update resume');
      }

      return response.json();
    },
    onSuccess: (updatedResume) => {
      queryClient.invalidateQueries({ queryKey: ['/api/resumes'] });
      onUpdate(updatedResume);
      toast({
        title: "Resume Updated",
        description: "Your resume has been updated and re-analyzed.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ content });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHistory(prev => [...prev, content]);
    setRedoStack([]);
    setContent(e.target.value);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([content, ...redoStack]);
    setContent(prev);
    setHistory(history.slice(0, history.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory(prev => [...prev, content]);
    setContent(next);
    setRedoStack(redoStack.slice(1));
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Resume Editor</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={history.length === 0}>
              <Undo className="h-4 w-4 mr-1" /> Undo
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
              <Redo className="h-4 w-4 mr-1" /> Redo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-1" />
              {updateMutation.isPending ? 'Saving...' : 'Save & Re-analyze'}
            </Button>
          </div>
        </div>

        {isPreview ? (
          <div className="border border-gray-200 rounded-lg p-6 bg-white min-h-96 prose">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={handleChange}
            minRows={18}
            className="min-h-96 font-mono"
            spellCheck={true}
            autoCorrect="on"
            autoComplete="on"
          />
        )}
      </CardContent>
    </Card>
  );
}
