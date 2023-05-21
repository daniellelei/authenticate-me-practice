// frontend/src/components/Maps/Maps.js
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const center = {
  lat: 38.9072,
  lng: 77.0369,
};

const Maps = ({ apiKey }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = useState(null)
  const spot = useSelector(state=>state.spots.singleSpot)
  
  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onUnmount={onUnmount}
        >
          <Marker 
              position={center}
              title="spot"
              icon={spot.SpotImages[0]}
              streetView={false} />
        </GoogleMap>
      )}
    </>
  );
};

export default React.memo(Maps);