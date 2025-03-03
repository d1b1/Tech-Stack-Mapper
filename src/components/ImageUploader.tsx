import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string, name: string) => void;
  onCancel: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    // Set the file name without extension as default name
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExtension);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (previewUrl && fileName.trim()) {
      // Store the image in localStorage to ensure it persists
      onImageUpload(previewUrl, fileName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Stack Element</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="flex flex-col items-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-40 max-w-full mb-4 object-contain" 
              />
              <button 
                onClick={() => setPreviewUrl(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={48} className="text-gray-400 mb-2" />
              <p className="mb-2">Drag and drop your image here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Browse Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="mt-4">
            <label htmlFor="element-name" className="block text-sm font-medium text-gray-700 mb-1">
              Element Name
            </label>
            <input
              id="element-name"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter element name"
              required
            />
          </div>
        )}

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!previewUrl || !fileName.trim()}
            className={`px-4 py-2 rounded ${
              previewUrl && fileName.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Element
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;