'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Camera from '@/app/composants/Camera';
import ImageUpload from '@/app/composants/ImageUpload';

export default function HomePage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleCapture = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (selectedImage) {
      sessionStorage.setItem('currentImage', selectedImage);
      router.push('/metadata');
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Capture or Upload Image</h1>
      <Camera onCapture={handleCapture} />
      <div className="my-4">OR</div>
      <ImageUpload onUpload={handleUpload} />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={!selectedImage}
      >
        Submit
      </button>
    </main>
  );
}
