import type { JSX } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { Combobox } from "@/components/ui/combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabelQueuePanel } from "@/components/stock-labels/LabelQueuePanel";
import { LabelSearchPanel } from "@/components/stock-labels/LabelSearchPanel";
import { type NewQueueItem, type QueueItem, addToQueue } from "@/components/stock-labels/labelQueue";
import { StockCardView } from "@/components/stock/StockCardView";
import { type PrintPrefs, loadPrefs, savePrefs } from "@/components/stock/printPrefs";
import { boxCount } from "@/components/stock/barcodeLabels";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getStockDetails, getStocks } from "@/service/stockService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Stock } from "@/types/stock";

type Tab = "labels" | "card";
const MEDICINE_OPTIONS_LIMIT = 1000;

/** Print barcode labels for many batches at once, and a medicine's daily stock card. */
export default function StockLabelsPage(): JSX.Element {
  const { t, language } = useLanguage();
  const fmt = useNameFormat();
  const pageTitleRef = useScrollAwareTitle();
  const [tab, setTab] = useState<Tab>("labels");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [prefs, setPrefs] = useState<PrintPrefs>(loadPrefs);
  const [cardMedicineUuid, setCardMedicineUuid] = useState("");

  const medicinesQuery = useQuery({
    queryKey: ["stock-label-medicines"],
    queryFn: () => getStocks({ limit: MEDICINE_OPTIONS_LIMIT, sortBy: "name" }),
    enabled: tab === "card",
    staleTime: 60_000,
  });
  const medicineOptions = (medicinesQuery.data?.data ?? []).map((s) => ({ value: s.medicine.uuid, label: fmt(s.medicine.name) }));

  function add(item: NewQueueItem): void {
    setQueue((q) => addToQueue(q, item));
  }

  // A scanned or typed code adds the label it belongs to: a batch, an item or a medicine code.
  const scan = useMutation({
    mutationFn: async (code: string) => (await getStockDetails({ barcode: code })).data ?? [],
    onSuccess: (matches) => {
      const first = matches[0];
      if (!first) {
        toast.warning(<LiveToastMessage getMessage={(tr) => tr.stockLabelsNoResults} />);
        return;
      }
      const base = {
        stockDetailUuid: first.uuid,
        medicineUuid: first.medicine.uuid,
        medicineName: first.medicine.name,
        batchNumber: first.batchNumber,
      };
      if (first.scanMatch === "MEDICINE") add({ ...base, kind: "medicine-label", batchNumber: null, copies: 1 });
      else if (first.scanMatch === "ITEM") add({ ...base, kind: "item-label", copies: boxCount(first.quantityPieces, first.quantityPerBox) });
      else add({ ...base, kind: "batch-label", copies: 1 });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });
  useBarcodeScanner({ onScan: (code) => scan.mutate(code), enabled: tab === "labels" });

  function updatePrefs(next: PrintPrefs): void {
    setPrefs(next);
    savePrefs(next);
  }

  function openStockCard(stock: Stock): void {
    setCardMedicineUuid(stock.medicine.uuid);
    setTab("card");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">
          {t.navStockLabels}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.stockLabelsSubtitle}</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="labels">{t.stockLabelsTabLabels}</TabsTrigger>
          <TabsTrigger value="card">{t.stockLabelsTabCard}</TabsTrigger>
        </TabsList>

        <TabsContent value="labels" className="mt-4">
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <LabelSearchPanel onAdd={add} onScan={(code) => scan.mutate(code)} isScanning={scan.isPending} onOpenStockCard={openStockCard} />
            <LabelQueuePanel queue={queue} onChange={setQueue} prefs={prefs} onPrefsChange={updatePrefs} />
          </div>
        </TabsContent>

        <TabsContent value="card" className="mt-4">
          <Card className="space-y-4 p-4">
            <Combobox
              value={cardMedicineUuid}
              onValueChange={setCardMedicineUuid}
              options={medicineOptions}
              placeholder={t.stockCardPickMedicine}
              searchPlaceholder={t.stockLabelsSearch}
              emptyText={t.stockLabelsNoResults}
              className="w-full sm:max-w-md"
            />
            {cardMedicineUuid ? (
              <StockCardView key={cardMedicineUuid} medicineUuid={cardMedicineUuid} />
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">{t.stockCardPickHint}</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
