import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  footer?: ReactNode;
};

export function CardShell({ children, footer }: Props) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
      <div className="flex-1">{children}</div>
      {footer && <div className="pt-2 border-t border-slate-100">{footer}</div>}
    </div>
  );
}
