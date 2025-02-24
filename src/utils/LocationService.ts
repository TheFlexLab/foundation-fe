import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api/Axios';

const LocationService = () => {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (persistedUserInfo) {
      getLocation();
    }
  }, [persistedUserInfo]);

  const postLocation = async (location: string) => {
    await api.post('/location', {
      uuid: persistedUserInfo.uuid,
      location,
    });
  };

  const gotLocation = (position: GeolocationPosition) => {
    const location = `${position.coords.longitude},${position.coords.latitude}`;
    const storedLocation = localStorage.getItem('userLocation');

    if (location !== storedLocation) {
      localStorage.setItem('userLocation', location);
      postLocation(location);
      return;
    }
  };

  const failedToGet = (err: GeolocationPositionError) => {
    // console.error(err);
  };

  const getLocation = () => {
    const hasGeolocationBadge = persistedUserInfo?.badges.some(
      (badge: any) => badge.personal && badge.personal.geolocation
    );

    if (hasGeolocationBadge) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
      } else {
        console.error('Geolocation not supported');
      }
    }
  };

  return null;
};

export default LocationService;
