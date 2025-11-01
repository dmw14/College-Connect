import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";

interface NoticeCardProps {
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const categoryColors: Record<string, "default" | "destructive" | "warning" | "success" | "info"> = {
  urgent: "destructive",
  exam: "warning",
  academic: "info",
  event: "success",
  general: "default",
};

export function NoticeCard({ title, content, category, createdAt }: NoticeCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <Bell className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(createdAt), "MMM dd, yyyy")}
              </CardDescription>
            </div>
          </div>
          <Badge variant={categoryColors[category] || "default"} className="capitalize">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}
