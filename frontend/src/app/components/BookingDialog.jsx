import { Calendar, X, CreditCard, CheckCircle, Upload as UploadIcon } from "lucide-react";
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

/* -------------------- UTILS -------------------- */
const formatINR = (amount) => `₹${amount}`;

/* -------------------- COMPONENT -------------------- */
export function BookingDialog({ open, onOpenChange, vehicle }) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [licensePreview, setLicensePreview] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!vehicle) return null;

  /* -------------------- HELPERS -------------------- */
  const calculateDuration = () => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const duration = calculateDuration();
  const totalPrice = duration > 0 ? duration * vehicle.pricePerDay : vehicle.pricePerDay;
  const days = duration; // Alias for UI consistency

  /* -------------------- HANDLERS -------------------- */
  const handleBook = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleLicenseUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLicenseImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setLicensePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const resetAndClose = () => {
    setPickupDate("");
    setReturnDate("");
    setLicenseImage(null);
    setLicensePreview("");
    setIsSubmitted(false);
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  /* -------------------- UI -------------------- */
  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-2xl border-primary/20 bg-[#0f0f1a]/95 backdrop-blur-xl">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary font-bold">
                Book {vehicle.name}
              </DialogTitle>
              <DialogDescription>
                Complete your booking by providing the required details
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* VEHICLE SUMMARY */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 flex items-center gap-4">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-24 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{vehicle.name}</h4>
                  <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Total for {duration > 0 ? duration : 1} days</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatINR(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatINR(vehicle.pricePerDay)} / day</p>
                </div>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pickup Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Return Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={pickupDate}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* LICENSE UPLOAD */}
              <div>
                <Label>Driver’s License *</Label>

                {!licensePreview ? (
                  <label className="mt-2 flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                    <UploadIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload license (PNG / JPG, max 10MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLicenseUpload}
                      required
                    />
                  </label>
                ) : (
                  <div className="relative mt-2">
                    <img
                      src={licensePreview}
                      alt="License Preview"
                      className="h-48 w-full object-contain rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLicenseImage(null);
                        setLicensePreview("");
                      }}
                      className="absolute top-2 right-2 bg-destructive p-1 rounded-full"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* PRICE SUMMARY */}
              {days > 0 && (
                <div className="p-4 rounded-lg bg-muted/40 border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duration</span>
                    <span>{days} day(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Daily Rate</span>
                    <span>{formatINR(vehicle.pricePerDay)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{formatINR(totalPrice)}</span>
                  </div>
                </div>
              )}

              {/* INFO */}
              <div className="p-4 rounded-lg bg-muted/40 border text-sm text-muted-foreground">
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <CreditCard className="h-4 w-4" /> Important Information
                </p>
                <ul className="mt-2 space-y-1">
                  <li>• Valid license required</li>
                  <li>• Refundable deposit: ₹500</li>
                  <li>• Free cancellation up to 24 hours before pickup</li>
                </ul>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !licenseImage || days === 0}
                >
                  {isLoading ? "Processing..." : `Pay ${formatINR(totalPrice)}`}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* CONFIRMATION */
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold">Booking Confirmed</h2>
            <p className="text-muted-foreground">
              Booking ID: BK-{Date.now().toString().slice(-6)}
            </p>
            <p className="font-medium">{vehicle.name}</p>
            <p>Total Paid: {formatINR(totalPrice)}</p>

            <Button onClick={resetAndClose} className="mt-4">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
