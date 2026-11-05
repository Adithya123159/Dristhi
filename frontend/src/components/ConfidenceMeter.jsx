import React from 'react';
import { formatConfidence } from '../utils/statusBadges';

export default function ConfidenceMeter({ confidence }) {
  const { pct, tier, color, bgColor } = formatConfidence(confidence);
  const percentage = Math.min(100, Math.max(0, confidence * 100));

  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Confidence Score
        </span>
        <span className={`text-lg font-bold ${color}`}>
          {pct}
        </span>
      </div>

      {/* Progress Bar with rounded ends */}
      <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-0.5">
        <span className={`font-semibold ${color}`}>{tier}</span>
        <span>MobileNetV2 Softmax</span>
      </div>
    </div>
  );
}
