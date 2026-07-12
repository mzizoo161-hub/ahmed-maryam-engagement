"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerformanceMonitor,
  useGLTF,
} from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

type RingSceneProps = {
  onClick?: () => void;
};

type DragState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  previousX: number;
  previousY: number;
  totalMovement: number;
};

function RealRing({ onClick }: RingSceneProps) {
  const ringRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/ring.glb");

  const isDragging = useRef(false);

  const dragState = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    previousX: 0,
    previousY: 0,
    totalMovement: 0,
  });

  const targetRotation = useRef({
    x: Math.PI / 2,
    y: 0,
  });

  const preparedScene = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      // Shadows are intentionally disabled because the ring is already
      // detailed and live shadows are expensive on mobile devices.
      object.castShadow = false;
      object.receiveShadow = false;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (
          material instanceof THREE.MeshStandardMaterial ||
          material instanceof THREE.MeshPhysicalMaterial
        ) {
          // Clone each material so we do not mutate the original GLB.
          const clonedMaterial = material.clone();

          clonedMaterial.envMapIntensity = 2.5;
          clonedMaterial.roughness = Math.min(
            clonedMaterial.roughness,
            0.24
          );
          clonedMaterial.needsUpdate = true;

          object.material = clonedMaterial;
        }
      });
    });

    clonedScene.updateMatrixWorld(true);

    // Centre the model.
    const box = new THREE.Box3().setFromObject(clonedScene);
    const centre = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(centre);
    box.getSize(size);

    clonedScene.position.sub(centre);

    // Scale it consistently regardless of the model's original units.
    const largestDimension = Math.max(size.x, size.y, size.z);
    const scale =
      largestDimension > 0 ? 2.1 / largestDimension : 1;

    clonedScene.scale.setScalar(scale);

    return clonedScene;
  }, [scene]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  useFrame((state, delta) => {
    if (!ringRef.current) return;

    const time = state.clock.elapsedTime;

    // Continue slow automatic rotation only when the guest is not dragging.
    if (!isDragging.current) {
      targetRotation.current.y += delta * 0.28;
    }

    // Smoothly move toward the desired rotation.
    ringRef.current.rotation.x = THREE.MathUtils.damp(
      ringRef.current.rotation.x,
      targetRotation.current.x,
      10,
      delta
    );

    ringRef.current.rotation.y = THREE.MathUtils.damp(
      ringRef.current.rotation.y,
      targetRotation.current.y,
      10,
      delta
    );

    // Very small floating movement.
    ringRef.current.position.y =
      -0.28 + Math.sin(time * 0.8) * 0.045;
  });

  const handlePointerDown = (
    event: ThreeEvent<PointerEvent>
  ) => {
    event.stopPropagation();

    isDragging.current = true;

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      previousX: event.clientX,
      previousY: event.clientY,
      totalMovement: 0,
    };

    // Keep receiving movement events even if the finger moves
    // slightly outside the ring geometry.
    event.target.setPointerCapture(event.pointerId);

    document.body.style.cursor = "grabbing";
  };

  const handlePointerMove = (
    event: ThreeEvent<PointerEvent>
  ) => {
    if (
      !isDragging.current ||
      dragState.current.pointerId !== event.pointerId
    ) {
      return;
    }

    event.stopPropagation();

    const deltaX =
      event.clientX - dragState.current.previousX;

    const deltaY =
      event.clientY - dragState.current.previousY;

    dragState.current.previousX = event.clientX;
    dragState.current.previousY = event.clientY;

    dragState.current.totalMovement +=
      Math.abs(deltaX) + Math.abs(deltaY);

    // Horizontal finger movement rotates left/right.
    targetRotation.current.y += deltaX * 0.012;

    // Vertical finger movement flips the ring forward/backward.
    targetRotation.current.x += deltaY * 0.012;
  };

  const handlePointerUp = (
    event: ThreeEvent<PointerEvent>
  ) => {
    if (
      dragState.current.pointerId !== event.pointerId
    ) {
      return;
    }

    event.stopPropagation();

    event.target.releasePointerCapture(event.pointerId);

    const wasTap =
      dragState.current.totalMovement < 8;

    isDragging.current = false;
    dragState.current.pointerId = null;

    document.body.style.cursor = "grab";

    // A short tap opens the invitation.
    // A drag only rotates the ring.
    if (wasTap) {
      onClick?.();
    }
  };

  const handlePointerCancel = (
    event: ThreeEvent<PointerEvent>
  ) => {
    isDragging.current = false;
    dragState.current.pointerId = null;

    try {
      event.target.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer may already have been released.
    }

    document.body.style.cursor = "default";
  };

  return (
    <group
      ref={ringRef}
      position={[0, -0.28, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerEnter={() => {
        document.body.style.cursor = "grab";
      }}
      onPointerLeave={() => {
        if (!isDragging.current) {
          document.body.style.cursor = "default";
        }
      }}
    >
      <primitive object={preparedScene} />
    </group>
  );
}

function LoadingRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.7, 0.07, 32, 100]} />

      <meshStandardMaterial
        color="#d4af37"
        metalness={1}
        roughness={0.18}
      />
    </mesh>
  );
}

export default function RingScene({
  onClick,
}: RingSceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [pixelRatio, setPixelRatio] = useState(2);

  useEffect(() => {
    const detectDevice = () => {
      const mobile =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      setIsMobile(mobile);

      // Start sharply, but never exceed DPR 2.
      // DPR 3 or 4 is unnecessarily expensive for WebGL.
      setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      );
    };

    detectDevice();

    window.addEventListener("resize", detectDevice);

    return () => {
      window.removeEventListener("resize", detectDevice);
    };
  }, []);

  return (
    <div
      className="
        relative
        h-[350px]
        w-full
        overflow-hidden
        touch-none
        select-none
        md:h-[500px]
      "
      style={{
        touchAction: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,rgba(247,217,145,0.38),transparent_60%)]
          blur-2xl
        "
      />

      <Canvas
        dpr={pixelRatio}
        camera={{
          position: [0, 0.05, 5.2],
          fov: 36,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        performance={{
          min: 0.75,
        }}
      >
        <PerformanceMonitor
          // Do not destroy the image quality.
          // Only reduce DPR from 2 to 1.6 if performance is genuinely poor.
          onDecline={() => {
            setPixelRatio((current) =>
              Math.max(1.6, current - 0.2)
            );
          }}
          onIncline={() => {
            const maximum = Math.min(
              window.devicePixelRatio || 1,
              2
            );

            setPixelRatio((current) =>
              Math.min(maximum, current + 0.1)
            );
          }}
        />

        <ambientLight intensity={0.85} />

        <hemisphereLight
          args={["#fff8e8", "#4b3425", 1.15]}
        />

        <directionalLight
          position={[4, 6, 5]}
          intensity={3.35}
        />

        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.45}
          color="#dce8ff"
        />

        <pointLight
          position={[2.5, 1.2, 3]}
          intensity={1.45}
          color="#ffe7ae"
        />

        <Suspense fallback={<LoadingRing />}>
          <RealRing onClick={onClick} />
        </Suspense>

        <Environment
          preset="studio"
          environmentIntensity={isMobile ? 0.95 : 1.1}
        />
      </Canvas>

      <p
        className="
          pointer-events-none
          absolute
          bottom-4
          left-1/2
          -translate-x-1/2
          whitespace-nowrap
          text-[10px]
          uppercase
          tracking-[0.28em]
          text-[#8b7159]
          md:text-xs
        "
      >
        Drag to rotate • Tap to open
      </p>
    </div>
  );
}

useGLTF.preload("/models/ring.glb");