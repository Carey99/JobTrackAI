import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  StickyNote,
  Building,
  MapPin,
  DollarSign,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobApplication } from "@shared/schema";

interface ApplicationCardProps {
  application: JobApplication;
  onDelete: () => void;
}

const statusColors = {
  "Applied": "bg-slate-100 text-slate-700",
  "Interview": "bg-warning/10 text-warning",
  "Offer": "bg-success/10 text-success",
  "Rejected": "bg-error/10 text-error",
  "Ghosted": "bg-slate-100 text-slate-600"
};

const statusOpacity = {
  "Applied": "",
  "Interview": "",
  "Offer": "",
  "Rejected": "opacity-75",
  "Ghosted": "opacity-60"
};

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow cursor-pointer",
      statusOpacity[application.status as keyof typeof statusOpacity]
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{application.company}</h3>
              <p className="text-sm text-slate-600">{application.position}</p>
            </div>
          </div>
          <Badge 
            className={cn(
              "px-3 py-1 text-sm font-medium",
              statusColors[application.status as keyof typeof statusColors]
            )}
          >
            {application.status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-500">
              <Calendar className="w-4 h-4 mr-1" />
              Applied
            </div>
            <span className="text-slate-700">
              {formatDate(application.applicationDate)}
            </span>
          </div>
          
          {application.location && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </div>
              <span className="text-slate-700">{application.location}</span>
            </div>
          )}
          
          {application.salaryRange && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-500">
                <DollarSign className="w-4 h-4 mr-1" />
                Salary
              </div>
              <span className="text-slate-700">{application.salaryRange}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StickyNote className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                {application.notes ? "Has notes" : "No notes"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-primary"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-error"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
