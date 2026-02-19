import { AlertCircle, Upload, MapPin, X, Camera, CheckCircle } from "lucide-react";
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

// interface EmergencyDamageDialogProps removed (JS file)

export function EmergencyDamageDialog({ open, onOpenChange }) {
  const [damageDescription, setDamageDescription] = useState("");
  const [location, setLocation] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedImages((prev) => [...prev, ...newFiles]);

      // Create preview URLs
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Unable to fetch location");
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDamageDescription("");
    setLocation("");
    setUploadedImages([]);
    setPreviewUrls([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl border-destructive/20 max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-2xl text-destructive">
                    Emergency Damage Report
                  </DialogTitle>
                  <DialogDescription>
                    Report vehicle damage or incidents immediately
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Damage Description */}
              <div className="space-y-2">
                <Label htmlFor="damage-description">
                  Damage Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="damage-description"
                  placeholder="Describe what happened and the extent of the damage..."
                  className="min-h-[120px] resize-none"
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Include details like: What happened? When did it occur? Any injuries?
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label>
                  Damage Photos <span className="text-destructive">*</span>
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="damage-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="damage-images"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="p-3 rounded-lg bg-muted">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB each (max 5 images)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Damage ${index + 1}`}
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

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter location or use GPS"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Use GPS
                  </Button>
                </div>
              </div>

              {/* Emergency Contact Info */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                <h4 className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Emergency Contact
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  For immediate assistance, call our 24/7 emergency line:
                </p>
                <p className="font-semibold text-lg">1-800-WHEELIO-911</p>
              </div>

              {/* Action Buttons */}
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
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
                  disabled={isLoading || uploadedImages.length === 0}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Submitting Report...
                    </div>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Emergency Report
                    </>
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
              <DialogTitle className="text-2xl">Report Submitted Successfully</DialogTitle>
              <DialogDescription className="pt-2">
                Your emergency damage report has been received and assigned case number{" "}
                <span className="text-foreground font-semibold">EMG-{Date.now().toString().slice(-6)}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-4">
              <div className="p-4 rounded-lg bg-muted/50 text-left space-y-2">
                <h4 className="font-semibold">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Our emergency response team will contact you within 15 minutes</li>
                  <li>• A support agent has been assigned to your case</li>
                  <li>• You'll receive updates via SMS and email</li>
                  <li>• If needed, roadside assistance will be dispatched</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-left">
                <p className="text-sm">
                  <strong>Urgent assistance needed?</strong>
                  <br />
                  Call our emergency line: <span className="font-semibold">1-800-WHEELIO-911</span>
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:opacity-90"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
