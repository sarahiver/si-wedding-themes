// src/themes/citrus/components/Citrus3D.js
// 3D Citrus Fruits using React Three Fiber
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// LIME / LEMON MESH
// ============================================
export function CitrusFruit({
  position = [0, 0, 0],
  scale = 1,
  color = '#A4D233',
  speed = 1,
  distort = 0.3,
  floatIntensity = 0.5
}) {
  const meshRef = useRef();
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * floatIntensity;
      // Slow rotation
      meshRef.current.rotation.x += 0.002 * speed;
      meshRef.current.rotation.y += 0.003 * speed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        distort={distort}
        speed={2}
      />
    </Sphere>
  );
}

// ============================================
// LIME SLICE (Flat circle with texture pattern)
// ============================================
export function LimeSlice({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const meshRef = useRef();

  // Create lime slice pattern
  const sliceTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background - lime flesh
    ctx.fillStyle = '#C5E87E';
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.fill();

    // Center
    ctx.fillStyle = '#E8F5C8';
    ctx.beginPath();
    ctx.arc(128, 128, 20, 0, Math.PI * 2);
    ctx.fill();

    // Segments
    ctx.strokeStyle = '#F5FFE8';
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI * 2) / 10;
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(angle) * 20, 128 + Math.sin(angle) * 20);
      ctx.lineTo(128 + Math.cos(angle) * 120, 128 + Math.sin(angle) * 120);
      ctx.stroke();
    }

    // Rind
    ctx.strokeStyle = '#4A7C23';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(128, 128, 122, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} rotation={rotation}>
      <circleGeometry args={[1, 64]} />
      <meshStandardMaterial map={sliceTexture} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ============================================
// FLOATING BUBBLES
// ============================================
export function Bubbles({ count = 20 }) {
  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 5
      ],
      scale: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.5
    }));
  }, [count]);

  return (
    <>
      {bubbles.map((bubble, i) => (
        <Bubble key={i} {...bubble} />
      ))}
    </>
  );
}

function Bubble({ position, scale, speed }) {
  const meshRef = useRef();
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed + position[0]) * 2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 16, 16]} position={position} scale={scale}>
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        roughness={0}
        metalness={0.1}
      />
    </Sphere>
  );
}

// ============================================
// LEAF
// ============================================
export function Leaf({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const meshRef = useRef();

  // Create leaf shape
  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.5, 0.5, 0, 2);
    shape.quadraticCurveTo(-0.5, 0.5, 0, 0);
    return shape;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} rotation={rotation}>
      <shapeGeometry args={[leafShape]} />
      <meshStandardMaterial color="#4A7C23" side={THREE.DoubleSide} />
    </mesh>
  );
}

export default CitrusFruit;
