import { Ipo } from "@/app/models/ipo";

function parseIPODate(dateString: string): Date {
  if (!dateString || dateString.toLowerCase().includes('tba') || dateString.toLowerCase().includes('soon')) {
    return new Date('1900-01-01'); // Far past date for TBA dates
  }

  const currentYear = new Date().getFullYear();
  let cleanDate = dateString.trim();

  // Handle date ranges like "12-16 Jun" - take the first date
  if (cleanDate.includes('-') && !cleanDate.includes(',')) {
    const parts = cleanDate.split('-');
    if (parts.length === 2) {
      const firstDate = parts[0].trim();
      const monthPart = parts[1].trim();
      cleanDate = `${firstDate} ${monthPart}`;
    }
  }

  // Month name mapping
  const monthMap: { [key: string]: number } = {
    'jan': 0, 'january': 0,
    'feb': 1, 'february': 1,
    'mar': 2, 'march': 2,
    'apr': 3, 'april': 3,
    'may': 4,
    'jun': 5, 'june': 5,
    'jul': 6, 'july': 6,
    'aug': 7, 'august': 7,
    'sep': 8, 'september': 8,
    'oct': 9, 'october': 9,
    'nov': 10, 'november': 10,
    'dec': 11, 'december': 11
  };

  try {
    // Try parsing as-is first (for formats like "June 12, 2025")
    let parsedDate = new Date(cleanDate);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    // Handle formats like "12 June" or "12 Jun"
    const dayMonthPattern = /^(\d{1,2})\s+(\w+)$/i;
    const dayMonthMatch = cleanDate.match(dayMonthPattern);
    
    if (dayMonthMatch) {
      const day = parseInt(dayMonthMatch[1], 10);
      const monthName = dayMonthMatch[2].toLowerCase();
      const month = monthMap[monthName];
      
      if (month !== undefined && day >= 1 && day <= 31) {
        // Since these are IPO dates and typically future events, use 2025 as the base year
        const baseYear = 2025;
        parsedDate = new Date(baseYear, month, day);
        
        // Only move to next year if the date is significantly in the past (more than 6 months ago)
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        
        if (parsedDate < sixMonthsAgo) {
          parsedDate = new Date(baseYear + 1, month, day);
        }
        
        return parsedDate;
      }
    }

    // Handle formats like "June 12" or "Jun 12"
    const monthDayPattern = /^(\w+)\s+(\d{1,2})$/i;
    const monthDayMatch = cleanDate.match(monthDayPattern);
    
    if (monthDayMatch) {
      const monthName = monthDayMatch[1].toLowerCase();
      const day = parseInt(monthDayMatch[2], 10);
      const month = monthMap[monthName];
      
      if (month !== undefined && day >= 1 && day <= 31) {
        // Since these are IPO dates and typically future events, use 2025 as the base year
        const baseYear = 2025;
        parsedDate = new Date(baseYear, month, day);
        
        // Only move to next year if the date is significantly in the past (more than 6 months ago)
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        
        if (parsedDate < sixMonthsAgo) {
          parsedDate = new Date(baseYear + 1, month, day);
        }
        
        return parsedDate;
      }
    }

    // If all parsing fails, return a far past date
    return new Date('1900-01-01');
  } catch (error) {
    console.warn(`Failed to parse date: ${dateString}`, error);
    return new Date('1900-01-01');
  }
}

/**
 * Sorts IPOs by opening date in descending order (newest first)
 * IPOs with invalid or TBA dates will be placed at the end
 */
export function sortIPOsByOpeningDate(ipos: Ipo[], order: 'asc' | 'desc' = 'desc'): Ipo[] {
  return [...ipos].sort((a, b) => {
    const dateA = parseIPODate(a.open_date || '');
    const dateB = parseIPODate(b.open_date || '');
    
    // Handle TBA dates (dates set to 1900-01-01)
    const isTBAA = dateA.getFullYear() === 1900;
    const isTBAB = dateB.getFullYear() === 1900;
    
    // If both are TBA, maintain original order
    if (isTBAA && isTBAB) return 0;
    
    // TBA dates go to the end regardless of sort order
    if (isTBAA) return 1;
    if (isTBAB) return -1;
    
    // Sort valid dates
    if (order === 'desc') {
      return dateB.getTime() - dateA.getTime(); // Newest first
    } else {
      return dateA.getTime() - dateB.getTime(); // Oldest first
    }
  });
}

/**
 * Sorts IPOs by closing date in descending order (newest first)
 * IPOs with invalid or TBA dates will be placed at the end
 */
export function sortIPOsByClosingDate(ipos: Ipo[], order: 'asc' | 'desc' = 'desc'): Ipo[] {
  return [...ipos].sort((a, b) => {
    const dateA = parseIPODate(a.closing_date || '');
    const dateB = parseIPODate(b.closing_date || '');
    
    // Handle TBA dates
    const isTBAA = dateA.getFullYear() === 1900;
    const isTBAB = dateB.getFullYear() === 1900;
    
    if (isTBAA && isTBAB) return 0;
    if (isTBAA) return 1;
    if (isTBAB) return -1;
    
    if (order === 'desc') {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });
}

/**
 * Filters and sorts IPOs by date range
 */
export function filterIPOsByDateRange(
  ipos: Ipo[], 
  startDate: Date, 
  endDate: Date, 
  dateField: 'open_date' | 'closing_date' = 'open_date'
): Ipo[] {
  return ipos.filter(ipo => {
    const ipoDate = parseIPODate(ipo[dateField] || '');
    return ipoDate.getFullYear() !== 1900 && 
           ipoDate >= startDate && 
           ipoDate <= endDate;
  });
}

/**
 * Gets IPOs that are currently open for subscription
 */
export function getCurrentlyOpenIPOs(ipos: Ipo[]): Ipo[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  
  return ipos.filter(ipo => {
    const openDate = parseIPODate(ipo.open_date || '');
    const closeDate = parseIPODate(ipo.closing_date || '');
    
    // Skip TBA dates
    if (openDate.getFullYear() === 1900 || closeDate.getFullYear() === 1900) {
      return false;
    }
    
    return openDate <= today && closeDate >= today;
  });
}

/**
 * Gets upcoming IPOs (opening date is in the future)
 */
export function getUpcomingIPOs(ipos: Ipo[]): Ipo[] {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of day
  
  return ipos.filter(ipo => {
    const openDate = parseIPODate(ipo.open_date || '');
    return openDate.getFullYear() !== 1900 && openDate > today;
  });
}