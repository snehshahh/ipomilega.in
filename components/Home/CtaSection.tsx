import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailOpen } from "lucide-react";

export function CtaSection() {
    return (
        <section className="py-6 sm:py-8 lg:py-12">
            <div className="w-full">
                {/* Header with icon and title */}
                <div className="flex items-center gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
                    <div className="relative flex items-center justify-center">
                        <MailOpen className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900" />
                    </div>
                    
                    <div className="flex flex-col">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 font-ibm-plex" style={{ fontWeight: '700' }}>
                            Stay Ahead of the IPO Market
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base font-medium font-ibm-plex" style={{ fontWeight: '400' }}>
                            Get exclusive IPO insights, comprehensive market analysis, GMP updates, and investment opportunities
                            delivered to your inbox weekly.
                        </p>
                    </div>
                </div>

                {/* Email subscription form */}
                <div className="w-full max-w-2xl">
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 bg-background text-black font-ibm-plex"
                            style={{ fontWeight: '500' }}
                        />
                        <Button variant="default" className="font-ibm-plex" style={{ fontWeight: '500' }}>
                            Subscribe
                        </Button>
                    </div>
                    <p className="text-xs text-black/60 mt-3 font-ibm-plex" style={{ fontWeight: '400' }}>
                        Free newsletter • No spam • Unsubscribe anytime
                    </p>
                </div>
            </div>
        </section>
    );
}