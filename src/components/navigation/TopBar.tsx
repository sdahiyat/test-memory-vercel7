'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TopBarProps {
  title: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = false,
  rightAction,
  className,
}) => {
  const router = useRouter();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm',
        className
      )}
    >
      <div className="flex items-center h-14 px-4 max-w-screen-sm mx-auto">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900">
          {title}
        </h1>
        {rightAction ? (
          <div className="w-9 flex items-center justify-end">{rightAction}</div>
        ) : (
          <div className="w-9" />
        )}
      </div>
    </header>
  );
};

export default TopBar;
