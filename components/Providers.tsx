// Providers - wraps all context providers
import React from 'react';

// Using Zustand stores (no additional context providers needed currently)
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};