import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-muted/30 border">
        <CardHeader>
          <CardTitle className="text-primary text-2xl flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-green-600" />
            Oops! Caught Red-Handed!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You tried to sneak into the admin's secret lair, didn’t you? 
            This area is guarded by a dragon that only lets in users with the shiny "admin" badge!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Don’t worry, no dragons were harmed in this unauthorized adventure. 
            Maybe try logging in with the right credentials or head back to the public playground?
          </p>
          <div className="flex gap-4">
            <Button asChild className="bg-primary text-background hover:bg-primary/80">
              <Link href="/login">Login as Admin</Link>
            </Button>
            <Button asChild variant="outline" className="border text-foreground hover:bg-muted/50">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}