import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { ATSScore } from '../../types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ATSAnalysisProps {
  score: ATSScore;
  loading: boolean;
}

export const ATSAnalysis: React.FC<ATSAnalysisProps> = ({ score, loading }) => {
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Analyzing resume...</div>;
  }

  const data = [
    { name: 'Formatting', value: score.breakdown.formatting, fill: '#8884d8' },
    { name: 'Keywords', value: score.breakdown.keywords, fill: '#83a6ed' },
    { name: 'Structure', value: score.breakdown.structure, fill: '#8dd1e1' },
    { name: 'Readability', value: score.breakdown.readability, fill: '#82ca9d' },
    { name: 'Overall', value: score.overall, fill: '#a4de6c' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">ATS Analysis</h3>
      
      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="40%" 
            outerRadius="100%" 
            barSize={15} 
            data={data} 
            startAngle={180} 
            endAngle={0}
          >
            <RadialBar
              label={false}
              background
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
            <Legend 
                iconSize={10} 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#374151', fontSize: '12px', fontWeight: 500 }}
                formatter={(value: number) => [`${value}/100`, 'Score']}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Central Score Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
            <span className={`text-3xl font-bold ${score.overall > 80 ? 'text-green-600' : 'text-amber-500'}`}>
                {score.overall}
            </span>
            <span className="block text-xs text-gray-500 font-medium uppercase tracking-wide">Score</span>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <h4 className="font-medium text-sm text-gray-700 mb-3 sticky top-0 bg-white pb-2 border-b">Optimization Suggestions</h4>
        <ul className="space-y-3">
          {score.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600 bg-amber-50 p-2 rounded-md border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{suggestion}</span>
            </li>
          ))}
          <li className="flex items-start text-sm text-gray-600 bg-green-50 p-2 rounded-md border border-green-100">
             <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
             <span className="leading-snug">Section headers are standard and readable.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};