/*
 * Footer — Dark Cinematic / Bold Ministry
 * Multi-column footer with links, social, address and copyright
 * Deep black bg | Green accent | White/muted text
 */

export default function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Institucional",
      links: ["Quem Somos", "Nossa Visão", "Liderança", "Trabalhe Conosco", "Transparência"],
    },
    {
      title: "Ministérios",
      links: ["Cuidado com Pessoas", "Células", "Kids", "Louvor & Adoração", "Missões", "Escola Bíblica"],
    },
    {
      title: "Tecnologia",
      links: ["Aplicativo", "Transmissão ao Vivo", "Devocional Online", "Contribuições Online"],
    },
    {
      title: "Contato",
      links: ["Fale com um Pastor", "Suporte", "Política de Privacidade", "Termos de Uso"],
    },
  ];

  return (
    <footer className="bg-black border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top: Logo + tagline */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-14 pb-14 border-b border-white/8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L10 18M4 8L16 8" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display font-black text-white text-xl tracking-tight">
                Eben<span className="text-green-400">ézer</span>
              </span>
            </div>
            <p className="text-white/50 text-sm font-body leading-relaxed">
              Uma comunidade de fé comprometida em atrair, cuidar e capacitar
              pessoas para a missão de Deus. Transformando vidas há mais de 15 anos.
            </p>
            <div className="mt-5 flex gap-3">
              {["IG", "YT", "FB", "SP"].map((s) => (
                <button
                  key={s}
                  className="w-9 h-9 rounded-full border border-white/15 hover:border-green-500/50 text-white/40 hover:text-green-400 text-xs font-bold font-display transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="text-white/30 text-xs font-display font-bold uppercase tracking-widest mb-4">
                  {col.title}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button className="text-white/50 hover:text-white text-sm font-body transition-colors text-left">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-white/30 text-xs font-body text-center lg:text-left">
            © {year} Igreja Vida Nova. Todos os Direitos Reservados.
          </div>
          <div className="text-white/20 text-xs font-body">
            Av. das Nações, 1500 - Centro, São Paulo - SP · (11) 99999-8888
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-white/30 hover:text-green-400 text-xs font-display font-semibold transition-colors"
          >
            ↑ Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  );
}
