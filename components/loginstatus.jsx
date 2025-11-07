import React from 'react';
import { User, LogIn, Gift } from 'lucide-react';

const LoginStatus = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Guest User</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              <span>1 free download available</span>
            </div>
          </div>
        </div>

        {/* Login Button */}
       
      </div>
      <a 
          href="/login" 
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </a>
    </div>
  );
};

export default LoginStatus;