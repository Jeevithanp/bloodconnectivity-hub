
export type MapMarker = {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  description?: string;
  type?: 'donor' | 'center' | 'hospital' | 'emergency' | 'user';
  color?: string;
};

export type MapComponentProps = {
  markers?: MapMarker[];
  initialCenter?: [number, number];
  initialZoom?: number;
  interactive?: boolean;
  height?: string;
  width?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
  onMapLoaded?: (map: google.maps.Map) => void;
};
