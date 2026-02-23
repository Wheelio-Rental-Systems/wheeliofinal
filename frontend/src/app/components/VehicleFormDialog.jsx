import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Car, Settings, List, Image as ImageIcon, Check } from 'lucide-react';

const VehicleFormDialog = ({ open, onOpenChange, onSubmit, initialVehicle, editMode }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        type: 'Car',
        price: '',
        location: '',
        rating: '4.5',
        details: { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' },
        features: '',
        description: '',
        images: ['', '', '', ''],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        status: 'available'
    });

    useEffect(() => {
        if (initialVehicle) {
            setFormData({
                ...initialVehicle,
                price: initialVehicle.price?.toString() || '',
                features: Array.isArray(initialVehicle.features) ? initialVehicle.features.join(', ') : (initialVehicle.features || ''),
                images: (initialVehicle.images && initialVehicle.images.length > 0) ? initialVehicle.images : [initialVehicle.image || '', '', '', ''],
                details: initialVehicle.details || { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' }
            });
        } else {
            setFormData({
                name: '', brand: '', type: 'Car', price: '', location: '', rating: '4.5',
                details: { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' },
                features: '', description: '',
                images: ['', '', '', ''],
                seats: 5, fuelType: 'Petrol', transmission: 'Manual', status: 'available'
            });
        }
    }, [initialVehicle, open]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDetailChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            details: { ...prev.details, [field]: value }
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-[#1e1e2d] border-white/10 text-white p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Car className="text-primary" />
                        {editMode ? 'Edit Vehicle' : 'Add New Vehicle'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="bg-black/20 border border-white/5 p-1 mb-6">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                                <Car size={14} className="mr-2" /> Basic Info
                            </TabsTrigger>
                            <TabsTrigger value="tech" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                                <Settings size={14} className="mr-2" /> Technical
                            </TabsTrigger>
                            <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                                <List size={14} className="mr-2" /> Features
                            </TabsTrigger>
                            <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                                <ImageIcon size={14} className="mr-2" /> Images
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Vehicle Name</Label>
                                    <Input
                                        placeholder="e.g. Maruti Swift"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="bg-black/20 border-white/10 focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    <Input
                                        placeholder="e.g. Maruti Suzuki"
                                        value={formData.brand}
                                        onChange={(e) => handleChange('brand', e.target.value)}
                                        className="bg-black/20 border-white/10 focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                                        <SelectTrigger className="bg-black/20 border-white/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1e1e2d] border-white/10 text-white">
                                            <SelectItem value="Car">Car</SelectItem>
                                            <SelectItem value="Bike">Bike</SelectItem>
                                            <SelectItem value="Scooter">Scooter</SelectItem>
                                            <SelectItem value="SUV">SUV</SelectItem>
                                            <SelectItem value="Sedan">Sedan</SelectItem>
                                            <SelectItem value="MPV">MPV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Price Per Day (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="500"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        className="bg-black/20 border-white/10 focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        placeholder="Coimbatore"
                                        value={formData.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        className="bg-black/20 border-white/10 focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                    <SelectTrigger className="bg-black/20 border-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1e2d] border-white/10 text-white">
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="booked">Booked</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="tech" className="space-y-4 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Seats</Label>
                                    <Input
                                        type="number"
                                        value={formData.seats}
                                        onChange={(e) => handleChange('seats', e.target.value)}
                                        className="bg-black/20 border-white/10 focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fuel Type</Label>
                                    <Select value={formData.fuelType} onValueChange={(v) => handleChange('fuelType', v)}>
                                        <SelectTrigger className="bg-black/20 border-white/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1e1e2d] border-white/10 text-white">
                                            <SelectItem value="Petrol">Petrol</SelectItem>
                                            <SelectItem value="Diesel">Diesel</SelectItem>
                                            <SelectItem value="Electric">Electric</SelectItem>
                                            <SelectItem value="CNG">CNG</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Transmission</Label>
                                    <Select value={formData.transmission} onValueChange={(v) => handleChange('transmission', v)}>
                                        <SelectTrigger className="bg-black/20 border-white/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1e1e2d] border-white/10 text-white">
                                            <SelectItem value="Manual">Manual</SelectItem>
                                            <SelectItem value="Automatic">Automatic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mileage</Label>
                                    <Input
                                        placeholder="e.g. 15 kmpl"
                                        value={formData.details.mileage}
                                        onChange={(e) => handleDetailChange('mileage', e.target.value)}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Engine</Label>
                                    <Input placeholder="1200cc" value={formData.details.engine} onChange={(e) => handleDetailChange('engine', e.target.value)} className="bg-black/20 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Power</Label>
                                    <Input placeholder="85 bhp" value={formData.details.power} onChange={(e) => handleDetailChange('power', e.target.value)} className="bg-black/20 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fuel Tank</Label>
                                    <Input placeholder="35L" value={formData.details.fuelTank} onChange={(e) => handleDetailChange('fuelTank', e.target.value)} className="bg-black/20 border-white/10" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <Label>Features (comma separated)</Label>
                                <Textarea
                                    placeholder="AC, Bluetooth, Sunroof, Airbags"
                                    value={formData.features}
                                    onChange={(e) => handleChange('features', e.target.value)}
                                    className="bg-black/20 border-white/10 min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Brief description of the vehicle condition or history..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="bg-black/20 border-white/10 min-h-[100px]"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="images" className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Primary Image URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://example.com/car.jpg"
                                            value={formData.images[0]}
                                            onChange={(e) => handleImageChange(0, e.target.value)}
                                            className="bg-black/20 border-white/10 flex-1"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Extra Image 1</Label>
                                        <Input value={formData.images[1]} onChange={(e) => handleImageChange(1, e.target.value)} className="bg-black/20 border-white/10 text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Extra Image 2</Label>
                                        <Input value={formData.images[2]} onChange={(e) => handleImageChange(2, e.target.value)} className="bg-black/20 border-white/10 text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Extra Image 3</Label>
                                        <Input value={formData.images[3]} onChange={(e) => handleImageChange(3, e.target.value)} className="bg-black/20 border-white/10 text-xs" />
                                    </div>
                                </div>
                                {formData.images[0] && (
                                    <div className="mt-4 p-2 bg-black/40 rounded-xl border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <Label className="text-xs text-gray-500 uppercase">Preview</Label>
                                            {formData.images[0].includes('search/') && (
                                                <span className="text-[10px] text-yellow-500 font-medium">⚠️ This looks like a search page, not a direct image link</span>
                                            )}
                                        </div>
                                        <img
                                            src={formData.images[0]}
                                            alt="Preview"
                                            className="w-full h-40 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+Link';
                                                e.target.classList.add('opacity-50');
                                            }}
                                        />
                                        <p className="mt-2 text-[10px] text-gray-500 truncate">{formData.images[0]}</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-8 gap-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-white/5 text-gray-400">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary text-black font-bold px-8 hover:bg-cyan-400">
                            {editMode ? 'Update Vehicle' : 'Add Vehicle to Fleet'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default VehicleFormDialog;
