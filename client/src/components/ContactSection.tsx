/*
 * ContactSection — Dark Cinematic / Bold Ministry
 * CTA section with contact form and church info
 * Dark bg | Green CTA | Bold typography
 */

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: MapPin, label: "Endereço", value: "Av. das Nações, 1500 - Centro, São Paulo - SP" },
    { icon: Phone, label: "Telefone", value: "(11) 99999-8888" },
    { icon: Mail, label: "E-mail", value: "contato@igrejanovidanova.com.br" },
    { icon: Clock, label: "Cultos", value: "Dom 9h e 18h · Qua 19h30 · Sex 20h" },
  ];

  return (
    <section id="contato" className="bg-[#0A0A0A] py-24 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top CTA banner */}
        <div className="fade-in-up bg-green-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12 mb-16 text-center">
          <span className="section-label">DÊ O PRÓXIMO PASSO</span>
          <h2
            className="mt-4 font-display font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Dê esse importante passo para o{" "}
            <span className="text-green-400">desenvolvimento</span>{" "}
            da sua vida
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto font-body">
            Cadastre-se e um de nossos pastores entrará em contato para
            apresentar tudo o que a Igreja Vida Nova tem a oferecer para você
            e sua família.
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("#form-contato");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-8 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 font-display"
          >
            Cadastrar minha família →
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-16" id="form-contato">
          {/* Left: Contact info */}
          <div>
            <div className="fade-in-up">
              <span className="section-label">CONTATO</span>
            </div>
            <h3
              className="fade-in-up mt-4 font-display font-black text-white leading-tight text-2xl lg:text-3xl"
            >
              Estamos aqui para{" "}
              <span className="text-green-400">te receber</span>
            </h3>
            <p className="fade-in-up mt-4 text-white/60 font-body">
              Venha nos visitar ou entre em contato. Teremos o maior prazer
              em conhecer você e sua família.
            </p>

            <div className="fade-in-up mt-8 space-y-5">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-green-400" />
                    </div>
                    <div>
                      <div className="text-white/40 text-xs font-body uppercase tracking-wider">
                        {item.label}
                      </div>
                      <div className="text-white font-medium font-body mt-0.5">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social links */}
            <div className="fade-in-up mt-10">
              <div className="text-white/40 text-xs font-body uppercase tracking-wider mb-4">
                Redes Sociais
              </div>
              <div className="flex gap-3">
                {["Instagram", "YouTube", "Facebook", "Spotify"].map((social) => (
                  <button
                    key={social}
                    className="px-4 py-2 rounded-full border border-white/15 hover:border-green-500/50 text-white/50 hover:text-green-400 text-xs font-semibold font-display transition-all"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="fade-in-up">
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white text-xl">
                    Mensagem enviada!
                  </h3>
                  <p className="text-white/60 font-body mt-2">
                    Em breve entraremos em contato com você.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                    className="mt-6 text-green-400 hover:text-green-300 font-semibold font-display text-sm"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-body uppercase tracking-wider mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full bg-white/5 border border-white/10 focus:border-green-500/50 rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-body uppercase tracking-wider mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-white/5 border border-white/10 focus:border-green-500/50 rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-body uppercase tracking-wider mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-green-500/50 rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-body uppercase tracking-wider mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Como podemos te ajudar?"
                    className="w-full bg-white/5 border border-white/10 focus:border-green-500/50 rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-full transition-all duration-200 hover:scale-[1.02] font-display"
                >
                  <Send size={16} />
                  Enviar mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
