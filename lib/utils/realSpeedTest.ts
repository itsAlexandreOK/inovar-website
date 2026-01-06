// Teste de velocidade usando servidores reais (CDNs públicos)

const TEST_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB para teste real

const calculateSpeed = (sizeInBytes: number, timeInSeconds: number): number => {
    if (timeInSeconds === 0) return 0;
    const bits = sizeInBytes * 8;
    const bps = bits / timeInSeconds;
    return bps / 1000000; // Mbps
};

// URLs de arquivos de teste em CDNs públicos
const DOWNLOAD_TEST_URLS = [
    'https://speed.cloudflare.com/__down?bytes=10000000', // Cloudflare 10MB
    'https://proof.ovh.net/files/10Mb.dat', // OVH
    'https://bouygues.testdebit.info/10M.iso', // Bouygues Telecom
];

const testDownloadReal = async (): Promise<number> => {
    let bestSpeed = 0;
    
    // Testa com múltiplas URLs e pega a melhor
    for (const url of DOWNLOAD_TEST_URLS) {
        try {
            const startTime = performance.now();
            const response = await fetch(url, { 
                method: 'GET',
                cache: 'no-store'
            });

            if (!response.ok) continue;

            const buffer = await response.arrayBuffer();
            const endTime = performance.now();
            const durationSeconds = (endTime - startTime) / 1000;
            const size = buffer.byteLength;
            const speed = calculateSpeed(size, durationSeconds);
            
            if (speed > bestSpeed) {
                bestSpeed = speed;
            }
            
            // Se conseguiu um bom resultado, para
            if (bestSpeed > 10) break;
        } catch (error) {
            console.warn(`Falha ao testar ${url}:`, error);
            continue;
        }
    }
    
    if (bestSpeed === 0) {
        throw new Error('Não foi possível completar o teste de download');
    }
    
    return bestSpeed;
};

const testUploadReal = async (): Promise<number> => {
    // Se estiver em produção, usa o servidor real
    // Se estiver em dev, usa localhost (velocidade local)
    const uploadUrl = process.env.NODE_ENV === 'production' 
        ? 'https://seu-projeto.vercel.app/api/speed-test/upload'  // Substitua após deploy
        : '/api/speed-test/upload';
    
    const uploadData = new ArrayBuffer(TEST_FILE_SIZE_BYTES);
    
    try {
        const startTime = performance.now();
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: uploadData,
            headers: { 'Content-Type': 'application/octet-stream' }
        });

        if (!response.ok) {
            throw new Error(`Upload falhou: ${response.statusText}`);
        }

        const endTime = performance.now();
        const durationSeconds = (endTime - startTime) / 1000;
        return calculateSpeed(TEST_FILE_SIZE_BYTES, durationSeconds);
    } catch (error) {
        console.error('Erro no teste de upload:', error);
        throw error;
    }
};

interface SpeedTestResult {
    download: number;
    upload: number;
}

export async function runRealSpeedTest(): Promise<SpeedTestResult> {
    // Executa download
    const downloadSpeed = await testDownloadReal();
    
    // Executa upload
    let uploadSpeed = 0;
    try {
        uploadSpeed = await testUploadReal();
    } catch (error) {
        console.warn('Upload test failed:', error);
        // Se upload falhar, retorna 0
        uploadSpeed = 0;
    }
    
    return {
        download: downloadSpeed,
        upload: uploadSpeed,
    };
}
