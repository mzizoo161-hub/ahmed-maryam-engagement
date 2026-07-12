"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
} from "react";

type RingSceneProps = {
  onClick?: () => void;
};

type ModelViewerElement = HTMLElement;

type PointerPosition = {
  x: number;
  y: number;
};

export default function RingScene({
  onClick,
}: RingSceneProps) {
  const modelRef = useRef<ModelViewerElement | null>(null);

  const [viewerReady, setViewerReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pointerStart = useRef<PointerPosition>({
    x: 0,
    y: 0,
  });

  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    const mobile =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches;

    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    let active = true;

    import("@google/model-viewer")
      .then(() => {
        if (active) {
          setViewerReady(true);
        }
      })
      .catch((error) => {
        console.error(
          "Could not load the 3D ring viewer:",
          error
        );
      });

    return () => {
      active = false;

      if (resumeTimer.current !== null) {
        window.clearTimeout(resumeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const viewer = modelRef.current;

    if (!viewer || !viewerReady) return;

    const handleLoad = () => {
      setModelLoaded(true);
    };

    viewer.addEventListener("load", handleLoad);

    return () => {
      viewer.removeEventListener("load", handleLoad);
    };
  }, [viewerReady]);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    const viewer = modelRef.current;

    if (viewer) {
      viewer.removeAttribute("auto-rotate");
    }

    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    const distanceX = Math.abs(
      event.clientX - pointerStart.current.x
    );

    const distanceY = Math.abs(
      event.clientY - pointerStart.current.y
    );

    const wasTap = distanceX < 8 && distanceY < 8;

    if (wasTap) {
      onClick?.();
      return;
    }

    const viewer = modelRef.current;

    if (!viewer) return;

    resumeTimer.current = window.setTimeout(() => {
      viewer.setAttribute("auto-rotate", "");
    }, 1800);
  };

  const handlePointerCancel = () => {
    const viewer = modelRef.current;

    if (!viewer) return;

    resumeTimer.current = window.setTimeout(() => {
      viewer.setAttribute("auto-rotate", "");
    }, 1800);
  };

  const modelViewer = viewerReady
    ? createElement("model-viewer", {
        ref: (element: HTMLElement | null) => {
          modelRef.current =
            element as ModelViewerElement | null;
        },

        src: "/models/ring.glb",

        alt: "Interactive golden diamond engagement ring",

        "camera-controls": true,
        "auto-rotate": true,
        "auto-rotate-delay": isMobile ? "1800" : "1200",
        "rotation-per-second": isMobile
          ? "4deg"
          : "7deg",

        "interaction-prompt": "none",
        "touch-action": "none",

        "camera-orbit": "0deg 72deg 105%",
        "min-camera-orbit": "auto 5deg 70%",
        "max-camera-orbit": "auto 175deg 150%",

        "field-of-view": "30deg",
        "min-field-of-view": "24deg",
        "max-field-of-view": "38deg",

        exposure: "1.16",
        "environment-image": "neutral",
        "shadow-intensity": "0",

        loading: "eager",
        reveal: "auto",

        onPointerDown: handlePointerDown,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerCancel,

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
          cursor: "grab",
          contain: "layout paint size",
        },
      })
    : null;

  return (
    <div
      className="relative mx-auto h-[330px] w-full md:h-[500px]"
      style={{
        background:
          "radial-gradient(circle at center, rgba(227,190,112,0.16), transparent 62%)",
        contain: "layout paint size",
      }}
    >
      {!modelLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#c7a16d]/30 border-t-[#8d6945]" />
        </div>
      )}

      {modelViewer}

      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-[#8b7159] md:text-xs">
        Touch the ring
      </p>
    </div>
  );
}