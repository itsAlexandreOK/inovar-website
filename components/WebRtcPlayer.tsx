'use client'

import React, { useEffect, useRef, useState } from 'react';
import Spinner from './svg/spinner';

interface WebRtcPlayerProps {
    cameraId: number;
    onCameraSelect?: (cameraId: number, cameraName: string) => void;
}

interface Camera {
    id: number;
    nome: string;
    rtspUrl: string;
    pathName: string;
    pid: number | null;
    lastAccessed: string | null;
    createdAt: string;
    updatedAt: string;
}

interface MediaMTXWebRTCReader {
    close(): void;
}

declare global {
    interface Window {
        MediaMTXWebRTCReader: any;
    }
}

const BACKEND_API_URL = 'http://localhost:3001/api/v1/cameras';
const MEDIAMTX_URL = 'http://localhost:8889';

export const WebRtcPlayer: React.FC<WebRtcPlayerProps> = ({ cameraId, onCameraSelect = () => {} }) => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<number>(0);
    const [selectedCameraName, setSelectedCameraName] = useState<string>('');
    const [userHasSelected, setUserHasSelected] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<MediaMTXWebRTCReader | null>(null);
    const [status, setStatus] = useState('Selecione uma câmera para iniciar');
    const scriptLoadedRef = useRef(false);

    // Carregar o script MediaMTXWebRTCReader uma única vez
    useEffect(() => {
        if (!userHasSelected || scriptLoadedRef.current || !selectedCameraId) return;
        
        const cameraPath = cameras.find(c => c.id === selectedCameraId)?.pathName;
        if (!cameraPath) return;
        
        const script = document.createElement('script');
        script.src = `${MEDIAMTX_URL}/${cameraPath}/reader.js`;
        script.async = true;
        script.onload = () => {
            scriptLoadedRef.current = true;
            console.log('MediaMTXWebRTCReader script loaded');
        };
        script.onerror = () => {
            console.error('Failed to load MediaMTXWebRTCReader script');
            scriptLoadedRef.current = false;
        };
        document.head.appendChild(script);
        
        return () => {
            // Limpar script ao desmontar
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
    }, [selectedCameraId, cameras, userHasSelected]);

    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const response = await fetch(BACKEND_API_URL);
                const data = await response.json();
                setCameras(data);
            } catch (error) {
                console.error("Erro ao obter lista de câmeras:", error);
            }
        };

        fetchCameras();
    }, []);

    useEffect(() => {
        if (!userHasSelected || selectedCameraId === 0) return;

        const startStreaming = async () => {
            setStatus('Solicitando URL do stream ao backend...');
            let cameraPath;

            // 1. Chamar a API do Backend para iniciar o stream FFmpeg
            try {
                const response = await fetch(`${BACKEND_API_URL}/${selectedCameraId}/webrtc`);
                const data = await response.json();
                
                if (data.error) throw new Error(data.error);
                // data.url é algo como "ws://localhost:8889/camera_1/ws"
                // Extrair o path: camera_1
                const urlMatch = data.url.match(/\/([^\/]+)\/ws$/);
                if (!urlMatch) throw new Error('Invalid URL format from backend');
                cameraPath = urlMatch[1];
                setStatus(`Stream iniciado. Conectando ao WebRTC...`);

            } catch (error) {
                console.error("Erro ao obter URL do Backend:", error);
                setStatus('ERROR: Falha ao iniciar stream via API.');
                return;
            }

            // Aguardar 2 segundos para o FFmpeg estabelecer o stream no MediaMTX
            setStatus('Aguardando stream se estabelecer...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Aguardar que o script da biblioteca tenha sido carregado
            let attempts = 0;
            while (!window.MediaMTXWebRTCReader && attempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }

            // 2. Usar MediaMTXWebRTCReader para conectar ao WHEP
            try {
                // Verificar se a biblioteca está disponível
                if (!window.MediaMTXWebRTCReader) {
                    throw new Error('MediaMTXWebRTCReader biblioteca não carregou');
                }

                setStatus('Conectando ao WebRTC...');
                
                const whepUrl = new URL(`${cameraPath}/whep`, MEDIAMTX_URL);
                
                // Fechar leitor anterior se existir
                if (readerRef.current) {
                    readerRef.current.close();
                }

                // Criar novo leitor
                readerRef.current = new window.MediaMTXWebRTCReader({
                    url: whepUrl.toString(),
                    onError: (err: string) => {
                        console.error('MediaMTX Reader Error:', err);
                        setStatus(`ERROR: ${err}`);
                        // Tentar reconectar após 5 segundos
                        setTimeout(() => {
                            setStatus('Tentando reconectar...');
                        }, 5000);
                    },
                    onTrack: (evt: RTCTrackEvent) => {
                        console.log('Track received:', evt.track.kind);
                        if (videoRef.current) {
                            console.log('Setting video source object');
                            console.log('Current video element:', videoRef.current);
                            console.log('Streams:', evt.streams);
                            
                            videoRef.current.srcObject = evt.streams[0];
                            
                            // Garantir que o elemento está pronto
                            videoRef.current.onloadedmetadata = () => {
                                console.log('Video metadata loaded');
                                setTimeout(async () => {
                                    try {
                                        console.log('Attempting play...');
                                        const playPromise = videoRef.current?.play();
                                        if (playPromise) {
                                            await playPromise;
                                            console.log('Video playing successfully');
                                            setStatus('Transmitindo vídeo com sucesso.');
                                        }
                                    } catch (e) {
                                        console.error("Erro ao tentar play:", e);
                                        // Notificar ao usuário
                                        setStatus('Vídeo pronto. Clique para reproduzir.');
                                    }
                                }, 300);
                            };
                        }
                    }
                });

            } catch (error) {
                console.error("Erro ao conectar com WebRTC:", error);
                setStatus(`ERROR: ${(error as Error).message}`);
            }
        };

        startStreaming();

        // Função de Cleanup
        return () => {
            if (readerRef.current) {
                readerRef.current.close();
                readerRef.current = null;
            }
        };
    }, [selectedCameraId, userHasSelected]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const camId = parseInt(event.target.value, 10);
        setSelectedCameraId(camId);
        setUserHasSelected(true);

        setSelectedCameraName(cameras.find(cam => cam.id === camId)?.nome || '');

        const selectedCamera = cameras.find(cam => cam.id === camId);
        if (selectedCamera) {
            onCameraSelect(selectedCamera.id, selectedCamera.nome);
        }
    }

    return (
        <div className="space-y-4">
            <select value={selectedCameraId} onChange={handleChange} className="mb-4 p-2 border border-gray-300 rounded w-full">
                <option value={0} disabled>Selecione uma câmera</option>
                {cameras.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                        {camera.nome}
                    </option>
                ))}
            </select>
            
            {userHasSelected && selectedCameraId > 0 && (
                <div className="p-4 border border-gray-300 rounded bg-black flex flex-col items-center">
                    <div className="mb-2 flex flex-col text-center justify-center items-center uppercase font-bold text-zinc-300 bg-gray-800 px-4 py-2 w-full">
                        <h3>Camera: {selectedCameraName} <br /> Status: {status}</h3>
                    </div>
                    {status !== 'Transmitindo vídeo com sucesso.' && (
                        <div className="flex justify-center items-center py-8">
                            <Spinner />
                        </div>
                    )}
                    <video 
                        ref={videoRef} 
                        playsInline
                        muted 
                        crossOrigin="anonymous"
                        style={{ 
                            width: '100%', 
                            maxWidth: '640px', 
                            background: '#000', 
                            minHeight: '400px',
                            display: status === 'Transmitindo vídeo com sucesso.' ? 'block' : 'none'
                        }} 
                        controls 
                    />
                </div>
            )}
        </div>
    );
};