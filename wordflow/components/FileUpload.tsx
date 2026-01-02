
import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Word, WordChunk } from '../types';

interface FileUploadProps {
  onUpload: (newChunks: WordChunk[]) => void;
  onCancel: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 스마트 파싱 로직
  const parseLine = (line: string): { term: string; definition: string; example?: string } | null => {
    let cleanLine = line.trim();
    if (!cleanLine) return null;

    // [FIX] 리스트 번호 자동 제거 (예: "1. apple", "1) apple", "01 apple")
    // 숫자로 시작하고, 점(.)이나 괄호())가 있거나, 공백이 이어지는 패턴 제거
    cleanLine = cleanLine.replace(/^[\d]+[\.\)\s]+\s*/, ''); 

    // 1. 탭(Tab)으로 구분된 경우 (Excel 복사 붙여넣기 시 흔함)
    if (cleanLine.includes('\t')) {
      const parts = cleanLine.split('\t');
      return { 
        term: parts[0].trim(), 
        definition: parts[1]?.trim() || '', 
        example: parts[2]?.trim() 
      };
    }

    // 2. CSV 형태 (따옴표 고려)
    // "word", "meaning, detail", "example" 같은 형태 처리
    if (cleanLine.includes(',') && (cleanLine.includes('"') || cleanLine.split(',').length >= 2)) {
        // 정규식: 콤마로 구분하되 따옴표 안의 콤마는 무시
        const csvRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        const parts = cleanLine.split(csvRegex).map(p => p.trim().replace(/^"|"$/g, '')); // 따옴표 제거
        
        // 영어 단어인지 확인 (첫 부분)
        if (parts.length >= 2) {
             return {
                term: parts[0],
                definition: parts[1],
                example: parts[2]
             };
        }
    }

    // 3. 콜론(:) 구분
    if (cleanLine.includes(':')) {
        const [term, ...defs] = cleanLine.split(':');
        return { term: term.trim(), definition: defs.join(':').trim() };
    }

    // 4. 공백 구분 - 지능형 (영어와 한글의 경계를 찾음)
    // 예: "apple 사과" -> "apple" / "사과"
    // 예: "look for ~을 찾다" -> "look for" / "~을 찾다"
    // 정규식 설명: (영어/특수문자/공백) + (한글/기타문자시작) 경계 탐색
    const smartRegex = /^([a-zA-Z\s\-\(\)]+)\s+([^a-zA-Z].*)$/;
    const match = cleanLine.match(smartRegex);
    if (match) {
        return { term: match[1].trim(), definition: match[2].trim() };
    }

    // 5. 최후의 수단: 첫 번째 공백으로 분리
    const firstSpace = cleanLine.indexOf(' ');
    if (firstSpace > 0) {
        return {
            term: cleanLine.substring(0, firstSpace).trim(),
            definition: cleanLine.substring(firstSpace).trim()
        };
    }

    return null;
  };

  const processFile = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      const words: Word[] = [];

      lines.forEach((line, index) => {
        const parsed = parseLine(line);
        if (parsed && parsed.term && parsed.definition) {
          // 단어 길이가 너무 짧은(1글자 미만) 경우 등 노이즈 필터링 가능
          if (parsed.term.length > 0) {
            words.push({
              id: `w-${Date.now()}-${index}`,
              term: parsed.term,
              definition: parsed.definition,
              example: parsed.example,
              learned: false,
              correctCount: 0,
              incorrectCount: 0,
            });
          }
        }
      });

      if (words.length === 0) {
        setError("유효한 단어를 찾지 못했습니다. (형식: 영단어 [탭/콤마/공백] 뜻)");
        return;
      }

      // Chunking Logic (Grouping by 10) - Cognitive Load Theory
      const chunkSize = 10;
      const chunks: WordChunk[] = [];
      for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push({
          id: Date.now() + i,
          words: words.slice(i, i + chunkSize),
          isCompleted: false,
        });
      }

      onUpload(chunks);

    } catch (err) {
      console.error(err);
      setError("파일을 읽는 중 오류가 발생했습니다.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-500" />
            단어장 업로드
        </h2>
        <p className="text-slate-500 mb-8">
            엑셀에서 복사한 텍스트나 CSV 파일을 올려주세요. 자동으로 분석합니다.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden
            ${isDragging 
                ? 'border-brand-500 bg-brand-50 scale-[1.02]' 
                : 'border-slate-200 bg-slate-50 hover:border-brand-300 hover:bg-white'
            }
          `}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".csv,.txt"
            onChange={handleFileInput}
          />
          <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center relative z-10">
            <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-white' : 'bg-brand-100'}`}>
                 <Upload className={`w-8 h-8 ${isDragging ? 'text-brand-600' : 'text-brand-500'}`} />
            </div>
            <span className="text-lg font-bold text-slate-700">파일을 여기로 드래그</span>
            <span className="text-sm text-slate-400 mt-2">또는 클릭하여 선택 (.txt, .csv)</span>
          </label>
        </div>

        {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 animate-pulse border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
            <button 
                onClick={onCancel}
                className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
                취소
            </button>
        </div>
      </div>
      
      <div className="mt-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            지원하는 형식 (자동 인식)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
             <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                <strong className="block text-blue-600 mb-1">탭/공백/번호 자동 처리</strong>
                1. apple 사과
             </div>
             <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                <strong className="block text-blue-600 mb-1">공백 구분</strong>
                apple 사과
             </div>
             <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                <strong className="block text-blue-600 mb-1">CSV (콤마)</strong>
                word, meaning
             </div>
             <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                <strong className="block text-blue-600 mb-1">구 & 숙어</strong>
                look for ~을 찾다
             </div>
          </div>
      </div>
    </div>
  );
};

export default FileUpload;
