
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { MapPin, Target } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYmxvb2Rjb25uZWN0YXBwIiwiYSI6ImNscDNrYnRxbzAybmIyaXJ1a3Q1d3JmcnAifQ.GmQnK_XJn3-V0nKqLIbV-w';

type Marker = {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  description?: string;
  type?: 'donor' | 'center' | 'hospital' | 'emergency';
  color?: string;
};

type MapComponentProps = {
  markers?: Marker[];
  initialCenter?: [number, number];
  initialZoom?: number;
  interactive?: boolean;
  height?: string;
  width?: string;
  onMarkerClick?: (marker: Marker) => void;
  className?: string;
};

const MapComponent: React.FC<MapComponentProps> = ({
  markers = [],
  initialCenter,
  initialZoom = 12,
  interactive = true,
  height = '400px',
  width = '100%',
  onMarkerClick,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const { userLocation, getCurrentLocation, isLoading } = useLocation();
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    const center = initialCenter || (userLocation ? [userLocation.longitude, userLocation.latitude] : [-95.7129, 37.0902]);
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center as [number, number],
      zoom: initialZoom,
    });

    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } else {
      map.current.scrollZoom.disable();
      map.current.boxZoom.disable();
      map.current.dragRotate.disable();
      map.current.dragPan.disable();
      map.current.keyboard.disable();
      map.current.doubleClickZoom.disable();
      map.current.touchZoomRotate.disable();
    }

    map.current.on('load', () => {
      setMapInitialized(true);
    });

    return () => {
      markersRef.current = {};
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map center when userLocation changes and initialCenter is not provided
  useEffect(() => {
    if (!map.current || !userLocation || initialCenter) return;
    
    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      essential: true,
    });
  }, [userLocation, initialCenter]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    markers.forEach(marker => {
      // Choose color based on type
      let color = marker.color || '#3b82f6';
      if (marker.type === 'donor') color = '#ef4444';
      if (marker.type === 'center') color = '#22c55e';
      if (marker.type === 'hospital') color = '#3b82f6';
      if (marker.type === 'emergency') color = '#f97316';

      // Create HTML element for marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = color;
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.display = 'flex';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      el.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.5)';
      el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${marker.title}</strong>${marker.description ? `<p>${marker.description}</p>` : ''}`
      );
      
      // Create marker
      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      if (onMarkerClick) {
        el.addEventListener('click', () => {
          onMarkerClick(marker);
        });
      }
      
      markersRef.current[marker.id] = mapboxMarker;
    });
  }, [markers, mapInitialized, onMarkerClick]);

  const handleRecenter = async () => {
    const location = await getCurrentLocation();
    if (location && map.current) {
      map.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 14,
        essential: true,
      });
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-md" />
      
      {interactive && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute bottom-4 right-4 bg-white shadow-md z-10 flex items-center gap-1"
          onClick={handleRecenter}
          disabled={isLoading}
        >
          {isLoading ? <Target className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
          <span>My Location</span>
        </Button>
      )}
    </div>
  );
};

export default MapComponent;
