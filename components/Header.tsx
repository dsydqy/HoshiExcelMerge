import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 text-white">
              <FileSpreadsheet size={24} />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Excel 表格合并工具</h1>
              <p className="text-xs text-gray-500">多表求和与汇总</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
               v1.0.0
             </span>
          </div>
        </div>
      </div>
    </header>
  );
};