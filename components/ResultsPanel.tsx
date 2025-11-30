import React from 'react';
import { SheetData } from '../types';
import { Download, Sparkles, AlertCircle } from 'lucide-react';
import { exportToExcel } from '../services/excelService';

interface ResultsPanelProps {
  data: SheetData;
  analysis: string | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ data, analysis, isAnalyzing, onAnalyze }) => {
  if (!data || data.length === 0) return null;

  // Preview only first 10 rows and 8 columns
  const previewRows = data.slice(0, 10);
  
  return (
    <div className="mt-8 space-y-6">
        {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h3 className="text-lg font-medium text-gray-900">合并完成！</h3>
            <p className="text-sm text-gray-500">成功合并了 {data.length} 行数据。</p>
        </div>
        <div className="flex gap-3">
             <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
             >
                {isAnalyzing ? (
                   <>分析中...</>
                ) : (
                   <><Sparkles size={16} className="mr-2" /> AI 智能分析</>
                )}
             </button>
             <button
                onClick={() => exportToExcel(data)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
             >
                <Download size={16} className="mr-2" /> 导出 Excel
             </button>
        </div>
      </div>

      {/* Analysis Section */}
      {analysis && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 animate-fade-in">
              <div className="flex items-start">
                  <div className="flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-full">
                      <h3 className="text-sm font-medium text-purple-800">AI 智能分析报告 (Gemini 2.5 Flash)</h3>
                      <div className="mt-2 text-sm text-purple-700 whitespace-pre-line prose prose-purple">
                          {analysis}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Data Preview Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">数据预览</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">仅显示前 10 行。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {previewRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex === 0 ? "bg-gray-50 font-semibold" : ""}>
                  {row.slice(0, 8).map((cell, cellIndex) => (
                    <td 
                        key={cellIndex} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-100 last:border-r-0"
                    >
                      {cell !== null && cell !== undefined ? cell.toString() : ''}
                    </td>
                  ))}
                  {row.length > 8 && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic">...</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm text-gray-500 flex items-center">
                <AlertCircle size={16} className="mr-2" />
                <span>注意：空白单元格在求和时视为 0。文本标签将保留第一个文件的内容。</span>
            </div>
        </div>
      </div>
    </div>
  );
};