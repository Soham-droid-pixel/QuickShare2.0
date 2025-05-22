import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { secureStorage } from '../utils/secureStore';

export default function RootLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!hasCheckedAuth) {
      checkAuthenticationStatus();
    }
  }, [hasCheckedAuth]);

  const checkAuthenticationStatus = async () => {
    try {
      const settings = await secureStorage.getAppSettings();
      
      if (!settings || settings.isFirstLaunch !== false) {
        // First launch - show setup
        router.replace('/setup' as any);
      } else if (settings.hasPasscode) {
        // Has passcode - show lock screen
        router.replace('/lock' as any);
      } else {
        // No passcode - go directly to home
        router.replace('/home' as any);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // On error, go to setup
      router.replace('/setup' as any);
    } finally {
      setIsLoading(false);
      setHasCheckedAuth(true);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Existing routes */}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="_sitemap" />
      
      {/* QuickShare routes */}
      <Stack.Screen name="setup" options={{ headerShown: false }} />
      <Stack.Screen name="setPasscode" options={{ headerShown: false }} />
      <Stack.Screen name="lock" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="qr" options={{ headerShown: false }} />
      <Stack.Screen name="scan" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
    </Stack>
  );
}