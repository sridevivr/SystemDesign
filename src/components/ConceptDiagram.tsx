// Small inline SVG diagrams that visualise the concept of a lesson, shown
// above the intro text on the lesson card. The lookup is local to this
// file: if a lessonId is not in the registry, the component renders null
// so callers can use it unconditionally.
//
// Design intent: "playful but adult" Excalidraw-ish line art. Uses Lucide
// icons for the recognisable nodes (clients, servers, databases) and inline
// SVG primitives for the connecting lines, arrows and labels. Each diagram
// uses the unit's accent colour for the "hot" stroke so the visuals match
// the rest of the unit theme. The wrapper sets `text-slate-700
// dark:text-slate-200` so anything painted with `currentColor` (or the
// `fill-current` class) inverts cleanly between light and dark mode.

import { Database, Server, Smartphone } from 'lucide-react';
import { curriculum } from '../content';
import { lessonAccent } from '../lib/unit-accents';

type Props = {
  lessonId: string;
  className?: string;
};

// Each renderer receives the resolved accent hex and returns a finished
// inline SVG. Muted strokes use slate-400 (#94a3b8) directly so they read
// the same in both themes.
type DiagramRenderer = (accent: string) => JSX.Element;

const MUTED = '#94a3b8';

// Reusable arrowhead marker. Caller supplies an id + colour so each diagram
// can declare its own variants in a single <defs> block.
function Arrowhead({ id, color }: { id: string; color: string }): JSX.Element {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  );
}

// foreignObject wrapper that drops a Lucide icon into an SVG. Centred via
// flex so the icon doesn't cling to a corner if its bounding box doesn't
// match the foreignObject exactly.
function IconSlot({
  x,
  y,
  size,
  color,
  children,
}: {
  x: number;
  y: number;
  size: number;
  color?: string;
  children: JSX.Element;
}): JSX.Element {
  return (
    <foreignObject x={x} y={y} width={size} height={size}>
      <div
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as any)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color,
        }}
      >
        {children}
      </div>
    </foreignObject>
  );
}

// ---------------------------------------------------------------------------
// 1. foundations.client-server
// ---------------------------------------------------------------------------
const ClientServerDiagram: DiagramRenderer = (accent) => (
  <svg
    viewBox="0 0 320 140"
    className="w-full h-auto"
    role="img"
    aria-label="A client box on the left exchanging requests and responses with a server box on the right"
  >
    <defs>
      <Arrowhead id="cs-hot" color={accent} />
      <Arrowhead id="cs-muted" color={MUTED} />
    </defs>

    {/* client */}
    <rect x="14" y="28" width="92" height="84" rx="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <IconSlot x={38} y={42} size={44}>
      <Smartphone size={36} strokeWidth={1.75} />
    </IconSlot>
    <text x="60" y="102" textAnchor="middle" className="fill-current text-[11px] font-medium">
      Client
    </text>

    {/* server */}
    <rect x="214" y="28" width="92" height="84" rx="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <IconSlot x={238} y={42} size={44}>
      <Server size={36} strokeWidth={1.75} />
    </IconSlot>
    <text x="260" y="102" textAnchor="middle" className="fill-current text-[11px] font-medium">
      Server
    </text>

    {/* request — solid hot arrow */}
    <line x1="112" y1="58" x2="208" y2="58" stroke={accent} strokeWidth="2" markerEnd="url(#cs-hot)" />
    <text x="160" y="50" textAnchor="middle" className="text-[10px] font-medium" fill={accent}>
      request
    </text>

    {/* response — dashed muted arrow */}
    <line
      x1="208"
      y1="84"
      x2="112"
      y2="84"
      stroke={MUTED}
      strokeWidth="2"
      strokeDasharray="4 3"
      markerEnd="url(#cs-muted)"
    />
    <text x="160" y="100" textAnchor="middle" className="text-[10px] font-medium" fill={MUTED}>
      response
    </text>
  </svg>
);

// ---------------------------------------------------------------------------
// 2. networking.ip-ports
// ---------------------------------------------------------------------------
const IpPortsDiagram: DiagramRenderer = (accent) => {
  const ports: Array<{ y: number; label: string }> = [
    { y: 56, label: ':80' },
    { y: 86, label: ':443' },
    { y: 116, label: ':5432' },
  ];
  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto"
      role="img"
      aria-label="A server building with three numbered ports as doors. An incoming arrow enters port 443."
    >
      <defs>
        <Arrowhead id="ports-arrow" color={accent} />
      </defs>

      {/* outer building */}
      <rect x="110" y="18" width="180" height="128" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* "server" label */}
      <IconSlot x={120} y={26} size={22}>
        <Server size={18} strokeWidth={1.75} />
      </IconSlot>
      <text x="146" y="42" className="fill-current text-[11px] font-medium">
        server
      </text>

      {/* doors / port slots */}
      {ports.map((port) => {
        const isHot = port.label === ':443';
        return (
          <g key={port.label}>
            <rect
              x="156"
              y={port.y}
              width="118"
              height="22"
              rx="4"
              fill="none"
              stroke={isHot ? accent : 'currentColor'}
              strokeWidth={isHot ? 2 : 1.25}
            />
            {/* small door handle */}
            <circle cx="266" cy={port.y + 11} r="1.5" fill={isHot ? accent : MUTED} />
            <text
              x="166"
              y={port.y + 15}
              className="text-[11px]"
              fill={isHot ? accent : 'currentColor'}
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {port.label}
            </text>
          </g>
        );
      })}

      {/* incoming request → :443 */}
      <line x1="20" y1="97" x2="152" y2="97" stroke={accent} strokeWidth="2" markerEnd="url(#ports-arrow)" />
      <text x="22" y="89" className="text-[10px] font-medium" fill={accent}>
        requests
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 3. scaling.vertical-horizontal
// ---------------------------------------------------------------------------
const VerticalHorizontalDiagram: DiagramRenderer = (accent) => (
  <svg
    viewBox="0 0 320 160"
    className="w-full h-auto"
    role="img"
    aria-label="One tall server on the left labelled vertical, four small servers on the right labelled horizontal"
  >
    {/* divider */}
    <line x1="160" y1="14" x2="160" y2="146" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />

    {/* LEFT: vertical — one tall server */}
    <rect x="56" y="22" width="56" height="92" rx="8" fill="none" stroke={accent} strokeWidth="2" />
    <IconSlot x={68} y={50} size={36} color={accent}>
      <Server size={28} strokeWidth={1.75} />
    </IconSlot>
    {/* up arrow hint */}
    <path
      d="M84 38 L84 28 M80 32 L84 28 L88 32"
      stroke={accent}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text x="84" y="132" textAnchor="middle" className="fill-current text-[10px] font-medium">
      vertical
    </text>
    <text x="84" y="144" textAnchor="middle" className="text-[9px]" fill={MUTED}>
      1 big box
    </text>

    {/* RIGHT: horizontal — four small servers */}
    {[0, 1, 2, 3].map((i) => {
      const x = 178 + i * 32;
      return (
        <g key={i}>
          <rect x={x} y="58" width="24" height="32" rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
          <IconSlot x={x + 2} y={62} size={20} color={accent}>
            <Server size={16} strokeWidth={1.75} />
          </IconSlot>
        </g>
      );
    })}
    {/* sideways arrow hint */}
    <path
      d="M180 44 L270 44 M266 40 L270 44 L266 48"
      stroke={accent}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text x="226" y="110" textAnchor="middle" className="fill-current text-[10px] font-medium">
      horizontal
    </text>
    <text x="226" y="122" textAnchor="middle" className="text-[9px]" fill={MUTED}>
      many small boxes
    </text>
  </svg>
);

// ---------------------------------------------------------------------------
// 4. databases.what-is-a-database
// ---------------------------------------------------------------------------
const WhatIsADatabaseDiagram: DiagramRenderer = (accent) => (
  <svg
    viewBox="0 0 320 140"
    className="w-full h-auto"
    role="img"
    aria-label="A client phone on the left, an arrow labelled writes / reads pointing right to a database cylinder"
  >
    <defs>
      <Arrowhead id="db-arrow" color={accent} />
    </defs>

    {/* client */}
    <IconSlot x={34} y={46} size={44}>
      <Smartphone size={36} strokeWidth={1.75} />
    </IconSlot>
    <text x="56" y="106" textAnchor="middle" className="fill-current text-[10px] font-medium">
      client
    </text>

    {/* arrow */}
    <line x1="92" y1="68" x2="220" y2="68" stroke={accent} strokeWidth="2" markerEnd="url(#db-arrow)" />
    <text x="156" y="60" textAnchor="middle" className="text-[10px] font-medium" fill={accent}>
      writes / reads
    </text>

    {/* database — Lucide Database icon, tinted with the accent */}
    <IconSlot x={232} y={36} size={64} color={accent}>
      <Database size={56} strokeWidth={1.75} />
    </IconSlot>
    <text x="264" y="116" textAnchor="middle" className="fill-current text-[10px] font-medium">
      database
    </text>
  </svg>
);

// ---------------------------------------------------------------------------
// 5. caching.why-cache
// ---------------------------------------------------------------------------
const WhyCacheDiagram: DiagramRenderer = (accent) => (
  <svg
    viewBox="0 0 320 150"
    className="w-full h-auto"
    role="img"
    aria-label="A client on the left, a small hot cache in the middle, and a large muted origin on the right"
  >
    <defs>
      <Arrowhead id="cache-hot" color={accent} />
      <Arrowhead id="cache-muted" color={MUTED} />
    </defs>

    {/* client */}
    <IconSlot x={14} y={52} size={40}>
      <Smartphone size={32} strokeWidth={1.75} />
    </IconSlot>
    <text x="34" y="106" textAnchor="middle" className="fill-current text-[10px] font-medium">
      client
    </text>

    {/* cache — small hot rounded rect */}
    <rect x="100" y="52" width="76" height="42" rx="8" fill="none" stroke={accent} strokeWidth="2" />
    <text x="138" y="78" textAnchor="middle" className="text-[11px] font-semibold" fill={accent}>
      cache
    </text>
    <text x="138" y="106" textAnchor="middle" className="text-[9px]" fill={accent}>
      hot · close
    </text>

    {/* origin — large muted rounded rect */}
    <rect x="206" y="30" width="100" height="86" rx="8" fill="none" stroke={MUTED} strokeWidth="1.75" />
    <text x="256" y="74" textAnchor="middle" className="text-[11px] font-semibold" fill={MUTED}>
      origin
    </text>
    <text x="256" y="90" textAnchor="middle" className="text-[9px]" fill={MUTED}>
      slow · source of truth
    </text>

    {/* client → cache: fast solid */}
    <line x1="58" y1="72" x2="96" y2="72" stroke={accent} strokeWidth="2" markerEnd="url(#cache-hot)" />
    <text x="77" y="64" textAnchor="middle" className="text-[9px] font-medium" fill={accent}>
      fast
    </text>

    {/* cache → origin: slow / miss dashed muted */}
    <line
      x1="180"
      y1="72"
      x2="202"
      y2="72"
      stroke={MUTED}
      strokeWidth="2"
      strokeDasharray="4 3"
      markerEnd="url(#cache-muted)"
    />
    <text x="191" y="46" textAnchor="middle" className="text-[9px] font-medium" fill={MUTED}>
      slow / miss
    </text>
  </svg>
);

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------
const DIAGRAMS: Record<string, DiagramRenderer> = {
  'foundations.client-server': ClientServerDiagram,
  'networking.ip-ports': IpPortsDiagram,
  'scaling.vertical-horizontal': VerticalHorizontalDiagram,
  'databases.what-is-a-database': WhatIsADatabaseDiagram,
  'caching.why-cache': WhyCacheDiagram,
};

export function ConceptDiagram({ lessonId, className }: Props): JSX.Element | null {
  const render = DIAGRAMS[lessonId];
  if (!render) return null;

  const accent = lessonAccent(lessonId, curriculum);

  return (
    <div
      className={`w-full max-w-sm mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 flex items-center justify-center text-slate-700 dark:text-slate-200 ${className ?? ''}`}
    >
      {render(accent.hex)}
    </div>
  );
}
