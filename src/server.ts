import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import cors from 'cors';

// Debug: verificar se DATABASE_URL foi carregado
console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

import express from 'express';
// Lazy load para garantir que Prisma só inicia após dotenv
const cameraRoutes = require('./backend/routes/cameraRoutes').default;
const { startCleanupService } = require('./backend/services/cleanupService');

const app = express();
const PORT = 3001; 

app.use(express.json());

// Configuração CORS para dev: libera origem do app Next e responde preflight
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/api/v1/cameras', cameraRoutes);

const server = app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
    startCleanupService(); 
});

server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} já está em uso!`);
    } else {
        console.error('Erro ao iniciar servidor:', error);
    }
    process.exit(1);
});
