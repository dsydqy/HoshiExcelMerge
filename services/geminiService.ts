import { GoogleGenAI, Type } from "@google/genai";
import { SheetData } from "../types";

// Initialize Gemini
// NOTE: In a real production app, ensure API_KEY is securely handled.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeData = async (data: SheetData): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key 缺失。请配置您的环境变量。";
  }

  // Optimize data for token limit: take headers and first 50 rows or summary
  // We'll flatten the first few rows to text for the prompt
  const headers = data[0] || [];
  const sampleRows = data.slice(1, 51).map(row => row.join(", ")).join("\n");
  
  const prompt = `
    我已经合并了多个Excel文件，合并逻辑是对相应单元格的数值进行求和。
    这是表头行: ${headers.join(", ")}
    这是合并结果的前 50 行数据:
    ${sampleRows}

    请对这份数据提供一份简明的执行摘要（中文回答）。
    1. 识别包含指标（数字）的列。
    2. 指出样本中任何显著的高值或有趣的模式。
    3. 根据表头推测这份数据可能代表什么内容。
    
    请保持专业、简洁。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "你是一位专家级数据分析师，正在协助用户分析刚合并的财务或运营报表。请用中文回答。",
        temperature: 0.3, // Low temperature for more analytical/factual response
      }
    });

    return response.text || "无法生成分析结果。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "分析数据失败。请检查您的 API Key 或网络连接。";
  }
};