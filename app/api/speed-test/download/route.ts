import { NextResponse } from 'next/server';

export async function GET() {
    const TEST_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
    
    const buffer = Buffer.alloc(TEST_FILE_SIZE_BYTES, 0);
    
    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': TEST_FILE_SIZE_BYTES.toString(),
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Pragma': 'no-cache'
        }
    });
}
