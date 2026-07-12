"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerformanceMonitor,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type RingSceneProps = {
  onClick?: () => void;
};

function RealRing({ onClick }: RingSceneProps) {
  const ringRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/ring.glb");

  const preparedScene = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = false;
      object.receiveShadow = false;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 1.8;
          material.needsUpdate = true;
        }
      });
    });

    clonedScene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);

    clonedScene.position.sub(center);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const normalizedScale =
      maxDimension > 0 ? 2.1 / maxDimension : 1;

    clonedScene.scale.setScalar(normalizedScale);

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

    ringRef.current.rotation.y += delta * 0.24;
    ringRef.current.rotation.x =
      -0.12 + Math.sin(time * 0.65) * 0.03;
    ringRef.current.rotation.z =
      Math.sin(time * 0.45) * 0.018;
    ringRef.current.position.y =
      -0.28 + Math.sin(time * 0.8) * 0.045;
  });

  return (
    <group
      ref={ringRef}
      position={[0, -0.28, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onPointerEnter={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "default";
      }}
    >
      <primitive object={preparedScene} />
    </group>
  );
}

function LoadingRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.7, 0.07, 24, 80]} />

      <meshStandardMaterial
        color="#d4af37"
        metalness={1}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function RingScene({ onClick }: RingSceneProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const updateDevice = () => {
      const mobile =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      setIsMobile(mobile);
      setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    };

    updateDevice();
    window.addEventListener("resize", updateDevice);

    return () => {
      window.removeEventListener("resize", updateDevice);
    };
  }, []);

  return (
    <div className="relative h-[320px] w-full overflow-hidden md:h-[500px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,217,145,0.32),transparent_60%)] blur-2xl" />

      <Canvas
        dpr={dpr}
        camera={{
          position: [0, 0.05, 5.2],
          fov: 36,
        }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        performance={{
          min: 0.5,
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(0.8)}
          onIncline={() =>
            setDpr(isMobile ? 1 : 1.5)
          }
        />

        <ambientLight intensity={0.9} />

        <hemisphereLight
          args={["#fff8e8", "#4b3425", 1]}
        />

        <directionalLight
          position={[4, 5, 5]}
          intensity={2.8}
        />

        {!isMobile && (
          <pointLight
            position={[2.5, 1.2, 3]}
            intensity={1.2}
            color="#ffe7ae"
          />
        )}

        <Suspense fallback={<LoadingRing />}>
          <RealRing onClick={onClick} />
        </Suspense>

        <Environment
          preset="studio"
          environmentIntensity={isMobile ? 0.65 : 1}
        />
      </Canvas>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-[#8b7159]">
        Touch the ring
      </p>
    </div>
  );
}

useGLTF.preload("/models/ring.glb");