import { Camera, CheckCircle, XCircle, Upload, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState } from "react";

import { indianVehicles } from "../data/vehicles";

export function InspectionModule() {
  const [checklist, setChecklist] = useState([
    { id: 1, item: 'Exterior Body Condition', checked: false },
    { id: 2, item: 'Tire Condition & Pressure', checked: false },
    { id: 3, item: 'Lights & Indicators', checked: false },
    { id: 4, item: 'Interior Cleanliness', checked: false },
    { id: 5, item: 'Fuel Level', checked: false },
    { id: 6, item: 'Dashboard Warning Lights', checked: false },
    { id: 7, item: 'Brake Functionality', checked: false },
    { id: 8, item: 'Mirror Condition', checked: false },
  ]);

  // Mock pending inspections from real vehicles
  const pendingInspections = indianVehicles.slice(0, 3).map((v, i) => ({
    id: i + 1,
    vehicle: v.name,
    bookingId: `BK-2026-00${15 + i}`,
    customer: ['Sarah Johnson', 'Mike Chen', 'Alex Doe'][i],
    returnDate: '2026-01-03',
    status: i === 1 ? 'in-progress' : 'pending',
  }));

  const handleChecklistToggle = (id) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="container px-4 py-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Vehicle Inspection
        </h1>
        <p className="text-muted-foreground">Inspect returned vehicles and report damages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Inspections */}
        <Card className="border-white/5 bg-card/40 backdrop-blur lg:col-span-1">
          <CardHeader>
            <CardTitle>Pending Inspections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="p-4 rounded-xl bg-secondary/30 border border-white/5 hover:border-primary/20 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{inspection.vehicle}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{inspection.bookingId}</p>
                  </div>
                  <Badge
                    className={
                      inspection.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
                    }
                  >
                    {inspection.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-white/5 mt-2">
                  <span>{inspection.customer}</span>
                  <span>{inspection.returnDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Inspection Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Inspection */}
          <Card className="border-white/5 bg-card/40 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{pendingInspections[1].vehicle} - {pendingInspections[1].bookingId}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Customer: {pendingInspections[1].customer}</p>
                </div>
                <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                  In Progress
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Checklist */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Inspection Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChecklistToggle(item.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${item.checked
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-secondary/30 border-white/5 hover:border-white/10'
                        }`}
                    >
                      <Checkbox
                        id={`check-${item.id}`}
                        checked={item.checked}
                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <label
                        htmlFor={`check-${item.id}`}
                        className={`flex-1 cursor-pointer font-medium text-sm ${item.checked ? 'text-emerald-500' : 'text-foreground'
                          }`}
                      >
                        {item.item}
                      </label>
                      {item.checked && (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Damage Report */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Damage Report</h4>
                </div>
                <Textarea
                  placeholder="Describe any damages, scratches, or issues found during inspection..."
                  className="min-h-[100px] bg-secondary/30 border-white/10 focus:border-primary/50"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Upload Images</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-secondary/30 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-secondary/50 hover:border-primary/50 transition-all group">
                      <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalty Calculation */}
              <Card className="bg-gradient-to-br from-secondary/50 to-primary/5 border-white/5">
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-semibold">Security Deposit & Penalties</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="font-medium">$500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Damage Penalty</span>
                      <span className="text-destructive font-medium">-$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Late Return Fee</span>
                      <span className="text-destructive font-medium">-$50.00</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                      <span className="font-medium">Refund Amount</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        $300.00
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 h-12"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Refund
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 h-12 shadow-lg shadow-primary/20"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve & Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
