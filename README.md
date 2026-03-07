# Cat Pet Simulator 🐱✨

An interactive 3D cat petting simulator that uses **TensorFlow.js** for hand tracking and **Three.js** for a high-fidelity 3D experience. Pet the virtual cat using your webcam and trigger various magical particle effects!

## 🚀 Features

- **Hand Pose Detection**: Real-time hand tracking via webcam to interact with the 3D cat.
- **Dynamic Environments**: Cycle through four unique biomes: Plains, Forest, Arctic, and Alien (Volcanic).
- **Interactive Feedback**: Visual and audio feedback when "petting" the cat, including purring and particle effects.
- **Customizable Experience**: Give your cat a custom name that persists between sessions.
- **3D Controls**: Full **OrbitControls** support to rotate and zoom around the scene.
- **Advanced HUD**: Real-time hand coordinate tracking and a comprehensive help interface.

## 🛠 Tech Stack

- **Frontend**: React, Vite, TypeScript
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **AI/ML**: TensorFlow.js (@tensorflow-models/hand-pose-detection)
- **Styling**: Vanilla CSS

## ✨ Particle Effects

The app randomly assigns one of the following magical effects on load:

- **Sparkles**: A cascade of rainbow-colored sparkles that appear during interaction.
- **Stars**: An immersive, slow-rotating stellar field that fills the scene.

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

## 🐾 How to Pet

1. Allow webcam access when prompted.
2. Position your hand so the tracking spheres appear in the scene.
3. Move your hand into the interaction zone (press **[B]** to see the bounding box).
4. When your hand is inside the zone and above the floor, the cat will purr and release the active particle effect!

