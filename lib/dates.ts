import { Ipo } from "@/app/models/ipo";

function parseIPODate(dateString: string): Date {
  if (!dateString || dateString.toLowerCase().includes('t')) {
    return new Date('1900-01-01'); // Fallback for TBA or invalid dates
  }

  const cleanDate = dateString.trim();

  // Month name mapping
  const monthMap: { [key: string]: number } = {
    'jan': 1, 'january': 1,
    'feb': 2, 'february': 2,
    'mar': 3, 'march': 3,
    'apr': 4, 'april': 4,
    'may': 5,
    'jun': 6, 'june': 6,
    'jul': 7, 'july': 7,
    'aug': 8, 'august': 8,
    'sep': 9, 'september': 9,
    'oct': 10, 'october': 10,
    'nov': 11, 'november': 11,
    'dec': 12, 'december': 12
  };

  try {
    // Handle date ranges like "12-16 Jun" - take the first date
    let day = 1;
    let month = 1;
    if (cleanDate.includes('-')) {
      const parts = cleanDate.split('-').map(part => part.trim());
      if (parts.length === 2) {
        const firstDate = parts[0];
        const monthPart = parts[1].toLowerCase();
        if (monthMap[monthPart]) {
          day = parseInt(firstDate, 10);
          month = monthMap[monthPart];
        }
      }
    } else {
      // Handle formats like "12 June" or "9 June"
      const dayMonthPattern = /^(\d{1,2})\s+(\w+)$/i;
      const dayMonthMatch = cleanDate.match(dayMonthPattern);
      
      if (dayMonthMatch) {
        day = parseInt(dayMonthMatch[1], 10);
        const monthName = dayMonthMatch[2].toLowerCase();
        month = monthMap[monthName] || 1;
      }

      // Handle formats like "June 12" or "Jun 12"
      const monthDayPattern = /^(\w+)\s+(\d{1,2})$/i;
      const monthDayMatch = cleanDate.match(monthDayPattern);
      
      if (monthDayMatch) {
        const monthName = monthDayMatch[1].toLowerCase();
        day = parseInt(monthDayMatch[2], 10);
        month = monthMap[monthName] || 1;
      }
    }

    // Assign a dummy year (2000) since we only sorting by month and day
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return new Date(2000, month - 1, day);
    }

    return new Date('1900-01-01');
  } catch (error) {
    console.warn(`Failed to parse date: ${dateString}`, error);
    return new Date('1900-01-01');
  }
}

/**
 * Sorts IPOs by opening date in descending order (newest first within the year)
 * IPOs with invalid or TBA dates will be placed at the end
 */
export function sortIPOsByOpeningDate(ipos: Ipo[], order: 'asc' | 'desc' = 'desc'): Ipo[] {
  return [...ipos].sort((a, b) => {
    const dateA = parseIPODate(a.open_date || '');
    const dateB = parseIPODate(b.open_date || '');
    
    // Handle TBA dates
    const isTBAA = dateA.getFullYear() === 1900;
    const isTBAB = dateB.getFullYear() === 1900;
    
    if (isTBAA && isTBAB) return 0;
    if (isTBAA) return 1;
    if (isTBAB) return -1;
    
    // Sort valid dates
    if (order === 'desc') {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });
}

/**
 * Sorts IPOs by closing date in descending order
 */
export function sortIPOsByClosingDate(ipos: Ipo[], order: 'asc' | 'desc' = 'desc'): Ipo[] {
  return [...ipos].sort((a, b) => {
    const dateA = parseIPODate(a.closing_date || '');
    const dateB = parseIPODate(b.closing_date || '');
    
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
    const ipoDate = parseIPODate(ipo[dateField]);
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
  today.setHours(0, 0, 0, 0);
  
  return ipos.filter(ipo => {
    const openDate = parseIPODate(ipo.open_date || '');
    const closeDate = parseIPODate(ipo.closing_date || '');
    
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
  today.setHours(23, 59, 59, 999);
  
  return ipos.filter(ipo => {
    const openDate = parseIPODate(ipo.open_date || '');
    return openDate.getFullYear() !== 1900 && openDate > today;
  });
}