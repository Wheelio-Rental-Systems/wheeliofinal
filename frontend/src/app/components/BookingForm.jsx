import { Calendar as CalendarIcon, Clock, ArrowLeft, ShieldCheck, MapPin, Check, ChevronsUpDown, User, Star, CreditCard, Wallet, Building, Tag } from 'lucide-react';
import { format, isWithinInterval, startOfDay } from 'date-fns';
import { Calendar } from './ui/calendar';
import { getBookedDates } from '../api/bookings';
import VehicleMap from './VehicleMap';
import { toast } from 'sonner';
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { vehicles } from '../data/vehicles';

const BookingForm = ({ vehicle, bookingData, onBack, onConfirm }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        pickupLocation: vehicle.location || 'Coimbatore',
        dropLocation: '',
        dropTime: '',
        name: '',
        email: '',
        phone: ''
    });

    const [costBreakdown, setCostBreakdown] = useState({
        days: 1,
        rentalCost: vehicle.price,
        addOnsCost: 0,
        gst: 0,
        adjustments: 0,
        driverCost: 0,
        total: 0
    });

    const [bookedRanges, setBookedRanges] = useState([]);

    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const applyCoupon = () => {
        if (!couponCode) return;

        const code = couponCode.toUpperCase();
        let calculatedDiscount = 0;

        // Reset discount first
        setDiscount(0);

        if (code === 'SUMMER25') {
            if (vehicle.type === 'SUV') {
                calculatedDiscount = (vehicle.price * costBreakdown.days) * 0.20;
                toast.success('SUMMER25 applied! 20% off on rental.');
            } else {
                toast.error('SUMMER25 is only applicable for SUVs.');
                return;
            }
        } else if (code === 'BIKEWKND') {
            if (vehicle.type === 'Bike') {
                if (costBreakdown.days >= 3) {
                    calculatedDiscount = vehicle.price * 1; // 1 Day Free
                    toast.success('BIKEWKND applied! Get 1 day free.');
                } else {
                    toast.error('BIKEWKND requires a minimum booking of 3 days.');
                    return;
                }
            } else {
                toast.error('BIKEWKND is only applicable for Bikes.');
                return;
            }
        } else {
            toast.error('Invalid Coupon Code');
            return;
        }

        setDiscount(calculatedDiscount);
    };

    // Helper to check for weekend (Fri, Sat, Sun)
    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 5 || day === 6;
    };

    useEffect(() => {
        getBookedDates(vehicle.id).then(dates => {
            setBookedRanges(dates.map(range => ({
                start: new Date(range.startDate),
                end: new Date(range.endDate)
            })));
        }).catch(err => console.error("Error fetching booked dates:", err));
    }, [vehicle.id]);

    const isDateDisabled = (date) => {
        const today = startOfDay(new Date());
        if (date < today) return true;

        return bookedRanges.some(range =>
            isWithinInterval(date, { start: startOfDay(range.start), end: startOfDay(range.end) })
        );
    };

    // Calculate costs whenever dates or addon props change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

            const days = diffDays > 0 ? diffDays : 1;
            const rentalCost = days * vehicle.price;

            // Calculate Add-ons cost
            const addOnsTotalPerDay = bookingData?.addOns?.reduce((acc, curr) => acc + curr.price, 0) || 0;
            const addOnsCost = addOnsTotalPerDay * days;

            // Calculate Pricing Adjustments
            let pricingRules = [];
            try {
                pricingRules = JSON.parse(localStorage.getItem('pricingRules') || '[]');
            } catch (e) {
                pricingRules = [];
            }
            let adjustmentAmount = 0;
            let activeAdjustments = [];

            pricingRules.forEach(rule => {
                if (rule.status !== 'active') return;

                let applyRule = false;

                if (rule.condition === 'weekend') {
                    // Check if any day in the range is a weekend
                    let current = new Date(start);
                    while (current <= end) {
                        if (isWeekend(current)) {
                            applyRule = true;
                            break;
                        }
                        current.setDate(current.getDate() + 1);
                    }
                } else if (rule.condition === 'advance_30') {
                    const today = new Date();
                    const diffTime = start - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= 30) applyRule = true;
                } else if (rule.condition === 'holiday') {
                    const holidays = [
                        '2026-01-01', // New Year
                        '2026-01-14', // Pongal
                        '2026-01-26', // Republic Day
                        '2026-08-15', // Independence Day
                        '2026-10-02', // Gandhi Jayanti
                        '2026-10-20', // Dussehra (Approx)
                        '2026-11-08', // Diwali (Approx)
                        '2026-12-25'  // Christmas
                    ];

                    let current = new Date(start);
                    while (current <= end) {
                        const dateStr = current.toISOString().split('T')[0];
                        if (holidays.includes(dateStr)) {
                            applyRule = true;
                            break;
                        }
                        current.setDate(current.getDate() + 1);
                    }
                }

                if (applyRule) {
                    const adjustment = (rentalCost * rule.value) / 100;
                    adjustmentAmount += adjustment;
                    activeAdjustments.push({ name: rule.name, amount: adjustment });
                }
            });

            // Driver Cost Calculation
            const driverCostPerDay = 800;
            const driverCost = bookingData.driver ? (driverCostPerDay * days) : 0;

            const subTotal = (rentalCost - discount) + addOnsCost + adjustmentAmount + driverCost;
            const gst = Math.round(subTotal * 0.18);
            const total = Math.max(0, subTotal + gst);

            setCostBreakdown({
                days,
                rentalCost,
                addOnsCost,
                driverCost,
                gst,
                adjustments: adjustmentAmount,
                activeAdjustments,
                total
            });
        }
    }, [formData.startDate, formData.endDate, vehicle.price, bookingData.addOns, discount]);


    const handleRazorpayPayment = async () => {
        // Dynamically load Razorpay if not available
        if (!window.Razorpay) {
            const existing = document.querySelector('script[src*="razorpay"]');
            if (existing) existing.remove();
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.head.appendChild(script);
            });
        }

        if (!window.Razorpay) {
            toast.error("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        setIsPaymentProcessing(true);

        const options = {
            key: "rzp_test_1DP5mmOlF5G5ag", // Test Key ID
            amount: costBreakdown.total * 100, // Amount in paise
            currency: "INR",
            name: "Wheelio Rentals",
            description: `Booking for ${vehicle.name}`,
            image: "/logo.png",
            handler: function (response) {
                setIsPaymentProcessing(false);
                toast.success(`Payment Successful! ID: ${response.razorpay_payment_id}`);
                onConfirm({
                    ...bookingData,
                    ...formData, // Pass dates, times, contact info
                    totalAmount: costBreakdown.total,
                    costBreakdown: costBreakdown,
                    paymentId: response.razorpay_payment_id,
                    paymentStatus: 'Paid'
                });
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#06b6d4"
            },
            modal: {
                ondismiss: function () {
                    setIsPaymentProcessing(false);
                    toast.error("Payment Cancelled");
                }
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            setIsPaymentProcessing(false);
            toast.error(response.error.description);
        });
        rzp1.open();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields before opening Razorpay
        if (!formData.startDate || !formData.endDate) {
            toast.error('Please select your pick-up and return dates.');
            return;
        }
        if (!formData.startTime || !formData.dropTime) {
            toast.error('Please select pick-up and drop-off times.');
            return;
        }
        if (!formData.pickupLocation) {
            toast.error('Please select a pickup location.');
            return;
        }
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Please fill in your personal details (name, email, phone).');
            return;
        }
        if (costBreakdown.total <= 0) {
            toast.error('Total amount is ₹0. Please select valid dates.');
            return;
        }

        // Default dropLocation to pickupLocation if empty
        if (!formData.dropLocation) {
            setFormData(prev => ({ ...prev, dropLocation: prev.pickupLocation }));
        }

        handleRazorpayPayment();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const INDIAN_CITIES = [...new Set(vehicles.map(v => v.location))].sort();

    return (
        <div className="animate-in fade-in zoom-in duration-500 max-w-7xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
            >
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium">Back to Add-ons</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Booking Form (Left Side - spans 7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-secondary/20 rounded-[2rem] p-8 border border-white/5 backdrop-blur-sm">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Trip Details</h3>
                            <p className="text-gray-400 text-sm">Fill in your information to complete the booking.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Date & Time Section */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar size={14} /> Schedule
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Pick-up Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal bg-black/20 border-white/10 rounded-xl py-6 pl-11 pr-4 text-white hover:bg-white/5",
                                                        !formData.startDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                    {formData.startDate ? format(new Date(formData.startDate), "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-[#1e1e2d] border-white/10" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                startDate: date.toISOString().split('T')[0],
                                                                // Reset end date if it's before new start date
                                                                endDate: prev.endDate && new Date(prev.endDate) < date ? '' : prev.endDate
                                                            }));
                                                        }
                                                    }}
                                                    disabled={isDateDisabled}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Return Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal bg-black/20 border-white/10 rounded-xl py-6 pl-11 pr-4 text-white hover:bg-white/5",
                                                        !formData.endDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                    {formData.endDate ? format(new Date(formData.endDate), "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-[#1e1e2d] border-white/10" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.endDate ? new Date(formData.endDate) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setFormData(prev => ({ ...prev, endDate: date.toISOString().split('T')[0] }));
                                                        }
                                                    }}
                                                    disabled={(date) => {
                                                        if (isDateDisabled(date)) return true;
                                                        if (formData.startDate) {
                                                            const start = new Date(formData.startDate);
                                                            if (date < start) return true;
                                                            // Limit to 10 days
                                                            const max = new Date(start);
                                                            max.setDate(max.getDate() + 10);
                                                            if (date > max) return true;
                                                        }
                                                        return false;
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Pick-up Time</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-3.5 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="time"
                                                name="startTime"
                                                required
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Drop-off Time</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-3.5 text-gray-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="time"
                                                name="dropTime"
                                                required
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* Location Section */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <MapPin size={14} /> Location
                                </h4>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Pickup Location</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-start bg-black/20 border-white/10 rounded-xl px-4 text-white hover:bg-white/5 hover:text-white h-[50px] font-normal focus:ring-1 focus:ring-primary focus:border-primary/50"
                                            >
                                                <MapPin className="mr-3 h-4 w-4 shrink-0 text-primary" />
                                                <span className="flex-1 text-left truncate">
                                                    {formData.pickupLocation || "Select pickup location"}
                                                </span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent side="bottom" className="w-[--radix-popover-trigger-width] p-0 bg-[#1e1e2d] border-white/10 text-white rounded-xl shadow-2xl shadow-black">
                                            <Command className="bg-transparent">
                                                <CommandInput placeholder="Search city..." className="text-white placeholder:text-gray-600" />
                                                <CommandList>
                                                    <CommandEmpty>No city found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {INDIAN_CITIES.map((city) => (
                                                            <CommandItem
                                                                key={city}
                                                                value={city}
                                                                onSelect={(currentValue) => {
                                                                    setFormData({ ...formData, pickupLocation: currentValue });
                                                                }}
                                                                className="text-white hover:bg-white/10 aria-selected:bg-white/10 cursor-pointer py-3"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4 text-primary",
                                                                        formData.pickupLocation === city ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {city}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-4">
                                    {/* Enhanced Map Container */}
                                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg relative h-[200px]">
                                        <VehicleMap city={formData.pickupLocation || 'Coimbatore'} vehicleName={vehicle.name} />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
                                            <p className="text-xs text-white font-medium">Pick up vehicle at this centralized hub</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Drop-off Location</label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-start bg-black/20 border-white/10 rounded-xl px-4 text-white hover:bg-white/5 hover:text-white h-[50px] font-normal focus:ring-1 focus:ring-primary focus:border-primary/50"
                                            >
                                                <MapPin className="mr-3 h-4 w-4 shrink-0 text-gray-500" />
                                                <span className="flex-1 text-left truncate">
                                                    {formData.dropLocation
                                                        ? INDIAN_CITIES.find((city) => city === formData.dropLocation)
                                                        : <span className="text-gray-500">Select drop location (Different from pickup)</span>}
                                                </span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent side="bottom" className="w-[--radix-popover-trigger-width] p-0 bg-[#1e1e2d] border-white/10 text-white rounded-xl shadow-2xl shadow-black">
                                            <Command className="bg-transparent">
                                                <CommandInput placeholder="Search city..." className="text-white placeholder:text-gray-600" />
                                                <CommandList>
                                                    <CommandEmpty>No city found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {INDIAN_CITIES.map((city) => (
                                                            <CommandItem
                                                                key={city}
                                                                value={city}
                                                                onSelect={(currentValue) => {
                                                                    handleChange({ target: { name: 'dropLocation', value: currentValue } });
                                                                    setOpen(false);
                                                                }}
                                                                className="text-white hover:bg-white/10 aria-selected:bg-white/10 cursor-pointer py-3"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4 text-primary",
                                                                        formData.dropLocation === city ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {city}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* Personal Info Section */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <User size={14} /> Personal Details
                                </h4>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                        onChange={handleChange}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <CreditCard size={14} /> Payment Method
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-primary transition-colors">
                                            <input type="radio" name="payment" className="peer appearance-none" defaultChecked />
                                            <div className="w-3 h-3 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform" />
                                        </div>
                                        <div className="flex-1 relative">
                                            <div className="text-white font-medium flex items-center gap-2"><Wallet size={16} className="text-primary" /> UPI / GPay / PhonePe</div>
                                            <div className="text-xs text-gray-500">Fast & Secure instant payment</div>
                                        </div>
                                    </label>

                                    <label className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-primary transition-colors">
                                            <input type="radio" name="payment" className="peer appearance-none" />
                                            <div className="w-3 h-3 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform" />
                                        </div>
                                        <div className="flex-1 relative">
                                            <div className="text-white font-medium flex items-center gap-2"><CreditCard size={16} className="text-purple-400" /> Credit / Debit Card</div>
                                            <div className="text-xs text-gray-500">Visa, Mastercard, Rupay supported</div>
                                        </div>
                                    </label>

                                    <label className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-primary transition-colors">
                                            <input type="radio" name="payment" className="peer appearance-none" />
                                            <div className="w-3 h-3 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform" />
                                        </div>
                                        <div className="flex-1 relative">
                                            <div className="text-white font-medium flex items-center gap-2"><Building size={16} className="text-orange-400" /> Net Banking</div>
                                            <div className="text-xs text-gray-500">All major Indian banks supported</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPaymentProcessing}
                                className="w-full bg-primary hover:bg-cyan-400 text-black font-bold text-lg py-5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 mt-6 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPaymentProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${costBreakdown.total.toLocaleString()} & Confirm Booking`
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Summary Card (Right Side - spans 5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-secondary/20 rounded-[2rem] p-6 border border-white/5 sticky top-24 backdrop-blur-sm">
                        <div className="relative mb-6 rounded-2xl overflow-hidden group">
                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1 shadow-sm">{vehicle.name}</h2>
                                    <p className="text-gray-300 text-sm font-medium">{vehicle.brand} • {vehicle.type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            {/* Base Rate */}
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                <span className="text-gray-400 text-sm">Rate per day</span>
                                <span className="text-white font-bold text-lg">₹{vehicle.price}</span>
                            </div>

                            {/* Add-ons List */}
                            {bookingData.addOns?.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Selected Add-ons</p>
                                    {bookingData.addOns.map((addon, i) => (
                                        <div key={i} className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-gray-300 flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-primary" /> {addon.name}
                                            </span>
                                            <span className="text-white font-medium">₹{addon.price}/day</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {bookingData.driver && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Chauffeur</p>
                                    <div className="flex gap-4 items-center bg-gradient-to-r from-purple-500/10 to-transparent p-4 rounded-xl border border-purple-500/20">
                                        <img
                                            src={bookingData.driver.image}
                                            alt={bookingData.driver.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                                        />
                                        <div className="flex-1">
                                            <div className="text-white font-bold text-sm">{bookingData.driver.name}</div>
                                            <div className="text-xs text-purple-300 flex items-center mt-1">
                                                <Star size={10} className="fill-purple-300 mr-1" />
                                                {bookingData.driver.rating} Rating
                                            </div>
                                        </div>
                                        <div className="text-white font-bold text-sm bg-purple-500/20 px-2 py-1 rounded">₹800/d</div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-white/10 my-6"></div>

                            {/* Coupon Section */}
                            <div className="space-y-3 mb-6">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Promo Code</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 uppercase placeholder:normal-case"
                                    />
                                    <button
                                        type="button"
                                        onClick={applyCoupon}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {discount > 0 && (
                                    <div className="text-green-400 text-xs flex items-center gap-1 animate-in fade-in">
                                        <Check size={12} /> Coupon Applied! You saved ₹{discount.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white font-medium">{costBreakdown.days} Days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Rental Cost</span>
                                    <span className="text-white font-medium">₹{costBreakdown.rentalCost.toLocaleString()}</span>
                                </div>
                                {costBreakdown.addOnsCost > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Add-ons Cost</span>
                                        <span className="text-white font-medium">₹{costBreakdown.addOnsCost.toLocaleString()}</span>
                                    </div>
                                )}
                                {costBreakdown.driverCost > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Driver Fees</span>
                                        <span className="text-white font-medium">₹{costBreakdown.driverCost.toLocaleString()}</span>
                                    </div>
                                )}

                                {/* Adjustments Display */}
                                {costBreakdown.activeAdjustments && costBreakdown.activeAdjustments.map((adj, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className={adj.amount < 0 ? "text-green-400 flex items-center gap-1" : "text-yellow-400 flex items-center gap-1"}>
                                            {adj.amount < 0 ? <Check size={12} /> : <Star size={12} />} {adj.name}
                                        </span>
                                        <span className={adj.amount < 0 ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
                                            {adj.amount > 0 ? '+' : ''}₹{Math.round(adj.amount).toLocaleString()}
                                        </span>
                                    </div>
                                ))}

                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-400 flex items-center gap-1"><Tag size={12} /> Discount</span>
                                        <span className="text-green-400 font-bold">-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">GST (18%)</span>
                                    <span className="text-white font-medium">₹{costBreakdown.gst.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Amount Payable</p>
                                    <div className="text-3xl font-bold text-primary">₹{costBreakdown.total.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BookingForm;
