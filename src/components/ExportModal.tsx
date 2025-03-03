import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

interface ExportModalProps {
  onExport: (fileName: string) => void;
  onCancel: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onExport, onCancel }) => {
  const [fileName, setFileName] = useState('stack-diagram');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim()) {
      onExport(fileName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Export Diagram</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file-name" className="block text-sm font-medium text-gray-700 mb-1">
              File Name
            </label>
            <input
              id="file-name"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter file name"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              The file will be saved as {fileName}.png
            </p>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fileName.trim()}
              className={`px-4 py-2 rounded flex items-center ${
                fileName.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download size={16} className="mr-2" />
              Export PNG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal;