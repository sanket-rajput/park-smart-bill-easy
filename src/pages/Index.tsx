import { useState } from "react";
import { Car, Clock, DollarSign, ParkingCircle, MapPin } from "lucide-react";
import { CheckInForm } from "@/components/CheckInForm";
import { ParkedVehicles } from "@/components/ParkedVehicles";
import { PricingDisplay } from "@/components/PricingDisplay";
import { ParkingSlots } from "@/components/ParkingSlots";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  licensePlate: string;
  checkInTime: Date;
}

interface ParkedVehicle extends Vehicle {
  id: string;
  slotNumber: number;
  imageData?: string; // Base64 image data
}

interface ParkingSlot {
  number: number;
  isOccupied: boolean;
  vehicleId?: string;
}

const Index = () => {
  const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>(() => {
    // Load from localStorage on component mount
    const saved = localStorage.getItem('parkedVehicles');
    return saved ? JSON.parse(saved).map((v: any) => ({
      ...v,
      checkInTime: new Date(v.checkInTime)
    })) : [];
  });
  
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>(() => {
    // Initialize 50 parking slots (5 rows x 10 slots)
    const slots = Array.from({ length: 50 }, (_, i) => ({
      number: i + 1,
      isOccupied: false,
      vehicleId: undefined,
    }));
    
    // Load saved vehicles and mark their slots as occupied
    const saved = localStorage.getItem('parkedVehicles');
    if (saved) {
      const savedVehicles = JSON.parse(saved);
      savedVehicles.forEach((vehicle: ParkedVehicle) => {
        const slot = slots.find(s => s.number === vehicle.slotNumber);
        if (slot) {
          slot.isOccupied = true;
          slot.vehicleId = vehicle.id;
        }
      });
    }
    
    return slots;
  });
  
  const { toast } = useToast();

  // Save to localStorage whenever vehicles change
  const saveToLocalStorage = (vehicles: ParkedVehicle[]) => {
    localStorage.setItem('parkedVehicles', JSON.stringify(vehicles));
  };

  const handleCheckIn = (licensePlate: string, imageData?: string) => {
    // Find first available slot
    const availableSlot = parkingSlots.find(slot => !slot.isOccupied);
    
    if (!availableSlot) {
      toast({
        title: "Parking Full",
        description: "All parking slots are currently occupied.",
        variant: "destructive",
      });
      return;
    }

    const newVehicle: ParkedVehicle = {
      id: Date.now().toString(),
      licensePlate: licensePlate.toUpperCase(),
      checkInTime: new Date(),
      slotNumber: availableSlot.number,
      imageData,
    };
    
    // Update parking slots
    setParkingSlots(prev => prev.map(slot => 
      slot.number === availableSlot.number 
        ? { ...slot, isOccupied: true, vehicleId: newVehicle.id }
        : slot
    ));
    
    const updatedVehicles = [...parkedVehicles, newVehicle];
    setParkedVehicles(updatedVehicles);
    saveToLocalStorage(updatedVehicles);
    
    toast({
      title: "Vehicle Checked In",
      description: `${licensePlate.toUpperCase()} assigned to slot ${availableSlot.number}.`,
    });
  };

  const handleCheckOut = (vehicleId: string) => {
    const vehicle = parkedVehicles.find(v => v.id === vehicleId);
    
    if (vehicle) {
      // Free up the parking slot
      setParkingSlots(prev => prev.map(slot => 
        slot.number === vehicle.slotNumber 
          ? { ...slot, isOccupied: false, vehicleId: undefined }
          : slot
      ));
    }
    
    const updatedVehicles = parkedVehicles.filter(v => v.id !== vehicleId);
    setParkedVehicles(updatedVehicles);
    saveToLocalStorage(updatedVehicles);
  };

  const calculateBill = (checkInTime: Date) => {
    const now = new Date();
    const durationMs = now.getTime() - checkInTime.getTime();
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round up to next hour
    
    let total = 5; // First hour
    if (durationHours > 1) {
      total += (durationHours - 1) * 2; // Additional hours
    }
    
    return {
      duration: durationHours,
      firstHour: 5,
      additionalHours: Math.max(0, durationHours - 1),
      additionalCost: Math.max(0, (durationHours - 1) * 2),
      total
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/10 rounded-full">
                <ParkingCircle className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Smart Parking System</h1>
                <p className="mt-1 text-primary-foreground/80 text-lg">
                  AI-Powered Vehicle Management & Billing
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{parkedVehicles.length}/{parkingSlots.length}</div>
          <div className="text-sm text-primary-foreground/80">Occupied</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="parking-card text-center group hover:animate-pulse-glow">
            <Car className="h-10 w-10 mx-auto mb-3 text-primary transition-transform group-hover:scale-110" />
            <h3 className="text-3xl font-bold text-foreground mb-1">{parkedVehicles.length}</h3>
            <p className="text-muted-foreground font-medium">Currently Parked</p>
          </div>
          
          <div className="parking-card text-center group hover:animate-pulse-glow">
            <MapPin className="h-10 w-10 mx-auto mb-3 text-accent transition-transform group-hover:scale-110" />
            <h3 className="text-3xl font-bold text-foreground mb-1">{parkingSlots.filter(s => !s.isOccupied).length}</h3>
            <p className="text-muted-foreground font-medium">Available Slots</p>
          </div>
          
          <div className="parking-card text-center group hover:animate-pulse-glow">
            <Clock className="h-10 w-10 mx-auto mb-3 text-accent transition-transform group-hover:scale-110" />
            <h3 className="text-3xl font-bold text-foreground mb-1">24/7</h3>
            <p className="text-muted-foreground font-medium">Operating Hours</p>
          </div>
          
          <div className="parking-card text-center group hover:animate-pulse-glow">
            <DollarSign className="h-10 w-10 mx-auto mb-3 text-warning transition-transform group-hover:scale-110" />
            <h3 className="text-3xl font-bold text-foreground mb-1">$5</h3>
            <p className="text-muted-foreground font-medium">Starting Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Check In & Pricing */}
          <div className="space-y-6">
            <CheckInForm 
              onCheckIn={handleCheckIn} 
              availableSlots={parkingSlots.filter(s => !s.isOccupied).length}
            />
            <PricingDisplay />
          </div>

          {/* Middle Column - Parking Slots Layout */}
          <div className="lg:col-span-1">
            <ParkingSlots 
              slots={parkingSlots}
              vehicles={parkedVehicles}
            />
          </div>

          {/* Right Column - Parked Vehicles */}
          <div className="lg:col-span-2">
            <ParkedVehicles 
              vehicles={parkedVehicles} 
              onCheckOut={handleCheckOut}
              calculateBill={calculateBill}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;