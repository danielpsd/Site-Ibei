/*
 * PlansSection — Dark Cinematic / Bold Ministry
 * Pricing cards for church membership/plans
 * Dark bg | Green highlight on featured plan | Bold typography
 */

import { useEffect, useRef } from "react";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Visitante",
    price: "Gratuito",
    period: "",
    desc: "Para quem está conhecendo a nossa comunidade",
    features: [
      "Acesso aos cultos presenciais",
      "Participação em eventos abertos",
      "Receber o boletim semanal",
      "Acesso ao app (modo visitante)",
    ],
    cta: "Venha nos visitar",
    featured: false,
  },
  {
    name: "Membro",
    price: "Gratuito",
    period: "",
    desc: "Para quem quer fazer parte ativa da família",
    features: [
      "Tudo do plano Visitante",
      "Participação em células",
      "Acesso à Escola Bíblica",
      "Suporte pastoral personalizado",
      "App completo com todas as funções",
      "Participação em retiros e conferências",
    ],
    cta: "Quero ser membro",
    featured: true,
  },
  {
    name: "Líder",
    price: "Gratuito",
    period: "",
    desc: "Para quem quer servir e multiplicar o Reino",
    features: [
      "Tudo do plano Membro",
      "Escola de Líderes avançada",
      "Mentoria com pastores",
      "Ferramentas de gestão de célula",
      "Acesso a treinamentos exclusivos",
      "Suporte estratégico ministerial",
    ],
    cta: "Quero ser líder",
    featured: false,
  },
];

export default function PlansSection() {
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
    <section className="bg-[#111111] py-24 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="fade-in-up">
            <span className="section-label">PLANOS</span>
          </div>
          <h2
            className="fade-in-up mt-4 font-display font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            O caminho ideal para{" "}
            <span className="text-green-400">o seu crescimento</span>
          </h2>
          <p className="fade-in-up mt-4 text-white/60 max-w-xl mx-auto font-body">
            Oferecemos diferentes níveis de envolvimento para que você possa
            crescer no seu próprio ritmo dentro da nossa comunidade.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`fade-in-up relative rounded-2xl p-8 border transition-all duration-300 flex flex-col ${
                plan.featured
                  ? "bg-green-500/10 border-green-500/50 scale-105 shadow-xl shadow-green-500/10"
                  : "bg-white/3 border-white/8 hover:border-green-500/30"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 bg-green-500 text-black text-xs font-bold font-display px-4 py-1.5 rounded-full">
                    <Star size={11} className="fill-black" />
                    MAIS POPULAR
                  </span>
                </div>
              )}

              <div>
                <div className={`text-xs font-bold font-display tracking-widest uppercase ${
                  plan.featured ? "text-green-400" : "text-white/40"
                }`}>
                  {plan.name}
                </div>
                <div className="mt-3 font-display font-black text-white text-4xl">
                  {plan.price}
                </div>
                <p className="mt-2 text-white/50 text-sm font-body">{plan.desc}</p>
              </div>

              <div className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.featured ? "bg-green-500" : "bg-white/10"
                    }`}>
                      <Check size={10} className={plan.featured ? "text-black" : "text-white/60"} />
                    </div>
                    <span className="text-white/70 text-sm font-body">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    const el = document.querySelector("#contato");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full py-3.5 rounded-full font-bold font-display text-sm transition-all duration-200 ${
                    plan.featured
                      ? "bg-green-500 hover:bg-green-400 text-black hover:scale-105"
                      : "border border-white/20 hover:border-green-500 text-white hover:text-green-400"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
