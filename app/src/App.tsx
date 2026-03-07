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
  const [showTracking, setShowTracking] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [biome, setBiome] = useState<'plains' | 'forest' | 'arctic' | 'alien'>('plains');
  const [catName, setCatName] = useState(() => localStorage.getItem('cat_name') || '');
  const [isNaming, setIsNaming] = useState(false);
  const [tempName, setTempName] = useState(catName);
  const [headerVisible, setHeaderVisible] = useState(true);
  const coordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeaderVisible(!isPurring);
  }, [isPurring]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNaming) return;
      const key = e.key.toLowerCase();
      if (key === 'c') {
        setShowCamera(prev => !prev);
      } else if (key === 'e') {
        setBiome(prev => {
          const types: ('plains' | 'forest' | 'arctic' | 'alien')[] =
            ['plains', 'forest', 'arctic', 'alien'];
          const currentIndex = types.indexOf(prev);
          return types[(currentIndex + 1) % types.length];
        });
      } else if (key === 'h' || e.key === ' ') {
        setShowHelp(prev => !prev);
      } else if (key === 'n') {
        e.preventDefault();
        setTempName(catName);
        setIsNaming(true);
      } else if (key === 't') {
        setShowTracking(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNaming, catName]);

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
        <Scene hands={hands} isPurring={isPurring} onPurr={handlePurr} coordsRef={coordsRef} biome={biome} />
      </Canvas>

      {/* Hidden audio element for purr sound */}
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}assets/audio/cat_purring.mp3`} preload="auto" />

      <div
        className={`cat-header ${headerVisible ? 'visible' : 'hidden'}`}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: biome === 'alien' ? '#ffcc00' : (biome === 'forest' ? '#ffffff' : '#2c3e50'),
          pointerEvents: 'none',
          textShadow: biome === 'alien' || biome === 'forest' ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <h1 style={{ marginTop: 0 }}>Pet {catName || 'the Kitty'}!</h1>
      </div>

      <div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 100,
        display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end',
        pointerEvents: 'none'
      }}>
        {showHelp && (
          <div style={{
            background: 'rgba(0,0,0,0.8)', color: '#eee',
            padding: '15px', borderRadius: '8px', width: '240px',
            fontFamily: 'monospace', fontSize: '14px', border: '1px solid #eee',
            textAlign: 'left'
          }}>
            {/* <strong style={{ color: '#ffbdc5' }}>Keyboard Commands:</strong><br /><br /> */}
            [B] Toggle Bounding Box<br />
            [C] Toggle Camera Preview<br />
            [E] Cycle Environments<br />
            [H] or [Space] Toggle Help<br />
            [N] Name Cat<br />
            [T] Toggle Tracking HUD<br />
          </div>
        )}

        {showTracking && (
          <div style={{
            background: 'rgba(0,0,0,0.8)', color: '#00ffcc',
            padding: '15px', borderRadius: '8px', width: '240px',
            fontFamily: 'monospace', fontSize: '14px', border: '1px solid #00ffcc',
            textAlign: 'left'
          }}>
            <div ref={coordsRef}>
              Tracking Coordinates:<br />
              X: 0.00<br />
              Y: 0.00<br />
              Z: 0.00
            </div>
          </div>
        )}
      </div>

      {isNaming && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#333', padding: '25px', borderRadius: '12px',
            border: '2px solid #ffbdc5', width: '320px', textAlign: 'center'
          }}>
            <h2 style={{ color: '#ffbdc5', marginTop: 0 }}>Name your Kitty!</h2>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value.slice(0, 25))}
              autoFocus
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid #666', background: '#222', color: 'white',
                fontSize: '18px', marginBottom: '20px', outline: 'none',
                boxSizing: 'border-box'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setCatName(tempName);
                  localStorage.setItem('cat_name', tempName);
                  setIsNaming(false);
                } else if (e.key === 'Escape') {
                  setIsNaming(false);
                }
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setCatName(tempName);
                  localStorage.setItem('cat_name', tempName);
                  setIsNaming(false);
                }}
                style={{
                  padding: '8px 20px', borderRadius: '6px', border: 'none',
                  background: '#ffbdc5', color: '#333', fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsNaming(false)}
                style={{
                  padding: '8px 20px', borderRadius: '6px', border: 'none',
                  background: '#666', color: 'white', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
