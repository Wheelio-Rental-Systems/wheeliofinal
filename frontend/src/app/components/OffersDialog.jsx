import { Percent, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

// interface OffersDialogProps removed (JS file)

export function OffersDialog({ open, onOpenChange }) {
    const [copiedCode, setCopiedCode] = useState(null);

    const offers = [
        {
            code: "WELCOME20",
            discount: "20% OFF",
            description: "Get 20% off your first booking with us.",
            expires: "Valid until Dec 31, 2024"
        },
        {
            code: "WEEKEND500",
            discount: "₹500 OFF",
            description: "Flat ₹500 off on weekend rentals (Min 2 days).",
            expires: "Valid for weekends"
        },
        {
            code: "SUMMER15",
            discount: "15% OFF",
            description: "Summer special: 15% off on convertibles and SUVs.",
            expires: "Limited time offer"
        }
    ];

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Percent className="h-6 w-6 text-accent" />
                        Special Offers
                    </DialogTitle>
                    <DialogDescription>
                        Exclusive deals for your next journey
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-4">
                    {offers.map((offer) => (
                        <div key={offer.code} className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-primary/5 border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-primary">{offer.discount}</h3>
                                    <p className="font-mono text-sm tracking-wider text-muted-foreground mt-1">{offer.code}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 border-primary/20 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleCopy(offer.code)}
                                >
                                    {copiedCode === offer.code ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-sm text-gray-400">{offer.description}</p>
                            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {offer.expires}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
