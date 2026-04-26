import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { imgSiteLogoSmartUATAlt, imgSiteLogoSmartUATBlc } from "@/assets/images";
import { Trans, useTranslation } from "react-i18next";


export function HomeSlideshowSection() {
    const { t, i18n } = useTranslation();

    // Slideshow
    const slides = [
        {
            id: 1,
            title: (
                <>
                    <Trans
                        i18nKey="home.slideshow.together"
                        components={{
                            highlight: <span className="text-[#ffe700]" />
                        }}
                    />
                </>
            ),
            description: t("home.slideshow.together.desc"),
            image: "/src/assets/slideshow/slide-worker.jpg",
        },
        {
            id: 2,
            title: (
                <>
                    <Trans
                        i18nKey="home.slideshow.development"
                        components={{
                            highlight: <span className="text-[#ffe700]" />
                        }}
                    />
                </>
            ),
            description: t("home.slideshow.development.desc"),
            image: "/src/assets/slideshow/slide-telecom-operator.jpg",
        },
        {
            id: 5,
            title: (
                <>
                    <Trans
                        i18nKey="home.slideshow.projects"
                        components={{
                            highlight: <span className="text-[#ffe700]" />
                        }}
                    />
                </>
            ),
            description: t("home.slideshow.projects.desc"),
            image: "/src/assets/slideshow/slide-techno-stats.jpg",
        },
        {
            id: 7,
            title: (
                <>
                    <Trans
                        i18nKey="home.slideshow.echanges"
                        components={{
                            highlight: <span className="text-[#ffe700]" />
                        }}
                    />
                </>
            ),
            description: t("home.slideshow.echanges.desc"),
            image: "/src/assets/slideshow/slide-partenariat.jpg",
        },
        {
            id: 8,
            title: (
                <>
                    <Trans
                        i18nKey="home.slideshow.partners"
                        components={{
                            highlight: <span className="text-[#ffe700]" />
                        }}
                    />
                </>
            ),
            description: t("home.slideshow.partners.desc"),
            image: "/src/assets/slideshow/slide-contrat-doc.jpg",
        },
    ]

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length)
        }, 10000)
        return () => clearInterval(interval)
    }, [slides.length]);

    const prev = () => {
        setIndex((index - 1 + slides.length) % slides.length)
    }

    const next = () => {
        setIndex((index + 1) % slides.length)
    }

    return (


        <div className="relative w-full min-h-[40vh] lg:min-h-[55vh] overflow-hidden">

            {/* BACKGROUND IMAGE */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={slides[index].id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1, x: 0, y: 0 }} // démarre zoomé
                    exit={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        scale: [1.15, 1.05],
                        x: [0, -20, 20, 0],
                        y: [0, -10, 10, 0]
                    }}
                    transition={{
                        opacity: { duration: 1 },
                        scale: { duration: 20, ease: "linear", repeat: Infinity },
                        x: { duration: 20, ease: "linear", repeat: Infinity },
                        y: { duration: 20, ease: "linear", repeat: Infinity }
                    }}
                >
                    <img
                        src={slides[index].image}
                        alt=""
                        className="w-full h-full object-cover brightness-90"
                    />
                </motion.div>
            </AnimatePresence>

            {/* LEFT BLACK OVERLAY FULL HEIGHT */}
            <div className="absolute inset-y-0 left-0 w-full lg:w-1/2" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-center justify-start">
                <div className="container mx-auto px-0 h-full">
                    <AnimatePresence mode="sync">
                        <motion.div
                            key={slides[index].id}
                            className="h-full"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* bg-black/40 backdrop-blur-sm */}
                            <div className="w-full lg:w-1/2 h-full text-center text-white p-8 flex flex-col justify-center items-center bg-gradient-to-br from-green-600/80 to-green-900/40 backdrop-blur-md">

                                {/* LOGO UAT */}
                                <div className="flex justify-center">
                                    <img
                                        src={imgSiteLogoSmartUATBlc}
                                        alt={imgSiteLogoSmartUATAlt}
                                        className="sm:h-56 md:h-64 lg:h-[10rem] w-auto mb-10"
                                    />
                                </div>

                                {/* TITLE */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                                    {slides[index].title}
                                </h1>

                                {/* DESCRIPTION */}
                                <p className="text-base sm:text-lg text-white/90 mb-8">
                                    {slides[index].description}
                                </p>

                                {/* CTA */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <button className="bg-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition">
                                        {t("home.slideshow.btn.discover") }
                                    </button>

                                    <button className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                                        {t("home.slideshow.btn.learnmore")}
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* DOTS */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2 w-2 rounded-full cursor-pointer transition ${i === index ? "bg-white scale-125" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>


    );

}


