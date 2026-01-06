import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let userId = "";
    let code = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      userId = body.userId;
      code = body.code;
    } else {
      const form = await req.formData();
      userId = String(form.get("userId") || "");
      code = String(form.get("code") || "");
    }

    const tempUser = await prisma.tempUser.findUnique({
      where: { id: userId },
    });

    if (!tempUser) {
      return NextResponse.json({ success: false, message: "Usuário temporário não encontrado." }, { status: 404 });
    }

    if (tempUser.expiresAt < new Date()) {
      await prisma.tempUser.delete({ where: { id: userId } });
      return NextResponse.json({ success: false, message: "Código de verificação expirado." }, { status: 400 });
    }

    if (tempUser.verificationCode !== code) {
      return NextResponse.json({ success: false, message: "Código inválido." }, { status: 400 });
    }

    // Criar usuário definitivo
    await prisma.user.create({
      data: {
        name: tempUser.name,
        cpf: tempUser.cpf,
        email: tempUser.email,
        password: tempUser.password,
      },
    });

    // Remover usuário temporário
    await prisma.tempUser.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: "Código de verificação válido. Usuário criado!" });
  } catch (err) {
    console.error("Erro na verificação:", err);
    return NextResponse.json({ success: false, message: "Erro ao processar." }, { status: 500 });
  }
}
