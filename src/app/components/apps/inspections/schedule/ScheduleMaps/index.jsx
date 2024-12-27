import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import scheduleService from '@/services/scheduleService';
import { set } from 'lodash';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const ScheduleMap = ({ schedule }) => {
    const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
    const [ws, setWs] = useState(null);
    

    useEffect(() => {
        if (!ws) {
            const connectWebSocket = () => {
                const socket = new WebSocket('ws://localhost:8000/ws/location/');
                setWs(socket);

                // Evento ao conectar
                socket.onopen = () => {
                    console.log('Conexão WebSocket aberta');
                };

                // Evento ao receber mensagem
                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log('Mensagem recebida:', data);
                    if (data.type === 'location_update' && data.scheduleId === schedule.id) {
                        setCurrentPosition({ lat: data.latitude, lng: data.longitude });
                    }
                };

                // Evento ao fechar conexão
                socket.onclose = () => {
                    console.log('Conexão WebSocket fechada. Tentando reconectar...');
                    setTimeout(connectWebSocket, 3000); // Reconecta após 3 segundos
                };

                // Evento de erro
                socket.onerror = (error) => {
                    console.error('Erro no WebSocket:', error);
                };
            };

            connectWebSocket();
        }

        return () => {
            if (ws) {
                ws.close();
                setWs(null);
            }
        }
    }, [ws]);

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: Number(schedule?.latitude), lng: Number(schedule?.longitude) }}
                zoom={14}
            >
                {currentPosition.lat !== 0 && currentPosition.lng !== 0 && (
                    <Marker
                        position={currentPosition}
                        title='Agente'
                        clickable={true}
                        icon={{
                            url: '/images/maps/car.png', // URL do ícone do agente
                        }}
                    />
                )}
                <Marker
                    position={{ lat: Number(schedule?.latitude), lng: Number(schedule?.longitude) }}
                    title='Cliente'
                    clickable={true}
                    icon={{
                        url: '/images/maps/home.png', // URL do ícone da casa
                    }}
                />
            </GoogleMap>
        </LoadScript>
    );
};

export default ScheduleMap;
