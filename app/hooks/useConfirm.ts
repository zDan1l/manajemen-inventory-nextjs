// app/hooks/useConfirm.ts
'use client';

import { useState, useCallback } from 'react';

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  variant: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'warning',
    onConfirm: () => {}
  });

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    variant: ConfirmState['variant'] = 'warning'
  ) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      variant,
      onConfirm
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    confirmState.onConfirm();
    hideConfirm();
  }, [confirmState, hideConfirm]);

  return {
    confirmState,
    showConfirm,
    hideConfirm,
    handleConfirm
  };
}
