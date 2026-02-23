import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ScrollingBanner from './components/ScrollingBanner';
import VehicleList from './components/VehicleList';
import BookingWizard from './components/BookingWizard';
import Footer from './components/Footer';
import { About, Testimonials, Careers, HelpCenter, Terms, Privacy, Contact } from './components/FooterPages';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { DamageReport } from './components/DamageReport';
import { SupportDialog } from './components/SupportDialog';
import HostVehicleForm from './components/HostVehicleForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import StaffDashboard from './components/StaffDashboard';
import Antigravity from './components/Antigravity';
import ResetPassword from './components/ResetPassword';
import apiClient from '../api/config';

import { Toaster, toast } from 'sonner';
import { vehicles as staticVehicles } from './data/vehicles';
import * as authAPI from '../api/auth';
import * as vehiclesAPI from '../api/vehicles';
import * as bookingsAPI from '../api/bookings';
import * as filesAPI from '../api/files';
import * as driversAPI from '../api/drivers';
import { getUser, clearAuth } from '../api/config';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('overview');

  const [allVehicles, setAllVehicles] = useState([]);

  // Check for existing authentication on mount
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      // Restore view based on role
      const role = storedUser.role ? storedUser.role.toLowerCase() : 'user';
      if (role === 'driver') {
        setCurrentView('driver-dashboard');
      } else if (role === 'admin') {
        setCurrentView('admin-dashboard');
      } else if (role === 'staff') {
        setCurrentView('staff-dashboard');
      }
    }

    // Background sync user data
    const token = localStorage.getItem('wheelio_token');
    if (token) {
      apiClient.get('/auth/me')
        .then(res => {
          const freshUser = res.data;
          if (freshUser) {
            // Map backend fields to frontend format
            const mappedUser = {
              id: freshUser.id,
              name: freshUser.fullName || freshUser.name,
              email: freshUser.email,
              role: (freshUser.role || 'user').toLowerCase(),
              phone: freshUser.phone,
              avatarUrl: freshUser.avatarUrl,
              city: freshUser.city
            };
            setUser(mappedUser);
            localStorage.setItem('wheelio_user', JSON.stringify(mappedUser));
            // Ensure correct view
            if (mappedUser.role === 'driver') setCurrentView('driver-dashboard');
            else if (mappedUser.role === 'admin') setCurrentView('admin-dashboard');
            else if (mappedUser.role === 'staff') setCurrentView('driver-dashboard');
          }
        })
        .catch(err => {
          console.error("Session sync failed", err);
          // If 401 or network error, clear stale auth and go to home
          if (err.response?.status === 401) {
            setUser(null);
            setCurrentView('home');
          }
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }

    // Check for password reset route: /reset-password?token=...
    if (window.location.pathname === '/reset-password') {
      setCurrentView('reset-password');
    }
  }, []);

  // Fetch user bookings from backend when user is set
  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        try {
          const bookings = await bookingsAPI.getUserBookings(user.id);
          // Map backend bookings to frontend format
          const formattedBookings = bookings.map(b => {
            // Backend stores vehicle info under vehicleSummary (embedded denormalized snapshot)
            const vs = b.vehicleSummary || b.vehicle || {};
            let vehicle = {
              id: vs.vehicleId || vs.id || b.vehicleId,
              name: vs.name || 'Unknown Vehicle',
              brand: vs.brand || '',
              type: vs.type || '',
              imageUrl: vs.imageUrl || '',
              location: vs.location || '',
              price: vs.pricePerDay || 0,
            };
            // Try to enrich with static frontend data (better images, more details)
            const staticMatch = staticVehicles.find(sv => sv.name === vehicle.name);
            if (staticMatch) {
              vehicle = { ...vehicle, image: staticMatch.image, ...(!vehicle.location && { location: staticMatch.location }) };
            } else if (vehicle.imageUrl) {
              vehicle = { ...vehicle, image: vehicle.imageUrl };
            }

            const startDate = b.startDate ? new Date(b.startDate) : new Date();
            const endDate = b.endDate ? new Date(b.endDate) : new Date();

            return {
              ...b,
              date: startDate.toLocaleDateString() + ' to ' + endDate.toLocaleDateString(),
              cost: '₹' + (b.totalAmount || 0),
              vehicle,
              status: b.status,
              vehicleName: vehicle.name
            };
          });
          setUserBookings(formattedBookings);
        } catch (error) {
          console.error("Failed to fetch user bookings:", error);
          toast.error("Could not load your bookings.");
        }
      } else {
        setUserBookings([]);
      }
    };

    fetchBookings();
  }, [user]);

  // Mappings for backend visibility/compatibility
  const mapVehicleToFrontend = (backendV) => {
    const staticV = staticVehicles.find(sv => sv.name === backendV.name);

    // Base mapped object for any backend vehicle
    const baseMapped = {
      ...backendV,
      price: backendV.pricePerDay || 0,
      image: backendV.imageUrl || '',
      images: (backendV.images && backendV.images.length > 0)
        ? backendV.images
        : (backendV.imageUrl ? [backendV.imageUrl, '', '', ''] : ['', '', '', '']),
      status: (backendV.status || 'available').toLowerCase(),
      type: (() => {
        if (!backendV.type) return 'Car';
        const t = backendV.type.toUpperCase();
        if (t === 'SUV' || t === 'MPV') return t;
        return t.charAt(0) + t.slice(1).toLowerCase();
      })()
    };

    if (staticV) {
      return {
        ...staticV,
        ...baseMapped,
        seats: (backendV.seats !== null && backendV.seats !== undefined && backendV.seats !== "") ? backendV.seats : staticV.seats,
        fuelType: (backendV.fuelType && backendV.fuelType !== "") ? backendV.fuelType : (staticV.fuelType || staticV.fuel),
        transmission: (backendV.transmission && backendV.transmission !== "") ? backendV.transmission : staticV.transmission,
        rating: (backendV.rating !== null && backendV.rating !== undefined) ? backendV.rating : staticV.rating,
        reviews: (backendV.reviews !== null && backendV.reviews !== undefined) ? backendV.reviews : staticV.reviews,
        features: (backendV.features && backendV.features.length > 0) ? backendV.features : staticV.features,
        details: backendV.details || staticV.details,
        image: backendV.imageUrl || staticV.image,
        images: (backendV.images && backendV.images.length > 0) ? backendV.images : staticV.images,
      };
    }
    return baseMapped;
  };

  // Fetch vehicles from backend on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setVehiclesLoading(true);
      try {
        const backendVehicles = await vehiclesAPI.getAllVehicles();

        // Deduplicate backend vehicles by name first
        const uniqueBackendVehicles = backendVehicles.reduce((acc, current) => {
          const existing = acc.find(v => v.name === current.name);
          if (!existing) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Merge backend data with static frontend data
        // This preserves images and frontend-specific fields while getting real-time data from backend
        const mergedVehicles = uniqueBackendVehicles.map(mapVehicleToFrontend);

        setAllVehicles(mergedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        // Fallback to static vehicles if API fails
        setAllVehicles(staticVehicles);
        toast.error('Could not load vehicles from server, using cached data');
      } finally {
        setVehiclesLoading(false);
      }
    };

    // Also fetch all bookings for admins
    const fetchAllBookings = async () => {
      if (user?.role === 'admin') {
        try {
          const bookings = await bookingsAPI.getAllBookings();
          setAllBookings(bookings.map(b => {
            // Backend stores vehicle info in vehicleSummary (denormalized snapshot)
            const vs = b.vehicleSummary || b.vehicle || {};
            return {
              ...b,
              vehicleName: vs.name || b.vehicleId || 'Unknown',
              // Backend stores denormalized userName field directly on booking
              userName: b.userName || b.user?.fullName || b.user?.email || 'Unknown User',
              cost: '₹' + (b.totalAmount || 0),
              date: b.startDate ? (new Date(b.startDate).toLocaleDateString() + ' to ' + new Date(b.endDate).toLocaleDateString()) : 'Dates N/A'
            };
          }));
        } catch (error) {
          console.error("Failed to fetch all bookings for admin:", error);
        }
      } else {
        const storedBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
        setAllBookings(storedBookings);
      }
    };

    fetchVehicles();
    fetchAllBookings();
  }, [user]);

  const handleAddVehicle = async (vehicleData) => {
    try {
      // Build a clean payload for the backend to avoid "Unknown Property" errors
      const backendPayload = {
        name: vehicleData.name,
        brand: vehicleData.brand,
        type: (vehicleData.type || 'Car').toUpperCase(),
        pricePerDay: parseFloat(vehicleData.price) || 0,
        location: vehicleData.location,
        status: (vehicleData.status || 'AVAILABLE').toUpperCase(),
        imageUrl: vehicleData.images?.[0] || vehicleData.image || '',
        features: typeof vehicleData.features === 'string'
          ? vehicleData.features.split(',').map(f => f.trim()).filter(f => f !== '')
          : (Array.isArray(vehicleData.features) ? vehicleData.features : []),
        description: vehicleData.description || '',
        seats: parseInt(vehicleData.seats) || 5,
        fuelType: vehicleData.fuelType || 'Petrol',
        transmission: vehicleData.transmission || 'Manual',
        rating: parseFloat(vehicleData.rating) || 4.5,
        reviews: parseInt(vehicleData.reviews) || 0,
        details: vehicleData.details || {}
      };

      console.log('Sending Add Vehicle Payload:', backendPayload);

      const created = await vehiclesAPI.createVehicle(backendPayload);
      const mapped = mapVehicleToFrontend(created);
      setAllVehicles(prev => [mapped, ...prev]);
      toast.success('Vehicle added successfully!');
      return mapped;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      const errorMsg = error.response?.data?.error || error.response?.data || error.message;
      toast.error('Failed to add vehicle: ' + errorMsg);
      throw error;
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await vehiclesAPI.deleteVehicle(vehicleId);
      setAllVehicles(prev => prev.filter(v => v.id !== vehicleId));
      toast.success('Vehicle removed from fleet');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    try {
      const backendPayload = {
        id: updatedVehicle.id,
        name: updatedVehicle.name,
        brand: updatedVehicle.brand,
        type: (updatedVehicle.type || 'Car').toUpperCase(),
        pricePerDay: parseFloat(updatedVehicle.price) || updatedVehicle.pricePerDay || 0,
        location: updatedVehicle.location,
        status: (updatedVehicle.status || 'AVAILABLE').toUpperCase(),
        imageUrl: updatedVehicle.images?.[0] || updatedVehicle.image || updatedVehicle.imageUrl || '',
        features: typeof updatedVehicle.features === 'string'
          ? updatedVehicle.features.split(',').map(f => f.trim()).filter(f => f !== '')
          : (Array.isArray(updatedVehicle.features) ? updatedVehicle.features : []),
        description: updatedVehicle.description || '',
        seats: parseInt(updatedVehicle.seats) || 5,
        fuelType: updatedVehicle.fuelType || 'Petrol',
        transmission: updatedVehicle.transmission || 'Manual',
        rating: parseFloat(updatedVehicle.rating) || 4.5,
        reviews: parseInt(updatedVehicle.reviews) || 0,
        details: updatedVehicle.details || {}
      };

      console.log('Sending Update Vehicle Payload:', backendPayload);
      const updatedBackend = await vehiclesAPI.updateVehicle(updatedVehicle.id, backendPayload);
      const mapped = mapVehicleToFrontend(updatedBackend);
      setAllVehicles(prev => prev.map(v => v.id === mapped.id ? mapped : v));
      toast.success('Vehicle updated successfully!');
      return mapped;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      const errorMsg = error.response?.data?.error || error.response?.data || error.message;
      toast.error('Failed to update vehicle: ' + errorMsg);
      throw error;
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await authAPI.login(credentials.email, credentials.password);
      const userData = {
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        role: response.user.role.toLowerCase(),
        phone: response.user.phone,
        avatarUrl: response.user.avatarUrl
      };
      setUser(userData);

      // Redirect based on role
      // Redirect based on role
      if (userData.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else if (userData.role === 'driver') {
        setCurrentView('driver-dashboard');
      } else if (userData.role === 'staff') {
        setCurrentView('staff-dashboard');
      } else {
        setCurrentView('home');
      }
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setCurrentView('home');
    setUserBookings([]);
    toast.success('Logged out successfully');
  };

  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportTab, setSupportTab] = useState('faq');

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Relaxed ID check: Allow UUID, MongoDB ObjectId, or simple numeric IDs (for static data)
  const isValidId = (str) => {
    if (str === null || str === undefined) return false;
    const s = str.toString();
    return /^[0-9a-f]{24}$/i.test(s) || // MongoDB ObjectId
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s) || // UUID
      /^\d+$/.test(s); // Numeric ID
  };

  const confirmBooking = async (bookingData) => {
    // Guard: must be logged in with a real backend user ID
    if (!user || !isValidId(user.id)) {
      toast.error('Please log out and log back in before booking.');
      return;
    }

    // Guard: vehicle must have a real backend ID
    if (!bookingData.vehicle || !isValidId(bookingData.vehicle.id)) {
      toast.error('Vehicle data is not ready yet. Please wait a moment and try again — the server may still be loading.');
      return;
    }

    try {
      // Build ISO date strings with seconds
      const buildDate = (date, time) => {
        const d = date || new Date().toISOString().split('T')[0];
        const t = time || '00:00';
        // Ensure time has seconds
        const timeParts = t.split(':');
        const fullTime = timeParts.length === 2 ? `${t}:00` : t;
        return `${d}T${fullTime}`;
      };

      const startDateStr = buildDate(bookingData.startDate, bookingData.startTime);
      const endDateStr = buildDate(bookingData.endDate, bookingData.dropTime);

      const toastId = toast.loading('Confirming your booking...');

      // Handle license upload if present (Verification System)
      let driverProfileId = null;
      if (bookingData.license) {
        try {
          // If license is a File object, upload it
          if (bookingData.license instanceof File) {
            toast.info('Uploading license document...');
            const uploadRes = await filesAPI.uploadFile(bookingData.license);
            const licenseUrl = uploadRes.url;

            // Try to update or create DriverProfile for the user
            try {
              const profileUpdate = {
                fullName: user.name,
                email: user.email,
                phone: user.phone || bookingData.phone,
                city: user.city || 'Coimbatore',
                licenseNumber: bookingData.licenseNumber || 'PENDING_VERIFICATION',
                status: 'VERIFYING',
                documents: {
                  license: licenseUrl
                }
              };

              // First check if profile exists
              try {
                const existingProfile = await driversAPI.getDriverProfile(user.id);
                const updatedProfile = await driversAPI.updateDriverProfile(user.id, profileUpdate);
                driverProfileId = updatedProfile.id;
              } catch (e) {
                // Not found, create new
                const newProfile = await driversAPI.createDriverProfile(profileUpdate);
                driverProfileId = newProfile.id;
              }
            } catch (profileErr) {
              console.error("Failed to manage driver profile:", profileErr);
            }
          }
        } catch (uploadErr) {
          console.error("License upload failed:", uploadErr);
          toast.error("Failed to upload license. Proceeding without verification.");
        }
      }

      // Send driverId if it's a valid format (UUID or MongoDB ObjectId)
      let finalDriverId = driverProfileId || null;
      if (!finalDriverId && bookingData.driver?.id && isValidId(bookingData.driver.id)) {
        finalDriverId = bookingData.driver.id;
      }

      // Prepare booking data for backend
      const bookingPayload = {
        userId: user.id,
        vehicleId: bookingData.vehicle.id,
        driverId: finalDriverId,
        startDate: startDateStr,
        endDate: endDateStr,
        totalAmount: bookingData.totalAmount || parseFloat((bookingData.vehicle.price * 1.05 + 96).toFixed(2)),
        pickupLocation: bookingData.pickupLocation || bookingData.vehicle?.location || 'Coimbatore',
        dropLocation: bookingData.dropLocation,
        contactPhone: bookingData.phone
      };

      console.log('Sending booking payload:', bookingPayload);

      // Create booking on backend
      const createdBooking = await bookingsAPI.createBooking(bookingPayload);

      // Add to local state for immediate UI update
      const newBooking = {
        ...createdBooking,
        date: new Date().toLocaleDateString(),
        cost: '₹' + (bookingPayload.totalAmount || 0).toFixed(0),
        userName: user.name,
        vehicleName: bookingData.vehicle.name,
        vehicle: bookingData.vehicle,
        driver: bookingData.driver
      };

      setUserBookings(prev => [newBooking, ...prev]);
      setAllBookings(prev => [newBooking, ...prev]);

      toast.success('Booking confirmed successfully!', { id: toastId });
      setSelectedVehicle(null);
      setDashboardTab('bookings'); // Open bookings tab after successful booking
      handleNavigate('dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create booking. Please try again.';
      toast.error(errorMsg, { id: typeof toastId !== 'undefined' ? toastId : undefined });
    }
  };

  const handleUpdateBooking = (updatedBooking) => {
    // Update user bookings state
    setUserBookings(prev => prev.map(b =>
      b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b
    ));

    // Update all bookings state and persist to localStorage
    const updatedAllBookings = allBookings.map(b =>
      b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b
    );
    setAllBookings(updatedAllBookings);
    localStorage.setItem('allBookings', JSON.stringify(updatedAllBookings));

    toast.success("Booking updated successfully!");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancelBooking(bookingId);

      // Update User Bookings
      const updatedUserBookings = userBookings.map(b =>
        b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
      );
      setUserBookings(updatedUserBookings);

      // Update All Bookings and Persist
      const updatedAllBookings = allBookings.map(b =>
        b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
      );
      setAllBookings(updatedAllBookings);
      localStorage.setItem('allBookings', JSON.stringify(updatedAllBookings));

      toast.success("Ride cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel ride. Please try again.");
    }
  };

  const handleEmergency = () => {
    setSupportTab('emergency');
    setIsSupportOpen(true);
  };

  const handleUpdateUser = (updatedData) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('wheelio_user', JSON.stringify(newUser));
      return newUser;
    });
    toast.success("Profile updated successfully!");
  };

  const handleReviewSubmit = (reviewData) => {
    // 1. Update User Bookings to mark as reviewed
    const updatedUserBookings = userBookings.map(b =>
      b.id === reviewData.bookingId ? { ...b, isReviewed: true } : b
    );
    setUserBookings(updatedUserBookings);

    // 2. Update All Bookings and Persist
    const updatedAllBookings = allBookings.map(b =>
      b.id === reviewData.bookingId ? { ...b, isReviewed: true } : b
    );
    setAllBookings(updatedAllBookings);
    localStorage.setItem('allBookings', JSON.stringify(updatedAllBookings));

    // 3. Update Vehicle Rating
    const updatedVehicles = allVehicles.map(v => {
      if (v.id === reviewData.vehicleId || v.name === reviewData.vehicleName) { // Robust match
        const currentReviews = v.reviews || 0;
        const currentRating = v.rating || 0;
        const newReviewsCount = currentReviews + 1;
        // Calculate new weighted average
        const newRating = ((currentRating * currentReviews) + reviewData.rating) / newReviewsCount;

        return {
          ...v,
          reviews: newReviewsCount,
          rating: parseFloat(newRating.toFixed(1))
        };
      }
      return v;
    });

    setAllVehicles(updatedVehicles);
    localStorage.setItem('allVehicles', JSON.stringify(updatedVehicles));

    toast.success("Thank you for your review!");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm">Loading Wheelio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 font-sans">
      <Toaster position="bottom-right" theme="dark" duration={2500} />
      <Antigravity
        count={150}
        detectRetina={true}
        color="#00E5FF" // Primary Cyan
        particleSize={1.2}
        waveSpeed={0.3}
        magnetRadius={8}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {!['admin-dashboard', 'dashboard', 'driver-dashboard'].includes(currentView) && (
          <Navbar onNavigate={handleNavigate} currentView={currentView} user={user} onLogout={handleLogout} />
        )}

        <main className={`flex-grow ${['admin-dashboard', 'dashboard', 'driver-dashboard'].includes(currentView) ? '' : 'pt-4'}`}>
          {currentView === 'home' && (
            <>
              <>
                <Hero onSearch={() => handleNavigate('vehicles')} onNavigate={handleNavigate} />
                <ScrollingBanner />
                <Features />
              </>
            </>
          )}

          {currentView === 'vehicles' && (
            <VehicleList onBook={handleBookVehicle} user={user} vehicles={allVehicles} onNavigate={handleNavigate} />
          )}

          {currentView === 'booking' && selectedVehicle && (
            <BookingWizard
              vehicle={selectedVehicle}
              onBack={() => handleNavigate('vehicles')}
              onComplete={confirmBooking}
            />
          )}

          {currentView === 'become-host' && (
            <HostVehicleForm onNavigate={handleNavigate} user={user} />
          )}

          {currentView === 'damage-report' && (
            <DamageReport onNavigate={handleNavigate} userBookings={userBookings} allVehicles={allVehicles} />
          )}

          {currentView === 'about' && <About />}
          {currentView === 'testimonials' && <Testimonials />}
          {currentView === 'careers' && <Careers />}
          {currentView === 'help' && <HelpCenter />}
          {currentView === 'terms' && <Terms />}
          {currentView === 'privacy' && <Privacy />}
          {currentView === 'contact' && <Contact />}
          {currentView === 'login' && <Login onNavigate={handleNavigate} onLogin={handleLogin} />}
          {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} bookings={userBookings} user={user} onUpdateUser={handleUpdateUser} onUpdateBooking={handleUpdateBooking} onCancelBooking={handleCancelBooking} onReview={handleReviewSubmit} onLogout={handleLogout} initialTab={dashboardTab} onTabChange={setDashboardTab} />}

          {currentView === 'admin-login' && <AdminLogin onNavigate={handleNavigate} onLogin={handleLogin} />}
          {currentView === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} vehicles={allVehicles} bookings={allBookings} onAddVehicle={handleAddVehicle} onDeleteVehicle={handleDeleteVehicle} onUpdateVehicle={handleUpdateVehicle} onLogout={handleLogout} />}
          {currentView === 'driver-dashboard' && <DriverDashboard onNavigate={handleNavigate} user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />}
          {currentView === 'staff-dashboard' && <StaffDashboard onNavigate={handleNavigate} user={user} onLogout={handleLogout} />}
          {currentView === 'reset-password' && <ResetPassword onNavigate={handleNavigate} />}


        </main>



        <SupportDialog
          open={isSupportOpen}
          onOpenChange={setIsSupportOpen}
          defaultTab={supportTab}
          user={user}
        />

        {!['admin-dashboard', 'dashboard', 'driver-dashboard'].includes(currentView) && (
          <Footer onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
};

export default App;
