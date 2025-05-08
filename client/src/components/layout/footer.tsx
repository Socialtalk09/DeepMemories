import { useLocation } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  Twitter 
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [_, setLocation] = useLocation();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Security", href: "#security" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Team", href: "#team" },
        { label: "Careers", href: "#careers" },
        { label: "Blog", href: "#blog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Contact", href: "#contact" },
      ],
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo showText={true} size="md" />
            <p className="text-gray-500 text-sm">
              We help people create digital legacies that connect across time and transcend physical limitations.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {footerLinks.map((group, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-semibold">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <a 
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      className="text-gray-500 hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>123 Memory Lane, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>hello@dearly.com</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Subscribe to our newsletter</h4>
            <div className="flex gap-2">
              <div className="grid flex-1 min-w-0">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-gray-400">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
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