import Header from "@/components/Header";

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-blue-600 text-zinc-900">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Post: {params.slug}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-100">
          Rota dinâmica usando pasta [slug]. A URL /blog/minha-materia renderiza aqui.
        </p>
      </main>
    </div>
  );
}
