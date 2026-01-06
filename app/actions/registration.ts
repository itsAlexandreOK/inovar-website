import * as bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/email-service";

export async function registerAndSendCode(formData: FormData) {
    const name = formData.get('name') as string;
    const cpf = formData.get('cpf') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    const hashedPassword = await bcrypt.hash(password, 10);
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

    try {
        const tempUser = await prisma.tempUser.create({
            data: {
                name,
                cpf,
                email,
                password: hashedPassword,
                verificationCode,
                expiresAt: expirationTime
            },
        });

        await sendVerificationCode(email, verificationCode);

        return { success: true, message: "Código de verificação enviado para o email fornecido.", userId: tempUser.id };
    } catch (error) {
        console.error('Erro ao registrar usuário temporário ou enviar email:', error);
        return { success: false, message: "Erro ao processar o registro. Tente novamente mais tarde." };
    }
}

export async function verifyRegistrationCode(userId: string, code: string) {
    const tempUser = await prisma.tempUser.findUnique({
        where: { id: userId },
    });
    
    if (!tempUser) {
        return { success: false, message: "Usuário temporário não encontrado." };
    }

    if (tempUser.expiresAt < new Date()) {
        return { success: false, message: "Código de verificação expirado." };
    }

    return { success: true, message: "Código de verificação válido." };
}