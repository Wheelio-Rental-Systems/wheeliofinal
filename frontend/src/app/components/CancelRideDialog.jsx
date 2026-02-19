import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

const CancelRideDialog = ({ isOpen, onClose, onConfirm, bookingId }) => {
    const [reason, setReason] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [step, setStep] = useState(1); // 1: Reason, 2: Confirmation

    if (!isOpen) return null;

    const commonReasons = [
        "Change of plans",
        "Found a better option",
        "Booked by mistake",
        "Dates changed",
        "Other"
    ];

    const handleSubmit = () => {
        if (!selectedReason) {
            alert("Please select a reason");
            return;
        }
        onConfirm({
            bookingId,
            reason: selectedReason === 'Other' ? reason : selectedReason,
            timestamp: new Date().toISOString()
        });
        setStep(2);
        setTimeout(() => {
            onClose();
            setStep(1);
            setReason('');
            setSelectedReason('');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Cancel Ride?</h3>
                            <p className="text-gray-400 text-sm mt-2">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300">Reason for cancellation</label>
                            <div className="space-y-2">
                                {commonReasons.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setSelectedReason(r)}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedReason === r
                                                ? 'bg-red-500/10 border-red-500 text-white'
                                                : 'bg-black/20 border-white/5 text-gray-400 hover:bg-black/30'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{r}</span>
                                            {selectedReason === r && <CheckCircle size={16} className="text-red-500" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedReason === 'Other' && (
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please tell us more..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-red-500 outline-none resize-none h-24"
                            />
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 font-bold transition-colors"
                            >
                                Keep Ride
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedReason || (selectedReason === 'Other' && !reason)}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-4">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Ride Cancelled</h3>
                        <p className="text-gray-400">Your booking has been successfully cancelled.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancelRideDialog;
