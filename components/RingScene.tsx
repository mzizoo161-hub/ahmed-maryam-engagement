"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  Sparkles,
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
          material.envMapIntensity = 2.4;
          material.roughness = Math.min(material.roughness, 0.28);
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

  useFrame((state) => {
    if (!ringRef.current) return;

    const time = state.clock.elapsedTime;

    // Only a soft floating movement.
    // OrbitControls handles the rotation and finger dragging.
    ringRef.current.position.y =
      -0.28 + Math.sin(time * 0.8) * 0.045;

    ringRef.current.rotation.z =
      Math.sin(time * 0.45) * 0.018;
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
        document.body.style.cursor = "grab";
      }}
      onPointerDown={() => {
        document.body.style.cursor = "grabbing";
      }}
      onPointerUp={() => {
        document.body.style.cursor = "grab";
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
      <torusGeometry args={[0.7, 0.07, 32, 100]} />

      <meshStandardMaterial
        color="#d4af37"
        metalness={1}
        roughness={0.18}
      />
    </mesh>
  );
}

export default function RingScene({ onClick }: RingSceneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          window.matchMedia("(pointer: coarse)").matches
      );
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return (
    <div className="relative h-[350px] w-full overflow-hidden touch-none md:h-[500px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,217,145,0.38),transparent_60%)] blur-2xl" />

      <Canvas
        dpr={isMobile ? 1.5 : 2}
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
      >
        <ambientLight intensity={0.82} />

        <hemisphereLight
          args={["#fff8e8", "#4b3425", 1.15]}
        />

        <directionalLight
          position={[4, 6, 5]}
          intensity={3.4}
        />

        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.5}
          color="#dce8ff"
        />

        <pointLight
          position={[2.5, 1.2, 3]}
          intensity={1.5}
          color="#ffe7ae"
        />

        <Suspense fallback={<LoadingRing />}>
          <Float
            speed={1}
            rotationIntensity={0.02}
            floatIntensity={0.06}
          >
            <RealRing onClick={onClick} />
          </Float>
        </Suspense>

        <Sparkles
          count={isMobile ? 10 : 18}
          scale={[3, 2.5, 2]}
          size={isMobile ? 1.3 : 1.7}
          speed={0.2}
          opacity={0.4}
          color="#e4be67"
        />

        <Environment
          preset="studio"
          environmentIntensity={isMobile ? 0.9 : 1.1}
        />

        <OrbitControls
          enableRotate
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={isMobile ? 0.75 : 0.55}
          autoRotate
          autoRotateSpeed={0.35}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.85}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.ROTATE,
          }}
        />
      </Canvas>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-[#8b7159]">
        Drag or touch the ring
      </p>
    </div>
  );
}

useGLTF.preload("/models/ring.glb");