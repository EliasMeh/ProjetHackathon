'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ImageMetadata {
    // Basic Image Information
    Make?: string;
    Model?: string;
    Orientation?: number;
    DateTime?: string;
    ModifyDate?: string;
    DateTimeOriginal?: string;
    CreateDate?: string;
  
    // Camera Settings
    ExposureTime?: number;
    FNumber?: number;
    ISOSpeedRatings?: number;
    ShutterSpeedValue?: number;
    ApertureValue?: number;
    FocalLength?: number;
    FocalLengthIn35mmFilm?: number;
    Flash?: number;
    WhiteBalance?: number;
  
    // Image Details
    PixelXDimension?: number;
    PixelYDimension?: number;
    ColorSpace?: number;
    ImageWidth?: number;
    ImageHeight?: number;
    BitsPerSample?: number;
    ImageDescription?: string;
    Software?: string;
  
    // GPS Information
    GPSLatitude?: number[];
    GPSLongitude?: number[];
    GPSLatitudeRef?: string;
    GPSLongitudeRef?: string;
    GPSAltitude?: number;
    GPSAltitudeRef?: number;
    GPSTimeStamp?: number[];
    GPSDateStamp?: string;
  
    // Copyright Information
    Copyright?: string;
    Artist?: string;
  
    [key: string]: string | number | number[] | undefined;
  }

export default function MetadataPage() {
  const [image, setImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedImage = localStorage.getItem("capturedImage");
    const savedMetadata = localStorage.getItem("metadata");

    if (!savedImage) {
      router.push("/");
    } else {
      setImage(savedImage);
      setMetadata(savedMetadata ? JSON.parse(savedMetadata) : {});
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Image Metadata</h1>
      {image && <img src={image} alt="Captured" className="w-64 h-64 object-cover border" />}
      <div className="mt-4 p-2 border w-full text-sm">
        <h2 className="font-semibold">Metadata:</h2>
        <pre>{metadata ? JSON.stringify(metadata, null, 2) : "No metadata available"}</pre>
      </div>
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded">
        🔄 Capture Again
      </button>
    </div>
  );
}
