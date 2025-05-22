import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // This will be handled by _layout.tsx logic
  return <Redirect href="../setup" />;
}