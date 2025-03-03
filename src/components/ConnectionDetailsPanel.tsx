import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { ConnectionData, NodeData } from '../types';

interface ConnectionDetailsPanelProps {
  connection: ConnectionData;
  nodes: NodeData[];
  onUpdate: (updatedConnection: ConnectionData) => void;
  onDelete: (connectionId: string) => void;
  onClose: () => void;
}

const ConnectionDetailsPanel: React.FC<ConnectionDetailsPanelProps> = ({
  connection,
  nodes,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [label, setLabel] = useState(connection.label || '');
  const [pathType, setPathType] = useState(connection.pathType || 'smart');
  const [lineColor, setLineColor] = useState(connection.lineColor || '#666666');
  const [lineWidth, setLineWidth] = useState(connection.lineWidth || 2);
  const [lineDash, setLineDash] = useState<boolean>(connection.lineDash ? true : false);

  // Get source and target node names
  const sourceNode = nodes.find(node => node.id === connection.from);
  const targetNode = nodes.find(node => node.id === connection.to);

  // Load connection settings from localStorage
  useEffect(() => {
    const savedConnectionSettings = localStorage.getItem('stack-diagram-connection-settings');
    if (savedConnectionSettings) {
      try {
        const settings = JSON.parse(savedConnectionSettings);
        // Only apply default settings for new connections (without custom settings)
        if (!connection.lineColor && !connection.lineWidth) {
          setLineColor(settings.lineColor || '#666666');
          setLineWidth(settings.lineWidth || 2);
          setLineDash(settings.lineDash || false);
          setPathType(settings.pathType || 'smart');
        }
      } catch (error) {
        console.error('Error loading connection settings:', error);
      }
    }
  }, [connection]);

  useEffect(() => {
    setLabel(connection.label || '');
    setPathType(connection.pathType || 'smart');
    setLineColor(connection.lineColor || '#666666');
    setLineWidth(connection.lineWidth || 2);
    setLineDash(connection.lineDash ? true : false);
  }, [connection]);

  const handleUpdate = () => {
    // Save current settings as defaults for future connections
    const settings = {
      lineColor,
      lineWidth,
      lineDash,
      pathType
    };
    localStorage.setItem('stack-diagram-connection-settings', JSON.stringify(settings));
    
    onUpdate({
      ...connection,
      label,
      pathType: pathType as 'smart' | 'curved' | 'straight',
      lineColor,
      lineWidth,
      lineDash: lineDash ? [5, 5] : undefined
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      onDelete(connection.id);
    }
  };

  // Prevent clicks in the panel from propagating to the canvas
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed right-0 top-16 bottom-0 w-1/3 bg-white border-l border-gray-200 p-4 overflow-y-auto shadow-lg z-10"
      onClick={handlePanelClick}
    >
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Connection Details</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
          title="Close Panel"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Connection endpoints */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-500">From:</span>
            <span className="ml-2 font-medium">{sourceNode?.content || 'Unknown node'}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">To:</span>
            <span className="ml-2 font-medium">{targetNode?.content || 'Unknown node'}</span>
          </div>
        </div>

        {/* Connection label */}
        <div>
          <label htmlFor="connection-label" className="block text-sm font-medium text-gray-500 mb-1">
            Label
          </label>
          <input
            id="connection-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter connection label"
          />
        </div>

        {/* Connection style */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Connection Style
          </label>
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

        {/* Line color */}
        <div>
          <label htmlFor="line-color" className="block text-sm font-medium text-gray-500 mb-1">
            Line Color
          </label>
          <div className="flex items-center">
            <input
              id="line-color"
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="h-8 w-8 border border-gray-300 rounded mr-2"
            />
            <span className="text-xs font-mono">{lineColor}</span>
          </div>
        </div>

        {/* Line width */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="line-width" className="text-sm font-medium text-gray-500">Line Width</label>
            <span className="text-xs font-medium">{lineWidth}px</span>
          </div>
          <input
            id="line-width"
            type="range"
            min="1"
            max="5"
            step="1"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Line dash */}
        <div className="flex items-center">
          <input
            id="line-dash"
            type="checkbox"
            checked={lineDash}
            onChange={(e) => setLineDash(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="line-dash" className="ml-2 text-sm text-gray-700">
            Dashed Line
          </label>
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Preview</h3>
          <div className="h-16 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <svg width="200" height="40" className="overflow-visible">
              <path
                d="M 20,20 L 180,20"
                stroke={lineColor}
                strokeWidth={lineWidth}
                strokeDasharray={lineDash ? "5,5" : "none"}
                fill="none"
              />
              {label && (
                <text
                  x="100"
                  y="15"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#333"
                >
                  {label}
                </text>
              )}
            </svg>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Connection
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDetailsPanel;