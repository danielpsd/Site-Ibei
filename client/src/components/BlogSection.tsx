/*
 * BlogSection — Dark Cinematic / Bold Ministry
 * Grid de artigos do blog com tags, tempo de leitura e CTA
 * Dark bg | Card hover effects | Green tag accents
 */

import { useEffect, useRef } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export interface BlogPostItem {
  tag: string;
  readTime: string;
  title: string;
  excerpt: string;
  date: string;
}

export interface BlogContent {
  headline: string;
  items: BlogPostItem[];
}

export const BLOG_DEFAULTS: BlogContent = {
  headline: "Nós estamos em constante movimento",
  items: [
    { tag: "DISCIPULADO", readTime: "5 MIN", title: "A importância da comunidade no crescimento espiritual", excerpt: "Descobrir como a vida em comunidade transforma não apenas a nossa fé, mas também a nossa capacidade de amar e servir ao próximo.", date: "20 Abr 2026" },
    { tag: "LIDERANÇA", readTime: "8 MIN", title: "Como liderar com integridade em tempos difíceis", excerpt: "Princípios bíblicos que todo líder cristão precisa aplicar para manter a integridade e o testemunho em momentos de pressão.", date: "15 Abr 2026" },
    { tag: "FAMÍLIA", readTime: "6 MIN", title: "Construindo um lar com fundamentos bíblicos", excerpt: "Práticas simples e poderosas para fortalecer os laços familiares e criar um ambiente de amor, respeito e crescimento espiritual.", date: "10 Abr 2026" },
    { tag: "MISSÕES", readTime: "10 MIN", title: "Jesus: o maior comunicador que já existiu", excerpt: "O que podemos aprender com a forma como Jesus se comunicava e como aplicar esses princípios no nosso ministério hoje.", date: "05 Abr 2026" },
    { tag: "FINANÇAS", readTime: "7 MIN", title: "Mordomia cristã: honrando a Deus com suas finanças", excerpt: "Entenda o princípio bíblico do dízimo e das ofertas e como a generosidade transforma não apenas a igreja, mas a sua própria vida.", date: "01 Abr 2026" },
    { tag: "EVANGELISMO", readTime: "5 MIN", title: "Como receber bem os visitantes na sua igreja", excerpt: "Dicas práticas para criar uma cultura de hospitalidade que faz os visitantes se sentirem em casa desde o primeiro momento.", date: "28 Mar 2026" },
  ],
};

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const content = useSiteContent<BlogContent>("blog", BLOG_DEFAULTS);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const el = sectionRef.current;
    if (el) el.querySelectorAll(".fade-in-up").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="blog" className="bg-[#0A0A0A] py-24 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="fade-in-up">
              <span className="section-label">BLOG</span>
            </div>
            <h2
              className="fade-in-up mt-4 font-display font-black text-white leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              {content.headline}
            </h2>
          </div>
          <div className="fade-in-up">
            <button className="text-green-400 hover:text-green-300 font-semibold font-display text-sm transition-colors border-b border-green-500/50 hover:border-green-400 pb-0.5">
              Acesse todos os artigos →
            </button>
          </div>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.items.map((post, i) => (
            <article
              key={i}
              className="fade-in-up group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-green-500/30 rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-display text-green-400 tracking-wider">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1 text-white/30 text-xs font-body">
                  <Clock size={11} />
                  {post.readTime}
                </span>
              </div>

              <h3 className="font-display font-bold text-white text-base leading-snug group-hover:text-green-100 transition-colors flex-1">
                {post.title}
              </h3>

              <p className="mt-3 text-white/50 text-sm font-body leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-white/30 text-xs font-body">{post.date}</span>
                <span className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
