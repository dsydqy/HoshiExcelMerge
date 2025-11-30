import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { ResultsPanel } from './components/ResultsPanel';
import { FileItem, SheetData } from './types';
import { readExcelFile, mergeSheets } from './services/excelService';
import { analyzeData } from './services/geminiService';
import { ArrowRight, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [mergedData, setMergedData] = useState<SheetData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFilesSelected = async (newFiles: File[]) => {
    // 1. Initialize file items
    const newFileItems: FileItem[] = newFiles.map(f => ({
      id: uuidv4(),
      file: f,
      status: 'processing'
    }));

    setFiles(prev => [...prev, ...newFileItems]);
    setMergedData(null); // Reset merge when new files are added
    setAnalysis(null);
    setError(null);

    // 2. Process/Read files immediately
    const processedItems: FileItem[] = [...newFileItems];
    
    // We create a new array to update state once all (or one by one) are done.
    for (let i = 0; i < processedItems.length; i++) {
        const item = processedItems[i];
        try {
            const data = await readExcelFile(item.file);
            setFiles(prev => prev.map(f => 
                f.id === item.id ? { ...f, status: 'done', parsedData: data } : f
            ));
        } catch (err) {
            console.error(`Error reading file ${item.file.name}`, err);
            setFiles(prev => prev.map(f => 
                f.id === item.id ? { ...f, status: 'error' } : f
            ));
        }
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    // If we remove a file, we should probably invalidate the current merge
    setMergedData(null);
    setAnalysis(null);
  };

  const handleMerge = async () => {
    const validFiles = files.filter(f => f.status === 'done' && f.parsedData);
    
    if (validFiles.length < 2) {
      setError("请至少选择 2 个成功解析的文件进行合并。");
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      // Use stored parsedData directly
      const sheetsData = validFiles.map(f => f.parsedData!);
      const result = mergeSheets(sheetsData);
      setMergedData(result);
    } catch (err) {
      console.error(err);
      setError("文件处理出错。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!mergedData) return;
    setIsAnalyzing(true);
    const result = await analyzeData(mergedData);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  // Handle cell edits from FileEditor (Inline)
  const handleCellChange = (fileId: string, row: number, col: number, value: string) => {
    let newFiles: FileItem[] = [];
    
    setFiles(prev => {
        newFiles = prev.map(f => {
            if (f.id === fileId && f.parsedData) {
                // Deepish copy needed for the specific row
                const newData = [...f.parsedData];
                if (newData[row]) {
                    newData[row] = [...newData[row]];
                    // Try to parse as number if possible to maintain numeric summation
                    const numValue = parseFloat(value);
                    newData[row][col] = isNaN(numValue) ? value : numValue;
                }
                return { ...f, parsedData: newData };
            }
            return f;
        });
        return newFiles;
    });

    // Reactive Merge: If we already have a merge result, update it immediately
    if (mergedData) {
        const validFiles = newFiles.filter(f => f.status === 'done' && f.parsedData);
        if (validFiles.length >= 2) {
            const newResult = mergeSheets(validFiles.map(f => f.parsedData!));
            setMergedData(newResult);
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            快速合并 Excel 表格
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            合并结构相同的多个文件。<br/>
            <span className="text-blue-600 font-medium">在合并前可直接预览并编辑数据。</span>
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
           <FileUploader onFilesSelected={handleFilesSelected} />
           
           <FileList 
                files={files} 
                onRemove={removeFile} 
                onCellChange={handleCellChange}
           />

           {error && (
             <div className="mt-4 p-4 bg-red-50 rounded-md">
               <div className="flex">
                 <div className="flex-shrink-0">
                   <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                   </svg>
                 </div>
                 <div className="ml-3">
                   <h3 className="text-sm font-medium text-red-800">{error}</h3>
                 </div>
               </div>
             </div>
           )}

           <div className="mt-8 flex justify-end">
             <button
               onClick={handleMerge}
               disabled={files.filter(f => f.status === 'done').length < 2 || isProcessing}
               className={`
                 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white 
                 ${files.filter(f => f.status === 'done').length < 2 || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                 transition-all duration-200
               `}
             >
               {isProcessing ? (
                 <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    处理中...
                 </>
               ) : (
                 <>
                   开始合并
                   <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
                 </>
               )}
             </button>
           </div>
        </div>

        {/* Results Section */}
        {mergedData && (
            <ResultsPanel 
                data={mergedData} 
                analysis={analysis} 
                isAnalyzing={isAnalyzing}
                onAnalyze={handleAnalyze} 
            />
        )}

      </main>
    </div>
  );
};

export default App;