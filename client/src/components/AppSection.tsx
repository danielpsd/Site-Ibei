/*
 * AppSection — Dark Cinematic / Bold Ministry
 * Showcase do app da igreja com mockup e features
 * Dark bg | App mockup image | Feature list with green icons
 */

import { useEffect, useRef } from "react";
import { Smartphone, Wifi, Heart, Bell, BookOpen, DollarSign } from "lucide-react";

const APP_MOCKUP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663600332044/DdYHjaUjxJrabKkHH7FJvi/church-app-mockup-Go9SimvQh2cjRYcA76CA8B.webp";

const features = [
  { icon: Wifi, label: "Transmissão ao vivo dos cultos" },
  { icon: Heart, label: "Pedidos de oração e cuidado pastoral" },
  { icon: Bell, label: "Notificações de eventos e avisos" },
  { icon: BookOpen, label: "Devocional diário e planos de leitura" },
  { icon: DollarSign, label: "Dízimos e ofertas online com segurança" },
  { icon: Smartphone, label: "Cadastro e perfil de membro" },
];

export default function AppSection() {
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
    <section className="bg-[#0A0A0A] py-24 lg:py-32 overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="fade-in-up">
              <span className="section-label">ENTREGÁVEIS</span>
            </div>
            <h2
              className="fade-in-up mt-4 font-display font-black text-white leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              É{" "}
              <span className="text-green-400">mais</span>{" "}
              do que apenas um{" "}
              <span className="text-green-400">aplicativo</span>
            </h2>
            <p className="fade-in-up mt-5 text-white/60 text-lg leading-relaxed font-body">
              A sua Igreja na palma da mão das pessoas. 24h, 7 dias por semana.
              Conecte-se com a comunidade, acompanhe os cultos ao vivo e cresça
              espiritualmente onde quer que você esteja.
            </p>

            {/* Features list */}
            <div className="fade-in-up mt-8 grid sm:grid-cols-2 gap-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-green-400" />
                    </div>
                    <span className="text-white/70 text-sm font-body">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="fade-in-up mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.querySelector("#contato");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 font-display text-sm"
              >
                <Smartphone size={16} />
                Baixar o App
              </button>
              <button className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 font-display text-sm">
                Saiba mais →
              </button>
            </div>
          </div>

          {/* Right: App mockup */}
          <div className="fade-in-up flex justify-center lg:justify-end">
            <div className="relative max-w-sm">
              <img
                src={APP_MOCKUP}
                alt="App Igreja Vida Nova"
                className="w-full drop-shadow-2xl"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-green-500/5 rounded-3xl blur-3xl -z-10 scale-110" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
