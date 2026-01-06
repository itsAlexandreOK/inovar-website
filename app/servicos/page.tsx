import Header from "@/components/Header";
import { WebRtcPlayer } from "@/components/WebRtcPlayer";

export default function Servicos() {
  return (
    <div className="min-h-screen bg-blue-600 text-zinc-900">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-6 mt-20 bg-white shadow-[8px_8px_#000]">
        <h1 className="text-4xl font-[IntroRust] tracking-tight text-zinc-950 ">Serviços</h1>
        <p className="mt-4 mb-4 max-w-2xl text-lg leading-8 text-zinc-700">
          Escolha uma das câmeras abaixo para monitoramento ao vivo:
        </p>
        <WebRtcPlayer cameraId={1} />
      </main>
    </div>
  );
}
