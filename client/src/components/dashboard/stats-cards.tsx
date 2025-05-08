import { 
  Users, 
  MessageCircle, 
  ShieldCheck, 
  TrendingUp,
  Calendar,
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  messageCount: number;
  recipientCount: number;
  trustedContactCount: number;
}

export default function StatsCards({
  messageCount,
  recipientCount,
  trustedContactCount
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Messages"
        value={messageCount}
        icon={<MessageCircle className="h-5 w-5" />}
        color="primary"
        description="Total messages created"
      />
      <StatCard
        title="Recipients"
        value={recipientCount}
        icon={<Users className="h-5 w-5" />}
        color="secondary"
        description="People receiving your messages"
      />
      <StatCard
        title="Trusted Contacts"
        value={trustedContactCount}
        icon={<ShieldCheck className="h-5 w-5" />}
        color="accent"
        description="Contacts who can verify your passing"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "accent" | "success";
  description?: string;
}

function StatCard({ title, value, icon, color, description }: StatCardProps) {
  const colorClasses = {
    primary: "bg-blue-50 text-blue-600",
    secondary: "bg-purple-50 text-purple-600",
    accent: "bg-pink-50 text-pink-600",
    success: "bg-green-50 text-green-600",
  };
  
  const borderClasses = {
    primary: "border-blue-100",
    secondary: "border-purple-100",
    accent: "border-pink-100",
    success: "border-green-100",
  };
  
  return (
    <Card className={cn("overflow-hidden", borderClasses[color])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <div className={cn("p-1.5 rounded-md", colorClasses[color])}>
            {icon}
          </div>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}