import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserDefaultIcon from "@/components/svg/userDefaultIcon";
import { u } from 'framer-motion/client';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    const menuVariants = {
        open: {
            opacity: 1,
            y: 0, // Posição final
            scale: 1, // Tamanho normal
            transition: {
                type: "spring" as const, // Efeito de mola
                duration: 0.4,
                bounce: 0.1 // Leve pulo ao abrir
            }
        },
        closed: {
            opacity: 0,
            y: -20, // Leve movimento para cima ao fechar
            scale: 0.95, // Leve encolhimento ao fechar
            transition: { duration: 0.2 }
        }
    };

    const userButton = (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-amber-400 py-2 px-4 rounded-3xl border-2 font-[IntroRust] hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer flex items-center gap-2">
            <UserDefaultIcon />
            <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
            >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </motion.svg>
        </button>
    )

    const renderAuthButton = () => {
        if (status === 'loading') {
            return null; // Ou um indicador de carregamento
        }

        if (status === 'unauthenticated') {
            return (
                <button className="rounded-3xl bg-yellow-400 px-6 py-2 text-sm font-[IntroRust] text-black border-dashed border-4 hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 cursor-pointer">
                    <a href="/clientAuth">Área do Cliente</a>
                </button>
            );
        }

        if (status === 'authenticated') {
            return (
                userButton
            );
        }
    };

    return (
        <>
            {renderAuthButton()}
            <AnimatePresence>
                {isOpen && status === 'authenticated' && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute top-15 right-1 mt-2 w-30 bg-white border border-gray-200 shadow-[8px_8px_#000] z-50"
                    >
                        <ul className="py-1">
                            <li>
                                <button
                                    onClick={() => {
                                        router.push('/profile');
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm font-[IntroRust] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    Meu Perfil
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm font-[IntroRust] text-red-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {isOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            )}
        </>
    )
}