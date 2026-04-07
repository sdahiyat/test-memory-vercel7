import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white rounded-xl shadow-sm',
  bordered: 'bg-white rounded-xl shadow-sm border border-gray-200',
  elevated: 'bg-white rounded-xl shadow-md',
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(variantClasses[variant], paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardSectionProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('flex items-center justify-between mb-3 pb-3 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardSectionProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardSectionProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('mt-3 pt-3 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
