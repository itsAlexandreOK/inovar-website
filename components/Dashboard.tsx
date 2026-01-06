'use client';

import { MdDashboard } from "react-icons/md";
import { IoIosDocument } from "react-icons/io";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { FaAngleDoubleUp } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { TbMenuDeep } from "react-icons/tb";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { BiWindowClose } from "react-icons/bi";
import { TiWiFi } from "react-icons/ti";
import { runRealSpeedTest } from "../lib/utils/realSpeedTest";
import Spinner from './svg/spinner';

const containerVariants = {
    open: {
        width: "28rem",
        transition: {
            type: "spring" as const,
            damping: 15,
            stiffness: 100
        }
    },
    closed: {
        width: "6.5rem",
        transition: {
            type: "spring" as const,
            damping: 15,
            stiffness: 100
        }
    },
};

const textVariants = {
    open: {
        opacity: 1,
        transition: { delay: 0.2 }
    },
    closed: {
        opacity: 0,
        transition: { delay: 0 }
    }
};


export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const containerControls = useAnimationControls();
    const [downloadSpeed, setDownloadSpeed] = useState<string | null>(null);
    const [uploadSpeed, setUploadSpeed] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            containerControls.start("open");
        } else {
            containerControls.start("closed");
        }
    }, [isOpen]);

    const handleStartTest = async () => {
        setLoading(true);
        setError(null);
        setDownloadSpeed(null);
        setUploadSpeed(null);

        try {
            const results = await runRealSpeedTest();

            setDownloadSpeed(results.download.toFixed(2));
            setUploadSpeed(results.upload.toFixed(2));
        } catch (err) {
            console.error(err);
            setError('Erro ao executar o teste de velocidade. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    }


    const handleOpenClose = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <section className="fixed left-0 ml-10 items-center justify-center flex h-screen">

                <motion.div className="bg-white p-4 shadow border-4 justify-center overflow-hidden" animate={containerControls} variants={containerVariants} initial="closed">
                    <div className="grid grid-cols-1 col items-center justify-start text-left gap-10 w-100">
                        <div className="flex p-4">
                            <TbMenuDeep className="text-4xl text-black mr-4 cursor-pointer" onClick={() => handleOpenClose()} />
                        </div>
                        <motion.div className={`flex p-4 items-center ${isOpen ? 'hover:bg-gray-400' : ''}`} animate={isOpen ? "open" : "closed"}>
                            <MdDashboard className={`text-4xl mr-4 cursor-pointer shrink-0 ${isOpen ? 'text-black' : 'text-black hover:text-gray-400'}`} />
                            <motion.a className="text-3xl font-[IntroRust] cursor-pointer whitespace-nowrap" variants={textVariants}>DASHBOARD</motion.a>
                        </motion.div>

                        <motion.div className={`flex p-4 items-center ${isOpen ? 'hover:bg-gray-400' : ''}`} animate={isOpen ? "open" : "closed"}>
                            <IoIosDocument className={`items-start text-4xl mr-4 cursor-pointer shrink-0 ${isOpen ? 'text-black' : 'text-black hover:text-gray-400'}`} />
                            <motion.a className="text-3xl font-[IntroRust] cursor-pointer whitespace-nowrap" variants={textVariants}>MINHAS FATURAS</motion.a>
                        </motion.div>

                        <motion.div className={`flex p-4 items-center ${isOpen ? 'hover:bg-gray-400' : ''}`} animate={isOpen ? "open" : "closed"}>
                            <FaScrewdriverWrench className={`items-start text-4xl mr-4 cursor-pointer shrink-0 ${isOpen ? 'text-black' : 'text-black hover:text-gray-400'}`} />
                            <motion.a className="text-3xl font-[IntroRust] cursor-pointer whitespace-nowrap" variants={textVariants}>SUPORTE TÉCNICO</motion.a>
                        </motion.div>

                        <motion.div className={`flex p-4 items-center ${isOpen ? 'hover:bg-gray-400' : ''}`} animate={isOpen ? "open" : "closed"}>
                            <FaAngleDoubleUp className={`items-start text-4xl mr-4 cursor-pointer shrink-0 ${isOpen ? 'text-black' : 'text-black hover:text-gray-400'}`} />
                            <motion.a className="text-3xl font-[IntroRust] cursor-pointer whitespace-nowrap overflow-hidden" variants={textVariants}>UPGRADES/SERVIÇOS</motion.a>
                        </motion.div>

                        <motion.div className={`flex p-4 items-center ${isOpen ? 'hover:bg-gray-400' : ''}`} animate={isOpen ? "open" : "closed"}>
                            <FaUserGear className={`items-start text-4xl mr-4 cursor-pointer shrink-0 ${isOpen ? 'text-black' : 'text-black hover:text-gray-400'}`} />
                            <motion.a className="text-3xl font-[IntroRust] cursor-pointer whitespace-nowrap" variants={textVariants}>MEUS DADOS</motion.a>
                        </motion.div>

                        <motion.div className={`flex p-4 items-center ${isOpen ? 'hover:bg-gray-400' : ''}`} animate={isOpen ? "open" : "closed"}>
                            <FaSignOutAlt className={`items-start text-4xl mr-4 cursor-pointer shrink-0 ${isOpen ? 'text-red-700' : 'text-red-700 hover:text-red-400'}`} />
                            <motion.a className="text-3xl font-[IntroRust] text-red-700 cursor-pointer whitespace-nowrap" variants={textVariants} href="/">SAIR</motion.a>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <div className="grid grid-cols-2 grid-rows-2 grid-flow-col items-center justify-center w-auto h-screen ml-140">
                <main className="flex relative items-center justify-center bg-white w-200 h-100 shadow-[8px_8px_#000] border-4">
                    <div>
                        <BiWindowClose className="absolute top-5 right-5 text-4xl text-red-800" />
                    </div>
                    <div className="p-10 bg-gray-400">
                        <h1 className="text-4xl font-[IntroRust] mb-4">Nenhum plano contratado</h1>
                        <a className="text-2xl text-blue-500 font-bold cursor-pointer hover:underline">Veja nossos planos e escolha o melhor para você.</a>
                    </div>
                </main>

                <main className="bg-white w-200 h-100 shadow-[8px_8px_#000] border-4 flex items-center justify-center relative">
                    <div>
                        <BiWindowClose className="absolute top-5 right-5 text-4xl text-red-800" />
                    </div>
                    <div className="p-10 bg-gray-400">
                        <h1 className="text-3xl font-[IntroRust]">Nenhuma fatura encontrada</h1>
                    </div>
                </main>

                <main className="bg-white w-100 h-100 shadow-[8px_8px_#000] border-4 flex items-center justify-center relative row-span-2 ml-50">
                    <div>
                        <BiWindowClose className="absolute top-5 right-5 text-4xl text-red-800" />
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-10">
                        <TiWiFi className="text-6xl mb-4" />
                        <h1 className="text-3xl font-[IntroRust]">Teste de Velocidade</h1>
                        <p className="text-sm text-gray-600 mt-2">🌐 Teste real de internet usando CDNs públicos</p>
                        <button className={`text-2xl mt-4 bg-amber-300 rounded-2xl p-3 border-dashed border-4 font-[IntroRust] hover:bg-amber-400 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-500'}`} onClick={handleStartTest} disabled={loading}>{loading ? <Spinner /> : 'Iniciar Teste'}</button>
                        {error && <p className="text-red-600 mt-4">{error}</p>}
                        {downloadSpeed && uploadSpeed && (
                        <>
                            <p className="text-2xl mt-4">Download: {downloadSpeed} Mbps</p>
                            <p className="text-2xl">Upload: {uploadSpeed} Mbps</p>
                            <p className="text-xs text-gray-500 mt-2">Download via CDNs públicos • Upload via servidor local</p>
                        </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}