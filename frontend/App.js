import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './app/navigation/RootNavigator';
import { SessionProvider } from './app/context/SessionContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SessionProvider>
          <Navigation />
        </SessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
