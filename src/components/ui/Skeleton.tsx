import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, width, height }) => {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  );
};

export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return <Skeleton className={cn('rounded-full', sizeClasses[size])} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={cn('w-full h-32 rounded-xl', className)} />;
};

export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={cn('h-10 w-24 rounded-lg', className)} />;
};

export default Skeleton;
