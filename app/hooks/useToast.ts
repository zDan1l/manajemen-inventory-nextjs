// app/hooks/useToast.ts
'use client';

import { useState, useCallback } from 'react';

export interface ToastState {
  isOpen: boolean;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: '',
    variant: 'info'
  });

  const showToast = useCallback((message: string, variant: ToastState['variant'] = 'info') => {
    setToast({
      isOpen: true,
      message,
      variant
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isOpen: false }));
  }, []);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  };
}
