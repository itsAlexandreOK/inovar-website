import Header from "@/components/Header";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-blue-600 text-zinc-900">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Sobre</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-100">
          Esta é a página "Sobre" criada via App Router.
        </p>
      </main>
    </div>
  );
}
