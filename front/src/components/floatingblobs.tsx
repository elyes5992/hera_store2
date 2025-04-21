// src/components/FloatingBlobs.tsx
import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system';

// --- Define Keyframes with More Movement ---
const floatBlob1 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  50% { transform: translate(30px, -40px) rotate(10deg) scale(1.05); } // Increased distance
  100% { transform: translate(0, 0) rotate(0deg) scale(1); }
`;

const floatBlob2 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg) scale(1.02); }
  50% { transform: translate(-45px, 25px) rotate(-8deg) scale(1); } // Increased distance
  100% { transform: translate(0, 0) rotate(0deg) scale(1.02); }
`;

const floatBlob3 = keyframes`
  0% { transform: translate(0, 0) rotate(3deg) scale(0.98); }
  50% { transform: translate(20px, 40px) rotate(0deg) scale(1.03); } // Increased distance
  100% { transform: translate(0, 0) rotate(3deg) scale(0.98); }
`;

// We don't need separate shadow animations anymore since shadows will follow blobs

// --- Component Props ---
interface FloatingBlobsProps {
  blobCount?: number;
  colorPalette?: string[];
  minMaxSize?: [number, number];
  minMaxDuration?: [number, number]; // Duration range in seconds
}

// --- Helper ---
const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Main Component ---
const FloatingBlobs: React.FC<FloatingBlobsProps> = ({
  blobCount = 8, // Can increase slightly if performance allows
  colorPalette = [
    '#e84a2e',
    '#ff8c00',
    '#ff5722',
    '#d84315',
    '#bf360c',
  ],
  minMaxSize = [70, 220], // Slightly adjusted range
  minMaxDuration = [9, 16], // <-- FASTER: Reduced duration range (e.g., 9-16 seconds)
}) => {

  const blobs = useMemo(() => {
    const generatedBlobs = [];
    const animations = [floatBlob1, floatBlob2, floatBlob3];

    for (let i = 0; i < blobCount; i++) {
      const size = getRandom(minMaxSize[0], minMaxSize[1]);
      // --- WIDER POSITIONING ---
      const top = `${getRandom(-10, 110)}%`; // Allow starting/ending off-screen
      const left = `${getRandom(-10, 110)}%`; // Allow starting/ending off-screen
      // --- END WIDER POSITIONING ---
      const animationName = animations[i % animations.length];
      const animationDuration = `${getRandom(minMaxDuration[0], minMaxDuration[1])}s`; // Use faster duration
      const animationDelay = `${getRandom(0, 5)}s`; // Keep delay reasonable
      const baseColor = colorPalette[i % colorPalette.length];

      const gradient = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, ${baseColor} 40%, ${shadeColor(baseColor, -30)} 100%)`;
      const borderRadius = `${getRandom(40, 70)}% ${getRandom(40, 70)}% ${getRandom(40, 70)}% ${getRandom(40, 70)}% / ${getRandom(40, 70)}% ${getRandom(40, 70)}% ${getRandom(40, 70)}% ${getRandom(40, 70)}%`;
      
      // Subtle shadow color
      const shadowColor = shadeColor(baseColor, -60);
      
      // Create unique blob ID for both elements
      const blobId = `blob-${i}`;
      const shadowId = `shadow-${i}`;
      
      generatedBlobs.push({
        id: blobId,
        shadowId: shadowId,
        animationName,
        animationDuration,
        animationDelay,
        style: {
          position: 'absolute',
          top, // Apply new wider range
          left, // Apply new wider range
          width: `${size}px`,
          height: `${size}px`,
          borderRadius,
          background: gradient,
          opacity: getRandom(0.8, 1),
          // Center the blob on the calculated top/left coordinate
          transform: `translate(-50%, -50%) rotate(${getRandom(-10, 10)}deg)`,
          animation: `${animationName} ${animationDuration} ease-in-out ${animationDelay} infinite alternate`,
          zIndex: -1,
        },
        shadowStyle: {
          position: 'absolute',
          top, // Same position as the blob
          left, // Same position as the blob
          width: `${size * 1.1}px`, // Shadow slightly larger than blob
          height: `${size * 0.25}px`, // Flatter shadow for 3D effect
          borderRadius: '50%', // Oval shadow
          background: shadowColor,
          opacity: 5, // More subtle shadow
          filter: 'blur(20px)', // Increased blur for softer shadow
          // No separate animation - we'll use CSS to keep it related to the blob
          zIndex: -2, // Below the blob
        }
      });
    }
    return generatedBlobs;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blobCount, minMaxSize[0], minMaxSize[1], minMaxDuration[0], minMaxDuration[1]]);

  // Container for blobs and their linked shadows
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        overflow: 'hidden', // Crucial for wider positioning
        pointerEvents: 'none',
      }}
    >
      {blobs.map((blob) => {
        // Extract animation properties
        const animMatch = blob.style.animation.match(/([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)/);
        if (!animMatch) return null;
        
        // Get the animation name, duration, etc.
        const [_, animName, animDuration, animTiming, animDelay] = animMatch;
        
        return (
          <React.Fragment key={blob.id}>
            {/* Create a container that holds both blob and shadow and applies animation */}
            <Box
              sx={{
                position: 'absolute',
                top: blob.style.top,
                left: blob.style.left,
                width: blob.style.width,
                height: blob.style.height,
                animation: blob.style.animation,
                transform: 'translate(-50%, -50%)',
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                },
              }}
            >
              {/* Shadow element - follows the container's animation */}
              <Box
                id={blob.shadowId}
                sx={{
                  ...blob.shadowStyle,
                  position: 'absolute',
                  top: 'auto', // Override the top from shadowStyle
                  left: '50%', // Center horizontally
                  bottom: '-40%', // Position below the blob
                  transform: 'translateX(-50%)', // Center the shadow
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                  },
                }}
              />
              
              {/* Actual blob */}
              <Box
                id={blob.id}
                sx={{
                  ...blob.style,
                  position: 'absolute',
                  top: '50%', // Center in the container
                  left: '50%', // Center in the container
                  animation: 'none', // Remove animation as the container now handles it
                  transform: `translate(-50%, -50%) rotate(${(blob.style.transform || '').match(/rotate\(([^)]+)\)/)?.[1] || '0deg'})`,
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                  },
                }}
              />
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default FloatingBlobs;

// Helper function (keep as is)
function shadeColor(color: string, percent: number): string {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);
    R = parseInt(String(R * (100 + percent) / 100)); G = parseInt(String(G * (100 + percent) / 100)); B = parseInt(String(B * (100 + percent) / 100));
    R = (R<255)?R:255; G = (G<255)?G:255; B = (B<255)?B:255;
    R = Math.max(0, R); G = Math.max(0, G); B = Math.max(0, B);
    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    return "#"+RR+GG+BB;
}