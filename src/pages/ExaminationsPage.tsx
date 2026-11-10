import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse, Plus, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckInModal } from "@/components/examinations/CheckInModal";
import { ExamWorkspace } from "@/components/examinations/ExamWorkspace";
import { ExamStatusBadge, formatQueueNumber } from "@/components/examinations/examStatus";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getExaminationQueue } from "@/service/examinationService";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { Examination, VisitStatus } from "@/types/examination";

type Filter = "WAITING" | "IN_PROGRESS" | "COMPLETED";
const FILTERS: Filter[] = ["WAITING", "IN_PROGRESS", "COMPLETED"];

export default function ExaminationsPage(): JSX.Element {
  const { t, language } = useLanguage();
  const can = useCan();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((s: RootState) => s.auth.currentPharmacy?.uuid);

  const [filter, setFilter] = useState<Filter>("WAITING");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  // On narrow screens the list and the workspace take turns.
  const [mobileView, setMobileView] = useState<"queue" | "exam">("queue");

  // The queue changes from other desks (front desk checks in, another doctor
  // calls a patient), so it polls.
  const { data, isLoading } = useQuery({
    queryKey: ["examinations", pharmacyUuid, "today"],
    queryFn: () => getExaminationQueue(),
    refetchInterval: 15_000,
    staleTime: 5_000,
  });

  const queue = data?.data;
  const items = useMemo(() => queue?.items ?? [], [queue]);
  const visible = items.filter((e) => e.status === filter);
  const selected = items.find((e) => e.uuid === selectedUuid) ?? null;

  // Keep the selection on screen when its status moves it to another tab.
  useEffect(() => {
    if (selected && selected.status !== "CANCELLED" && selected.status !== filter) {
      setFilter(selected.status as Filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.status]);

  function select(exam: Examination): void {
    setSelectedUuid(exam.uuid);
    setMobileView("exam");
  }

  const dateLabel = queue
    ? new Date(`${queue.date}T12:00:00`).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col space-y-4 overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">
            {t.navExaminations}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t.examSubtitle}
            {dateLabel && <> · {dateLabel}</>}
          </p>
        </div>
        {can("examinations.checkin") && (
          <Button className="gap-2 rounded-xl" onClick={() => setCheckInOpen(true)}>
            <Plus className="h-4 w-4" />
            {t.examCheckIn}
          </Button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* ── Queue ── */}
        <Card className={cn("w-full flex-shrink-0 flex-col overflow-hidden lg:flex lg:w-80", mobileView === "queue" ? "flex" : "hidden")}>
          <div className="grid grid-cols-3 gap-1 border-b border-border p-2" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex flex-col items-center rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  filter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                <span className="text-lg font-bold tabular-nums leading-tight">{queue?.counts[f] ?? 0}</span>
                {statusLabel(f, t)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/50" />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                <HeartPulse className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t.examQueueEmpty}</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {visible.map((exam) => (
                  <QueueItem key={exam.uuid} exam={exam} selected={exam.uuid === selectedUuid} onClick={() => select(exam)} t={t} />
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* ── Workspace ── */}
        <Card className={cn("min-w-0 flex-1 flex-col overflow-hidden lg:flex", mobileView === "exam" ? "flex" : "hidden")}>
          {selected ? (
            <>
              <button
                type="button"
                className="border-b border-border px-5 py-2 text-left text-xs font-medium text-primary lg:hidden"
                onClick={() => setMobileView("queue")}
              >
                ← {t.navExaminations}
              </button>
              {/* keyed so form state resets when switching patients */}
              <ExamWorkspace key={selected.uuid} exam={selected} />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40">
                <Stethoscope className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{t.examSelectTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.examSelectDesc}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {checkInOpen && (
        <CheckInModal
          onClose={() => setCheckInOpen(false)}
          onCheckedIn={(exam) => {
            setCheckInOpen(false);
            setFilter("WAITING");
            setSelectedUuid(exam.uuid);
          }}
        />
      )}
    </div>
  );
}

function statusLabel(s: VisitStatus, t: Translations): string {
  return { WAITING: t.examStatusWaiting, IN_PROGRESS: t.examStatusInProgress, COMPLETED: t.examStatusCompleted, CANCELLED: t.examStatusCancelled }[s];
}

function QueueItem({
  exam,
  selected,
  onClick,
  t,
}: {
  exam: Examination;
  selected: boolean;
  onClick: () => void;
  t: Translations;
}): JSX.Element {
  const since = exam.status === "WAITING" ? exam.checkedInAt : exam.status === "IN_PROGRESS" ? exam.startedAt : null;
  const minutes = since ? Math.max(0, Math.floor((Date.now() - new Date(since).getTime()) / 60000)) : null;
  const time = exam.checkedInAt
    ? new Date(exam.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const hasSevere = exam.patient.allergies.some((a) => a.severity === "SEVERE");

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
          selected ? "bg-primary/10" : "hover:bg-muted/60"
        )}
      >
        <span
          className={cn(
            "flex h-9 min-w-9 items-center justify-center rounded-lg px-1 font-mono text-sm font-bold tabular-nums",
            selected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {formatQueueNumber(exam.queueNumber)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className={cn("truncate text-sm font-semibold", selected ? "text-primary" : "text-foreground")}>
              {exam.patient.name.toUpperCase()}
            </span>
            {hasSevere && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" title={t.examAllergies} aria-label={t.examAllergies} />}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {time}
            {minutes != null && exam.status === "WAITING" && ` · ${t.examWaitingFor.replace("{n}", String(minutes))}`}
            {exam.chiefComplaint && ` · ${exam.chiefComplaint}`}
          </span>
        </span>
        {exam.status !== "WAITING" && <ExamStatusBadge status={exam.status} t={t} />}
      </button>
    </li>
  );
}
