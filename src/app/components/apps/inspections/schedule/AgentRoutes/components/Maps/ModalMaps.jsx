import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  OverlayView,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const ModalMaps = ({ open, onClose, points, apiKey }) => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [infoWindows, setInfoWindows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({ lat: -23.5505, lng: -46.6333 });
  const theme = useTheme();

  useEffect(() => {
    if (points && points.length > 0) {
      const avgLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
      const avgLng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
  }, [points]);

  const calculateMidPoint = (startLoc, endLoc) => {
    return {
      lat: (startLoc.lat() + endLoc.lat()) / 2,
      lng: (startLoc.lng() + endLoc.lng()) / 2,
    };
  };

  const calculateRoute = useCallback(() => {
    if (!points || points.length < 2 || !window.google) {
      setLoading(false);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = points.slice(1, -1).map(point => ({
      location: new window.google.maps.LatLng(point.lat, point.lng),
      stopover: true,
    }));

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(points[0].lat, points[0].lng),
        destination: new window.google.maps.LatLng(points[points.length - 1].lat, points[points.length - 1].lng),
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          // Criar InfoWindows com distância
          const legs = result.routes[0].legs;
          const infos = legs.map((leg) => {
            const mid = calculateMidPoint(leg.start_location, leg.end_location);
            return {
              position: mid,
              text: leg.distance.text,
            };
          });

          setInfoWindows(infos);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
        setLoading(false);
      }
    );
  }, [points]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const timer = setTimeout(() => {
        calculateRoute();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, calculateRoute]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Mapa com Jornada</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ position: 'relative' }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <LoadScript googleMapsApiKey={apiKey} loadingElement={<div>Carregando mapa...</div>}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {points && points.map((point, index) => (
                <Marker
                  key={`marker-${index}`}
                  position={{ lat: point.lat, lng: point.lng }}
                  label={point.title || `Ponto ${index + 1}`}
                />
              ))}

              {/* Rota desenhada */}
              {directions && <DirectionsRenderer directions={directions} />}

              {/* Distâncias com OverlayView (sem botão X) */}
              {infoWindows.map((info, index) => (
                <OverlayView
                  key={`overlay-${index}`}
                  position={info.position}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <Box
                    sx={{
                      background: theme.palette.primary.main,
                      padding: '4px 30px',
                      color: 'white',
                      borderRadius: '4px',
                      display: 'flex',
                      fontSize: '13px',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {info.text}
                  </Box>
                </OverlayView>
              ))}
            </GoogleMap>
          </LoadScript>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalMaps;
