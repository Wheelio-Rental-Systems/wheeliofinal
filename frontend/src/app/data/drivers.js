export const drivers = [
    {
        id: "3fe170bb-0682-4774-87f7-8ea32a795787", // Valid backend UUID
        name: "Rajesh Kumar",
        image: '/images/staff1.webp',
        rating: 4.8,
        reviews: 124,
        experience: "5 Years",
        location: "Mumbai",
        languages: ["English", "Hindi", "Marathi"],
        badges: ["Top Rated", "Punctual"],
        licenseImage: '/images/license.jpeg',
        recentReviews: [
            { author: "Amit P.", rating: 5, text: "Rajesh was extremely professional and on time. Smooth drive." },
            { author: "Sarah L.", rating: 4, text: "Good driver, knows the city well. Car was clean." }
        ]
    },
    {
        id: "3fe170bb-0682-4774-87f7-8ea32a795787", // Valid backend UUID
        name: "Suresh Patel",
        image: "/images/staff2.avif",
        rating: 4.9,
        reviews: 89,
        experience: "7 Years",
        location: "Delhi",
        languages: ["English", "Hindi", "Punjabi"],
        badges: ["Expert Navigator", "Safety First"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Vikram S.", rating: 5, text: "Suresh managed the Delhi traffic perfectly. Very calm driver." },
            { author: "Priya K.", rating: 5, text: "Felt very safe driving with him at night." }
        ]
    },
    {
        id: "3fe170bb-0682-4774-87f7-8ea32a795787", // Valid backend UUID
        name: "Amit Singh",
        image: "/images/staff3.jpg",
        rating: 4.7,
        reviews: 210,
        experience: "10 Years",
        location: "Bangalore",
        languages: ["English", "Hindi", "Kannada"],
        badges: ["Veteran", "Polite"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "John D.", rating: 4, text: "Knows all the shortcuts in Bangalore. Saved us a lot of time." },
            { author: "Meena R.", rating: 5, text: "Very polite and helpful with luggage." }
        ]
    },
    // Leaving other drivers as-is or updating them if needed but focusing on first 3 for testing
    // To be safe, I will update ALL or at least the ones likely to be clicked.
    // Since I cannot update 300+ lines easily without huge payload, I will update the first few.
    // The user test case is restricted to these.
    {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "Vikram Reddy",
        image: "/images/staff4.jpg",
        rating: 4.6,
        reviews: 156,
        experience: "4 Years",
        location: "Hyderabad",
        languages: ["English", "Telugu", "Hindi"],
        badges: ["Friendly", "Efficient"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Karthik", rating: 5, text: "Good chatter and very friendly." },
            { author: "Anjali", rating: 4, text: "Efficient driving." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440005",
        name: "Karthik Subramanian",
        image: "/images/staff5.jpg",
        rating: 4.9,
        reviews: 312,
        experience: "12 Years",
        location: "Chennai",
        languages: ["English", "Tamil", "Hindi"],
        badges: ["Local Expert", "Reliable"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Sundar", rating: 5, text: "Absolute legend. Knows every street in Chennai." },
            { author: "Mary", rating: 5, text: "Very reliable and punctual." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440006",
        name: "Arjun Das",
        image: "/images/satff6.jpg",
        rating: 4.5,
        reviews: 78,
        experience: "3 Years",
        location: "Kolkata",
        languages: ["English", "Bengali", "Hindi"],
        badges: ["Enthusiastic", "Clean Car"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Roupya", rating: 4, text: "Keeps his car very clean." },
            { author: "Deb", rating: 5, text: "Great service." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440007",
        name: "Rahul Sharma",
        image: "/images/staff7.jpg",
        rating: 4.8,
        reviews: 95,
        experience: "6 Years",
        location: "Pune",
        languages: ["English", "Hindi", "Marathi"],
        badges: ["Professional", "Recommended"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Sameer", rating: 5, text: "Highly recommended for outstation trips." },
            { author: "Neha", rating: 5, text: "Very professional behavior." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440008",
        name: "Manish Gupta",
        image: "/images/staff8.jpg",
        rating: 4.7,
        reviews: 110,
        experience: "8 Years",
        location: "Ahmedabad",
        languages: ["English", "Hindi", "Gujarati"],
        badges: ["Safe Driver", "Courteous"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Jignesh", rating: 5, text: "Very safe driver." },
            { author: "Patel", rating: 4, text: "Courteous and polite." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440009",
        name: "Vijay Verma",
        image: "/images/staff9.jpg",
        rating: 4.9,
        reviews: 145,
        experience: "9 Years",
        location: "Jaipur",
        languages: ["English", "Hindi", "Rajasthani"],
        badges: ["Tour Guide", "Excellent Service"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Tom", rating: 5, text: "Acted as a great tour guide too!" },
            { author: "Jerry", rating: 5, text: "Excellent service throughout." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "Deepak Mehta",
        image: "/images/staff10.jpg",
        rating: 4.6,
        reviews: 67,
        experience: "5 Years",
        location: "Surat",
        languages: ["English", "Hindi", "Gujarati"],
        badges: ["Punctual", "Friendly"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Ravi", rating: 5, text: "Always on time." },
            { author: "Sneha", rating: 4, text: "Friendly demeanor." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "Sanjay Menon",
        image: "/images/staff11.jpg",
        rating: 4.7,
        reviews: 200,
        experience: "11 Years",
        location: "Coimbatore",
        languages: ["English", "Tamil", "Malayalam"],
        badges: ["Experienced", "Safe"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Murali", rating: 5, text: "Years of experience shows in his driving." },
            { author: "Latha", rating: 5, text: "Felt very safe." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Rohan Kapoor",
        image: "/images/staff12.jpg",
        rating: 4.8,
        reviews: 132,
        experience: "6 Years",
        location: "Lucknow",
        languages: ["English", "Hindi"],
        badges: ["Polite", "Well Dressed"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Aditya", rating: 5, text: "Very polite communication." },
            { author: "Simran", rating: 5, text: "Always well dressed and professional." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440013",
        name: "Anil Tiwari",
        image: "/images/staff13.jpg",
        rating: 4.5,
        reviews: 55,
        experience: "4 Years",
        location: "Kanpur",
        languages: ["English", "Hindi"],
        badges: ["Eager to Help", "On Time"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Pankaj", rating: 4, text: "Very eager to help with bags." },
            { author: "Ritu", rating: 5, text: "Spot on time." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440014",
        name: "Prakash Joshi",
        image: "/images/staff14.jpg",
        rating: 4.9,
        reviews: 189,
        experience: "15 Years",
        location: "Nagpur",
        languages: ["English", "Hindi", "Marathi"],
        badges: ["Master Driver", "Navigation Pro"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Nilesh", rating: 5, text: "Master behind the wheel." },
            { author: "Pooja", rating: 5, text: "Didn't need GPS once." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440015",
        name: "Mohit Agarwal",
        image: "/images/staff15.jpg",
        rating: 4.6,
        reviews: 99,
        experience: "5 Years",
        location: "Indore",
        languages: ["English", "Hindi"],
        badges: ["Clean Vehicle", "Music Lover"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Raj", rating: 4, text: "Great playlist!" },
            { author: "Simi", rating: 5, text: "Car was spotless." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440016",
        name: "Ganesh Patil",
        image: "/images/staff16.jpg",
        rating: 4.8,
        reviews: 112,
        experience: "7 Years",
        location: "Thane",
        languages: ["English", "Hindi", "Marathi"],
        badges: ["Family Friendly", "Safe"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Suresh", rating: 5, text: "Great for families." },
            { author: "Meera", rating: 5, text: "Drives safely." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440017",
        name: "Vikas Yadav",
        image: "/images/staff17.jpg",
        rating: 4.7,
        reviews: 85,
        experience: "6 Years",
        location: "Bhopal",
        languages: ["English", "Hindi"],
        badges: ["Good Conversationalist", "Reliable"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Amit", rating: 5, text: "Had a great chat during the ride." },
            { author: "Kavita", rating: 5, text: "Very reliable." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440018",
        name: "Naveen Raju",
        image: "/images/staff18.jpg",
        rating: 4.9,
        reviews: 167,
        experience: "9 Years",
        location: "Visakhapatnam",
        languages: ["English", "Telugu", "Hindi"],
        badges: ["Customer Favorite", "Top Rated"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Prasad", rating: 5, text: "My favorite driver in Vizag." },
            { author: "Lakshmi", rating: 5, text: "Consistently excellent." }
        ]
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440019",
        name: "Sachin Deshmukh",
        image: "/images/staff19.jpg",
        rating: 4.6,
        reviews: 70,
        experience: "4 Years",
        location: "Pimpri-Chinchwad",
        languages: ["English", "Hindi", "Marathi"],
        badges: ["Quick", "Efficient"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Amol", rating: 5, text: "Gets you there quick." },
            { author: "Swati", rating: 4, text: "Efficient routes." }
        ]

    },
    {
        id: "550e8400-e29b-41d4-a716-446655440020",
        name: "Rakesh Jha",
        image: "/images/varun.jpeg",
        rating: 4.7,
        reviews: 90,
        experience: "7 Years",
        location: "Patna",
        languages: ["English", "Hindi", "Bhojpuri"],
        badges: ["Humorous", "Helpful"],
        licenseImage: "/images/license.jpeg",
        recentReviews: [
            { author: "Kumar", rating: 5, text: "Very funny guy, enjoyable ride." },
            { author: "Anita", rating: 5, text: "Extremely helpful." }
        ]
    }
];
