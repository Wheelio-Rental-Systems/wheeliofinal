import React, { useState } from 'react';
import { Upload, CheckCircle, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

const LicenseUpload = ({ onNext, onBack }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            setIsUploading(false);
            toast.success("License Verified Successfully");
            onNext(file);
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-bold text-white mb-2">Verify Identity</h2>
            <p className="text-gray-400 mb-8">Please upload a valid driver's license to proceed with the booking.</p>

            <div className="bg-secondary/20 border border-white/5 rounded-3xl p-8 mb-8">
                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <p className="mb-2 text-sm text-gray-300"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or PDF (MAX. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                    </label>
                ) : (
                    <div className="relative w-full h-64 bg-black/40 rounded-2xl border border-primary/30 flex flex-col items-center justify-center p-4">
                        <button
                            onClick={() => setFile(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all"
                        >
                            <X size={20} />
                        </button>
                        <FileText size={48} className="text-primary mb-4" />
                        <p className="text-white font-medium text-lg">{file.name}</p>
                        <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                        <div className="flex items-center gap-2 mt-4 text-green-500 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <CheckCircle size={14} /> Ready to verify
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="flex-1 py-4 rounded-xl bg-primary text-black font-bold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                >
                    {isUploading ? "Verifying..." : "Verify & Continue"}
                </button>
            </div>
        </div>
    );
};

export default LicenseUpload;
