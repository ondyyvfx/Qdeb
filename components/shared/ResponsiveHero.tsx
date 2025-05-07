"use client";

import { useEffect, useState } from "react";
import Hero from "./Hero";
import MobileHero from "./MobileHero";

const ResponsiveHero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1450);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isMobile ? <MobileHero /> : <Hero />;
};

export default ResponsiveHero;
