import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface QueryFormProps {
  onQuerySubmitted: () => void;
}

export function QueryForm({ onQuerySubmitted }: QueryFormProps) {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("queries").insert({
        student_id: user.id,
        question: question.trim(),
      });

      if (error) throw error;

      toast({
        title: "Query submitted!",
        description: "Your question has been sent to the admin team.",
      });

      setQuestion("");
      onQuerySubmitted();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <CardTitle>Ask a Question</CardTitle>
        </div>
        <CardDescription>Get help from faculty and administration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea
              id="question"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={4}
              className="resize-none"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} variant="accent" className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Query"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
