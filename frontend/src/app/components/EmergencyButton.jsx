import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";



export function EmergencyButton({ onClick }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 group">
            {/* Slower, lighter ping */}
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-40" style={{ animationDuration: '3s' }}></div>
            {/* Inner glow */}
            <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse opacity-30" style={{ animationDuration: '4s' }}></div>

            <Button
                onClick={onClick}
                variant="destructive"
                className="relative h-14 w-14 rounded-full shadow-[0_0_20px_rgba(248,113,113,0.6)] border border-red-300 hover:scale-110 transition-all duration-300 bg-red-500 hover:bg-red-600"
            >
                <ShieldAlert className="h-6 w-6 text-white drop-shadow-md animate-pulse" style={{ animationDuration: '2s' }} />
            </Button>
        </div>
    );
}

