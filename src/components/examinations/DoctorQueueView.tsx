import type { JSX } from "react";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardCheck, Info, Loader2, PhoneCall, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Translations } from "@/configs/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { startExamination } from "@/service/examinationService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import type { Examination, QueueDoctor } from "@/types/examination";
import { buildDoctorLanes, unassignedWaiting, type DoctorLane } from "./doctorLanes";
import { formatQueueNumber } from "./examStatus";

interface DoctorQueueViewProps {
  items: Examination[];
  doctors: QueueDoctor[];
  selectedUuid: string | null;
  /** The user may call patients in (examinations.perform). */
  canCall: boolean;
  onSelect: (exam: Examination) => void;
}

/**
 * The queue split per doctor. Each doctor sees whom they are examining, or
 * that they are free, and their own line: patients who chose them plus those
 * who chose no doctor. The first doctor to call an "any doctor" patient takes them.
 */
export function DoctorQueueView({ items, doctors, selectedUuid, canCall, onSelect }: DoctorQueueViewProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const lanes = useMemo(() => buildDoctorLanes(items, doctors), [items, doctors]);
  const unassigned = useMemo(() => unassignedWaiting(items), [items]);
  // A doctor calls only into their own line; a user without a doctor profile
  // (e.g. the owner covering the desk) may call for any doctor.
  const userIsDoctor = doctors.some((d) => d.isMe);

  const callMutation = useMutation({
    mutationFn: ({ exam, doctor }: { exam: Examination; doctor: QueueDoctor }) => startExamination(exam.uuid, doctor.uuid),
    onSuccess: (res, { exam }) => {
      toast.success(t.examCalledIn.replace("{name}", exam.patient.name));
      if (res.data) onSelect(res.data);
    },
    // Someone else may have called the patient first: say so and show the fresh queue.
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["examinations"] }),
  });

  if (lanes.length === 0) {
    return (
      <div className="space-y-3 p-2">
        <div className="flex gap-3 rounded-xl border border-dashed border-border p-4">
          <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" aria-hidden />
          <div>
            <p className="text-sm font-medium text-foreground">{t.examNoDoctorsTitle}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.examNoDoctorsDesc}</p>
          </div>
        </div>
        {unassigned.length > 0 && (
          <PatientList exams={unassigned} selectedUuid={selectedUuid} onSelect={onSelect} t={t} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2">
      {unassigned.length > 0 && (
        <p className="flex gap-2 rounded-xl bg-muted/40 px-3 py-2 text-[11px] leading-snug text-muted-foreground">
          <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
          {t.examAnyDoctorHint}
        </p>
      )}
      {lanes.map((lane) => (
        <Lane
          key={lane.doctor.uuid}
          lane={lane}
          selectedUuid={selectedUuid}
          canCall={canCall && (!userIsDoctor || lane.doctor.isMe)}
          calling={callMutation.isPending && callMutation.variables?.doctor.uuid === lane.doctor.uuid}
          disabled={callMutation.isPending}
          onCall={(exam) => callMutation.mutate({ exam, doctor: lane.doctor })}
          onSelect={onSelect}
          t={t}
        />
      ))}
    </div>
  );
}

function Lane({
  lane,
  selectedUuid,
  canCall,
  calling,
  disabled,
  onCall,
  onSelect,
  t,
}: {
  lane: DoctorLane;
  selectedUuid: string | null;
  canCall: boolean;
  calling: boolean;
  disabled: boolean;
  onCall: (exam: Examination) => void;
  onSelect: (exam: Examination) => void;
  t: Translations;
}): JSX.Element {
  const fmt = useNameFormat();
  const { doctor, current, waiting } = lane;
  const busy = current.length > 0;
  const next = waiting[0];
  const nextLabel = next ? `${formatQueueNumber(next.queueNumber)} ${fmt(next.patient.name)}` : "";

  return (
    <section className={cn("overflow-hidden rounded-xl border", doctor.isMe ? "border-primary/40" : "border-border")}>
      <header className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
          {fmt(doctor.name, { doctor: true })}
          {doctor.isMe && <span className="ml-1.5 text-xs font-normal text-primary">({t.examDoctorYou})</span>}
        </p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            busy ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
          )}
        >
          {busy
            ? t.examDoctorBusy.replace("{n}", current.map((e) => formatQueueNumber(e.queueNumber)).join(", "))
            : t.examDoctorFree}
        </span>
      </header>

      <div className="space-y-2 p-2">
        {current.map((exam) => (
          <PatientRow key={exam.uuid} exam={exam} selected={exam.uuid === selectedUuid} onClick={() => onSelect(exam)} t={t} active />
        ))}

        {!busy && next && (
          canCall ? (
            <Button className="h-9 w-full justify-start gap-2 rounded-xl text-xs" disabled={disabled} onClick={() => onCall(next)}>
              {calling ? <Loader2 className="h-4 w-4 animate-spin" /> : <PhoneCall className="h-4 w-4" />}
              <span className="truncate">{t.examCallNext.replace("{n} {name}", nextLabel)}</span>
            </Button>
          ) : (
            <p className="truncate px-1 text-xs font-medium text-success">{t.examNextUp.replace("{n} {name}", nextLabel)}</p>
          )
        )}

        {waiting.length === 0 ? (
          !busy && <p className="px-1 py-1 text-xs text-muted-foreground">{t.examLaneEmpty}</p>
        ) : (
          <>
            <p className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t.examWaitingCount.replace("{n}", String(waiting.length))}
            </p>
            <PatientList exams={waiting} selectedUuid={selectedUuid} onSelect={onSelect} t={t} numbered />
          </>
        )}
      </div>
    </section>
  );
}

function PatientList({
  exams,
  selectedUuid,
  onSelect,
  t,
  numbered = false,
}: {
  exams: Examination[];
  selectedUuid: string | null;
  onSelect: (exam: Examination) => void;
  t: Translations;
  numbered?: boolean;
}): JSX.Element {
  return (
    <ol className="space-y-0.5">
      {exams.map((exam, i) => (
        <li key={exam.uuid} className="flex items-center gap-2">
          {numbered && <span className="w-4 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">{i + 1}.</span>}
          <div className="min-w-0 flex-1">
            <PatientRow exam={exam} selected={exam.uuid === selectedUuid} onClick={() => onSelect(exam)} t={t} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function PatientRow({
  exam,
  selected,
  onClick,
  t,
  active = false,
}: {
  exam: Examination;
  selected: boolean;
  onClick: () => void;
  t: Translations;
  active?: boolean;
}): JSX.Element {
  const fmt = useNameFormat();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
        selected ? "bg-primary/10" : active ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/60"
      )}
    >
      <span
        className={cn(
          "flex h-7 min-w-7 items-center justify-center rounded-md px-1 font-mono text-xs font-bold tabular-nums",
          active || selected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        {formatQueueNumber(exam.queueNumber)}
      </span>
      <span className={cn("min-w-0 flex-1 truncate text-sm", selected ? "font-semibold text-primary" : "font-medium text-foreground")}>
        {fmt(exam.patient.name)}
      </span>
      {exam.triagedAt && exam.status === "WAITING" && (
        <ClipboardCheck className="h-3.5 w-3.5 shrink-0 text-success" aria-label={t.examStageReady} />
      )}
      {exam.status === "WAITING" && exam.doctor === null && (
        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
          {t.examAnyDoctor}
        </span>
      )}
    </button>
  );
}
