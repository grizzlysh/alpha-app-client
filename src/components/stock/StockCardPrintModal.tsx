import type { JSX } from "react";
import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { StockCardView } from "./StockCardView";

export interface StockCardPrintModalProps {
  medicineUuid: string;
  medicineName: string;
  onClose: () => void;
}

/** The medicine's daily stock card in a dialog. */
export function StockCardPrintModal({ medicineUuid, medicineName, onClose }: StockCardPrintModalProps): JSX.Element {
  const { t } = useLanguage();
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span className="truncate">
              {t.printStockCard} · <span className="name-case">{medicineName}</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <StockCardView
          medicineUuid={medicineUuid}
          actions={
            <Button variant="outline" className="rounded-xl" onClick={onClose}>
              {t.cancel}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
