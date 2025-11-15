/**
 * Format currency to Indonesian Rupiah format
 * @param value - The number or string to format
 * @param showPrefix - Whether to show "Rp" prefix (default: true)
 * @returns Formatted currency string (e.g., "Rp 1.234.567" or "1.234.567")
 */
export function formatCurrency(value: number | string, showPrefix: boolean = true): string {
  // Convert to number if string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if valid number
  if (isNaN(numValue)) {
    return showPrefix ? 'Rp 0' : '0';
  }
  
  // Format number with thousands separator (dot for Indonesian format)
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
  
  return showPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Format date to Indonesian locale string
 * @param date - The date to format (Date object or ISO string)
 * @param format - Format type: 'short', 'medium', 'long' (default: 'medium')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }
  
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  };
  
  const options = optionsMap[format];
  
  return new Intl.DateTimeFormat('id-ID', options).format(dateObj);
}

/**
 * Format percentage
 * @param value - The number to format as percentage
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "15%")
 */
export function formatPercentage(value: number | string, decimals: number = 0): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0%';
  }
  
  return `${numValue.toFixed(decimals)}%`;
}

/**
 * Format phone number to Indonesian format
 * @param phone - The phone number to format
 * @returns Formatted phone number (e.g., "0812-3456-7890")
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length <= 4) {
    return cleaned;
  } else if (cleaned.length <= 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  } else {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
}

/**
 * Truncate text with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string (e.g., "Rp 1.234.567")
 * @returns Parsed number
 */
export function parseCurrency(currencyString: string): number {
  // Remove Rp prefix, spaces, and dots
  const cleaned = currencyString.replace(/Rp\s?/g, '').replace(/\./g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
