"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AURORA_FRAG, AURORA_VERT } from "./auroraShader";
import { useMotionTier } from "@/lib/useMotionTier";

const HOME_GRADIENT =
  "radial-gradient(120% 120% at 50% 42%, #4b2e8a 0%, #c13b8f 45%, #ff6b7a 80%, #fbb8b0 100%)";

function AuroraPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uC1: { value: new THREE.Color("#3a2a6b") },
      uC2: { value: new THREE.Color("#4b2e8a") },
      uC3: { value: new THREE.Color("#c13b8f") },
      uC4: { value: new THREE.Color("#ff6b7a") },
      uC5: { value: new THREE.Color("#fbb8b0") },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    mat.current.uniforms.uAspect.value = size.width / size.height;
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={mat}
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </ScreenQuad>
  );
}

export function AuroraBackground() {
  const { reduced } = useMotionTier();

  // Reduced-motion / low-power: static gradient, no WebGL. Never stutters.
  if (reduced) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: HOME_GRADIENT }}
      />
    );
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10" style={{ background: "#1a1030" }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        frameloop="always"
        style={{ width: "100%", height: "100%" }}
      >
        <AuroraPlane />
      </Canvas>
    </div>
  );
}
