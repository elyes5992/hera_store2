// src/components/FloatingBlobs2.tsx
import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system';

// --- Configuration ---
const BLOB_COUNT = 8; // How many blobs to render
const BASE_SIZE_MIN = 150; // Minimum base size (px)
const BASE_SIZE_MAX = 450; // Maximum base size (px)
const ANIMATION_DURATION_MIN = 18; // Min animation duration (seconds)
const ANIMATION_DURATION_MAX = 40; // Max animation duration (seconds)

// --- Enhanced Color Palette with More Depth ---
// Adding a brighter spot and shifting the center for more 3D feel
const colorPalette = [
    // Blues/Cyans/Teals
    'radial-gradient(ellipse at 30% 25%, hsla(190, 90%, 80%, 0.75) 0%, hsla(195, 75%, 55%, 0.65) 40%, hsla(205, 85%, 30%, 0.5) 100%)', // Slightly higher core alpha
    'radial-gradient(ellipse at 70% 30%, hsla(180, 80%, 85%, 0.7) 0%, hsla(185, 70%, 60%, 0.55) 45%, hsla(195, 80%, 30%, 0.4) 100%)',
    'radial-gradient(ellipse at 20% 75%, hsla(215, 90%, 85%, 0.75) 0%, hsla(225, 75%, 60%, 0.65) 40%, hsla(235, 85%, 35%, 0.5) 100%)',
    // Purples/Magentas
    'radial-gradient(ellipse at 75% 70%, hsla(265, 80%, 85%, 0.7) 0%, hsla(275, 70%, 55%, 0.55) 45%, hsla(285, 80%, 30%, 0.4) 100%)',
    'radial-gradient(ellipse at 35% 65%, hsla(305, 85%, 85%, 0.65) 0%, hsla(315, 75%, 60%, 0.5) 40%, hsla(325, 90%, 35%, 0.4) 100%)',
];


// --- Helper Functions ---
const getRandom = (min: number, max: number): number => Math.random() * (max - min) + min;
const getRandomInt = (min: number, max: number): number => Math.floor(getRandom(min, max));
const getRandomColor = (): string => colorPalette[getRandomInt(0, colorPalette.length)];

// --- Define Keyframes for Animation with Rotation ---
const float1 = keyframes`
  0% {
    transform: translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
  }
  25% {
    transform: translate(20px, -30px) scale(1.05) rotateX(45deg) rotateY(-20deg) rotateZ(15deg);
    border-radius: 40% 60% 70% 30% / 60% 40% 50% 50%;
  }
  50% {
    transform: translate(-15px, 25px) scale(0.95) rotateX(-30deg) rotateY(60deg) rotateZ(-25deg);
    border-radius: 70% 30% 50% 50% / 40% 50% 60% 60%;
  }
  75% {
    transform: translate(35px, 10px) scale(1.02) rotateX(20deg) rotateY(-40deg) rotateZ(35deg);
    border-radius: 50% 50% 60% 40% / 70% 30% 40% 60%;
  }
  100% {
    transform: translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
  }
`;

const float2 = keyframes`
  0% {
    transform: translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    border-radius: 30% 70% 40% 60% / 60% 50% 50% 40%;
  }
  25% {
    transform: translate(-25px, 15px) scale(0.98) rotateX(-50deg) rotateY(10deg) rotateZ(-20deg);
    border-radius: 70% 30% 60% 40% / 50% 50% 40% 60%;
  }
  50% {
    transform: translate(10px, -35px) scale(1.03) rotateX(25deg) rotateY(-35deg) rotateZ(40deg);
    border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%;
  }
  75% {
    transform: translate(-30px, -5px) scale(0.96) rotateX(-15deg) rotateY(55deg) rotateZ(-10deg);
    border-radius: 60% 40% 30% 70% / 40% 60% 50% 50%;
  }
  100% {
    transform: translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    border-radius: 30% 70% 40% 60% / 60% 50% 50% 40%;
  }
`;

const keyframeOptions = [float1, float2];
const getRandomKeyframes = () => keyframeOptions[getRandomInt(0, keyframeOptions.length)];

// --- Blob Data Interface ---
interface BlobData {
    id: number;
    top: string;
    left: string;
    size: number;
    colorGradient: string;
    animationDuration: number;
    animationDelay: number;
    animationName: string;
    initialOpacity: number; // Base opacity (can vary by size)
}

// --- FloatingBlobs Component ---
const FloatingBlobs2: React.FC = () => {

    const blobs = useMemo((): BlobData[] => {
        return Array.from({ length: BLOB_COUNT }).map((_, index) => {
            const size = getRandom(BASE_SIZE_MIN, BASE_SIZE_MAX);
            // Optional: Slightly vary opacity based on size (smaller = potentially further away = more transparent)
            const sizeFactor = (size - BASE_SIZE_MIN) / (BASE_SIZE_MAX - BASE_SIZE_MIN); // 0 for min, 1 for max
            const initialOpacity = 0.7 + sizeFactor * 0.25; // Vary opacity from 0.7 to 0.95

            return {
                id: index,
                top: `${getRandom(-25, 105)}%`, // Allow slightly more off-screen start/end
                left: `${getRandom(-25, 105)}%`,
                size: size,
                colorGradient: getRandomColor(),
                animationDuration: getRandom(ANIMATION_DURATION_MIN, ANIMATION_DURATION_MAX),
                animationDelay: getRandom(0, 8), // Increase max delay for more staggered starts
                animationName: getRandomKeyframes().toString(),
                initialOpacity: initialOpacity,
            };
        });
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: -1, // Behind other content
                pointerEvents: 'none',
                perspective: '1200px', // Keep perspective
                // Ensure background is transparent if blobs might overlap edge visuals
                // background: 'transparent', // Or your main layout background
            }}
        >
            {blobs.map((blob) => (
                <Box
                    key={blob.id}
                    sx={{
                        position: 'absolute',
                        top: blob.top,
                        left: blob.left,
                        width: `${blob.size}px`,
                        height: `${blob.size}px`,
                        background: blob.colorGradient,
                        opacity: blob.initialOpacity, // Use calculated opacity
                        borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%', // Initial shape
                        transformOrigin: 'center center',
                        // Apply transform-style preserve-3d to allow pseudo-elements to potentially inherit 3D space
                        transformStyle: 'preserve-3d',

                        // --- ENHANCED DEPTH STYLING ---

                        // 1. Layered Inner Shadow for Volume
                        //    - Subtle light inner edge glow
                        //    - Darker inner shadow to simulate curvature away from light
                        boxShadow: `
                            inset 0px 0px ${blob.size * 0.06}px ${blob.size * 0.03}px rgba(255, 255, 255, 0.12),
                            inset 0px 0px ${blob.size * 0.15}px ${blob.size * 0.05}px rgba(0, 0, 0, 0.35)
                        `,

                        // 2. Slightly Softer Drop Shadow (less emphasis here, more on inner shadow)
                        filter: `drop-shadow(${blob.size * 0.02}px ${blob.size * 0.03}px ${blob.size * 0.08}px rgba(0, 0, 0, 0.28))`, // Reduced offset/blur slightly

                        // 3. Animation Properties
                        animationName: blob.animationName,
                        animationDuration: `${blob.animationDuration}s`,
                        animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)', // Smoother ease
                        animationIterationCount: 'infinite',
                        animationDirection: 'alternate',
                        animationDelay: `${blob.animationDelay}s`,

                        // 4. Pseudo-element for Surface Highlight (Refined)
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: `${getRandom(15, 30)}%`, // Position highlight slightly
                            left: `${getRandom(20, 35)}%`,
                            width: `${getRandom(50, 70)}%`,
                            height: `${getRandom(40, 60)}%`,
                            // Use a softer white radial highlight
                            background: `radial-gradient(ellipse at center, rgba(255, 255, 255, ${getRandom(0.15, 0.3)}) 0%, rgba(255, 255, 255, 0) 75%)`, // Made slightly stronger/larger fade
                            borderRadius: '55% 45% 40% 60% / 65% 55% 50% 45%', // Keep soft/irregular
                            filter: `blur(${blob.size * 0.06}px)`, // Slightly increased highlight blur
                            opacity: 0.95, // Keep highlight fairly visible
                            transform: `rotate(${getRandom(-25, 25)}deg) translateZ(1px)`, // Add slight Z translation to lift it visually
                            pointerEvents: 'none',
                            mixBlendMode: 'overlay', // Overlay blends well with colors
                            zIndex: 1,
                            backfaceVisibility: 'hidden', // Hide highlight if blob rotates away significantly
                        },
                         // --- END DEPTH STYLING ---
                    }}
                />
            ))}
        </Box>
    );
};

export default FloatingBlobs2;