import React from 'react';
import { Car } from 'lucide-react';

const Footer = ({ onNavigate }) => {
    return (
        <footer className="bg-secondary/30 border-t border-white/5 pt-16 pb-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">


                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-black">
                                <Car size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                                WHEELIO
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Premium vehicle rentals for every journey. Experience the thrill of driving our luxury fleet in Coimbatore.
                        </p>
                    </div>


                    <div>
                        <h4 className="text-white font-semibold text-lg mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-primary transition-colors text-left text-sm">About Wheelio</button></li>
                            <li><button onClick={() => onNavigate('vehicles')} className="text-gray-400 hover:text-primary transition-colors text-left text-sm">Our Fleet</button></li>
                            <li><button onClick={() => onNavigate('testimonials')} className="text-gray-400 hover:text-primary transition-colors text-left text-sm">Testimonials</button></li>

                        </ul>
                    </div>


                    <div>
                        <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
                        <ul className="space-y-3">
                            <li><button onClick={() => onNavigate('help')} className="text-gray-400 hover:text-primary transition-colors text-left text-sm">Help Center</button></li>
                            <li><button onClick={() => onNavigate('terms')} className="text-gray-400 hover:text-primary transition-colors text-left text-sm">Terms & Conditions</button></li>
                            <li><button onClick={() => onNavigate('privacy')} className="text-gray-400 hover:text-primary transition-colors text-left text-sm">Privacy Policy</button></li>

                        </ul>
                    </div>


                    <div>
                        <h4 className="text-white font-semibold text-lg mb-6">Contact</h4>
                        <p className="text-gray-400 mb-2 font-medium">Coimbatore, Tamilnadu</p>
                        <p className="text-gray-400 mb-2">+91 95858 99711</p>
                        <p className="text-gray-400">support@wheelio.in</p>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Wheelio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
