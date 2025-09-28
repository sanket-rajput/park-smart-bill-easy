import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin } from "lucide-react";

interface ParkingSlot {
  number: number;
  isOccupied: boolean;
  vehicleId?: string;
}

interface ParkedVehicle {
  id: string;
  licensePlate: string;
  checkInTime: Date;
  slotNumber: number;
}

interface ParkingSlotsProps {
  slots: ParkingSlot[];
  vehicles: ParkedVehicle[];
}

export const ParkingSlots = ({ slots, vehicles }: ParkingSlotsProps) => {
  const getVehicleForSlot = (slotNumber: number) => {
    return vehicles.find(v => v.slotNumber === slotNumber);
  };

  const occupiedCount = slots.filter(s => s.isOccupied).length;
  const totalSlots = slots.length;

  return (
    <Card className="parking-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <CardTitle>Parking Layout</CardTitle>
        </div>
        <CardDescription>
          Real-time slot availability
        </CardDescription>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {totalSlots - occupiedCount} Available
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {occupiedCount} Occupied
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-parking-available border border-accent rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-parking-occupied border border-destructive rounded"></div>
            <span>Occupied</span>
          </div>
        </div>

        {/* Parking Grid - 5 rows x 10 slots */}
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {Array.from({ length: 10 }, (_, colIndex) => {
                const slotNumber = rowIndex * 10 + colIndex + 1;
                const slot = slots.find(s => s.number === slotNumber);
                const vehicle = getVehicleForSlot(slotNumber);
                
                return (
                  <div
                    key={slotNumber}
                    className={`
                      relative w-8 h-8 border-2 rounded text-xs flex items-center justify-center font-mono font-bold transition-smooth
                      ${slot?.isOccupied 
                        ? 'bg-parking-occupied border-destructive text-destructive-foreground' 
                        : 'bg-parking-available border-accent text-accent-foreground hover:border-accent-foreground'
                      }
                    `}
                    title={slot?.isOccupied ? `Slot ${slotNumber} - ${vehicle?.licensePlate}` : `Slot ${slotNumber} - Available`}
                  >
                    {slot?.isOccupied ? (
                      <Car className="h-3 w-3" />
                    ) : (
                      <span className="text-[10px]">{slotNumber}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Slots are assigned automatically</p>
          <p>• Hover over occupied slots to see vehicle info</p>
        </div>
      </CardContent>
    </Card>
  );
};