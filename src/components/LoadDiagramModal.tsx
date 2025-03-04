import React from 'react';
import { X, Upload, AlertTriangle } from 'lucide-react';

interface LoadDiagramModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LoadDiagramModal: React.FC<LoadDiagramModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Load Diagram</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start mb-4">
            <AlertTriangle size={24} className="text-amber-500 mr-2 mt-1 flex-shrink-0" />
            <p className="text-gray-600">
              Loading a diagram will replace your current tech stack and settings. 
              This action cannot be undone. Make sure to save your current work if needed.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadDiagramModal;