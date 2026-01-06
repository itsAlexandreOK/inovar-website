import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Criar câmera de teste
  const camera = await prisma.camera.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'Câmera de Teste',
      rtspUrl: 'rtsp://170.84.120.142:1455/user=yutube&password=yutube20&channel=19&stream=0.sdp', // URL de teste - substitua pela sua câmera real
      pathName: 'test',
    },
  });

  console.log('Created test camera:', camera);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
