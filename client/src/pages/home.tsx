import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/sidebar";
import { PostCreationForm } from "@/components/post-creation-form";
import { AISuggestionsPanel } from "@/components/ai-suggestions-panel";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { PostHistory } from "@/components/post-history";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            >
              {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <h1 className="text-xl font-bold text-gray-900">SocialAI Pro</h1>
          </div>
          {user?.profileImageUrl && (
            <img 
              src={user.profileImageUrl} 
              alt="User Profile" 
              className="w-8 h-8 rounded-full object-cover" 
            />
          )}
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full lg:grid lg:grid-cols-2 lg:gap-6 p-6">
            
            {/* Left Panel */}
            <div className="space-y-6 lg:overflow-y-auto">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Create Your Next Post</h2>
                <p className="text-blue-100">AI-powered content creation and optimization</p>
              </div>

              <PostCreationForm />
              <AISuggestionsPanel />
            </div>

            {/* Right Panel */}
            <div className="space-y-6 lg:overflow-y-auto mt-6 lg:mt-0">
              <AnalyticsDashboard />
              <PostHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
