import React, { Suspense, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls, Environment } from '@react-three/drei';

function Model(props) {
  const { scene } = useGLTF('/ferrari.glb');

  useLayoutEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        // The three.js ferrari body mesh is typically "body"
        // Also target any red paint to be safe, repainting it to a sleek metallic silver
        if (node.material.name.toLowerCase().includes('body') || 
            node.material.name.toLowerCase().includes('paint')) {
          node.material.color.set('#D4D4D8'); // Silver/Zinc
          node.material.metalness = 0.9;
          node.material.roughness = 0.1;
          node.material.clearcoat = 1.0;
          node.material.clearcoatRoughness = 0.1;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
}

export default function CarModel() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.5, 6], fov: 35 }} className="cursor-grab active:cursor-grabbing">
      <Suspense fallback={null}>
        <Environment preset="studio" intensity={1.5} />
        
        <PresentationControls 
          speed={1.5} 
          global 
          zoom={1.2} 
          polar={[-0.1, 0.2]} 
          azimuth={[-Math.PI / 3, Math.PI / 3]}
        >
          <Stage environment={null} intensity={1} contactShadow opacity={0.5} adjustCamera={0.7}>
            <Model scale={1} />
          </Stage>
        </PresentationControls>
      </Suspense>
    </Canvas>
  );
}
// Preload the model for performance
useGLTF.preload('/ferrari.glb');
