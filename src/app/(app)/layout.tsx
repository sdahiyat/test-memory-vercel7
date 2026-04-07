import React from 'react';
import { BottomNav } from '@/components/navigation';
import { ToastProvider } from '@/components/ui';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-screen-sm mx-auto relative">
        <main className="flex-1 pb-20 pt-0">{children}</main>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
