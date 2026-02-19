import { Calendar, Clock, FileText, Upload, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

export function CustomerDashboard() {
  const activeBookings = [
    {
      id: '1',
      vehicle: 'Tesla Model 3',
      startDate: '2026-01-05',
      endDate: '2026-01-10',
      status: 'active',
      progress: 60,
      pickupLocation: 'Downtown Center',
      totalCost: 750
    },
    {
      id: '2',
      vehicle: 'BMW X5',
      startDate: '2026-01-15',
      endDate: '2026-01-20',
      status: 'upcoming',
      progress: 0,
      pickupLocation: 'Airport Terminal',
      totalCost: 900
    }
  ];

  const pastBookings = [
    {
      id: '3',
      vehicle: 'Mercedes-Benz C-Class',
      startDate: '2025-12-20',
      endDate: '2025-12-25',
      status: 'completed',
      totalCost: 800,
      rating: 5
    },
    {
      id: '4',
      vehicle: 'Harley-Davidson Street 750',
      startDate: '2025-11-10',
      endDate: '2025-11-15',
      status: 'completed',
      totalCost: 450,
      rating: 5
    }
  ];

  const documents = [
    { name: 'Driving License', status: 'verified', uploadDate: '2025-12-01' },
    { name: 'ID Proof', status: 'verified', uploadDate: '2025-12-01' },
    { name: 'Address Proof', status: 'pending', uploadDate: '2025-12-30' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'upcoming':
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'completed':
        return 'bg-secondary text-muted-foreground border-border/50';
      default:
        return 'bg-secondary text-muted-foreground border-border/50';
    }
  };

  const getDocumentIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="container px-4 py-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          My Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your bookings and documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Bookings', value: '1', color: 'from-primary/20', border: 'border-primary/20' },
          { label: 'Upcoming', value: '1', color: 'from-accent/20', border: 'border-accent/20' },
          { label: 'Total Trips', value: '24', color: 'from-cyan-500/20', border: 'border-cyan-500/20' },
          { label: 'Total Spent', value: '₹12.5K', color: 'from-emerald-500/20', border: 'border-emerald-500/20' },
        ].map((stat) => (
          <Card key={stat.label} className={`border ${stat.border} bg-gradient-to-br ${stat.color} to-transparent backdrop-blur-sm`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 border border-white/5 h-auto">
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2">Bookings</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2">Documents</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2">History</TabsTrigger>
        </TabsList>

        {/* Active Bookings */}
        <TabsContent value="bookings" className="space-y-4">
          {activeBookings.map((booking) => (
            <Card key={booking.id} className="border-white/5 bg-card/40 backdrop-blur hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{booking.vehicle}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{booking.pickupLocation}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-8 p-4 rounded-lg bg-secondary/30">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Start Date</span>
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{booking.startDate}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase">End Date</span>
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{booking.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Trip Progress</span>
                    <span>{booking.progress}%</span>
                  </div>
                  <Progress value={booking.progress} className="h-2 bg-secondary" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <div>
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ₹{booking.totalCost}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                      <FileText className="mr-2 h-4 w-4" />
                      Invoice
                    </Button>
                    {booking.status === 'active' && (
                      <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20">
                        Extend
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          <Card className="border-white/5 bg-card/40 backdrop-blur">
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <p className="text-sm text-muted-foreground">
                Keep your documents up to date for seamless bookings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-background border border-white/5">
                      {getDocumentIcon(doc.status)}
                    </div>
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded on {doc.uploadDate}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      doc.status === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }
                  >
                    {doc.status.toUpperCase()}
                  </Badge>
                </div>
              ))}

              <Button className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 h-11 text-base shadow-lg shadow-primary/20">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4">
          {pastBookings.map((booking) => (
            <Card key={booking.id} className="border-white/5 bg-card/40 backdrop-blur hover:bg-card/60 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">{booking.vehicle}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="bg-secondary/50 px-2 py-1 rounded">{booking.startDate}</span>
                      <span>→</span>
                      <span className="bg-secondary/50 px-2 py-1 rounded">{booking.endDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ₹{booking.totalCost}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary hover:bg-primary/10">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
