import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { QueryForm } from "@/components/queries/QueryForm";
import { QueryCard } from "@/components/queries/QueryCard";
import { useToast } from "@/hooks/use-toast";
import { Search, LogOut, Bell, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  responded_at: string | null;
}

interface Profile {
  full_name: string;
}

export default function StudentDashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchNotices();
    fetchQueries();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notices",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQueries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load queries",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">College Connect</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {profile?.full_name || "Student"}!</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="notices" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="notices" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notices
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              My Queries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notices" className="space-y-6">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading notices...</p>
            ) : filteredNotices.length === 0 ? (
              <p className="text-center text-muted-foreground">No notices found</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredNotices.map((notice) => (
                  <NoticeCard key={notice.id} {...notice} createdAt={notice.created_at} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <QueryForm onQuerySubmitted={fetchQueries} />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Questions</h3>
              {queries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No queries yet. Ask your first question above!</p>
              ) : (
                <div className="grid gap-4">
                  {queries.map((query) => (
                    <QueryCard
                      key={query.id}
                      question={query.question}
                      status={query.status}
                      response={query.response}
                      createdAt={query.created_at}
                      respondedAt={query.responded_at}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}