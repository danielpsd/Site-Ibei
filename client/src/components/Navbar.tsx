/*
 * Navbar — Dark Cinematic / Bold Ministry
 * Sticky top nav with logo, menu links, and CTA button
 * Colors: bg-black/90 backdrop-blur | text-white | accent green
 */

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "wouter";

// Links que rolam a página (âncoras) — só funcionam na Home
const navLinks = [
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Ministérios", href: "#ministerios" },
  { label: "Eventos", href: "#eventos" },
  { label: "Blog", href: "#blog" },
];

// Links que levam a páginas próprias (rotas dedicadas)
const pageLinks = [
  { label: "Palavra", href: "/mural-palavra" },
  { label: "Galeria", href: "/galeria" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (location !== "/") {
      // Âncoras só existem na Home; navega para lá antes de rolar
      setLocation("/");
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              e.preventDefault();
              if (location !== "/") {
                setLocation("/");
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img src="/images/logo-ibei.png" alt="IBEI" className="w-12 h-12" />
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-black text-white text-sm tracking-tight">IBEI</span>
              <span className="text-xs text-green-400 font-semibold">Igreja Batista Ebenézer</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 font-body"
              >
                {link.label}
              </button>
            ))}
            {pageLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <a
                  className={`text-sm font-medium transition-colors duration-200 font-body ${
                    location === link.href ? "text-green-400" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick("#contato")}
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 font-display"
            >
              Quero Conhecer →
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-black/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left text-white/80 hover:text-white font-medium py-2 font-body"
              >
                {link.label}
              </button>
            ))}
            {pageLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <a
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left font-medium py-2 font-body ${
                    location === link.href ? "text-green-400" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => handleNavClick("#contato")}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition-colors font-display"
              >
                Quero Conhecer →
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
