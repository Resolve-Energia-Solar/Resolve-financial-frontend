import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ModalMaps({
                                    open,
                                    onClose,
                                    title,
                                    points = [], // array de { lat, lng }
                                    onConfirm,
                                    confirmText = 'Confirmar',
                                    cancelText = 'Cancelar',
                                  }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded || !points.length) {
    return null; // Carregando ou sem pontos
  }

  const center = { lat: points[0].lat, lng: points[0].lng };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ height: 500 }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={8}
        >
          <Polyline
            path={points}
            options={{
              strokeColor: '#007bff',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
          {points.map((point, index) => (
            <Marker
              key={index}
              position={{ lat: point.lat, lng: point.lng }}
              label={(index + 1).toString()}
            />
          ))}
        </GoogleMap>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button onClick={onConfirm} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
