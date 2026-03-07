import React, { useMemo, useRef } from 'react';
import { Cylinder, Sparkles, Stars, Dodecahedron, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Volcano: React.FC = () => {
    const magmaRefs = useRef<(THREE.Group | null)[]>([]);

    const rockData = useMemo(() => {
        const rocks: { pos: [number, number, number], scale: [number, number, number], rotation: [number, number, number] }[] = [];
        for (let i = 0; i < 45; i++) {
            const r = 4 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            rocks.push({
                pos: [Math.cos(theta) * r, 0, Math.sin(theta) * r],
                scale: [0.6 + Math.random() * 1.8, 0.4 + Math.random() * 2.5, 0.6 + Math.random() * 1.8],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
            });
        }
        return rocks;
    }, []);

    const magmaData = useMemo(() => {
        const magma: { pos: [number, number, number], scale: number, speed: number, offset: number, color: string, emissive: string }[] = [];
        const lavaPalettes = [
            { color: "#661100", emissive: "#992200" }, // Deep Red
            { color: "#802200", emissive: "#cc3300" }, // Burnt Orange
            { color: "#4d0a00", emissive: "#801a00" }, // Dark Maroon
            { color: "#993300", emissive: "#ff5500" }, // Bright Lava
            { color: "#b34700", emissive: "#ff6600" }, // Intense Orange
        ];

        for (let i = 0; i < 15; i++) {
            const r = 2 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const palette = lavaPalettes[Math.floor(Math.random() * lavaPalettes.length)];
            magma.push({
                pos: [Math.cos(theta) * r, -0.1, Math.sin(theta) * r],
                scale: 0.8 + Math.random() * 2,
                speed: 0.5 + Math.random() * 1,
                offset: Math.random() * Math.PI * 2,
                ...palette
            });
        }
        return magma;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        magmaRefs.current.forEach((ref, i) => {
            if (ref) {
                const data = magmaData[i];
                const s = 1 + Math.sin(t * data.speed + data.offset) * 0.1;
                ref.scale.set(s, 1, s);
                ref.position.y = -0.1 + Math.sin(t * data.speed * 0.5 + data.offset) * 0.05;
            }
        });
    });

    return (
        <group>
            {/* Lighting specific to Volcano - High Visibility Night */}
            <ambientLight intensity={1.2} color="#ffffff" />
            <hemisphereLight intensity={1.0} color="#ffaa88" groundColor="#442200" />
            <directionalLight
                position={[10, 20, 10]}
                intensity={2.0}
                color="#ffffff"
                castShadow
                shadow-bias={-0.001}
            />
            {/* Night Sky with Stars */}
            <Stars radius={2000} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Ash Particles */}
            <Sparkles count={150} scale={20} size={2} speed={0.1} opacity={0.5} color="#888888" position={[0, 5, 0]} />

            {/* Ground - Switched to a visible Mid-Gray */}
            <Cylinder args={[15, 15, 0.5, 32]} position={[0, -0.25, 0]} receiveShadow>
                <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.2} />
            </Cylinder>

            {/* Hidden Fill Lights for Terrain Visibility */}
            <pointLight position={[10, 5, 10]} intensity={1.5} color="#ff8844" distance={20} />
            <pointLight position={[-10, 5, -10]} intensity={1.5} color="#ff8844" distance={20} />

            {/* Magma Cracks - Varied Reds and Oranges with Animation */}
            {magmaData.map((m, idx) => (
                <group
                    key={idx}
                    position={m.pos}
                    ref={(el) => magmaRefs.current[idx] = el}
                >
                    <Sphere args={[m.scale, 32, 32]} scale={[1, 0.05, 1]}>
                        <meshStandardMaterial
                            color={m.color}
                            emissive={m.emissive}
                            emissiveIntensity={5}
                            roughness={0.1}
                            metalness={0.8}
                        />
                    </Sphere>
                    <pointLight intensity={3.5} color={m.color} distance={8} />
                </group>
            ))}

            {/* Volcanic Rocks - Now using faceted geometry for a more organic look */}
            {rockData.map((rock, idx) => (
                <Dodecahedron
                    key={idx}
                    position={rock.pos}
                    scale={rock.scale}
                    rotation={rock.rotation}
                    castShadow
                >
                    <meshStandardMaterial
                        color="#444444"
                        roughness={0.9}
                        metalness={0.1}
                        flatShading={true}
                    />
                </Dodecahedron>
            ))}

            {/* Background Volcano - Extreme Distance Far Horizon */}
            <group position={[150, -40, -800]} scale={50} rotation={[0, -Math.PI / 4, 0]}>
                {/* Main Mountain */}
                <mesh position={[0, 1.5, 0]} castShadow>
                    <coneGeometry args={[2, 3, 32]} />
                    <meshStandardMaterial color="#050505" roughness={1} />
                </mesh>

                {/* Glowing Crater */}
                <mesh position={[0, 3.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.8, 32]} />
                    <meshStandardMaterial color="#ff2200" emissive="#ff0000" emissiveIntensity={50} />
                </mesh>
                <pointLight position={[0, 4, 0]} intensity={60} color="#ff3300" distance={500} />

                {/* Eruption Particles */}
                {/* Smoke */}
                <Sparkles
                    count={100}
                    scale={[4, 25, 4]}
                    position={[0, 15, 0]}
                    color="#000000"
                    size={20}
                    speed={1.0}
                    noise={3.0}
                />
                {/* Sparks */}
                <Sparkles
                    count={50}
                    scale={[3, 15, 3]}
                    position={[0, 10, 0]}
                    color="#ff6600"
                    size={8}
                    speed={2.5}
                    noise={4.0}
                />
                {/* Lava "Chunks" */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <LavaChunk key={i} />
                ))}
            </group>

            {/* Central Fill Light for the cat - Much Brighter for Night Visibility */}
            <pointLight position={[0, 3, 2]} intensity={5.0} color="#ffffff" distance={15} />
            <pointLight position={[0, 2, -2]} intensity={3.0} color="#ffaa00" distance={12} />
        </group>
    );
};

const LavaChunk: React.FC = () => {
    const ref = useRef<THREE.Mesh>(null);
    const speed = useMemo(() => 0.5 + Math.random() * 1, []);
    const delay = useMemo(() => Math.random() * 5, []);
    const horizontalSpeed = useMemo(() => (Math.random() - 0.5) * 2, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = ((state.clock.getElapsedTime() * speed) + delay) % 5;
        const y = 8 + (t * 5) - (0.5 * 2 * t * t);
        const x = t * horizontalSpeed;

        ref.current.position.set(x, y, 0);
        ref.current.scale.setScalar(t > 4 ? 0 : 1);
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={5} />
        </mesh>
    );
};
