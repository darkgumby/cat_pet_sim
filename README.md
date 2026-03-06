# Cat Pet Simulator 🐱✨

An interactive 3D cat petting simulator that uses **TensorFlow.js** for hand tracking and **Three.js** for a high-fidelity 3D experience. Pet the virtual cat using your webcam and trigger various magical particle effects!

## 🚀 Features

- **Hand Pose Detection**: Real-time hand tracking via webcam to interact with the 3D cat.
- **Dynamic Particle Effects**:
  - **Sparkles**: Rainbow-colored sparkles.
  - **Stars**: A slow-rotating stellar field.
  - **Hearts**: Peacefully rising red hearts.
  - **Fish**: Gracefully floating orange fish.
  - **Cat Paws**: Cute peachy paw prints.
- **Interactive Environment**: A 3D checkered platform with a premium stylized cat model.
- **Audio Feedback**: Purring sound effects that activate during interaction.
- **HUD Interface**: Real-time coordinate tracking and a comprehensive help menu.

## 🛠 Tech Stack

- **Frontend**: React, Vite, TypeScript
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **AI/ML**: TensorFlow.js (@tensorflow-models/hand-pose-detection)
- **Styling**: Vanilla CSS

## ⌨️ Keyboard Commands

| Key | Action |
|-----|--------|
| **[P]** | **Cycle Particle Effect** (Sparkles -> Stars -> Hearts -> Fish -> Paws) |
| **[B]** | Toggle Interaction Bounding Box |
| **[C]** | Toggle Webcam Preview |
| **[T]** | Toggle Coordinate Tracking HUD |
| **[H] / [Space]** | Toggle Help Menu |

## 📦 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- A webcam for hand tracking

### Installation

1. Clone the repository
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
