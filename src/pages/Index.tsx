import { useState } from "react";
import { Car, Clock, DollarSign, ParkingCircle } from "lucide-react";
import { CheckInForm } from "@/components/CheckInForm";
import { ParkedVehicles } from "@/components/ParkedVehicles";
import { PricingDisplay } from "@/components/PricingDisplay";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  licensePlate: string;
  checkInTime: Date;
}

interface ParkedVehicle extends Vehicle {
  id: string;
}

const Index = () => {
  const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>([]);
  const { toast } = useToast();

  const handleCheckIn = (licensePlate: string) => {
    const newVehicle: ParkedVehicle = {
      id: Date.now().toString(),
      licensePlate: licensePlate.toUpperCase(),
      checkInTime: new Date(),
    };
    
    setParkedVehicles(prev => [...prev, newVehicle]);
    
    toast({
      title: "Vehicle Checked In",
      description: `${licensePlate.toUpperCase()} has been registered successfully.`,
    });
  };

  const handleCheckOut = (vehicleId: string) => {
    setParkedVehicles(prev => prev.filter(v => v.id !== vehicleId));
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
      <header className="gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <ParkingCircle className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Parking Management System</h1>
          </div>
          <p className="mt-2 text-primary-foreground/80">
            Professional vehicle tracking and billing solution
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="parking-card text-center">
            <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{parkedVehicles.length}</h3>
            <p className="text-muted-foreground">Currently Parked</p>
          </div>
          
          <div className="parking-card text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
            <h3 className="text-2xl font-bold text-foreground">24/7</h3>
            <p className="text-muted-foreground">Operating Hours</p>
          </div>
          
          <div className="parking-card text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-warning" />
            <h3 className="text-2xl font-bold text-foreground">$5</h3>
            <p className="text-muted-foreground">Starting Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Check In & Pricing */}
          <div className="space-y-6">
            <CheckInForm onCheckIn={handleCheckIn} />
            <PricingDisplay />
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