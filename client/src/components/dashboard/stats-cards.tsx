import { Forward, FileHeart, ShieldCheck, TrendingUp } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Messages Stats Card */}
      <StatCard 
        title="Created Messages"
        value={messageCount}
        icon={<Forward />}
        color="primary"
        description={messageCount === 0 ? "No messages yet" : `${messageCount} message${messageCount !== 1 ? 's' : ''} created`}
      />
      
      {/* Recipients Stats Card */}
      <StatCard 
        title="Recipients"
        value={recipientCount}
        icon={<FileHeart />}
        color="secondary"
        description={recipientCount === 0 ? "No recipients yet" : `${recipientCount} recipient${recipientCount !== 1 ? 's' : ''} added`}
      />
      
      {/* Trusted Contacts Stats Card */}
      <StatCard 
        title="Trusted Contacts"
        value={trustedContactCount}
        icon={<ShieldCheck />}
        color="accent"
        description={trustedContactCount === 0 ? "No trusted contacts yet" : `${trustedContactCount} contact${trustedContactCount !== 1 ? 's' : ''} trusted`}
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
    primary: {
      bgLight: "bg-primary-50",
      bgDark: "bg-primary",
      text: "text-primary-700",
      border: "border-primary-100",
      gradient: "from-primary-50 to-primary-100/50"
    },
    secondary: {
      bgLight: "bg-secondary-50",
      bgDark: "bg-secondary",
      text: "text-secondary-700",
      border: "border-secondary-100",
      gradient: "from-secondary-50 to-secondary-100/50"
    },
    accent: {
      bgLight: "bg-accent-50",
      bgDark: "bg-accent",
      text: "text-accent-700",
      border: "border-accent-100",
      gradient: "from-accent-50 to-accent-100/50"
    },
    success: {
      bgLight: "bg-green-50",
      bgDark: "bg-green-500",
      text: "text-green-700",
      border: "border-green-100",
      gradient: "from-green-50 to-green-100/50"
    }
  };

  const classes = colorClasses[color];
  
  return (
    <div className="group relative overflow-hidden bg-white rounded-xl border border-border/40 shadow-card hover:shadow-hover transition-shadow duration-300">
      {/* Card content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-lg p-3 ${classes.bgLight} ${classes.text}`}>
            {icon}
          </div>
          
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${classes.bgLight} ${classes.text} border ${classes.border} flex items-center`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Active</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <span className="ml-2 text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${classes.gradient}`}></div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
