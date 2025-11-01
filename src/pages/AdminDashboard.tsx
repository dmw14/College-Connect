import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

interface Query {
  id: string;
  question: string;
  status: string;
  response: string | null;
  created_at: string;
  student_id: string;
}

export default function AdminDashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [newNotice, setNewNotice] = useState({ title: "", content: "", category: "general" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotices();
    fetchQueries();
  }, []);

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load notices" });
      return;
    }
    setNotices(data || []);
  };

  const fetchQueries = async () => {
    const { data, error } = await supabase
      .from("queries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load queries" });
      return;
    }
    setQueries(data || []);
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("notices").insert([
        {
          title: newNotice.title,
          content: newNotice.content,
          category: newNotice.category as "general" | "academic" | "exam" | "event" | "urgent",
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      toast({ title: "Success!", description: "Notice created successfully" });
      setNewNotice({ title: "", content: "", category: "general" });
      fetchNotices();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRespondToQuery = async (queryId: string, response: string, status: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("queries")
        .update({
          response,
          status: status as "pending" | "in_progress" | "resolved",
          responded_by: user.id,
          responded_at: new Date().toISOString(),
        })
        .eq("id", queryId);

      if (error) throw error;

      toast({ title: "Success!", description: "Response sent successfully" });
      fetchQueries();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage notices and respond to queries</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="notices" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="notices">Manage Notices</TabsTrigger>
            <TabsTrigger value="queries">Student Queries</TabsTrigger>
          </TabsList>

          <TabsContent value="notices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Notice
                </CardTitle>
                <CardDescription>Post important information for students</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateNotice} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newNotice.category}
                      onValueChange={(value) => setNewNotice({ ...newNotice, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      required
                      rows={5}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} variant="accent" className="w-full">
                    {isSubmitting ? "Creating..." : "Create Notice"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Published Notices</h3>
              {notices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No notices yet</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {notices.map((notice) => (
                    <NoticeCard key={notice.id} {...notice} createdAt={notice.created_at} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <div className="space-y-4">
              {queries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No queries yet</p>
              ) : (
                queries.map((query) => (
                  <QueryResponseCard key={query.id} query={query} onRespond={handleRespondToQuery} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function QueryResponseCard({
  query,
  onRespond,
}: {
  query: Query;
  onRespond: (id: string, response: string, status: string) => Promise<void>;
}) {
  const [response, setResponse] = useState(query.response || "");
  const [status, setStatus] = useState(query.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onRespond(query.id, response, status);
    setIsSubmitting(false);
  };

  const statusColors: Record<string, "warning" | "info" | "success"> = {
    pending: "warning",
    in_progress: "info",
    resolved: "success",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{query.question}</CardTitle>
          <Badge variant={statusColors[query.status]} className="capitalize">
            {query.status.replace("_", " ")}
          </Badge>
        </div>
        <CardDescription>Submitted on {new Date(query.created_at).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`status-${query.id}`}>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`response-${query.id}`}>Response</Label>
          <Textarea
            id={`response-${query.id}`}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            placeholder="Type your response here..."
          />
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting || !response} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Sending..." : "Send Response"}
        </Button>
      </CardContent>
    </Card>
  );
}