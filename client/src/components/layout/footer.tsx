import { useLocation } from "wouter";
import { 
  ArrowRight,
  ChevronRight,
  Facebook, 
  FileText,
  Heart,
  Instagram, 
  Layers,
  Linkedin, 
  Lock,
  Mail, 
  MapPin, 
  MessageCircle,
  Phone, 
  Shield,
  ShieldCheck,
  Star,
  Twitter, 
  Users
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Footer() {
  const [_, setLocation] = useLocation();
  
  const footerLinks = [
    {
      title: "Product",
      description: "Create and manage your digital legacy",
      icon: <Layers className="h-5 w-5 text-indigo-500" />,
      links: [
        { label: "Message Creation", href: "#features", icon: <MessageCircle className="h-4 w-4" /> },
        { label: "Delivery Options", href: "#delivery", icon: <ArrowRight className="h-4 w-4" /> },
        { label: "Security", href: "#security", icon: <Lock className="h-4 w-4" /> },
        { label: "Pricing", href: "#pricing", icon: <FileText className="h-4 w-4" /> },
      ],
      highlight: true,
      color: "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100"
    },
    {
      title: "Company",
      description: "Learn about our mission and team",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      links: [
        { label: "About Us", href: "#about", icon: <Heart className="h-4 w-4" /> },
        { label: "Team", href: "#team", icon: <Users className="h-4 w-4" /> },
        { label: "Careers", href: "#careers", icon: <Star className="h-4 w-4" /> },
        { label: "Blog", href: "#blog", icon: <FileText className="h-4 w-4" /> },
      ],
      color: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100"
    },
    {
      title: "Resources",
      description: "Support and documentation",
      icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
      links: [
        { label: "Help Center", href: "#help", icon: <Shield className="h-4 w-4" /> },
        { label: "Privacy Policy", href: "#privacy", icon: <Lock className="h-4 w-4" /> },
        { label: "Terms of Service", href: "#terms", icon: <FileText className="h-4 w-4" /> },
        { label: "Contact", href: "#contact", icon: <Mail className="h-4 w-4" /> },
      ],
      color: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100"
    },
  ];
  
  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      // Handle anchor links
      const element = document.getElementById(href.substring(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Handle page navigation
      setLocation(href);
    }
  };

  return (
    <footer className="bg-gray-50 pt-16 pb-12 border-t">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Logo showText={true} size="md" />
            <p className="text-gray-500 text-sm">
              We help people create digital legacies that connect across time and transcend physical limitations.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {footerLinks.map((group, i) => (
              <Card key={i} className={cn("border overflow-hidden transition-all hover:shadow-md", group.color)}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {group.icon}
                    <h4 className="font-semibold text-lg">{group.title}</h4>
                    {group.highlight && (
                      <Badge className="ml-auto bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">{group.description}</p>
                  
                  <ul className="space-y-3">
                    {group.links.map((link, j) => (
                      <li key={j}>
                        <a 
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(link.href);
                          }}
                          className="flex items-center text-gray-600 hover:text-primary text-sm transition-colors group"
                        >
                          <span className="mr-2 text-gray-400 group-hover:text-primary transition-colors">
                            {link.icon}
                          </span>
                          {link.label}
                          <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-100 flex items-center text-sm text-gray-600 hover:bg-primary/5 transition-colors">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <span>123 Memory Lane, San Francisco, CA 94107</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 flex items-center text-sm text-gray-600 hover:bg-primary/5 transition-colors">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 flex items-center text-sm text-gray-600 hover:bg-primary/5 transition-colors">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <span>hello@dearly.com</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Subscribe to our newsletter</h4>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 space-y-3">
              <p className="text-sm text-gray-600">Stay updated with the latest news and features</p>
              <div className="flex gap-2">
                <div className="grid flex-1 min-w-0">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Dearly Inc. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#privacy" className="text-xs text-gray-400 hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#terms" className="text-xs text-gray-400 hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#cookies" className="text-xs text-gray-400 hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}