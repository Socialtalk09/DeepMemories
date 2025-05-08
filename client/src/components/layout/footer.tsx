import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="text-primary h-5 w-5 mr-2" />
            <span className="font-medium text-gray-800">Dearly</span>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700 transition-all">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-all">
              Privacy Policy
            </Link>
            <Link href="/help" className="text-sm text-gray-500 hover:text-gray-700 transition-all">
              Help Center
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-400">
          © {currentYear} Dearly. All rights reserved. Your messages are securely encrypted.
        </div>
      </div>
    </footer>
  );
}
