"use client";

import { signIn } from "next-auth/react";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from "@/components/svg/arrowBack";

export default function ClientAuthPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      cpf,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Falha no login. Verifique suas credenciais e tente novamente.");
    } else {
      router.push(result?.url || "/clientAuth");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 bg-white p-2 shadow-[5px_5px_#000] hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 cursor-pointer"
      >
        <ArrowBackIcon />
      </button>
      <form onSubmit={handleLoginSubmit}>
        <div id="signInForm" className="bg-white w-[400px] p-8 text-center shadow-[10px_10px_#000]">
          <h1 className="mb-6 text-3xl font-[IntroRust]">Área do Cliente</h1>
          {error && <p className="mb-6 text-red-600 font-[IntroRust]">{error}</p>}
          <div className="flex flex-col gap-2">
            <label htmlFor="cpf" className="block font-[IntroRust] text-sm text-gray-700 flex justify-start"> CPF </label>
            <input
              type="text"
              maxLength={11}
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/[^\d]/g, ''))}
              className="border border-gray-300 p-2 w-full font-[IntroRust] mb-2 bg-gray-200"
              placeholder="Digite seu CPF"
              required
            />
            <label htmlFor="password" className="block font-[IntroRust] text-sm text-gray-700 flex justify-start"> Senha </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full font-[IntroRust] mb-4 bg-gray-200"
              placeholder="Digite sua senha"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="font-[IntroRust] bg-blue-600 text-white px-6 py-3 border-2 border-blue-800 hover:bg-blue-500 cursor-pointer transition-colors"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

            <div className="mt-4 flex justify-center items-center gap-2">
              <h6 className="font-[IntroRust]">Não tem uma conta?</h6>
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="font-[IntroRust] text-amber-500 underline hover:text-amber-600 cursor-pointer"
              >
                Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}