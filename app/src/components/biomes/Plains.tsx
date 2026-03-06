import React, { useMemo } from 'react';
import { Cylinder, Sky } from '@react-three/drei';

export const Plains: React.FC = () => {
    const hillData = useMemo(() => {
        const hills: { pos: [number, number, number], scale: [number, number, number] }[] = [];
        for (let i = 0; i < 40; i++) {
            const r = 16 + Math.random() * 15; // Layered from mid-distance to far
            const theta = Math.random() * Math.PI * 2;
            hills.push({
                pos: [Math.cos(theta) * r, -2, Math.sin(theta) * r],
                scale: [7 + Math.random() * 10, 2 + Math.random() * 6, 7 + Math.random() * 10]
            });
        }
        return hills;
    }, []);

    const flowerData = useMemo(() => {
        const flowers: { pos: [number, number, number], color: string, type: 'round' | 'pointed' | 'cluster' }[] = [];
        const colors = [
            '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e0bbe4', // original pastels
            '#ff6666', '#ffcc00', '#ff66cc', '#ccff66', '#66ccff', '#9966ff'  // more vibrant ones
        ];
        const types: ('round' | 'pointed' | 'cluster')[] = ['round', 'pointed', 'cluster'];

        // Scatter 500 flowers
        for (let i = 0; i < 500; i++) {
            const r = 2 + Math.random() * 24; // Expanded range to cover hills
            const theta = Math.random() * Math.PI * 2;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            let y = 0;

            // Check if flower is on a hill
            for (const hill of hillData) {
                const dx = x - hill.pos[0];
                const dz = z - hill.pos[2];
                const distSq = (dx * dx) / (hill.scale[0] * hill.scale[0]) + (dz * dz) / (hill.scale[2] * hill.scale[2]);

                if (distSq < 1) {
                    // It's on this hill! Calculate Y. 
                    // Hill sphere is at y=-2, with y-scale. y_relative = b * sqrt(1 - distSq)
                    const y_rel = hill.scale[1] * Math.sqrt(1 - distSq);
                    const hill_y = hill.pos[1] + y_rel;
                    if (hill_y > y) y = hill_y - 0.05; // Sit slightly inside
                }
            }

            flowers.push({
                pos: [x, y, z],
                color: colors[Math.floor(Math.random() * colors.length)],
                type: types[Math.floor(Math.random() * types.length)]
            });
        }
        return flowers;
    }, [hillData]);

    return (
        <group>
            {/* Lighting specific to Plains */}
            <ambientLight intensity={0.7} color="#fffbe6" />
            <hemisphereLight intensity={0.6} color="#7cc0ff" groundColor="#ffeaae" />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1.8}
                color="#fffcf0"
                castShadow
                shadow-bias={-0.0005}
                shadow-mapSize={[1024, 1024]}
            />
            <Sky sunPosition={[10, 20, 10]} turbidity={0} rayleigh={0.5} />

            {/* Ground */}
            <Cylinder args={[15, 15, 0.5, 32]} position={[0, -0.25, 0]} receiveShadow>
                <meshStandardMaterial color="#7fbf50" roughness={0.8} />
            </Cylinder>

            {/* Rolling Hills */}
            {hillData.map((hill, idx) => (
                <mesh key={idx} position={hill.pos} scale={hill.scale}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="#6ba344" roughness={0.9} />
                </mesh>
            ))}

            {/* Flowers */}
            {flowerData.map((flower, idx) => (
                <group key={idx} position={flower.pos}>
                    {/* Stem */}
                    <mesh position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.01, 0.01, 0.1, 4]} />
                        <meshStandardMaterial color="#4d7a4d" />
                    </mesh>
                    {/* Petals layer */}
                    <group position={[0, 0.1, 0]}>
                        {flower.type === 'round' ? (
                            <mesh>
                                <sphereGeometry args={[0.05, 8, 8]} />
                                <meshStandardMaterial color={flower.color} />
                            </mesh>
                        ) : flower.type === 'pointed' ? (
                            <mesh rotation={[Math.PI, 0, 0]}>
                                <coneGeometry args={[0.05, 0.15, 6]} />
                                <meshStandardMaterial color={flower.color} />
                            </mesh>
                        ) : (
                            // Cluster type
                            <>
                                <mesh position={[0.03, 0, 0]}>
                                    <sphereGeometry args={[0.03, 6, 6]} />
                                    <meshStandardMaterial color={flower.color} />
                                </mesh>
                                <mesh position={[-0.03, 0.02, 0.02]}>
                                    <sphereGeometry args={[0.03, 6, 6]} />
                                    <meshStandardMaterial color={flower.color} />
                                </mesh>
                                <mesh position={[0, 0.04, -0.03]}>
                                    <sphereGeometry args={[0.03, 6, 6]} />
                                    <meshStandardMaterial color={flower.color} />
                                </mesh>
                            </>
                        )}
                    </group>
                </group>
            ))}
        </group>
    );
};
