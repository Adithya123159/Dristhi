export function getStatusBadge(status) {
  if (!status) {
    return {
      label: 'Least Concern (LC)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500'
    };
  }

  const s = status.toLowerCase();
  if (s.includes('critically') || s.includes('(cr)')) {
    return {
      label: status,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-600'
    };
  }
  if (s.includes('endangered') || s.includes('(en)')) {
    return {
      label: status,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-600'
    };
  }
  if (s.includes('vulnerable') || s.includes('(vu)')) {
    return {
      label: status,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500'
    };
  }
  if (s.includes('near threatened') || s.includes('(nt)')) {
    return {
      label: status,
      color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      dot: 'bg-yellow-500'
    };
  }
  return {
    label: status,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  };
}

export function formatConfidence(score) {
  const pct = (score * 100).toFixed(1);
  let tier = 'High Confidence';
  let color = 'text-emerald-600';
  let bgColor = 'bg-emerald-500';

  if (score < 0.5) {
    tier = 'Low Confidence';
    color = 'text-rose-600';
    bgColor = 'bg-rose-500';
  } else if (score < 0.75) {
    tier = 'Moderate Confidence';
    color = 'text-amber-600';
    bgColor = 'bg-amber-500';
  }

  return { pct: `${pct}%`, rawPct: pct, tier, color, bgColor };
}
