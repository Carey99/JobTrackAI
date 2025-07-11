import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { AIFeedbackModal } from "@/components/ai/ai-feedback-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, Target, TrendingUp } from "lucide-react";

export default function AIFeedback() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">AI Feedback</h1>
              <p className="text-slate-600 mt-1">Get intelligent insights on your job applications</p>
            </div>
            <Button 
              onClick={() => setShowFeedbackModal(true)}
              className="bg-primary hover:bg-blue-600 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Feedback</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>AI-Powered Application Analysis</span>
                </CardTitle>
                <CardDescription>
                  Upload your resume and a job description to get personalized feedback on how well you match the position.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Match Analysis</h3>
                    <p className="text-sm text-slate-600">
                      Get a detailed match score between your resume and job requirements
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Strengths & Gaps</h3>
                    <p className="text-sm text-slate-600">
                      Identify your strengths and areas for improvement
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-warning" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Recommendations</h3>
                    <p className="text-sm text-slate-600">
                      Get actionable suggestions to improve your application
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Started */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Ready to Get AI Feedback?
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Compare your resume with job descriptions and get personalized insights 
                    to improve your chances of landing the job.
                  </p>
                  <Button 
                    onClick={() => setShowFeedbackModal(true)}
                    size="lg"
                    className="bg-primary hover:bg-blue-600"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Your First Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIFeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </div>
  );
}
