import React from 'react';

export default function Spinner({size=20, className=''}:{size?: number; className?: string; }) {
  return (
    <svg className={`animate-spin text-blue-600 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25 stroke-current" cx="12" cy="12" r="10" strokeWidth="4" />
      <path className="opacity-75 fill-current" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
