import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";

interface ApplicationFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ApplicationFilters({ 
  statusFilter, 
  setStatusFilter, 
  searchQuery, 
  setSearchQuery 
}: ApplicationFiltersProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Ghosted">Ghosted</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search companies or positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-primary bg-primary/10">
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
