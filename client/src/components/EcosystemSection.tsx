/*
 * EcosystemSection — Dark Cinematic / Bold Ministry
 * Three pillars: Estratégia, Educação, Tecnologia
 * Dark bg with subtle grid | Large icons | Green accents
 */

import { useEffect, useRef } from "react";
import { Target, GraduationCap, Cpu } from "lucide-react";

const pillars = [
  {
    icon: Target,
    label: "ESTRATÉGIA",
    title: "Estratégia",
    desc: "Mais de 140 estratégias práticas e validadas para sua Igreja atrair, cuidar e capacitar pessoas com excelência.",
    color: "from-green-500/20 to-transparent",
  },
  {
    icon: GraduationCap,
    label: "EDUCAÇÃO",
    title: "Educação",
    desc: "Plataforma completa de ensino para capacitar sua equipe e os membros da sua Igreja em cada área do ministério.",
    color: "from-blue-500/20 to-transparent",
  },
  {
    icon: Cpu,
    label: "TECNOLOGIA",
    title: "Tecnologia",
    desc: "Ferramentas e funcionalidades com o que existe de mais moderno em tecnologia para Igrejas que querem crescer.",
    color: "from-purple-500/20 to-transparent",
  },
];

export default function EcosystemSection() {
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
    <section className="bg-[#0D0D0D] py-24 lg:py-32 relative overflow-hidden" ref={sectionRef}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="fade-in-up">
            <span className="section-label">ECOSSISTEMA</span>
          </div>
          <h2
            className="fade-in-up mt-4 font-display font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Como ajudamos a sua Igreja{" "}
            <span className="text-green-400">na prática</span>
          </h2>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="fade-in-up group relative bg-white/3 border border-white/8 hover:border-green-500/30 rounded-2xl p-8 overflow-hidden transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Background gradient */}
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${pillar.color} opacity-50`} />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/15 group-hover:bg-green-500/25 flex items-center justify-center transition-colors mb-6">
                    <Icon size={28} className="text-green-400" />
                  </div>
                  <div className="section-label mb-2">{pillar.label}</div>
                  <h3 className="font-display font-black text-white text-2xl">{pillar.title}</h3>
                  <p className="mt-3 text-white/55 font-body leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
