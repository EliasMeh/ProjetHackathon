'use client'
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import EXIF from "exif-js";

interface GpsCoordinates {
  degrees: number;
  minutes: number;
  seconds: number;
}

interface ImageMetadata {
  make?: string;
  model?: string;
  orientation?: number;
  dateTime?: string;
  gpsLatitude?: GpsCoordinates[];
  gpsLongitude?: GpsCoordinates[];
  gpsLatitudeRef?: string;
  gpsLongitudeRef?: string;
  [key: string]: string | number | GpsCoordinates[] | undefined;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  const openCamera = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Camera access denied or not available.");
    }
  };

  const dataURLtoBlob = (dataURL: string): Blob => {
    const [header, data] = dataURL.split(",");
    const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
    const binaryStr = atob(data);
    const u8arr = new Uint8Array(binaryStr.length);
    
    for (let i = 0; i < binaryStr.length; i++) {
      u8arr[i] = binaryStr.charCodeAt(i);
    }
    
    return new Blob([u8arr], { type: mime });
  };

  const extractMetadata = (blob: Blob): void => {
    const reader = new FileReader();
    
    reader.onload = (event): void => {
      if (!event.target?.result) return;
      
      const img = new Image();
      img.src = event.target.result as string;
      
      img.onload = (): void => {
        type EXIFThis = {
          exifdata?: ImageMetadata;
        };
  
        EXIF.getData(img as unknown as string, function(this: EXIFThis) {
          const allMetaData = EXIF.getAllTags(this) as ImageMetadata;
          setMetadata(allMetaData);
        });
      };
    };
  
    reader.readAsDataURL(blob);
  };

  const captureImage = (): void => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageUrl = canvas.toDataURL("image/jpeg", 0.95);
    setImage(imageUrl);

    const imageBlob = dataURLtoBlob(imageUrl);
    extractMetadata(imageBlob);
  };

  const handleSubmit = (): void => {
    if (!image) return;
    
    try {
      localStorage.setItem("capturedImage", image);
      localStorage.setItem("metadata", JSON.stringify(metadata || {}));
      router.push("/metadata");
    } catch (error) {
      console.error("Storage error:", error);
      alert("Failed to save image data.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Capture and Submit a Photo</h1>
      
      <button 
        onClick={openCamera} 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        🎥 Open Camera
      </button>
      
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-64 h-64 border rounded-lg object-cover" 
      />
      
      <button 
        onClick={captureImage} 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        📷 Capture Image
      </button>
      
      {image && (
        <>
          <h2 className="text-lg font-semibold">Captured Image</h2>
          <img 
            src={image} 
            alt="Captured" 
            className="w-64 h-64 object-cover border rounded-lg" 
          />
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ✅ Submit & View Metadata
          </button>
        </>
      )}
      
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}