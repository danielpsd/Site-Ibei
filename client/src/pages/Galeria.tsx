/*
 * Galeria de Fotos — Página pública dedicada
 * Exibe fotos dos cultos e eventos, agrupadas em álbuns (quando enviadas juntas
 * pelo painel admin). A publicação é feita exclusivamente pelo Painel Admin (/admin).
 */

import { useState } from "react";
import { Image as ImageIcon, Download, Loader2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Foto = {
  id: number;
  title: string;
  imageUrl: string;
  photoDate?: string | null;
  albumId?: string | null;
  createdAt: string | Date;
};

function groupIntoAlbums(fotos: Foto[]): Foto[][] {
  const grupos = new Map<string, Foto[]>();
  for (const foto of fotos) {
    const chave = foto.albumId || `single-${foto.id}`;
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave)!.push(foto);
  }
  return Array.from(grupos.values());
}

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23333' width='200' height='200'/%3E%3Ctext x='100' y='100' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EImagem não carregada%3C/text%3E%3C/svg%3E";

export default function Galeria() {
  const { data: fotos = [], isLoading } = trpc.gallery.list.useQuery();
  const [albumAberto, setAlbumAberto] = useState<Foto[] | null>(null);

  const albuns = groupIntoAlbums(fotos as Foto[]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <section className="pt-32 pb-20 bg-[#0A0A0A]">
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
              {albuns.map((album) => {
                const capa = album[0];
                const extras = album.slice(1, 4);
                const restantes = album.length - 4;
                return (
                  <button
                    key={capa.albumId || capa.id}
                    onClick={() => setAlbumAberto(album)}
                    className="group relative bg-zinc-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 text-left"
                  >
                    <div className="relative bg-black aspect-square overflow-hidden grid grid-cols-2 grid-rows-2 gap-0.5">
                      <img
                        src={capa.imageUrl}
                        alt={capa.title}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${extras.length > 0 ? "col-span-1 row-span-2" : "col-span-2 row-span-2"}`}
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                      />
                      {extras.map((foto, i) => (
                        <div key={foto.id} className="relative">
                          <img
                            src={foto.imageUrl}
                            alt={foto.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          />
                          {i === extras.length - 1 && restantes > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">+{restantes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-1 truncate">{capa.title}</h3>
                      <p className="text-white/50 text-xs">
                        {album.length > 1 ? `${album.length} fotos · ` : ""}
                        {capa.photoDate
                          ? new Date(capa.photoDate).toLocaleDateString("pt-BR")
                          : new Date(capa.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </button>
                );
              })}
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

      {/* Modal do álbum aberto */}
      {albumAberto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setAlbumAberto(null)}
        >
          <div className="max-w-5xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">{albumAberto[0].title}</h2>
              <button onClick={() => setAlbumAberto(null)} className="text-white/70 hover:text-white">
                <X size={28} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {albumAberto.map((foto) => (
                <div key={foto.id} className="relative group aspect-square rounded-lg overflow-hidden bg-black">
                  <img
                    src={foto.imageUrl}
                    alt={foto.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                  />
                  <a
                    href={foto.imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Download className="text-white" size={24} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
