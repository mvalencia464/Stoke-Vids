import React from 'react';
import { DownloadIcon, StartOverIcon } from './icons';

interface VideoPlayerProps {
  src: string;
  onReset: () => void;
  aspectRatio: string;
}

const getAspectRatioClass = (ratio: string): string => {
  switch (ratio) {
    case '9:16':
      return 'aspect-[9/16]';
    case '1:1':
      return 'aspect-square';
    case '16:9':
    default:
      return 'aspect-video';
  }
};

const getContainerWidthClass = (ratio: string): string => {
  switch (ratio) {
    case '9:16':
      return 'max-w-sm';
    case '1:1':
      return 'max-w-lg';
    case '16:9':
    default:
      return 'max-w-2xl';
  }
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onReset, aspectRatio }) => {
  const aspectRatioClass = getAspectRatioClass(aspectRatio);
  const containerWidthClass = getContainerWidthClass(aspectRatio);

  return (
    <div className={`w-full ${containerWidthClass} flex flex-col items-center gap-6 animate-fade-in`}>
      <h2 className="text-3xl font-bold text-center">Your Stoke Vid is Ready!</h2>
      <div className={`w-full rounded-xl overflow-hidden shadow-2xl shadow-purple-900/20 border-2 border-purple-500 ${aspectRatioClass}`}>
        <video src={src} controls autoPlay loop className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center gap-4">
        <a 
          href={src} 
          download="stoke-vid.mp4"
          className="group flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <DownloadIcon />
          Download
        </a>
        <button
          onClick={onReset}
          className="group flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-gray-700 transition-all duration-300"
        >
          <StartOverIcon />
          Create Another
        </button>
      </div>
    </div>
  );
};