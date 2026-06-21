import type { JSX, ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  children: ReactNode;
}

export function ReportSection({ title, children }: ReportSectionProps): JSX.Element {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}
