import React, { useState, useEffect, useRef } from 'react';
import { Edit, X, Save, Plus, Minus, DropletIcon, Trash2, Link } from 'lucide-react';
import { NodeData } from '../types';

interface NodeDetailsPanelProps {
  node: NodeData | null;
  onEdit: (nodeId: string) => void;
  onUpdate: (updatedNode: NodeData) => void;
  onClose: () => void;
  onDelete?: () => void;
  onAddConnection?: () => void;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({ 
  node, 
  onEdit, 
  onUpdate, 
  onClose,
  onDelete,
  onAddConnection
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [imageSize, setImageSize] = useState(120); // Size in pixels
  const [dropShadow, setDropShadow] = useState(false);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#333333');
  const [backgroundColor, setBackgroundColor] = useState('#fffde7');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(120);
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Update local state when node changes
  useEffect(() => {
    if (node) {
      setName(node.content);
      setDescription(node.description || '');
      setNoteContent(node.content);
      setDropShadow(node.dropShadow || false);
      setBorderWidth(node.borderWidth || 0);
      setBorderColor(node.borderColor || '#000000');
      setFontSize(node.fontSize || 14);
      setFontColor(node.fontColor || '#333333');
      setBackgroundColor(node.backgroundColor || (node.type === 'note' ? '#fffde7' : '#ffffff'));
      setWidth(node.width || 200);
      setHeight(node.height || 120);
      
      // Set image size to current width
      if (node.type === 'logo') {
        setImageSize(node.width || 120);
      }
    }
  }, [node]);

  // Auto-focus the first input when node changes
  useEffect(() => {
    if (node && node.type === 'logo' && nameInputRef.current && !document.activeElement?.contains(descriptionInputRef.current)) {
      nameInputRef.current.focus();
    } else if (node && node.type === 'note' && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [node?.id]); // Only trigger when the node ID changes, not on every node change

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (node) {
      onUpdate({
        ...node,
        content: e.target.value
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (node) {
      onUpdate({
        ...node,
        description: e.target.value
      });
    }
  };

  const handleNoteContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
    if (node) {
      onUpdate({
        ...node,
        content: e.target.value
      });
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (node && node.type === 'logo') {
      const newSize = parseInt(e.target.value);
      setImageSize(newSize);
      
      // Calculate height based on aspect ratio
      const aspectRatio = node.height / node.width;
      const newHeight = Math.round(newSize * aspectRatio);
      
      onUpdate({
        ...node,
        width: newSize,
        height: newHeight
      });
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setWidth(newWidth);
    if (node && node.type === 'note') {
      onUpdate({
        ...node,
        width: newWidth
      });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    setHeight(newHeight);
    if (node && node.type === 'note') {
      onUpdate({
        ...node,
        height: newHeight
      });
    }
  };

  const handleDropShadowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDropShadow(checked);
    if (node) {
      onUpdate({
        ...node,
        dropShadow: checked
      });
    }
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    setBorderWidth(width);
    if (node) {
      onUpdate({
        ...node,
        borderWidth: width
      });
    }
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBorderColor(color);
    if (node) {
      onUpdate({
        ...node,
        borderColor: color
      });
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setFontSize(size);
    if (node) {
      onUpdate({
        ...node,
        fontSize: size
      });
    }
  };

  const handleFontColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setFontColor(color);
    if (node) {
      onUpdate({
        ...node,
        fontColor: color
      });
    }
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBackgroundColor(color);
    if (node) {
      onUpdate({
        ...node,
        backgroundColor: color
      });
    }
  };

  // Prevent clicks in the panel from propagating to the canvas
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!node) {
    return null;
  }

  return (
    <div 
      className="fixed right-0 top-16 bottom-0 w-1/3 bg-white border-l border-gray-200 p-4 overflow-y-auto shadow-lg z-10"
      onClick={handlePanelClick}
      ref={panelRef}
    >
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Element Details</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
          title="Close Panel"
        >
          <X size={20} />
        </button>
      </div>

      {/* Add Connection button */}
      <div className="mb-4">
        <button
          onClick={onAddConnection}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Link size={16} className="mr-2" />
          Connect to Another Element
        </button>
      </div>

      {node.type === 'logo' ? (
        <div className="space-y-4">
          {/* Logo image preview */}
          <div className="border rounded-lg p-2 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Image</h3>
            <div className="flex justify-center">
              {node.imageUrl && (
                <div 
                  className="relative" 
                  style={{ 
                    boxShadow: dropShadow ? '0 4px 8px rgba(0,0,0,0.3)' : 'none',
                    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
                    padding: '4px'
                  }}
                >
                  <img 
                    src={node.imageUrl} 
                    alt={node.content} 
                    className="object-contain"
                    style={{ maxHeight: '120px' }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Logo name - always editable */}
          <div>
            <label htmlFor="logo-name" className="block text-sm font-bold text-gray-700 mb-1">
              Title
            </label>
            <input
              id="logo-name"
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter element name"
            />
          </div>
          
          {/* Logo description - always editable */}
          <div>
            <label htmlFor="logo-description" className="block text-sm font-medium text-gray-500 mb-1">
              Description
            </label>
            <textarea
              id="logo-description"
              ref={descriptionInputRef}
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Enter description"
            />
          </div>
          
          {/* Styling options */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Styling Options</h3>
            
            {/* Image size and Border width in one row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Image size slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="image-size" className="text-xs text-gray-500">Image Size</label>
                  <span className="text-xs font-medium">{imageSize}px</span>
                </div>
                <input
                  id="image-size"
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={imageSize}
                  onChange={handleSizeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Border width slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="border-width" className="text-xs text-gray-500">Border Width</label>
                  <span className="text-xs font-medium">{borderWidth}px</span>
                </div>
                <input
                  id="border-width"
                  type="range"
                  min="0"
                  max="10"
                  value={borderWidth}
                  onChange={handleBorderWidthChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Drop shadow and Border color in one row */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* Drop shadow toggle */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Drop Shadow
                </label>
                <div className="flex items-center h-8">
                  <input
                    id="drop-shadow"
                    type="checkbox"
                    checked={dropShadow}
                    onChange={handleDropShadowChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="drop-shadow" className="ml-2 text-sm text-gray-700">
                    Enable
                  </label>
                </div>
              </div>
              
              {/* Border color - only show if border width > 0 */}
              {borderWidth > 0 && (
                <div>
                  <label htmlFor="border-color" className="block text-xs text-gray-500 mb-1">
                    Border Color
                  </label>
                  <div className="flex items-center">
                    <input
                      id="border-color"
                      type="color"
                      value={borderColor}
                      onChange={handleBorderColorChange}
                      className="h-8 w-8 border border-gray-300 rounded mr-2"
                    />
                    <span className="text-xs font-mono truncate">{borderColor}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Note content - always editable */}
          <div>
            <label htmlFor="note-content" className="block text-sm font-medium text-gray-500 mb-1">
              Note Content
            </label>
            <textarea
              id="note-content"
              ref={noteInputRef}
              value={noteContent}
              onChange={handleNoteContentChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              placeholder="Enter note content"
              style={{
                fontSize: '16px',
                color: fontColor,
                backgroundColor: backgroundColor
              }}
            />
          </div>

          {/* Note size options */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Size Options</h3>
            
            {/* Width and Height in one row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Width slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="note-width" className="text-xs text-gray-500">Width</label>
                  <span className="text-xs font-medium">{width}px</span>
                </div>
                <input
                  id="note-width"
                  type="range"
                  min="10"
                  max="800"
                  step="10"
                  value={width}
                  onChange={handleWidthChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Height slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="note-height" className="text-xs text-gray-500">Height</label>
                  <span className="text-xs font-medium">{height}px</span>
                </div>
                <input
                  id="note-height"
                  type="range"
                  min="10"
                  max="800"
                  step="10"
                  value={height}
                  onChange={handleHeightChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Note styling options */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Styling Options</h3>
            
            {/* Font size and Border width in one row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Font size slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="font-size" className="text-xs text-gray-500">Font Size</label>
                  <span className="text-xs font-medium">{fontSize}px</span>
                </div>
                <input
                  id="font-size"
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Border width slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="note-border-width" className="text-xs text-gray-500">Border Width</label>
                  <span className="text-xs font-medium">{borderWidth}px</span>
                </div>
                <input
                  id="note-border-width"
                  type="range"
                  min="0"
                  max="10"
                  value={borderWidth}
                  onChange={handleBorderWidthChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Colors and Drop Shadow in one row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Font color picker */}
              <div>
                <label htmlFor="font-color" className="block text-xs text-gray-500 mb-1">
                  Font Color
                </label>
                <div className="flex items-center">
                  <input
                    id="font-color"
                    type="color"
                    value={fontColor}
                    onChange={handleFontColorChange}
                    className="h-8 w-8 border border-gray-300 rounded mr-2"
                  />
                  <span className="text-xs font-mono truncate">{fontColor}</span>
                </div>
              </div>
              
              {/* Background color picker */}
              <div>
                <label htmlFor="bg-color" className="block text-xs text-gray-500 mb-1">
                  Background
                </label>
                <div className="flex items-center">
                  <input
                    id="bg-color"
                    type="color"
                    value={backgroundColor}
                    onChange={handleBackgroundColorChange}
                    className="h-8 w-8 border border-gray-300 rounded mr-2"
                  />
                  <span className="text-xs font-mono truncate">{backgroundColor}</span>
                </div>
              </div>
              
              {/* Drop shadow toggle */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Drop Shadow
                </label>
                <div className="flex items-center h-8">
                  <input
                    id="note-drop-shadow"
                    type="checkbox"
                    checked={dropShadow}
                    onChange={handleDropShadowChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="note-drop-shadow" className="ml-2 text-sm text-gray-700">
                    Enable
                  </label>
                </div>
              </div>
            </div>

            {/* Border color - only show if border width > 0 */}
            {borderWidth > 0 && (
              <div className="mb-3">
                <label htmlFor="note-border-color" className="block text-xs text-gray-500 mb-1">
                  Border Color
                </label>
                <div className="flex items-center">
                  <input
                    id="note-border-color"
                    type="color"
                    value={borderColor}
                    onChange={handleBorderColorChange}
                    className="h-8 w-8 border border-gray-300 rounded mr-2"
                  />
                  <span className="text-xs font-mono">{borderColor}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
      
      {/* Delete button at the bottom */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <Trash2 size={16} className="mr-2" />
          Delete Element
        </button>
      </div>
    </div>
  );
};

export default NodeDetailsPanel;