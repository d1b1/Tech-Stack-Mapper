import React from 'react';
import { X, Plus, AlertTriangle } from 'lucide-react';

interface LoadExampleModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LoadExampleModal: React.FC<LoadExampleModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Load Example Stack</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start mb-4">
            <AlertTriangle size={24} className="text-amber-500 mr-2 mt-1 flex-shrink-0" />
            <p className="text-gray-600">
              This will add a sample technology stack to your canvas, including:
              <ul className="mt-2 list-disc ml-4">
                <li>Frontend (React)</li>
                <li>Backend (Node.js)</li>
                <li>Database (PostgreSQL)</li>
                <li>Cache Layer (Redis)</li>
                <li>And more common web technologies</li>
              </ul>
              <p className="mt-2">The example will be automatically centered on your canvas.</p>
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
            <Plus size={16} className="mr-2" />
            Load Example
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadExampleModal; 