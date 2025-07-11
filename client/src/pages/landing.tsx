import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Brain, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">JobTrackAI</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-blue-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Track Your Job Applications with AI-Powered Insights
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Organize your job search, get intelligent feedback on your applications, 
            and never miss an opportunity again.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-primary hover:bg-blue-600 text-lg px-8 py-3"
          >
            Start Tracking Jobs
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Everything You Need to Land Your Dream Job
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center">
                <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Application Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Keep track of all your job applications in one place with status updates and notes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get intelligent insights on how well your resume matches job descriptions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your application success rate and identify areas for improvement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize applications by status: Applied, Interview, Offer, Rejected, or Ghosted.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">JobTrackAI</span>
          </div>
          <p className="text-slate-400">
            Streamline your job search with intelligent tracking and AI-powered insights.
          </p>
        </div>
      </footer>
    </div>
  );
}
