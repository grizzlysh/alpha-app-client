import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { useCan } from "@/hooks/usePermission";
import { useLanguage } from "@/hooks/useLanguage";
import { getCustomersDropdown } from "@/service/customerService";
import { getDoctorsDropdown } from "@/service/doctorService";
import { checkInPatient } from "@/service/examinationService";
import { getApiErrorMessage } from "@/utils/apiError";
import { toDoctorName, toTitleCase } from "@/utils/stringHelpers";
import type { Examination } from "@/types/examination";

export interface CheckInModalProps {
  onClose: () => void;
  onCheckedIn: (exam: Examination) => void;
}

export function CheckInModal({ onClose, onCheckedIn }: CheckInModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const [patientUuid, setPatientUuid] = useState("");
  const [doctorUuid, setDoctorUuid] = useState("");
  const [complaint, setComplaint] = useState("");
  const [touched, setTouched] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);
  const can = useCan();

  const { data: patients } = useQuery({
    queryKey: ["customers-dropdown", { customerType: "PATIENT" }],
    queryFn: () => getCustomersDropdown({ customerType: "PATIENT" }),
  });
  const { data: doctors } = useQuery({ queryKey: ["doctors-dropdown"], queryFn: () => getDoctorsDropdown() });

  const patientOptions = useMemo(
    () =>
      (patients?.data ?? [])
        .filter((p) => !p.isWalkIn)
        .map((p) => ({ value: p.uuid, label: p.phone ? `${toTitleCase(p.name)} · ${p.phone}` : toTitleCase(p.name) })),
    [patients]
  );
  const doctorOptions = useMemo(
    () => [
      { value: "", label: t.examDoctorPlaceholder },
      ...(doctors?.data ?? []).map((d) => ({ value: d.uuid, label: toDoctorName(d.name) })),
    ],
    [doctors, t]
  );

  const mutation = useMutation({
    mutationFn: () =>
      checkInPatient({
        customerUuid: patientUuid,
        doctorUuid: doctorUuid || undefined,
        chiefComplaint: complaint.trim() || undefined,
      }),
    onSuccess: (res) => {
      toast.success(t.examCheckInSuccess);
      if (res.data) onCheckedIn(res.data);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  function submit(): void {
    setTouched(true);
    if (!patientUuid) return;
    mutation.mutate();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !mutation.isPending && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.examCheckInTitle}</DialogTitle>
          <DialogDescription>{can("examinations.triage") ? t.examCheckInDescTriage : t.examCheckInDesc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label>
                {t.examPatient}
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              {can("customers.create") && (
                <Button type="button" variant="link" size="sm" className="h-auto gap-1 p-0 text-xs" onClick={() => setCreatingPatient(true)}>
                  <UserPlus className="h-3.5 w-3.5" />
                  {t.examNewPatient}
                </Button>
              )}
            </div>
            <Combobox
              value={patientUuid}
              onValueChange={setPatientUuid}
              options={patientOptions}
              placeholder={t.examPatientPlaceholder}
              searchPlaceholder={t.examPatientPlaceholder}
              className={touched && !patientUuid ? "h-10 w-full rounded-xl border-destructive" : "h-10 w-full rounded-xl"}
            />
            {touched && !patientUuid && <p className="text-xs text-destructive">{t.examPatientRequired}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>{t.examDoctorOptional}</Label>
            <Combobox
              value={doctorUuid}
              onValueChange={setDoctorUuid}
              options={doctorOptions}
              placeholder={t.examDoctorPlaceholder}
              className="h-10 w-full rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.medicalRecordVisitChiefComplaint}</Label>
            <Textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder={t.examComplaintPlaceholder}
              rows={2}
              className="resize-none rounded-xl"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={onClose} disabled={mutation.isPending}>
            {t.cancel}
          </Button>
          <Button className="rounded-xl" onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.examCheckIn}
          </Button>
        </DialogFooter>
      </DialogContent>

      {creatingPatient && (
        <CustomerFormModal
          mode="create"
          onClose={() => setCreatingPatient(false)}
          onSuccess={(customer) => {
            setCreatingPatient(false);
            if (customer?.customerType === "PATIENT") setPatientUuid(customer.uuid);
          }}
        />
      )}
    </Dialog>
  );
}
