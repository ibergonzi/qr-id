'use client';

import { useRef } from 'react';

interface Props {
  onPhotoChange: (file: File) => void;
  preview: string;
}

export default function PhotoUpload({ onPhotoChange, preview }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onPhotoChange(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onPhotoChange(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <img src={preview} alt="Vista previa" className="w-24 h-24 rounded-full object-cover border-2 border-blue-200" />
            <p className="text-xs text-gray-400">Clic para cambiar</p>
          </div>
        ) : (
          <>
            <span className="text-4xl">📸</span>
            <p className="text-gray-500 text-sm mt-2">Clic o arrastrá una foto</p>
            <p className="text-gray-400 text-xs mt-1">JPG, PNG, WEBP</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
