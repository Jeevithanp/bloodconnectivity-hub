
import { useJsApiLoader } from '@react-google-maps/api';

// Define libraries array outside component to prevent reloads
const LIBRARIES: ("places")[] = ['places'];
const GOOGLE_MAPS_API_KEY = 'AIzaSyDb_UOAB9u0gH5KPzQXuavrXX-ItKm09So';

export const useGoogleMaps = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  return { isLoaded, loadError };
};
