'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIntro } from '../context/intro-context';

const BRAND_PRIMARY = '#e49505';

export const useThreeBackground = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const { speedScale } = useIntro();

  // Mouse coordinate refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.00085);

    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- PARTICLE FIELD SYSTEM ---
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const goldColor = new THREE.Color(BRAND_PRIMARY);
    const darkColor = new THREE.Color(0x353537);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Cylindrical tunnel distribution
      const radius = 150 + Math.random() * 1400;
      const theta = Math.random() * 2 * Math.PI;
      const z = (Math.random() - 0.5) * 3200;

      positions[i] = radius * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(theta);
      positions[i + 2] = z;

      // Gold to slate charcoal interpolation
      const t = Math.random();
      const mixed = goldColor.clone().lerp(darkColor, t);
      colors[i] = mixed.r;
      colors[i + 1] = mixed.g;
      colors[i + 2] = mixed.b;

      sizes[i / 3] = 1 + Math.random() * 2.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- INTERACTIVE MOUSE HANDLERS ---
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize coordinates (-1 to 1)
      mouseRef.current.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION LOOP ---
    let animId: number;
    const animate3D = () => {
      animId = requestAnimationFrame(animate3D);

      // Smoothly interpolate current speeds from speedScale context ref
      const currentSpeedScale = speedScale.current;
      currentSpeedScale.currentSpeed +=
        (currentSpeedScale.targetSpeed - currentSpeedScale.currentSpeed) * 0.055;

      camera.position.z -= currentSpeedScale.currentSpeed;
      particles.rotation.z += currentSpeedScale.rotationSpeed;

      // Parallax mouse movements (tilt particles and camera viewport smoothly)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      particles.rotation.y = mouseRef.current.x * 0.15;
      particles.rotation.x = -mouseRef.current.y * 0.15;

      camera.position.x += (mouseRef.current.x * 120 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y * 120 - camera.position.y) * 0.05;

      // Loop tunnel back
      if (camera.position.z < -1000) {
        camera.position.z = 1000;
      }

      renderer.render(scene, camera);
    };

    animate3D();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, speedScale]);
};
