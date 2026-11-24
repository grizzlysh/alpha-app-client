import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, HeartPulse, Plus, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckInModal } from "@/components/examinations/CheckInModal";
import { ExamWorkspace } from "@/components/examinations/ExamWorkspace";
import { ExamStatusBadge, formatQueueNumber } from "@/components/examinations/examStatus";
import { QUEUE_STAGES, stageOf, type QueueStage } from "@/components/examinations/queueStage";
import { hasAbnormalVital, vitalsInline } from "@/components/examinations/vitals";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getExaminationQueue } from "@/service/examinationService";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { Examination } from "@/types/examination";
import { useNameFormat } from "@/hooks/useNameFormat";

export default function ExaminationsPage(): JSX.Element {
  const { t, language } = useLanguage();
  const can = useCan();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((s: RootState) => s.auth.currentPharmacy?.uuid);
  const canPerform = can("examinations.perform");

  // Doctors start on "ready"; the front desk / nurse on the arrivals.
  const [stage, setStage] = useState<QueueStage>(canPerform ? "READY" : "WAITING");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  // On narrow screens the list and the workspace take turns.
  const [mobileView, setMobileView] = useState<"queue" | "exam">("queue");

  // The queue changes from other desks (front desk checks in, nurse triages,
  // another doctor calls a patient), so it polls.
  const { data, isLoading } = useQuery({
    queryKey: ["examinations", pharmacyUuid, "today"],
    queryFn: () => getExaminationQueue(),
    refetchInterval: 15_000,
    staleTime: 5_000,
  });

  const queue = data?.data;
  const items = useMemo(() => queue?.items ?? [], [queue]);
  const counts: Record<QueueStage, number> = useMemo(() => {
    const c = { WAITING: 0, READY: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    for (const e of items) {
      const s = stageOf(e);
      if (s) c[s]++;
    }
    return c;
  }, [items]);
  const visible = items.filter((e) => stageOf(e) === stage);
  const selected = items.find((e) => e.uuid === selectedUuid) ?? null;
  const selectedStage = selected ? stageOf(selected) : null;

  // Keep the selection on screen when triage / call-in moves it to another stage.
  useEffect(() => {
    if (selectedStage && selectedStage !== stage) setStage(selectedStage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStage]);

  function select(exam: Examination): void {
    setSelectedUuid(exam.uuid);
    setMobileView("exam");
  }

  const locale = language === "id" ? "id-ID" : "en-US";
  const dateLabel = queue
    ? new Date(`${queue.date}T12:00:00`).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="flex h-[calc(100dvh-6rem)] flex-col space-y-4 overflow-hidden md:h-[calc(100dvh-7rem)]">
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
        <Card className={cn("w-full flex-shrink-0 flex-col overflow-hidden lg:flex lg:w-[22rem]", mobileView === "queue" ? "flex" : "hidden")}>
          {/* Stage stepper: the order a patient moves through. */}
          <div className="grid grid-cols-4 gap-1 border-b border-border bg-muted/20 p-2" role="tablist" aria-label={t.navExaminations}>
            {QUEUE_STAGES.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={stage === s}
                onClick={() => setStage(s)}
                className={cn(
                  "flex flex-col items-center rounded-xl px-1 py-2 text-[11px] font-medium leading-tight transition-colors",
                  stage === s ? "bg-card text-primary shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-card/60"
                )}
              >
                <span className={cn("text-lg font-bold tabular-nums leading-tight", stage === s ? "text-primary" : "text-foreground")}>
                  {counts[s]}
                </span>
                <span className="text-center">{stageLabel(s, t)}</span>
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
                <p className="text-sm text-muted-foreground">{stageEmpty(stage, t)}</p>
                {stage === "READY" && counts.WAITING > 0 && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setStage("WAITING")}>
                    {t.examSeeWaiting.replace("{n}", String(counts.WAITING))}
                  </Button>
                )}
              </div>
            ) : (
              <ul className="space-y-1">
                {visible.map((exam) => (
                  <QueueItem
                    key={exam.uuid}
                    exam={exam}
                    today={queue?.date ?? ""}
                    locale={locale}
                    selected={exam.uuid === selectedUuid}
                    onClick={() => select(exam)}
                    t={t}
                  />
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
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40">
                <Stethoscope className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{t.examSelectTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.examSelectDesc}</p>
              </div>
              <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                {[t.examFlowRegister, t.examFlowTriage, t.examFlowDoctor, t.examFlowDone].map((label, i, all) => (
                  <li key={label} className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">{i + 1}</span>
                      {label}
                    </span>
                    {i < all.length - 1 && <span aria-hidden>→</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      </div>

      {checkInOpen && (
        <CheckInModal
          onClose={() => setCheckInOpen(false)}
          onCheckedIn={(exam) => {
            setCheckInOpen(false);
            setStage("WAITING");
            setSelectedUuid(exam.uuid);
            setMobileView("exam");
          }}
        />
      )}
    </div>
  );
}

function stageLabel(s: QueueStage, t: Translations): string {
  return { WAITING: t.examStageWaiting, READY: t.examStageReady, IN_PROGRESS: t.examStatusInProgress, COMPLETED: t.examStatusCompleted }[s];
}

function stageEmpty(s: QueueStage, t: Translations): string {
  return { WAITING: t.examQueueEmpty, READY: t.examReadyEmpty, IN_PROGRESS: t.examInProgressEmpty, COMPLETED: t.examCompletedEmpty }[s];
}

function QueueItem({
  exam,
  today,
  locale,
  selected,
  onClick,
  t,
}: {
  exam: Examination;
  today: string;
  locale: string;
  selected: boolean;
  onClick: () => void;
  t: Translations;
}): JSX.Element {
  const fmt = useNameFormat();
  const stage = stageOf(exam);
  const since = stage === "WAITING" || stage === "READY" ? exam.checkedInAt : stage === "IN_PROGRESS" ? exam.startedAt : null;
  const minutes = since ? Math.max(0, Math.floor((Date.now() - new Date(since).getTime()) / 60000)) : null;
  const checkedIn = exam.checkedInAt ? new Date(exam.checkedInAt) : null;
  // Carried over from an earlier day (still waiting / being examined).
  const carriedOver = checkedIn != null && today !== "" && checkedIn.toLocaleDateString("sv-SE") < today;
  const time = checkedIn
    ? carriedOver
      ? checkedIn.toLocaleDateString(locale, { day: "numeric", month: "short" })
      : checkedIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const hasSevere = exam.patient.allergies.some((a) => a.severity === "SEVERE");
  const vitals = vitalsInline(exam);
  const abnormal = hasAbnormalVital(exam);

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
              {fmt(exam.patient.name)}
            </span>
            {hasSevere && (
              <span className="shrink-0 rounded bg-destructive/10 px-1 text-[10px] font-bold uppercase text-destructive" title={t.examAllergies}>
                {t.examAllergyTag}
              </span>
            )}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {carriedOver && <span className="font-medium text-amber-700 dark:text-amber-400">{t.examCarriedOver} </span>}
            {time}
            {minutes != null && !carriedOver && (stage === "WAITING" || stage === "READY") && ` · ${t.examWaitingFor.replace("{n}", String(minutes))}`}
            {exam.chiefComplaint && ` · ${exam.chiefComplaint}`}
          </span>
          {vitals && (stage === "READY" || stage === "IN_PROGRESS") && (
            <span className={cn("mt-0.5 flex items-center gap-1 truncate text-[11px] tabular-nums", abnormal ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
              <ClipboardList className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{vitals}</span>
            </span>
          )}
        </span>
        {stage === "IN_PROGRESS" && <ExamStatusBadge status={exam.status} t={t} />}
      </button>
    </li>
  );
}
