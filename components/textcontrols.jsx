import { useEffect, useRef, useState, useCallback } from 'react';
import { Type, ChevronDown, ChevronUp } from 'lucide-react';

const position = {
  positions: [
    { id: "above-head", label: "Above Head" },
    { id: "top-left", label: "Top Left" },
    { id: "top-right", label: "Top Right" },
    { id: "bottom", label: "Bottom" }
  ]
};

const TextControls = ({ textConfig, onTextChange, selectedFace }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 rounded-xl mb-4 shadow-lg border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white border-none rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
      >
        <Type className="w-5 h-5" />
        <span>Add Text to Face</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Font:</label>
              <select
                value={textConfig.font}
                onChange={(e) => onTextChange({ ...textConfig, font: e.target.value })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none transition-colors bg-white shadow-sm"
              >
                <option value="DroidSans">Modern Sans</option>
                <option value="NimbusRoman-Bold">Classic Serif</option>
                <option value="DejaVuSansMono-Bold">Typewriter</option>
                <option value="URWBookman-Demi">Elegant Bookman</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Color:</label>
              <select
                value={textConfig.color}
                onChange={(e) => onTextChange({ ...textConfig, color: e.target.value })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none transition-colors bg-white shadow-sm"
              >
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={textConfig.text}
              onChange={(e) => onTextChange({ ...textConfig, text: e.target.value })}
              placeholder="Enter your text here..."
              maxLength={50}
              className="w-full p-3 border-2 border-purple-300 rounded-lg focus:border-purple-600 outline-none shadow-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Size:</label>
              <select
                value={textConfig.size}
                onChange={(e) => onTextChange({ ...textConfig, size: e.target.value })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none transition-colors bg-white shadow-sm"
              >
                <option value="160">Large</option>
                <option value="125">Medium</option>
                <option value="90">Small</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Position:</label>
              <select
                value={textConfig.position}
                onChange={(e) => onTextChange({ ...textConfig, position: e.target.value })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none transition-colors bg-white shadow-sm"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>

          <div className="bg-white/60 rounded-lg p-3">
            <small className="block text-sm text-gray-600 text-center font-medium">
              ✨ Text updates automatically as you type
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextControls;