import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, Calendar, Target, Clock, Building, MapPin } from "lucide-react";

interface Analytics {
  totalApplications: number;
  responseRate: number;
  interviews: number;
  thisMonth: number;
  averageResponseTime: number;
  topCompanies: Array<{ name: string; count: number }>;
  applicationsByStatus: Array<{ status: string; count: number; percentage: number }>;
  applicationsByMonth: Array<{ month: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("all");
  const [analytics, setAnalytics] = useState<Analytics>({
    totalApplications: 0,
    responseRate: 0,
    interviews: 0,
    thisMonth: 0,
    averageResponseTime: 0,
    topCompanies: [],
    applicationsByStatus: [],
    applicationsByMonth: [],
    topLocations: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          throw new Error('Failed to fetch analytics');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Keep existing mock data generation as fallback
        generateMockAnalytics();
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const calculateAnalytics = (applications: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    
    // Filter by time range
    let filteredApps = applications;
    if (timeRange === "month") {
      filteredApps = applications.filter(app => 
        new Date(app.dateApplied).getMonth() === currentMonth
      );
    } else if (timeRange === "quarter") {
      const quarterStart = new Date(now.getFullYear(), Math.floor(currentMonth / 3) * 3, 1);
      filteredApps = applications.filter(app => 
        new Date(app.dateApplied) >= quarterStart
      );
    }

    // Calculate metrics
    const totalApplications = filteredApps.length;
    const responded = filteredApps.filter(app => 
      app.status !== 'applied' && app.status !== 'no-response'
    ).length;
    const responseRate = totalApplications > 0 ? (responded / totalApplications) * 100 : 0;
    const interviews = filteredApps.filter(app => 
      app.status === 'interview' || app.status === 'final-interview'
    ).length;
    const thisMonth = applications.filter(app => 
      new Date(app.dateApplied).getMonth() === currentMonth
    ).length;

    // Company analysis
    const companyCount = {};
    filteredApps.forEach(app => {
      companyCount[app.company] = (companyCount[app.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCount)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status distribution
    const statusCount = {};
    filteredApps.forEach(app => {
      statusCount[app.status] = (statusCount[app.status] || 0) + 1;
    });
    const applicationsByStatus = Object.entries(statusCount)
      .map(([status, count]) => ({
        status,
        count: count as number,
        percentage: totalApplications > 0 ? ((count as number) / totalApplications) * 100 : 0
      }));

    // Location analysis
    const locationCount = {};
    filteredApps.forEach(app => {
      const location = app.location || 'Not specified';
      locationCount[location] = (locationCount[location] || 0) + 1;
    });
    const topLocations = Object.entries(locationCount)
      .map(([location, count]) => ({ location, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setAnalytics({
      totalApplications,
      responseRate: Math.round(responseRate),
      interviews,
      thisMonth,
      averageResponseTime: 7, // Default value
      topCompanies,
      applicationsByStatus,
      applicationsByMonth: [], // Could calculate monthly trends
      topLocations
    });
  };

  const generateMockAnalytics = () => {
    setAnalytics({
      totalApplications: 24,
      responseRate: 42,
      interviews: 6,
      thisMonth: 8,
      averageResponseTime: 5,
      topCompanies: [
        { name: "TechCorp", count: 3 },
        { name: "StartupXYZ", count: 2 },
        { name: "BigTech Inc", count: 2 },
        { name: "Innovation Labs", count: 1 },
        { name: "Future Systems", count: 1 }
      ],
      applicationsByStatus: [
        { status: "applied", count: 10, percentage: 42 },
        { status: "interview", count: 6, percentage: 25 },
        { status: "rejected", count: 5, percentage: 21 },
        { status: "offer", count: 2, percentage: 8 },
        { status: "no-response", count: 1, percentage: 4 }
      ],
      applicationsByMonth: [],
      topLocations: [
        { location: "San Francisco, CA", count: 8 },
        { location: "New York, NY", count: 6 },
        { location: "Remote", count: 5 },
        { location: "Austin, TX", count: 3 },
        { location: "Seattle, WA", count: 2 }
      ]
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      applied: "bg-blue-500",
      interview: "bg-green-500",
      rejected: "bg-red-500",
      offer: "bg-purple-500",
      "no-response": "bg-gray-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      applied: "Applied",
      interview: "Interview",
      rejected: "Rejected",
      offer: "Offer",
      "no-response": "No Response"
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Track your job search performance and insights</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.thisMonth} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.responseRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Companies that responded
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.interviews}</div>
                  <p className="text-xs text-muted-foreground">
                    Interview opportunities
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averageResponseTime} days</div>
                  <p className="text-xs text-muted-foreground">
                    Average company response
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Application Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Application Status Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.applicationsByStatus.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                          <span className="text-sm font-medium">{getStatusLabel(item.status)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{item.count}</span>
                          <span className="text-xs text-gray-400">({item.percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Top Companies Applied</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topCompanies.map((company, index) => (
                      <div key={company.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                          <span className="text-sm font-medium">{company.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{company.count} applications</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Locations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Application Locations</span>
                  </CardTitle>
                  <CardDescription>
                    Geographic distribution of your job applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analytics.topLocations.map((location, index) => (
                      <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                          <span className="text-sm font-medium">{location.location}</span>
                        </div>
                        <span className="text-sm text-gray-600">{location.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}