import React, { useState } from 'react';
import {
  Star, Users, Gauge, Fuel, MapPin, Shield, Award, CheckCircle,
  X, Calendar, ChevronRight, Info
} from "lucide-react";
import { Badge } from "./ui/badge";

export function VehicleDetailsDialog({
  open,
  onOpenChange,
  vehicle,
  onBook
}) {
  const [activeTab, setActiveTab] = useState('specifications');
  const [rentalDays, setRentalDays] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Sync selected image when vehicle changes
  React.useEffect(() => {
    if (vehicle) {
      setSelectedImage(vehicle.image);
    }
  }, [vehicle]);

  if (!vehicle || !open) return null;

  // Use defined gallery images or fallback to duplicates of main image for UI consistency
  const galleryImages = vehicle.images || [vehicle.image, vehicle.image, vehicle.image, vehicle.image];

  // Calculate costs
  const baseRate = vehicle.price;
  const totalBase = baseRate * rentalDays;
  const insurance = 96;
  const gst = Math.round(totalBase * 0.05);
  const totalAmount = totalBase + insurance + gst;

  // Tab Content Helpers
  const renderSpecifications = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-y-6 gap-x-12">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-gray-400">Mileage</span>
          <span className="text-white font-medium">{vehicle.details?.mileage || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-gray-400">Engine Capacity</span>
          <span className="text-white font-medium">{vehicle.details?.engine || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-gray-400">Power</span>
          <span className="text-white font-medium">{vehicle.details?.power || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-gray-400">Top Speed</span>
          <span className="text-white font-medium">{vehicle.details?.topSpeed || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-gray-400">Tank Capacity</span>
          <span className="text-white font-medium">{vehicle.details?.fuelTank || 'N/A'}</span>
        </div>
        {vehicle.type !== 'Bike' && vehicle.type !== 'Scooter' && (
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-400">Boot Space</span>
            <span className="text-white font-medium">{vehicle.details?.bootSpace || 'N/A'}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
      {vehicle.features?.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <CheckCircle size={16} className="text-primary" />
          <span className="text-sm text-gray-200">{feature}</span>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-bold text-white">{vehicle.rating}</div>
        <div>
          <div className="flex text-yellow-500 mb-1">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <p className="text-gray-400 text-sm">{vehicle.reviews} verified reviews</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-white">Rahul K.</span>
            <span className="text-xs text-gray-500">2 days ago</span>
          </div>
          <p className="text-gray-300 text-sm">"Absolutely loved driving the {vehicle.name}. Smooth pickup and great mileage on the highway."</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-white">Priya S.</span>
            <span className="text-xs text-gray-500">1 week ago</span>
          </div>
          <p className="text-gray-300 text-sm">"Car was clean and well maintained. Pickup process was seamless."</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-6xl bg-[#0f0f1a] border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[90dvh] md:h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Close Button - Fixed relative to dialog */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Content Wrapper - Scrollable on mobile, Fixed on Desktop */}
        <div className="flex-1 w-full h-full overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">

          {/* LEFT COLUMN: Gallery & Info */}
          <div className="w-full md:w-[60%] p-6 md:p-8 md:overflow-y-auto custom-scrollbar md:h-full">
            {/* Header Mobile Only */}
            <div className="md:hidden mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{vehicle.name}</h2>
              <p className="text-gray-400">{vehicle.brand} • {vehicle.type}</p>
            </div>

            {/* Main Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 group">
              <img
                src={selectedImage || vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <Badge className={vehicle.status === 'available' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}>
                  {vehicle.status === 'available' ? 'Available' : 'Booked'}
                </Badge>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {galleryImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`View ${i + 1}`} />
                </div>
              ))}
            </div>

            {/* Title & Stats */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{vehicle.name}</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>{vehicle.brand}</span>
                    <span>•</span>
                    <span>{vehicle.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Star size={16} className="text-primary fill-primary" />
                  <span className="text-white font-bold">{vehicle.rating}</span>
                  <span className="text-gray-500 text-xs">({vehicle.reviews} reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-center">
                  <Fuel className="mx-auto mb-2 text-primary" size={20} />
                  <p className="text-xs text-gray-400">Fuel</p>
                  <p className="font-bold text-white text-sm">{vehicle.fuelType}</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <Gauge className="mx-auto mb-2 text-primary" size={20} />
                  <p className="text-xs text-gray-400">Transmission</p>
                  <p className="font-bold text-white text-sm">{vehicle.transmission}</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <Users className="mx-auto mb-2 text-primary" size={20} />
                  <p className="text-xs text-gray-400">Seating</p>
                  <p className="font-bold text-white text-sm">{vehicle.seats} Seats</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <MapPin className="mx-auto mb-2 text-primary" size={20} />
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="font-bold text-white text-sm">{vehicle.location}</p>
                </div>
              </div>
            </div>

            {/* TABS Navigation */}
            <div className="sticky top-0 z-10 bg-[#0f0f1a] pt-2 flex gap-6 border-b border-white/10 mb-6">
              {['specifications', 'features', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'specifications' && renderSpecifications()}
              {activeTab === 'features' && renderFeatures()}
              {activeTab === 'reviews' && renderReviews()}
            </div>
          </div>

          {/* RIGHT COLUMN: Booking & Pricing */}
          <div className="w-full md:w-[40%] bg-[#151520] border-l border-white/10 flex flex-col h-auto md:h-full md:overflow-hidden">

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pb-24">
              <div className="mb-2">
                <span className="text-4xl font-bold text-primary">₹{vehicle.price}</span>
                <span className="text-gray-400 ml-2">per day</span>
              </div>

              {/* Rental Duration Input */}
              <div className="my-8">
                <label className="text-sm font-medium text-white mb-2 block">Rental Duration (days)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rentalDays}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val > 10) return;
                      setRentalDays(val);
                    }}
                    className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-8">
                <h4 className="flex items-center gap-2 font-bold text-white text-sm">
                  <CheckCircle size={16} className="text-green-500" />
                  What's Included
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base rental ({rentalDays} days)</span>
                    <span className="text-gray-300">₹{totalBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Included distance</span>
                    <span className="text-gray-300">{120 * rentalDays} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Insurance</span>
                    <span className="text-gray-300">₹{insurance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GST (5%)</span>
                    <span className="text-gray-300">₹{gst}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-lg font-bold text-white">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">₹{totalAmount}</span>
                </div>
              </div>

              {/* Additional Info Box */}
              <div className="bg-[#1f1f2e] border border-orange-500/20 rounded-xl p-4 mb-8">
                <h5 className="text-orange-500 font-bold text-sm mb-3 flex items-center gap-2">
                  <Info size={16} /> Additional Charges
                </h5>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>• Extra km: ₹8/km</li>
                  <li>• Late return: ₹500/hour</li>
                  <li>• Cleaning fee: ₹300 (if required)</li>
                  <li>• Damage charges: As per inspection</li>
                </ul>
              </div>

              {/* Security Deposit Note */}
              <div className="bg-[#0f0f1a] border border-blue-500/20 rounded-xl p-4 mb-auto">
                <h5 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <Shield size={16} /> Security Deposit
                </h5>
                <p className="text-xs text-gray-400">
                  ₹5,000 refundable deposit required. Will be refunded within 7 days after vehicle inspection.
                </p>
              </div>
            </div>

            {/* Sticky Footer Action Button */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-[#151520] z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
              <button
                onClick={() => {
                  console.log("Book Now Clicked for:", vehicle.name);
                  if (onBook) onBook();
                  else console.error("onBook function is missing!");
                }}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 relative z-50 cursor-pointer"
              >
                Book Now
                <ChevronRight size={20} />
              </button>

              <p className="text-center text-[10px] text-gray-500 mt-4">
                By booking, you agree to our terms & conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
