/*
 * Galeria de Fotos — Teaser (Home)
 * Mostra um mosaico com as fotos mais recentes e leva para a página
 * dedicada /galeria. A publicação acontece apenas no Painel Admin.
 */

import { Link } from "wouter";
import { Image as ImageIcon, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function GaleriaFotosSection() {
  const { data: fotos = [] } = trpc.gallery.list.useQuery();
  const preview = fotos.slice(0, 6);

  return (
    <section id="galeria-fotos" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/10 p-3 rounded-xl">
              <ImageIcon className="text-yellow-400" size={26} />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
                Galeria <span className="text-yellow-400">Fotos</span>
              </h2>
              <p className="text-white/60">Fotos dos cultos e eventos da semana</p>
            </div>
          </div>

          <Link href="/galeria">
            <a className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 font-display text-sm shrink-0">
              Ver galeria completa
              <ArrowRight size={16} />
            </a>
          </Link>
        </div>

        {preview.length > 0 ? (
          <Link href="/galeria">
            <a className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {preview.map((foto) => (
                <div key={foto.id} className="group relative bg-slate-800 rounded-lg overflow-hidden aspect-square">
                  <img
                    src={foto.imageUrl}
                    alt={foto.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
            </a>
          </Link>
        ) : (
          <p className="text-white/60">Nenhuma foto disponível ainda</p>
        )}
      </div>
    </section>
  );
}
