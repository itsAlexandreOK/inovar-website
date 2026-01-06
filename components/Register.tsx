"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Evite importar ações de servidor diretamente em componentes client.
// Vamos chamar rotas de API para registro e verificação.
import { validateCPF } from "@/lib/utils/validateCpf";
import ArrowBackIcon from "./svg/arrowBack";

type RegistrationStep = "form" | "verifyCode" | "success";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>("form");

  const [tempUserId, setTempUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
  });

  const [verificationCode, setVerificationCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData(e.currentTarget as HTMLFormElement);
    const cpf = String(data.get("cpf") || "");

    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", { method: "POST", body: data });
      const result = await res.json();

      if (result.success && result.userId) {
        setTempUserId(result.userId);
        setStep("verifyCode");
      } else {
        setError(result.message || "Erro ao registrar. Tente novamente.");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUserId) return;

    setIsLoading(true);
    setError("");

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: tempUserId, code: verificationCode }),
    });
    const result = await res.json();

    if (result.success) {
      setStep("success");
      setTimeout(() =>
        router.push("/clientAuth"), 3000);
    } else {
      setError(result.message || "Código inválido ou expirado.");
      if (result.message?.includes("expirado")) {
        setStep("form");
      }
    }
    setIsLoading(false);
  };

  if (step === "form") {
    return (
      <>
        <button
          onClick={() => router.push('/clientAuth')}
          className="absolute top-6 left-6 bg-white p-2 shadow-[5px_5px_#000] hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 cursor-pointer"
        >
          <ArrowBackIcon />
        </button>

        <div className="bg-white w-[400px] p-8 text-center shadow-[10px_10px_#000]">

          <form onSubmit={handleRegistrationSubmit} method="post">
            <h1 className="mb-6 text-3xl font-[IntroRust]">CADASTRO</h1>

            {error && <p className="mb-4 text-red-600 font-[IntroRust]">{error}</p>}

            <label htmlFor="name" className="block mb-2 font-[IntroRust] text-sm text-gray-700 flex justify-start">
              Nome
            </label>
            <input type="text" id="name" name="name" className="border border-gray-300 p-2 w-full font-[IntroRust] mb-4 bg-gray-200" required />

            <label htmlFor="cpf" className="block mb-2 font-[IntroRust] text-sm text-gray-700 flex justify-start">
              CPF
            </label>
            <input type="text" id="cpf" name="cpf" className="border border-gray-300 p-2 w-full font-[IntroRust] mb-4 bg-gray-200" required />

            <label htmlFor="email" className="block mb-2 font-[IntroRust] text-sm text-gray-700 flex justify-start">
              Email
            </label>
            <input type="email" id="email" name="email" className="border border-gray-300 p-2 w-full font-[IntroRust] mb-4 bg-gray-200" required />

            <label htmlFor="password" className="block mb-2 font-[IntroRust] text-sm text-gray-700 flex justify-start">
              Senha
            </label>
            <input type="password" id="password" name="password" className="border border-gray-300 p-2 w-full font-[IntroRust] mb-4 bg-gray-200" required />

            <button
              type="submit"
              disabled={isLoading}
              className="font-[IntroRust] bg-amber-400 text-black px-6 py-3 border-2 border-amber-600 hover:bg-amber-500 cursor-pointer transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </>
    );
  }
  if (step === "verifyCode") {
    return (
      <div className="bg-white w-[400px] p-8 text-center shadow-[10px_10px_#000]">
        <form onSubmit={handleVerificationSubmit}>
          <h1 className="mb-6 text-3xl font-[IntroRust]">VERIFICAÇÃO DE CÓDIGO</h1>

          {error && <p className="mb-4 text-red-600 font-[IntroRust]">{error}</p>}

          <label htmlFor="verificationCode" className="block mb-2 font-[IntroRust] text-sm text-gray-700 flex justify-start">
            Código de Verificação
          </label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border border-gray-300 p-2 w-full font-[IntroRust] mb-4 bg-gray-200"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="font-[IntroRust] bg-amber-400 text-black px-6 py-3 border-2 border-amber-600 hover:bg-amber-500 cursor-pointer transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verificando..." : "Verificar"}
          </button>
        </form>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="bg-white w-[400px] p-8 text-center shadow-[10px_10px_#000]">
        <h1 className="mb-6 text-3xl font-[IntroRust]">SUCESSO!</h1>
        <p className="font-[IntroRust]">Seu cadastro foi verificado com sucesso. Redirecionando para a página de login...</p>
      </div>
    );
  }
}