import React, { useState, useRef, useEffect } from 'react';

const LoginStatus = () => (
    <div className="bg-white p-4 rounded-lg mb-4 border-2 border-gray-200 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span className="flex-1 text-sm leading-relaxed">
          👋 <strong>Guest</strong> (1 free download)
        </span>
        <a href="/login" className="text-xs text-purple-600 no-underline whitespace-nowrap mt-0.5 hover:text-purple-800">
          Log In
        </a>
      </div>
    </div>
  );

  export default LoginStatus