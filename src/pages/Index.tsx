import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, Bell, MessageSquare, Search, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">College Connect</span>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center space-y-6 max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Transform College Communication
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern platform connecting students, faculty, and administration. Access information instantly, get quick responses, and stay updated with everything happening on campus.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={() => navigate("/auth")} size="lg" variant="default">
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")} size="lg" variant="outline">
              Create Account
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <FeatureCard
            icon={<Bell className="h-6 w-6" />}
            title="Instant Notices"
            description="Stay updated with real-time academic announcements, exam schedules, and important events"
          />
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Quick Queries"
            description="Get fast responses from faculty and administration for all your questions"
          />
          <FeatureCard
            icon={<Search className="h-6 w-6" />}
            title="Smart Search"
            description="Find any information quickly with our powerful search functionality"
          />
          <FeatureCard
            icon={<CheckCircle className="h-6 w-6" />}
            title="Track Status"
            description="Monitor your query status in real-time and never miss an update"
          />
        </section>

        <section className="bg-card rounded-lg p-8 md:p-12 text-center space-y-4 border shadow-lg">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join your college community today and experience seamless communication and information access.
          </p>
          <Button onClick={() => navigate("/auth")} size="lg" variant="accent" className="mt-4">
            Join Now
          </Button>
        </section>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 College Connect. Built for better campus communication.</p>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
