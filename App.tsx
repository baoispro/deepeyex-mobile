import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { persistor, store } from './src/shared/stores';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './src/shared/configs/queryClient';
import { SocketInitializer } from './src/shared/components/SocketInitializer';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <SocketInitializer />
            <AppNavigator />
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
