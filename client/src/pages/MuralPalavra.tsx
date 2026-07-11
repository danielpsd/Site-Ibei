/*
 * Mural Palavra — Página pública dedicada
 * Exibe cultos (vídeos do YouTube), textos de apoio e materiais em PDF.
 * A publicação de conteúdo é feita exclusivamente pelo Painel Admin (/admin).
 */

import { Play, FileText, BookOpen, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MuralPalavra() {
  const { data: posts = [], isLoading } = trpc.mural.list.useQuery();

  const extractYoutubeId = (url?: string | null) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500/10 p-3 rounded-xl">
              <BookOpen className="text-green-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-display">
                Mural <span className="text-green-400">Palavra</span>
              </h1>
              <p className="text-white/60">Assista aos cultos e acesse materiais de apoio</p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-24 text-white/60">
              <Loader2 className="animate-spin mr-2" size={20} /> Carregando publicações...
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group"
                >
                  {post.youtubeUrl && extractYoutubeId(post.youtubeUrl) && (
                    <div className="relative bg-black aspect-video overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${extractYoutubeId(post.youtubeUrl)}`}
                        title={post.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {post.title}
                    </h3>

                    {post.content && (
                      <p className="text-white/70 text-sm mb-4 whitespace-pre-line">{post.content}</p>
                    )}

                    <div className="flex items-center gap-3">
                      {post.youtubeUrl && (
                        <a
                          href={post.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-full transition-colors text-sm"
                        >
                          <Play size={16} />
                          Assistir
                        </a>
                      )}

                      {post.pdfUrl && (
                        <a
                          href={post.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-full transition-colors text-sm"
                        >
                          <FileText size={16} />
                          Material
                        </a>
                      )}
                    </div>

                    <p className="text-white/50 text-xs mt-4">
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">Nenhuma postagem ainda. Volte em breve!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
