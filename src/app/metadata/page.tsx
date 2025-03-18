'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, type ReactElement } from 'react';

interface Metadata {
  source: string;
  timestamp: string;
  [key: string]: string;
}

const MetadataContent = (): ReactElement => {
  const params = useSearchParams();
  const image = params.get('image') ?? '';
  const decodedImage = decodeURIComponent(image);

  const metadata: Metadata = {
    source: image.startsWith('blob:') ? 'Camera' : 'File Upload',
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Image Metadata</h1>
      {decodedImage && (
        <img 
          src={decodedImage} 
          alt="Submitted" 
          className="mb-4 max-w-full h-auto"
        />
      )}
      <ul className="list-disc pl-6">
        {Object.entries(metadata).map(([key, value]) => (
          <li key={key} className="mb-2">
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MetadataPage = (): ReactElement => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MetadataContent />
    </Suspense>
  );
};

export default MetadataPage;