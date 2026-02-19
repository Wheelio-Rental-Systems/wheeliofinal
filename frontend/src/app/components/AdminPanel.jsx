import { Plus, TrendingUp, Car, Users, DollarSign, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

import { indianVehicles } from "../data/vehicles";

export function AdminPanel() {

  const vehicles = indianVehicles.map(v => ({
    id: v.id,
    name: v.name,
    status: v.status,
    revenue: Math.floor(v.pricePerDay * (Math.random() * 10 + 5)),
    utilization: Math.floor(Math.random() * 30 + 70)
  }));

  const totalRevenue = vehicles.reduce((acc, v) => acc + v.revenue, 0);
  const activeVehicles = vehicles.filter(v => v.status === 'rented' || v.status === 'available').length;
  const avgUtilization = Math.floor(vehicles.reduce((acc, v) => acc + v.utilization, 0) / vehicles.length);

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: totalRevenue },
  ];

  const utilizationData = [
    { month: 'Jan', rate: 78 },
    { month: 'Feb', rate: 82 },
    { month: 'Mar', rate: 75 },
    { month: 'Apr', rate: 88 },
    { month: 'May', rate: 85 },
    { month: 'Jun', rate: avgUtilization },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rented':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'maintenance':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:

        return status === 'unavailable'
          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          : 'bg-secondary text-muted-foreground border-border/50';
    }
  };

  return (
    <div className="container px-4 py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage your fleet and monitor performance</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-primary' },
          { label: 'Total Vehicles', value: vehicles.length.toString(), sub: `${activeVehicles} Active`, icon: Car, color: 'text-accent' },
          { label: 'Active Users', value: '1,284', change: '+8.2%', icon: Users, color: 'text-cyan-500' },
          { label: 'Utilization', value: `${avgUtilization}%`, change: '+5.1%', icon: TrendingUp, color: 'text-emerald-500' },
        ].map((stat) => (
          <Card key={stat.label} className="border-white/5 bg-card/40 backdrop-blur hover:border-primary/20 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {(stat.change || stat.sub) && (
                <div className={`flex items-center gap-1 text-sm mt-2 ${stat.change ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {stat.change && <TrendingUp className="h-3 w-3" />}
                  <span>{stat.change || stat.sub}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 border border-white/5 h-auto">
          <TabsTrigger value="analytics" className="px-6 py-2">Analytics</TabsTrigger>
          <TabsTrigger value="fleet" className="px-6 py-2">Fleet Management</TabsTrigger>
          <TabsTrigger value="pricing" className="px-6 py-2">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-white/5 bg-card/40 backdrop-blur">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="#a8a8b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a8a8b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(22, 22, 31, 0.9)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        backdropFilter: 'blur(12px)',
                        color: '#f5f5f7'
                      }}
                      itemStyle={{ color: '#f5f5f7' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-card/40 backdrop-blur">
              <CardHeader>
                <CardTitle>Utilization Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="#a8a8b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a8a8b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(22, 22, 31, 0.9)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        backdropFilter: 'blur(12px)',
                      }}
                      itemStyle={{ color: '#f5f5f7' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#16161f', stroke: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4">
          <Card className="border-white/5 bg-card/40 backdrop-blur">
            <CardHeader>
              <CardTitle>Vehicle Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue (MTD)</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium">{vehicle.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>${vehicle.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vehicle.utilization}%` }} />
                          </div>
                          <span className="text-xs">{vehicle.utilization}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">Edit</Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent/10 hover:text-accent">
                            <Wrench className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card className="border-white/5 bg-card/40 backdrop-blur">
            <CardHeader>
              <CardTitle>Dynamic Pricing Rules</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage pricing for different periods and events
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Weekend Premium', sub: 'Friday - Sunday', tag: '+20%', color: 'text-primary bg-primary/10 border-primary/20' },
                  { label: 'Holiday Season', sub: 'Dec 20 - Jan 5', tag: '+35%', color: 'text-accent bg-accent/10 border-accent/20' },
                  { label: 'Long-term Rental', sub: '7+ days', tag: '-15%', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
                ].map((rule) => (
                  <div key={rule.label} className="p-4 rounded-xl bg-secondary/30 border border-white/5 hover:border-primary/20 transition-colors space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{rule.label}</h4>
                      <Badge className={`border ${rule.color}`}>
                        {rule.tag}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.sub}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" />
                Add New Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
