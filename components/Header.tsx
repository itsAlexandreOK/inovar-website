"use client";

import Marquee from "react-fast-marquee";
import Link from "next/link";
import { PauseAndPlayIcon } from "./svg/musicStatus";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Planos", href: "/planos" },
  { label: "Rádio", href: "#radio" },
  { label: "Serviços", href: "/servicos", submenu: [{ label: "Monitoramento", href: "/servicos#monitoramento" }] },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesPinned, setIsServicesPinned] = useState(false);
  const servicesRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
        setIsServicesPinned(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openServices = () => setIsServicesOpen(true);
  const closeServicesIfNotPinned = () => {
    if (!isServicesPinned) setIsServicesOpen(false);
  };

  const toggleServicesPin = () => {
    setIsServicesPinned((prev) => {
      const next = !prev;
      setIsServicesOpen(next || isServicesOpen);
      return next;
    });
  };

  return (
    <header className="relative mx-6 my-4 bg-white shadow-[10px_10px_#000] border-3">
      <div className="items-center justify-between flex px-6 py-2">
        <div className="flex items-center text-lg font-[IntroRust] tracking-tight text-zinc-900 overflow-hidden w-60">
            <PauseAndPlayIcon className="h-10 w-10 mr-3 cursor-pointer hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"/>
            <Marquee speed={60} gradient={false} pauseOnHover={true}>
                <span className="text-2xl font-bold text-black pr-12">AO VIVO RÁDIO INOVAR-FM</span>
                <span className="text-2xl font-bold text-black pr-12">AO VIVO RÁDIO INOVAR-FM</span>
            </Marquee>
        </div>
        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-15 text-sm font-medium text-zinc-700">
            {navItems.map((item) => {
              if (!item.submenu) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors font-[IntroRust] text-base hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={item.href}
                  ref={servicesRef}
                  className="relative cursor-pointer"
                  onMouseEnter={openServices}
                  onMouseLeave={closeServicesIfNotPinned}
                >
                  <button
                    type="button"
                    onClick={toggleServicesPin}
                    className="flex items-center gap-2 transition-colors font-[IntroRust] text-base hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                    aria-haspopup="menu"
                    aria-expanded={isServicesOpen}
                  >
                    <span>{item.label}</span>
                    <motion.svg
                      animate={{ rotate: isServicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </button>

                  {isServicesOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 border border-zinc-200 bg-white shadow-[8px_8px_#000] z-50">
                      <ul className="py-2 text-sm text-zinc-800">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className="block px-4 py-2 font-[IntroRust] text-base hover:bg-zinc-100"
                              onClick={() => {
                                setIsServicesOpen(false);
                                setIsServicesPinned(false);
                              }}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
