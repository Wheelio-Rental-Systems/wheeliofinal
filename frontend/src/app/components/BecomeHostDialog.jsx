import { Upload, X, CheckCircle, Car, MapPin, IndianRupee, Calendar, Fuel, Gauge } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// interface BecomeHostDialogProps removed (JS file)

export function BecomeHostDialog({ open, onOpenChange }) {
  const [rcBook, setRcBook] = useState(null);
  const [rcPreview, setRcPreview] = useState("");
  const [vehicleImages, setVehicleImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRcUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRcBook(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRcPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVehicleImagesUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - vehicleImages.length);
      setVehicleImages((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setVehicleImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setRcBook(null);
    setRcPreview("");
    setVehicleImages([]);
    setImagePreviews([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl border-primary/20">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#7c3aed]/20 to-[#ec4899]/20">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
                    Become a Host
                  </DialogTitle>
                  <DialogDescription>
                    List your vehicle and start earning
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Bike/Scooter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model Name</Label>
                  <Input id="model" placeholder="e.g., Tata Nexon" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="e.g., Tata" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2024" min="2000" max="2026" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuel-type">Fuel Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats">Seating Capacity</Label>
                  <Input id="seats" type="number" placeholder="5" min="1" max="8" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Daily Rate (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="price" type="number" placeholder="1500" className="pl-10" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="location" placeholder="Enter full address" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vehicle's condition, features, and any additional information..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label>RC Book (Registration Certificate) <span className="text-destructive">*</span></Label>

                {!rcPreview ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="rc-upload"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleRcUpload}
                      required
                    />
                    <label htmlFor="rc-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="p-3 rounded-lg bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="text-primary">Click to upload</span> RC Book
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={rcPreview}
                      alt="RC Book"
                      className="w-full h-40 object-contain rounded-lg border border-border bg-muted/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRcBook(null);
                        setRcPreview("");
                      }}
                      className="absolute -top-2 -right-2 p-2 rounded-full bg-destructive text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Vehicle Images (Multiple Angles) <span className="text-destructive">*</span></Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="vehicle-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleVehicleImagesUpload}
                  />
                  <label htmlFor="vehicle-images" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="p-3 rounded-lg bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="text-primary">Click to upload</span> vehicle images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Upload 3-5 images from different angles ({vehicleImages.length}/5)
                      </p>
                    </div>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-[#7c3aed]/10 to-[#ec4899]/10 border border-primary/20">
                <h4 className="font-semibold mb-2">Benefits of Becoming a Host</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Earn up to ₹30,000/month from your idle vehicle</li>
                  <li>• Full insurance coverage during rental period</li>
                  <li>• Verified renters through document verification</li>
                  <li>• 24/7 support and roadside assistance</li>
                  <li>• Flexible hosting - rent when you want</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:opacity-90"
                  disabled={isLoading || !rcBook || vehicleImages.length < 3}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-[#10b981]" />
              </div>
            </div>

            <DialogHeader>
              <DialogTitle className="text-2xl">Application Submitted!</DialogTitle>
              <DialogDescription className="pt-2">
                Your vehicle listing is under review
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-4">
              <div className="p-4 rounded-lg bg-muted/50 text-left space-y-2">
                <h4 className="font-semibold">What's Next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Our team will verify your documents within 24-48 hours</li>
                  <li>• You'll receive an email confirmation once approved</li>
                  <li>• Your vehicle will be listed on Wheelio platform</li>
                  <li>• Start receiving booking requests immediately</li>
                </ul>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:opacity-90"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
