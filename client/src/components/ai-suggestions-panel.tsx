import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Bot, Lightbulb, Clock, MessageCircle, Hash } from "lucide-react";

interface AiSuggestion {
  id: string;
  suggestionType: string;
  suggestionContent: string;
  applied: boolean;
  createdAt: string;
}

export function AISuggestionsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading, refetch } = useQuery<AiSuggestion[]>({
    queryKey: ["/api/ai-suggestions"],
  });

  const applySuggestionMutation = useMutation({
    mutationFn: async (suggestionId: string) => {
      await apiRequest("PATCH", `/api/ai-suggestions/${suggestionId}/apply`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-suggestions"] });
      toast({
        title: "Suggestion Applied",
        description: "The AI suggestion has been applied successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to apply suggestion",
        variant: "destructive",
      });
    },
  });

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "content":
        return <Lightbulb className="w-5 h-5 text-blue-600" />;
      case "timing":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "engagement":
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case "hashtags":
        return <Hash className="w-5 h-5 text-purple-600" />;
      default:
        return <Bot className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "content":
        return "border-blue-500 bg-blue-50";
      case "timing":
        return "border-amber-500 bg-amber-50";
      case "engagement":
        return "border-green-500 bg-green-50";
      case "hashtags":
        return "border-purple-500 bg-purple-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getActionButtonColor = (type: string) => {
    switch (type) {
      case "content":
        return "text-blue-600 hover:text-blue-700";
      case "timing":
        return "text-amber-600 hover:text-amber-700";
      case "engagement":
        return "text-green-600 hover:text-green-700";
      case "hashtags":
        return "text-purple-600 hover:text-purple-700";
      default:
        return "text-gray-600 hover:text-gray-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>AI Suggestions</span>
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : suggestions?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">No AI suggestions available yet.</p>
            <p className="text-sm">Create some content to get personalized recommendations!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions?.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border-l-4 ${getSuggestionColor(suggestion.suggestionType)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSuggestionIcon(suggestion.suggestionType)}
                      <h4 className="font-medium text-gray-900 capitalize">
                        {suggestion.suggestionType} Optimization
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {suggestion.suggestionContent}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applySuggestionMutation.mutate(suggestion.id)}
                      disabled={applySuggestionMutation.isPending}
                      className={`text-sm font-medium ${getActionButtonColor(suggestion.suggestionType)}`}
                    >
                      {applySuggestionMutation.isPending ? "Applying..." : "Apply Suggestion"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => refetch()}
            disabled={isLoading}
            className="w-full text-primary hover:text-secondary font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
