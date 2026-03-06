import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Sparkles, OrbitControls, useGLTF, Box, Cylinder, Stars } from '@react-three/drei';
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
    particleType: 'sparkles' | 'stars';
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



    const starRotationSpeed = useMemo(() => (Math.random() - 0.5) * 0.005, []);
    const starRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (starRef.current) {
            starRef.current.rotation.y += starRotationSpeed;
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
                        ['#FFB7B2', '#FFDAC1', '#FFF9B1', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#D291BC'].map((color, idx) => (
                            <Sparkles key={idx} count={30} scale={5} size={6} speed={0.4} opacity={1} color={color} position={[0, 0, 0]} />
                        ))
                    ) : particleType === 'stars' ? (
                        <group ref={starRef}>
                            <Stars radius={10} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        </group>
                    ) : null}
                </>
            )}
        </>
    );
};
