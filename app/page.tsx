'use client';

import Header from "@/components/Header";
import Image from "next/image";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserDefaultIcon from "@/components/svg/userDefaultIcon";
import WhatsappSendMessageButton from "@/components/Whatsapp";
import Card from "@/components/Cards";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0066FF] text-zinc-900">
      <Header />
      <main className="flex items-center gap-60 justify-center ml-40 mr-40 mt-40 mb-80">

        <section>
          <Image
            src="/comunica-net-logo.svg"
            alt="Comunica Net"
            width={800}
            height={600}
            priority
            className="h-auto w-auto"
          />
        </section>
        
        <section className="flex items-center justify-center">
          <div className="bg-white justify-center text-center p-6 shadow-[10px_10px_#000] w-[574px] h-[174px] flex flex-col items-center overflow-hidden border-3">
            <p className="text-black font-[IntroRust] text-xl">
              VENHA CONHECER OS MELHORES PLANOS <br></br> DE INTERNET FIBRA ÓTICA DA CIDADE
            </p>
            <button className="bg-amber-400 py-2 px-8 rounded-3xl border-2 font-[IntroRust] mt-5 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer">
              <span>VER PLANOS</span>
            </button>
          </div>
        </section>
      </main>

      <div>
        <WhatsappSendMessageButton>
        </WhatsappSendMessageButton>  
      </div>

      {// Seção de Cards
      }

      <section className="w-full h-dvh" style={{backgroundImage: 'url(/wave-haikei.svg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
        <div className="flex justify-center items-center flex-col gap-10">
        <div className="bg-white justify-center text-center p-6 shadow-[10px_10px_#000] w-143 h-25 flex flex-col items-center overflow-hidden border-3 mt-20">
          <p className="font-[IntroRust]"> 
            Como podemos te ajudar?
          </p>
        </div>

        <div className=" flex justify-center items-center mt-50 gap-10">

          <div className="flex flex-col gap-10 text-center">
          <div className="bg-white p-2 border-3 shadow-[8px_8px_#000]">
            <h2 className="font-[IntroRust]">
              Monitoramento de Camêras
            </h2>
          </div>
          <Card
            img="/camera.svg"
            description="Veja em tempo real as imagens capturadas pelas nossas câmeras instaladas nas praias de São Francisco do Sul e região."
            buttonText="Acessar Câmeras"
            buttonLink="/servicos#monitoramento"
            />
          </div>
          

        <div className="flex flex-col gap-10 text-center">
          <div className="bg-white p-2 border-3 shadow-[8px_8px_#000]">
            <h2 className="font-[IntroRust]">
              Planos de Internet
            </h2>
          </div>
          <Card
            img="/globe.svg"
            description="Navegue sem limites com nossos planos de internet dedicados para áreas litorâneas. Conexão rápida e estável, onde você estiver."
            buttonText="Ver Planos"
            buttonLink="/planos"
          />
          </div>

        </div>
        </div>
      </section>
    </div>
  );
}
