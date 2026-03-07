# Cat Pet Simulator 🐱✨

An interactive 3D cat petting simulator that uses **TensorFlow.js** for hand tracking and **Three.js** for a high-fidelity 3D experience. Pet the virtual cat using your webcam and trigger various magical particle effects!

**[Live Demo](https://darkgumby.github.io/cat_pet_sim/)**

## 🚀 Features

- **Hand Pose Detection**: Real-time hand tracking via webcam to interact with the 3D cat.
- **Dynamic Environments**: Cycle through four unique biomes: Plains, Forest, Arctic, and Alien.
- **Interactive Feedback**: Visual and audio feedback when "petting" the cat, including purring and particle effects.
- **Smart UI**: The cat's name dynamically changes color for contrast against different biomes and fades out during interaction to clear your view.
- **Customizable Experience**: Give your cat a custom name that persists between sessions.
- **3D Controls**: Full **OrbitControls** support to rotate and zoom around the scene.
- **Advanced HUD**: Real-time hand coordinate tracking and a comprehensive help interface.

## 🛠 Tech Stack

- **Frontend**: React, Vite, TypeScript
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **AI/ML**: TensorFlow.js (@tensorflow-models/hand-pose-detection)
- **Styling**: Vanilla CSS
- **Deployment**: GitHub Actions & GitHub Pages

## ✨ Particle Effects

- **Sparkles**: Magical sparkles that dynamically adapt their color palette to contrast with the current biome.

## ⌨️ Keyboard Commands

| Key | Action |
|-----|--------|
| **[B]** | Toggle Interaction Bounding Box |
| **[C]** | Toggle Webcam Preview |
| **[E]** | Cycle Environments (Plains -> Forest -> Arctic -> Alien) |
| **[H] / [Space]** | Toggle Help Menu |
| **[N]** | Name Cat |
| **[T]** | Toggle Coordinate Tracking HUD |

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A webcam for hand tracking

### Installation

1. Clone the repository.
2. Navigate to the app directory:
   ```bash
   cd app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

This project is configured for automatic deployment via **GitHub Actions**. Any push to the `main` branch will trigger a build and update the live site on **GitHub Pages**.

## 🐾 How to Pet

1. Allow webcam access when prompted.
2. Position your hand so the tracking spheres appear in the scene.
3. Move your hand into the interaction zone (press **[B]** to see the bounding box).
4. When your hand is inside the zone and above the floor, the cat will purr and release the active particle effect!


