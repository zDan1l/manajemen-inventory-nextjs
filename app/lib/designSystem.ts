// ==========================================
// MODERN MINIMALIST DESIGN SYSTEM
// ==========================================
// Inspired by modern dashboard templates with soft colors and clean aesthetic

export const designTokens = {
  // COLOR PALETTE - Soft & Professional
  colors: {
    // Primary - Soft Blue (Professional & Trustworthy)
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Secondary - Soft Slate (Elegant & Modern)
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Success - Soft Emerald
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    
    // Warning - Soft Amber
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    
    // Danger - Soft Rose
    danger: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
    },
    
    // Info - Soft Cyan
    info: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
    },
    
    // Neutral - Warm Gray
    gray: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
  },
  
  // SPACING SYSTEM (4px base)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
  },
  
  // TYPOGRAPHY
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // BORDER RADIUS - Softer curves
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // SHADOWS - Subtle elevation
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },
  
  // TRANSITIONS
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Z-INDEX SCALE
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// ==========================================
// UTILITY CLASSES
// ==========================================

export const utilities = {
  // Card Styles
  card: {
    base: 'bg-white rounded-lg shadow-sm border border-gray-200',
    hover: 'hover:shadow-md transition-shadow duration-200',
    interactive: 'cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200',
  },
  
  // Page Container
  page: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6',
    header: 'mb-6 flex items-center justify-between',
    title: 'text-2xl font-semibold text-gray-900',
    section: 'space-y-6',
  },
  
  // Form Styles
  form: {
    label: 'block text-sm font-medium text-gray-700 mb-1.5',
    input: 'w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
    select: 'w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white',
    textarea: 'w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none',
    error: 'text-xs text-danger-600 mt-1',
    helper: 'text-xs text-gray-500 mt-1',
  },
  
  // Alert Styles
  alert: {
    success: 'bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-lg',
    warning: 'bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg',
    danger: 'bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg',
    info: 'bg-info-50 border border-info-200 text-info-800 px-4 py-3 rounded-lg',
  },
  
  // Badge Styles
  badge: {
    success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800',
    warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800',
    danger: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800',
    info: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-100 text-info-800',
    gray: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
  },
};

// ==========================================
// COMPONENT VARIANTS
// ==========================================

export const componentVariants = {
  // Button Variants - Modern & Soft
  button: {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm hover:shadow-md',
    success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-md',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white shadow-sm hover:shadow-md',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-sm hover:shadow-md',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  },
  
  // Table Styles - Clean & Modern
  table: {
    container: 'overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200',
    wrapper: 'overflow-x-auto',
    table: 'min-w-full divide-y divide-gray-200',
    thead: 'bg-gray-50',
    th: 'px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
    tbody: 'bg-white divide-y divide-gray-200',
    tr: 'hover:bg-gray-50 transition-colors duration-150',
    td: 'px-6 py-4 text-sm text-gray-700',
  },
};

export default designTokens;
