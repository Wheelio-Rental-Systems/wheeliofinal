import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

// interface LegalDialogProps removed (JS file)

export function LegalDialog({ open, onOpenChange, type }) {
    const content = {
        terms: {
            title: "Terms of Service",
            description: "Last updated: January 2024",
            body: (
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Welcome to Wheelio. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                    </p>
                    <h4 className="font-semibold text-foreground">1. Rental Agreement</h4>
                    <p>
                        By renting a vehicle through Wheelio, you enter into a contract with the Host. Wheelio acts as an intermediary platform. You must possess a valid driver's license and meet the age requirements specified for each vehicle.
                    </p>
                    <h4 className="font-semibold text-foreground">2. User Responsibilities</h4>
                    <p>
                        You are responsible for the vehicle during the rental period. This includes maintaining fuel levels, avoiding prohibited uses (off-roading, racing), and paying any traffic fines incurred.
                    </p>
                    <h4 className="font-semibold text-foreground">3. Cancellation & Refunds</h4>
                    <p>
                        Cancellations made 24 hours prior to booking are fully refundable. Late cancellations may incur a fee as described in our FAQ.
                    </p>
                    <h4 className="font-semibold text-foreground">4. Liability</h4>
                    <p>
                        Wheelio is not liable for accidents or damages occurring during the rental period, except where covered by our insurance policy protections.
                    </p>
                </div>
            )
        },
        privacy: {
            title: "Privacy Policy",
            description: "How we handle your data",
            body: (
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
                    </p>
                    <h4 className="font-semibold text-foreground">1. Data Collection</h4>
                    <p>
                        We collect information you provide including name, contact details, driver's license info, and payment details. We also collect location data when you use our safety features.
                    </p>
                    <h4 className="font-semibold text-foreground">2. Usage</h4>
                    <p>
                        We use your data to facilitate bookings, verify identity, process payments, and improve our services. We do not sell your personal data to third parties.
                    </p>
                    <h4 className="font-semibold text-foreground">3. Security</h4>
                    <p>
                        We implement industry-standard security measures to protect your data. Payment information is processed by secure third-party gateways.
                    </p>
                </div>
            )
        }
    };

    const { title, description, body } = content[type];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[80vh] border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[50vh] pr-4 mt-2">
                    {body}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
