import { Github, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CompanySection() {
  return (
    <section className="w-full py-12 md:py-24 bg-primary-50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="px-3 py-1 text-sm bg-primary-100 text-primary border-primary-200">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              The Faces Behind Dearly
            </h2>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[600px]">
              We're a passionate team dedicated to helping people preserve their memories and 
              leave meaningful legacies for their loved ones.
            </p>
            
            <div className="space-y-4">
              <p className="text-gray-500">
                Founded in 2023, our mission is to transform how people think about digital legacy. 
                We believe that everyone deserves to leave behind messages that matter, delivered 
                exactly when they're needed most.
              </p>
              <p className="text-gray-500">
                Our approach combines compassion with cutting-edge technology to create a platform 
                that's not only secure and reliable but also deeply human in its design and functionality.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamMember
              name="Alex Rivera"
              role="Founder & CEO"
              bio="Former grief counselor with 15+ years experience helping people through loss. Started Dearly after seeing firsthand how meaningful final messages can be."
              imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TeamMember
              name="Sophia Chen"
              role="CTO"
              bio="Security expert with background in privacy-focused applications. Passionate about creating technology that serves emotional human needs."
              imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TeamMember
              name="Marcus Johnson"
              role="Head of Product"
              bio="UX specialist focused on creating compassionate digital experiences. Previously worked on healthcare applications for vulnerable populations."
              imageUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TeamMember
              name="Emma Williams"
              role="Customer Experience"
              bio="Former hospice nurse who brings deep understanding of end-of-life care and family needs to our customer support and outreach initiatives."
              imageUrl="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="rounded-md py-1.5">
              <span className="text-xs font-semibold">Since 2023</span>
            </Badge>
            <Badge variant="outline" className="rounded-md py-1.5">
              <span className="text-xs font-semibold">Based in San Francisco, CA</span>
            </Badge>
            <Badge variant="outline" className="rounded-md py-1.5">
              <span className="text-xs font-semibold">Remote-first team</span>
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

function TeamMember({ name, role, bio, imageUrl }: TeamMemberProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="object-cover w-full h-full transition-all hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-primary font-medium text-sm">{role}</p>
          <p className="text-gray-500 text-sm">{bio}</p>
          
          <div className="pt-4 flex gap-3">
            <Avatar className="h-8 w-8 bg-primary/10 hover:bg-primary/20 cursor-pointer">
              <AvatarFallback className="text-primary text-xs">
                <Twitter className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 bg-primary/10 hover:bg-primary/20 cursor-pointer">
              <AvatarFallback className="text-primary text-xs">
                <Linkedin className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}