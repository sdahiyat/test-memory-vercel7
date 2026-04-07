import React from 'react';
import { TopBar } from '@/components/navigation';

export default function ProfilePage() {
  return (
    <>
      <TopBar title="Profile" />
      <div className="p-4">
        <p className="text-gray-500 text-sm text-center mt-8">Profile coming soon</p>
      </div>
    </>
  );
}
