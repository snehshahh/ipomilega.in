import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-muted/30 border">
        <CardHeader>
          <CardTitle className="text-primary text-2xl flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            Unauthorized!!
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}