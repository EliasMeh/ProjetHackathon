import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
}

const videoConstraints: MediaTrackConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImageSrc(imageSrc);
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  return (
    <div>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      {imageSrc && <img src={imageSrc} alt="Captured" />}
    </div>
  );
};

export default Camera;
