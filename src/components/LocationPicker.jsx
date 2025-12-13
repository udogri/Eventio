import {
    Box,
    Input,
    Text,
  } from "@chakra-ui/react";
  import { LoadScript, Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
  import { useState } from "react";
  
  const libraries = ["places"];
  const containerStyle = {
    width: "100%",
    height: "300px",
  };
  
  export default function LocationPicker({ onSelect }) {
    const [autocomplete, setAutocomplete] = useState(null);
    const [position, setPosition] = useState(null);
    const [address, setAddress] = useState("");
  
    const onLoad = (auto) => setAutocomplete(auto);
  
    const onPlaceChanged = () => {
      if (!autocomplete) return;
  
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
  
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
  
      setAddress(place.formatted_address);
      setPosition({ lat, lng });
  
      onSelect({
        address: place.formatted_address,
        lat,
        lng,
      });
    };
  
    return (
      <Box>
        <Text mb={2} fontWeight="medium">Venue Location</Text>
  
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
          libraries={libraries}
        >
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Input placeholder="Search venue location..." mb={3} />
          </Autocomplete>
  
          {position && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={position}
              zoom={15}
            >
              <Marker position={position} />
            </GoogleMap>
          )}
        </LoadScript>
      </Box>
    );
  }
  