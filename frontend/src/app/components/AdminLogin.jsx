import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

const AdminLogin = ({ onLogin, onNavigate, user }) => {

    React.useEffect(() => {
        if (user) {
            
            onNavigate('home');
        }
    }, [user, onNavigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (email === 'admin@wheelio.com' && password === 'admin123') {
                onLogin({ name: 'Admin User', email: email, role: 'admin' });
                onNavigate('admin-dashboard');
            } else {
                setError('Invalid admin credentials');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 animate-in fade-in duration-500">
            <div className="relative z-10 w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
                    <p className="text-gray-400">Restricted access for authorized personnel only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Admin Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                                placeholder="admin@wheelio.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Verifying...
                            </>
                        ) : (
                            <>
                                Access Dashboard
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => onNavigate('home')}
                        className="text-gray-500 text-sm hover:text-white transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

