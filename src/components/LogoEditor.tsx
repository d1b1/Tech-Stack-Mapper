import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { NodeData } from '../types';

interface LogoEditorProps {
  node: NodeData;
  onSave: (id: string, name: string, description: string) => void;
  onCancel: () => void;
}

const LogoEditor: React.FC<LogoEditorProps> = ({ node, onSave, onCancel }) => {
  const [name, setName] = useState(node.content);
  const [description, setDescription] = useState(node.description || '');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setName(node.content);
    setDescription(node.description || '');
    
    // Focus on the name input when the component mounts
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(node.id, name, description);
  };

  // Handle tab key to move between inputs
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      if (descriptionRef.current) {
        e.preventDefault();
        descriptionRef.current.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Logo Details</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              ref={nameInputRef}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter logo name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              ref={descriptionRef}
              className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogoEditor;