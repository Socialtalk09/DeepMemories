import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [_, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const navigationItems = [
    { label: "Home", href: user ? "/" : "/landing", active: true },
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Team", href: "#team" },
  ];
  
  const handleNavigation = (href: string) => {
    setIsOpen(false);
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10 items-center">
          <Logo showText={true} />
          
          {!isMobile && (
            <nav className="hidden md:flex gap-6">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    item.active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/auth")}
                >
                  Log in
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setLocation("/auth")}
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setLocation("/")}
                >
                  Dashboard
                </Button>
              </>
            )}
            
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4">
                    {navigationItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.href);
                        }}
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                          item.active ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                    {!user ? (
                      <>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            setLocation("/auth");
                          }}
                        >
                          Log in
                        </Button>
                        <Button
                          className="justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            setLocation("/auth");
                          }}
                        >
                          Sign up
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                          }}
                        >
                          Sign out
                        </Button>
                        <Button
                          className="justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            setLocation("/");
                          }}
                        >
                          Dashboard
                        </Button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}