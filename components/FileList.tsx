import React from 'react';
import { FileItem } from '../types';
import { FileSpreadsheet, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { FileEditor } from './FileEditor';

interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onCellChange: (fileId: string, rowIndex: number, colIndex: number, value: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove, onCellChange }) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        已选文件 ({files.length})
      </h3>
      <ul className="space-y-4">
        {files.map((file) => (
          <li key={file.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            {/* File Header / Info Row */}
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex-1 truncate flex items-center space-x-3">
                  <div className={`flex-shrink-0 p-2 rounded-md ${file.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                     <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 truncate" title={file.file.name}>{file.file.name}</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-xs text-gray-500">{(file.file.size / 1024).toFixed(1)} KB</span>
                        
                        {/* Status Indicator */}
                        {file.status === 'done' ? (
                            <span className="flex items-center text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                                <CheckCircle size={10} className="mr-1"/> 准备就绪
                            </span>
                        ) : file.status === 'error' ? (
                            <span className="flex items-center text-xs text-red-600 font-medium bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100">
                                <AlertCircle size={10} className="mr-1"/> 错误
                            </span>
                        ) : (
                            <span className="flex items-center text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200">
                                <Clock size={10} className="mr-1"/> 处理中...
                            </span>
                        )}
                    </div>
                  </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                    onClick={() => onRemove(file.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full focus:outline-none transition-colors"
                    title="移除文件"
                >
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            {/* Inline Editor Area */}
            {file.status === 'done' && file.parsedData && (
                <div className="w-full">
                     <FileEditor 
                        data={file.parsedData} 
                        onCellChange={(r, c, v) => onCellChange(file.id, r, c, v)} 
                     />
                </div>
            )}
            
            {/* Error Message */}
            {file.status === 'error' && (
                <div className="p-4 bg-red-50 text-sm text-red-700 border-t border-red-100">
                    解析文件失败，请检查是否为有效的 Excel 格式。
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};