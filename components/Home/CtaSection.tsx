import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailOpen } from "lucide-react";

export function CtaSection() {
    return (
        <div style={{
            background: `
  linear-gradient(135deg, 
    rgba(224, 242, 254, 1) 0%,      /* Very light blue, top-left */
    rgba(191, 230, 255, 1) 30%,     /* Slightly deeper sky blue */
    rgba(255, 255, 255, 0.7) 60%,  /* Hint of white, semi-transparent */
    rgba(173, 216, 230, 1) 80%,     /* Muted blue */
    rgba(240, 248, 255, 1) 100%     /* Alice Blue, bottom-right */
  )
`
        }}>
            <section className="py-10 sm:py-16 lg:py-24" >

                {/* Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div className="text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-2 font-ibm-plex">
                                <div className="flex items-center justify-center sm:justify-start gap-2 lg:gap-3">
                                    <MailOpen className="w-8 h-8 text-gray-600 font-ibm-plex" />
                                    <div>
                                        <div>Stay Updated with IPOs</div>
                                        <div className="text-gray-600 mt-2 font-ibm-plex text-sm sm:text-base font-medium">Get exclusive IPO insights, comprehensive market analysis, GMP updates, and investment opportunities delivered to your inbox weekly.</div>
                                    </div>
                                </div>
                            </h2>
                        </div>
                    </div>
                    <div className="flex mt-3 gap-2 ml-10 lg:ml-12">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="max-w-md bg-background text-black font-ibm-plex"
                            style={{ fontWeight: '500' }}
                        />
                        <Button variant="default" className="font-ibm-plex" style={{ fontWeight: '500' }}>
                            Subscribe
                        </Button>
                    </div>
                </div>
            </section>
            <hr className="border-black  w-[100%] mx-auto" />
            <footer className="py-1 sm:py-1 lg:py-2">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-dm-serif text-gray-900 mb-2 text-center" style={{ fontWeight: '700' }}>IPO Milega</h2>
                    <div className="text-center">
                        <div className="w-full overflow-hidden text-center">
                            <p className="text-gray-600 font-ibm-plex" style={{ fontWeight: '400' }}> {new Date().getFullYear()} IPO Milega. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}