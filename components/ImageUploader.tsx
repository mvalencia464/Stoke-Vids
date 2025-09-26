import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, ReplaceIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageDataUrl: string | null;
  onImageRemove: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageDataUrl, onImageRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined | null) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // This is necessary to show the copy cursor
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const uploaderClass = `relative w-full max-w-xl h-72 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-300 ${isDragging ? 'border-purple-500 bg-gray-800/50 scale-105' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'}`;

  if (imageDataUrl) {
    return (
        <div className="relative w-full max-w-xl animate-fade-in group">
             <img src={imageDataUrl} alt="Preview" className="w-full rounded-xl object-contain" style={{ maxHeight: '50vh'}} />
             <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleClick}
                    className="p-2 bg-gray-800/70 rounded-full text-white hover:bg-gray-700/90 backdrop-blur-sm transition-all transform hover:scale-110"
                    aria-label="Replace Image"
                    title="Replace Image"
                >
                    <ReplaceIcon />
                </button>
                 <button
                    onClick={onImageRemove}
                    className="p-2 bg-red-600/70 rounded-full text-white hover:bg-red-500/90 backdrop-blur-sm transition-all transform hover:scale-110"
                    aria-label="Remove Image"
                    title="Remove Image"
                 >
                    <TrashIcon />
                 </button>
             </div>
        </div>
    );
  }

  return (
    <div
      className={uploaderClass}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <UploadIcon />
        <p className="font-semibold text-lg">
          <span className="text-purple-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm">PNG, JPG, GIF or WEBP</p>
      </div>
    </div>
  );
};