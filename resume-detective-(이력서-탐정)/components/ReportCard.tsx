import React from 'react';
import { Candidate, ScanResult } from '../types';
import { RefreshCcw, ShieldAlert, BadgeCheck, XCircle, AlertTriangle } from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  candidate: Candidate;
  result: ScanResult;
  selectedIds: number[];
  onRestart: () => void;
}

export const ReportCard: React.FC<Props> = ({ candidate, result, selectedIds, onRestart }) => {
  return (
    <div className="max-w-3xl w-full mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-fade-in">
      <div className="p-6 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <ShieldAlert className="w-6 h-6 mr-2 text-yellow-400" />
          검증 리포트
        </h2>
        <div className="text-right">
          <p className="text-xs text-slate-400">후광 효과 민감도</p>
          <p className={`text-2xl font-black ${result.haloScore > 50 ? 'text-red-400' : 'text-green-400'}`}>
            {result.haloScore}점
          </p>
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-[60vh]">
        <div className="mb-6">
          <p className="text-slate-300 text-sm mb-4">
            {result.haloScore > 50 
              ? '당신은 화려한 학벌과 경력(후광)에 현혹되어 중요한 단서들을 놓쳤습니다. 겉모습보다 구체적인 근거를 확인하는 습관이 필요합니다.' 
              : '훌륭합니다! 겉으로 보이는 화려함에 속지 않고 냉철하게 사실 관계를 파악했습니다.'}
          </p>
        </div>

        <div className="space-y-4">
          {candidate.sentences && candidate.sentences.map((sentence) => {
            const isSelected = selectedIds.includes(sentence.id);
            const isSuspicious = sentence.type === 'exaggeration' || sentence.type === 'vague' || sentence.type === 'halo';
            
            // Logic for visual feedback
            let statusColor = 'border-slate-600';
            let statusIcon = null;
            let statusText = '';

            if (isSuspicious && isSelected) {
              // Caught correctly
              statusColor = 'border-green-500 bg-green-900/20';
              statusIcon = <BadgeCheck className="w-5 h-5 text-green-400" />;
              statusText = '정답! 과장/후광 탐지 성공';
            } else if (isSuspicious && !isSelected) {
              // Missed
              statusColor = 'border-red-500 bg-red-900/20';
              statusIcon = <XCircle className="w-5 h-5 text-red-400" />;
              statusText = '놓침! 의심했어야 함';
            } else if (!isSuspicious && isSelected) {
              // False Alarm
              statusColor = 'border-yellow-500 bg-yellow-900/20';
              statusIcon = <AlertTriangle className="w-5 h-5 text-yellow-400" />;
              statusText = '오해! 정상적인 문장임';
            } else {
              // Normal and ignored (Correct)
              statusColor = 'border-slate-700 opacity-50';
            }

            if (statusColor.includes('opacity-50')) return null; // Only show significant results to reduce noise

            return (
              <div key={sentence.id} className={`p-4 rounded-lg border ${statusColor}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {statusIcon}
                    <span className="text-sm font-bold text-slate-200">{statusText}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 uppercase">
                    {sentence.type === 'halo' ? '후광효과' : sentence.type === 'exaggeration' ? '과장됨' : '모호함'}
                  </span>
                </div>
                <p className="text-slate-300 mb-2 italic">"{sentence.text}"</p>
                <p className="text-sm text-slate-400 bg-slate-900/50 p-2 rounded">
                  💡 <span className="text-slate-200">{sentence.reason}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-center">
        <button
          onClick={() => {
            audioService.playClickSound();
            onRestart();
          }}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          <RefreshCcw className="w-5 h-5" />
          <span>다른 지원자 분석하기</span>
        </button>
      </div>
    </div>
  );
};