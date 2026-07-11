/*
 * Mural Palavra — Teaser (Home)
 * Prévia leve da última publicação, com link para a página dedicada /mural-palavra.
 * A gestão de conteúdo (postar/remover) acontece apenas no Painel Admin.
 */

import { Link } from "wouter";
import { Play, ArrowRight, BookOpen } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MuralPalavraSection() {
  const { data: posts = [] } = trpc.mural.list.useQuery();
  const latest = posts[0];

  return (
    <section id="mural-palavra" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-3 rounded-xl">
              <BookOpen className="text-green-400" size={26} />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
                Mural <span className="text-green-400">Palavra</span>
              </h2>
              <p className="text-white/60">Assista aos cultos e acesse materiais de apoio</p>
            </div>
          </div>

          <Link href="/mural-palavra">
            <a className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 font-display text-sm shrink-0">
              Ver tudo
              <ArrowRight size={16} />
            </a>
          </Link>
        </div>

        {latest ? (
          <Link href="/mural-palavra">
            <a className="block bg-slate-800 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group max-w-2xl">
              <div className="flex flex-col sm:flex-row">
                <div className="relative bg-black w-full sm:w-64 aspect-video sm:aspect-square shrink-0 flex items-center justify-center">
                  <Play className="text-green-400 group-hover:scale-110 transition-transform" size={40} />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {latest.title}
                  </h3>
                  {latest.content && (
                    <p className="text-white/70 text-sm line-clamp-2">{latest.content}</p>
                  )}
                  <p className="text-white/50 text-xs mt-4">
                    {new Date(latest.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        ) : (
          <p className="text-white/60">Nenhuma postagem ainda. Volte em breve!</p>
        )}
      </div>
    </section>
  );
}
