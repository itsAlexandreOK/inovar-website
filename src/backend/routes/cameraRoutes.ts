import { Router } from 'express';
import { getWebRtcUrl, getPrisma } from 'src/backend/cameraController';

const router = Router();

// Listar todas as câmeras
router.get('/', async (req, res) => {
    try {
        const cameras = await getPrisma().camera.findMany();
        res.json(cameras);
    } catch (error) {
        console.error('Erro ao listar câmeras:', error);
        res.status(500).json({ error: 'Falha ao listar câmeras.' });
    }
});

// Obter URL WebRTC de uma câmera específica
router.get('/:id/webrtc', getWebRtcUrl);

export default router;