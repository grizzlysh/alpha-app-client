import type { JSX } from "react";
import { useMemo } from "react";
import { Shapes, Tag, Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getMedicineShapes, createMedicineShape, updateMedicineShape, deleteMedicineShape } from "@/service/medicineShapeService";
import { getMedicineTypes, createMedicineType, updateMedicineType, deleteMedicineType } from "@/service/medicineTypeService";
import { getMedicineClasses, createMedicineClass, updateMedicineClass, deleteMedicineClass } from "@/service/medicineClassService";
import { ReferenceTabContent } from "@/components/medicine-classification/ReferenceTabContent";
import type { ReferenceLabels } from "@/components/medicine-classification/referenceTypes";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MedicineClassificationPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  const shapeLabels = useMemo<ReferenceLabels>(() => ({
    pageSubtitle: t.medicineShapesSubtitle,
    total: t.medicineShapeTotal,
    singular: t.medicineShapeSingular,
    plural: t.medicineShapePlural,
    searchPlaceholder: t.medicineShapeSearchPlaceholder,
    addBtn: t.medicineShapeAdd,
    statusColumn: t.referenceStatusColumn,
    statusAll: t.referenceStatusAll,
    statusActive: t.referenceStatusActive,
    statusInactive: t.referenceStatusInactive,
    nameColumn: t.medicineShapeName,
    noResults: t.medicineShapeNoResults,
    emptyTitle: t.medicineShapeEmptyTitle,
    emptyDesc: t.medicineShapeEmptyDesc,
    addTitle: t.medicineShapeAdd,
    editTitle: t.medicineShapeEdit,
    nameLabel: t.medicineShapeName,
    namePlaceholder: t.medicineShapeNamePlaceholder,
    nameRequired: t.medicineShapeNameRequired,
    save: t.medicineShapeSave,
    saving: t.medicineShapeSaving,
    cancel: t.cancel,
    detailsTitle: t.medicineShapeDetailsTitle,
    details: t.medicineShapeDetails,
    editBtn: t.medicineShapeEdit,
    deleteBtn: t.medicineShapeDelete,
    deleteConfirmTitle: t.medicineShapeDeleteConfirmTitle,
    deleteConfirmDesc: t.medicineShapeDeleteConfirmDesc,
    deleting: t.medicineShapeDeleting,
    deleteConfirm: t.deleteConfirm,
    showing: t.showing,
    of: t.of,
    rowsPerPage: t.rowsPerPage,
    createSuccess: (t) => t.medicineShapeCreateSuccess,
    updateSuccess: (t) => t.medicineShapeUpdateSuccess,
    deleteSuccess: (t) => t.medicineShapeDeleteSuccess,
    unexpectedError: t.unexpectedError,
  }), [t]);

  const typeLabels = useMemo<ReferenceLabels>(() => ({
    pageSubtitle: t.medicineTypesSubtitle,
    total: t.medicineTypeTotal,
    singular: t.medicineTypeSingular,
    plural: t.medicineTypePlural,
    searchPlaceholder: t.medicineTypeSearchPlaceholder,
    addBtn: t.medicineTypeAdd,
    statusColumn: t.referenceStatusColumn,
    statusAll: t.referenceStatusAll,
    statusActive: t.referenceStatusActive,
    statusInactive: t.referenceStatusInactive,
    nameColumn: t.medicineTypeName,
    noResults: t.medicineTypeNoResults,
    emptyTitle: t.medicineTypeEmptyTitle,
    emptyDesc: t.medicineTypeEmptyDesc,
    addTitle: t.medicineTypeAdd,
    editTitle: t.medicineTypeEdit,
    nameLabel: t.medicineTypeName,
    namePlaceholder: t.medicineTypeNamePlaceholder,
    nameRequired: t.medicineTypeNameRequired,
    save: t.medicineTypeSave,
    saving: t.medicineTypeSaving,
    cancel: t.cancel,
    detailsTitle: t.medicineTypeDetailsTitle,
    details: t.medicineTypeDetails,
    editBtn: t.medicineTypeEdit,
    deleteBtn: t.medicineTypeDelete,
    deleteConfirmTitle: t.medicineTypeDeleteConfirmTitle,
    deleteConfirmDesc: t.medicineTypeDeleteConfirmDesc,
    deleting: t.medicineTypeDeleting,
    deleteConfirm: t.deleteConfirm,
    showing: t.showing,
    of: t.of,
    rowsPerPage: t.rowsPerPage,
    requiredPrescriptionLabel: t.medicineTypeRequiredPrescription,
    requiredPrescriptionYes: t.medicineTypeRequiredPrescriptionYes,
    requiredPrescriptionNo: t.medicineTypeRequiredPrescriptionNo,
    createSuccess: (t) => t.medicineTypeCreateSuccess,
    updateSuccess: (t) => t.medicineTypeUpdateSuccess,
    deleteSuccess: (t) => t.medicineTypeDeleteSuccess,
    unexpectedError: t.unexpectedError,
  }), [t]);

  const classLabels = useMemo<ReferenceLabels>(() => ({
    pageSubtitle: t.medicineClassesSubtitle,
    total: t.medicineClassTotal,
    singular: t.medicineClassSingular,
    plural: t.medicineClassPlural,
    searchPlaceholder: t.medicineClassSearchPlaceholder,
    addBtn: t.medicineClassAdd,
    statusColumn: t.referenceStatusColumn,
    statusAll: t.referenceStatusAll,
    statusActive: t.referenceStatusActive,
    statusInactive: t.referenceStatusInactive,
    nameColumn: t.medicineClassName,
    noResults: t.medicineClassNoResults,
    emptyTitle: t.medicineClassEmptyTitle,
    emptyDesc: t.medicineClassEmptyDesc,
    addTitle: t.medicineClassAdd,
    editTitle: t.medicineClassEdit,
    nameLabel: t.medicineClassName,
    namePlaceholder: t.medicineClassNamePlaceholder,
    nameRequired: t.medicineClassNameRequired,
    save: t.medicineClassSave,
    saving: t.medicineClassSaving,
    cancel: t.cancel,
    detailsTitle: t.medicineClassDetailsTitle,
    details: t.medicineClassDetails,
    editBtn: t.medicineClassEdit,
    deleteBtn: t.medicineClassDelete,
    deleteConfirmTitle: t.medicineClassDeleteConfirmTitle,
    deleteConfirmDesc: t.medicineClassDeleteConfirmDesc,
    deleting: t.medicineClassDeleting,
    deleteConfirm: t.deleteConfirm,
    showing: t.showing,
    of: t.of,
    rowsPerPage: t.rowsPerPage,
    createSuccess: (t) => t.medicineClassCreateSuccess,
    updateSuccess: (t) => t.medicineClassUpdateSuccess,
    deleteSuccess: (t) => t.medicineClassDeleteSuccess,
    unexpectedError: t.unexpectedError,
  }), [t]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navMedicineClassification}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.medicineClassificationSubtitle}
        </p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        <Tabs defaultValue="shapes">
          {/* Tab bar */}
          <div className="overflow-x-auto border-b border-border">
          <div className="w-max min-w-full px-5 pt-4 pb-0">
            <TabsList className="flex h-auto w-full gap-0 rounded-none bg-transparent p-0 justify-around">
              <TabsTrigger
                value="shapes"
                className="flex flex-1 items-center justify-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Shapes className="h-4 w-4" />
                {t.medicineShapeLabel}
              </TabsTrigger>
              <TabsTrigger
                value="types"
                className="flex flex-1 items-center justify-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Tag className="h-4 w-4" />
                {t.medicineTypeLabel}
              </TabsTrigger>
              <TabsTrigger
                value="classes"
                className="flex flex-1 items-center justify-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Shield className="h-4 w-4" />
                {t.medicineClassLabel}
              </TabsTrigger>
            </TabsList>
          </div>
          </div>

          <TabsContent value="shapes">
            <ReferenceTabContent
              queryKey="medicine-shapes"
              queryFn={getMedicineShapes}
              labels={shapeLabels}
              icon={<Shapes className="h-4 w-4 text-white" />}
              createFn={createMedicineShape}
              updateFn={updateMedicineShape}
              deleteFn={deleteMedicineShape}
            />
          </TabsContent>

          <TabsContent value="types">
            <ReferenceTabContent
              queryKey="medicine-types"
              queryFn={getMedicineTypes}
              labels={typeLabels}
              icon={<Tag className="h-4 w-4 text-white" />}
              createFn={createMedicineType}
              updateFn={updateMedicineType}
              deleteFn={deleteMedicineType}
            />
          </TabsContent>

          <TabsContent value="classes">
            <ReferenceTabContent
              queryKey="medicine-classes"
              queryFn={getMedicineClasses}
              labels={classLabels}
              icon={<Shield className="h-4 w-4 text-white" />}
              createFn={createMedicineClass}
              updateFn={updateMedicineClass}
              deleteFn={deleteMedicineClass}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
