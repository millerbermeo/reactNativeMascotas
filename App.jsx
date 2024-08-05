import React from 'react';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/components/AuthContext';

export default function App() {
  return <AuthProvider>
    <Navigation />
  </AuthProvider>;
}
