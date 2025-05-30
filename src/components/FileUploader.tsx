import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  onFileRemoved?: () => void;
  isProcessing: boolean;
  fileName: string;
  className?: string;
}

const FileUploader = ({
  onFileSelected,
  onFileRemoved,
  isProcessing,
  fileName,
  className,
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !isProcessing) {
        const file = acceptedFiles[0];
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          onFileSelected(file);
        } else {
          alert('Por favor, selecione um arquivo CSV válido.');
        }
      }
    },
    [onFileSelected, isProcessing]
  );

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFileRemoved && !isProcessing) {
      onFileRemoved();
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    disabled: isProcessing,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative',
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-gray-300 hover:border-primary/70 hover:bg-gray-50',
        isProcessing && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <input {...getInputProps()} />
      
      {/* Botão de remoção quando há arquivo selecionado */}
      {fileName && onFileRemoved && !isProcessing && (
        <button
          onClick={handleRemoveFile}
          className="absolute top-3 right-3 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors z-10 shadow-md hover:shadow-lg"
          title="Remover arquivo"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {fileName ? (
          <>
            <File className="h-12 w-12 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-gray-500">
                Clique ou arraste para trocar o arquivo
              </p>
              {onFileRemoved && !isProcessing && (
                <p className="text-xs text-red-600 font-medium">
                  Clique no botão ✕ para remover
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive
                  ? 'Solte o arquivo aqui'
                  : 'Clique ou arraste um arquivo CSV'}
              </p>
              <p className="text-xs text-gray-500">
                Suporta apenas arquivos CSV até 5MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;