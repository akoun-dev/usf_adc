import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { imgSiteLogoSmartUATAlt, imgSiteLogoSmartUATBlc } from "@/assets/images";
import { Trans, useTranslation } from "react-i18next";
import { ArrowRight, ChevronRight, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


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
            image: "/src/assets/slideshow/slide-techno-africa.jpg",
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
    ]

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length]);

    const prev = () => {
        setIndex((index - 1 + slides.length) % slides.length)
    }

    const next = () => {
        setIndex((index + 1) % slides.length)
    }

    return (


        <div className="relative w-full min-h-[40vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[65vh] xl:min-h-[70vh] overflow-hidden">

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
                            <div className="w-full lg:w-1/2 h-full text-center text-white pt-10 lg:pt-16 p-8 flex flex-col justify-center items-center bg-gradient-to-br from-green-600/80 to-green-900/40 backdrop-blur-md">

                                {/* LOGO UAT */}
                                <div className="flex justify-center">
                                    <img
                                        src={imgSiteLogoSmartUATBlc}
                                        alt={imgSiteLogoSmartUATAlt}
                                        className="sm:h-56 md:h-64 lg:h-[10rem] w-auto mb-5"
                                    />
                                </div>

                                {/* Content */}
                                <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
                                    <div className="max-w-xl space-y-5">
                                        <h1 className="text-4xl font-bold leading-snug text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
                                            {t("index.hero.title")}
                                            <div className="text-secondary pl-5 pr-5 py-1 rounded-md lg:text-6xl">
                                                {t("index.hero.subtitle")}
                                            </div>
                                        </h1>

                                        <p className="max-w-lg text-lg leading-snug text-white italic lg:text-md mt-3">
                                            {/*t("index.hero.description")*/}{slides[index].description}
                                        </p>

                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="h-13 px-8 text-base bg-secondary hover:bg-secondary/90 text-gray-900 border-2 border-white/30 shadow-md backdrop-blur-sm font-semibold"
                                            >
                                                <Link to="/login">
                                                    {t("index.hero.accessPlatform")}
                                                    <ArrowRight className="m-4 h-5 w-5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                size="lg"
                                                variant="outline"
                                                className="h-13 p-3 text-base bg-white/95 text-primary border-2 border-white/40 hover:bg-white shadow-md backdrop-blur-sm font-semibold"
                                            >
                                                <a href="#features">
                                                    {t("index.hero.discover")}
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
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


