import React, { useState } from 'react';
import { Shield, Smartphone, HardHat, Camera, ChevronRight } from 'lucide-react';

const ADD_ONS = [
    {
        id: 'insurance',
        name: 'Zero Dep Insurance',
        price: 249,
        icon: Shield,
        description: 'Complete coverage for damages ensuring zero liability.'
    },
    {
        id: 'helmet',
        name: 'Pillion Helmet',
        price: 50,
        icon: HardHat,
        description: 'ISI certified helmet for the pillion rider safety.'
    },
    {
        id: 'mount',
        name: 'Phone Mount',
        price: 99,
        icon: Smartphone,
        description: 'Secure handlebar mount for easy navigation.'
    },
    {
        id: 'gopro',
        name: 'GoPro Hero 11',
        price: 499,
        icon: Camera,
        description: 'Capture your journey in 5.3K resolution.'
    }
];

const AddOns = ({ onNext, onBack, vehicle }) => {
    const [selectedAddOns, setSelectedAddOns] = useState([]);

    const toggleAddOn = (id) => {
        if (selectedAddOns.includes(id)) {
            setSelectedAddOns(selectedAddOns.filter(item => item !== id));
        } else {
            setSelectedAddOns([...selectedAddOns, id]);
        }
    };

    const handleContinue = () => {
        const addOnDetails = ADD_ONS.filter(addon => selectedAddOns.includes(addon.id));
        onNext(addOnDetails);
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-bold text-white mb-2">Enhance Your Ride</h2>
            <p className="text-gray-400 mb-8">Select optional add-ons for a safer and better experience.</p>

            <div className="space-y-4 mb-8">
                {ADD_ONS.filter(addon => {
                    // Filter logic: Pillion Helmet only for Bikes/Scooters
                    if (addon.id === 'helmet') {
                        return vehicle.type === 'Bike' || vehicle.type === 'Scooter';
                    }
                    return true;
                }).map((addon) => (
                    <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${selectedAddOns.includes(addon.id)
                            ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                            : 'bg-secondary/20 border-white/5 hover:bg-secondary/40 hover:border-white/10'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedAddOns.includes(addon.id) ? 'bg-primary text-black' : 'bg-black/40 text-gray-400 group-hover:text-white'
                            }`}>
                            <addon.icon size={24} />
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-bold text-lg ${selectedAddOns.includes(addon.id) ? 'text-white' : 'text-gray-200'}`}>
                                {addon.name}
                            </h3>
                            <p className="text-sm text-gray-500">{addon.description}</p>
                        </div>

                        <div className="text-right">
                            <div className={`font-bold text-lg ${selectedAddOns.includes(addon.id) ? 'text-primary' : 'text-white'}`}>
                                ₹{addon.price}<span className="text-xs text-gray-500 font-normal">/day</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 ml-auto mt-1 flex items-center justify-center ${selectedAddOns.includes(addon.id) ? 'border-primary bg-primary' : 'border-gray-600'
                                }`}>
                                {selectedAddOns.includes(addon.id) && <div className="w-2 h-2 rounded-full bg-black" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={() => onNext([])}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-colors"
                >
                    Skip
                </button>
                <button
                    onClick={handleContinue}
                    className="flex-1 py-4 rounded-xl bg-primary text-black font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    Continue <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default AddOns;
