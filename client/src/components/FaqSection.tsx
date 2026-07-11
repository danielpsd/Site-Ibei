/*
 * FaqSection — Dark Cinematic / Bold Ministry
 * Accordion FAQ with numbered items
 * Dark bg | Green accent on open item | Bold typography
 */

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "O que é a Igreja Vida Nova?",
    a: "A Igreja Vida Nova é uma comunidade cristã evangélica comprometida com a transformação de vidas através do evangelho de Jesus Cristo. Oferecemos um ambiente acolhedor para pessoas de todas as idades, com ministérios especializados, grupos de célula, escola bíblica e muito mais.",
  },
  {
    q: "Como posso me tornar membro?",
    a: "Para se tornar membro, basta participar do nosso Curso de Membros, que acontece mensalmente. Nele você vai conhecer melhor a visão, os valores e a estrutura da nossa igreja. Após o curso, você será oficialmente recebido como membro em um culto especial.",
  },
  {
    q: "Quais são os horários dos cultos?",
    a: "Realizamos cultos aos domingos às 9h e 18h, e culto de oração às quartas-feiras às 19h30. Também temos cultos especiais de jovens às sextas-feiras às 20h. Todos os cultos são transmitidos ao vivo pelo nosso aplicativo.",
  },
  {
    q: "Como funcionam os grupos de célula?",
    a: "Os grupos de célula são pequenos grupos que se reúnem semanalmente em casas, com 8 a 15 pessoas. São momentos de comunhão, estudo da Palavra e oração. Temos células em diversas regiões da cidade para facilitar a participação de todos.",
  },
  {
    q: "A igreja tem ministério para crianças?",
    a: "Sim! O ministério Kids oferece programação especial e segura para crianças de 0 a 12 anos durante todos os cultos. Contamos com professores treinados, material didático de qualidade e um ambiente preparado especialmente para o desenvolvimento espiritual das crianças.",
  },
  {
    q: "Como posso contribuir financeiramente com a igreja?",
    a: "Você pode contribuir presencialmente durante os cultos, pelo nosso aplicativo ou pelo site. Aceitamos PIX, cartão de crédito e débito. Todas as finanças da igreja são geridas com transparência e prestadas contas regularmente à membresia.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Header */}
          <div>
            <div className="fade-in-up">
              <span className="section-label">FAQ</span>
            </div>
            <h2
              className="fade-in-up mt-4 font-display font-black text-white leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Perguntas{" "}
              <span className="text-green-400">frequentes</span>
            </h2>
            <p className="fade-in-up mt-5 text-white/60 font-body leading-relaxed">
              Aqui respondemos as dúvidas mais comuns sobre a nossa comunidade.
              Se não encontrar o que procura, estamos à disposição para ajudar.
            </p>
            <div className="fade-in-up mt-8">
              <button
                onClick={() => {
                  const el = document.querySelector("#contato");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 font-display text-sm"
              >
                Fale conosco →
              </button>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="fade-in-up space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === i
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-white/8 bg-white/2 hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-display font-bold text-sm tabular-nums ${
                      openIndex === i ? "text-green-400" : "text-white/30"
                    }`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-display font-semibold text-sm ${
                      openIndex === i ? "text-white" : "text-white/80"
                    }`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === i ? "bg-green-500 text-black" : "bg-white/10 text-white/50"
                  }`}>
                    {openIndex === i ? <Minus size={12} /> : <Plus size={12} />}
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 pl-14">
                    <p className="text-white/60 text-sm font-body leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
