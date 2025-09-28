import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, Receipt, LogOut } from "lucide-react";
import { format } from "date-fns";

interface Vehicle {
  id: string;
  licensePlate: string;
  checkInTime: Date;
  slotNumber: number;
}

interface BillCalculation {
  duration: number;
  firstHour: number;
  additionalHours: number;
  additionalCost: number;
  total: number;
}

interface ParkedVehiclesProps {
  vehicles: Vehicle[];
  onCheckOut: (vehicleId: string) => void;
  calculateBill: (checkInTime: Date) => BillCalculation;
}

export const ParkedVehicles = ({ vehicles, onCheckOut, calculateBill }: ParkedVehiclesProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBill, setShowBill] = useState(false);

  const handleCheckOutClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBill(true);
  };

  const confirmCheckOut = () => {
    if (selectedVehicle) {
      onCheckOut(selectedVehicle.id);
      setShowBill(false);
      setSelectedVehicle(null);
    }
  };

  const formatDuration = (checkInTime: Date) => {
    const now = new Date();
    const durationMs = now.getTime() - checkInTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  };

  const billData = selectedVehicle ? calculateBill(selectedVehicle.checkInTime) : null;

  return (
    <>
      <Card className="parking-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <CardTitle>Currently Parked Vehicles</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              {vehicles.length} vehicles
            </Badge>
          </div>
          <CardDescription>
            Manage parked vehicles and process check-outs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No vehicles currently parked</p>
              <p className="text-sm">Vehicles will appear here when checked in</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="parking-card border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono text-base px-3 py-1">
                          {vehicle.licensePlate}
                        </Badge>
                        <Badge className="bg-parking-occupied text-parking-occupied-foreground">
                          Slot {vehicle.slotNumber}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Checked in: {format(vehicle.checkInTime, "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {formatDuration(vehicle.checkInTime)}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCheckOutClick(vehicle)}
                      className="transition-smooth hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Check Out
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Dialog */}
      <Dialog open={showBill} onOpenChange={setShowBill}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Parking Bill
            </DialogTitle>
            <DialogDescription>
              Bill for vehicle {selectedVehicle?.licensePlate}
            </DialogDescription>
          </DialogHeader>
          
          {billData && selectedVehicle && (
            <div className="space-y-4">
              <div className="parking-card bg-muted/30">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Check-in time:</span>
                    <span className="font-mono">
                      {format(selectedVehicle.checkInTime, "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out time:</span>
                    <span className="font-mono">
                      {format(new Date(), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total duration:</span>
                    <span>{billData.duration} hour{billData.duration !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Rate Breakdown:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>First hour:</span>
                    <span>${billData.firstHour.toFixed(2)}</span>
                  </div>
                  {billData.additionalHours > 0 && (
                    <div className="flex justify-between">
                      <span>Additional {billData.additionalHours} hour{billData.additionalHours !== 1 ? 's' : ''} @ $2/hour:</span>
                      <span>${billData.additionalCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-1 flex justify-between font-bold text-base">
                    <span>Total Amount:</span>
                    <span className="text-primary">${billData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowBill(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmCheckOut} className="flex-1">
                  Process Check-Out
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};