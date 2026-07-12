"use client";

import { createElement, useEffect, useRef, useState } from "react";

type RingSceneProps = {
  onClick?: () => void;
};

type ModelViewerElement = HTMLElement;

export default function RingScene({ onClick }: RingSceneProps) {
  const modelRef = useRef<ModelViewerElement | null>(null);
  const [viewerReady, setViewerReady] = useState(false);

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

  return (
    <div className="relative mx-auto h-[360px] w-full md:h-[500px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,190,112,0.28),transparent_62%)] blur-2xl" />

      {viewerReady &&
        createElement("model-viewer", {
          ref: (element: HTMLElement | null) => {
            modelRef.current = element;
          },

          src: "/models/ring.glb",

          alt: "Interactive golden diamond engagement ring",

          "camera-controls": true,
          "auto-rotate": true,
          "auto-rotate-delay": "700",
          "rotation-per-second": "14deg",

          "interaction-prompt": "none",
          "touch-action": "none",

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

          onClick,

          style: {
            width: "100%",
            height: "100%",
            display: "block",
            background: "transparent",
            border: "none",
            outline: "none",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            cursor: "pointer",
          },
        })}

      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-[#8b7159] md:text-xs">
        Touch the ring
      </p>
    </div>
  );
}