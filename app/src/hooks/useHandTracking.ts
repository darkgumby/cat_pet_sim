import { useEffect, useState, useRef, type RefObject } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

export const useHandTracking = (videoRef: RefObject<HTMLVideoElement | null>) => {
    const [detector, setDetector] = useState<handPoseDetection.HandDetector | null>(null);
    const [hands, setHands] = useState<handPoseDetection.Hand[]>([]);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const initDetector = async () => {
            await tf.ready();
            const model = handPoseDetection.SupportedModels.MediaPipeHands;
            const detectorConfig: handPoseDetection.MediaPipeHandsTfjsModelConfig = {
                runtime: 'tfjs',
                modelType: 'full',
            };
            const handDetector = await handPoseDetection.createDetector(model, detectorConfig);
            setDetector(handDetector);
        };

        initDetector();
    }, []);

    useEffect(() => {
        const detectHands = async () => {
            if (detector && videoRef.current && videoRef.current.readyState === 4) {
                try {
                    // Pass the HTMLVideoElement to the detector
                    const detectedHands = await detector.estimateHands(videoRef.current, { flipHorizontal: true });
                    setHands(detectedHands);
                } catch (error) {
                    console.error("Hand detection error:", error);
                }
            }
            requestRef.current = requestAnimationFrame(detectHands);
        };

        if (detector) {
            requestRef.current = requestAnimationFrame(detectHands);
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [detector, videoRef]);

    return { hands };
};
