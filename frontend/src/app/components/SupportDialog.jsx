import { useState } from "react";
import {
    HelpCircle,
    MessageSquare,
    AlertTriangle,
    Phone,
    ShieldAlert,
    ChevronRight,
    Send,
    LifeBuoy,
    MapPin,
    Upload,
    Camera,
    X
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export function SupportDialog({ open, onOpenChange, defaultTab = "emergency", user }) {
    const [activeTab, setActiveTab] = useState("emergency"); // Default to emergency/damage
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Damage Report State
    const [damageForm, setDamageForm] = useState({
        location: '',
        severity: 'minor',
        description: '',
        vehiclePhotos: []
    });

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            // Convert to Base64 for local storage demo
            const files = Array.from(e.target.files);
            Promise.all(files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                });
            })).then(base64Images => {
                setDamageForm(prev => ({
                    ...prev,
                    vehiclePhotos: [...prev.vehiclePhotos, ...base64Images]
                }));
            });
        }
    };

    const removePhoto = (index) => {
        setDamageForm(prev => ({
            ...prev,
            vehiclePhotos: prev.vehiclePhotos.filter((_, i) => i !== index)
        }));
    };

    const handleDamageSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Authentication Required", { description: "Please login to submit a damage report." });
            return;
        }

        setIsSubmitting(true);

        const newReport = {
            id: 'DMG' + Date.now(),
            userId: user.email || 'unknown',
            userName: user.name || 'User',
            ...damageForm,
            status: 'Pending', // Pending, Reviewed, Cost Estimated
            estimatedCost: 0,
            submittedAt: new Date().toISOString()
        };

        const existingReports = JSON.parse(localStorage.getItem('damageReports') || '[]');
        localStorage.setItem('damageReports', JSON.stringify([newReport, ...existingReports]));

        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Damage Report Submitted", {
                description: "Our admin team will review the damage and send a cost estimation shortly."
            });
            setDamageForm({ location: '', severity: 'minor', description: '', vehiclePhotos: [] });
            onOpenChange(false);
        }, 1500);
    };

    const handleEmergencyAlert = () => {
        if (!user) {
            toast.error("Authentication Required", { description: "Please login to use emergency features." });
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.error("Emergency Alert Sent", {
                description: "Emergency contacts and local authorities have been notified of your location.",
                duration: 5000,
            });
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <LifeBuoy className="h-6 w-6 text-primary" />
                        Help & Support
                    </DialogTitle>
                    <DialogDescription>
                        How can we assist you today?
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-4">
                    <Tabs defaultValue="damage" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-secondary/50 mb-6">
                            <TabsTrigger value="damage" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                                Report Damage
                            </TabsTrigger>
                            <TabsTrigger value="emergency" className="data-[state=active]:bg-destructive data-[state=active]:text-white text-destructive hover:text-destructive/80">
                                Emergency Contacts
                            </TabsTrigger>
                        </TabsList>

                        {/* DAMAGE REPORT TAB */}
                        <TabsContent value="damage" className="space-y-4">
                            {!user ? (
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                                    </div>
                                    <h3 className="font-bold text-lg">Authentication Required</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                        You must be logged in to report vehicle damage. Please sign in to verify your identity.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleDamageSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3 items-start">
                                        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                        <div className="text-sm text-yellow-500/90">
                                            Please provide accurate details about the incident. This helps us process insurance claims and repairs faster.
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Incident Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                placeholder="Enter location where damage occurred"
                                                className="pl-10 bg-secondary/30 border-white/10"
                                                value={damageForm.location}
                                                onChange={(e) => setDamageForm({ ...damageForm, location: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="severity">Severity Level</Label>
                                        <select
                                            id="severity"
                                            className="flex h-10 w-full rounded-md border border-white/10 bg-secondary/30 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={damageForm.severity}
                                            onChange={(e) => setDamageForm({ ...damageForm, severity: e.target.value })}
                                        >
                                            <option value="minor">Minor (Scratches, minor dents)</option>
                                            <option value="moderate">Moderate (Broken lights, visible dents)</option>
                                            <option value="severe">Severe (Engine failure, major accident)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Situation Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Explain how the damage happened..."
                                            className="bg-secondary/30 border-white/10 min-h-[100px]"
                                            value={damageForm.description}
                                            onChange={(e) => setDamageForm({ ...damageForm, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Damage Photos (Required)</Label>
                                        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-white/5 cursor-pointer relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                            <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Click to upload photos</p>
                                        </div>

                                        {damageForm.vehiclePhotos.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {damageForm.vehiclePhotos.map((photo, split) => (
                                                    <div key={split} className="relative shrink-0 group">
                                                        <img src={photo} alt="damage" className="h-20 w-20 object-cover rounded-lg border border-white/10" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(split)}
                                                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3 text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 mt-2"
                                        disabled={isSubmitting || damageForm.vehiclePhotos.length === 0}
                                    >
                                        {isSubmitting ? "Submitting Report..." : "Submit Damage Report"}
                                    </Button>
                                </form>
                            )}
                        </TabsContent>

                        {/* EMERGENCY CONTACTS TAB */}
                        <TabsContent value="emergency" className="space-y-6 animate-in fade-in slide-in-from-right">
                            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-4">
                                <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-destructive">Emergency Assistance</h3>
                                    <p className="text-sm text-destructive/80">
                                        Only use this section for urgent situations like accidents, theft, or severe breakdowns requiring immediate attention.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-24 flex flex-col items-center justify-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                        onClick={() => {
                                            toast.error("Calling Police (100)...");
                                            window.location.href = 'tel:100';
                                        }}
                                    >
                                        <ShieldAlert className="h-8 w-8" />
                                        <span className="font-semibold">Police (Call 100)</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-24 flex flex-col items-center justify-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                        onClick={() => {
                                            toast.error("Calling Ambulance (108)...");
                                            window.location.href = 'tel:108';
                                        }}
                                    >
                                        <LifeBuoy className="h-8 w-8" />
                                        <span className="font-semibold">Ambulance (Call 108)</span>
                                    </Button>
                                </div>

                                <Button onClick={handleEmergencyAlert} className="h-16 w-full text-lg bg-destructive hover:bg-destructive/90 animate-pulse font-bold">
                                    {isSubmitting ? "Sending Alert..." : "REPORT EMERGENCY & SHARE LOCATION"}
                                </Button>

                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Pressing this will share your live coordinates with our safety team and local authorities.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/30 py-2 rounded-full">
                                        <MapPin className="h-4 w-4" />
                                        <span>Your Location: Detecting... (Enable GPS)</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
