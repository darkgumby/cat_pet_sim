import React, { useRef, useEffect } from 'react';
import { useHandTracking } from '../hooks/useHandTracking';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

interface WebcamViewProps {
    onHandsDetected: (hands: handPoseDetection.Hand[]) => void;
}

export const WebcamView: React.FC<WebcamViewProps> = ({ onHandsDetected }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { hands } = useHandTracking(videoRef);

    useEffect(() => {
        onHandsDetected(hands);
    }, [hands, onHandsDetected]);

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accessing webcam', err);
            }
        };

        startWebcam();
    }, []);

    return (
        <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 10, pointerEvents: 'none' }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width={640}
                height={480}
                style={{
                    width: '320px',
                    height: '240px',
                    transform: 'scaleX(-1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    backgroundColor: '#000',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            />
        </div>
    );
};
