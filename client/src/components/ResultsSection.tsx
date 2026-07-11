/*
 * ResultsSection — Dark Cinematic / Bold Ministry
 * Big numbers with descriptions, dark background with subtle green accents
 * Inspired by inchurch.com.br results section
 */

import { useEffect, useRef } from "react";

const WORSHIP_EVENT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663600332044/DdYHjaUjxJrabKkHH7FJvi/worship-event-ne6F9Z3C2aErESmEK3sAQa.webp";

const results = [
  {
    number: "5 mil",
    title: "Membros transformados",
    desc: "Pessoas que encontraram propósito e comunidade na Igreja Vida Nova",
  },
  {
    number: "600%",
    title: "Crescimento em 3 anos",
    desc: "Uma igreja que começou com 40 membros e hoje impacta toda a região",
  },
  {
    number: "95%",
    title: "Membros engajados",
    desc: "Da nossa membresia ativa participando de grupos e ministérios",
  },
];

export default function ResultsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section className="relative py-24 lg:py-32 overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={WORSHIP_EVENT_IMAGE}
          alt="Evento de adoração"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="fade-in-up">
            <span className="section-label">RESULTADOS</span>
          </div>
          <h2
            className="fade-in-up mt-4 font-display font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Veja os{" "}
            <span className="text-green-400">resultados</span>{" "}
            e o{" "}
            <span className="text-green-400">crescimento</span>{" "}
            da nossa comunidade
          </h2>
          <p className="fade-in-up mt-4 text-white/60 max-w-2xl mx-auto font-body">
            Números que representam vidas transformadas, famílias restauradas
            e um legado que continua crescendo a cada dia.
          </p>
        </div>

        {/* Results grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {results.map((result, i) => (
            <div
              key={i}
              className="fade-in-up bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-green-500/40 hover:bg-white/8 transition-all duration-300 group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-display font-black text-green-400 group-hover:text-green-300 transition-colors"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                {result.number}
              </div>
              <div className="mt-3 font-display font-bold text-white text-lg">
                {result.title}
              </div>
              <p className="mt-2 text-white/50 text-sm font-body leading-relaxed">
                {result.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fade-in-up mt-12 text-center">
          <button
            onClick={() => {
              const el = document.querySelector("#comunidade");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold font-display text-sm transition-colors border-b border-green-500/50 hover:border-green-400 pb-0.5"
          >
            Veja mais histórias de transformação →
          </button>
        </div>
      </div>
    </section>
  );
}
