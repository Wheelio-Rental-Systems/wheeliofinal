import React from 'react';
import { Users, Fuel, Gauge, ArrowRight } from 'lucide-react';

const VehicleCard = ({ vehicle, onBook }) => {
  return (
    <div className="group bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full cursor-pointer hover:bg-white/10" onClick={(e) => { e.stopPropagation(); onBook(vehicle); }}>
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-50" />
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <span className="text-primary font-bold text-sm">{vehicle.type}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{vehicle.name}</h3>
          <p className="text-gray-400 text-sm">{vehicle.brand}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Users size={16} className="text-primary/70" />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Fuel size={16} className="text-primary/70" />
            <span>{vehicle.fuelType || vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Gauge size={16} className="text-primary/70" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Daily Rate</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">₹{vehicle.price}</span>
              <span className="text-gray-500 text-sm">/day</span>
            </div>
          </div>
          <button
            className="bg-white/5 hover:bg-primary hover:text-black text-white p-3 rounded-xl transition-all duration-300 group/btn"
          >
            <ArrowRight size={20} className="transform group-hover/btn:-rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
