import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs"; // ADD THIS LINE
// Global state for model loading
let isModelLoaded = false;
let loadingPromise = null;

// Initialize and load face detection models
export const    initFaceDetection = async () => {
  if (isModelLoaded) return true;
  if (loadingPromise) return loadingPromise;
  
  try {
    loadingPromise = new Promise(async (resolve, reject) => {
      try {
        // Set the backend based on browser capabilities
        if (window.OffscreenCanvas) {
          await tf.setBackend('webgl');
        } else {
          await tf.setBackend('cpu');
        }

        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        
        isModelLoaded = true;
        resolve(true);
      } catch (error) {
        console.error('Error loading face detection models:', error);
        reject(error);
      }
    });
    
    return await loadingPromise;
  } catch (error) {
    console.error('Error initializing face detection:', error);
    return false;
  }
};

// Detect faces in an image
export const detectFaces = async (imageElement) => {
  if (!isModelLoaded) {
    throw new Error('Face detection models not loaded');
  }

  try {
    const detections = await faceapi
      .detectAllFaces(
        imageElement,
        new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 512, 
          scoreThreshold: 0.5 
        })
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections.map(detection => ({
      box: detection.detection.box,
      landmarks: detection.landmarks,
      descriptor: detection.descriptor
    }));
  } catch (error) {
    console.error('Error detecting faces:', error);
    return [];
  }
};

// Extract face region from an image with optional padding
export const extractFace = async (imageElement, faceBox, padding = 0) => {
  try {
    const { x, y, width, height } = faceBox;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const padX = padding * width / 100;
    const padY = padding * height / 100;
    
    canvas.width = width + (padX * 2);
    canvas.height = height + (padY * 2);
    
    ctx.drawImage(
      imageElement,
      x - padX, 
      y - padY,
      width + (padX * 2), 
      height + (padY * 2),
      0, 
      0, 
      canvas.width, 
      canvas.height
    );
    
    return canvas.toDataURL('image/jpeg');
  } catch (error) {
    console.error('Error extracting face:', error);
    return null;
  }
};

// Find best face based on position and size
export const findOptimalFace = (faces) => {
  if (faces.length === 0) return null;
  
  const sortedFaces = faces
    .sort((a, b) => {
      const areaA = a.box.width * a.box.height;
      const areaB = b.box.width * b.box.height;
      return areaB - areaA;
    });
    
  return sortedFaces[0];
};  