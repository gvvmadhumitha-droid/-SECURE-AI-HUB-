import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, hover = true, padding = "p-6" }) => {
  return (
    <div className={twMerge(
      "bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300",
      hover && "hover:shadow-md hover:-translate-y-0.5",
      padding,
      className
    )}>
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'gray', className }) => {
  const variants = {
    red: "bg-red-100 text-red-700 border-red-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    green: "bg-green-100 text-green-700 border-green-200",
    teal: "bg-primary/10 text-primary border-primary/20",
    purple: "bg-accent/10 text-accent border-accent/20",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span className={twMerge(
      "px-3 py-1 rounded-full text-xs font-semibold border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
