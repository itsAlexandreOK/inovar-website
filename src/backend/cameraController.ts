import { spawn } from 'child_process';
import { Request, Response } from 'express';
import { buildFfmpegCommand } from '../../lib/utils/ffmpeg';

// Lazy load prisma para garantir que DATABASE_URL esteja disponível
let prisma: any;
export function getPrisma() {
    if (!prisma) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL not found in environment');
        }
        const { PrismaClient } = require('@prisma/client');
        const { PrismaPg } = require('@prisma/adapter-pg');
        const { Pool } = require('pg');
        
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}

const MEDIA_MTX_WS_IP = 'ws://localhost:8889'; // Usando localhost para testes Docker

// Helper para verificar se o PID está ativo
function isProcessActive(pid: number): boolean {
    try {
        process.kill(pid, 0); 
        return true;
    } catch (e: any) {
        return e.code === 'EPERM'; 
    }
}

export async function stopStream(cameraId: number) {
    // Implementação detalhada para matar o PID e limpar o DB (definida no passo anterior)
    const camera = await getPrisma().camera.findUnique({ where: { id: cameraId } });
    
    if (camera && camera.pid) {
        try {
            process.kill(camera.pid, 'SIGTERM'); 
        } catch (e: any) {
            if (e.code !== 'ESRCH') { console.warn(`Erro ao encerrar PID ${camera.pid}:`, e); }
        } finally {
            await getPrisma().camera.update({ where: { id: cameraId }, data: { pid: null, lastAccessed: null } });
        }
    }
}

export async function getWebRtcUrl(req: Request, res: Response) {
    const cameraId = parseInt(req.params.id, 10);
    
    try {
        const camera = await getPrisma().camera.findUniqueOrThrow({ where: { id: cameraId } });
        const webRtcUrl = `${MEDIA_MTX_WS_IP}/${camera.pathName}/ws`;

        if (camera.pid && isProcessActive(camera.pid)) {
            // Atualiza apenas o timestamp de acesso (heartbeat)
            await getPrisma().camera.update({ where: { id: cameraId }, data: { lastAccessed: new Date() } });
            return res.json({ url: webRtcUrl, status: 'Active' });
        }

        // INICIAR FFmpeg
        const { command, args } = buildFfmpegCommand(camera);
        console.log(`[FFmpeg] Iniciando para ${camera.pathName}:`, command, args.join(' '));
        const child = spawn(command, args, { detached: false, stdio: ['ignore', 'pipe', 'pipe'] });

        // Log de saída do FFmpeg
        child.stdout?.on('data', (data) => {
            console.log(`[FFmpeg ${camera.pathName}] stdout:`, data.toString());
        });
        
        child.stderr?.on('data', (data) => {
            console.log(`[FFmpeg ${camera.pathName}] stderr:`, data.toString());
        });

        // Tratamento de erro
        child.on('error', (err) => {
            console.error(`[FFmpeg] Falha ao iniciar para ${camera.pathName}:`, err);
        });
        
        child.on('exit', (code, signal) => {
            console.log(`[FFmpeg] Processo encerrado para ${camera.pathName}. Code: ${code}, Signal: ${signal}`);
            // Limpar PID do banco quando o processo terminar
            getPrisma().camera.update({
                where: { id: cameraId },
                data: { pid: null }
            }).catch((e: any) => console.error('Erro ao limpar PID:', e));
        });

        await getPrisma().camera.update({
            where: { id: cameraId },
            data: { pid: child.pid, lastAccessed: new Date() }
        });
        
        return res.json({ url: webRtcUrl, status: 'Starting' });

    } catch (error) {
        return res.status(500).json({ error: 'Falha ao iniciar ou obter stream.' });
    }
}