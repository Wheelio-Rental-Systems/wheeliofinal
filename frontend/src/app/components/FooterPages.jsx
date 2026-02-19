import React, { useState } from 'react';
import { CheckCircle, MapPin, Phone, Mail, FileText, Shield, HelpCircle, Send, MessageSquare, AlertTriangle } from 'lucide-react';

const PageLayout = ({ title, subtitle, children, icon: Icon }) => (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
            {Icon && (
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-lg shadow-primary/10">
                    <Icon size={32} />
                </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="bg-card border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
            {children}
        </div>
    </div>
);

export const About = () => (
    <PageLayout title="About Wheelio" subtitle="Redefining the car rental experience with premium service and luxury vehicles.">
        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p>
                    Founded in 2024, <strong className="text-primary">Wheelio</strong> started with a simple mission: to make premium mobility accessible, transparent, and exciting. We believe that the journey is just as important as the destination. We are not just a car rental company; we are your partner in exploration.
                </p>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-white mb-4">Pan-India Presence</h3>
                <p>
                    From the bustling streets of Bangalore to the serene valleys of Himachal, Wheelio is now everywhere you go. Headquartered in Coimbatore, we have expanded our footprint to serve over 50 cities across India. Whether you are planning a coastal drive in Goa, a business trip in Delhi, or a pilgrimage in Varanasi, our premium fleet is ready to accompany you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                    { label: 'Luxury Vehicles', value: '500+' },
                    { label: 'Happy Customers', value: '100k+' },
                    { label: 'Service Cities', value: '50+' },
                ].map((stat, i) => (
                    <div key={i} className="bg-secondary/50 p-6 rounded-2xl text-center border border-white/5 hover:border-primary/30 transition-colors">
                        <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </PageLayout>
);

export const Testimonials = () => (
    <PageLayout title="Client Stories" subtitle="Don't just take our word for it. Here's what our community drives." icon={CheckCircle}>
        <div className="grid md:grid-cols-2 gap-8">
            {[
                { name: 'Arjun K.', role: 'Travel Enthusiast', location: 'Chennai', text: "The Thar 4x4 condition was impeccable. Wheelio made my Ooty trip absolutely memorable. The booking process was so smooth!" },
                { name: 'Priya S.', role: 'Business Traveler', location: 'Bangalore', text: "Seamless booking process. The Innova Crysta was clean, on time, and the support team was very responsive. Highly recommended for corporate travel." },
                { name: 'Rahul M.', role: 'Bike Rider', location: 'Kerala', text: "Rented the Himalayan 450. Best prices in Coimbatore and the bike was in showroom condition. Will definitely rent again." },
                { name: 'Sneha R.', role: 'Weekend Explorer', location: 'Coimbatore', text: "I loved the transparency. No hidden charges, and the security deposit was refunded instantly after the trip. Great service!" }
            ].map((t, i) => (
                <div key={i} className="bg-secondary/20 p-6 rounded-2xl border border-white/5 hover:bg-secondary/40 transition-colors">
                    <div className="flex gap-1 text-yellow-500 mb-4">★★★★★</div>
                    <p className="text-gray-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-black font-bold text-xl">
                            {t.name[0]}
                        </div>
                        <div>
                            <div className="font-bold text-white">{t.name}</div>
                            <div className="text-xs text-gray-500">{t.role} • {t.location}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </PageLayout>
);

export const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [resume, setResume] = useState(null);

    const handleApply = (job) => {
        setSelectedJob(job);
        setIsApplied(false);
        setResume(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate upload delay
        setTimeout(() => {
            setIsApplied(true);
        }, 1000);
    };

    const closeModal = () => {
        setSelectedJob(null);
        setIsApplied(false);
    };

    return (
        <PageLayout title="Join the Crew" subtitle="Accepting applications for visionaries who love mobility." icon={CheckCircle}>
            <div className="space-y-12">
                <div className="text-center">
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                        At Wheelio, we are building the future of shared mobility. We are looking for passionate individuals who are driven by impact and innovation.
                    </p>
                </div>

                <div className="grid gap-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Open Positions</h3>
                    {[
                        { role: 'Fleet Manager', loc: 'Coimbatore', type: 'Full-time', desc: 'Manage vehicle maintenance schedules and ensure fleet readiness.' },
                        { role: 'Customer Support Executive', loc: 'Remote / Coimbatore', type: 'Full-time', desc: 'Assist customers with bookings and on-road support queries.' },
                        { role: 'React Frontend Developer', loc: 'Remote', type: 'Contract', desc: 'Help us build the next generation of our booking platform.' }
                    ].map((job, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-secondary/30 p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-all group">
                            <div className="mb-4 md:mb-0">
                                <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{job.role}</h4>
                                <div className="text-sm text-gray-400 mt-1">{job.loc} • {job.type}</div>
                                <p className="text-gray-500 text-sm mt-2">{job.desc}</p>
                            </div>
                            <button
                                onClick={() => handleApply(job)}
                                className="px-6 py-2 bg-white/5 hover:bg-primary hover:text-black rounded-lg text-white text-sm font-medium transition-colors"
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-primary/5 rounded-2xl p-8 text-center border border-primary/20">
                    <h4 className="text-xl font-bold text-white mb-2">Don't see your role?</h4>
                    <p className="text-gray-400 mb-6">
                        We are always looking for talent. Drop your resume anytime.
                    </p>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-400 text-sm">Email our HR Team directly:</span>
                        <a href="mailto:careers@wheelio.in" className="text-2xl font-bold text-primary hover:underline">
                            careers@wheelio.in
                        </a>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>

                        {!isApplied ? (
                            <>
                                <h3 className="text-2xl font-bold text-white mb-2">Apply for {selectedJob.role}</h3>
                                <p className="text-gray-400 mb-6 text-sm">Please upload your resume to proceed.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Resume / CV (PDF, DOCX)</label>
                                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-secondary/20 relative">
                                            <input
                                                type="file"
                                                required
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setResume(e.target.files[0])}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="pointer-events-none">
                                                {resume ? (
                                                    <div className="text-primary font-medium flex items-center justify-center gap-2">
                                                        <FileText size={20} />
                                                        {resume.name}
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500">
                                                        <span className="text-primary">Click to upload</span> or drag and drop
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!resume}
                                        className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition-all"
                                    >
                                        Submit Application
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Applied Successfully!</h3>
                                <p className="text-gray-400 mb-6">
                                    Your application for <span className="text-primary">{selectedJob.role}</span> has been received.
                                    <br />
                                    Please wait for an update from our team.
                                </p>
                                <button
                                    onClick={closeModal}
                                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export const HelpCenter = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am the Wheelio Bot. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages([...messages, { type: 'user', text: userMsg }]);
        setInput('');

        // Mock Bot Response
        setTimeout(() => {
            let reply = "I'm not sure about that. Could you please elaborate? You can also browse our FAQs on the left.";
            const lowerInput = userMsg.toLowerCase();

            if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
                reply = "Hello! Welcome to Wheelio Support. How can I assist you with your booking today?";
            } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('rate') || lowerInput.includes('how much')) {
                reply = "Our prices vary by vehicle. Bikes start from ₹1500/day and Cars from ₹2500/day. You can see exact rates on the Fleet page.";
            } else if (lowerInput.includes('document') || lowerInput.includes('license') || lowerInput.includes('id')) {
                reply = "You need a valid original Driving License and Aadhar Card. International guests need an IDP.";
            } else if (lowerInput.includes('cancel') || lowerInput.includes('refund')) {
                reply = "Cancellations are free up to 24 hours before the trip. You can manage this from your Dashboard.";
            } else if (lowerInput.includes('book') || lowerInput.includes('rent')) {
                reply = "To book a vehicle, simply go to the 'Vehicles' page, select your ride, and choose your dates!";
            } else if (lowerInput.includes('driver') || lowerInput.includes('chauffeur')) {
                reply = "We offer professional chauffeurs! You can select the 'Chauffeur Driven' option when booking your car.";
            } else if (lowerInput.includes('damage') || lowerInput.includes('accident')) {
                reply = "Please prioritize your safety. Use the 'Emergency Report' section on the Contact page or call 108 immediately.";
            }

            setMessages(prev => [...prev, { type: 'bot', text: reply }]);
        }, 1000);
    };

    return (
        <PageLayout title="Help Center" subtitle="Frequently asked questions and instant support." icon={HelpCircle}>
            <div className="grid lg:grid-cols-2 gap-12">
                {/* FAQs */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        {[
                            { q: "What documents do I need?", a: "You need a valid Driving License (original), Aadhar Card, and a security deposit via UPI/Card." },
                            { q: "Is fuel included in the price?", a: "No, fuel is not included. We follow a full-to-full policy. You receive the vehicle with a full tank and return it full." },
                            { q: "What is the cancellation policy?", a: "Free cancellation up to 24 hours before the trip start time. 50% charge thereafter. No refund for no-shows." },
                            { q: "Is there a security deposit?", a: "Yes, a fully refundable security deposit of ₹5000 is required for cars and ₹3000 for bikes." },
                            { q: "Do you provide roadside assistance?", a: "Yes, we provide 24/7 roadside assistance within city limits. For outstation breakdowns, support depends on location." }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-secondary/30 rounded-xl p-5 cursor-pointer border border-white/5 open:bg-secondary/50 open:border-primary/20 transition-all">
                                <summary className="font-semibold text-white list-none flex justify-between items-center text-lg">
                                    {faq.q}
                                    <span className="group-open:rotate-180 transition-transform text-primary">▼</span>
                                </summary>
                                <div className="pt-4 text-gray-400 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Chat Bot */}
                <div className="bg-card w-full h-[500px] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
                    <div className="bg-secondary p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-white">Wheelio Assistant</div>
                                <div className="text-xs text-green-400 flex items-center gap-1">● Online</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/20">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.type === 'user'
                                    ? 'bg-primary text-black rounded-tr-none'
                                    : 'bg-secondary text-gray-200 rounded-tl-none border border-white/5'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="p-4 bg-secondary border-t border-white/5 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/50"
                        />
                        <button type="submit" className="bg-primary text-black p-3 rounded-xl hover:bg-cyan-400 transition-colors">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
};


export const Terms = () => (
    <PageLayout title="Terms & Conditions" subtitle="The rules of the road." icon={FileText}>
        <div className="prose prose-invert max-w-none text-gray-400 space-y-8">
            <div>
                <p className="text-sm border-b border-white/10 pb-4 mb-6">Last Updated: October 24, 2024</p>
            </div>

            <section>
                <h3 className="text-white text-xl font-bold mb-2">1. Introduction</h3>
                <p>Welcome to Wheelio. These Terms and Conditions govern your use of our website and vehicle rental services. By accessing our platform, you agree to be bound by these terms.</p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-2">2. Rental Eligibility</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Drivers must be at least 21 years old.</li>
                    <li>Must hold a valid driving license for the respective vehicle class (LMV/MCWG) for at least 2 years.</li>
                    <li>International visitors must present a valid International Driving Permit (IDP).</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-2">3. Vehicle Usage Policy</h3>
                <p>The vehicle is to be used for personal purposes only. The following acts are strictly prohibited:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Using the vehicle for commercial purposes (taxi/delivery).</li>
                    <li>Driving under the influence of alcohol or drugs.</li>
                    <li>Participating in rallies, racing, or off-roading events.</li>
                    <li>Transporting illegal substances or dangerous goods.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-2">4. Damages & Liability</h3>
                <p>The user is liable for any damages caused to the vehicle during the rental period. In case of accidents, the user must notify Wheelio support immediately. The maximum liability is limited to the security deposit for minor scratches, but major damages will be assessed by an authorized service center.</p>
            </section>
        </div>
    </PageLayout>
);

export const Privacy = () => (
    <PageLayout title="Privacy Policy" subtitle="How we protect your data." icon={Shield}>
        <div className="prose prose-invert max-w-none text-gray-400 space-y-8">
            <section>
                <h3 className="text-white text-xl font-bold mb-2">Data Collection</h3>
                <p>We collect information that you strictly provide to us for the purpose of booking. This includes:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Personal Identification: Name, Email, Phone Number.</li>
                    <li>Verification Documents: Driving License copy, ID Proof (Aadhar/Passport).</li>
                    <li>Payment Information: Transaction IDs (we do not store card details directly).</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-2">How We Use Your Data</h3>
                <p>Your data is used solely for:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Processing your rental bookings.</li>
                    <li>Verifying your eligibility to drive.</li>
                    <li>Communicating booking updates and emergency support.</li>
                    <li>Legal compliance as required by government regulations.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-2">Data Security</h3>
                <p>We employ industry-standard encryption protocols to protect your data. Access to personal information is restricted to authorized Wheelio personnel only.</p>
            </section>
        </div>
    </PageLayout>
);

export const Contact = () => {
    const [emergencyStep, setEmergencyStep] = useState('idle'); // idle, locating, success
    const [locationInput, setLocationInput] = useState('');

    const handleEmergencyReport = () => {
        setEmergencyStep('locating');
        // Simulate GPS fetch
        setTimeout(() => {
            setLocationInput('11.0168° N, 76.9558° E (Peelamedu, Coimbatore)');
        }, 1500);
    };

    const confirmEmergency = () => {
        setEmergencyStep('success');
    };

    return (
        <PageLayout title="Contact Us" subtitle="We're here to help, 24/7." icon={Phone}>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-secondary/30 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <MapPin />
                        </div>
                        <div>
                            <div className="text-white font-bold text-lg mb-1">Visit Our HQ</div>
                            <div className="text-gray-400">123, Avinashi Road<br />Peelamedu, Coimbatore<br />Tamilnadu 641004</div>
                        </div>
                    </div>
                    <div className="bg-secondary/30 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Phone />
                        </div>
                        <div>
                            <div className="text-white font-bold text-lg mb-1">Call Us</div>
                            <div className="text-gray-400">+91 95858 99711</div>
                            <div className="text-gray-500 text-sm mt-1">Available 24/7</div>
                        </div>
                    </div>
                    <div className="bg-secondary/30 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Mail />
                        </div>
                        <div>
                            <div className="text-white font-bold text-lg mb-1">Email Support</div>
                            <div className="text-gray-400">support@wheelio.in</div>
                            <div className="text-gray-500 text-sm mt-1">Response time: ~2 hours</div>
                        </div>
                    </div>
                </div>

                <div className="bg-red-500/10 p-8 rounded-3xl border border-red-500/20 space-y-6 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    {emergencyStep === 'idle' && (
                        <div className="relative animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Emergency Report</h3>
                            <p className="text-gray-400 mb-8">
                                In case of an accident or breakdown, use the emergency controls below.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={handleEmergencyReport}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <AlertTriangle size={20} />
                                    Report Accident Breakdown
                                </button>

                                <a href="tel:108" className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-4 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-3">
                                    <Phone size={20} />
                                    Call Emergency Services (108)
                                </a>
                            </div>
                        </div>
                    )}

                    {emergencyStep === 'locating' && (
                        <div className="relative animate-in fade-in slide-in-from-right duration-300">
                            <h3 className="text-xl font-bold text-white mb-4">Sharing Location</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-red-300 mb-1 block">Your Current Location</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={locationInput}
                                            onChange={(e) => setLocationInput(e.target.value)}
                                            placeholder="Detecting Coordinates..."
                                            className="w-full bg-black/40 border border-red-500/30 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none transition-all"
                                        />
                                        <div className="flex items-center justify-center w-12 bg-red-500/20 rounded-xl animate-pulse text-red-500">
                                            <MapPin size={20} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        *Automatic GPS detection active. You can also type manually.
                                    </p>
                                </div>

                                {locationInput ? (
                                    <button
                                        onClick={confirmEmergency}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-3 animate-in fade-in"
                                    >
                                        Share & Request Help
                                        <Send size={18} />
                                    </button>
                                ) : (
                                    <div className="text-center py-4 text-gray-400 flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-red-500/50 border-t-red-500 rounded-full animate-spin"></div>
                                        Acquiring Satellite Lock...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {emergencyStep === 'success' && (
                        <div className="relative text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-black mx-auto mb-6 shadow-xl shadow-green-500/20">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Help is on the way!</h3>
                            <p className="text-gray-300 mb-6">
                                Priority Support Team has been dispatched to:
                                <br />
                                <span className="text-green-400 font-mono mt-2 block bg-black/30 p-2 rounded-lg border border-green-500/20 text-sm">
                                    {locationInput}
                                </span>
                            </p>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="text-sm text-gray-400 mb-1">Estimated Arrival</div>
                                <div className="text-xl font-bold text-white">15 Minutes</div>
                            </div>
                            <button
                                onClick={() => setEmergencyStep('idle')}
                                className="mt-6 text-gray-500 hover:text-white text-sm"
                            >
                                Return to menu
                            </button>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-red-500/20">
                        <div className="flex items-center gap-3 text-red-400 text-sm bg-red-950/30 p-3 rounded-lg">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            24/7 Priority Support Line Active
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
