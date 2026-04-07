import React from 'react';
import { TopBar } from '@/components/navigation';

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-4">
        <p className="text-gray-500 text-sm text-center mt-8">Dashboard coming soon</p>
      </div>
    </>
  );
}
