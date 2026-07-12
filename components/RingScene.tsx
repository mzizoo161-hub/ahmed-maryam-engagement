"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
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

      object.castShadow = true;
      object.receiveShadow = true;

      if (Array.isArray(object.material)) {
        object.material.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.envMapIntensity = 2.5;
            material.needsUpdate = true;
          }
        });
      } else if (object.material instanceof THREE.MeshStandardMaterial) {
        object.material.envMapIntensity = 2.5;
        object.material.needsUpdate = true;
      }
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

    ringRef.current.rotation.y += delta * 0.28;

    ringRef.current.rotation.x =
      -0.12 + Math.sin(time * 0.65) * 0.035;

    ringRef.current.rotation.z =
      Math.sin(time * 0.45) * 0.02;

    ringRef.current.position.y =
      -0.28 + Math.sin(time * 0.8) * 0.055;
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
      <torusGeometry args={[0.7, 0.07, 32, 120]} />

      <meshStandardMaterial
        color="#d4af37"
        metalness={1}
        roughness={0.18}
      />
    </mesh>
  );
}

export default function RingScene({ onClick }: RingSceneProps) {
  return (
    <div className="relative h-[360px] w-full overflow-hidden md:h-[500px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,217,145,0.38),transparent_60%)] blur-2xl" />

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [0, 0.05, 5.2],
          fov: 36,
        }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.8} />

        <hemisphereLight
          args={["#fff8e8", "#4b3425", 1.2]}
        />

        <directionalLight
          position={[4, 6, 5]}
          intensity={3.5}
          castShadow
        />

        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.7}
          color="#dce8ff"
        />

        <spotLight
          position={[0, 5, 4]}
          intensity={4.2}
          angle={0.38}
          penumbra={1}
          castShadow
        />

        <pointLight
          position={[2.5, 1.2, 3]}
          intensity={1.7}
          color="#ffe7ae"
        />

        <Suspense fallback={<LoadingRing />}>
          <Float
            speed={1.05}
            rotationIntensity={0.03}
            floatIntensity={0.08}
          >
            <RealRing onClick={onClick} />
          </Float>
        </Suspense>

        <Sparkles
          count={18}
          scale={[3, 2.5, 2]}
          size={1.7}
          speed={0.22}
          opacity={0.45}
          color="#e4be67"
        />

        <Environment preset="studio" />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-[#8b7159]">
        Touch the ring
      </p>
    </div>
  );
}

useGLTF.preload("/models/ring.glb");