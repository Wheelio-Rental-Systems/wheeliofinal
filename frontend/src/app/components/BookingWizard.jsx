import React, { useState } from 'react';
import RentalTypeSelection from './booking-steps/RentalTypeSelection';
import DriverSelection from './booking-steps/DriverSelection';
import LicenseUpload from './booking-steps/LicenseUpload';
import AddOns from './booking-steps/AddOns';
import BookingForm from './BookingForm';

const BookingWizard = ({ vehicle, onBack, onComplete }) => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        driveType: 'self', // 'self' or 'chauffeur'
        driver: null,
        license: null,
        addOns: []
    });

    const handleDriveTypeSubmit = (type) => {
        setBookingData(prev => ({ ...prev, driveType: type }));
        setStep(2);
    };

    const handleDriverSubmit = (driver) => {
        setBookingData(prev => ({ ...prev, driver: driver }));
        setStep(3);
    };

    const handleLicenseSubmit = (licenseFile) => {
        setBookingData(prev => ({ ...prev, license: licenseFile }));
        setStep(3);
    };

    const handleAddOnsSubmit = (selectedAddOns) => {
        setBookingData(prev => ({ ...prev, addOns: selectedAddOns }));
        setStep(4);
    };

    const handleBookingConfirm = (finalBookingData) => {
        // Pass the collected data back to App
        onComplete({
            vehicle,
            ...bookingData,
            ...finalBookingData
        });
    };

    // Determine what to render for Step 2
    const renderStep2 = () => {
        if (bookingData.driveType === 'chauffeur') {
            return (
                <DriverSelection
                    onNext={handleDriverSubmit}
                    onBack={() => setStep(1)}
                    initialDriver={bookingData.driver}
                    vehicleLocation={vehicle.location}
                />
            );
        } else {
            return (
                <LicenseUpload
                    onNext={handleLicenseSubmit}
                    onBack={() => setStep(1)}
                />
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {step === 1 && (
                <RentalTypeSelection
                    vehicle={vehicle}
                    onNext={handleDriveTypeSubmit}
                    initialType={bookingData.driveType}
                    onBack={onBack}
                />
            )}

            {step === 2 && renderStep2()}

            {step === 3 && (
                <AddOns
                    vehicle={vehicle}
                    onNext={handleAddOnsSubmit}
                    onBack={() => setStep(2)}
                />
            )}

            {step === 4 && (
                <BookingForm
                    vehicle={vehicle}
                    bookingData={bookingData}
                    onBack={() => setStep(3)}
                    onConfirm={handleBookingConfirm}
                />
            )}
        </div>
    );
};

export default BookingWizard;
