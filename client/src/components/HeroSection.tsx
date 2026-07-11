/*
 * HeroSection — Dark Cinematic / Bold Ministry
 * Full-viewport hero with dramatic worship image, bold headline, stats ticker
 * Dark overlay on image | White text | Green CTA button
 */

import { useEffect, useState } from "react";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663600332044/DdYHjaUjxJrabKkHH7FJvi/hero-worship-WMf8ttaphiwY6gPTrAMrQ7.webp";

const stats = [
  { value: "15+", label: "Anos de missão" },
  { value: "5 mil", label: "Membros ativos" },
  { value: "32", label: "Grupos de célula" },
  { value: "12", label: "Ministérios" },
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToNext = () => {
    const el = document.querySelector("#quem-somos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Culto Igreja Batista Ebenézer de Ivinhema"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Label */}
          <div
            className={`transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="section-label">
              ♦ Somos uma Igreja Multiplicadora
            </span>
          </div>

          {/* Main headline */}
          <h1
            className={`mt-4 font-display font-black text-white leading-[1.05] transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Multiplicando{" "}
            <span className="text-green-400">compaixão</span>{" "}
            e{" "}
            <span className="text-yellow-400">graça</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-6 text-white/70 text-lg leading-relaxed max-w-xl font-body transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Somos uma igreja cuja missão é viver a vida discipular. Nosso propósito é multiplicar compaixão e graça de Jesus, desde o outro lado da mesa até o outro lado do mundo. Multiplicando discípulos de Jesus, multiplicando Pequenos Grupos, multiplicando ações ministeriais, multiplicando o Reino de Deus.
          </p>

          {/* CTAs */}
          <div
            className={`mt-8 flex flex-wrap gap-4 transition-all duration-700 delay-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={() => {
                const el = document.querySelector("#contato");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 font-display text-sm"
            >
              Quero falar com um pastor
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                const el = document.querySelector("#quem-somos");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-white/5 font-display text-sm"
            >
              <Play size={14} className="fill-white" />
              Conheça nossa história
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className={`mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="border-l-2 border-green-500 pl-4"
            >
              <div className="font-display font-black text-white text-3xl lg:text-4xl">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm font-body mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
