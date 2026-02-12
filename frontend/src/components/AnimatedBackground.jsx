import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full bg-slate-950 overflow-hidden">
            {/* Primary Orb - Top Left */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]"
            />

            {/* Secondary Orb - Bottom Right */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary-700/20 rounded-full blur-[120px]"
            />

            {/* Accent Orb - Middle */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -100, 50, 0],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"
            />

            {/* Grid Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        </div>
    );
};

export default AnimatedBackground;
