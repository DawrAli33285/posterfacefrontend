
import React, { useState, useRef, useEffect } from 'react';


const BackTextControls = ({ backTextConfig, onBackTextChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-2 hover:opacity-90"
        >
          <span>📄</span>
          <span>Add Text on Back of Poster</span>
          <span className="text-xs">{isExpanded ? '▲' : '▼'}</span>
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-3">
            <h3 className="text-sm font-bold mb-2">Page 2 Logo & Printed By</h3>
            
            <div>
              <label className="block text-xs font-semibold mb-1">Text:</label>
              <input
                type="text"
                value={backTextConfig.text}
                onChange={(e) => onBackTextChange({ ...backTextConfig, text: e.target.value })}
                placeholder="e.g., Printed by ABC Company"
                maxLength={30}
                className="w-full p-2 border-2 border-blue-300 rounded focus:border-blue-500 outline-none"
              />
            </div>
  
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Color:</label>
                <select
                  value={backTextConfig.color}
                  onChange={(e) => onBackTextChange({ ...backTextConfig, color: e.target.value })}
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
              <div>
                <label className="block text-xs font-semibold mb-1">Position:</label>
                <select
                  value={backTextConfig.position}
                  onChange={(e) => onBackTextChange({ ...backTextConfig, position: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="middle">Middle</option>
                  <option value="top">Top (smaller heads)</option>
                </select>
              </div>
            </div>
  
            <small className="block text-xs text-gray-600 text-center">
              Page 2 text updates automatically as you type
            </small>
          </div>
        )}
      </div>
    );
  };

  export default BackTextControls