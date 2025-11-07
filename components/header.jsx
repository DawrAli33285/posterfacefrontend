import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <a 
            href="https://www.funwithfaces.com" 
            className="inline-block group"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-indigo-700 transition-all">
                EnrichifyData Posters
              </h1>
            </div>
            <p className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
              Create professional posters with AI-powered face detection
            </p>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;