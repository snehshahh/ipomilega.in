// components/layout/Footer.tsx (example path)
"use client";

export function Footer() {
    return (
        <div className="app-container">
            <hr className="border-gray-300 w-full mx-auto" />
            <footer className="py-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-dm-serif text-gray-900 mb-2 font-bold">
                        IPO Milega
                    </h2>
                    <div className="w-full overflow-hidden">
                        <p className="text-gray-600 font-ibm-plex text-sm">
                            © {new Date().getFullYear()} IPO Milega. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}