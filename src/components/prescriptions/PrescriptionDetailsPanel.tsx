import type { JSX } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Pencil, Trash2, Ban, Loader2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Translations } from "@/configs/i18n";
import type { PrescriptionListItem } from "@/types/prescription";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { PrescriptionStatusBadge } from "./PrescriptionTable";
import { getPrescription, cancelPrescription } from "@/service/prescriptionService";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDate } from "@/utils/dateHelpers";
import { getApiErrorMessage } from "@/utils/apiError";
import { useNameFormat } from "@/hooks/useNameFormat";

// ── Item progress bar ─────────────────────────────────────────────────────────

function ItemProgressBar({ dispensed, total }: { dispensed: number; total: number }): JSX.Element {
  const pct = total > 0 ? Math.min((dispensed / total) * 100, 100) : 0;
  return (
    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-emerald-500" : pct > 0 ? "bg-blue-500" : "bg-muted-foreground/20"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Cancel confirm dialog ─────────────────────────────────────────────────────

interface CancelDialogProps {
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}

function CancelDialog({ onConfirm, onClose, isPending }: CancelDialogProps): JSX.Element {
  const { t } = useLanguage();
  return (
    <Dialog open onOpenChange={(o) => !o && !isPending && onClose()}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <Ban className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <DialogTitle>{t.prescriptionCancelConfirmTitle}</DialogTitle>
              <DialogDescription className="mt-1">{t.prescriptionCancelConfirmDesc}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
            {t.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending} className="min-w-[7rem] rounded-xl">
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" />{t.prescriptionCancelling}</>
            ) : (
              t.prescriptionCancel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── PrescriptionDetailsPanel ──────────────────────────────────────────────────

export interface PrescriptionDetailsPanelProps {
  prescription: PrescriptionListItem;
  t: Translations;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showCancelDialog: boolean;
  onCancelRequest: () => void;
  onCancelClose: () => void;
}

export function PrescriptionDetailsPanel({
  prescription,
  t,
  onClose,
  onEdit,
  onDelete,
  showCancelDialog,
  onCancelRequest,
  onCancelClose,
}: PrescriptionDetailsPanelProps): JSX.Element {
  const fmt = useNameFormat();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["prescription", prescription.uuid],
    queryFn: () => getPrescription(prescription.uuid),
  });

  const full = data?.data;
  const isPending = prescription.status === "PENDING";

  const cancelMutation = useMutation({
    mutationFn: () => cancelPrescription(prescription.uuid),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        queryClient.invalidateQueries({ queryKey: ["prescription", prescription.uuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.prescriptionCancelSuccess} />);
        onCancelClose();
        onClose();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const actions = [
    ...(isPending
      ? [
          {
            label: t.prescriptionEdit,
            icon: <Pencil className="h-4 w-4" />,
            variant: "outline" as const,
            onClick: onEdit,
          },
          {
            label: t.prescriptionCancel,
            icon: <Ban className="h-4 w-4" />,
            variant: "outline" as const,
            onClick: onCancelRequest,
          },
        ]
      : []),
    {
      label: t.prescriptionDelete,
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive" as const,
      onClick: onDelete,
    },
  ];

  return (
    <>
      <DetailModal
        icon={<FileText className="h-4 w-4 text-primary" />}
        title={t.prescriptionDetailsTitle}
        onClose={onClose}
        actions={actions}
        className="max-w-md"
      >
        {/* Header card */}
        <div className="px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold name-case text-foreground">{prescription.customer.name}</p>
              {prescription.prescriptionNumber && (
                <p className="mt-0.5 text-sm text-muted-foreground">{prescription.prescriptionNumber}</p>
              )}
            </div>
            <PrescriptionStatusBadge status={prescription.status} t={t} />
          </div>
        </div>

        <div className="mx-5 border-t border-border" />

        {/* Info pairs */}
        <div className="divide-y divide-border px-5">
          <InfoPair
            label={t.prescriptionDoctor}
            value={prescription.doctor != null ? fmt(prescription.doctor.name, { doctor: true }) : undefined}
          />
          <InfoPair label={t.prescriptionPrescribedAt} value={formatDate(prescription.prescribedAt)} />
          {full?.medicalVisit && (
            <InfoPair
              label={t.prescriptionFromVisit}
              value={[formatDate(full.medicalVisit.visitDate), full.medicalVisit.diagnosis].filter(Boolean).join(" · ")}
            />
          )}
          {full?.notes && (
            <InfoPair label={t.prescriptionNotes} value={full.notes} />
          )}
          {full?.sale && (
            <InfoPair label={t.prescriptionLinkedSale}>
              <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <ExternalLink className="h-3.5 w-3.5" />
                {full.sale.saleNumber}
              </div>
            </InfoPair>
          )}
        </div>

        {/* Items */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : full?.details && full.details.length > 0 ? (
          <div className="px-5 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.prescriptionItemsLabel}
            </p>
            <div className="space-y-3">
              {full.details.map((item) => (
                <div key={item.uuid} className="rounded-xl border border-border bg-muted/20 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="name-case font-medium text-sm text-foreground">{item.medicineName}</p>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                      {item.dispensedQty} / {item.qty}
                    </span>
                  </div>
                  <ItemProgressBar dispensed={item.dispensedQty} total={item.qty} />
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {item.frequency && (
                      <span className="text-xs text-muted-foreground">{item.frequency}</span>
                    )}
                    {item.duration && (
                      <span className="text-xs text-muted-foreground">{item.duration}</span>
                    )}
                    {item.notes && (
                      <span className="text-xs italic text-muted-foreground">{item.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Dates */}
        <DetailDatesCard
          className="mt-auto"
          rows={[
            { label: t.created, value: formatDate(prescription.createdAt) },
          ]}
        />
      </DetailModal>

      {showCancelDialog && (
        <CancelDialog
          onConfirm={() => cancelMutation.mutate()}
          onClose={onCancelClose}
          isPending={cancelMutation.isPending}
        />
      )}
    </>
  );
}
