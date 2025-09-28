import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Camera } from "lucide-react";
import { CameraCapture } from "./CameraCapture";

interface CheckInFormProps {
  onCheckIn: (licensePlate: string, imageData?: string) => void;
  availableSlots: number;
}

export const CheckInForm = ({ onCheckIn, availableSlots }: CheckInFormProps) => {
  const [licensePlate, setLicensePlate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licensePlate.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onCheckIn(licensePlate.trim(), capturedImage || undefined);
    setLicensePlate("");
    setCapturedImage(null);
    setIsSubmitting(false);
  };

  const handleCameraCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const removeCapturedImage = () => {
    setCapturedImage(null);
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
            <Label htmlFor="licensePlate">License Plate Number</Label>
            <Input
              id="licensePlate"
              type="text"
              placeholder="Enter license plate (e.g., ABC-123)"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              className="transition-smooth text-lg font-mono"
              maxLength={10}
            />
          </div>

          {/* Camera Section */}
          <div className="space-y-2">
            <Label>Vehicle Photo (Optional)</Label>
            {capturedImage ? (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured vehicle"
                  className="w-full h-32 object-cover rounded-lg border-2 border-accent"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeCapturedImage}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCamera(true)}
                className="w-full h-20 border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-all"
              >
                <Camera className="h-6 w-6 mr-2" />
                Take Vehicle Photo
              </Button>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full transition-bounce text-lg py-6" 
            disabled={!licensePlate.trim() || isSubmitting || availableSlots === 0}
          >
            {isSubmitting ? "Processing..." : availableSlots === 0 ? "Parking Full" : "Check In Vehicle"}
          </Button>
        </form>

        <CameraCapture
          isOpen={showCamera}
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      </CardContent>
    </Card>
  );
};