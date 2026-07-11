/*
 * MinistriesSection — Dark Cinematic / Bold Ministry
 * Grid of ministry cards with icons, dark bg, green hover accents
 * Inspired by inchurch.com.br "Soluções em diferentes áreas"
 */

import { useEffect, useRef } from "react";
import {
  Heart, Users, Baby, Music, Calendar, Globe, BookOpen, Coins
} from "lucide-react";

const ministries = [
  {
    icon: Heart,
    title: "Cuidado com Pessoas",
    desc: "Acompanhamento pastoral e suporte emocional para cada membro da família.",
  },
  {
    icon: Users,
    title: "Células",
    desc: "Grupos pequenos de comunhão, oração e crescimento espiritual em toda a cidade.",
  },
  {
    icon: Coins,
    title: "Mordomia Cristã",
    desc: "Orientação financeira e gestão de recursos para honrar a Deus com suas finanças.",
  },
  {
    icon: Baby,
    title: "Kids",
    desc: "Ministério infantil com programação especial e segura para crianças de todas as idades.",
  },
  {
    icon: Music,
    title: "Louvor & Adoração",
    desc: "Equipe de adoração comprometida em conduzir a presença de Deus nos cultos.",
  },
  {
    icon: Calendar,
    title: "Eventos",
    desc: "Conferências, retiros e eventos especiais que fortalecem a comunidade.",
  },
  {
    icon: Globe,
    title: "Missões",
    desc: "Alcançando nações com o evangelho através de projetos missionários nacionais e internacionais.",
  },
  {
    icon: BookOpen,
    title: "Escola Bíblica",
    desc: "Capacitação teológica e discipulado para todos os membros da igreja.",
  },
];

export default function MinistriesSection() {
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
    <section id="ministerios" className="bg-[#111111] py-24 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="fade-in-up">
            <span className="section-label">MINISTÉRIOS</span>
          </div>
          <h2
            className="fade-in-up mt-4 font-display font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Soluções em{" "}
            <span className="text-green-400">diferentes áreas</span>{" "}
            para sua família
          </h2>
          <p className="fade-in-up mt-4 text-white/60 font-body">
            Oferecemos cuidado integral para cada fase da vida, com ministérios
            especializados para atender às necessidades da sua família.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ministries.map((ministry, i) => {
            const Icon = ministry.icon;
            return (
              <div
                key={i}
                className="fade-in-up group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-green-500/40 rounded-xl p-6 transition-all duration-300 cursor-pointer"
                style={{ transitionDelay: `${(i % 4) * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/15 group-hover:bg-green-500/25 flex items-center justify-center transition-colors mb-4">
                  <Icon size={20} className="text-green-400" />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2">
                  {ministry.title}
                </h3>
                <p className="text-white/50 text-sm font-body leading-relaxed">
                  {ministry.desc}
                </p>
                <div className="mt-4 text-green-400 text-xs font-semibold font-display opacity-0 group-hover:opacity-100 transition-opacity">
                  Saiba mais →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
