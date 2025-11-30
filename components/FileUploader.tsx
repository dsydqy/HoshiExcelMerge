import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
    // Reset input so same files can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const xlsxFiles = Array.from(e.dataTransfer.files).filter((f: File) => 
        f.name.endsWith('.xlsx') || f.name.endsWith('.xls')
      );
      if (xlsxFiles.length > 0) {
        onFilesSelected(xlsxFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="mt-6 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group bg-white"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="space-y-2 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors">
          <UploadCloud size={48} />
        </div>
        <div className="text-sm text-gray-600">
          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 hover:text-blue-500">
            <span>点击上传文件</span>
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              className="sr-only" 
              multiple 
              accept=".xlsx, .xls"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>
          <span className="pl-1">或将文件拖拽到此处</span>
        </div>
        <p className="text-xs text-gray-500">
          支持 Excel 文件 (.xlsx, .xls) 最大 10MB
        </p>
      </div>
    </div>
  );
};