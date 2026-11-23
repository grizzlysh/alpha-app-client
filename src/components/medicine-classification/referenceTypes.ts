import type { Translations } from "@/configs/i18n";
import type { OrderLetterKind } from "@/utils/orderLetter";

export interface ReferenceItem {
  uuid: string;
  name: string;
  requiredPrescription?: boolean;
  isControlled?: boolean;
  orderLetterKind?: OrderLetterKind;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceLabels {
  // Page header
  pageSubtitle: string;
  // Toolbar
  total: string;
  singular: string;
  plural: string;
  searchPlaceholder: string;
  addBtn: string;
  // Status filter / column
  statusColumn: string;
  statusAll: string;
  statusActive: string;
  statusInactive: string;
  // Table columns / empty state
  nameColumn: string;
  noResults: string;
  emptyTitle: string;
  emptyDesc: string;
  // Form modal
  addTitle: string;
  editTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  nameRequired: string;
  save: string;
  saving: string;
  cancel: string;
  // Detail panel
  detailsTitle: string;
  details: string;
  editBtn: string;
  deleteBtn: string;
  // Delete confirm
  deleteConfirmTitle: string;
  deleteConfirmDesc: string;
  deleting: string;
  deleteConfirm: string;
  // Pagination
  showing: string;
  of: string;
  rowsPerPage: string;
  // Empty state CTA button width (optional fixed width for alignment)
  addBtnWidth?: string;
  // Required prescription (medicine types only)
  requiredPrescriptionLabel?: string;
  requiredPrescriptionYes?: string;
  requiredPrescriptionNo?: string;
  // Controlled (narcotics/psychotropics/precursors; medicine types only)
  controlledLabel?: string;
  controlledHint?: string;
  controlledBadge?: string;
  // Order letter kind (medicine types only)
  orderLetterKindLabel?: string;
  // Success / error
  createSuccess: (t: Translations) => string;
  updateSuccess: (t: Translations) => string;
  deleteSuccess: (t: Translations) => string;
  unexpectedError: string;
}
