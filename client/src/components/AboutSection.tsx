/*
 * AboutSection — Dark Cinematic / Bold Ministry
 * Asymmetric layout: text left, pastor image right
 * Dark background | Green accent labels | Bold typography
 */

import { useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const PASTOR_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663600332044/DdYHjaUjxJrabKkHH7FJvi/pastor-speaking-LmKcraXqKHkh8ySuPyM3DZ.webp";

export interface AboutContent {
  headline: string;
  paragraph: string;
  pillars: { title: string; desc: string }[];
  pastorImage: string;
  quote: string;
  pastorName: string;
  pastorRole: string;
}

export const ABOUT_DEFAULTS: AboutContent = {
  headline: "Possuímos missão e propósito claros para a sua vida",
  paragraph:
    "A Igreja Vida Nova é uma comunidade cristã vibrante, comprometida com a transformação de vidas através do evangelho de Jesus Cristo. Há mais de 15 anos, temos ajudado famílias a encontrar propósito, comunidade e crescimento espiritual.",
  pillars: [
    { title: "Atrair", desc: "Alcançar pessoas que ainda não conhecem a Deus" },
    { title: "Cuidar", desc: "Discipular e acompanhar cada membro da família" },
    { title: "Capacitar", desc: "Treinar líderes para multiplicar o Reino" },
  ],
  pastorImage: PASTOR_IMAGE,
  quote: "Tecnologia e fé caminham juntas quando o objetivo é transformar vidas e expandir o Reino de Deus.",
  pastorName: "Pr. Carlos Mendes",
  pastorRole: "Pastor Titular",
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const content = useSiteContent<AboutContent>("about", ABOUT_DEFAULTS);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const el = sectionRef.current;
    if (el) {
      el.querySelectorAll(".fade-in-up").forEach((child) => observer.observe(child));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="quem-somos" className="bg-[#0A0A0A] py-24 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="fade-in-up">
              <span className="section-label">QUEM SOMOS</span>
            </div>
            <h2
              className="fade-in-up mt-4 font-display font-black text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              {content.headline}
            </h2>
            <p className="fade-in-up mt-6 text-white/60 text-lg leading-relaxed font-body">
              {content.paragraph}
            </p>

            {/* Pillars */}
            <div className="fade-in-up mt-10 space-y-5">
              {content.pillars.map((pillar, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-green-400" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-base">
                      {pillar.title}
                    </div>
                    <div className="text-white/50 text-sm font-body mt-0.5">
                      {pillar.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="fade-in-up mt-10">
              <button
                onClick={() => {
                  const el = document.querySelector("#contato");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold px-6 py-3 rounded-full transition-all duration-200 font-display text-sm"
              >
                Entenda nossa missão →
              </button>
            </div>
          </div>

          {/* Right: Pastor image */}
          <div className="fade-in-up relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={content.pastorImage}
                alt="Pastor"
                className="w-full h-full object-cover object-top"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Quote card */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-white/90 text-sm font-body italic leading-relaxed">
                  "{content.quote}"
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-black font-bold text-xs">
                      {content.pastorName.split(" ").filter(Boolean).slice(0, 2).map((w) => w.charAt(0)).join("").toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-xs font-display">
                      {content.pastorName}
                    </div>
                    <div className="text-white/50 text-xs font-body">
                      {content.pastorRole}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-green-500/30 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500/10 rounded-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
