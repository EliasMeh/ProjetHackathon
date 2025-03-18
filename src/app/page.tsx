'use client'
import { useState, useRef } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Handle file upload & camera capture
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImage(imageUrl);
        processImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open camera using MediaDevices API (for desktop)
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  // Capture image from live camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvasRef.current.toDataURL();
      setImage(imageUrl);
      processImage(imageUrl);
    }
  };

  // Convert image to grayscale
  const processImage = (imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Grayscale processing
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL());
    };
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Upload or Capture a Photo</h1>

      {/* Upload from File */}
      <label className="block">
        📂 Upload from Files:
        <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2" />
      </label>

      {/* Capture from Camera (Mobile) */}
      <label className="block">
        📸 Capture from Camera (Mobile):
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="border p-2" />
      </label>

      {/* Open Live Camera (Desktop or Mobile) */}
      {!isCameraOpen && (
        <button onClick={openCamera} className="px-4 py-2 bg-green-500 text-white rounded">
          🎥 Open Live Camera
        </button>
      )}

      {isCameraOpen && (
        <div className="flex flex-col items-center">
          <video ref={videoRef} autoPlay className="w-64 h-64 border" />
          <button onClick={captureImage} className="px-4 py-2 mt-2 bg-red-500 text-white rounded">
            📷 Capture Image
          </button>
        </div>
      )}

      {/* Original Image Preview */}
      {image && (
        <>
          <h2 className="text-lg font-semibold">Original Image</h2>
          <img src={image} alt="Original" className="w-64 h-64 object-cover border" />
        </>
      )}

      {/* Processed Image Preview */}
      {processedImage && (
        <>
          <h2 className="text-lg font-semibold">Processed Image (Grayscale)</h2>
          <img src={processedImage} alt="Processed" className="w-64 h-64 object-cover border" />
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
    </div>
  );
}
