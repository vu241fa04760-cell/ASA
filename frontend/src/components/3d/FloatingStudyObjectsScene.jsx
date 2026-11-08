import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Octahedron, Torus, Sphere } from '@react-three/drei';

const FloatingStudyObjectGroup = () => {
  const crystalRef = useRef();
  const bookRef = useRef();
  const ringRef = useRef();
  const sphereRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (crystalRef.current) {
      crystalRef.current.rotation.x = t * 0.4;
      crystalRef.current.rotation.y = t * 0.6;
    }

    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(t * 0.5) * 0.4;
      bookRef.current.rotation.z = Math.cos(t * 0.3) * 0.15;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.7;
      ringRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group>
      {/* 3D Knowledge Crystal */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2} position={[-2.2, 1.2, 0]}>
        <mesh ref={crystalRef}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#0891B2"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.9}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* 3D Cyber Study Book */}
      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.5} position={[2.2, -1.0, 0]}>
        <group ref={bookRef}>
          {/* Cover */}
          <Box args={[1.4, 1.8, 0.2]}>
            <meshStandardMaterial
              color="#2563EB"
              emissive="#1D4ED8"
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.8}
            />
          </Box>
          {/* Inner pages glow */}
          <Box args={[1.3, 1.7, 0.18]} position={[0.02, 0, 0]}>
            <meshStandardMaterial
              color="#F8FAFC"
              emissive="#38BDF8"
              emissiveIntensity={0.4}
              roughness={0.3}
            />
          </Box>
        </group>
      </Float>

      {/* 3D Neural Ring with electron */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.8} position={[1.8, 1.6, -1]}>
        <group ref={ringRef}>
          <Torus args={[0.8, 0.05, 16, 50]}>
            <meshStandardMaterial color="#0284C7" emissive="#0369A1" emissiveIntensity={0.8} />
          </Torus>
          <Sphere args={[0.15, 16, 16]} position={[0.8, 0, 0]}>
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1} />
          </Sphere>
        </group>
      </Float>

      {/* 3D Graduation Crystal Cube in Cobalt Blue */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.6} position={[-1.8, -1.4, -0.5]}>
        <Box args={[0.8, 0.8, 0.8]}>
          <meshStandardMaterial
            color="#0EA5E9"
            emissive="#0284C7"
            emissiveIntensity={0.7}
            wireframe
          />
        </Box>
      </Float>
    </group>
  );
};

const FloatingStudyObjectsScene = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[5, 5, 5]} intensity={1.8} color="#38BDF8" />
        <pointLight position={[-5, -5, 5]} intensity={1.5} color="#2563EB" />
        <FloatingStudyObjectGroup />
      </Canvas>
    </div>
  );
};

export default FloatingStudyObjectsScene;
