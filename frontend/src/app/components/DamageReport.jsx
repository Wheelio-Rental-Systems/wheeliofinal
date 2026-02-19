
import { useState } from "react";
import { Upload, AlertTriangle, Check, ChevronsUpDown, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

export function DamageReport() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);

  const INDIAN_CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Coimbatore", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna"
  ];

  const handleUpload = (e) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <h1 className="text-3xl mb-2 text-primary">Report Vehicle Damage</h1>
      <p className="text-muted-foreground mb-6">
        Report any scratches, dents, or issues found after your trip
      </p>

      <div className="space-y-5">

        {/* Location Selection */}
        <div>
          <label className="text-sm font-medium">Incident Location</label>
          <div className="mt-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-start bg-muted border-border text-white hover:bg-muted/80 hover:text-white h-12 font-normal px-4"
                >
                  <MapPin className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                  <span className="flex-1 text-left truncate">
                    {location
                      ? INDIAN_CITIES.find((city) => city === location)
                      : <span className="text-gray-500">Enter location where damage occurred</span>}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" className="w-[--radix-popover-trigger-width] p-0 bg-[#1e1e2d] border-white/10 text-white">
                <Command className="bg-transparent">
                  <CommandInput placeholder="Search city..." className="text-white" />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {INDIAN_CITIES.map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={(currentValue) => {
                            setLocation(currentValue);
                            setOpen(false);
                          }}
                          className="text-white hover:bg-white/10 aria-selected:bg-white/10 cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              location === city ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm">Damage Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the damage clearly..."
            className="w-full mt-2 p-3 rounded-lg bg-muted border border-border text-white"
            rows={4}
          />
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm">Upload Damage Photos</label>
          <label className="mt-2 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
            <Upload />
            <span className="text-sm text-muted-foreground">
              Click to upload images
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleUpload}
            />
          </label>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/40 p-3 rounded-lg">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          Damage charges will be calculated after inspection by staff.
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500">
          Submit Damage Report
        </Button>
      </div>
    </div>
  );
}
