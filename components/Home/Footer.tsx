export function Footer() {
    return (
        <footer className="py-6 sm:py-8 lg:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-lg font-ibm-plex text-gray-900 mb-6 text-center" style={{ fontWeight: '700' }}>IPO Milega</h2>
                <div className="text-center">
                    <div className="w-full overflow-hidden text-center">
                        <p className="text-gray-600 font-ibm-plex" style={{ fontWeight: '400' }}> {new Date().getFullYear()} IPO Milega. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}   