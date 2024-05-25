import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [permission, setPermission] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        let watchId;

        const handlePermissionChange = (status) => {
            setPermission(status.state);
            if (status.state === 'granted' || status.state === 'prompt') {
                try {
                    watchId = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });
                } catch (error) {
                    console.error('Error watching geolocation:', error);
                    setError('Error watching geolocation');
                }
            } else if (status.state === 'denied') {
                console.error('Geolocation permission denied');
                setError('Geolocation permission denied');
            }
        };

        const onSuccess = (position) => {
            setCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setError(null);
        };

        const onError = (error) => {
            console.error('Error getting geolocation:', error);
            setError('Error getting geolocation');
        };

        const queryPermissions = async () => {
            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                handlePermissionChange(status);
                status.onchange = () => handlePermissionChange(status);
            } catch (error) {
                console.error('Error querying geolocation permissions:', error);
                setError('Error querying geolocation permissions');
            }
        };

        if ('geolocation' in navigator && 'permissions' in navigator) {
            queryPermissions();
        } else {
            console.error('Geolocation or Permissions API not supported');
            setError('Geolocation or Permissions API not supported');
        }

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    return { coordinates, permission, error };
};

export default useGeolocation;
