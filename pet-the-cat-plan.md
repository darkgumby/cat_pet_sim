# Project: Hand-Tracked Virtual Cat (PetSim)

## Phase 1: Environment Setup
- [ ] Initialize React project with Vite.
- [ ] Install dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `@mediapipe/hands`, `@tensorflow-models/hand-pose-detection`.
- [ ] Setup Antigravity Agent configurations for Three.js debugging.

## Phase 2: Hand Tracking Layer
- [ ] Create `WebcamView` component to access user camera.
- [ ] Implement `useHandTracking` hook to stream MediaPipe landmarks.
- [ ] Map 2D screen coordinates to 3D scene coordinates.

## Phase 3: 3D Scene & Interaction
- [ ] Load GLTF Cat Model using `useGLTF`.
- [ ] Create "Invisible Hand" collider (Sphere/Skeleton).
- [ ] Logic: If Hand-Distance < Cat-Mesh-Surface, trigger 'Purr' animation.

## Phase 4: Feedback Loop
- [ ] Visual: Particle effects (hearts/sparkles) on contact.
- [ ] Audio: Play `purr.mp3` on collision.