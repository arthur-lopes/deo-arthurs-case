import React from 'react';
import { cn } from '../utils/cn';

interface ProgressIndicatorProps {
  progress: number;
  status: string;
  className?: string;
}

const ProgressIndicator = ({
  progress,
  status,
  className,
}: ProgressIndicatorProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{status}</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Processing steps indicator */}
      <div className="flex justify-between mt-4">
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            progress >= 10 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
          )}>
            1
          </div>
          <span className="text-xs mt-1">Upload</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            progress >= 50 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
          )}>
            2
          </div>
          <span className="text-xs mt-1">Limpeza</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            progress >= 90 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
          )}>
            3
          </div>
          <span className="text-xs mt-1">Enriquecimento</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            progress === 100 ? "bg-success text-white" : "bg-gray-200 text-gray-500"
          )}>
            ✓
          </div>
          <span className="text-xs mt-1">Concluído</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;