import React from 'react';

export default function Skeleton({ className='' }:{ className?: string; }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-700/40 ${className}`} />;
}

export function TextSkeleton({ lines = 3, className='' }:{ lines?: number; className?: string; }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({length: lines}).map((_,i)=>(
        <Skeleton key={i} className={`h-3 ${i===0 ? 'w-3/4' : i===lines-1 ? 'w-5/6' : 'w-full'}`} />
      ))}
    </div>
  );
}
