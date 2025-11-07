import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const BackTextControls = ({ backTextConfig, onBackTextChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colors = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' }
  ];

  const positions = [
    { value: 'middle', label: 'Center' },
    { value: 'top', label: 'Top (Compact)' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 
                     hover:from-slate-100 hover:to-gray-100 transition-all duration-200
                     flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">Back Page Content</h3>
              <p className="text-xs text-gray-500">Add custom text to page 2</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Text
                </label>
                <input
                  type="text"
                  value={backTextConfig.text}
                  onChange={(e) => onBackTextChange({ ...backTextConfig, text: e.target.value })}
                  placeholder="Enter text (e.g., Printed by ABC Company)"
                  maxLength={30}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition-all text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  {backTextConfig.text.length}/30 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <select
                    value={backTextConfig.color}
                    onChange={(e) => onBackTextChange({ ...backTextConfig, color: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             outline-none transition-all text-sm bg-white"
                  >
                    {colors.map(color => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={backTextConfig.position}
                    onChange={(e) => onBackTextChange({ ...backTextConfig, position: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             outline-none transition-all text-sm bg-white"
                  >
                    {positions.map(pos => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Changes are applied automatically to page 2</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackTextControls;