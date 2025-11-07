import React from 'react';
import { Upload, Scissors, Type, Eye, Download, Crop } from 'lucide-react';

const ActionButtons = ({ 
  currentStep, 
  onUpload, 
  onExtract, 
  onAddText, 
  onPreview, 
  onDownload,
  onManualCrop,  
  showManualCropButton 
}) => {
  const steps = [
    { id: 1, label: 'Upload Image', icon: Upload, onClick: onUpload },
    { id: 2, label: 'Extract Face', icon: Scissors, onClick: onExtract },
    { id: 3, label: 'Add Details', icon: Type, onClick: onAddText },
    { id: 4, label: 'Preview', icon: Eye, onClick: onPreview },
    { id: 5, label: 'Export PDF', icon: Download, onClick: onDownload }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isDisabled = currentStep < step.id;

            return (
              <button
                key={step.id}
                onClick={step.onClick}
                disabled={isDisabled}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 scale-105' 
                    : isCompleted
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{step.label}</span>
              </button>
            );
          })}
          
          {showManualCropButton && (
            <button
              onClick={onManualCrop}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium
                       bg-amber-600 text-white shadow-md hover:bg-amber-700 
                       transition-all duration-200 ease-in-out"
            >
              <Crop className="w-4 h-4" />
              <span className="text-sm">Manual Crop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;