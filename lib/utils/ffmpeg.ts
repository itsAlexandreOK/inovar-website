import { Camera } from '@prisma/client';

export function buildFfmpegCommand(camera: Camera): { command: string, args: string[] } {
    const mediaMtxTarget = `rtsp://127.0.0.1:8554/${camera.pathName}`;

    const args = [
        '-rtsp_transport', 'tcp',  // Force TCP para evitar problemas com UDP
        '-i', camera.rtspUrl,

        // Transcodificação vídeo
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-b:v', '500k',
        '-maxrate', '1M',
        '-bufsize', '2M',
        '-pix_fmt', 'yuv420p',
        
        // Remover áudio para evitar problemas
        '-an',
        
        // Saída
        '-f', 'rtsp',
        '-rtsp_transport', 'tcp', 
        mediaMtxTarget
    ];

    return { command: 'ffmpeg', args };
}