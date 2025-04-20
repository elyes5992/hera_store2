// src/components/BackgroundShapes.tsx
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

interface BackgroundShapesProps {
  variant?: "default" | "product" | "contact";
}

const BackgroundShapes: React.FC<BackgroundShapesProps> = ({
  variant = "default",
}) => {
  

  

  // --- Default Variant Modifications (Enhanced Shadow) ---
  if (variant === "default") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Large flowing blob - top right */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: { xs: "250px", md: "500px" },
            height: { xs: "250px", md: "500px" },
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
            background:
              "linear-gradient(135deg, rgba(255, 140, 0, 0.6) 0%, rgba(255, 165, 0, 0.5) 100%)",
            // Added offset (5px 8px), increased blur (25px), increased alpha (0.5)
            filter: "drop-shadow(5px 8px 25px rgba(80, 40, 0, 0.5))",
            transform: `translate(${scrollY * 0.03}px, ${
              scrollY * -0.02
            }px) scale(${1 + scrollY * 0.0002})`,
            transition: "transform 0.3s ease-out",
            animation: "float 15s ease-in-out infinite",
            "@keyframes float": {
              "0%": {
                transform: `translate(${scrollY * 0.03}px, ${
                  scrollY * -0.02
                }px) scale(${1 + scrollY * 0.0002})`,
              },
              "50%": {
                transform: `translate(${-30 + scrollY * 0.03}px, ${
                  30 + scrollY * -0.02
                }px) scale(${1.05 + scrollY * 0.0002})`,
              },
              "100%": {
                transform: `translate(${scrollY * 0.03}px, ${
                  scrollY * -0.02
                }px) scale(${1 + scrollY * 0.0002})`,
              },
            },
          }}
        />

        {/* Medium blob - bottom left */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-5%",
            left: "-10%",
            width: { xs: "200px", md: "400px" },
            height: { xs: "200px", md: "400px" },
            borderRadius: "30% 70% 50% 50% / 60% 30% 70% 40%",
            background:
              "linear-gradient(135deg, rgba(255, 165, 0, 0.7) 0%, rgba(255, 180, 90, 0.6) 100%)",
            // Added offset (6px 6px), increased blur (25px), increased alpha (0.5)
            filter: "drop-shadow(6px 6px 25px rgba(100, 60, 0, 0.5))",
            transform: `translate(${scrollY * -0.02}px, ${scrollY * 0.01}px)`,
            transition: "transform 0.3s ease-out",
            animation: "float2 18s ease-in-out infinite",
            "@keyframes float2": {
              "0%": {
                transform: `translate(${scrollY * -0.02}px, ${
                  scrollY * 0.01
                }px) scale(1)`,
              },
              "50%": {
                transform: `translate(${30 + scrollY * -0.02}px, ${
                  -20 + scrollY * 0.01
                }px) scale(0.95)`,
              },
              "100%": {
                transform: `translate(${scrollY * -0.02}px, ${
                  scrollY * 0.01
                }px) scale(1)`,
              },
            },
          }}
        />

        {/* Small circle - middle right */}
        <Box
          sx={{
            position: "absolute",
            top: "35%",
            right: "5%",
            width: { xs: "80px", md: "180px" },
            height: { xs: "80px", md: "180px" },
            borderRadius: "50%",
            background: "rgba(255, 186, 96, 0.6)",
            // Added offset (4px 4px), increased blur (20px), increased alpha (0.5)
            filter: "drop-shadow(4px 4px 20px rgba(120, 80, 40, 0.5))",
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.03}px)`,
            transition: "transform 0.3s ease-out",
            animation: "float3 20s ease-in-out infinite",
            "@keyframes float3": {
              "0%": {
                transform: `translate(${scrollY * 0.05}px, ${
                  scrollY * 0.03
                }px) rotate(0deg)`,
              },
              "50%": {
                transform: `translate(${-20 + scrollY * 0.05}px, ${
                  20 + scrollY * 0.03
                }px) rotate(5deg)`,
              },
              "100%": {
                transform: `translate(${scrollY * 0.05}px, ${
                  scrollY * 0.03
                }px) rotate(0deg)`,
              },
            },
          }}
        />

        {/* Small blob - top left */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: { xs: "100px", md: "150px" },
            height: { xs: "100px", md: "150px" },
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            background: "rgba(255, 140, 0, 0.55)",
            // Added offset (3px 5px), increased blur (18px), increased alpha (0.4)
            filter: "drop-shadow(3px 5px 18px rgba(80, 40, 0, 0.4))",
            transform: `translate(${scrollY * -0.04}px, ${
              scrollY * 0.02
            }px) rotate(${scrollY * 0.02}deg)`,
            transition: "transform 0.3s ease-out",
            animation: "float4 22s ease-in-out infinite",
            "@keyframes float4": {
              "0%": {
                transform: `translate(${scrollY * -0.04}px, ${
                  scrollY * 0.02
                }px) rotate(${scrollY * 0.02}deg)`,
              },
              "50%": {
                transform: `translate(${20 + scrollY * -0.04}px, ${
                  20 + scrollY * 0.02
                }px) rotate(${-5 + scrollY * 0.02}deg)`,
              },
              "100%": {
                transform: `translate(${scrollY * -0.04}px, ${
                  scrollY * 0.02
                }px) rotate(${scrollY * 0.02}deg)`,
              },
            },
          }}
        />
        
        {/* Small blob - top top left */}
        <Box
          sx={{
            position: "absolute",
            top: "1%", // Position slightly lower and more inset
            left: "5%", // Position slightly lower and more inset
            width: { xs: "180px", md: "390px" }, // Different size
            height: { xs: "180px", md: "370px" },
            borderRadius: "40% 60% 65% 35% / 55% 40% 60% 45%", // Different shape
            background:
              "linear-gradient(100deg, rgba(255, 165, 0, 0.5) 0%, rgba(255, 180, 90, 0.4) 100%)", // Slightly different gradient/colors
            filter: "drop-shadow(4px 4px 20px rgba(100, 60, 0, 0.7))", // Different shadow
            transform: `translate(${scrollY * -0.01}px, ${scrollY * 0.04}px)`, // Different scroll effect
            transition: "transform 0.3s ease-out",
            animation: "floatTopRight2 19s ease-in-out infinite alternate", // Different animation name, duration, direction
            "@keyframes floatTopRight2": {
              // Unique keyframe name
              "0%": {
                transform: `translate(${scrollY * -0.01}px, ${
                  scrollY * 0.04
                }px) scale(1)`,
              },
              "100%": {
                transform: `translate(${15 + scrollY * -0.01}px, ${
                  -25 + scrollY * 0.04
                }px) scale(1.03)`,
              }, // Different movement
            },
          }}
        />

        

        {/* Diamond shape - mid right */}
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            right: "20%",
            width: { xs: "70px", md: "120px" },
            height: { xs: "70px", md: "120px" },
            transform: `translate(${scrollY * 0.04}px, ${
              scrollY * -0.01
            }px) rotate(45deg)`,
            transition: "transform 0.3s ease-out",
            background: "rgba(255, 200, 150, 0.45)",
            // Added offset (5px 5px), increased blur (15px), increased alpha (0.4)
            filter: "drop-shadow(5px 5px 15px rgba(100, 80, 60, 0.4))",
            animation: "float6 17s ease-in-out infinite",
            "@keyframes float6": {
              "0%": {
                transform: `translate(${scrollY * 0.04}px, ${
                  scrollY * -0.01
                }px) rotate(45deg)`,
              },
              "50%": {
                transform: `translate(${-10 + scrollY * 0.04}px, ${
                  10 + scrollY * -0.01
                }px) rotate(50deg)`,
              },
              "100%": {
                transform: `translate(${scrollY * 0.04}px, ${
                  scrollY * -0.01
                }px) rotate(45deg)`,
              },
            },
          }}
        />
      </Box>
    );
  }

  // --- Product Variant Modifications (Enhanced Shadow) ---
  if (variant === "product") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Large rectangle - top right */}
        <Box
          sx={{
            position: "absolute",
            top: "-5%",
            right: "-5%",
            width: { xs: "150px", md: "300px" },
            height: { xs: "150px", md: "300px" },
            transform: `translate(${scrollY * 0.02}px, ${
              scrollY * -0.01
            }px) rotate(25deg)`,
            transition: "transform 0.3s ease-out",
            borderRadius: "50px",
            background:
              "linear-gradient(135deg, rgba(255, 140, 0, 0.55) 0%, rgba(255, 165, 0, 0.45) 100%)",
            // Added offset (6px 8px), increased blur (25px), increased alpha (0.45)
            filter: "drop-shadow(6px 8px 25px rgba(80, 40, 0, 0.45))",
            animation: "floatProd1 20s ease-in-out infinite",
            "@keyframes floatProd1": {
              "0%": {
                transform: `translate(${scrollY * 0.02}px, ${
                  scrollY * -0.01
                }px) rotate(25deg)`,
              },
              "50%": {
                transform: `translate(${-10 + scrollY * 0.02}px, ${
                  10 + scrollY * -0.01
                }px) rotate(30deg)`,
              },
              "100%": {
                transform: `translate(${scrollY * 0.02}px, ${
                  scrollY * -0.01
                }px) rotate(25deg)`,
              },
            },
          }}
        />

        {/* Circle - bottom left */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: { xs: "180px", md: "320px" },
            height: { xs: "180px", md: "320px" },
            borderRadius: "50%",
            background: "rgba(255, 165, 0, 0.6)",
            // Added offset (5px 5px), increased blur (22px), increased alpha (0.5)
            filter: "drop-shadow(5px 5px 22px rgba(100, 60, 0, 0.5))",
            transform: `translate(${scrollY * -0.01}px, ${scrollY * 0.02}px)`,
            transition: "transform 0.3s ease-out",
            animation: "floatProd2 18s ease-in-out infinite",
            "@keyframes floatProd2": {
              "0%": {
                transform: `translate(${scrollY * -0.01}px, ${
                  scrollY * 0.02
                }px) scale(1)`,
              },
              "50%": {
                transform: `translate(${15 + scrollY * -0.01}px, ${
                  -15 + scrollY * 0.02
                }px) scale(0.97)`,
              },
              "100%": {
                transform: `translate(${scrollY * -0.01}px, ${
                  scrollY * 0.02
                }px) scale(1)`,
              },
            },
          }}
        />

        {/* Small circles grid pattern - added offset, increased blur/alpha */}
        {[
          {
            top: "25%",
            right: "15%",
            size: { xs: 70, md: 120 },
            color: "rgba(255, 180, 90, 0.45)",
            offset: "4px 4px",
            blur: "18px",
            shadowAlpha: 0.4,
            xFactor: 0.03,
            yFactor: -0.02,
          },
          {
            top: "20%",
            left: "25%",
            size: { xs: 60, md: 90 },
            color: "rgba(255, 140, 0, 0.4)",
            offset: "3px 5px",
            blur: "15px",
            shadowAlpha: 0.35,
            xFactor: -0.025,
            yFactor: 0.015,
          },
          {
            top: "65%",
            right: "25%",
            size: { xs: 60, md: 100 },
            color: "rgba(255, 165, 0, 0.45)",
            offset: "4px 6px",
            blur: "16px",
            shadowAlpha: 0.4,
            xFactor: 0.02,
            yFactor: 0.025,
          },
          {
            top: "75%",
            left: "30%",
            size: { xs: 100, md: 180 },
            color: "rgba(255, 200, 120, 0.35)",
            offset: "5px 5px",
            blur: "20px",
            shadowAlpha: 0.3,
            xFactor: -0.015,
            yFactor: 0.01,
          },
        ].map((circle, index) => (
          <Box
            key={`circle-${index}`}
            sx={{
              position: "absolute",
              top: circle.top,
              ...(circle.right
                ? { right: circle.right }
                : { left: circle.left }),
              width: { xs: `${circle.size.xs}px`, md: `${circle.size.md}px` },
              height: { xs: `${circle.size.xs}px`, md: `${circle.size.md}px` },
              borderRadius: "50%",
              background: circle.color,
              // Updated filter generation
              filter: `drop-shadow(${circle.offset} ${circle.blur} rgba(80, 50, 20, ${circle.shadowAlpha}))`,
              transform: `translate(${scrollY * circle.xFactor}px, ${
                scrollY * circle.yFactor
              }px)`,
              transition: "transform 0.3s ease-out",
              animation: `floatProdCircle${index} ${
                15 + index * 2
              }s ease-in-out infinite`,
              [`@keyframes floatProdCircle${index}`]: {
                "0%": {
                  transform: `translate(${scrollY * circle.xFactor}px, ${
                    scrollY * circle.yFactor
                  }px) scale(1)`,
                },
                "50%": {
                  transform: `translate(${
                    (index % 2 ? 10 : -10) + scrollY * circle.xFactor
                  }px, ${
                    (index % 2 ? -10 : 10) + scrollY * circle.yFactor
                  }px) scale(${1 + (index % 2 ? 0.05 : -0.05)})`,
                },
                "100%": {
                  transform: `translate(${scrollY * circle.xFactor}px, ${
                    scrollY * circle.yFactor
                  }px) scale(1)`,
                },
              },
            }}
          />
        ))}

        {/* Triangular accent */}
        <Box
          sx={{
            position: "absolute",
            bottom: "30%",
            left: "15%",
            width: { xs: "80px", md: "140px" },
            height: { xs: "80px", md: "140px" },
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            background: "rgba(255, 180, 90, 0.5)",
            // Added offset (0 6px), increased blur (18px), increased alpha (0.4)
            filter: "drop-shadow(0px 6px 18px rgba(100, 70, 30, 0.4))",
            transform: `translate(${scrollY * -0.03}px, ${
              scrollY * 0.01
            }px) rotate(${180 + scrollY * 0.02}deg)`,
            transition: "transform 0.3s ease-out",
            animation: "floatTriangle 22s ease-in-out infinite",
            "@keyframes floatTriangle": {
              "0%": {
                transform: `translate(${scrollY * -0.03}px, ${
                  scrollY * 0.01
                }px) rotate(${180 + scrollY * 0.02}deg)`,
              },
              "50%": {
                transform: `translate(${-15 + scrollY * -0.03}px, ${
                  10 + scrollY * 0.01
                }px) rotate(${190 + scrollY * 0.02}deg)`,
              },
              "100%": {
                transform: `translate(${scrollY * -0.03}px, ${
                  scrollY * 0.01
                }px) rotate(${180 + scrollY * 0.02}deg)`,
              },
            },
          }}
        />
      </Box>
    );
  }

  // --- Contact Variant Modifications (Enhanced Shadow) ---
  // Kept shadows more subtle than default/product but still enhanced
  if (variant === "contact") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Soft large blob - top right */}
        <Box
          sx={{
            position: "absolute",
            top: "-5%",
            right: "-10%",
            width: { xs: "250px", md: "450px" },
            height: { xs: "250px", md: "450px" },
            borderRadius: "70% 30% 50% 50% / 40% 60% 40% 60%",
            background:
              "linear-gradient(135deg, rgba(255, 140, 0, 0.4) 0%, rgba(255, 165, 0, 0.3) 100%)",
            // Added offset (4px 6px), increased blur (30px), increased alpha (0.3)
            filter: "drop-shadow(4px 6px 30px rgba(80, 40, 0, 0.3))",
            transform: `translate(${scrollY * 0.01}px, ${scrollY * -0.005}px)`,
            transition: "transform 0.3s ease-out",
            animation: "floatContact1 25s ease-in-out infinite",
            "@keyframes floatContact1": {
              "0%": {
                transform: `translate(${scrollY * 0.01}px, ${
                  scrollY * -0.005
                }px) scale(1)`,
              },
              "50%": {
                transform: `translate(${-20 + scrollY * 0.01}px, ${
                  15 + scrollY * -0.005
                }px) scale(1.03)`,
              },
              "100%": {
                transform: `translate(${scrollY * 0.01}px, ${
                  scrollY * -0.005
                }px) scale(1)`,
              },
            },
          }}
        />

        {/* Subtle blob - bottom left */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: { xs: "200px", md: "350px" },
            height: { xs: "200px", md: "350px" },
            borderRadius: "50% 50% 30% 70% / 50% 50% 70% 30%",
            background: "rgba(255, 165, 0, 0.35)",
            // Added offset (5px 5px), increased blur (25px), increased alpha (0.25)
            filter: "drop-shadow(5px 5px 25px rgba(100, 60, 0, 0.25))",
            transform: `translate(${scrollY * -0.008}px, ${scrollY * 0.004}px)`,
            transition: "transform 0.3s ease-out",
            animation: "floatContact2 30s ease-in-out infinite",
            "@keyframes floatContact2": {
              "0%": {
                transform: `translate(${scrollY * -0.008}px, ${
                  scrollY * 0.004
                }px) scale(1)`,
              },
              "50%": {
                transform: `translate(${15 + scrollY * -0.008}px, ${
                  -10 + scrollY * 0.004
                }px) scale(0.98)`,
              },
              "100%": {
                transform: `translate(${scrollY * -0.008}px, ${
                  scrollY * 0.004
                }px) scale(1)`,
              },
            },
          }}
        />

        {/* Minimal accent circles */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: { xs: "80px", md: "120px" },
            height: { xs: "80px", md: "120px" },
            borderRadius: "50%",
            background: "rgba(255, 180, 90, 0.3)",
            // Added offset (3px 3px), increased blur (20px), increased alpha (0.25)
            filter: "drop-shadow(3px 3px 20px rgba(120, 80, 40, 0.25))",
            transform: `translate(${scrollY * -0.015}px, ${scrollY * 0.01}px)`,
            transition: "transform 0.3s ease-out",
            animation: "floatContactCircle 20s ease-in-out infinite",
            "@keyframes floatContactCircle": {
              "0%": {
                transform: `translate(${scrollY * -0.015}px, ${
                  scrollY * 0.01
                }px) scale(1)`,
              },
              "50%": {
                transform: `translate(${-10 + scrollY * -0.015}px, ${
                  10 + scrollY * 0.01
                }px) scale(1.05)`,
              },
              "100%": {
                transform: `translate(${scrollY * -0.015}px, ${
                  scrollY * 0.01
                }px) scale(1)`,
              },
            },
          }}
        />

        {/* Subtle rectangle accent */}
        <Box
          sx={{
            position: "absolute",
            bottom: "30%",
            right: "15%",
            width: { xs: "70px", md: "100px" },
            height: { xs: "70px", md: "100px" },
            borderRadius: "25px",
            background: "rgba(255, 200, 120, 0.3)",
            // Added offset (4px 4px), increased blur (18px), increased alpha (0.25)
            filter: "drop-shadow(4px 4px 18px rgba(100, 80, 60, 0.25))",
            transform: `translate(${scrollY * 0.012}px, ${
              scrollY * 0.006
            }px) rotate(10deg)`,
            transition: "transform 0.3s ease-out",
            animation: "floatContactRect 22s ease-in-out infinite",
            "@keyframes floatContactRect": {
              "0%": {
                transform: `translate(${scrollY * 0.012}px, ${
                  scrollY * 0.006
                }px) rotate(10deg)`,
              },
              "50%": {
                transform: `translate(${10 + scrollY * 0.012}px, ${
                  -5 + scrollY * 0.006
                }px) rotate(15deg)`,
              },
              "100%": {
                transform: `translate(${scrollY * 0.012}px, ${
                  scrollY * 0.006
                }px) rotate(10deg)`,
              },
            },
          }}
        />
      </Box>
    );
  }

  return null;
};

export default BackgroundShapes;
