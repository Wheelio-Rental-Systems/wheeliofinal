import React from 'react';
import { Zap, ShieldCheck, Headphones } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Zap className="w-8 h-8 text-primary" />,
            title: 'Instant Booking',
            description: 'Book your dream car in seconds with our streamlined process. No paperwork, just drive.',
            color: 'bg-primary/10',
            border: 'group-hover:border-primary/50',
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
            title: 'Secure & Safe',
            description: 'Every vehicle is sanitized and safety-checked before rental. Comprehensive insurance included.',
            color: 'bg-green-400/10',
            border: 'group-hover:border-green-400/50',
        },
        {
            icon: <Headphones className="w-8 h-8 text-purple-400" />,
            title: '24/7 Support',
            description: 'Our dedicated support team is always available to assist you, day or night.',
            color: 'bg-purple-400/10',
            border: 'group-hover:border-purple-400/50',
        },
    ];

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Why Choose <span className="text-primary">Wheelio</span>?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We provide the best rental experience with premium vehicles and top-notch service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 ${feature.border}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color} transition-transform group-hover:scale-110`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
