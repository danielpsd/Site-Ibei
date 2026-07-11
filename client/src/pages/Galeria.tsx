/*
 * Galeria de Fotos — Página pública dedicada
 * Exibe fotos dos cultos e eventos. A publicação é feita exclusivamente
 * pelo Painel Admin (/admin), garantindo que o site público fique limpo
 * para quem apenas consome o conteúdo.
 */

import { Image as ImageIcon, Download, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Galeria() {
  const { data: fotos = [], isLoading } = trpc.gallery.list.useQuery();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <section className="pt-32 pb-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-yellow-500/10 p-3 rounded-xl">
              <ImageIcon className="text-yellow-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-display">
                Galeria <span className="text-yellow-400">Fotos</span>
              </h1>
              <p className="text-white/60">Fotos dos cultos e eventos da nossa comunidade</p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-24 text-white/60">
              <Loader2 className="animate-spin mr-2" size={20} /> Carregando fotos...
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {fotos.map((foto) => (
                <div
                  key={foto.id}
                  className="group relative bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
                >
                  <div className="relative bg-black aspect-square overflow-hidden">
                    <img
                      src={foto.imageUrl}
                      alt={foto.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23333' width='200' height='200'/%3E%3Ctext x='100' y='100' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EImagem não carregada%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <a
                        href={foto.imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full transition-colors"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-1 truncate">{foto.title}</h3>
                    <p className="text-white/50 text-xs">
                      {foto.photoDate
                        ? new Date(foto.photoDate).toLocaleDateString("pt-BR")
                        : new Date(foto.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && fotos.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon size={48} className="mx-auto text-white/30 mb-4" />
              <p className="text-white/60 text-lg">Nenhuma foto disponível ainda</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
