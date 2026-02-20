import { useState, useEffect } from "react";
import { Upload, AlertTriangle, Check, ChevronsUpDown, MapPin, Loader2, Car, X, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { createDamageReport } from "../../api/damageReports";
import { toast } from "sonner";
import { getUser } from "../../api/config";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Ahmedabad", "Jaipur", "Surat", "Coimbatore", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna"
];

export function DamageReport({ onNavigate, userBookings = [], allVehicles = [], initialTab }) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedVehicleName, setSelectedVehicleName] = useState("");

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    // Auto-select first booking if available
    if (userBookings.length > 0 && !selectedBooking) {
      const first = userBookings[0];
      setSelectedBooking(first);
      setSelectedVehicleId(first?.vehicle?.id || "");
      setSelectedVehicleName(first?.vehicle?.name || "Vehicle");
    } else if (userBookings.length === 0 && allVehicles.length > 0) {
      // No bookings — auto-select first available vehicle
      setSelectedVehicleId(allVehicles[0]?.id || "");
      setSelectedVehicleName(allVehicles[0]?.name || "Vehicle");
    }
  }, []);

  const handleUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to report damage");
      return;
    }
    if (!description || !location) {
      toast.error("Please fill in description and location");
      return;
    }

    // Get vehicleId: from selected booking, then explicit vehicle selection, then first available
    let vehicleId = selectedBooking?.vehicle?.id || selectedVehicleId;
    if (!vehicleId && allVehicles.length > 0) {
      vehicleId = allVehicles[0]?.id;
    }
    if (!vehicleId) {
      toast.error("No vehicle available. Please contact support.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId: vehicleId,
        reportedById: user.id,
        description: `[${location}] ${description}`,
        images: images,
        severity: "MEDIUM",
        status: "OPEN"
      };
      console.log("📤 Submitting damage report:", payload);
      const result = await createDamageReport(payload);
      console.log("✅ Damage report created:", result);

      toast.success("Damage report submitted! Admin will review shortly.");
      setDescription("");
      setLocation("");
      setImages([]);
      if (onNavigate) onNavigate('dashboard');
    } catch (error) {
      console.error("❌ Failed to submit report", error);
      console.error("Error response:", error?.response?.data);
      const errMsg = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to submit report. Please try again.";
      toast.error(`Submission failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-12 px-4">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      <div className="w-full max-w-2xl px-6 py-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl">
        <h1 className="text-3xl mb-2 text-primary font-bold">Report Vehicle Damage</h1>
        <p className="text-gray-400 mb-6">
          Report any scratches, dents, or issues found during or after your trip
        </p>

        {!user && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            ⚠ You must be logged in to report damage.
          </div>
        )}

        <div className="space-y-6">

          {/* Vehicle / Booking Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300">
              Select Your Booking / Vehicle
            </label>
            <div className="mt-2">
              {userBookings.length > 0 ? (
                <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-12 font-normal px-4 rounded-xl"
                    >
                      <Car className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                      <span className="flex-1 text-left truncate">
                        {selectedBooking
                          ? `${selectedBooking.vehicle?.name || "Vehicle"} — ${new Date(selectedBooking.startDate).toLocaleDateString()}`
                          : "Select your booking"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-[#0f1016] border-white/10 text-white rounded-xl overflow-hidden">
                    <Command className="bg-transparent">
                      <CommandInput placeholder="Search bookings..." className="text-white" />
                      <CommandList>
                        <CommandEmpty>No bookings found.</CommandEmpty>
                        <CommandGroup>
                          {userBookings.map((booking) => (
                            <CommandItem
                              key={booking.id}
                              onSelect={() => {
                                setSelectedBooking(booking);
                                setSelectedVehicleId(booking?.vehicle?.id || "");
                                setSelectedVehicleName(booking?.vehicle?.name || "Vehicle");
                                setVehicleOpen(false);
                              }}
                              className="text-white hover:bg-white/10 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedBooking?.id === booking.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {booking.vehicle?.name || "Vehicle"} — {new Date(booking.startDate).toLocaleDateString()}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : allVehicles.length > 0 ? (
                <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-12 font-normal px-4 rounded-xl"
                    >
                      <Car className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                      <span className="flex-1 text-left truncate">
                        {selectedVehicleName || <span className="text-gray-500">Select the vehicle you rented</span>}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-[#0f1016] border-white/10 text-white rounded-xl overflow-hidden">
                    <Command className="bg-transparent">
                      <CommandInput placeholder="Search vehicle..." className="text-white" />
                      <CommandList>
                        <CommandEmpty>No vehicles found.</CommandEmpty>
                        <CommandGroup>
                          {allVehicles.map((v) => (
                            <CommandItem
                              key={v.id}
                              onSelect={() => {
                                setSelectedVehicleId(v.id);
                                setSelectedVehicleName(v.name);
                                setVehicleOpen(false);
                              }}
                              className="text-white hover:bg-white/10 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedVehicleId === v.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {v.name} — {v.location}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="h-12 px-4 flex items-center bg-white/5 border border-white/10 rounded-xl text-gray-500 text-sm">
                  <Car className="mr-2 h-4 w-4" />
                  Loading vehicles...
                </div>
              )}
            </div>
          </div>

          {/* Location Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300">Incident Location <span className="text-red-400">*</span></label>
            <div className="mt-2">
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={locationOpen}
                    className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-12 font-normal px-4 rounded-xl"
                  >
                    <MapPin className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                    <span className="flex-1 text-left truncate">
                      {location || <span className="text-gray-500">Select city where damage occurred</span>}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" className="w-[--radix-popover-trigger-width] p-0 bg-[#0f1016] border-white/10 text-white rounded-xl overflow-hidden shadow-2xl">
                  <Command className="bg-transparent">
                    <CommandInput placeholder="Search city..." className="text-white border-white/5" />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {INDIAN_CITIES.map((city) => (
                          <CommandItem
                            key={city}
                            value={city}
                            onSelect={(val) => {
                              setLocation(val);
                              setLocationOpen(false);
                            }}
                            className="text-white hover:bg-white/10 aria-selected:bg-white/10 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                location === city ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {city}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-300">Damage Description <span className="text-red-400">*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the damage clearly... e.g. Side door scratch, front bumper dent, broken mirror"
              className="w-full mt-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-sans"
              rows={4}
            />
          </div>

          {/* Upload */}
          <div>
            <label className="text-sm font-medium text-gray-300">Upload Damage Photos (optional)</label>
            <label className="mt-2 flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="p-3 bg-white/5 rounded-full group-hover:bg-primary/10 transition-all">
                <Upload className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 font-medium">
                Click to upload images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleUpload}
              />
            </label>
            {images.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="preview" className="h-20 w-20 object-cover rounded-lg border border-white/10" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
            <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-500 shrink-0" />
            <p>Important: Damage charges will be calculated after expert inspection. The admin will send you a cost estimate.</p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !user}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 transform active:scale-[0.98] transition-all rounded-xl text-black"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Report...
              </>
            ) : (
              "Submit Damage Report"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
