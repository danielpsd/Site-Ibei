/*
 * Home Page — Dark Cinematic / Bold Ministry
 * Assembles all sections in order, inspired by inchurch.com.br
 * Full dark theme | Green accent | Montserrat + Inter typography
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EcosystemSection from "@/components/EcosystemSection";
import ResultsSection from "@/components/ResultsSection";
import MinistriesSection from "@/components/MinistriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AppSection from "@/components/AppSection";
import EventsSection from "@/components/EventsSection";

import BlogSection from "@/components/BlogSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import MuralPalavraSection from "@/components/MuralPalavraSection";
import GaleriaFotosSection from "@/components/GaleriaFotosSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <EcosystemSection />
      <ResultsSection />
      <MinistriesSection />
      <TestimonialsSection />
      <AppSection />
      <EventsSection />

      <BlogSection />
      <FaqSection />
      <ContactSection />
      <MuralPalavraSection />
      <GaleriaFotosSection />
      <Footer />
    </div>
  );
}
