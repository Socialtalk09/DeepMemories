import { useLocation } from "wouter";
import { ArrowRight, Heart, MessageCircle, ShieldCheck, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FeatureShowcase } from "@/components/common/feature-showcase";
import { CompanySection } from "@/components/common/company-section";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function LandingPage() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiAvPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="container px-4 md:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <div className="inline-block p-1 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium px-3 py-1">
                    <Logo size="sm" />
                    <span>Your Digital Legacy Platform</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                    Create Messages That<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                      Transcend Time
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-100 max-w-[600px]">
                    Deliver your thoughts, feelings, and memories to loved ones—even after you're gone.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-700 hover:bg-blue-50"
                    onClick={() => setLocation("/auth")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/40 text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </div>
                
                <div className="flex items-center gap-8 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    <span>End-to-end encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span>10k+ satisfied users</span>
                  </div>
                </div>
              </div>
              
              <div className="relative hidden lg:block">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-1 shadow-2xl border border-white/20">
                  <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500/20 p-2 rounded-full">
                          <MessageCircle className="h-6 w-6 text-blue-100" />
                        </div>
                        <h3 className="text-xl font-semibold">Future Message</h3>
                      </div>
                      <Badge />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm text-blue-200 mb-1">To: Emma</h4>
                        <h2 className="text-xl font-bold">On Your Graduation Day</h2>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 text-blue-100">
                        <p className="leading-relaxed">
                          Emma, I'm so incredibly proud of you for this achievement. Though I can't be there in person, 
                          know that I'm watching over you with more pride than you can imagine...
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-blue-200">
                        <span>Delivery: 05/15/2026</span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 text-pink-400 mr-1" />
                          With love, Dad
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Messages Created"
                value="150,000+"
                description="Messages waiting to be delivered"
              />
              <StatCard
                title="Users Worldwide"
                value="10,000+"
                description="Across more than 30 countries"
              />
              <StatCard
                title="Messages Delivered"
                value="75,000+"
                description="Connecting people across time"
              />
              <StatCard
                title="Recipient Satisfaction"
                value="99.2%"
                description="Rated by message recipients"
              />
            </div>
          </div>
        </section>
        
        {/* Feature showcase */}
        <FeatureShowcase />
        
        {/* Testimonials section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  What Our Users Say
                </h2>
                <p className="text-gray-500 md:text-xl">
                  Thousands of people have used our platform to create meaningful legacies.
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <TestimonialCard
                quote="This service allowed me to prepare messages for my children to receive on important life events, even if I'm not there to see them. It's brought me incredible peace of mind."
                author="Robert T."
                role="Terminal illness patient"
              />
              <TestimonialCard
                quote="After receiving a message from my father three years after his passing, I felt his presence on my wedding day. This platform created a moment I'll cherish forever."
                author="Sarah M."
                role="Message recipient"
                highlight
              />
              <TestimonialCard
                quote="As someone frequently traveling to high-risk areas for my job, this gives me peace of mind knowing my family will hear from me if anything happens."
                author="James K."
                role="International journalist"
              />
            </div>
          </div>
        </section>
        
        {/* Company section */}
        <CompanySection />
        
        {/* CTA section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to create your digital legacy?
                </h2>
                <p className="text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who've already secured their legacy messages.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => setLocation("/auth")}
                >
                  Start Creating Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm border border-white/20">
      <h3 className="text-lg font-medium text-blue-100 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-blue-200">{description}</p>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  highlight?: boolean;
}

function TestimonialCard({ quote, author, role, highlight = false }: TestimonialCardProps) {
  return (
    <div className={`rounded-xl p-6 flex flex-col ${
      highlight 
        ? "bg-primary-50 border border-primary/20" 
        : "bg-slate-50 border border-slate-200"
    }`}>
      <div className="mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`inline-block h-5 w-5 ${
              highlight ? "text-primary" : "text-amber-500"
            }`}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
          </svg>
        ))}
      </div>
      <p className={`text-base flex-1 ${highlight ? "text-primary-700" : "text-gray-700"}`}>
        "{quote}"
      </p>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="font-semibold">{author}</p>
        <p className={`text-sm ${highlight ? "text-primary-600" : "text-gray-500"}`}>{role}</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="rounded-full px-2.5 py-0.5 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium">
      Scheduled
    </div>
  );
}