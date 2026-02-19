import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Car, Calendar, Users, FileText,
    LogOut, Bell, Search, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import * as bookingsAPI from '../../api/bookings';

const StaffDashboard = ({ onNavigate, user, onLogout }) => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        activeBookings: 0,
        pendingVerifications: 5,
        availableVehicles: 12
    });

    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch bookings from backend
                let data = [];
                try {
                    data = await bookingsAPI.getAllBookings();
                } catch (e) {
                    console.warn("Backend fetch failed, using local storage/dummy");
                    data = JSON.parse(localStorage.getItem('allBookings') || '[]');
                }

                if (data.length === 0) {
                    // Dummy data for Staff View
                    data = [
                        { id: 'BK-1001', userName: 'Alice Smith', vehicleName: 'Toyota Fortuner', status: 'Pending', date: '2024-03-15' },
                        { id: 'BK-1002', userName: 'Bob Jones', vehicleName: 'Honda City', status: 'Confirmed', date: '2024-03-16' },
                        { id: 'BK-1003', userName: 'Charlie Brown', vehicleName: 'Royal Enfield', status: 'Completed', date: '2024-03-14' }
                    ];
                }

                setBookings(data);
                setStats(prev => ({
                    ...prev,
                    totalBookings: data.length,
                    activeBookings: data.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length
                }));

            } catch (error) {
                console.error("Error loading staff data", error);
                toast.error("Failed to load dashboard data");
            }
        };

        fetchData();
    }, []);

    const handleLogoutAction = () => {
        if (onLogout) onLogout();
        else onNavigate('login');
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'fleet', label: 'Fleet Status', icon: Car },
        { id: 'customers', label: 'Customers', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#151520] fixed h-full z-10 hidden md:block">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                        WHEELIO
                    </h1>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Staff Portal</span>
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                    ? 'bg-primary/20 text-primary border border-primary/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold truncate">{user?.name || 'Staff Member'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'staff@wheelio.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogoutAction}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 py-2 rounded-lg transition-colors"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-center bg-[#151520] p-4 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
                        <div className="flex items-center gap-4">
                            <button className="p-2 relative text-gray-400 hover:text-white transition-colors">
                                <Bell size={24} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </button>
                        </div>
                    </header>

                    {/* Dashboard Stats (Overview) */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-blue-400 bg-blue-500/10' },
                                { label: 'Active Rents', value: stats.activeBookings, icon: Car, color: 'text-green-400 bg-green-500/10' },
                                { label: 'Pending Docs', value: stats.pendingVerifications, icon: FileText, color: 'text-yellow-400 bg-yellow-500/10' },
                                { label: 'Fleet Available', value: stats.availableVehicles, icon: CheckCircle, color: 'text-purple-400 bg-purple-500/10' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#151520] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${stat.color}`}>
                                            <stat.icon size={24} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                                        <p className="text-gray-400 text-sm">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bookings List */}
                    {activeTab === 'bookings' || activeTab === 'overview' ? (
                        <div className="bg-[#151520] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-bold text-lg">Recent Bookings</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search bookings..."
                                        className="bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary outline-none w-64"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="p-4">Booking ID</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Vehicle</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-white/5">
                                        {bookings.map((booking, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-mono text-gray-400">#{booking.id || '---'}</td>
                                                <td className="p-4 font-medium">{booking.userName || booking.customer || 'Guest'}</td>
                                                <td className="p-4 text-gray-300">{booking.vehicleName || booking.vehicle || 'Unknown'}</td>
                                                <td className="p-4 text-gray-400">{booking.date}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' :
                                                            booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                'bg-gray-500/10 text-gray-500'
                                                        }`}>
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-primary hover:underline text-xs mr-3">View</button>
                                                    <button className="text-red-400 hover:underline text-xs">Cancel</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                                    No bookings found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : null}

                    {/* Fleet/Customers placeholders */}
                    {(activeTab === 'fleet' || activeTab === 'customers') && (
                        <div className="bg-[#151520] border border-white/10 rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} className="text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                            <p className="text-gray-400">This module is under development.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;
