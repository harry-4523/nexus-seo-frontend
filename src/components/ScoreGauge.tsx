import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: '#1F8A5F', text: '#1F8A5F' };
  if (score >= 60) return { stroke: '#3B5BA5', text: '#3B5BA5' };
  if (score >= 40) return { stroke: '#C97A2B', text: '#C97A2B' };
  return { stroke: '#C13B3B', text: '#C13B3B' };
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export default function ScoreGauge({
  score, label, size = 140, strokeWidth = 8, delay = 0,
}: ScoreGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const colors = getScoreColor(score);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (!circleRef.current || !textRef.current) return;
    gsap.fromTo(circleRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: offset, duration: 1.4, ease: 'power3.out', delay }
    );
    gsap.fromTo({ val: 0 }, { val: score },
      {
        duration: 1.3, delay, ease: 'power3.out',
        onUpdate: function() { if (textRef.current) textRef.current.textContent = Math.round(this.targets()[0].val).toString(); },
      }
    );
  }, [score, offset, circumference, delay]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="rgba(20,22,26,0.08)" strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            ref={circleRef}
            cx={size / 2} cy={size / 2} r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div ref={textRef} className="text-3xl font-bold font-display" style={{ color: colors.text }}>0</div>
          <div className="text-xs font-medium text-ink-soft mt-0.5">/ 100</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-white">{label}</div>
        <div className="text-xs font-medium mt-0.5" style={{ color: colors.text }}>{getScoreLabel(score)}</div>
      </div>
    </div>
  );
}

// Large central overall score
export function OverallScoreRing({ score }: { score: number }) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const size = 200, sw = 12, radius = (size - sw * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);

  useEffect(() => {
    if (!circleRef.current || !textRef.current) return;
    gsap.fromTo(circleRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: offset, duration: 1.8, ease: 'power3.out', delay: 0.3 }
    );
    gsap.fromTo({ val: 0 }, { val: score }, {
      duration: 1.6, delay: 0.3, ease: 'power3.out',
      onUpdate: function() { if (textRef.current) textRef.current.textContent = Math.round(this.targets()[0].val).toString(); },
    });
  }, [score, offset, circumference]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(20,22,26,0.06)" strokeWidth={sw} fill="transparent" />
          <circle cx={size/2} cy={size/2} r={radius-sw/2} stroke="rgba(20,22,26,0.03)" strokeWidth={1} fill="transparent" />
          <circle ref={circleRef} cx={size/2} cy={size/2} r={radius}
            stroke={colors.stroke} strokeWidth={sw} fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs font-bold text-ink-soft uppercase tracking-widest mb-1">Overall</div>
          <div ref={textRef} className="text-6xl font-bold font-display" style={{ color: colors.text }}>0</div>
          <div className="text-sm font-medium text-ink-soft mt-1">/ 100</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-white">{getScoreLabel(score)} Score</div>
        <div className="text-sm text-ink-soft mt-1">
          {score >= 80 ? 'This website is well-optimized' :
           score >= 60 ? 'Good — several improvements possible' :
           score >= 40 ? 'Needs significant improvements' :
           'Critical issues require immediate attention'}
        </div>
      </div>
    </div>
  );
}
