import { Toaster } from 'sonner';
import { Router } from './routes/router';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initFacebookPixel } from './utils/facebookPixel';
import { useLocation } from 'react-router-dom';
import api from './services/api/Axios';
import FallbackLoading from './components/FallbackLoading';
import { MaintenanceRouter } from './routes/maintenance';
import ReactGA from 'react-ga4';
import LocationService from './utils/LocationService';
const TRACKING_ID = 'G-3TVZ4YD2FG';

function App() {
  const location = useLocation();
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const [isLoading, setIsLoading] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ hitType: 'pageview', page: '/', title: 'Landing Page' });

    initFacebookPixel();
  }, [location]);

  // Handle
  useEffect(() => {
    const handlePreloadError = () => {
      window.location.reload();
    };
    window.addEventListener('vite:preloadError', handlePreloadError);

    return () => {
      window.removeEventListener('vite:preloadError', handlePreloadError);
    };
  }, []);

  // To Handle Light and DarkMode Theme
  useEffect(() => {
    if (persistedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [persistedTheme]);

  api.interceptors.response.use(
    function (response) {
      setIsMaintenance(false);
      return response;
    },
    function (error) {
      if (error.response.request.status === 503) {
        setIsMaintenance(true);
      } else {
        setIsMaintenance(false);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-dvh overflow-hidden">
      <LocationService />
      <Helmet>
        <script>
          {`
            window.prerenderReady = false;
          `}
        </script>
        <title>Foundation</title>
        <meta name="description" content="A revolutionary new social platform. Own your data. Get rewarded." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Foundation" />
        <meta property="og:description" content="A revolutionary new social platform. Own your data. Get rewarded." />
        <meta property="og:image" content="https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Foundation" />
        <meta
          property="twitter:description"
          content="A revolutionary new social platform. Own your data. Get rewarded."
        />
        <meta property="twitter:image" content="https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png" />
      </Helmet>
      {/* <MaintenanceRouter /> */}
      <div className="relative">
        <Router />
        {isLoading && !location.pathname.includes('/embed') && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
            <FallbackLoading />
          </div>
        )}
      </div>
      <Toaster
        position="top-right"
        expand={true}
        // theme={persistedTheme === 'dark' ? 'dark' : 'light'}
        richColors
      />
    </div>
  );
}

export default App;
