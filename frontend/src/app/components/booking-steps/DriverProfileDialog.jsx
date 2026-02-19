import React from 'react';
import { Star, ShieldCheck, Check, Globe, X } from 'lucide-react';
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "../ui/dialog";

const DriverProfileDialog = ({ driver, open, onOpenChange, onConfirm, adminMode = false }) => {
    if (!driver) return null;

    // Mock Ride History for Admin Mode
    const rideHistory = [
        { id: 101, date: '2 days ago', route: 'Chennai Airport -> OMR', amount: '₹850', rating: 5 },
        { id: 102, date: '5 days ago', route: 'T. Nagar -> Central Station', amount: '₹420', rating: 4 },
        { id: 103, date: '1 week ago', route: 'Anna Nagar -> Airport', amount: '₹600', rating: 5 },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#09090b] text-white border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0 shadow-2xl shadow-primary/20 [&>button]:hidden">

                {/* Header Image Section */}
                <div className="relative h-40 bg-gradient-to-r from-gray-900 to-black overflow-hidden border-b border-white/10">
                    <DialogClose className="absolute right-5 top-5 rounded-full bg-black/50 p-2 hover:bg-white/20 transition-all z-50 text-white backdrop-blur-md border border-white/10">
                        <X size={18} />
                    </DialogClose>
                </div>

                <div className="px-8 pb-8 space-y-8 relative">
                    <div className="-mt-16 mb-6">
                        <div className="relative inline-block">
                            <img
                                src={driver.image}
                                alt={driver.name}
                                className="w-32 h-32 rounded-full border-4 border-[#09090b] bg-gray-800 object-cover shadow-xl relative z-10"
                            />
                            <div className="absolute bottom-1 right-1 z-20 bg-[#09090b] rounded-full p-1">
                                <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    {/* Basic Info */}
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-3xl font-bold text-white mb-2 tracking-tight">{driver.name}</DialogTitle>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                                    <Star size={14} className="fill-yellow-500 mr-1.5" />
                                    {driver.rating}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span className="text-gray-300">{driver.reviews} Reviews</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span className="text-gray-300">{driver.location}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {driver.badges.map((badge, idx) => (
                                <span key={idx} className="text-xs font-semibold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider group-hover:text-primary transition-colors">Experience</p>
                            <p className="text-white font-bold text-lg">{driver.experience}</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider group-hover:text-primary transition-colors">Languages</p>
                            <div className="flex flex-wrap gap-2">
                                {driver.languages.map(lang => (
                                    <span key={lang} className="text-xs text-gray-300 bg-black/40 px-2 py-1 rounded-md border border-white/5">{lang}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* License Section - Digital Card Style */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-primary" /> Verified Credentials
                        </h4>

                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-1">
                            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>

                            <div className="relative bg-[#09090b]/80 backdrop-blur-xl rounded-xl p-5 flex flex-col md:flex-row gap-6 items-center">
                                {/* Digital ID Card Look */}
                                <div className="w-full md:w-48 h-32 relative group perspective-1000">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-primary rounded-xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500"></div>
                                    <div className="relative h-full w-full rounded-xl overflow-hidden border border-white/20 shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                                        <img
                                            src={driver.licenseImage || "/images/license.jpeg"}
                                            alt="Driving License"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-[10px] text-green-400 font-mono uppercase">Verified ID</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full space-y-3">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <div className="p-1 bg-green-500/20 rounded-full">
                                            <Check size={14} className="text-green-500" />
                                        </div>
                                        <span className="text-sm text-green-400 font-medium">Background Verification Complete</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="p-1 bg-white/10 rounded-full">
                                            <Check size={14} className="text-primary" />
                                        </div>
                                        <span className="text-sm text-gray-300">Commercial License Valid</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="p-1 bg-white/10 rounded-full">
                                            <Check size={14} className="text-primary" />
                                        </div>
                                        <span className="text-sm text-gray-300">No Criminal Record</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {driver.recentReviews && driver.recentReviews.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Reviews</h4>
                            <div className="space-y-4">
                                {driver.recentReviews.map((review, idx) => (
                                    <div key={idx} className="bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-all">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-gray-200 text-sm">{review.author}</span>
                                            <span className="flex items-center bg-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-500 text-xs">
                                                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={10} className="fill-yellow-500" />)}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm italic leading-relaxed">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ride History for Admin */}
                    {adminMode && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Globe size={16} /> Recent Trips
                            </h4>
                            <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                                {rideHistory.map((ride, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                        <div>
                                            <p className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">{ride.route}</p>
                                            <p className="text-xs text-gray-500 mt-1">{ride.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-primary font-bold">{ride.amount}</p>
                                            <span className="flex items-center justify-end text-yellow-500 text-xs mt-1">
                                                <Star size={10} className="fill-yellow-500 mr-1" /> {ride.rating}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {!adminMode && (
                    <DialogFooter className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md sticky bottom-0 z-50">
                        <Button
                            onClick={onConfirm}
                            className="w-full bg-primary hover:bg-cyan-400 text-black font-bold h-14 text-base rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
                        >
                            Select {driver.name}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DriverProfileDialog;
