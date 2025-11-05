
import { useEffect, useRef,useState, useCallback } from 'react';
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
      <div className="bg-white p-3 rounded-lg mb-3 shadow-lg border-2 border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-2 hover:opacity-90"
        >
          <span>📝</span>
          <span>Add Text to Face</span>
          <span className="text-xs">{isExpanded ? '▲' : '▼'}</span>
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Font:</label>
                <select
                  value={textConfig.font}
                  onChange={(e) => onTextChange({ ...textConfig, font: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="DroidSans">Modern Sans</option>
                  <option value="NimbusRoman-Bold">Classic Serif</option>
                  <option value="DejaVuSansMono-Bold">Typewriter</option>
                  <option value="URWBookman-Demi">Elegant Bookman</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Color:</label>
                <select
                  value={textConfig.color}
                  onChange={(e) => onTextChange({ ...textConfig, color: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
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
                className="w-full p-2 border-2 border-purple-300 rounded focus:border-purple-500 outline-none"
              />
            </div>
  
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Size:</label>
                <select
                  value={textConfig.size}
                  onChange={(e) => onTextChange({ ...textConfig, size: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="160">Large</option>
                  <option value="125">Medium</option>
                  <option value="90">Small</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Position:</label>
                <select
                  value={textConfig.position}
                  onChange={(e) => onTextChange({ ...textConfig, position: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
  
            <small className="block text-xs text-gray-600 text-center">
              Text updates automatically as you type
            </small>
          </div>
        )}
      </div>
    );
  };
  

  export default TextControls