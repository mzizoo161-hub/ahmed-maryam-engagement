"use client";

import { motion } from "framer-motion";
import { createElement, useEffect, useRef, useState } from "react";

type RingSceneProps = {
  onClick?: () => void;
};

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string;
  fieldOfView: string;
  resetTurntableRotation?: () => void;
};

export default function RingScene({ onClick }: RingSceneProps) {
  const modelRef = useRef<ModelViewerElement | null>(null);

  const [viewerReady, setViewerReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    import("@google/model-viewer")
      .then(() => {
        if (active) {
          setViewerReady(true);
        }
      })
      .catch((error) => {
        console.error("Could not load the 3D ring viewer:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const model = modelRef.current;

    if (!model || !viewerReady) return;

    const handleLoad = () => {
      setModelLoaded(true);
    };

    model.addEventListener("load", handleLoad);

    return () => {
      model.removeEventListener("load", handleLoad);
    };
  }, [viewerReady]);

  const resetRing = () => {
    const model = modelRef.current;

    if (!model) return;

    model.cameraOrbit = "0deg 72deg 105%";
    model.fieldOfView = "30deg";
    model.resetTurntableRotation?.();
  };

  const modelViewer = viewerReady
    ? createElement("model-viewer", {
        ref: (element: HTMLElement | null) => {
          modelRef.current = element as ModelViewerElement | null;
        },

        src: "/models/ring.glb",
        alt: "Interactive golden diamond engagement ring",

        "camera-controls": true,
        "auto-rotate": true,
        "auto-rotate-delay": "700",
        "rotation-per-second": "14deg",

        "interaction-prompt": "none",
        "touch-action": "pan-y",

        "camera-orbit": "0deg 72deg 105%",
        "min-camera-orbit": "auto 5deg 65%",
        "max-camera-orbit": "auto 175deg 180%",

        "field-of-view": "30deg",
        "min-field-of-view": "20deg",
        "max-field-of-view": "45deg",

        exposure: "1.2",
        "environment-image": "neutral",

        "shadow-intensity": "0",
        loading: "eager",
        reveal: "auto",

        style: {
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          cursor: "grab",
        },
      })
    : null;

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e3be70]/30 blur-[85px] md:h-[390px] md:w-[390px]" />

      <motion.div
        className="relative h-[350px] w-full overflow-hidden rounded-[2rem] border border-white/35 bg-white/10 shadow-[0_25px_70px_rgba(88,61,37,0.13)] md:h-[500px]"
        initial={{
          opacity: 0,
          scale: 0.92,
          y: 25,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {!modelLoaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#f6f0e7]/75 backdrop-blur-sm">
            <div className="text-center">
              <motion.div
                className="mx-auto h-11 w-11 rounded-full border-2 border-[#c7a16d]/35 border-t-[#8d6945]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-[#8b7159]">
                Preparing the ring
              </p>
            </div>
          </div>
        )}

        {modelViewer}
      </motion.div>

      <div className="relative z-30 mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <motion.button
          type="button"
          onClick={resetRing}
          className="rounded-full border border-[#aa8966]/45 bg-white/45 px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-[#765b45] shadow-md backdrop-blur-xl"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Reset Ring
        </motion.button>

        <motion.button
          type="button"
          onClick={onClick}
          className="rounded-full bg-[#7d6249] px-8 py-3 text-[10px] uppercase tracking-[0.25em] text-white shadow-[0_14px_32px_rgba(88,61,37,0.25)]"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 42px rgba(88,61,37,0.32)",
          }}
          whileTap={{ scale: 0.96 }}
        >
          Open Invitation
        </motion.button>
      </div>

      <p className="mt-4 text-center text-[9px] uppercase tracking-[0.25em] text-[#92775f] md:text-[10px]">
        Drag in any direction • Pinch to zoom
      </p>
    </div>
  );
}