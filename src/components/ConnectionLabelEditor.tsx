import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ConnectionData } from '../types';

interface ConnectionLabelEditorProps {
  connection: ConnectionData;
  onSave: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const ConnectionLabelEditor: React.FC<ConnectionLabelEditorProps> = ({
  connection,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [label, setLabel] = useState(connection.label || '');

  useEffect(() => {
    setLabel(connection.label || '');
  }, [connection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(connection.id, label);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      onDelete(connection.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Connection</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="label" className="block text-gray-700 mb-2">Connection Label:</label>
            <input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a label for this connection"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Connection
            </button>
            
            <div className="space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionLabelEditor;