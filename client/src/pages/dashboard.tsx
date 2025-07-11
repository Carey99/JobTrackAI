import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Sidebar } from "@/components/layout/sidebar";
import { ApplicationCard } from "@/components/applications/application-card";
import { AddApplicationModal } from "@/components/applications/add-application-modal";
import { ApplicationFilters } from "@/components/applications/application-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { JobApplication } from "@shared/schema";

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated,
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Success",
        description: "Application deleted successfully",
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
        description: "Failed to delete application",
        variant: "destructive",
      });
    },
  });

  const filteredApplications = applications.filter((app: JobApplication) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleDeleteApplication = (id: number) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplicationMutation.mutate(id);
    }
  };

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
              <h1 className="text-2xl font-bold text-slate-800">Job Applications</h1>
              <p className="text-slate-600 mt-1">Track and manage your job applications</p>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-blue-600 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </Button>
          </div>
        </header>

        {/* Filters */}
        <ApplicationFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Applications Grid */}
        <div className="flex-1 p-8">
          {applicationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                        <div className="h-3 bg-slate-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {searchQuery || statusFilter !== "all" ? "No applications found" : "No applications yet"}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "Start tracking your job applications by adding your first one"}
              </p>
              {(!searchQuery && statusFilter === "all") && (
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary hover:bg-blue-600"
                >
                  Add Your First Application
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application: JobApplication) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onDelete={() => handleDeleteApplication(application.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddApplicationModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
}
