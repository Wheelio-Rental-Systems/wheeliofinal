import React, { useState } from 'react';
import { Mail, Lock, User, Chrome, Apple, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as authAPI from '../../api/auth';


const Login = ({ onNavigate, onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState('');


    // Forgot Password States
    const [forgotPassMode, setForgotPassMode] = useState(false);
    const [resetLinkSent, setResetLinkSent] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                // Signup
                const response = await authAPI.signup({
                    email,
                    password,
                    fullName,
                    role: 'USER',
                    phone: '' // Optional phone
                });

                toast.success('Account created successfully!');
                onNavigate('vehicles');
            } else {
                // Login - now handled by App.jsx
                const result = await onLogin({ email, password });

                if (result && result.success) {
                    // Navigation is handled in App.jsx based on user role
                    onNavigate('vehicles');
                }
                // Error handling is done in App.jsx
            }
        } catch (error) {
            console.error('Auth error:', error);
            const errorMessage = error.response?.data?.error || 'Authentication failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setResetLinkSent(true);
        }, 1500);
    };

    const handleSocialLogin = (provider) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onNavigate('vehicles');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 animate-in fade-in duration-500">
            {/* Background Elements */}


            <div className="relative z-10 w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-cyan-400/50 p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.3)]">

                {/* FORGOT PASSWORD VIEW */}
                {forgotPassMode ? (
                    <div className="animate-in slide-in-from-right fade-in duration-300">
                        <button
                            onClick={() => { setForgotPassMode(false); setResetLinkSent(false); }}
                            className="flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Back to Login
                        </button>

                        {!resetLinkSent ? (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                                    <p className="text-gray-400">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>
                                <form onSubmit={handleResetSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                Sending Link...
                                            </>
                                        ) : (
                                            <>Send Reset Link <ArrowRight size={20} /></>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center animate-in zoom-in duration-300 py-8">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Check your email</h3>
                                <p className="text-gray-400 mb-8">
                                    We have sent a password reset link to <br /> <span className="text-white font-semibold">{email}</span>
                                </p>
                                <button
                                    onClick={() => { setForgotPassMode(false); setResetLinkSent(false); }}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Return to Sign In
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* NORMAL LOGIN VIEW */
                    <div className="animate-in slide-in-from-left fade-in duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-gray-400">
                                {isSignUp ? 'Join the premium mobility revolution.' : 'Enter your details to access your account.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isSignUp && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                            )}



                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium text-gray-300">Password</label>
                                    {!isSignUp && (
                                        <button
                                            type="button"
                                            onClick={() => setForgotPassMode(true)}
                                            className="text-xs text-primary hover:text-cyan-300 transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-cyan-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        {isSignUp ? 'Get Started' : 'Sign In'}
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-400">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="ml-2 text-primary font-bold hover:text-cyan-300 transition-colors"
                                >
                                    {isSignUp ? 'Sign In' : 'Sign Up'}
                                </button>
                            </p>
                        </div>
                    </div >
                )}
            </div >
        </div >
    );
};

export default Login;
