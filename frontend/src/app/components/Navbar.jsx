import React, { useState } from 'react';
import { Menu, X, Car, LayoutDashboard, CreditCard, Settings, LogOut } from 'lucide-react';

const Navbar = ({ onNavigate, currentView, user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [

        { name: 'Home', id: 'home' },
        { name: 'Vehicles', id: 'vehicles' },
        ...(user?.role === 'admin' ? [] : [{ name: 'Become a Host', id: 'become-host' }]),
    ];

    const handleNavClick = (viewId) => {
        if (viewId === 'become-host' && !user) {
            // If user tries to access 'become-host' without login, redirect to login
            onNavigate('login');
            // You might want to pass a message or state to login page to redirect back, 
            // but for now simpler is just to go to login.
            setIsOpen(false);
            return;
        }
        onNavigate(viewId);
        setIsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="w-full bg-black/50 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div
                        onClick={() => handleNavClick('home')}
                        className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-black shadow-lg shadow-primary/20">
                            <Car size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                            WHEELIO
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => handleNavClick(link.id)}
                                    className={`text-sm font-medium transition-colors duration-300 ${currentView === link.id ? 'text-primary' : 'text-gray-300 hover:text-primary'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                            {user ? (
                                <div className="relative ml-4">
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-all border border-transparent hover:border-white/10"
                                    >
                                        <div className="text-right hidden lg:block">
                                            <div className="text-sm font-bold text-white leading-none">{user.email}</div>
                                            <div className="text-xs text-gray-400 mt-1">Verified Member</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-cyan-500 p-[2px]">
                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-bold text-primary">{user.email.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    {isOpen && (
                                        <div className="absolute right-0 mt-4 w-60 bg-[#151520] border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-2 space-y-1">
                                                {user.role === 'admin' ? (
                                                    // Admin Dropdown Items
                                                    <>
                                                        <button
                                                            onClick={() => handleNavClick('admin-dashboard')}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                                                        >
                                                            <LayoutDashboard size={18} />
                                                            Admin Dashboard
                                                        </button>

                                                    </>
                                                ) : user.role === 'driver' ? (
                                                    // Driver Dropdown Items
                                                    <>
                                                        <button
                                                            onClick={() => handleNavClick('driver-dashboard')}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                                                        >
                                                            <LayoutDashboard size={18} />
                                                            Driver Dashboard
                                                        </button>
                                                    </>
                                                ) : (
                                                    // Regular User Dropdown Items
                                                    <>
                                                        <button
                                                            onClick={() => handleNavClick('dashboard')}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                                                        >
                                                            <LayoutDashboard size={18} />
                                                            My Dashboard
                                                        </button>
                                                    </>
                                                )}
                                                <div className="h-px bg-white/10 my-1"></div>
                                                <button
                                                    onClick={() => {
                                                        onLogout();
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium"
                                                >
                                                    <LogOut size={18} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => onNavigate('login')}
                                    className="bg-white/10 hover:bg-primary hover:text-black text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 border border-white/5 hover:border-transparent active:scale-95"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>



                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isOpen && (
                    <div className="md:hidden absolute w-full bg-background border-b border-white/5 shadow-2xl">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.id)}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
        </nav>
    );
};

export default Navbar;
