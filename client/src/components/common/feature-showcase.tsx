import { 
  Clock, 
  CreditCard, 
  Eye, 
  FileText, 
  Heart, 
  Lock, 
  MessageSquare, 
  Shield, 
  Sparkles, 
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function FeatureShowcase() {
  const [_, setLocation] = useLocation();

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="px-3 py-1 text-sm border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Advanced Legacy Management
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform offers comprehensive features to ensure your messages reach
              your loved ones exactly as you intended.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Message Creation"
            description="Create written, video or document-based messages to be delivered at the right time."
            colorClass="from-blue-600 to-indigo-700"
            iconBgClass="bg-blue-100 text-blue-700"
            features={["Text messages", "Video recordings", "Document attachments"]}
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6" />}
            title="Delivery Options"
            description="Select precisely when and how your messages will be delivered."
            colorClass="from-purple-600 to-indigo-700"
            iconBgClass="bg-purple-100 text-purple-700"
            features={["Scheduled delivery", "Trigger on passing", "Multiple recipients"]}
            highlight
          />
          <FeatureCard
            icon={<Eye className="h-6 w-6" />}
            title="Anonymous Delivery"
            description="Notify recipients without revealing content or sender identity."
            colorClass="from-pink-600 to-purple-700"
            iconBgClass="bg-pink-100 text-pink-700" 
            features={["Curiosity-driven", "Preview settings", "Custom notifications"]}
          />
          <FeatureCard
            icon={<Lock className="h-6 w-6" />}
            title="Advanced Security"
            description="Your messages are protected with end-to-end encryption."
            colorClass="from-emerald-600 to-teal-700"
            iconBgClass="bg-emerald-100 text-emerald-700"
            features={["End-to-end encryption", "Zero-knowledge design", "Access controls"]}
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Trusted Contacts"
            description="Verified contacts assist with your passing verification process."
            colorClass="from-amber-600 to-orange-700"
            iconBgClass="bg-amber-100 text-amber-700"
            features={["Identity verification", "Message facilitation", "Secure verification"]}
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Privacy Focus"
            description="We prioritize your privacy with a sensitive, discretion-first approach."
            colorClass="from-rose-600 to-red-700"
            iconBgClass="bg-rose-100 text-rose-700"
            features={["No data mining", "Minimal information", "Compliance focused"]}
          />
        </div>
        <div className="flex justify-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
            onClick={() => setLocation("/auth")}
          >
            <Heart className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  iconBgClass: string;
  features: string[];
  highlight?: boolean;
}

function FeatureCard({
  icon,
  title,
  description,
  colorClass,
  iconBgClass,
  features,
  highlight = false,
}: FeatureCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg",
      highlight && "ring-2 ring-primary/50 shadow-md"
    )}>
      <CardHeader className={cn(
        "pb-3 relative", 
        highlight && "bg-primary-50"
      )}>
        {highlight && (
          <Badge className="absolute top-2 right-2 px-2 py-px text-xs bg-primary text-primary-foreground">
            Popular
          </Badge>
        )}
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-md", iconBgClass)}>
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3 pt-3">
        <ul className="space-y-2 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4 text-primary"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="ghost" className="w-full justify-center text-primary">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}