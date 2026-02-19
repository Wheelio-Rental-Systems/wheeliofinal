import React from 'react';
import { Search, CalendarCheck, CarFront, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search className="w-8 h-8 text-primary" />,
            title: "Browse & Select",
            description: "Explore our wide range of premium vehicles and find the perfect match for your journey.",
            step: "01"
        },
        {
            icon: <CalendarCheck className="w-8 h-8 text-purple-400" />,
            title: "Book Securely",
            description: "Choose your dates, select a driver if needed, and book instantly with our secure platform.",
            step: "02"
        },
        {
            icon: <CarFront className="w-8 h-8 text-green-400" />,
            title: "Zoom Away",
            description: "Pick up your car or get it delivered. Enjoy the ride with our 24/7 support backup.",
            step: "03"
        }
    ];

    return (
        <section className="py-24 bg-zinc-900/30 border-y border-white/5 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/4"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How <span className="text-primary">It Works</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Rent your dream car in three simple steps. No hidden charges, just pure driving pleasure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-12 z-0"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 group">
                            <div className="bg-[#18181b] p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        {step.icon}
                                    </div>
                                    <span className="text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                                        {step.step}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
