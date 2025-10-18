'use client';

import { useEffect } from 'react';

interface CheckoutAlertProps {
  message: string;
  onClose: () => void;
  duration?: number; // in milliseconds
}

export default function CheckoutAlert({
  message,
  onClose,
  duration = 3000,
}: CheckoutAlertProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-red-500 text-white px-6 py-3 rounded shadow-lg pointer-events-auto animate-fade-in">
        {message}
      </div>
    </div>
  );
}
