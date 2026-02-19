import React from 'react';
import { ArrowLeft, X, ShieldCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "./ui/dialog";
import { Button } from "./ui/button";

const LicenseViewDialog = ({ isOpen, onClose, imageUrl, driverName }) => {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-[#09090b] border border-white/10 p-0 flex flex-col overflow-hidden rounded-3xl [&>button]:hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="bg-white/5 hover:bg-white/10 text-white rounded-full h-10 w-10"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                                <ShieldCheck size={18} className="text-primary" />
                                Verified License
                            </DialogTitle>
                            {driverName && <p className="text-sm text-gray-400">Driver: {driverName}</p>}
                        </div>
                    </div>
                    <DialogClose className="rounded-full bg-white/5 p-2 hover:bg-white/10 text-white transition-colors">
                        <X size={20} />
                    </DialogClose>
                </div>

                {/* Content - Image Area */}
                <div className="flex-1 flex items-center justify-center p-4 bg-black/20 overflow-auto relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                    <div className="relative group max-w-full max-h-full">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <img
                            src={imageUrl}
                            alt="License Document"
                            className="relative rounded-lg shadow-2xl max-w-full max-h-[75vh] object-contain border border-white/10"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center">
                    <p className="text-xs text-gray-500 font-mono">SECURE DOCUMENT VIEWER • WHEELIO ADMIN</p>
                    <Button onClick={onClose} className="bg-primary hover:bg-cyan-400 text-black font-bold">
                        Close Viewer
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default LicenseViewDialog;
