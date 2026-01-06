import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/email-service";
import * as bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let cpf = "";
    let email = "";
    let password = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      name = body.name;
      cpf = body.cpf;
      email = body.email;
      password = body.password;
    } else {
      const form = await req.formData();
      name = String(form.get("name") || "");
      cpf = String(form.get("cpf") || "").replace(/\D/g, "");
      email = String(form.get("email") || "");
      password = String(form.get("password") || "");
    }

    if (!name || !cpf || !email || !password) {
      return NextResponse.json({ success: false, message: "Dados incompletos." }, { status: 400 });
    }

    // Verificar se já existe usuário com esse CPF ou email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ cpf }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "CPF ou email já cadastrado." },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gera código de verificação
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Salva no banco como usuário temporário
    const tempUser = await prisma.tempUser.create({
      data: {
        name,
        cpf,
        email,
        password: hashedPassword,
        verificationCode,
        expiresAt,
      },
    });

    await sendVerificationCode(email, verificationCode);

    return NextResponse.json({ success: true, message: "Código enviado.", userId: tempUser.id });
  } catch (err) {
    console.error("Erro no registro:", err);
    return NextResponse.json({ success: false, message: "Erro ao processar." }, { status: 500 });
  }
}
