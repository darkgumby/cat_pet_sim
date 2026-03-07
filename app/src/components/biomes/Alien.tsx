import React, { useMemo, useRef } from 'react';
import { Cylinder, Sparkles, Stars, Dodecahedron, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Alien: React.FC = () => {
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
            {/* Lighting specific to Alien - High Visibility Night */}
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

            {/* Central Fill Light for the cat - Much Brighter for Night Visibility */}
            <pointLight position={[0, 3, 2]} intensity={5.0} color="#ffffff" distance={15} />
            <pointLight position={[0, 2, -2]} intensity={3.0} color="#ffaa00" distance={12} />
        </group>
    );
};

