'use client';
import React, { useEffect, useState } from 'react';
import { CardContent } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import { TimelineProvider } from '@/app/context/timelineContext';
import TimelineList from '@/app/components/apps/timeline/timelineList';

const Timeline = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [messageQueue, setMessageQueue] = useState([]); // Fila de mensagens

    useEffect(() => {
        if (!ws) {
            const connectWebSocket = () => {
                const socket = new WebSocket('ws://localhost:8000/ws/location/');
                setWs(socket);

                // Evento ao conectar
                socket.onopen = () => {
                    console.log('Conexão WebSocket aberta');
                    socket.send(JSON.stringify({ type: 'init', message: 'Cliente conectado!' }));

                    // Processa mensagens em espera
                    messageQueue.forEach((message) => {
                        socket.send(message);
                    });
                    setMessageQueue([]); // Limpa a fila após o envio
                };

                // Evento ao receber mensagem
                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log('Mensagem recebida:', data);
                    setMessages((prevMessages) => [...prevMessages, data]);
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
    }, [ws, messageQueue]);

    useEffect(() => {
        if (ws) {
            // Monitorar mudanças de localização
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    console.log('Nova posição:', { latitude, longitude });

                    const message = JSON.stringify({
                        type: 'location_update',
                        latitude,
                        longitude,
                    });

                    // Envia imediatamente se o WebSocket estiver aberto, senão adiciona à fila
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(message);
                    } else {
                        setMessageQueue((prevQueue) => [...prevQueue, message]);
                    }
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);

                    // Tratamento para erros específicos
                    if (error.code === 1) {
                        alert('Permissão de localização negada. Ative as permissões para continuar.');
                    } else if (error.code === 2) {
                        alert('Localização indisponível. Tente novamente.');
                    } else if (error.code === 3) {
                        alert('Tempo de solicitação de localização expirado.');
                    }
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000,
                }
            );

            // Cleanup para parar de monitorar a localização
            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [ws]);

    return (
        <div>
            <h1>Rastreamento de Localização</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{JSON.stringify(message)}</li>
                ))}
            </ul>
        </div>
    );
};

export default Timeline;
