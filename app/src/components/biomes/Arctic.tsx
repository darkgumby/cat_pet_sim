import React, { useMemo } from 'react';
import { Icosahedron, Sparkles, Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Arctic: React.FC = () => {
    const iceChunks = useMemo(() => {
        const chunks: { pos: [number, number, number], rot: [number, number, number], scale: [number, number, number] }[] = [];

        // Background - More and Taller (Far away)
        for (let i = 0; i < 60; i++) {
            const r = 10 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            chunks.push({
                pos: [Math.cos(theta) * r, -0.5 + Math.random() * 0.5, Math.sin(theta) * r],
                rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
                scale: [1 + Math.random() * 2, 3 + Math.random() * 6, 1 + Math.random() * 2]
            });
        }

        // Foreground - Smaller (Close to center)
        for (let i = 0; i < 30; i++) {
            const r = 2.5 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            chunks.push({
                pos: [Math.cos(theta) * r, -0.1 + Math.random() * 0.2, Math.sin(theta) * r],
                rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
                scale: [0.2 + Math.random() * 0.5, 0.1 + Math.random() * 0.4, 0.2 + Math.random() * 0.5]
            });
        }

        // Midground - Standard shards
        for (let i = 0; i < 20; i++) {
            const r = 6.5 + Math.random() * 3.5;
            const theta = Math.random() * Math.PI * 2;
            chunks.push({
                pos: [Math.cos(theta) * r, -0.2 + Math.random() * 0.3, Math.sin(theta) * r],
                rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
                scale: [0.8 + Math.random() * 1.2, 1 + Math.random() * 2, 0.8 + Math.random() * 1.2]
            });
        }

        return chunks;
    }, []);

    const snowRef = React.useRef<THREE.Points>(null);

    // Keep falling snow logic local to Arctic
    useFrame(() => {
        if (snowRef.current) {
            const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 0.02; // Fall down
                if (positions[i + 1] < -2) positions[i + 1] = 10;
            }
            snowRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group>
            {/* Lighting specific to Arctic - Brighter */}
            <ambientLight intensity={1.2} color="#ffffff" />
            <hemisphereLight intensity={1.0} color="#ffffff" groundColor="#b0d0ff" />
            <directionalLight
                position={[-10, 20, -10]}
                intensity={2.0}
                color="#ffffff"
                castShadow
                shadow-bias={-0.001}
            />
            <Sky sunPosition={[-10, 20, -10]} turbidity={0.01} rayleigh={0.1} mieCoefficient={0.005} />

            {/* Snow Effect */}
            <Sparkles ref={snowRef as any} count={500} scale={20} size={2} speed={0} opacity={0.8} color="#ffffff" position={[0, 5, 0]} />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <circleGeometry args={[15, 64]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
            </mesh>

            {/* Jagged Ice Shards */}
            {iceChunks.map((chunk, idx) => (
                <Icosahedron key={idx} args={[1, 0]} position={chunk.pos} rotation={chunk.rot} scale={chunk.scale} castShadow receiveShadow>
                    <meshStandardMaterial color="#d0e8ff" transparent opacity={0.9} roughness={0} metalness={0.4} />
                </Icosahedron>
            ))}
        </group>
    );
};
