import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React-Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

const CITY_COORDINATES = {
    "Mumbai": [19.0760, 72.8777],
    "Delhi": [28.6139, 77.2090],
    "Bangalore": [12.9716, 77.5946],
    "Hyderabad": [17.3850, 78.4867],
    "Chennai": [13.0827, 80.2707],
    "Kolkata": [22.5726, 88.3639],
    "Pune": [18.5204, 73.8567],
    "Ahmedabad": [23.0225, 72.5714],
    "Jaipur": [26.9124, 75.7873],
    "Surat": [21.1702, 72.8311],
    "Coimbatore": [11.0168, 76.9558],
    "Lucknow": [26.8467, 80.9462],
    "Kanpur": [26.4499, 80.3319],
    "Nagpur": [21.1458, 79.0882],
    "Indore": [22.7196, 75.8577],
    "Thane": [19.2183, 72.9781],
    "Bhopal": [23.2599, 77.4126],
    "Visakhapatnam": [17.6868, 83.2185],
    "Pimpri-Chinchwad": [18.6298, 73.7997],
    "Patna": [25.5941, 85.1376],
    "Goa": [15.2993, 74.1240],
    "Kochi": [9.9312, 76.2673],
    "Chandigarh": [30.7333, 76.7794],
    "Manali": [32.2432, 77.1892],
    "Rishikesh": [30.0869, 78.2676],
    "Hosur": [12.7409, 77.8253]
};

// Component to update map view when center changes
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const VehicleMap = ({ city, vehicleName }) => {
    const defaultCenter = [20.5937, 78.9629]; // Center of India
    const coordinates = CITY_COORDINATES[city] || defaultCenter;
    const zoom = CITY_COORDINATES[city] ? 13 : 5;

    return (
        <div className="h-[250px] w-full rounded-2xl overflow-hidden border border-white/10 z-0 relative">
            <MapContainer
                center={coordinates}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <ChangeView center={coordinates} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {CITY_COORDINATES[city] && (
                    <Marker position={coordinates}>
                        <Popup>
                            {vehicleName} is located in {city}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default VehicleMap;
