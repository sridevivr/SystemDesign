import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  footer?: ReactNode;
};

export function CardShell({ children, footer }: Props) {
  return (
    <div className="animate-fade-in flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:shadow-soft-dark">
      <div className="flex-1">{children}</div>
      {footer && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          {footer}
        </div>
      )}
    </div>
  );
}
