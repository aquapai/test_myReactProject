import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { HaloScore } from '../types';

interface HaloChartProps {
  score: HaloScore;
}

const HaloChart: React.FC<HaloChartProps> = ({ score }) => {
  const data = [
    { subject: 'Authority', label: '권위 (Authority)', A: score.authority, fullMark: 100 },
    { subject: 'Numbers', label: '수치 (Numbers)', A: score.numbers, fullMark: 100 },
    { subject: 'Visual', label: '임팩트 (Impact)', A: score.visualImpact, fullMark: 100 },
  ];

  return (
    <div className="h-72 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          {/* Grid Lines */}
          <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
          
          {/* Axis Labels */}
          <PolarAngleAxis 
            dataKey="label" 
            tick={{ fill: '#475569', fontSize: 13, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }} 
          />
          
          {/* Axis Scale */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          {/* The Radar Shape */}
          <Radar
            name="후광 지수"
            dataKey="A"
            stroke="#818CF8" 
            strokeWidth={3}
            fill="url(#pastelGradient)"
            fillOpacity={0.7}
            animationDuration={1500}
            animationEasing="ease-out"
          />

          {/* Gradient Definition for Fill */}
          <defs>
            <radialGradient id="pastelGradient" cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#A5D8FF" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4"/>
            </radialGradient>
          </defs>

          {/* Custom Tooltip */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderColor: '#E2E8F0', 
              color: '#334155',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(148, 163, 184, 0.15)',
              padding: '12px 16px'
            }}
            itemStyle={{ color: '#6366F1', fontWeight: 'bold' }}
            formatter={(value: number) => [`${value}점`, '점수']}
            labelStyle={{ color: '#64748B', marginBottom: '4px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HaloChart;