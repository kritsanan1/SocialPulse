import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home,
  PlusCircle,
  BarChart3, 
  Users, 
  Lightbulb, 
  Settings, 
  LogOut,
  Zap,
  Calendar,
  CreditCard,
  DollarSign,
  Sparkles,
  Image,
  RefreshCw,
  Heart,
  CheckCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, current: location === "/" },
    { name: "Create Post", href: "/create", icon: PlusCircle, current: location === "/create" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, current: location === "/analytics" },
    { name: "Calendar", href: "/calendar", icon: Calendar, current: location === "/calendar" },
    { name: "AI Insights", href: "/ai-insights", icon: Lightbulb, current: location === "/ai-insights" },
    { name: "Team Management", href: "/team", icon: Users, current: location === "/team" },
    { name: "Billing", href: "/billing", icon: CreditCard, current: location === "/billing" },
    { name: "Pricing", href: "/pricing", icon: DollarSign, current: location === "/pricing" },
    { name: "Settings", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo and Branding */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SocialAI Pro</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Manager</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                  item.current
                    ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/" className="flex items-center space-x-2 w-full">
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
      </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/calendar" className="flex items-center space-x-2 w-full">
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/team" className="flex items-center space-x-2 w-full">
          <Users className="w-5 h-5" />
          <span>Team</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/ai-insights" className="flex items-center space-x-2 w-full">
          <BarChart3 className="w-5 h-5" />
          <span>AI Insights</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/ai-content-generator" className="flex items-center space-x-2 w-full">
          <Sparkles className="w-5 h-5" />
          <span>AI Content Generator</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/visual-content-creator" className="flex items-center space-x-2 w-full">
          <Image className="w-5 h-5" />
          <span>Visual Creator</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/content-recycling" className="flex items-center space-x-2 w-full">
          <RefreshCw className="w-5 h-5" />
          <span>Content Recycling</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Link href="/sentiment-dashboard" className="flex items-center space-x-2 w-full">
          <Heart className="w-5 h-5" />
          <span>Sentiment Analysis</span>
        </Link>
      </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Link href="/pricing" className="flex items-center space-x-2 w-full">
            <CreditCard className="w-5 h-5" />
            <span>Pricing</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Link href="/billing" className="flex items-center space-x-2 w-full">
            <CheckCircle className="w-5 h-5" />
            <span>Billing</span>
          </Link>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="User Profile" 
              className="w-10 h-10 rounded-full object-cover" 
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName || user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => window.location.href = "/api/logout"}
          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}