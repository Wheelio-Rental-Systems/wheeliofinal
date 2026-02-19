import React from 'react';
import { User, Car, ArrowLeft } from 'lucide-react';

const RentalTypeSelection = ({ onNext, initialType, vehicle, onBack }) => {
    const isBikeOrScooter = vehicle && ['Bike', 'Scooter'].includes(vehicle.type);

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-500">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
            >
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium">Back to Vehicles</span>
            </button>

            <h2 className="text-3xl font-bold text-white mb-2 text-center">How would you like to travel?</h2>
            <p className="text-gray-400 mb-8 text-center bg-transparent">Choose your preferred mode of rental.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => onNext('self')}
                    className="group relative flex flex-col items-center p-8 rounded-3xl border border-white/10 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/50 transition-all duration-300"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Car className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Self Drive</h3>
                    <p className="text-sm text-gray-400 text-center">
                        Take control of the wheel. Perfect for improved privacy and flexibility.
                    </p>
                    <span className="absolute top-4 right-4 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        Popular
                    </span>
                </button>

                <button
                    disabled={isBikeOrScooter}
                    onClick={() => !isBikeOrScooter && onNext('chauffeur')}
                    className={`group relative flex flex-col items-center p-8 rounded-3xl border transition-all duration-300 ${isBikeOrScooter
                        ? 'border-white/5 bg-gray-900/50 opacity-50 cursor-not-allowed grayscale'
                        : 'border-white/10 bg-secondary/20 hover:bg-secondary/40 hover:border-purple-400/50'
                        }`}
                >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform ${isBikeOrScooter ? 'bg-gray-800' : 'bg-purple-500/10 group-hover:scale-110'}`}>
                        <User className={`w-10 h-10 ${isBikeOrScooter ? 'text-gray-600' : 'text-purple-400'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">With Driver</h3>
                    <p className="text-sm text-gray-400 text-center">
                        {isBikeOrScooter
                            ? "Chauffeur service is not available for two-wheelers."
                            : "Relax and enjoy the ride. Our professional chauffeurs will take you there safely."
                        }
                    </p>
                </button>
            </div>
        </div>
    );
};

export default RentalTypeSelection;
