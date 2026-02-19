import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const ReviewDialog = ({ isOpen, onClose, onSubmit, booking }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            bookingId: booking.id,
            vehicleId: booking.vehicleId || booking.vehicle, // Fallback if vehicleId is not directly available
            rating,
            comment,
            user: booking.userName
        });
        onClose();
        setRating(5);
        setComment('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1e1e2d] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Write a Review</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-4">How was your ride with <span className="text-white font-bold">{booking?.vehicleName || booking?.vehicle}</span>?</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                >
                                    <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-yellow-400 mt-2">
                            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Your Experience</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this vehicle..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none resize-none h-32"
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-primary text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-primary/20"
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewDialog;
