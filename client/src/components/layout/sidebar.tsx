import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  LayoutDashboard, 
  List, 
  Brain, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard", icon: List, label: "Applications" },
  { href: "/ai-feedback", icon: Brain, label: "AI Feedback" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Not authenticated, redirect to landing
          setLocation("/");
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLocation("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { 
        method: 'POST',
        credentials: 'include',
      });
      
      localStorage.clear();
      sessionStorage.clear();
      setLocation("/");
    } catch (error) {
      console.error('Error signing out:', error);
      setLocation("/");
    }
  };

  if (isLoading) {
    return (
      <div className="w-64 bg-white h-full border-r border-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to landing page
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">JobTrackAI</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href === "/dashboard" && location === "/");
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-slate-100 text-primary"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-500")} />
                <span className={cn("font-medium", isActive ? "text-primary" : "text-slate-700")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 px-4 py-3">
          <img 
            src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=3B82F6&color=fff`}
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-800">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "User"
              }
            </div>
            <div className="text-xs text-slate-500">
              {user?.email}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
