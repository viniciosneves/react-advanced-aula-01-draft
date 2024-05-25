import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

  useEffect(() => {

    const onSuccess = (position) => {
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const onError = (error) => {
      console.error('Error getting geolocation:', error);
    };

    navigator.geolocation.watchPosition(onSuccess, onError);


  }, []);

  return { coordinates };
};

export default useGeolocation;
