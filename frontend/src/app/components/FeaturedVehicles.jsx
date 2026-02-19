import React from 'react';
import { Star, Users, Briefcase, Zap, ArrowRight } from 'lucide-react';
import { Button } from "./ui/button";

const FeaturedVehicles = ({ vehicles, onNavigate, onBook }) => {
    // Sort by rating (descending) and take top 3
    const topVehicles = [...vehicles]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Glow - Subtle to enhance Antigravity visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Top Rated <span className="text-primary">Wheels</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl text-lg">
                            Experience the best rides chosen by our community.
                        </p>
                    </div>
                    <Button
                        onClick={() => onNavigate('vehicles')}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hidden md:flex items-center gap-2 rounded-full px-6"
                    >
                        View All Cars <ArrowRight size={16} />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {topVehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="group bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center border border-white/10">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                                    <span className="text-white font-medium text-sm">{vehicle.rating}</span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-2xl font-bold text-white mb-2">{vehicle.name}</h3>
                                <div className="flex items-center text-sm text-gray-400 mb-6 space-x-4">
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider">
                                        {vehicle.type}
                                    </span>
                                    <span>{vehicle.transmission}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Users size={16} className="text-primary mr-2" />
                                        {vehicle.passengers} Seats
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Briefcase size={16} className="text-primary mr-2" />
                                        {vehicle.luggage} Bags
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Zap size={16} className="text-yellow-500 mr-2" />
                                        {vehicle.fuel}
                                    </div>
                                    <div className="flex items-center text-green-400 text-sm">
                                        ₹{vehicle.price}/day
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Button
                                        onClick={() => onBook(vehicle)}
                                        className="w-full bg-primary hover:bg-cyan-400 text-black font-bold h-12 rounded-xl"
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Button
                        onClick={() => onNavigate('vehicles')}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 w-full rounded-xl h-12"
                    >
                        View All Cars
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedVehicles;
