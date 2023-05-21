// frontend/src/components/Maps/Maps.js
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Geocode from 'react-geocode'
const containerStyle = {
  width: '400px',
  height: '400px',
};

const center = {
  lat: 38.9072,
  lng: 77.0369,
};

const Maps = ({ apiKey }) => {


  const [map, setMap] = useState(null)
  const spot = useSelector(state=>state.spots.singleSpot)
  const address = spot.address.concat(", ", spot.city).concat(", ", spot.state)

  Geocode.setApiKey(apiKey);
  Geocode.setLanguage("en");
  Geocode.setLocationType('ROOFTOP')
  Geocode.enableDebug();

  const [currentPosition, setCurrentPosition] = useState();

  const makeMap = (e) => {
    e.preventDefault()
    Geocode.fromAddress(address).then(
      (response) => {
        const {lat, lng} = response.results[0].geometry.location 
        setCurrentPosition({lat, lng})
      },
      (error) => {
        console.error(error);
      }
    )
  }
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  
  
  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <>
      {isLoaded && <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={8}
          center={currentPosition}
          onUnmount={onUnmount}
          >
        <Marker 
              position={currentPosition}
              title="Destination"
              icon={{
                path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                fillColor: '#db8ba3',
                fillOpacity: 1,
                scale: .2,
                strokeColor: 'gold',
                strokeWeight: 2
              }}
              streetView={false} />
        </GoogleMap>}
    </>
  );
};

export default React.memo(Maps);