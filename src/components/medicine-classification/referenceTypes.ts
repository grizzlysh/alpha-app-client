import type { Translations } from "@/configs/i18n";

export interface ReferenceItem {
  uuid: string;
  name: string;
  requiredPrescription?: boolean;
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
  // Required prescription (medicine types only)
  requiredPrescriptionLabel?: string;
  requiredPrescriptionYes?: string;
  requiredPrescriptionNo?: string;
  // Success / error
  createSuccess: (t: Translations) => string;
  updateSuccess: (t: Translations) => string;
  deleteSuccess: (t: Translations) => string;
  unexpectedError: string;
}
