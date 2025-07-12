// import { Ipo } from "@/app/models/ipo";

// // Function to extract and format price range from IPO data
// export function extractPriceRange(ipoData : Ipo) {
//     // Handle different possible price band formats
//     const priceBand = ipoData.price_band || ipoData.ipo_details?.ipo_price_band || '';
    
//     if (!priceBand) {
//       return {
//         min: 0,
//         max: 0,
//         display: 'Price not available'
//       };
//     }
  
//     // Clean the price band string
//     const cleanPrice = priceBand.toString().replace(/[₹,\s]/g, '');
    
//     // Check if it's a range (e.g., "100-150", "100 to 150", "100-150 Per Share")
//     const rangeMatch = cleanPrice.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/);
//     const toMatch = cleanPrice.match(/(\d+(?:\.\d+)?)to(\d+(?:\.\d+)?)/i);
    
//     if (rangeMatch) {
//       const min = parseFloat(rangeMatch[1]);
//       const max = parseFloat(rangeMatch[2]);
//       return {
//         min,
//         max,
//         display: `₹${min}-${max}`
//       };
//     } else if (toMatch) {
//       const min = parseFloat(toMatch[1]);
//       const max = parseFloat(toMatch[2]);
//       return {
//         min,
//         max,
//         display: `₹${min}-${max}`
//       };
//     } else {
//       // Single price (like your example: "585")
//       const singlePriceMatch = cleanPrice.match(/(\d+(?:\.\d+)?)/);
//       if (singlePriceMatch) {
//         const price = parseFloat(singlePriceMatch[1]);
//         return {
//           min: price,
//           max: price,
//           display: `₹${price}`
//         };
//       }
//     }
  
//     // Fallback if no price found
//     return {
//       min: 0,
//       max: 0,
//       display: 'Price not available'
//     };
//   }
  
//   // Updated function to calculate statistics using the new price range extraction
//   export function calculateIpoStats(ipos : Ipo[]) {
//     if (!ipos || ipos.length === 0) {
//       return {
//         totalValue: 0,
//         avgReturn: 0,
//         hotIpos: 0
//       };
//     }
  
//     const totalValue = ipos.reduce((sum, ipo) => {
//       const priceRange = extractPriceRange(ipo);
//       return sum + (priceRange.max || 0);
//     }, 0);
  
//     // Mock calculation for average return (replace with actual logic)
//     const avgReturn = Math.round(Math.random() * 20 + 10);
    
//     // Mock calculation for hot IPOs (replace with actual logic)
    
//     return {
//       totalValue: Math.round(totalValue / 1000000), // Convert to millions
//       avgReturn,
//       hotIpos
//     };
//   }
  
//   // Example usage functions
//   export function formatIpoForDisplay(ipoData : Ipo) {
//     const priceRange = extractPriceRange(ipoData);
    
//     return {
//       id: ipoData._id || ipoData._id,
//       name: ipoData.upcoming_ipo_2025 || 'Unknown IPO',
//       priceRange,
//       openDate: ipoData.open_date,
//       closingDate: ipoData.closing_date,
//       ipoType: ipoData.ipo_type,
//       ipoSize: ipoData.ipo_size,
//       listing: ipoData.ipo_details?.ipo_listing || 'N/A',
//       about: ipoData.about || '',
//       financialReport: ipoData.financial_report || [],
//       valuation: ipoData.ipo_details?.face_value || {}
//     };
//   }
  