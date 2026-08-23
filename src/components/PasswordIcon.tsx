import React from 'react';

export const PasswordIcon = ({ className = '' }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="38" 
    height="16" 
    viewBox="0 0 52 22" 
    fill="none"
    className={className}
  >
    <rect x="1.5" y="1.5" width="49" height="19" rx="4" stroke="currentColor" strokeWidth="2.5" />
    <path d="M12 7v8M8 11h8M9 8l6 6M9 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 7v8M18 11h8M19 8l6 6M19 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 7v8M28 11h8M29 8l6 6M29 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 7v8M38 11h8M39 8l6 6M39 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
