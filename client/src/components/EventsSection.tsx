/*
 * EventsSection — Dark Cinematic / Bold Ministry
 * Cards de eventos próximos com data, título e CTA
 * Background #111111 | Cards com borda sutil | Green accents
 */

import { useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    date: { day: "11", month: "MAI" },
    title: "Conferência Vida Nova 2026",
    desc: "Três dias de imersão espiritual com pregadores nacionais e internacionais. Um encontro que vai transformar sua vida.",
    time: "Sexta a Domingo · 19h",
    location: "Sede Principal",
    tag: "CONFERÊNCIA",
    highlight: true,
  },
  {
    date: { day: "18", month: "MAI" },
    title: "Retiro de Casais",
    desc: "Um fim de semana especial para fortalecer o seu casamento e renovar o compromisso com Deus e com o cônjuge.",
    time: "Sábado e Domingo",
    location: "Sítio Recanto Verde",
    tag: "RETIRO",
    highlight: false,
  },
  {
    date: { day: "25", month: "MAI" },
    title: "Culto de Jovens — Geração",
    desc: "A noite dos jovens com louvor contemporâneo, pregação relevante e muito networking entre a galera da fé.",
    time: "Sábado · 20h",
    location: "Sede Principal",
    tag: "JOVENS",
    highlight: false,
  },
  {
    date: { day: "01", month: "JUN" },
    title: "Escola de Líderes",
    desc: "Capacitação intensiva para líderes de células e ministérios. Inscrições abertas para membros comprometidos.",
    time: "Domingo · 14h",
    location: "Sala de Treinamento",
    tag: "CAPACITAÇÃO",
    highlight: false,
  },
];

export default function EventsSection() {
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
    <section id="eventos" className="bg-[#111111] py-24 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="fade-in-up">
              <span className="section-label">EVENTOS</span>
            </div>
            <h2
              className="fade-in-up mt-4 font-display font-black text-white leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Próximos{" "}
              <span className="text-green-400">eventos</span>{" "}
              da nossa comunidade
            </h2>
          </div>
          <div className="fade-in-up">
            <button className="text-green-400 hover:text-green-300 font-semibold font-display text-sm transition-colors border-b border-green-500/50 hover:border-green-400 pb-0.5">
              Ver todos os eventos →
            </button>
          </div>
        </div>

        {/* Events grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event, i) => (
            <div
              key={i}
              className={`fade-in-up group relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                event.highlight
                  ? "bg-green-500/10 border-green-500/40 hover:bg-green-500/15"
                  : "bg-white/3 border-white/8 hover:border-green-500/30 hover:bg-white/6"
              }`}
              style={{ transitionDelay: `${(i % 2) * 100}ms` }}
            >
              {/* Tag */}
              <span
                className={`inline-block text-xs font-bold font-display tracking-widest px-2.5 py-1 rounded-full mb-4 ${
                  event.highlight
                    ? "bg-green-500 text-black"
                    : "bg-white/10 text-white/60"
                }`}
              >
                {event.tag}
              </span>

              <div className="flex gap-5">
                {/* Date */}
                <div className="flex-shrink-0 text-center">
                  <div
                    className={`font-display font-black text-3xl leading-none ${
                      event.highlight ? "text-green-400" : "text-white"
                    }`}
                  >
                    {event.date.day}
                  </div>
                  <div className="text-white/40 text-xs font-body mt-1 tracking-wider">
                    {event.date.month}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white text-lg leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-white/50 text-sm font-body mt-2 leading-relaxed line-clamp-2">
                    {event.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 text-white/40 text-xs font-body">
                      <Clock size={12} />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/40 text-xs font-body">
                      <MapPin size={12} />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute top-6 right-6 text-white/20 group-hover:text-green-400 transition-colors">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
