import React from 'react';

const ScrollingBanner = () => {
    const taglines = [
        "Weekend Offer: Get 15% OFF",
        "Choose Professional Drivers",
        "Self Driving Cars Available",
        "Premium Fleet Selection",
        "24/7 Roadside Assistance",
        "No Hidden Charges",
        "Luxury Weddings Cars",
        "Long Term Rentals"
    ];

    // Duplicate the taglines to create a seamless infinite loop
    const displayTaglines = [...taglines, ...taglines, ...taglines];

    return (
        <div className="w-full bg-primary/10 border-y border-primary/20 overflow-hidden py-3 backdrop-blur-sm relative z-20">
            <div className="flex w-fit animate-scroll-left hover:pause-animation">
                {displayTaglines.map((tag, index) => (
                    <div key={index} className="flex items-center mx-8 whitespace-nowrap">
                        <span className="text-primary mr-3">•</span>
                        <span className="text-foreground/90 font-medium tracking-wide text-sm md:text-base">
                            {tag}
                        </span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default ScrollingBanner;
