import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Redux
import { store } from './app/store';
import { Provider } from 'react-redux';

// Redux Persist
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// Tanstack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Helmet for SEO
import { HelmetProvider } from 'react-helmet-async';

import { register } from 'swiper/element/bundle';
import { BrowserRouter } from 'react-router-dom';

// register Swiper custom elements
register();

const queryClient = new QueryClient();

let persistor = persistStore(store);

const helmetContext = {};

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <HelmetProvider context={helmetContext}>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </HelmetProvider>,
  // </StrictMode>,
);

// Service Worker Registration
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/worker.js')
//       .then((reg) => console.log('Service Worker registered', reg))
//       .catch((err) => console.log('Service Worker registration failed', err));
//   });
// }
