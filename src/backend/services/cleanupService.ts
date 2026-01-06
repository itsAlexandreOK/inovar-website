import { stopStream } from 'src/backend/cameraController'; 

// Lazy load prisma para garantir que DATABASE_URL esteja disponível
let prisma: any;
function getPrisma() {
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

const INACTIVITY_THRESHOLD_MINUTES = 5; 
const CLEANUP_INTERVAL_MS = 60 * 1000; 

async function runCleanup() {
    console.log(`\n[CLEANUP] Executando rotina de limpeza...`);

    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - INACTIVITY_THRESHOLD_MINUTES);

    try {
        const staleCameras = await getPrisma().camera.findMany({
            where: {
                pid: { not: null }, 
                lastAccessed: { lt: threshold }, 
            },
            select: { id: true, pathName: true, pid: true }
        });

        if (staleCameras.length === 0) { return; }

        console.log(`[CLEANUP] Encontradas ${staleCameras.length} streams inativas para encerrar.`);

        for (const camera of staleCameras) {
            await stopStream(camera.id); 
        }

    } catch (error) {
        console.error('[CLEANUP] Erro fatal na rotina de limpeza:', error);
    }
}

export function startCleanupService() {
    runCleanup();
    setInterval(runCleanup, CLEANUP_INTERVAL_MS);
    console.log(`[SERVICE] Cleanup Service iniciado.`);
}