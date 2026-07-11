/*
 * Galeria de Fotos — Página pública dedicada
 * Exibe fotos dos cultos e eventos, agrupadas em álbuns (quando enviadas juntas
 * pelo painel admin). A publicação é feita exclusivamente pelo Painel Admin (/admin).
 */

import { useState } from "react";
import { Image as ImageIcon, Download, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [fotoExpandida, setFotoExpandida] = useState<{ foto: Foto; index: number } | null>(null);

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
                    onClick={() => { setAlbumAberto(album); setFotoExpandida(null); }}
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
          onClick={() => { setAlbumAberto(null); setFotoExpandida(null); }}
        >
          <div className="max-w-5xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">{albumAberto[0].title}</h2>
              <button onClick={() => { setAlbumAberto(null); setFotoExpandida(null); }} className="text-white/70 hover:text-white">
                <X size={28} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {albumAberto.map((foto, index) => (
                <button
                  key={foto.id}
                  onClick={() => setFotoExpandida({ foto, index })}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-black cursor-zoom-in"
                >
                  <img
                    src={foto.imageUrl}
                    alt={foto.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <a
                    href={foto.imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 bg-black/70 hover:bg-yellow-500 hover:text-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download size={16} />
                  </a>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Foto expandida em tela cheia, com navegação entre as fotos do álbum */}
      {fotoExpandida && albumAberto && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFotoExpandida(null)}
        >
          <button
            onClick={() => setFotoExpandida(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          >
            <X size={32} />
          </button>

          {albumAberto.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = (fotoExpandida.index - 1 + albumAberto.length) % albumAberto.length;
                  setFotoExpandida({ foto: albumAberto[newIndex], index: newIndex });
                }}
                className="absolute left-2 sm:left-6 text-white/70 hover:text-white z-10"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = (fotoExpandida.index + 1) % albumAberto.length;
                  setFotoExpandida({ foto: albumAberto[newIndex], index: newIndex });
                }}
                className="absolute right-2 sm:right-6 text-white/70 hover:text-white z-10"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={fotoExpandida.foto.imageUrl}
              alt={fotoExpandida.foto.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
            />
            <div className="flex items-center justify-between w-full mt-4 px-2">
              <p className="text-white/70 text-sm">
                {fotoExpandida.index + 1} de {albumAberto.length}
              </p>
              <a
                href={fotoExpandida.foto.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-full text-sm transition-colors"
              >
                <Download size={16} />
                Baixar
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
