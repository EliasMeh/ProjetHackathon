'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ImageMetadata {
  make?: string;
  model?: string;
  orientation?: number;
  dateTime?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  [key: string]: string | number | undefined; // For any additional metadata properties
}

export default function MetadataPage() {
  const [image, setImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve data from localStorage
    const savedImage = localStorage.getItem("capturedImage");
    const savedMetadata = localStorage.getItem("metadata");

    if (!savedImage) {
      router.push("/"); // Redirect if no image data is found
    } else {
      setImage(savedImage);
      setMetadata(savedMetadata ? JSON.parse(savedMetadata) : {});
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Image Metadata</h1>

      {/* Display Image */}
      {image && <img src={image} alt="Captured" className="w-64 h-64 object-cover border" />}

      {/* Display Metadata */}
      <div className="mt-4 p-2 border w-full text-sm">
        <h2 className="font-semibold">Metadata:</h2>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </div>

      {/* Back to Capture Page */}
      <button onClick={() => router.push("/")} className="px-4 py-2 bg-gray-500 text-white rounded">
        🔄 Capture Again
      </button>
    </div>
  );
}