import React, { useRef, useState } from 'react';
import { Plus, Image, StickyNote, Save, Upload, Download, Menu, X, AlignCenter, Settings, Trash2 } from 'lucide-react';

interface ToolbarProps {
  onAddLogo: () => void;
  onAddNote: () => void;
  onAddConnection: () => void;
  onDelete: () => void;
  onSave: () => void;
  onLoad: (file: File) => void;
  onExport: () => void;
  onClearAll: () => void;
  onCenterElements: () => void;
  onOpenSettings: () => void;
  selectedNodeId: string | null;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddLogo,
  onAddNote,
  onAddConnection,
  onDelete,
  onSave,
  onLoad,
  onExport,
  onClearAll,
  onCenterElements,
  onOpenSettings,
  selectedNodeId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoad(file);
      setShowOptionsMenu(false);
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    onSave();
    setShowOptionsMenu(false);
  };

  const handleExport = () => {
    onExport();
    setShowOptionsMenu(false);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
    setShowOptionsMenu(false);
  };

  const handleCenterElements = () => {
    onCenterElements();
    setShowOptionsMenu(false);
  };

  const handleOpenSettings = () => {
    onOpenSettings();
    setShowOptionsMenu(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-2 z-20 flex items-center">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800">Technology Stack Builder</h1>
        
        {/* Push everything else to the right */}
        <div className="flex-grow"></div>
        
        {/* Right-side buttons group */}
        <div className="flex items-center space-x-2 mr-2">
          {/* Add Stack Element Button */}
          <button
            onClick={onAddLogo}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center space-x-1"
            title="Add Stack Element"
          >
            <Image size={18} />
            <span>Add Stack Element</span>
          </button>
          
          {/* Add Note Button */}
          <button
            onClick={onAddNote}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 flex items-center space-x-1"
            title="Add Note"
          >
            <StickyNote size={18} />
            <span>Add Note</span>
          </button>
          
          {/* Options Menu */}
          <div className="relative" ref={optionsMenuRef}>
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded hover:bg-gray-100 flex items-center space-x-1"
              title="Options"
            >
              <Menu size={18} />
              <span>Options</span>
            </button>
            
            {showOptionsMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 transform -translate-x-0">
                <div className="py-1">
                  <button
                    onClick={handleSave}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    <span>Save Diagram</span>
                  </button>
                  <button
                    onClick={handleLoad}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    <span>Load Diagram</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    <span>Export as PNG</span>
                  </button>
                  <button
                    onClick={handleCenterElements}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <AlignCenter size={16} className="mr-2" />
                    <span>Center Elements</span>
                  </button>
                  <button
                    onClick={handleOpenSettings}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <Settings size={16} className="mr-2" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={onClearAll}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
                  >
                    <Trash2 size={16} className="mr-2" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 shadow-md p-2 z-20 flex justify-center items-center">
        <span className="text-sm text-gray-600">© 2025 Low Code CTO</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </>
  );
};

export default Toolbar;