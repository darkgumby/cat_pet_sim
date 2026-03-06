import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { WebcamView } from './components/WebcamView';
import { Scene } from './components/Scene';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import './App.css';

function App() {
  const [hands, setHands] = useState<handPoseDetection.Hand[]>([]);
  const [isPurring, setIsPurring] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const coordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        setShowCamera(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const purrTimeout = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePurr = () => {
    if (!isPurring) {
      setIsPurring(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      }
    }

    // reset purring after 200ms of no interaction
    if (purrTimeout.current) clearTimeout(purrTimeout.current);
    purrTimeout.current = window.setTimeout(() => {
      setIsPurring(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }, 200);
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#2c2c2c', position: 'relative', overflow: 'hidden' }}>
      <WebcamView onHandsDetected={setHands} visible={showCamera} />

      <Canvas camera={{ position: [-0.248, 1.804, 3.887], fov: 60 }}>
        <Scene hands={hands} isPurring={isPurring} onPurr={handlePurr} coordsRef={coordsRef} />
      </Canvas>

      {/* Hidden audio element for purr sound */}
      <audio ref={audioRef} src="/assets/audio/cat_purring.mp3" preload="auto" />

      <div style={{ position: 'absolute', top: 30, width: '100%', textAlign: 'center', fontFamily: 'sans-serif', color: 'white', pointerEvents: 'none' }}>
        <h1>Pet the Kitty!</h1>
      </div>

      <div style={{
        position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.8)', color: '#00ffcc',
        padding: '15px', borderRadius: '8px', pointerEvents: 'none', whiteSpace: 'nowrap',
        fontFamily: 'monospace', fontSize: '14px', border: '1px solid #00ffcc', zIndex: 100
      }}>
        <div ref={coordsRef}>
          Tracking Coordinates:<br />
          X: 0.00<br />
          Y: 0.00<br />
          Z: 0.00
        </div>
      </div>
    </div>
  );
}

export default App;
