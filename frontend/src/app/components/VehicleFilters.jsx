import { Search, Filter, Car, Bike, MapPin, Star, Settings, Zap } from "lucide-react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

/* -------------------- CONSTANTS -------------------- */
const CAR_CATEGORIES = ["Hatchback", "Sedan", "SUV", "Luxury", "Convertible"];
const BIKE_CATEGORIES = ["Scooter", "Commuter", "Sports", "Cruiser", "Superbike"];

const CAR_BRANDS = [
  "Maruti Suzuki",
  "Tata",
  "Mahindra",
  "Hyundai",
  "Kia",
  "Toyota",
  "Honda",
  "Skoda",
  "Volkswagen",
  "Renault",
  "Nissan",
  "BMW",
  "Mercedes",
  "Audi"
];

const BIKE_BRANDS = [
  "Hero",
  "Bajaj",
  "TVS",
  "Royal Enfield",
  "Honda",
  "Suzuki",
  "Yamaha",
  "KTM",
  "Jawa",
  "Ducati",
  "Harley-Davidson"
];

export const MAX_PRICE = 5000;
const inr = (v) => `₹${v}`;

/* -------------------- COMPONENT -------------------- */

export function VehicleFilters({ filters, setFilters }) {

  const brands =
    filters.type === "bike"
      ? BIKE_BRANDS
      : filters.type === "car"
        ? CAR_BRANDS
        : [...CAR_BRANDS, ...BIKE_BRANDS];

  const categories =
    filters.type === "bike"
      ? BIKE_CATEGORIES
      : filters.type === "car"
        ? CAR_CATEGORIES
        : [...CAR_CATEGORIES, ...BIKE_CATEGORIES];

  const activeFilterCount = Object.values(filters).filter(value => value !== 'all' && value !== 0 && value !== MAX_PRICE).length - 1; // Adjust for distance default

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      category: "all",
      brand: "all",
      seating: 0,
      distance: 10,
      maxPrice: MAX_PRICE,
      rating: 0,
      transmission: "all",
      fuelType: "all"
    });
  };

  return (
    <aside className="w-72 sticky top-24 h-fit max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-white/5 space-y-8 animate-in slide-in-from-left-5 duration-700">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{activeFilterCount}</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive">
            Clear all
          </Button>
        )}
      </div>

      {/* SEARCH */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Search</label>
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Search vehicles..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="w-full pl-9 py-2 rounded-lg bg-secondary/50 border border-white/5 focus:border-primary/50 text-sm transition-all outline-none"
          />
        </div>
      </div>

      {/* TYPE */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "all", label: "All", icon: null },
            { id: "car", label: "Car", icon: Car },
            { id: "bike", label: "Bike", icon: Bike },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilters({ ...filters, type: t.id, category: "all", brand: "all" })}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all duration-300
                ${filters.type === t.id
                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
                  : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }
              `}
            >
              {t.icon && <t.icon className="h-4 w-4" />}
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Category</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full p-2.5 rounded-lg bg-secondary/50 border border-white/5 focus:border-primary/50 text-sm outline-none cursor-pointer appearance-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* BRAND */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Brand</label>
        <select
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          className="w-full p-2.5 rounded-lg bg-secondary/50 border border-white/5 focus:border-primary/50 text-sm outline-none cursor-pointer appearance-none"
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* TRANSMISSION */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Settings className="h-3 w-3" /> Transmission
        </label>
        <div className="flex gap-2">
          {["Manual", "Auto"].map((t) => (
            <button
              key={t}
              onClick={() => setFilters({ ...filters, transmission: filters.transmission === t ? "all" : t })}
              className={`
                flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all
                ${filters.transmission === t
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* FUEL TYPE */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Zap className="h-3 w-3" /> Fuel Type
        </label>
        <div className="flex flex-wrap gap-2">
          {["Petrol", "Diesel", "Electric"].map((f) => (
            <button
              key={f}
              onClick={() => setFilters({ ...filters, fuelType: filters.fuelType === f ? "all" : f })}
              className={`
                px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1
                ${filters.fuelType === f
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Max Price / Day</label>
          <span className="text-sm font-bold text-primary">{inr(filters.maxPrice)}</span>
        </div>
        <Slider
          defaultValue={[MAX_PRICE]}
          max={10000}
          step={100}
          value={[filters.maxPrice]}
          onValueChange={(val) => setFilters({ ...filters, maxPrice: val[0] })}
          className="py-2"
        />
      </div>

      {/* SEATING (Cars only) */}
      {filters.type !== 'bike' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Seating Capacity</label>
          <div className="flex gap-2">
            {[2, 4, 5, 7].map((num) => (
              <button
                key={num}
                onClick={() => setFilters({ ...filters, seating: filters.seating === num ? 0 : num })}
                className={`
                  w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all
                  ${filters.seating === num
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MIN RATING */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Minimum Rating</label>
        <div className="flex gap-2">
          {[3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, rating: filters.rating === r ? 0 : r })}
              className={`
                px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1
                ${filters.rating === r
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
                }
              `}
            >
              {r}+ <Star className="h-3 w-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* DISTANCE */}
      <div className="space-y-4 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium text-muted-foreground">Distance</label>
          </div>
          <span className="text-sm font-bold text-foreground">{filters.distance} km</span>
        </div>
        <Slider
          defaultValue={[10]}
          max={50}
          step={1}
          value={[filters.distance]}
          onValueChange={(val) => setFilters({ ...filters, distance: val[0] })}
        />
      </div>

    </aside>
  );
}
