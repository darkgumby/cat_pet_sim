import React, { useMemo } from 'react';
import { Cylinder, Sparkles, Sky } from '@react-three/drei';

export const Forest: React.FC = () => {
    const treeData = useMemo(() => {
        const trees: { pos: [number, number, number], type: 'pine' | 'round' | 'slim', scale: number }[] = [];
        const types: ('pine' | 'round' | 'slim')[] = ['pine', 'round', 'slim'];

        for (let i = 0; i < 80; i++) {
            const r = 5.5 + Math.random() * 12; // Cleared foreground (min radius 5.5)
            const theta = Math.random() * Math.PI * 2;
            trees.push({
                pos: [Math.cos(theta) * r, 0, Math.sin(theta) * r],
                type: types[Math.floor(Math.random() * types.length)],
                scale: 0.8 + Math.random() * 0.7
            });
        }
        return trees;
    }, []);

    return (
        <group>
            {/* Lighting specific to Forest - Balanced */}
            <ambientLight intensity={1.2} color="#ffffff" />
            <hemisphereLight intensity={0.8} color="#ffffff" groundColor="#ffffff" />
            <directionalLight position={[15, 20, 15]} intensity={2.0} color="#ffffff" castShadow shadow-bias={-0.001} />
            {/* Single point light for central visibility */}
            <pointLight position={[0, 3, 0]} intensity={1.5} color="#ffffff" distance={12} />
            <Sky sunPosition={[15, 20, 15]} turbidity={0.1} rayleigh={0.1} />

            {/* Fireflies */}
            <Sparkles count={100} scale={15} size={4} speed={0.2} opacity={0.6} color="#ffe28a" position={[0, 1.5, 0]} />

            {/* Ground - Balanced Green */}
            <Cylinder args={[15, 15, 0.5, 32]} position={[0, -0.25, 0]} receiveShadow>
                <meshStandardMaterial color="#3d6344" roughness={0.7} />
            </Cylinder>

            {/* Trees */}
            {treeData.map((tree, idx) => (
                <group key={idx} position={tree.pos} scale={tree.scale}>
                    {/* Common Trunk */}
                    <Cylinder args={[0.2, 0.3, 1.5, 8]} position={[0, 0.75, 0]} castShadow>
                        <meshStandardMaterial color="#3d2817" />
                    </Cylinder>

                    {/* Varied Leaves based on type */}
                    {tree.type === 'pine' ? (
                        <>
                            <Cylinder args={[0, 1.2, 3, 8]} position={[0, 3, 0]} castShadow>
                                <meshStandardMaterial color="#4a7a5b" />
                            </Cylinder>
                            <Cylinder args={[0, 1, 2.5, 8]} position={[0, 4.5, 0]} castShadow>
                                <meshStandardMaterial color="#5e9471" />
                            </Cylinder>
                        </>
                    ) : tree.type === 'round' ? (
                        <mesh position={[0, 3, 0]} castShadow>
                            <sphereGeometry args={[1.5, 8, 8]} />
                            <meshStandardMaterial color="#4d7a4d" />
                        </mesh>
                    ) : (
                        <Cylinder args={[0.4, 0.6, 5, 8]} position={[0, 4, 0]} castShadow>
                            <meshStandardMaterial color="#365c36" />
                        </Cylinder>
                    )}
                </group>
            ))}
        </group>
    );
};
