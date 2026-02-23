import React, { useState, useEffect } from 'react';
import {
    MapPin, Calendar, Clock, Phone, CheckCircle,
    LayoutDashboard, Car, ClipboardCheck, Wallet, User,
    Bell, Star, LogOut, ChevronRight, Upload, AlertTriangle,
    IndianRupee, Navigation, Shield, FileText
} from 'lucide-react';
import * as bookingsAPI from '../../api/bookings';
import * as filesAPI from '../../api/files';
import * as usersAPI from '../../api/users';
import * as driversAPI from '../../api/drivers';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

const DriverDashboard = ({ onNavigate, user, onLogout, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isOnline, setIsOnline] = useState(true);
    const [trips, setTrips] = useState([]);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [stats, setStats] = useState({
        todayEarnings: 0,
        tripsToday: 0,
        rating: user?.rating || 0.0,
        onlineHours: '0'
    });

    // Notifications state removed
    const [seenBookingIds, setSeenBookingIds] = useState(new Set());
    // Save notifications effect removed

    // Settings State
    const [expandedSection, setExpandedSection] = useState(null);
    const [shiftPreferences, setShiftPreferences] = useState({
        shift: 'Morning',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        longTrips: true
    });
    const [bankDetails, setBankDetails] = useState({
        holderName: user?.name || user?.fullName || '',
        accountNumber: '',
        ifsc: '',
        bankName: ''
    });

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const fetchTrips = async (isPolling = false) => {
        try {
            let bookings = [];
            try {
                // Fetch only this driver's bookings
                if (user?.id) {
                    bookings = await bookingsAPI.getDriverBookings(user.id);
                }
            } catch (e) {
                console.warn("Backend fetch failed", e);
                bookings = [];
            }

            if (!bookings || !Array.isArray(bookings)) bookings = [];

            // Deduplicate by booking ID
            const uniqueIds = new Set();
            const uniqueBookings = bookings.filter(b => {
                if (!b.id || uniqueIds.has(b.id)) return false;
                uniqueIds.add(b.id);
                return true;
            });

            const formattedTrips = uniqueBookings.map((b) => {
                // Calculate duration for driver allowance
                const start = new Date(b.startDate);
                const end = new Date(b.endDate);
                const diffTime = Math.abs(end - start);
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                const driverAllowance = 800 * days;

                return {
                    id: b.id,
                    pickup: b.pickupLocation || 'Not Provided',
                    drop: b.dropLocation || 'Not Provided',
                    time: b.startDate ? new Date(b.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                    date: b.startDate ? new Date(b.startDate).toLocaleDateString() : '',
                    endDate: b.endDate ? new Date(b.endDate).toLocaleDateString() : '',
                    customer: b.user?.name || b.userName || 'Customer',
                    customerEmail: b.user?.email || '',
                    phone: b.user?.phone || b.phone || '', // Keep raw phone
                    vehicle: b.vehicle?.name || b.vehicleName || 'Vehicle',
                    vehicleModel: b.vehicle?.model || '',
                    status: b.status || 'PENDING',
                    paymentStatus: b.paymentStatus || 'PENDING',
                    fare: b.totalAmount ? `₹${Number(b.totalAmount).toLocaleString()}` : '₹0',
                    rawAmount: Number(b.totalAmount) || 0,
                    driverAllowance: `₹${driverAllowance.toLocaleString()}`, // Formatted allowance
                    createdAt: b.createdAt,
                    rawStartDate: b.startDate,
                };
            }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

            // Detect new bookings for toasts (kept for alerts only, no persistent list)
            if (isPolling && seenBookingIds.size > 0) {
                const newBookings = formattedTrips.filter(t => !seenBookingIds.has(t.id));
                if (newBookings.length > 0) {
                    newBookings.forEach(b => {
                        toast.success(`🚗 New booking from ${b.customer}!`, {
                            description: `${b.vehicle} • ${b.pickup} → ${b.drop} • ${b.date}`,
                            duration: 10000
                        });
                    });
                }
            }

            // Update seen IDs
            setSeenBookingIds(new Set(formattedTrips.map(t => t.id)));
            setTrips(formattedTrips);

            // Calculate stats from completed/confirmed trips
            const totalEarnings = formattedTrips.reduce((acc, curr) => acc + curr.rawAmount, 0);
            const confirmedTrips = formattedTrips.filter(t => t.status === 'CONFIRMED' || t.status === 'COMPLETED');

            setStats(prev => ({
                ...prev,
                todayEarnings: totalEarnings,
                tripsToday: confirmedTrips.length
            }));

        } catch (error) {
            console.error("Error loading trips:", error);
            if (!isPolling) toast.error("Could not load trip history");
        }
    };

    // Initial fetch
    useEffect(() => {
        if (user?.id) fetchTrips(false);
    }, [user]);

    // Poll for new bookings every 30 seconds
    useEffect(() => {
        if (!user?.id || !isOnline) return;
        const interval = setInterval(() => fetchTrips(true), 30000);
        return () => clearInterval(interval);
    }, [user, isOnline, seenBookingIds]);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Fallback if prop not provided
            onNavigate('login');
        }
    };

    // Mock Earnings Data for Graph
    const earningsData = [
        { day: 'Mon', amount: 3200 },
        { day: 'Tue', amount: 2800 },
        { day: 'Wed', amount: 4100 },
        { day: 'Thu', amount: 3500 },
        { day: 'Fri', amount: stats.todayEarnings || 2450 },
    ];

    const vehiclesForInspection = [
        { id: 'V-001', name: 'Maruti Swift', plate: 'TN-01-AB-1234', customer: 'Arun V.', returnTime: '10:00 AM Today', status: 'Pending Inspection', deposit: 5000 },
        { id: 'V-005', name: 'Thar 4x4', plate: 'TN-02-XY-9999', customer: 'John D.', returnTime: '01:30 PM Today', status: 'Inspected', deposit: 8000 }
    ];

    // --- Sub-Components ---

    const Sidebar = () => (
        <div className="hidden lg:flex flex-col w-64 bg-card/50 border-r border-white/5 h-screen pt-20 pb-10 fixed left-0 top-0 overflow-y-auto z-40">
            <div className="px-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={24} />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white leading-tight">{user?.name || user?.fullName || 'Driver'}</h3>
                        <p className="text-xs text-gray-400">ID: {user?.id ? `DRV-88${user.id.substring(user.id.length - 4)}` : 'DRV-NEW'}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {[
                    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
                    { id: 'trips', icon: Car, label: 'My Trips' },
                    // Notifications removed
                    { id: 'inspections', icon: ClipboardCheck, label: 'Vehicle Inspections' },
                    { id: 'damage-report', icon: AlertTriangle, label: 'Report Damage' },
                    { id: 'earnings', icon: Wallet, label: 'Earnings' },
                    { id: 'profile', icon: User, label: 'My Profile' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${activeTab === item.id
                            ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.label}
                        {item.badge > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-lg shadow-red-500/30 animate-pulse">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="px-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );

    const Overview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Status & Quick Stats */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Overview</h2>
                    <p className="text-gray-400">Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-4 bg-card/50 p-2 pr-4 rounded-full border border-white/5">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-500'}`} />
                    <span className="text-sm font-medium text-white">{isOnline ? 'You are Online' : 'You are Offline'}</span>
                    <div
                        className={`w-12 h-6 rounded-full bg-white/10 p-1 cursor-pointer transition-colors ${isOnline ? 'bg-green-500/20' : ''}`}
                        onClick={() => setIsOnline(!isOnline)}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isOnline ? 'translate-x-6 bg-green-500' : 'translate-x-0'}`} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Today's Earnings", value: `₹${stats.todayEarnings.toLocaleString()}`, icon: IndianRupee, color: "text-green-400" },
                    { label: "Trips Today", value: stats.tripsToday, icon: Car, color: "text-blue-400" },
                    { label: "Rating", value: stats.rating, icon: Star, color: "text-yellow-400" },
                    { label: "Online Hours", value: "6.5h", icon: Clock, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-32 hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start">
                            <stat.icon className={`${stat.color} bg-white/5 p-1.5 rounded-lg box-content`} size={20} />
                            {i === 2 && <span className="text-xs text-green-500 font-bold">+0.1</span>}
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Trip Card */}
            {trips.length > 0 ? (
                <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-primary text-black text-xs font-bold rounded-bl-xl uppercase tracking-wider">
                        Active Trip
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/10 rounded-full">
                                    <Navigation size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Heading to</p>
                                    <h3 className="text-xl font-bold text-white">{trips[0].drop}</h3>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 text-sm text-gray-300 ml-2 border-l-2 border-dashed border-white/20 pl-6 py-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Pick</p>
                                    <p className="text-white">{trips[0].pickup}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Drop</p>
                                    <p className="text-white">{trips[0].drop}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Fare</p>
                                    <p className="text-primary font-bold">{trips[0].fare}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold">My Earnings</p>
                                    <p className="text-green-400 font-bold">{trips[0].driverAllowance}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Customer</p>
                                    <p>{trips[0].customer}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-3 min-w-[200px]">
                            {trips[0].phone && (
                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 hover:bg-white/10 text-white flex flex-col items-center h-auto py-3 gap-1"
                                    onClick={() => window.location.href = `tel:${trips[0].phone}`}
                                >
                                    <span className="text-sm font-bold">Call Customer</span>
                                    <span className="text-xs text-primary">{trips[0].phone}</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-card/50 border border-white/5 rounded-3xl p-10 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Trips</h3>
                    <p className="text-gray-400">You're currently available for new bookings.</p>
                </div>
            )}
        </div>
    );

    const statusColors = {
        PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        CONFIRMED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/30',
        CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/30',
    };

    const paymentColors = {
        PENDING: 'text-yellow-400',
        PAID: 'text-green-400',
        REFUNDED: 'text-red-400',
    };

    const TripsList = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">My Bookings</h2>
                <Button variant="outline" onClick={() => fetchTrips(false)} className="text-primary border-primary/20 hover:bg-primary/10 text-sm">
                    Refresh
                </Button>
            </div>
            <div className="space-y-4">
                {trips.length > 0 ? trips.map((trip) => (
                    <div key={trip.id} className="bg-card/50 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-white text-lg">{trip.customer}</h4>
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <Calendar size={14} /> {trip.date} {trip.endDate && `→ ${trip.endDate}`} • <span className="text-primary">{trip.vehicle}</span>
                                </p>
                                {trip.customerEmail && <p className="text-xs text-gray-500 mt-1">{trip.customerEmail}</p>}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className={statusColors[trip.status] || 'border-primary/30 text-primary bg-primary/5'}>
                                    {trip.status}
                                </Badge>
                                <span className={`text-xs font-medium ${paymentColors[trip.paymentStatus] || 'text-gray-400'}`}>
                                    Payment: {trip.paymentStatus}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-black/20 rounded-xl p-4">
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-gray-500 uppercase">Pickup</p>
                                <p className="text-xs font-medium text-white line-clamp-1">{trip.pickup}</p>
                            </div>
                            <div className="px-4 text-gray-600">→</div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-gray-500 uppercase">Drop</p>
                                <p className="text-xs font-medium text-white line-clamp-1">{trip.drop}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-black/20 rounded-xl p-4 mt-2">
                            <div className="text-center">
                                <p className="text-[10px] text-gray-500 uppercase">Fare</p>
                                <p className="text-base font-bold text-white">{trip.fare}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-500 uppercase">Vehicle</p>
                                <p className="text-xs font-medium text-white">{trip.vehicle}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-500 uppercase">Date</p>
                                <p className="text-xs font-medium text-white">{trip.date}</p>
                            </div>
                        </div>
                        {trip.status === 'CONFIRMED' && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                {(() => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const start = new Date(trip.rawStartDate);
                                    start.setHours(0, 0, 0, 0);
                                    const diffTime = start - today;
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                    let statusText = "";
                                    let statusColor = "text-primary";

                                    if (diffDays > 1) {
                                        statusText = `${diffDays} days to go for trip`;
                                    } else if (diffDays === 1) {
                                        statusText = "1 day to go for trip";
                                    } else if (diffDays === 0) {
                                        statusText = "Trip starts today";
                                        statusColor = "text-green-400";
                                    } else {
                                        statusText = "Trip in progress";
                                        statusColor = "text-blue-400";
                                    }

                                    return (
                                        <div className={`w-full py-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 ${statusColor} font-bold text-lg shadow-[0_0_15px_rgba(255,255,255,0.02)]`}>
                                            <Clock size={20} />
                                            {statusText}
                                        </div>
                                    );
                                })()}
                                {trip.phone && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => window.location.href = `tel:${trip.phone}`}
                                        className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl border border-white/5"
                                    >
                                        <Phone size={16} className="mr-2" /> Call Customer
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car size={32} className="text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
                        <p className="text-gray-400">When users book rides with you, they'll appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Notifications component removed

    const Inspections = () => {
        const [selectedVehicle, setSelectedVehicle] = useState(null);
        const [penalty, setPenalty] = useState(0);

        if (selectedVehicle) {
            return (
                <div className="space-y-6 animate-in zoom-in duration-300">
                    <button onClick={() => setSelectedVehicle(null)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
                        <ChevronRight className="rotate-180" size={16} /> Back to List
                    </button>

                    <div className="bg-card/50 border border-white/5 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Inspection: {selectedVehicle.name}</h2>
                        <p className="text-gray-400 text-sm mb-6">{selectedVehicle.plate} • Customer: {selectedVehicle.customer}</p>

                        <div className="space-y-6">
                            {/* Checklist */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-white text-sm uppercase tracking-wide">Digital Checklist</h3>
                                {['Exterior Body', 'Tyres & Wheels', 'Interiors & Upholstery', 'Fuel Level', 'Engine & Sounds'].map((item, i) => (
                                    <label key={i} className="flex items-center gap-4 p-3 bg-black/20 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                                        <input type="checkbox" className="w-5 h-5 rounded border-white/30 bg-transparent checked:bg-primary checked:border-primary text-primary focus:ring-0" defaultChecked />
                                        <span className="text-gray-300">{item}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Damage & Penalty */}
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-4">
                                <div className="flex items-center gap-2 text-red-400 font-bold">
                                    <AlertTriangle size={18} /> Damage Assessment
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Description of New Damages</label>
                                    <textarea className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm" placeholder="Any scratches or dents observed..." rows="3"></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="border-dashed border-white/20 text-gray-400 hover:text-white h-24 w-24 flex flex-col gap-2">
                                        <Upload size={16} /> <span className="text-xs">Add Photo</span>
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Penalty / Extra Charges (₹)</label>
                                    <input
                                        type="number"
                                        value={penalty}
                                        onChange={(e) => setPenalty(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-400">Security Deposit Information</p>
                                    <p className="text-xl font-bold text-white">₹{selectedVehicle.deposit}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Refund Amount</p>
                                    <p className="text-xl font-bold text-green-400">₹{(selectedVehicle.deposit - penalty) > 0 ? (selectedVehicle.deposit - penalty) : 0}</p>
                                </div>
                            </div>

                            <Button onClick={() => { toast.success("Inspection Complete. Refund Processed."); setSelectedVehicle(null); }} className="w-full bg-primary text-black font-bold h-12 text-lg">
                                Complete Inspection & Process Refund
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Vehicle Inspections</h2>
                </div>

                <div className="grid gap-4">
                    {vehiclesForInspection.map(v => (
                        <div key={v.id} className="bg-card/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                    <Car size={24} className="text-gray-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{v.name}</h4>
                                    <p className="text-sm text-gray-400">{v.plate} • <span className="text-primary">{v.status}</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">Return: {v.returnTime}</span>
                                <Button size="sm" onClick={() => setSelectedVehicle(v)} className="bg-primary/10 text-primary hover:bg-primary hover:text-black">
                                    Start Inspection
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const DamageReportSection = () => {
        const [description, setDescription] = useState("");
        const [vehicleId, setVehicleId] = useState("");
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = () => {
            if (!vehicleId || !description) {
                toast.error("Please fill in all fields");
                return;
            }
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                toast.success("Damage report submitted successfully");
                setDescription("");
                setVehicleId("");
            }, 1500);
        };

        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold text-white">Report Damage</h2>
                <div className="bg-card/50 border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Vehicle ID / Plate Number</label>
                        <input
                            type="text"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                            placeholder="e.g. TN-01-AB-1234"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description of Damage</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none h-32"
                            placeholder="Describe the damage details..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Upload Photos</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm">Click to upload damage photos</span>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-12"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Damage Report"}
                    </Button>
                </div>
            </div>
        );
    };

    const Earnings = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white">Earnings Report</h2>

            <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Total Earnings (This Week)</p>
                    <h1 className="text-5xl font-bold text-white mb-2">₹{stats.todayEarnings + 13000}</h1>
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                        <IndianRupee size={14} /> +12% vs last week
                    </div>
                </div>
            </div>

            <div className="bg-card/50 border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-6">Daily Breakdown</h3>
                <div className="space-y-4">
                    {earningsData.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="w-10 text-sm text-gray-500 font-medium">{item.day}</span>
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                    style={{ width: `${(item.amount / 5000) * 100}%` }}
                                />
                            </div>
                            <span className="w-16 text-right font-bold text-white text-sm">₹{item.amount}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-xs uppercase mb-1">Wallet Balance</p>
                    <p className="text-xl font-bold text-white">₹4,200</p>
                    <p className="text-xs text-green-400 mt-1">Available for payout</p>
                </div>
                <div className="bg-card/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-xs uppercase mb-1">Incentives</p>
                    <p className="text-xl font-bold text-white">₹850</p>
                    <p className="text-xs text-yellow-400 mt-1">Earned this week</p>
                </div>
            </div>
        </div>
    );

    const Profile = () => {
        const [isEditingPhone, setIsEditingPhone] = useState(false);
        const [isEditingProfile, setIsEditingProfile] = useState(false);
        const [phone, setPhone] = useState(user?.phone || '');
        const [newName, setNewName] = useState(user?.name || user?.fullName || '');
        const [newPhone, setNewPhone] = useState(phone);
        const [isUploading, setIsUploading] = useState(false);

        const handleSavePhone = () => {
            setPhone(newPhone);
            setIsEditingPhone(false);
            toast.success("Phone number updated successfully!");
        };

        // Driver Profile State
        const [driverProfile, setDriverProfile] = useState(null);

        useEffect(() => {
            const fetchDriverProfile = async () => {
                if (user && user.role === 'driver') {
                    try {
                        const profile = await driversAPI.getDriverProfile(user.id);
                        setDriverProfile(profile);

                        // Update stats with real rating from profile
                        if (profile.rating) {
                            setStats(prev => ({ ...prev, rating: profile.rating }));
                        }

                        // Update bank details if they exist in profile (assuming they are stored there)
                        if (profile.bankDetails) {
                            setBankDetails(prev => ({ ...prev, ...profile.bankDetails }));
                        }
                    } catch (error) {
                        console.log("Driver profile not found or error", error);
                    }
                }
            };
            fetchDriverProfile();
        }, [user]);


        const handleFileUpload = async (e, docName = "File") => {
            const file = e.target.files[0];
            if (file) {
                setIsUploading(true);
                const toastId = toast.loading(`Uploading ${docName}...`);
                try {
                    const response = await filesAPI.uploadFile(file);

                    // Use relative URL so it works via Vite proxy in dev and any deployment
                    const fileUrl = `/api/files/${response.fileId}`;

                    if (docName === 'Avatar') {
                        // Update User Profile (Avatar)
                        if (user && user.id) {
                            await usersAPI.updateUser(user.id, {
                                avatarUrl: fileUrl
                            });
                            if (onUpdateUser) {
                                onUpdateUser({ avatarUrl: fileUrl });
                            }
                        }
                    } else {
                        // Update Driver Documents
                        if (user && user.id) {
                            // 1. Get current documents or empty object
                            const currentDocs = driverProfile?.documents || {};

                            // 2. Merge with new document
                            const updatedDocs = {
                                ...currentDocs,
                                [docName]: fileUrl
                            };

                            let updatedProfile;
                            try {
                                // 3a. Try updating existing profile
                                updatedProfile = await driversAPI.updateDriverProfile(user.id, {
                                    documents: updatedDocs
                                });
                            } catch (updateErr) {
                                // 3b. Profile doesn't exist yet — create it first
                                console.log("No driver profile found, creating one...");
                                await driversAPI.createDriverProfile({
                                    email: user.email,
                                    fullName: user.name || user.fullName,
                                    phone: user.phone || '',
                                    city: user.city || '',
                                    licenseNumber: 'PENDING',
                                });
                                // Now update documents
                                updatedProfile = await driversAPI.updateDriverProfile(user.id, {
                                    documents: updatedDocs
                                });
                            }

                            // 4. Update local state
                            setDriverProfile(updatedProfile);
                        }
                    }

                    toast.success(`${docName} uploaded & saved successfully!`, { id: toastId });

                } catch (error) {
                    console.error("Upload failed", error);
                    toast.error(`Failed to upload ${docName}. Please try again.`, { id: toastId });
                } finally {
                    setIsUploading(false);
                }
            }
        };

        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold text-white">My Profile</h2>

                <div className="bg-card/50 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl relative group cursor-pointer overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>👨‍✈️</span>
                        )}
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload size={20} className="text-white" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'Avatar')}
                            />
                        </label>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xl font-bold text-white focus:border-primary outline-none"
                                    autoFocus
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-white">{user?.name || newName}</h3>
                            )}

                            <button
                                onClick={() => {
                                    if (isEditingProfile) {
                                        toast.success("Profile updated successfully!");
                                        setIsEditingProfile(false);
                                    } else {
                                        setIsEditingProfile(true);
                                    }
                                }}
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                            >
                                {isEditingProfile ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        <p className="text-primary text-sm font-medium mb-3">Staff / Senior Driver</p>

                        {/* Phone Number Section */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <Phone size={14} className="text-primary" />
                                {isEditingPhone ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="tel"
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            className="bg-black/20 border border-white/10 rounded px-2 py-0.5 text-sm text-white w-32 focus:border-primary outline-none"
                                            autoFocus
                                        />
                                        <button onClick={handleSavePhone} className="text-green-400 hover:text-green-300 text-xs font-bold uppercase">Save</button>
                                        <button onClick={() => { setIsEditingPhone(false); setNewPhone(phone); }} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase">Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm font-mono">{phone}</span>
                                        <button onClick={() => setIsEditingPhone(true)} className="text-xs text-primary hover:text-white underline ml-2">Edit</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Badge className="bg-green-500/20 text-green-400 border-none"><Shield size={12} className="mr-1" /> ID Verified</Badge>
                            <Badge className="bg-blue-500/20 text-blue-400 border-none"><CheckCircle size={12} className="mr-1" /> License Active</Badge>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-300 text-sm uppercase tracking-wide">Documents</h4>
                    </div>

                    {[
                        { name: 'Driving License', key: 'Driving License' },
                        { name: 'Aadhar Card', key: 'Aadhar Card' },
                        { name: 'Police Verification', key: 'Police Verification' },
                    ].map((doc, i) => {
                        const isUploaded = driverProfile?.documents?.[doc.key];
                        return (
                            <div key={i} className="bg-card/50 border border-white/5 rounded-xl p-4 flex justify-between items-center hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                                        {isUploaded ? <CheckCircle size={20} className="text-green-500" /> : <ClipboardCheck size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{doc.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {isUploaded ? (
                                                <button
                                                    onClick={() => setPreviewDoc({ name: doc.name, url: isUploaded })}
                                                    className="text-primary hover:underline"
                                                >
                                                    View Document
                                                </button>
                                            ) : 'Pending Upload'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${isUploaded ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                                        {isUploaded ? 'Uploaded' : 'Pending'}
                                    </span>
                                    <label className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white" title="Upload New Version">
                                        <Upload size={16} />
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.name)} />
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="font-bold text-gray-300 text-sm uppercase tracking-wide">Settings</h4>

                    {/* Shift Preferences Section */}
                    <div className="bg-card/50 border border-white/5 rounded-xl overflow-hidden">
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5"
                            onClick={() => toggleSection('shift')}
                        >
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-primary" />
                                <span className="text-white font-medium">Shift Preferences</span>
                            </div>
                            <ChevronRight className={`text-gray-500 transition-transform ${expandedSection === 'shift' ? 'rotate-90' : ''}`} size={16} />
                        </div>

                        {expandedSection === 'shift' && (
                            <div className="p-4 border-t border-white/5 bg-black/20 space-y-4 animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Preferred Shift Timing</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Morning', 'Evening', 'Night'].map(shift => (
                                            <button
                                                key={shift}
                                                onClick={() => setShiftPreferences({ ...shiftPreferences, shift })}
                                                className={`py-2 px-3 rounded-lg text-sm font-medium border ${shiftPreferences.shift === shift ? 'bg-primary/20 border-primary text-primary' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'}`}
                                            >
                                                {shift}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Available Days</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                            <button
                                                key={day}
                                                onClick={() => {
                                                    const newDays = shiftPreferences.days.includes(day)
                                                        ? shiftPreferences.days.filter(d => d !== day)
                                                        : [...shiftPreferences.days, day];
                                                    setShiftPreferences({ ...shiftPreferences, days: newDays });
                                                }}
                                                className={`w-10 h-10 rounded-full text-xs font-bold border flex items-center justify-center ${shiftPreferences.days.includes(day) ? 'bg-primary text-black border-primary' : 'bg-transparent border-white/10 text-gray-500'}`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <label className="text-sm text-gray-300">Accept Long Distance Trips</label>
                                    <div
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${shiftPreferences.longTrips ? 'bg-green-500' : 'bg-gray-600'}`}
                                        onClick={() => setShiftPreferences({ ...shiftPreferences, longTrips: !shiftPreferences.longTrips })}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${shiftPreferences.longTrips ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>

                                <Button
                                    onClick={() => { toast.success("Shift preferences updated!"); toggleSection(null); }}
                                    className="w-full mt-2 bg-primary text-black font-bold"
                                >
                                    Save Preferences
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Bank Account Details Section */}
                    <div className="bg-card/50 border border-white/5 rounded-xl overflow-hidden">
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5"
                            onClick={() => toggleSection('bank')}
                        >
                            <div className="flex items-center gap-3">
                                <Wallet size={20} className="text-green-400" />
                                <span className="text-white font-medium">Bank Account Details</span>
                            </div>
                            <ChevronRight className={`text-gray-500 transition-transform ${expandedSection === 'bank' ? 'rotate-90' : ''}`} size={16} />
                        </div>

                        {expandedSection === 'bank' && (
                            <div className="p-4 border-t border-white/5 bg-black/20 space-y-4 animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase">Account Holder Name</label>
                                    <input
                                        type="text"
                                        value={bankDetails.holderName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, holderName: e.target.value })}
                                        className="w-full bg-[#151520] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase">Bank Name</label>
                                    <input
                                        type="text"
                                        value={bankDetails.bankName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                        className="w-full bg-[#151520] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase">Account Number</label>
                                        <input
                                            type="text"
                                            value={bankDetails.accountNumber}
                                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                            className="w-full bg-[#151520] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase">IFSC Code</label>
                                        <input
                                            type="text"
                                            value={bankDetails.ifsc}
                                            onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                                            className="w-full bg-[#151520] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                                    <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-200">
                                        Updates to bank details may take up to 24 hours to verify. Payouts will be paused during verification.
                                    </p>
                                </div>

                                <Button
                                    onClick={() => { toast.success("Bank details submitted for verification."); toggleSection(null); }}
                                    className="w-full mt-2 bg-green-500 text-black font-bold hover:bg-green-400"
                                >
                                    Update Bank Details
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        );
    };

    const DocumentPreviewModal = () => {
        if (!previewDoc) return null;

        return (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">{previewDoc.name}</h2>
                    </div>
                    <button
                        onClick={() => setPreviewDoc(null)}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-white/10 hover:border-white/20"
                    >
                        <ChevronRight className="rotate-180" size={18} /> Back to Dashboard
                    </button>
                </div>

                <div className="flex-1 max-w-5xl mx-auto w-full bg-[#151520] rounded-3xl overflow-hidden border border-white/5 relative shadow-2xl">
                    <img
                        src={previewDoc.url}
                        alt={previewDoc.name}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-white flex relative z-0">
            <Sidebar />
            <DocumentPreviewModal />

            <main className="flex-1 lg:ml-64 pt-24 px-4 pb-12 w-full max-w-5xl mx-auto z-0">
                <h1 className="text-3xl font-bold mb-6 lg:hidden">Driver Dashboard</h1>
                {activeTab === 'overview' && <Overview />}
                {activeTab === 'trips' && <TripsList />}
                {/* Notifications removed */}
                {activeTab === 'inspections' && <Inspections />}
                {activeTab === 'damage-report' && <DamageReportSection />}
                {activeTab === 'earnings' && <Earnings />}
                {activeTab === 'profile' && <Profile />}
            </main>
        </div>
    );
};

export default DriverDashboard;
