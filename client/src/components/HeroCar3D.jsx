import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import { assets } from "../assets/assets";

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/ferrari.glb";

useGLTF.preload(MODEL_URL);

const CarModel = () => {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} scale={2} position={[0, -0.6, 0]} />;
};

const Fallback = () => (
  <img src={assets.main_car} alt="" className="max-h-74" />
);

const HeroCar3D = () => {
  return (
    <div className="relative w-full h-[260px] md:h-[360px] max-w-3xl select-none">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [4, 1.5, 6], fov: 32 }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.4} />
        <spotLight
          position={[6, 8, 6]}
          angle={0.3}
          penumbra={1}
          intensity={1.1}
          castShadow
        />
        <Suspense fallback={null}>
          <PresentationControls
            global
            polar={[-0.05, 0.05]}
            azimuth={[-Math.PI, Math.PI]}
            config={{ mass: 1, tension: 170, friction: 26 }}
            snap={false}
          >
            <CarModel />
          </PresentationControls>
          <ContactShadows
            position={[0, -0.6, 0]}
            opacity={0.45}
            scale={12}
            blur={2.4}
            far={2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[11px] text-gray-400 pointer-events-none">
        Drag to rotate
      </p>
    </div>
  );
};

export { Fallback as HeroCarFallback };
export default HeroCar3D;
