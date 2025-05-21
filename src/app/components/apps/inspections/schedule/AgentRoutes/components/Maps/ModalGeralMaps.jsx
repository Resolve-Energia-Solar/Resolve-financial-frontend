import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import DetailsDrawer from '@/app/components/apps/schedule/DetailsDrawer';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const ModalGeralMaps = ({ open, onClose, pointsData, apiKey }) => {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({ lat: -23.5505, lng: -46.6333 });
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);

  useEffect(() => {
    if (pointsData && pointsData.length > 0) {
      const validPoints = pointsData.filter((p) => p.address?.latitude && p.address?.longitude);
      const avgLat =
        validPoints.reduce((sum, p) => sum + parseFloat(p.address.latitude), 0) /
        validPoints.length;
      const avgLng =
        validPoints.reduce((sum, p) => sum + parseFloat(p.address.longitude), 0) /
        validPoints.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
  }, [pointsData]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Mapa com Pontos</DialogTitle>
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

          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {pointsData &&
                pointsData.map((point) => {
                  const lat = parseFloat(point.address.latitude);
                  const lng = parseFloat(point.address.longitude);
                  const id = point.id;

                  return (
                    <Marker
                      key={id}
                      position={{ lat, lng }}
                      onMouseOver={() => setHoveredMarkerId(id)}
                      onMouseOut={() => setHoveredMarkerId(null)}
                      onClick={() => {
                        setSelectedScheduleId(id);
                        setDetailsDrawerOpen(true);
                      }}
                    >
                      {hoveredMarkerId === id && (
                        <InfoWindow onCloseClick={() => setHoveredMarkerId(null)}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              boxShadow: 3,
                              backgroundColor: '#fff',
                              maxWidth: 250,
                            }}
                          >
                            <Box fontWeight="bold" fontSize="1rem" color="primary.main" mb={0.5}>
                              {point.service.name}
                            </Box>
                            <Box fontSize="0.875rem" mb={0.25}>
                              <strong>Data:</strong> {point.schedule_date}
                            </Box>
                            <Box fontSize="0.875rem" mb={0.25}>
                              <strong>Hora:</strong> {point.schedule_start_time} -{' '}
                              {point.schedule_end_time}
                            </Box>
                            <Box fontSize="0.875rem">
                              <strong>Endereço:</strong>
                              <br />
                              {point.address.complete_address}
                            </Box>
                          </Box>
                        </InfoWindow>
                      )}
                    </Marker>
                  );
                })}
            </GoogleMap>
          </LoadScript>
        </Box>

        <DetailsDrawer
          open={detailsDrawerOpen}
          onClose={() => {
            setDetailsDrawerOpen(false);
            setSelectedScheduleId(null);
          }}
          scheduleId={selectedScheduleId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalGeralMaps;
