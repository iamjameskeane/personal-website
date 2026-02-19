import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Import all images from the assets/Photos directory
// using relative path and removing query params for compatibility
const imageImports = import.meta.glob('../assets/Photos/*.webp', {
    eager: true
});

const images: any[] = Object.values(imageImports).map((img: any) => img.default);

// Shuffle array function
const shuffle = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

import { useStore } from '@nanostores/react';
import { isOffline } from '../stores/offline';

// ... (imports and shuffle function remain the same)

export default function PhotoGrid() {
    const [shuffledImages, setShuffledImages] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const $isOffline = useStore(isOffline);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        // Initial shuffle on mount so grid is ready
        setShuffledImages(shuffle([...images]));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 pb-20"
        >
            <button
                onClick={async () => {
                    window.scrollTo(0, 0);
                    const { isOffline } = await import('../stores/offline');
                    isOffline.set(false);
                }}
                className="fixed top-6 right-6 z-50 bg-black/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-sans text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300"
            >
                Go Online
            </button>
            {shuffledImages.map((src: any, index: number) => {
                // Robustly handle different import types (string URL or object with src)
                const imageSrc = typeof src === 'string' ? src : src.src;

                return (
                    <motion.div
                        key={index}
                        className="break-inside-avoid mb-4"
                    >
                        <motion.img
                            initial={{ filter: "grayscale(100%)" }}
                            whileInView={isMobile ? { filter: "grayscale(0%)" } : undefined}
                            viewport={isMobile ? { margin: "-45% 0px -45% 0px" } : undefined}
                            whileHover={!isMobile ? { filter: "grayscale(0%)" } : undefined}
                            transition={{ duration: 0.5 }}
                            src={imageSrc}
                            alt="Expedition visual"
                            className="w-full h-auto object-cover rounded-sm"
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
