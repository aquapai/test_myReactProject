import React, { useState } from 'react';
import { Candidate, Sentence } from '../types';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  candidate: Candidate;
  onComplete: (selectedIds: number[]) => void;
}

export const InvestigationBoard: React.FC<Props> = ({ candidate, onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSentence = (id: number) => {
    if (selectedIds.includes(id)) {
      audioService.playClickSound(); // Deselect sound
      setSelectedIds(prev => prev.filter(sid => sid !== id));
    } else {
      audioService.playAlertSound(); // Select sound (suspicious)
      setSelectedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-800 rounded-t-xl border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-500">
            <img src={candidate.photoUrl} alt="profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-white font-bold">{candidate.name}</h3>
            <p className="text-xs text-slate-400">{candidate.resumeTitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
          <Search className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-slate-300">
            의심되는 문장: <span className="text-yellow-400 font-bold">{selectedIds.length}</span>개
          </span>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 bg-white p-6 md:p-8 overflow-y-auto shadow-inner relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-slate-200 to-transparent"></div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b-2 border-slate-200">
          자기소개서
        </h1>

        <div className="space-y-4 text-lg leading-relaxed text-slate-700">
          {candidate.sentences && candidate.sentences.length > 0 ? (
            candidate.sentences.map((sentence) => (
              <span
                key={sentence.id}
                onClick={() => toggleSentence(sentence.id)}
                onMouseEnter={() => audioService.playHoverSound()}
                className={`
                  cursor-pointer inline transition-all duration-200 px-1 rounded decoration-2 underline-offset-4
                  ${selectedIds.includes(sentence.id) 
                    ? 'bg-red-100 text-red-900 decoration-red-500 underline font-semibold' 
                    : 'hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                {sentence.text}{' '}
              </span>
            ))
          ) : (
             <p className="text-red-500">이력서 데이터를 불러올 수 없습니다.</p>
          )}
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="p-4 bg-slate-800 rounded-b-xl border-t border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 max-w-[60%]">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            팁: 과장되거나 구체적인 근거가 없는 문장을 클릭하세요.
          </p>
          <button
            onClick={() => {
              audioService.playSuccessSound();
              onComplete(selectedIds);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-colors flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            검증 완료
          </button>
        </div>
      </div>
    </div>
  );
};