import React, { useMemo } from 'react';
import { Cylinder, Sparkles, Stars } from '@react-three/drei';

export const Volcano: React.FC = () => {
    const rockData = useMemo(() => {
        const rocks: { pos: [number, number, number], scale: [number, number, number], rotation: number }[] = [];
        for (let i = 0; i < 40; i++) {
            const r = 4 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            rocks.push({
                pos: [Math.cos(theta) * r, 0, Math.sin(theta) * r],
                scale: [0.5 + Math.random() * 2, 0.5 + Math.random() * 3, 0.5 + Math.random() * 2],
                rotation: Math.random() * Math.PI * 2
            });
        }
        return rocks;
    }, []);

    const magmaData = useMemo(() => {
        const magma: { pos: [number, number, number], scale: number }[] = [];
        for (let i = 0; i < 15; i++) {
            const r = 2 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            magma.push({
                pos: [Math.cos(theta) * r, 0.01, Math.sin(theta) * r],
                scale: 0.5 + Math.random() * 1.5
            });
        }
        return magma;
    }, []);

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
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Ash Particles */}
            <Sparkles count={150} scale={20} size={2} speed={0.1} opacity={0.5} color="#888888" position={[0, 5, 0]} />

            {/* Ground - Switched to a visible Mid-Gray */}
            <Cylinder args={[15, 15, 0.5, 32]} position={[0, -0.25, 0]} receiveShadow>
                <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.2} />
            </Cylinder>

            {/* Hidden Fill Lights for Terrain Visibility */}
            <pointLight position={[10, 5, 10]} intensity={1.5} color="#ff8844" distance={20} />
            <pointLight position={[-10, 5, -10]} intensity={1.5} color="#ff8844" distance={20} />

            {/* Magma Cracks - Deepest, Darkest Orange */}
            {magmaData.map((m, idx) => (
                <mesh key={idx} position={m.pos} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[m.scale, 16]} />
                    <meshStandardMaterial color="#661100" emissive="#992200" emissiveIntensity={5} />
                    <pointLight intensity={3.5} color="#661100" distance={8} />
                </mesh>
            ))}

            {/* Volcanic Rocks - Switched to visible Lighter Gray */}
            {rockData.map((rock, idx) => (
                <mesh key={idx} position={rock.pos} scale={rock.scale} rotation={[0, rock.rotation, 0]} castShadow>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#555555" roughness={0.8} metalness={0.1} />
                </mesh>
            ))}

            {/* Central Fill Light for the cat - Much Brighter for Night Visibility */}
            <pointLight position={[0, 3, 2]} intensity={5.0} color="#ffffff" distance={15} />
            <pointLight position={[0, 2, -2]} intensity={3.0} color="#ffaa00" distance={12} />
        </group>
    );
};
