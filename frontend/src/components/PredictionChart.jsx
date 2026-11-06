import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function PredictionChart({ predictions = [] }) {
  if (!predictions || predictions.length === 0) return null;

  const data = predictions.map((p, idx) => ({
    name: p.common_name || p.species_id,
    confidence: Number((p.confidence * 100).toFixed(1)),
    isTop: idx === 0,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-slate-800 text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-200">
          <p className="font-bold text-slate-900">{payload[0].payload.name}</p>
          <p className="text-emerald-600 font-bold">{payload[0].value}% probability</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tickFormatter={(val) => `${val}%`}
            stroke="#94a3b8"
            fontSize={11}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#475569" 
            fontSize={12}
            width={120}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="confidence" 
            radius={[0, 8, 8, 0]}
            barSize={20}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? '#059669' : index === 1 ? '#10b981' : '#6ee7b7'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
