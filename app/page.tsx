"use client";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Showcase from "@/components/sections/Showcase";
import Office from "@/components/sections/Office";
import Team from "@/components/sections/Team";
import SmileGallery from "@/components/sections/SmileGallery";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { BookingProvider } from "@/lib/BookingContext";
import BookingDrawer from "@/components/BookingDrawer";
import BookingOrb from "@/components/BookingOrb";

export default function Home() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(id);
  }, []);

  return (
    <BookingProvider>
      <SmoothScroll>
        <Cursor />
        <Nav />
        <main>
          <Hero />
          <About />
          <Services />
          <Showcase />
          <Office />
          <Team />
          <SmileGallery />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
      <BookingDrawer />
      <BookingOrb clinicName="Kingsgate Dental" accent="#5BAF82" size={120} />
    </BookingProvider>
  );
}
