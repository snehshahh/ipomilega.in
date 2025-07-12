"use client";

import React from 'react';
import { useProgressRouter } from './useProgressRouter';

interface ProgressLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  href: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const ProgressLink = ({ href, children, className, onClick, ...props }: ProgressLinkProps) => {
  const router = useProgressRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Navigate with progress bar
    await router.push(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};