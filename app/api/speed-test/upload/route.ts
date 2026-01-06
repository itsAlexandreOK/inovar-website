import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        let totalBytes = 0;
        const reader = request.body?.getReader();
        
        if (!reader) {
            return NextResponse.json(
                { error: 'No body' },
                { status: 400 }
            );
        }
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            totalBytes += value.length;
        }
        
        return NextResponse.json({ 
            message: `Recebido ${totalBytes} bytes`,
            bytes: totalBytes 
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Erro no upload' },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
