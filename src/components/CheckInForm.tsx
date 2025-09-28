import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

interface CheckInFormProps {
  onCheckIn: (licensePlate: string) => void;
  availableSlots: number;
}

export const CheckInForm = ({ onCheckIn, availableSlots }: CheckInFormProps) => {
  const [licensePlate, setLicensePlate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licensePlate.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onCheckIn(licensePlate.trim());
    setLicensePlate("");
    setIsSubmitting(false);
  };

  return (
    <Card className="parking-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LogIn className="h-5 w-5 text-primary" />
          <CardTitle>Vehicle Check-In</CardTitle>
        </div>
        <CardDescription>
          Register your vehicle to start parking • {availableSlots} slots available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input
              id="licensePlate"
              type="text"
              placeholder="Enter license plate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              className="transition-smooth"
              maxLength={10}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full transition-bounce" 
            disabled={!licensePlate.trim() || isSubmitting || availableSlots === 0}
          >
            {isSubmitting ? "Processing..." : availableSlots === 0 ? "Parking Full" : "Check In Vehicle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};