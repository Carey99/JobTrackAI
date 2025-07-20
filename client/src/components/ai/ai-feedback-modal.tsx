import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Sparkles, CheckCircle, Star, AlertTriangle, Lightbulb } from "lucide-react";
import { z } from "zod";

interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  jobDescription: z.string().min(10, "Please provide a job description"),
  resume: z.string().min(10, "Please provide your resume content"),
});

type FormData = z.infer<typeof formSchema>;

interface AIFeedbackResult {
  matchScore: string;
  strengths: string;
  improvements: string;
  recommendations: string;
}

export function AIFeedbackModal({ isOpen, onClose }: AIFeedbackModalProps) {
  const { toast } = useToast();
  const [feedbackResult, setFeedbackResult] = useState<AIFeedbackResult | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      resume: "",
    },
  });

  const generateFeedbackMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/ai-feedback", data);
      return response.json();
    },
    onSuccess: (data) => {
      setFeedbackResult({
        matchScore: data.matchScore,
        strengths: data.strengths,
        improvements: data.improvements,
        recommendations: data.recommendations,
      });
      toast({
        title: "AI Feedback Generated",
        description: "Your personalized feedback is ready!",
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
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate AI feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    generateFeedbackMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setFeedbackResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            AI Application Feedback
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!feedbackResult ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={8} 
                            placeholder="Paste the job description here..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Resume/CV</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={8} 
                            placeholder="Paste your resume content here..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-primary hover:bg-blue-600 px-8"
                    disabled={generateFeedbackMutation.isPending}
                  >
                    {generateFeedbackMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Analysis Results</h3>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-success">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Match Score: {feedbackResult.matchScore}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm">
                        Your profile shows strong alignment with the job requirements.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-warning">
                        <Star className="w-5 h-5 mr-2" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-slate-600 text-sm whitespace-pre-wrap">
                        {feedbackResult.strengths}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-error">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-slate-600 text-sm whitespace-pre-wrap">
                        {feedbackResult.improvements}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-primary">
                        <Lightbulb className="w-5 h-5 mr-2" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-slate-600 text-sm whitespace-pre-wrap">
                        {feedbackResult.recommendations}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setFeedbackResult(null)}
                  >
                    Generate New Feedback
                  </Button>
                  <Button 
                    onClick={handleClose}
                    className="bg-primary hover:bg-blue-600"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
