import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Text, Sparkles, OrbitControls, useGLTF, Box, Cylinder, Stars, Points, Point } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

interface HandProps {
    hands: handPoseDetection.Hand[];
    onInteract: () => void;
    coordsRef: React.RefObject<HTMLDivElement | null>;
}

const HandModel: React.FC<HandProps> = ({ hands, onInteract, coordsRef }) => {
    const { viewport } = useThree();
    const spheresRef = useRef<THREE.Mesh[]>([]);

    useFrame(() => {
        if (hands.length > 0) {
            const hand = hands[0];
            if (hand.keypoints) {
                // Check if the primary keypoint is valid (not NaN)
                const isValid = !isNaN(hand.keypoints[0].x) && !isNaN(hand.keypoints[0].y);

                hand.keypoints.forEach((keypoint, idx) => {
                    if (spheresRef.current[idx]) {
                        if (isValid) {
                            const x = (keypoint.x / 640) * 2 - 1;
                            const y = -(keypoint.y / 480) * 2 + 1;
                            // Shift Z slightly so center of depth is near original 0
                            const z = keypoint.z ? (keypoint.z / 100) : 0;

                            const worldX = (x * viewport.width) / 2;
                            const worldY = (y * viewport.height) / 2;
                            const posX = worldX;
                            const posY = worldY;
                            const posZ = z;

                            spheresRef.current[idx].position.set(posX, posY, posZ);

                            // Visibility constraint: must be above Y: 0
                            const isVisible = posY >= 0;
                            spheresRef.current[idx].visible = isVisible;

                            if (isVisible) {
                                // Bounding box check [2, 3.5, 2] centered at [0,0,0]
                                const isInside = Math.abs(posX) <= 1 && Math.abs(posY) <= 1.75 && Math.abs(posZ) <= 1;
                                (spheresRef.current[idx].material as THREE.MeshStandardMaterial).color.set(isInside ? '#00ffcc' : '#ff4444');
                            }
                        } else {
                            spheresRef.current[idx].visible = false;
                        }
                    }
                });

                if (isValid) {
                    const indexTip = hand.keypoints.find(k => k.name === 'index_finger_tip');
                    if (indexTip) {
                        const x = (indexTip.x / 640) * 2 - 1;
                        const y = -(indexTip.y / 480) * 2 + 1;
                        const worldX = (x * viewport.width) / 2;
                        const worldY = (y * viewport.height) / 2;
                        const worldZ = indexTip.z ? indexTip.z / 100 : 0;

                        if (coordsRef && coordsRef.current) {
                            coordsRef.current.innerHTML = `Tracking Coordinates:<br />X: ${worldX.toFixed(2)}<br />Y: ${worldY.toFixed(2)}<br />Z: ${worldZ.toFixed(2)}`;
                        }

                        // Interaction check matches the visual bounding box and Y visibility
                        const isInside = Math.abs(worldX) <= 1 && Math.abs(worldY) <= 1.75 && Math.abs(worldZ) <= 1;
                        if (isInside && worldY >= 0) {
                            onInteract();
                        }
                    }
                } else {
                    if (coordsRef && coordsRef.current) {
                        coordsRef.current.innerHTML = `Tracking Coordinates:<br />Status: Hand lost at frame edge`;
                    }
                }
            }
        } else {
            // No hands fully detected
            spheresRef.current.forEach(sphere => {
                if (sphere) sphere.visible = false;
            });
            if (coordsRef && coordsRef.current) {
                coordsRef.current.innerHTML = `Tracking Coordinates:<br />Status: Waiting for hand...`;
            }
        }
    });

    const points = Array.from({ length: 21 });

    return (
        <group>
            {points.map((_, i) => (
                <Sphere
                    key={i}
                    args={[0.08, 16, 16]}
                    position={[0, 1.75, 0]}
                    ref={(el) => { spheresRef.current[i] = el as THREE.Mesh; }}
                >
                    <meshStandardMaterial color="#00ffcc" transparent opacity={0.6} />
                </Sphere>
            ))}
        </group>
    );
};

interface SceneProps {
    hands: handPoseDetection.Hand[];
    isPurring: boolean;
    onPurr: () => void;
    coordsRef: React.RefObject<HTMLDivElement | null>;
    particleType: 'sparkles' | 'stars' | 'hearts' | 'fish' | 'paws';
}

export const Scene: React.FC<SceneProps> = ({ hands, isPurring, onPurr, coordsRef, particleType }) => {
    const gltf = useGLTF('/assets/cat_model/cat_model.glb');
    const checkerTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, 128, 128);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 64, 64);
            context.fillRect(64, 64, 64, 64);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(6.25, 6.25); // Halved yet again to double the tile size 
        return texture;
    }, []);

    const [yPos] = useState(0.76);
    const [showBoundingBox, setShowBoundingBox] = useState(false);

    const heartTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ff4466';
            ctx.beginPath();
            ctx.moveTo(32, 20);
            ctx.bezierCurveTo(32, 17, 27, 10, 20, 10);
            ctx.bezierCurveTo(10, 10, 10, 25, 10, 25);
            ctx.bezierCurveTo(10, 35, 20, 46, 32, 55);
            ctx.bezierCurveTo(44, 46, 54, 35, 54, 25);
            ctx.bezierCurveTo(54, 25, 54, 10, 44, 10);
            ctx.bezierCurveTo(37, 10, 32, 17, 32, 20);
            ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const fishTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffaa44';
            // Body
            ctx.beginPath();
            ctx.ellipse(32, 32, 20, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            // Tail
            ctx.beginPath();
            ctx.moveTo(12, 32);
            ctx.lineTo(2, 22);
            ctx.lineTo(2, 42);
            ctx.closePath();
            ctx.fill();
            // Eye
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(44, 30, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const pawsTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffcc99'; // Peachy paw color
            // Large pad
            ctx.beginPath();
            ctx.ellipse(32, 42, 14, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            // 4 Small pads (toes)
            ctx.beginPath(); ctx.ellipse(14, 25, 6, 8, 0.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(26, 16, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(38, 16, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(50, 25, 6, 8, -0.2, 0, Math.PI * 2); ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const starRotationSpeed = useMemo(() => (Math.random() - 0.5) * 0.005, []);
    const starRef = useRef<THREE.Group>(null);
    const heartsRef = useRef<THREE.Points>(null);
    const fishRef = useRef<THREE.Points>(null);
    const pawsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (starRef.current) {
            starRef.current.rotation.y += starRotationSpeed;
        }

        // Animate particles rising (Slowed down significantly - extra 5x reduction)
        if (heartsRef.current) {
            const positions = heartsRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += 0.00032; // Rise up (was 0.0016)
                if (positions[i + 1] > 3) positions[i + 1] = 0;
            }
            heartsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (fishRef.current) {
            const positions = fishRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += 0.0002; // Rise up (was 0.001)
                if (positions[i + 1] > 3) positions[i + 1] = 0;
            }
            fishRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (pawsRef.current) {
            const positions = pawsRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += 0.00026; // Rise up (was 0.0013)
                if (positions[i + 1] > 3) positions[i + 1] = 0;
            }
            pawsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'b') {
                setShowBoundingBox(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <HandModel hands={hands} onInteract={onPurr} coordsRef={coordsRef} />

            <primitive object={gltf.scene} scale={1} position={[0, yPos, 0]} />

            {/* Visual bounding box for the interaction zone (radius 2.5) */}
            {showBoundingBox && (
                <Box args={[2, 3.5, 2]} position={[0, 0, 0]}>
                    <meshStandardMaterial wireframe color="#00ffcc" transparent opacity={0.3} />
                </Box>
            )}

            {/* Cylinder platform: Separate top/bottom vs sides materials */}
            <Cylinder args={[3, 3, 0.5, 64]} position={[0, -0.45, 0]} receiveShadow>
                <meshStandardMaterial attach="material-0" color="#ffffffff" />
                <meshStandardMaterial attach="material-1" map={checkerTexture} />
                <meshStandardMaterial attach="material-2" map={checkerTexture} />
            </Cylinder>

            {isPurring && (
                <>
                    {particleType === 'sparkles' ? (
                        ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'].map((color, idx) => (
                            <Sparkles key={idx} count={30} scale={5} size={6} speed={0.4} opacity={1} color={color} position={[0, 0, 0]} />
                        ))
                    ) : particleType === 'stars' ? (
                        <group ref={starRef}>
                            {/* White Stars only */}
                            <Stars radius={2} depth={5} count={500} factor={4} saturation={0} fade speed={1} />
                        </group>
                    ) : particleType === 'hearts' ? (
                        <Points limit={100} ref={heartsRef}>
                            <pointsMaterial size={0.5} transparent map={heartTexture} alphaTest={0.5} color="#ff4466" />
                            {Array.from({ length: 50 }).map((_, i) => (
                                <Point
                                    key={i}
                                    position={[(Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4]}
                                />
                            ))}
                        </Points>
                    ) : particleType === 'fish' ? (
                        <Points limit={100} ref={fishRef}>
                            <pointsMaterial size={0.6} transparent map={fishTexture} alphaTest={0.5} color="#ffaa44" />
                            {Array.from({ length: 50 }).map((_, i) => (
                                <Point
                                    key={i}
                                    position={[(Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4]}
                                />
                            ))}
                        </Points>
                    ) : (
                        <Points limit={100} ref={pawsRef}>
                            <pointsMaterial size={0.6} transparent map={pawsTexture} alphaTest={0.5} color="#ffcc99" />
                            {Array.from({ length: 50 }).map((_, i) => (
                                <Point
                                    key={i}
                                    position={[(Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4]}
                                />
                            ))}
                        </Points>
                    )}
                </>
            )}
        </>
    );
};
