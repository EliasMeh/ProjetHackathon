'use client';
import { Suspense, type ReactElement } from 'react';

interface Metadata {
  source: string;
  timestamp: string;
  [key: string]: string;
}

const MetadataContent = (): ReactElement => {
  const storedImage = sessionStorage.getItem('currentImage') ?? '';
  const metadata: Metadata = {
    source: storedImage.startsWith('blob:') ? 'Camera' : 'File Upload',
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Image Metadata</h1>
      {storedImage && (
        <img 
          src={storedImage} 
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
