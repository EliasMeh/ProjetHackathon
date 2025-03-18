'use client'
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import EXIF from "exif-js";

interface ImageMetadata {
  make?: string;
  model?: string;
  orientation?: number;
  dateTime?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  [key: string]: string | number | undefined;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const router = useRouter();

  // Open Camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Camera access denied.");
    }
  };

  // Capture Image from Video
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvasRef.current.toDataURL();
      setImage(imageUrl);

      // Extract metadata
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          EXIF.getData(objectUrl, function (this: ImageMetadata) {
            const allMetaData = EXIF.getAllTags(this);
            setMetadata(allMetaData);
          });
        });
    }
  };

  // Submit & Redirect to Metadata Page
  const handleSubmit = () => {
    if (image) {
      localStorage.setItem("capturedImage", image);
      localStorage.setItem("metadata", JSON.stringify(metadata || {}));
      router.push("/metadata");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Capture and Submit a Photo</h1>

      {/* Open Camera Button */}
      <button onClick={openCamera} className="px-4 py-2 bg-green-500 text-white rounded">
        🎥 Open Camera
      </button>

      {/* Live Camera Preview */}
      <video ref={videoRef} autoPlay playsInline className="w-64 h-64 border" />

      {/* Capture Button */}
      <button onClick={captureImage} className="px-4 py-2 mt-2 bg-red-500 text-white rounded">
        📷 Capture Image
      </button>

      {/* Captured Image Preview */}
      {image && (
        <>
          <h2 className="text-lg font-semibold">Captured Image</h2>
          <img src={image} alt="Captured" className="w-64 h-64 object-cover border" />
          <button onClick={handleSubmit} className="px-4 py-2 mt-2 bg-blue-500 text-white rounded">
            ✅ Submit & View Metadata
          </button>
        </>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}