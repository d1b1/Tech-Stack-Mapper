import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface SettingsPanelProps {
  backgroundColor: string;
  onSave: (backgroundColor: string) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  backgroundColor,
  onSave,
  onClose,
}) => {
  const [bgColor, setBgColor] = useState(backgroundColor);
  const [presetColors, setPresetColors] = useState([
    '#f8fafc', // slate-50
    '#f1f5f9', // slate-100
    '#e2e8f0', // slate-200
    '#f0f9ff', // sky-50
    '#e0f2fe', // sky-100
    '#f0fdf4', // green-50
    '#dcfce7', // green-100
    '#fef2f2', // red-50
    '#fee2e2', // red-100
    '#fff7ed', // orange-50
    '#ffedd5', // orange-100
    '#fffbeb', // amber-50
    '#fef3c7', // amber-100
  ]);

  useEffect(() => {
    setBgColor(backgroundColor);
  }, [backgroundColor]);

  const handleSave = () => {
    onSave(bgColor);
    onClose();
  };

  const handleColorSelect = (color: string) => {
    setBgColor(color);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Canvas Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bg-color" className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center">
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 border border-gray-300 rounded mr-2"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preset Colors
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className="h-8 w-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;