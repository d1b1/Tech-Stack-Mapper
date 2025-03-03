import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface NoteEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ initialContent = '', onSave, onCancel }) => {
  const [content, setContent] = useState(initialContent);
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#333333');
  const [backgroundColor, setBackgroundColor] = useState('#fffde7');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(120);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    const savedNoteSettings = localStorage.getItem('stack-diagram-note-settings');
    if (savedNoteSettings) {
      try {
        const settings = JSON.parse(savedNoteSettings);
        setFontSize(settings.fontSize || 14);
        setFontColor(settings.fontColor || '#333333');
        setBackgroundColor(settings.backgroundColor || '#fffde7');
        setWidth(settings.width || 200);
        setHeight(settings.height || 120);
      } catch (error) {
        console.error('Error loading note settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    const settings = {
      fontSize,
      fontColor,
      backgroundColor,
      width,
      height
    };
    localStorage.setItem('stack-diagram-note-settings', JSON.stringify(settings));
  }, [fontSize, fontColor, backgroundColor, width, height]);

  useEffect(() => {
    setContent(initialContent);
    
    // Focus on the content textarea when the component mounts
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, [initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Note</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1">
              Note Content
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your note here..."
              style={{
                fontSize: `${fontSize}px`,
                color: fontColor,
                backgroundColor: backgroundColor
              }}
              ref={contentRef}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Size controls */}
            <div>
              <label htmlFor="note-width" className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="note-width"
                  min="100"
                  max="400"
                  step="10"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm">{width}px</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="note-height" className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="note-height"
                  min="80"
                  max="400"
                  step="10"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm">{height}px</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="font-size"
                  min="10"
                  max="24"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm">{fontSize}px</span>
              </div>
            </div>

            <div>
              <label htmlFor="font-color" className="block text-sm font-medium text-gray-700 mb-1">
                Font Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="font-color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="h-8 w-8 border border-gray-300 rounded mr-2"
                />
                <span className="text-xs font-mono">{fontColor}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="bg-color" className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="bg-color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-8 w-8 border border-gray-300 rounded mr-2"
              />
              <span className="text-xs font-mono">{backgroundColor}</span>
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

export default NoteEditor;