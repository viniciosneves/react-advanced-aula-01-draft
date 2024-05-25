import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [permission, setPermission] = useState('');

    useEffect(() => {


        const handlePermissionChange = (status) => {
            setPermission(status.state);
            if (status.state === 'granted' || status.state === 'prompt') {
                navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });
            } else if (status.state === 'denied') {
                console.error('Geolocation permission denied');
            }
        };

        const onSuccess = (position) => {
            setCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        };

        const onError = (error) => {
            console.error('Error getting geolocation:', error);
        };

        navigator.permissions.query({ name: 'geolocation' }).then((status) => {
            handlePermissionChange(status);
            status.onchange = () => handlePermissionChange(status);
        });


    }, []);

    return { coordinates, permission };
};

export default useGeolocation;
