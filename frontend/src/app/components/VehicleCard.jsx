import { Users, Fuel, Gauge, ArrowRight } from 'lucide-react';
import { getBookedDates } from '../api/bookings';

const VehicleCard = ({ vehicle, onBook }) => {
  const [bookedDates, setBookedDates] = React.useState([]);
  const isBooked = (vehicle.status || 'AVAILABLE').toUpperCase() !== 'AVAILABLE';

  React.useEffect(() => {
    if (isBooked) {
      getBookedDates(vehicle.id).then(dates => {
        // Sort by endDate to find the latest one
        const sorted = dates.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        setBookedDates(sorted);
      }).catch(err => console.error("Error fetching booked dates:", err));
    }
  }, [vehicle.id, isBooked]);

  const getNextAvailableDate = () => {
    if (bookedDates.length === 0) return null;
    const latest = bookedDates[0];
    const date = new Date(latest.endDate);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="group bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full cursor-pointer hover:bg-white/10" onClick={(e) => { e.stopPropagation(); onBook(vehicle); }}>
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-50" />
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-primary font-bold text-sm">{vehicle.type}</span>
          </div>
          <div className={`${(vehicle.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'} px-3 py-1 rounded-full text-xs font-bold text-center`}>
            {(vehicle.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE'
              ? 'Available'
              : `Booked ${getNextAvailableDate() ? `until ${getNextAvailableDate()}` : ''}`}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{vehicle.name}</h3>
            {vehicle.rating && (
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                <span className="text-primary text-xs font-bold">★ {vehicle.rating}</span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm">{vehicle.brand}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Users size={16} className="text-primary/70" />
            <span>{vehicle.seats || '2-7'} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Fuel size={16} className="text-primary/70" />
            <span>{vehicle.fuelType || vehicle.fuel || 'Petrol'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Gauge size={16} className="text-primary/70" />
            <span>{vehicle.transmission || 'Manual'}</span>
          </div>
        </div>

        {/* Features Highlights */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {vehicle.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-gray-400">
                {feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="text-[10px] text-gray-500">+{vehicle.features.length - 3} more</span>
            )}
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Daily Rate</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">₹{vehicle.price || vehicle.pricePerDay}</span>
              <span className="text-gray-500 text-sm">/day</span>
            </div>
          </div>
          <button
            className="bg-white/5 hover:bg-primary hover:text-black text-white p-3 rounded-xl transition-all duration-300 group/btn"
          >
            <ArrowRight size={20} className="transform group-hover/btn:-rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
