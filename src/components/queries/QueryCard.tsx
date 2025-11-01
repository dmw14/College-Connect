import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, CheckCircle, Clock } from "lucide-react";

interface QueryCardProps {
  question: string;
  status: string;
  response?: string | null;
  createdAt: string;
  respondedAt?: string | null;
}

const statusConfig: Record<string, { variant: "default" | "warning" | "success"; icon: typeof Clock; label: string }> = {
  pending: { variant: "warning", icon: Clock, label: "Pending" },
  in_progress: { variant: "info" as any, icon: Clock, label: "In Progress" },
  resolved: { variant: "success", icon: CheckCircle, label: "Resolved" },
};

export function QueryCard({ question, status, response, createdAt, respondedAt }: QueryCardProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-base font-medium">{question}</CardTitle>
              <CardDescription className="mt-1">
                Asked on {format(new Date(createdAt), "MMM dd, yyyy")}
              </CardDescription>
            </div>
          </div>
          <Badge variant={config.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      {response && (
        <CardContent>
          <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-foreground">Response:</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{response}</p>
            {respondedAt && (
              <p className="text-xs text-muted-foreground pt-2">
                Responded on {format(new Date(respondedAt), "MMM dd, yyyy 'at' HH:mm")}
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
