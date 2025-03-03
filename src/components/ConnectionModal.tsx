import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NodeData } from '../types';

interface ConnectionModalProps {
  nodes: NodeData[];
  selectedNodeId: string;
  onConnect: (fromId: string, toId: string, pathType: 'smart' | 'curved' | 'straight') => void;
  onCancel: () => void;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({
  nodes,
  selectedNodeId,
  onConnect,
  onCancel,
}) => {
  const [targetNodeId, setTargetNodeId] = useState<string>('');
  const [pathType, setPathType] = useState<'smart' | 'curved' | 'straight'>('smart');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetNodeId) {
      onConnect(selectedNodeId, targetNodeId, pathType);
    }
  };

  // Filter out the selected node from the options
  const availableNodes = nodes.filter(node => node.id !== selectedNodeId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Connection</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">From:</label>
            <div className="p-2 bg-gray-100 rounded">
              {nodes.find(node => node.id === selectedNodeId)?.content || 'Selected Node'}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="targetNode" className="block text-gray-700 mb-2">To:</label>
            <select
              id="targetNode"
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a node</option>
              {availableNodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.content}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Connection Style:</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="smart"
                  checked={pathType === 'smart'}
                  onChange={() => setPathType('smart')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Smart (Auto)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="curved"
                  checked={pathType === 'curved'}
                  onChange={() => setPathType('curved')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Curved</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="straight"
                  checked={pathType === 'straight'}
                  onChange={() => setPathType('straight')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Straight</span>
              </label>
            </div>
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
              disabled={!targetNodeId}
              className={`px-4 py-2 rounded ${
                targetNodeId
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionModal;