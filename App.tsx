import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { persistor, store } from './src/shared/stores';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
