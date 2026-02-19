import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Clock, MapPin, Search, ChevronRight, Loader2 } from 'lucide-react';
import { getAvailableDrivers } from '../../../api/drivers';
import DriverProfileDialog from './DriverProfileDialog';
import { toast } from 'sonner';
import { drivers as localDrivers } from '../../data/drivers';

const DriverSelection = ({ onNext, onBack, initialDriver, vehicleLocation }) => {
    // Filter drivers based on vehicle location if available, otherwise show all
    const effectiveLocation = vehicleLocation || "Mumbai"; // Default or dynamic

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(initialDriver || null);
    const [viewingDriver, setViewingDriver] = useState(null);

    // ... inside component ...
    useEffect(() => {
        const fetchDrivers = async () => {
            setLoading(true);
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Filter local drivers by location
                // Case-insensitive comparison and handle defaults
                const targetLocation = (effectiveLocation || "Mumbai").toLowerCase();

                const filteredDrivers = localDrivers.filter(driver =>
                    driver.location.toLowerCase() === targetLocation
                );

                // If no drivers found for location, maybe show all or show specific message?
                // For now, let's fall back to showing all if none found, or just show empty.
                // User requirement: "driver matching to the car location must be dispalyed"
                // So strict filtering is better.

                setDrivers(filteredDrivers.length > 0 ? filteredDrivers : []);

            } catch (error) {
                console.error("Failed to fetch drivers", error);
                setDrivers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDrivers();
    }, [effectiveLocation]);

    // No client-side filtering needed anymore as backend handles it
    const displayDrivers = drivers;

    const handleCardClick = (driver) => {
        setViewingDriver(driver);
    };

    const handleConfirmSelection = () => {
        if (viewingDriver) {
            setSelectedDriver(viewingDriver);
            setViewingDriver(null);
            onNext(viewingDriver);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Choose Your Chauffeur</h2>
                    <p className="text-gray-400">Professional drivers available in <span className="text-primary">{effectiveLocation}</span></p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-gray-400">Loading drivers...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayDrivers.map((driver) => (
                        <div
                            key={driver.id}
                            onClick={() => handleCardClick(driver)}
                            className={`relative group p-4 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${selectedDriver?.id === driver.id
                                ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                                : 'bg-card/50 border-white/5 hover:bg-white/[0.02] hover:border-white/20'
                                }`}
                        >
                            {/* Selection Indicator */}
                            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedDriver?.id === driver.id ? 'border-primary bg-primary text-black' : 'border-white/20'
                                }`}>
                                {selectedDriver?.id === driver.id && <div className="w-2 h-2 bg-black rounded-full" />}
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={driver.image}
                                    alt={driver.name}
                                    className="w-16 h-16 rounded-2xl object-cover shadow-md"
                                />
                                <div>
                                    <h3 className="font-bold text-white text-lg">{driver.name}</h3>
                                    <div className="flex items-center text-yellow-500 text-sm font-medium">
                                        <Star size={14} className="fill-yellow-500 mr-1" />
                                        {driver.rating} <span className="text-gray-500 ml-1 font-normal">({driver.reviews})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center text-sm text-gray-400">
                                    <Clock size={16} className="text-primary mr-2" />
                                    <span>{driver.experience} Experience</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-400">
                                    <MapPin size={16} className="text-red-400 mr-2" />
                                    <span>{driver.location}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {driver.badges.map((badge, idx) => (
                                        <span key={idx} className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded-lg">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                >
                    Back
                </button>
            </div>

            <DriverProfileDialog
                driver={viewingDriver}
                open={!!viewingDriver}
                onOpenChange={(open) => !open && setViewingDriver(null)}
                onConfirm={handleConfirmSelection}
            />
        </div>
    );
};

export default DriverSelection;
