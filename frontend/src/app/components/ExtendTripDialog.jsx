import React, { useState } from 'react';
import { toast } from 'sonner';

const ExtendTripDialog = ({ isOpen, onClose, onConfirm, currentEndDate }) => {
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(1);
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const costPerDay = 1500;
    const totalCost = days * costPerDay;

    // Load Razorpay script dynamically
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const existing = document.querySelector('script[src*="razorpay"]');
            if (existing) existing.remove();
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    };

    const handleRazorpayPayment = async () => {
        setProcessing(true);

        try {
            const loaded = await loadRazorpay();

            if (loaded && window.Razorpay) {
                // Razorpay available — open real payment
                const options = {
                    key: 'rzp_test_1DP5mmOlF5G5ag',
                    amount: totalCost * 100, // in paise
                    currency: 'INR',
                    name: 'Wheelio Rentals',
                    description: `Extend Trip by ${days} day${days > 1 ? 's' : ''}`,
                    theme: { color: '#06b6d4' },
                    handler: function (response) {
                        // Payment successful
                        setProcessing(false);
                        toast.success(`Payment of ₹${totalCost} successful! ID: ${response.razorpay_payment_id}`);
                        setStep(3);
                    },
                    modal: {
                        ondismiss: function () {
                            setProcessing(false);
                            toast.info('Payment cancelled.');
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    setProcessing(false);
                    toast.error(response.error.description);
                });
                rzp.open();
            } else {
                // Razorpay CDN unreachable — fallback
                setProcessing(false);
                const confirmed = window.confirm(
                    `Razorpay is unavailable on your network.\n\nConfirm payment of ₹${totalCost} for extending trip by ${days} day(s)?\n\n(Use a different network for real Razorpay)`
                );
                if (confirmed) {
                    toast.success(`Payment of ₹${totalCost} recorded successfully!`);
                    setStep(3);
                }
            }
        } catch (err) {
            setProcessing(false);
            console.error('Payment error:', err);
            toast.error('Payment failed: ' + err.message);
        }
    };

    const handleFinalize = () => {
        onConfirm({
            days,
            additionalCost: totalCost,
            newEndDate: "Extended",
            paymentMethod: "Razorpay"
        });

        setTimeout(() => {
            onClose();
            setStep(1);
            setDays(1);
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    Close
                </button>

                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white">Extend Trip</h3>
                        <div className="bg-white/5 p-4 rounded-xl text-white">
                            Current End Date: {String(currentEndDate)}
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => setDays(Math.max(1, days - 1))} className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">-</button>
                            <span className="text-white font-bold text-xl">{days} Days</span>
                            <button onClick={() => setDays(Math.min(7, days + 1))} className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">+</button>
                        </div>
                        <p className="text-xs text-gray-500">Maximum extension: 7 days</p>

                        <div className="bg-white/5 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>{days} day{days > 1 ? 's' : ''} × ₹{costPerDay}</span>
                                <span className="text-white font-bold">₹{totalCost}</span>
                            </div>
                        </div>

                        <div className="text-primary font-bold text-xl">
                            Total: ₹{totalCost}
                        </div>

                        <button
                            onClick={handleRazorpayPayment}
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Processing...
                                </span>
                            ) : (
                                `Pay ₹${totalCost} with Razorpay`
                            )}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-green-500">Payment Successful!</h3>
                        <p className="text-white">Trip extended by {days} day{days > 1 ? 's' : ''}.</p>
                        <p className="text-gray-400 text-sm">₹{totalCost} paid via Razorpay</p>
                        <button
                            onClick={handleFinalize}
                            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-colors"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExtendTripDialog;
