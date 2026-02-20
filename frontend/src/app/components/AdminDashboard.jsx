import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LayoutDashboard, Calendar, ClipboardCheck, Tag, Plus, CheckCircle, XCircle, Settings, Camera, Clock, User, Car, ShieldCheck } from 'lucide-react';
import CancelRideDialog from './CancelRideDialog';
import DriverProfileDialog from './booking-steps/DriverProfileDialog';
import LicenseViewDialog from './LicenseViewDialog';
import { getAllDamageReports, updateDamageReportStatus } from '../../api/damageReports';
import { drivers } from '../data/drivers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const AdminDashboard = ({ onNavigate, onAddVehicle, onDeleteVehicle, onUpdateVehicle, vehicles = [], bookings: initialBookings = [], onLogout }) => {

    const [bookings, setBookings] = useState(initialBookings);

    useEffect(() => {
        setBookings(initialBookings);
    }, [initialBookings]);

    const totalRevenue = bookings.reduce((sum, booking) => {
        // Support both backend format (totalAmount number) and legacy format (cost string like '₹1200')
        let cost = 0;
        if (typeof booking.totalAmount === 'number') {
            cost = booking.totalAmount;
        } else if (typeof booking.cost === 'string') {
            cost = parseInt(booking.cost.replace(/[^0-9]/g, '') || '0');
        } else if (typeof booking.cost === 'number') {
            cost = booking.cost;
        }
        return sum + cost;
    }, 0);

    const activeBookingsCount = bookings.filter(b => b.status === 'Active' || b.status === 'Ongoing').length;


    const vehicleStatusCounts = {
        Available: vehicles.filter(v => v.status?.toLowerCase() === 'available').length,
        Rented: vehicles.filter(v => v.status?.toLowerCase() === 'rented' || v.status?.toLowerCase() === 'booked').length,
        Maintenance: vehicles.filter(v => v.status?.toLowerCase() === 'maintenance').length
    };

    // Mock Data for Charts
    const revenueData = [
        { name: 'Jan', revenue: 45000 },
        { name: 'Feb', revenue: 52000 },
        { name: 'Mar', revenue: 48000 },
        { name: 'Apr', revenue: 61000 },
        { name: 'May', revenue: 55000 },
        { name: 'Jun', revenue: 67000 },
    ];

    const categoryData = [
        { name: 'SUV', value: 45 },
        { name: 'Sedan', value: 30 },
        { name: 'Hatchback', value: 15 },
        { name: 'Bike', value: 10 },
    ];
    const COLORS = ['#2DD4BF', '#A78BFA', '#F472B6', '#FBBF24'];


    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [newVehicle, setNewVehicle] = useState({
        name: '', brand: '', type: 'Car', price: '', location: '', rating: '4.5',
        details: { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' },
        features: '', description: '',
        images: ['', '', '', '']
    });

    const handleVehicleSubmit = (e) => {
        e.preventDefault();
        const vehicleData = {
            ...newVehicle,
            price: parseInt(newVehicle.price),
            rating: parseFloat(newVehicle.rating),
            features: typeof newVehicle.features === 'string' ? newVehicle.features.split(',').map(f => f.trim()) : newVehicle.features,
            image: newVehicle.images[0] || '/images/swift.jpeg',
            reviews: newVehicle.reviews || 0,
            status: newVehicle.status || 'available',
            seats: newVehicle.seats || 5,
            fuelType: newVehicle.fuelType || 'Petrol',
            transmission: newVehicle.transmission || 'Manual',
        };

        if (editMode) {
            onUpdateVehicle({ ...vehicleData, id: editingId });
            toast.success('Vehicle updated successfully!');
            setEditMode(false);
            setEditingId(null);
        } else {
            onAddVehicle({
                ...vehicleData,
                id: Date.now(),
            });
            toast.success('Vehicle added to fleet successfully!');
        }

        setNewVehicle({
            name: '', brand: '', type: 'Car', price: '', location: '', rating: '4.5',
            details: { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' },
            features: '', description: '',
            images: ['', '', '', '']
        });
    };

    const handleEditClick = (vehicle) => {
        setNewVehicle({
            ...vehicle,
            features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : vehicle.features,
            images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image, '', '', ''],
            details: vehicle.details || { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' }
        });
        setEditMode(true);
        setEditingId(vehicle.id);
        document.getElementById('add-vehicle-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditingId(null);
        setNewVehicle({
            name: '', brand: '', type: 'Car', price: '', location: '', rating: '4.5',
            details: { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' },
            features: '', description: '',
            images: ['', '', '', '']
        });
    };


    const [activeTab, setActiveTab] = useState('overview');
    const [isFetchingReports, setIsFetchingReports] = useState(false);


    const [hostRequests, setHostRequests] = useState([]);


    const [damageReports, setDamageReports] = useState([]);
    const [costInputs, setCostInputs] = useState({});

    // Import API functions (assuming they are imported at top, adding here for context in replace)
    // Actually, I need to add the import statement at the top first. 
    // This chunk replaces the state and useEffect logic.

    const fetchDamageReports = async () => {
        setIsFetchingReports(true);
        try {
            const reports = await getAllDamageReports();
            setDamageReports(reports);
        } catch (error) {
            console.error('Failed to fetch damage reports:', error);
        } finally {
            setIsFetchingReports(false);
        }
    };

    useEffect(() => {
        const storedRequests = JSON.parse(localStorage.getItem('hostRequests') || '[]');
        setHostRequests(storedRequests);

        const storedDocs = JSON.parse(localStorage.getItem('userDocuments') || 'null');
        if (storedDocs) {
            setUserVerificationDocs(storedDocs);
        }

        // Fetch reports on mount
        fetchDamageReports();
    }, []);

    // Refresh damage reports when inspections tab is opened
    useEffect(() => {
        if (activeTab === 'inspections') {
            fetchDamageReports();
        }
    }, [activeTab]);

    const [userVerificationDocs, setUserVerificationDocs] = useState(null);

    const addNotification = (userId, type, message) => {
        // ... (keep existing notification logic for now)
        const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
        const newNotification = {
            id: Date.now(),
            userId,
            type,
            message,
            status: 'unread',
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('userNotifications', JSON.stringify([newNotification, ...notifications]));
    };

    // ... (keep handleDocumentVerification)

    // ... (keep handleConfirmCancel)

    // ... (keep updateHostRequestStatus)

    const handleCostSubmit = async (id) => {
        const cost = costInputs[id];
        if (!cost) return;

        try {
            // Convert cost to a number — backend expects BigDecimal, not string
            const numericCost = parseFloat(cost);
            if (isNaN(numericCost) || numericCost <= 0) {
                alert('Please enter a valid cost amount.');
                return;
            }

            // Update via API
            const updatedReport = await updateDamageReportStatus(id, {
                estimatedCost: numericCost,
                status: 'ESTIMATED'
            });

            // Update local state
            setDamageReports(prev => prev.map(report =>
                report.id === id ? { ...report, estimatedCost: numericCost, status: 'ESTIMATED' } : report
            ));

            // Store estimate in localStorage so user's Dashboard can pick it up
            const reportEntry = {
                id,
                estimatedCost: numericCost,
                userId: updatedReport?.reportedById || updatedReport?.reportedBy?.id || '',
                timestamp: new Date().toISOString()
            };
            const existing = JSON.parse(localStorage.getItem('pendingDamagePayments') || '[]');
            const updated = existing.filter(e => e.id !== id);
            updated.push(reportEntry);
            localStorage.setItem('pendingDamagePayments', JSON.stringify(updated));

            // Notify User via localStorage notifications
            const userId = updatedReport?.reportedById || updatedReport?.reportedBy?.id || 'all';
            addNotification(userId, 'damage_estimate', `A cost estimate of ₹${numericCost.toLocaleString()} has been set for your damage report. Please pay via your Dashboard → My Reports.`);

            setCostInputs(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            toast.success(`Estimate of ₹${numericCost.toLocaleString()} sent! The user can now see it and pay from their Dashboard.`);
        } catch (error) {
            console.error("Failed to update damage report cost", error);
            toast.error('Failed to send estimate. Please try again.');
        }
    };


    const [pricingRules, setPricingRules] = useState(() => {
        const saved = localStorage.getItem('pricingRules');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Weekend Deal', description: 'Friday-Sunday 10% Off', status: 'active', type: 'percentage', value: -10, condition: 'weekend' },
            { id: 2, name: 'Holiday Special', description: 'Festival days +30%', status: 'active', type: 'percentage', value: 30, condition: 'holiday' },
            { id: 3, name: 'Early Bird', description: '30 days advance -15%', status: 'inactive', type: 'percentage', value: -15, condition: 'advance_30' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('pricingRules', JSON.stringify(pricingRules));
    }, [pricingRules]);

    const toggleRuleStatus = (id) => {
        setPricingRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' } : rule
        ));
    };

    const updateInspectionStatus = (id, newStatus) => {

    };

    const addNewRule = () => {
        const newRule = {
            id: Date.now(),
            name: 'New Pricing Rule',
            description: 'Custom adjustment +10%',
            status: 'inactive'
        };
        setPricingRules(prev => [...prev, newRule]);
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'drivers', label: 'Drivers & Staff', icon: User },
        { id: 'fleet', label: 'Fleet Management', icon: Car },
        { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
        { id: 'verifications', label: 'Verifications', icon: ShieldCheck },
        { id: 'pricing', label: 'Pricing', icon: Tag },
        { id: 'requests', label: 'Host Requests', icon: Plus },
    ];


    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Driver Profile State
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [isDriverProfileOpen, setIsDriverProfileOpen] = useState(false);

    // License Viewer State
    const [isLicenseViewerOpen, setIsLicenseViewerOpen] = useState(false);
    const [viewingLicenseUrl, setViewingLicenseUrl] = useState('');
    const [viewingDriverName, setViewingDriverName] = useState('');


    // Cancel a booking (update local state)
    const handleConfirmCancel = (bookingId) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, status: 'Cancelled' } : b
        ));
    };

    // Approve/reject host vehicle listing requests
    const updateHostRequestStatus = (requestId, newStatus) => {
        setHostRequests(prev => prev.map(r =>
            r.id === requestId ? { ...r, status: newStatus } : r
        ));
        const storedRequests = JSON.parse(localStorage.getItem('hostRequests') || '[]');
        const updated = storedRequests.map(r => r.id === requestId ? { ...r, status: newStatus } : r);
        localStorage.setItem('hostRequests', JSON.stringify(updated));
    };

    const handleCancelClick = (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            handleConfirmCancel(bookingId);
        }
    };

    const Sidebar = () => (
        <div className="hidden lg:flex flex-col w-64 bg-black/80 border-r border-white/5 h-screen fixed left-0 top-0 overflow-y-auto z-50 backdrop-blur-xl">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black">
                        <Car size={20} />
                    </div>
                    <span className="text-xl font-bold text-white">WHEELIO</span>
                </div>

                <div className="space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); window.scrollTo(0, 0); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-primary text-black font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-white/5">
                <button
                    onClick={() => {
                        if (onLogout) onLogout();
                        else onNavigate('home');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <XCircle size={20} /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent flex">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-8 animate-in fade-in duration-500">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{menuItems.find(i => i.id === activeTab)?.label}</h1>
                            <p className="text-gray-400">Admin Dashboard Management</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-bold border border-white/10">
                                A
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 min-h-[500px]">


                        <div className="space-y-6">
                            {activeTab === 'drivers' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-xl font-bold text-white mb-4">Driver & Staff Management</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {drivers.map(driver => (
                                            <div key={driver.id} className="bg-secondary/20 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-all group">
                                                <div className="h-24 bg-gradient-to-r from-primary/10 to-transparent relative">
                                                    <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-full border-4 border-[#1e1e2d] overflow-hidden">
                                                        <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur px-2 py-1 rounded text-xs text-white">ID: DRV-0{driver.id}</div>
                                                </div>
                                                <div className="pt-8 p-6">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-white text-lg">{driver.name}</h4>
                                                            <p className="text-sm text-gray-400">{driver.location} • {driver.experience}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg font-bold text-xs">
                                                            ⭐ {driver.rating}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {driver.badges.map((badge, idx) => (
                                                            <span key={idx} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded-full border border-white/5">{badge}</span>
                                                        ))}
                                                    </div>

                                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Documents</p>
                                                            <button
                                                                onClick={() => {
                                                                    setViewingLicenseUrl(driver.licenseImage);
                                                                    setViewingDriverName(driver.name);
                                                                    setIsLicenseViewerOpen(true);
                                                                }}
                                                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-cyan-400 w-full text-left"
                                                            >
                                                                <ClipboardCheck size={16} /> View License
                                                            </button>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Recent Feedback</p>
                                                            {driver.recentReviews.slice(0, 1).map((review, i) => (
                                                                <div key={i} className="text-sm text-gray-300 italic">"{review.text}" <span className="text-gray-600 not-italic">- {review.author}</span></div>
                                                            ))}
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                setSelectedDriver(driver);
                                                                setIsDriverProfileOpen(true);
                                                            }}
                                                            className="w-full py-2 bg-primary/10 text-primary font-bold rounded-lg text-sm hover:bg-primary hover:text-black transition-all"
                                                        >
                                                            View Full Profile
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-secondary/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-gray-400 font-medium">Total Revenue</h3>
                                                <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                                                    <Tag size={24} />
                                                </div>
                                            </div>
                                            <h2 className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</h2>
                                            <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                                                <CheckCircle size={14} /> +12.5% from last month
                                            </p>
                                        </div>

                                        <div className="bg-[#1e1e2d] border border-white/5 rounded-2xl p-6 shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-gray-400 font-medium">Fleet Status</h3>
                                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                                                    <Settings size={24} />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 text-center bg-black/20 rounded-lg p-2">
                                                    <div className="text-2xl font-bold text-green-400">{vehicleStatusCounts.Available}</div>
                                                    <div className="text-xs text-gray-500 uppercase">Available</div>
                                                </div>
                                                <div className="flex-1 text-center bg-black/20 rounded-lg p-2">
                                                    <div className="text-2xl font-bold text-yellow-400">{vehicleStatusCounts.Rented}</div>
                                                    <div className="text-xs text-gray-500 uppercase">Rented</div>
                                                </div>
                                                <div className="flex-1 text-center bg-black/20 rounded-lg p-2">
                                                    <div className="text-2xl font-bold text-red-400">{vehicleStatusCounts.Maintenance}</div>
                                                    <div className="text-xs text-gray-500 uppercase">Service</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    {/* Revenue Graphs Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-secondary/20 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
                                            <h3 className="text-lg font-bold text-white mb-6">Revenue Analytics</h3>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={revenueData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                                        <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                                        <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                                                        <Tooltip
                                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                                        />
                                                        <Bar dataKey="revenue" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="bg-[#1e1e2d] border border-white/5 rounded-2xl p-6 shadow-lg">
                                            <h3 className="text-lg font-bold text-white mb-6">Revenue by Category</h3>
                                            <div className="h-[300px] w-full relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={categoryData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={80}
                                                            outerRadius={110}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                            stroke="none"
                                                        >
                                                            {categoryData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
                                                        <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-gray-400 ml-1">{value}</span>} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                                    <div className="text-center">
                                                        <div className="text-3xl font-bold text-white">Total</div>
                                                        <div className="text-sm text-gray-500">Distribution</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-secondary/20 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold text-white mb-4">Recent Bookings</h3>
                                            <div className="space-y-4">
                                                {bookings.slice(0, 5).map((booking) => (
                                                    <div key={booking.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                                {booking.userName ? booking.userName[0] : 'U'}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-white font-medium text-sm">{booking.vehicleName}</h4>
                                                                <p className="text-xs text-gray-400">{booking.date}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-primary font-bold text-sm">{booking.cost}</div>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${booking.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>{booking.status}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {bookings.length === 0 && <p className="text-gray-500 text-sm italic">No recent bookings to display.</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {activeTab === 'bookings' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-xl font-bold text-white mb-4">Bookings Management</h3>
                                    <div className="space-y-4">
                                        {bookings.length === 0 ? (
                                            <div className="text-gray-400 text-center py-10">No bookings found.</div>
                                        ) : (
                                            bookings.map((booking) => (
                                                <div key={booking.id} className={`bg-card/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${booking.status === 'Cancelled' ? 'opacity-50 grayscale' : 'hover:border-primary/20'}`}>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-bold text-white text-lg">{booking.vehicleName || 'Vehicle'}</h4>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === 'active' || booking.status === 'Upcoming' ? 'bg-green-500/20 text-green-400' : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                                {booking.status || 'Pending'}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            <span className="block mb-1">Customer: <span className="text-gray-300">{booking.userName || 'Guest'}</span></span>
                                                            <span>ID: {booking.id}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-0 mt-2 md:mt-0 w-full md:w-auto justify-between md:justify-start">
                                                        <div className="text-left md:text-right">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                                                            <p className="text-sm text-gray-300">{booking.date || 'Dates not set'}</p>
                                                        </div>
                                                        <div className="text-right mt-0 md:mt-4">
                                                            <span className="text-2xl font-bold text-cyan-400">{booking.cost || '₹0'}</span>
                                                            <span className="block text-xs text-gray-500">Total</span>
                                                        </div>
                                                    </div>

                                                    {booking.status !== 'Cancelled' && (
                                                        <div className="flex items-center gap-2 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
                                                            <button
                                                                onClick={() => handleCancelClick(booking.id)}
                                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                                title="Cancel Ride"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'fleet' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-white">Vehicle Inventory</h3>
                                        <button
                                            onClick={() => document.getElementById('add-vehicle-form').scrollIntoView({ behavior: 'smooth' })}
                                            className="bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-cyan-400 transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add New Vehicle
                                        </button>
                                    </div>


                                    <div id="add-vehicle-form" className="bg-secondary/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
                                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Plus size={20} className="text-primary" /> {editMode ? 'Edit Vehicle Details' : 'Add New Vehicle'}
                                        </h4>
                                        <form onSubmit={handleVehicleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-400 ml-1">Vehicle Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Maruti Swift"
                                                        className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                                        value={newVehicle.name}
                                                        onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-400 ml-1">Brand</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Maruti Suzuki"
                                                        className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                                        value={newVehicle.brand}
                                                        onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-400 ml-1">Type</label>
                                                    <select
                                                        className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors appearance-none"
                                                        value={newVehicle.type}
                                                        onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                                    >
                                                        <option value="Car">Car</option>
                                                        <option value="Bike">Bike</option>
                                                        <option value="Scooter">Scooter</option>
                                                        <option value="SUV">SUV</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-400 ml-1">Price Per Day (₹)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 500"
                                                        className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                                        value={newVehicle.price}
                                                        onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-400 ml-1">Location</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Coimbatore"
                                                        className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                                        value={newVehicle.location}
                                                        onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-400 ml-1">Image URL</label>
                                                    <input
                                                        type="text"
                                                        placeholder="/images/your-car.jpg"
                                                        className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                                        value={newVehicle.images[0]}
                                                        onChange={(e) => {
                                                            const newImages = [...newVehicle.images];
                                                            newImages[0] = e.target.value;
                                                            setNewVehicle({ ...newVehicle, images: newImages });
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                <input type="text" placeholder="Mileage" className="bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                                                    value={newVehicle.details.mileage} onChange={(e) => setNewVehicle({ ...newVehicle, details: { ...newVehicle.details, mileage: e.target.value } })} />
                                                <input type="text" placeholder="Engine" className="bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                                                    value={newVehicle.details.engine} onChange={(e) => setNewVehicle({ ...newVehicle, details: { ...newVehicle.details, engine: e.target.value } })} />
                                                <input type="text" placeholder="Power" className="bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                                                    value={newVehicle.details.power} onChange={(e) => setNewVehicle({ ...newVehicle, details: { ...newVehicle.details, power: e.target.value } })} />
                                                <input type="text" placeholder="Top Speed" className="bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                                                    value={newVehicle.details.topSpeed} onChange={(e) => setNewVehicle({ ...newVehicle, details: { ...newVehicle.details, topSpeed: e.target.value } })} />
                                                <input type="text" placeholder="Fuel Tank" className="bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                                                    value={newVehicle.details.fuelTank} onChange={(e) => setNewVehicle({ ...newVehicle, details: { ...newVehicle.details, fuelTank: e.target.value } })} />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400 ml-1">Features (comma separated)</label>
                                                <textarea
                                                    placeholder="e.g. AC, Bluetooth, Sunroof"
                                                    className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors resize-none"
                                                    rows="2"
                                                    value={newVehicle.features}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, features: e.target.value })}
                                                ></textarea>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400 ml-1">Description</label>
                                                <textarea
                                                    placeholder="Brief description of the vehicle..."
                                                    className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors resize-none"
                                                    rows="2"
                                                    value={newVehicle.description}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                                                ></textarea>
                                            </div>

                                            <div className="flex gap-4">
                                                <button type="submit" className="flex-1 bg-primary text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                                    {editMode ? 'Update Vehicle' : 'Add Vehicle to Fleet'}
                                                </button>
                                                {editMode && (
                                                    <button type="button" onClick={handleCancelEdit} className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20">
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold text-white mb-2">Current Fleet</h4>
                                        {(vehicles && vehicles.length > 0) ? (
                                            vehicles.map((vehicle) => (
                                                <div key={vehicle.id} className="bg-secondary/20 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-6 items-center hover:border-primary/30 transition-all shadow-lg group">
                                                    <div className="w-full md:w-40 h-28 overflow-hidden rounded-xl relative">
                                                        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    </div>

                                                    <div className="flex-1 text-center md:text-left space-y-2">
                                                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                            <h4 className="font-bold text-white text-xl">{vehicle.name}</h4>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase w-fit mx-auto md:mx-0 ${vehicle.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                                {vehicle.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                                            <span className="bg-white/5 px-2 py-0.5 rounded text-xs">{vehicle.brand}</span>
                                                            <span className="bg-white/5 px-2 py-0.5 rounded text-xs">{vehicle.type}</span>
                                                            <span className="bg-white/5 px-2 py-0.5 rounded text-xs">{vehicle.location}</span>
                                                        </p>
                                                        <div className="block md:hidden text-2xl font-bold text-primary">₹{vehicle.price}/day</div>
                                                    </div>

                                                    <div className="flex flex-row md:flex-col items-center gap-4 min-w-[120px]">
                                                        <div className="hidden md:block text-right w-full">
                                                            <div className="text-2xl font-bold text-primary">₹{vehicle.price}</div>
                                                            <div className="text-xs text-gray-500">per day</div>
                                                        </div>
                                                        <div className="flex gap-2 w-full justify-end">
                                                            <button onClick={() => handleEditClick(vehicle)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-300 transition-colors font-medium border border-white/5">Edit</button>
                                                            <button onClick={() => { if (window.confirm('Are you sure you want to delete this vehicle?')) onDeleteVehicle(vehicle.id); }} className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm transition-colors font-medium border border-red-500/10">Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-16 bg-[#1e1e2d] rounded-2xl border border-dashed border-white/10">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                                                    <Car size={32} />
                                                </div>
                                                <p className="text-gray-400 text-lg">No vehicles found in the fleet.</p>
                                                <p className="text-gray-600 text-sm mt-1">Add your first vehicle using the form above.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inspections' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-white">Damage Reports & Inspections</h3>
                                        <button
                                            onClick={fetchDamageReports}
                                            disabled={isFetchingReports}
                                            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-bold flex items-center gap-2"
                                        >
                                            {isFetchingReports ? '⏳ Loading...' : '🔄 Refresh'}
                                        </button>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <h4 className="text-lg font-semibold text-gray-300 mb-2">User Reported Damages ({damageReports.length})</h4>
                                        {isFetchingReports ? (
                                            <div className="text-gray-400 text-center py-10">Loading damage reports...</div>
                                        ) : damageReports.length === 0 ? (
                                            <p className="text-gray-500 text-center py-10">No damage reports found. Reports submitted by users will appear here.</p>
                                        ) : (
                                            damageReports.map((report) => (
                                                <div key={report.id} className="bg-card/50 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-white text-lg">Report #{report.id.slice(0, 8)}</h4>
                                                            <p className="text-xs text-gray-500">
                                                                User: {report.reportedByName || report.reportedBy?.fullName || "Unknown"} • {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-primary mt-1 font-medium">Vehicle: {report.vehicleName || report.vehicle?.name || "N/A"}</p>
                                                        </div>
                                                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${report.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                                                            report.status === 'ESTIMATED' ? 'bg-cyan-500/20 text-cyan-400' :
                                                                'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {report.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Details</p>
                                                            <p className="text-gray-300 text-sm"><span className="text-gray-500">Severity:</span> {report.severity}</p>
                                                            <p className="text-gray-300 text-sm mt-2 p-3 bg-white/5 rounded-xl italic">"{report.description}"</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Evidence</p>
                                                            {report.images && report.images.length > 0 ? (
                                                                <div className="flex gap-2 overflow-x-auto pb-2">
                                                                    {report.images.map((photo, idx) => (
                                                                        <img key={idx} src={photo} alt="damage" className="h-24 w-24 object-cover rounded-lg border border-white/10" />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 text-sm italic">No photos uploaded</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {(report.status === 'OPEN' || report.status === 'INVESTIGATING' || !report.estimatedCost) ? (
                                                        <div className="flex items-end gap-3 pt-4 border-t border-white/5 bg-secondary/10 p-4 rounded-xl">
                                                            <div className="flex-1">
                                                                <label className="text-xs text-gray-400 mb-1 block">Cost Estimation (₹)</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Enter amount"
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                                                    value={costInputs[report.id] || ''}
                                                                    onChange={(e) => setCostInputs(prev => ({ ...prev, [report.id]: e.target.value }))}
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => handleCostSubmit(report.id)}
                                                                className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                                                            >
                                                                Send Estimate
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                            <span className="text-gray-400 text-sm">Estimated Cost Sent</span>
                                                            <div className="text-right">
                                                                <span className="text-xl font-bold text-orange-400 block">₹{report.estimatedCost}</span>
                                                                {report.razorpayPaymentId && (
                                                                    <span className="text-[10px] text-green-500 font-mono">Ref: {report.razorpayPaymentId}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>


                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white">Dynamic Pricing Rules</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {pricingRules.map((rule) => (
                                            <div key={rule.id} className="bg-card/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-primary/20 transition-all">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg mb-1">{rule.name}</h4>
                                                    <p className="text-gray-400 text-sm">{rule.description}</p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                        {rule.status}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleRuleStatus(rule.id)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Settings size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'requests' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-xl font-bold text-white mb-4">Vehicle Hosting Requests</h3>
                                    <div className="space-y-4">
                                        {hostRequests.length === 0 ? (
                                            <div className="text-gray-400 text-center py-10">No pending host requests.</div>
                                        ) : (
                                            hostRequests.map((req) => (
                                                <div key={req.id} className="bg-card/50 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-white text-lg">{req.make} {req.model} ({req.year})</h4>
                                                            <p className="text-xs text-gray-500">Request ID: {req.id} • Submitted: {new Date(req.submittedAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${req.status === 'Approved' ? 'bg-green-500/20 text-green-400' : req.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                            {req.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Details</p>
                                                            <div className="text-sm text-gray-300 space-y-1">
                                                                <p>Fuel: {req.fuelType}</p>
                                                                <p>Location: {req.location}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Documents</p>
                                                            <div className="flex gap-2 mt-2">
                                                                {req.rcBook && (
                                                                    <a href={req.rcBook} download={`rc_${req.id}`} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-cyan-400">View RC Book</a>
                                                                )}
                                                                {req.license && (
                                                                    <a href={req.license} download={`license_${req.id}`} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-cyan-400">View License</a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {req.vehiclePhotos && req.vehiclePhotos.length > 0 && (
                                                        <div className="mb-6">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Vehicle Photos</p>
                                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                                {req.vehiclePhotos.map((photo, idx) => (
                                                                    <img key={idx} src={photo} alt={`Vehicle ${idx}`} className="h-20 w-32 object-cover rounded-lg border border-white/10" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {req.status === 'Pending' && (
                                                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                            <button
                                                                onClick={() => updateHostRequestStatus(req.id, 'Approved')}
                                                                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-bold transition-colors"
                                                            >
                                                                <CheckCircle size={16} /> Approve Listing
                                                            </button>
                                                            <button
                                                                onClick={() => updateHostRequestStatus(req.id, 'Rejected')}
                                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors"
                                                            >
                                                                <XCircle size={16} /> Decline
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
            <CancelRideDialog
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                vehicleName={selectedBooking?.vehicleName}
            />
            <DriverProfileDialog
                driver={selectedDriver}
                open={isDriverProfileOpen}
                onOpenChange={setIsDriverProfileOpen}
                adminMode={true}
            />

            <LicenseViewDialog
                isOpen={isLicenseViewerOpen}
                onClose={() => setIsLicenseViewerOpen(false)}
                imageUrl={viewingLicenseUrl}
                driverName={viewingDriverName}
            />
        </div>
    );
};

export default AdminDashboard;
