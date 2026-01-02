import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { AnalysisResult } from '../types';
import { Lightbulb, Trophy, ArrowRight, TrendingUp, Home } from 'lucide-react';
import { Button } from './ui/Button.tsx';
import { audioService } from '../services/audioService';

interface AnalysisViewProps {
  result: AnalysisResult;
  onHome: () => void;
  onRetry: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onHome, onRetry }) => {
  const chartData = [
    { subject: '유창성', A: result.scores.divergence, fullMark: 100 },
    { subject: '독창성', A: result.scores.originality, fullMark: 100 },
    { subject: '유연성', A: result.scores.flexibility, fullMark: 100 },
    { subject: '논리성', A: result.scores.logic, fullMark: 100 },
    { subject: '재미', A: result.scores.humor, fullMark: 100 },
  ];

  const handleHome = () => {
    audioService.playClick();
    onHome();
  }

  const handleRetry = () => {
    audioService.playClick();
    onRetry();
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in pb-20">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 relative z-10 break-keep">분석이 완료되었습니다!</h2>
          <div className="flex justify-center items-center gap-2 relative z-10 mt-4">
             <Trophy className="w-6 h-6 text-yellow-300" />
             <span className="text-xl font-medium">창의력 점수: <span className="text-3xl font-bold">{result.totalScore}</span>/100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          
          {/* Chart Section */}
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50 rounded-2xl p-4">
            <h3 className="text-slate-500 font-semibold mb-4 text-sm uppercase tracking-wider">나의 창의성 모양</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="My Answer"
                    dataKey="A"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="flex flex-col gap-6">
            <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                AI 멘토의 피드백
              </h3>
              <p className="text-slate-700 leading-relaxed bg-blue-50/50 p-5 rounded-2xl border border-blue-100 break-keep">
                "{result.feedback}"
              </p>
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                더 발전하려면?
              </h3>
              <p className="text-slate-700 leading-relaxed bg-teal-50/50 p-5 rounded-2xl border border-teal-100 text-teal-900 break-keep">
                {result.improvementTip}
              </p>
            </div>

            <div className="mt-auto flex gap-4 pt-4">
              <Button onClick={handleHome} variant="outline" className="flex-1 gap-2 h-12">
                <Home className="w-4 h-4"/> 홈으로
              </Button>
              <Button onClick={handleRetry} className="flex-1 gap-2 h-12">
                다른 문제 풀기 <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};