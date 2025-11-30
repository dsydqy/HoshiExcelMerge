import React from 'react';
import { SheetData } from '../types';

interface FileEditorProps {
  data: SheetData;
  onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
}

export const FileEditor: React.FC<FileEditorProps> = ({ data, onCellChange }) => {
  if (!data || data.length === 0) return <div className="p-4 text-sm text-gray-500 italic">暂无数据。</div>;

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-h-64 overflow-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th scope="col" className="w-10 px-2 py-2 text-center text-xs font-medium text-gray-400 bg-gray-50 border-r border-b border-gray-200">
                #
              </th>
              {data[0].map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-b border-gray-200 last:border-r-0 min-w-[100px] whitespace-nowrap"
                >
                  {header?.toString() || `列 ${idx + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                 <td className="w-10 px-2 py-1 text-center text-xs text-gray-400 border-r border-gray-100 bg-gray-50 select-none">
                    {rowIndex + 1}
                 </td>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={`${rowIndex}-${cellIndex}`} 
                    className="p-0 border-r border-gray-100 last:border-r-0 h-8"
                  >
                    <input
                      type="text"
                      defaultValue={cell?.toString() ?? ''}
                      onBlur={(e) => onCellChange(rowIndex + 1, cellIndex, e.target.value)}
                      className="w-full h-full px-3 py-1 text-sm text-gray-900 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none bg-transparent"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length <= 1 && (
           <div className="p-6 text-center text-gray-500 text-sm">该工作表中未找到数据行。</div>
        )}
      </div>
    </div>
  );
};