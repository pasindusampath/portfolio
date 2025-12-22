'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

interface Particle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
}

const PARTICLE_COUNT = 65;
const CONNECTION_DISTANCE = 3.5;
const PARTICLE_SIZE = 0.08;
const MOVEMENT_SPEED = 0.075; // Reduced by 50% for calmer, more stable motion
const MOUSE_INFLUENCE = 0.5;
const BACKGROUND_COLOR = '#1a1a1a'; // Deep slate grey for professional SaaS look
const PARTICLE_COLOR = '#6b9080'; // Subtle sage green instead of bright neon

function NetworkParticles() {
    const particlesRef = useRef<THREE.InstancedMesh>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0 });
    const currentRotation = useRef({ x: 0, y: 0 });

    // Generate random particles with velocities
    const particles = useMemo<Particle[]>(() => {
        const temp: Particle[] = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 25,  // Expanded from 15 to 25
                    (Math.random() - 0.5) * 15,  // Expanded from 10 to 15
                    (Math.random() - 0.5) * 12   // Expanded from 8 to 12
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * MOVEMENT_SPEED,
                    (Math.random() - 0.5) * MOVEMENT_SPEED,
                    (Math.random() - 0.5) * MOVEMENT_SPEED
                ),
            });
        }
        return temp;
    }, []);

    // Mouse move handler
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mousePos.current = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1,
            };

            // Update target rotation based on mouse position
            targetRotation.current = {
                x: mousePos.current.y * MOUSE_INFLUENCE,
                y: mousePos.current.x * MOUSE_INFLUENCE,
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state, delta) => {
        if (!particlesRef.current || !linesRef.current) return;

        const matrix = new THREE.Matrix4();
        const linePositions: number[] = [];
        const lineColors: number[] = [];

        // Smoothly interpolate camera rotation
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

        // Update particle positions and create instances
        particles.forEach((particle, i) => {
            // Update position with velocity
            particle.position.add(particle.velocity.clone().multiplyScalar(delta));

            // Boundary checking with smooth bounce
            ['x', 'y', 'z'].forEach((axis) => {
                const key = axis as 'x' | 'y' | 'z';
                const bounds = key === 'x' ? 12.5 : key === 'y' ? 7.5 : 6;  // Expanded boundaries

                if (Math.abs(particle.position[key]) > bounds) {
                    particle.velocity[key] *= -1;
                    particle.position[key] = Math.sign(particle.position[key]) * bounds;
                }
            });

            // Set instance matrix
            matrix.setPosition(particle.position);
            particlesRef.current!.setMatrixAt(i, matrix);

            // Calculate connections to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const distance = particle.position.distanceTo(particles[j].position);

                if (distance < CONNECTION_DISTANCE) {
                    // Add line vertices
                    linePositions.push(
                        particle.position.x,
                        particle.position.y,
                        particle.position.z,
                        particles[j].position.x,
                        particles[j].position.y,
                        particles[j].position.z
                    );

                    // Calculate opacity based on distance (closer = more opaque)
                    const opacity = 1 - distance / CONNECTION_DISTANCE;
                    const color = new THREE.Color(PARTICLE_COLOR); // Subtle sage green

                    // Add color with opacity for both vertices
                    lineColors.push(color.r, color.g, color.b, opacity);
                    lineColors.push(color.r, color.g, color.b, opacity);
                }
            }
        });

        particlesRef.current.instanceMatrix.needsUpdate = true;

        // Update line geometry
        const lineGeometry = linesRef.current.geometry;
        lineGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePositions, 3)
        );
        lineGeometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(lineColors, 4)
        );

        // Apply smooth camera rotation based on mouse
        state.camera.rotation.x = currentRotation.current.x * 0.1;
        state.camera.rotation.y = currentRotation.current.y * 0.1;
    });

    return (
        <group>
            {/* Particle instances */}
            <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
                <sphereGeometry args={[PARTICLE_SIZE, 16, 16]} />
                <meshBasicMaterial color={PARTICLE_COLOR} />
            </instancedMesh>

            {/* Connection lines */}
            <lineSegments ref={linesRef}>
                <bufferGeometry />
                <lineBasicMaterial
                    vertexColors
                    transparent
                    opacity={0.6}
                    blending={THREE.NormalBlending}
                />
            </lineSegments>
        </group>
    );
}

export default function NetworkHero() {
    return (
        <div className="fixed inset-0 -z-10" style={{ backgroundColor: BACKGROUND_COLOR }}>
            <Canvas
                camera={{ position: [0, 0, 12], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                }}
            >
                {/* Subtle fog for depth without darkness */}
                <fog attach="fog" args={[BACKGROUND_COLOR, 10, 25]} />
                <NetworkParticles />
            </Canvas>
        </div>
    );
}
