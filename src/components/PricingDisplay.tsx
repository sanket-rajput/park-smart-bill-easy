import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock } from "lucide-react";

export const PricingDisplay = () => {
  return (
    <Card className="parking-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-warning" />
          <CardTitle>Pricing Structure</CardTitle>
        </div>
        <CardDescription>
          Transparent and competitive parking rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="parking-card bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">First Hour</span>
            </div>
            <Badge className="bg-primary text-primary-foreground font-bold">
              $5.00
            </Badge>
          </div>
        </div>
        
        <div className="parking-card bg-secondary/50 border-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary-foreground" />
              <span className="font-medium">Additional Hours</span>
            </div>
            <Badge variant="secondary" className="font-bold">
              $2.00/hr
            </Badge>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Billing is calculated per hour (rounded up)</p>
          <p>• No maximum daily rate limit</p>
          <p>• Payment due at check-out</p>
        </div>

        <div className="parking-card bg-muted/30">
          <h4 className="font-medium text-sm mb-2">Example Calculations:</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>30 minutes:</span>
              <span className="font-medium">$5.00</span>
            </div>
            <div className="flex justify-between">
              <span>2 hours:</span>
              <span className="font-medium">$7.00</span>
            </div>
            <div className="flex justify-between">
              <span>5 hours:</span>
              <span className="font-medium">$13.00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};