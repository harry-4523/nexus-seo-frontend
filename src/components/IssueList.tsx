import { useState } from 'react';
import { AlertCircle, XCircle, Info, ChevronDown, Wrench } from 'lucide-react';
import { Issue } from '../types/analysis.types';
import { getIssueInsight } from '../lib/insights';

const STYLES: Record<string, { icon: JSX.Element; text: string; bg: string }> = {
  ERROR: { icon: <XCircle size={15} />, text: 'text-nova', bg: 'bg-nova/5 border-nova/20' },
  WARNING: { icon: <AlertCircle size={15} />, text: 'text-solar', bg: 'bg-solar/5 border-solar/20' },
  INFO: { icon: <Info size={15} />, text: 'text-cyan', bg: 'bg-cyan/5 border-cyan/20' },
};

function IssueRow({ issue }: { issue: Issue }) {
  const [open, setOpen] = useState(false);
  const style = STYLES[issue.type] || STYLES.INFO;
  const insight = getIssueInsight(issue.message);
  return (
    <div className={`rounded-lg border ${style.bg} overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-2.5 p-3 text-left"
      >
        <span className={`${style.text} mt-0.5 shrink-0`}>{style.icon}</span>
        <span className="text-sm text-ink flex-1">{issue.message}</span>
        <ChevronDown size={14} className={`text-ink-faint mt-0.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pl-9 space-y-2 text-xs">
          <p className="text-ink-soft leading-relaxed"><span className="font-semibold text-ink">Why this happens: </span>{insight.cause}</p>
          <p className="text-ink-soft leading-relaxed flex gap-1.5">
            <Wrench size={12} className="text-emerald mt-0.5 shrink-0" />
            <span><span className="font-semibold text-ink">How to fix it: </span>{insight.fix}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default function IssueList({ issues }: { issues: Issue[] }) {
  if (!issues.length) return null;
  return (
    <div className="space-y-2">
      {issues.map((issue, i) => <IssueRow key={i} issue={issue} />)}
    </div>
  );
}
