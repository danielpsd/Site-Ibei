/*
 * TestimonialsSection — Dark Cinematic / Bold Ministry
 * Carousel of testimonials with photos, dark bg, green accents
 * Inspired by inchurch.com.br cases section
 */

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const COMMUNITY_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663600332044/DdYHjaUjxJrabKkHH7FJvi/church-community-Msu2u8ZZzqiUSYhtVTNKLL.webp";

const testimonials = [
  {
    quote:
      "A Igreja Vida Nova transformou completamente a minha família. Chegamos como visitantes e hoje somos parte ativa desta comunidade incrível. Encontramos propósito, amigos e a presença de Deus.",
    name: "Ana Paula Ferreira",
    role: "Membro há 5 anos",
    church: "Célula Zona Sul",
  },
  {
    quote:
      "Passei por um período muito difícil na minha vida e foi aqui que encontrei acolhimento e restauração. O ministério de cuidado pastoral fez toda a diferença na minha jornada de fé.",
    name: "Roberto Almeida",
    role: "Membro há 3 anos",
    church: "Ministério de Homens",
  },
  {
    quote:
      "Meus filhos adoram o ministério Kids! A programação é incrível e os líderes são comprometidos. Eles mal podem esperar para ir à igreja todo domingo. Que bênção encontrar este lugar!",
    name: "Carla Souza",
    role: "Membro há 7 anos",
    church: "Ministério de Famílias",
  },
  {
    quote:
      "Comecei como visitante, me tornei membro, depois líder de célula. A escola bíblica me capacitou de uma forma que nunca imaginei. Hoje sirvo com alegria e propósito.",
    name: "Marcos Oliveira",
    role: "Líder de Célula",
    church: "Região Norte",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) el.querySelectorAll(".fade-in-up").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const navigate = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length);
      setAnimating(false);
    }, 200);
  };

  const t = testimonials[current];

  return (
    <section id="comunidade" className="bg-[#0A0A0A] py-24 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Community image */}
          <div className="fade-in-up relative order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={COMMUNITY_IMAGE}
                alt="Comunidade Igreja Vida Nova"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-6 -right-6 bg-green-500 rounded-2xl p-5 shadow-xl shadow-green-500/30">
              <div className="font-display font-black text-black text-3xl">+500</div>
              <div className="text-black/70 text-xs font-body mt-0.5">famílias impactadas</div>
            </div>
          </div>

          {/* Right: Testimonials */}
          <div className="order-1 lg:order-2">
            <div className="fade-in-up">
              <span className="section-label">DEPOIMENTOS</span>
            </div>
            <h2
              className="fade-in-up mt-4 font-display font-black text-white leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              Essas famílias já estão{" "}
              <span className="text-green-400">crescendo</span>{" "}
              e cuidando melhor umas das outras
            </h2>

            {/* Testimonial card */}
            <div
              className={`fade-in-up mt-10 bg-white/5 border border-white/10 rounded-2xl p-8 transition-opacity duration-200 ${
                animating ? "opacity-0" : "opacity-100"
              }`}
            >
              <Quote size={32} className="text-green-400 mb-4" />
              <p className="text-white/80 text-base leading-relaxed font-body italic">
                "{t.quote}"
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <span className="text-green-400 font-bold font-display text-sm">
                    {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs font-body">{t.role} · {t.church}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="fade-in-up mt-6 flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-green-500 flex items-center justify-center text-white/60 hover:text-green-400 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { if (!animating) { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 200); } }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "bg-green-400 w-6" : "bg-white/20 w-1.5"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => navigate(1)}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-green-500 flex items-center justify-center text-white/60 hover:text-green-400 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
