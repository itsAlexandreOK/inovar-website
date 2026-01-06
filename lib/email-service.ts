import nodemailer from 'nodemailer';

// Cria o objeto Transporter uma única vez
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true para porta 465, false para outras
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Envia um email contendo o código de verificação.
 * @param emailDestino O endereço de email para onde enviar o código.
 * @param code O código de 6 dígitos gerado.
 */
export async function sendVerificationCode(emailDestino: string, code: string): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: emailDestino,
        subject: 'Código de Verificação de Cadastro',
        
        // Conteúdo em Texto Simples (Fallback)
        text: `Seu código de verificação é: ${code}. Este código é válido por 10 minutos.`,
        
        // Conteúdo em HTML (Para uma apresentação melhor)
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #333;">Verificação de Cadastro</h2>
                <p>Obrigado por se registrar! Use o código abaixo para confirmar seu endereço de email:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #007bff; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">
                        ${code}
                    </span>
                </div>
                <p>Este código expira em 10 minutos.</p>
                <p style="font-size: 12px; color: #777;">Se você não solicitou este código, ignore este email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de verificação enviado para ${emailDestino}`);
    } catch (error) {
        console.error('Erro ao enviar email com Nodemailer:', error);
        // Em um ambiente de produção, é bom lançar um erro mais específico aqui
        throw new Error("Não foi possível enviar o código de verificação. Tente novamente.");
    }
}