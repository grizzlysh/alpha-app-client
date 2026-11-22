import { LANGUAGE_KEY } from "@/utils/constants";

export type Language = "en" | "id";

export interface Translations {
  appName: string;
  appSubtitle: string;
  featureHeadline: string;
  featureDesc: string;
  featureStock: string;
  featurePOS: string;
  featurePrescriptions: string;
  welcomeBack: string;
  signInDesc: string;
  signInHeadlinePrefix: string;
  signInSubtitle: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  rememberMe: string;
  signIn: string;
  signingIn: string;
  orDivider: string;
  continueWithGoogle: string;
  noAccount: string;
  contactAdmin: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  loginFailed: string;
  unexpectedError: string;
  showPassword: string;
  hidePassword: string;
  copyright: string;
  switchToLight: string;
  switchToDark: string;
  selectPharmacyTitle: string;
  selectPharmacySubtitle: string;
  selectButton: string;
  selecting: string;
  noPharmaciesTitle: string;
  noPharmaciesDesc: string;
  signOut: string;
  signingOut: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingNight: string;
  dailySummary: string;
  yourPharmacies: string;
  selectBranchSubtitle: string;
  pharmacyAccessPrefix: string;
  pharmacySingular: string;
  pharmacyPlural: string;
  filterAll: string;
  filterOpen: string;
  filterNeedsAttention: string;
  statusOpen: string;
  statusClosed: string;
  lowStockWarning: string;
  salesLabel: string;
  transactionsLabel: string;
  rxQueueLabel: string;
  navDashboard: string;
  navGroupSales: string;
  navGroupInventory: string;
  navGroupProcurement: string;
  navGroupPeople: string;
  navGroupSettings: string;

  // Dashboard page
  dashboardSubtitle: string;
  dashboardVsYesterday: string;
  dashboardTodayRevenue: string;
  dashboardTransactionCount: string;
  dashboardAvgTransaction: string;
  dashboardSalesTrendTitle: string;
  dashboardRevenue7Days: string;
  dashboardRevenue14Days: string;
  dashboardRevenue30Days: string;
  dashboardSaleTypeSplit: string;
  dashboardNotAvailableTitle: string;
  dashboardSaleTypeNotAvailableDesc: string;
  dashboardStockAlertsTitle: string;
  dashboardStockAlertsEmpty: string;
  dashboardStockLabel: string;
  dashboardReorderLabel: string;
  dashboardStockCritical: string;
  dashboardStockLow: string;
  dashboardExpiryLabel: string;
  dashboardDaysSuffix: string;
  dashboardExpirySoon: string;
  dashboardTopProductsTitle: string;
  dashboardTopProductsEmpty: string;
  dashboardUnitsSoldSuffix: string;
  dashboardOpenPOsTitle: string;
  dashboardOpenPOsEmpty: string;
  dashboardComplianceTitle: string;
  dashboardSipnapLabel: string;
  dashboardSiaLabel: string;
  dashboardApjLabel: string;
  dashboardLicenseExpiresLabel: string;
  dashboardLicenseOverdue: string;
  dashboardQuickActionsTitle: string;
  dashboardActionSell: string;
  dashboardActionReceiveGoods: string;
  dashboardActionAdjustStock: string;
  dashboardActionCreatePO: string;
  dashboardNeedRestockTitle: string;
  dashboardNeedRestockEmpty: string;
  dashboardExpiringSoonTitle: string;
  dashboardExpiringSoonEmpty: string;
  dashboardRecentTransactionsTitle: string;
  dashboardRecentTransactionsEmpty: string;
  dashboardTopByQtyTitle: string;
  dashboardTopByRevenueTitle: string;
  dashboardInventoryAsset: string;
  dashboardUnpaidInvoicesTitle: string;
  dashboardUnpaidInvoicesEmpty: string;
  dashboardUnpaidTotalLabel: string;
  dashboardInventoryAssetVsQuarter: string;
  // Slow movers
  dashboardSlowMoversTitle: string;
  dashboardSlowMoversEmpty: string;
  dashboardSlowMoversDaysSince: string;
  dashboardSlowMoversEstValue: string;
  dashboardSlowMoversNeverSold: string;
  dashboardSlowMoversTotalIdleValue: string;
  // Stock runway
  dashboardStockRunwayTitle: string;
  dashboardStockRunwayEmpty: string;
  dashboardRunwayCritical: string;
  dashboardRunwayLow: string;
  dashboardRunwayAdequate: string;
  dashboardRunwayOverstocked: string;
  dashboardRunwayDaysLeft: string;
  dashboardRunwayNoSales: string;
  dashboardAvgDailySalesLabel: string;
  // Monthly revenue
  dashboardMonthlyRevenueTitle: string;
  dashboardMtdLabel: string;
  dashboardMtdVsPrevLabel: string;
  // Gross profit
  dashboardGrossProfitTitle: string;
  dashboardGrossProfitMarginLabel: string;
  dashboardGrossProfitVsLastMonth: string;
  dashboardCogsLabel: string;
  dashboardRevenueLabel: string;
  // Purchase spend
  dashboardPurchaseSpendTitle: string;
  dashboardPurchaseSpendMtdLabel: string;
  // Payment schedule
  dashboardPaymentScheduleTitle: string;
  dashboardPaymentScheduleEmpty: string;
  dashboardPaymentOverdueLabel: string;
  dashboardPaymentUpcomingLabel: string;
  // Credit sales outstanding
  dashboardCreditSalesTitle: string;
  dashboardCreditSalesEmpty: string;
  dashboardCreditSalesTotalLabel: string;
  dashboardCreditSalesDaysSince: string;

  navPOS: string;
  navSales: string;
  navStock: string;
  navMedicines: string;
  navPrescriptions: string;
  navPurchaseOrders: string;
  navStockDisposals: string;
  navInvoices: string;
  navPatients: string;
  navCustomers: string;
  navDistributors: string;
  navReports: string;
  navSettings: string;
  searchPlaceholder: string;
  notifications: string;
  notificationsEmpty: string;
  notificationsEmptyDesc: string;
  notificationsMarkAllRead: string;
  notificationsLoadError: string;
  notificationExpiringBatches: string;
  notificationExpiredBatches: string;
  notificationLowStock: string;
  notificationOverduePayables: string;
  notificationOverdueReceivables: string;
  notificationLicenseExpiring: string;
  sidebarCollapse: string;
  sidebarExpand: string;
  branchSingular: string;
  branchPlural: string;
  switchPharmacy: string;
  profileSettings: string;

  // Profile Settings page
  profilePageSubtitle: string;
  profileInfoSectionTitle: string;
  profileInfoSectionDesc: string;
  profileNameLabel: string;
  profileNamePlaceholder: string;
  profileNameRequired: string;
  profileEmailLabel: string;
  profileEmailHint: string;
  profilePhoneLabel: string;
  profilePhonePlaceholder: string;
  profileAddressLabel: string;
  profileAddressPlaceholder: string;
  profileSaveChanges: string;
  profileSaving: string;
  profileUpdateSuccess: string;
  profileMustChangePasswordBanner: string;
  profilePasswordSectionTitle: string;
  profilePasswordSectionDesc: string;
  profileCurrentPasswordLabel: string;
  profileNewPasswordLabel: string;
  profileNewPasswordHint: string;
  profileConfirmPasswordLabel: string;
  profileCurrentPasswordRequired: string;
  profileNewPasswordMinLength: string;
  profileNewPasswordUppercase: string;
  profileNewPasswordNumber: string;
  profilePasswordMismatch: string;
  profileChangePasswordButton: string;
  profileChangingPassword: string;
  profilePasswordChangeSuccess: string;
  profilePlacementSectionTitle: string;
  profilePlacementPharmacyLabel: string;
  profilePlacementRoleLabel: string;
  profilePlacementJoinedLabel: string;
  profilePlacementLicenseLabel: string;
  profilePlacementNone: string;

  // Distributors page
  distributorsSubtitle: string;
  distributorAdd: string;
  distributorEdit: string;
  distributorDelete: string;
  distributorName: string;
  distributorNamePlaceholder: string;
  distributorContactPerson: string;
  distributorContactPersonPlaceholder: string;
  distributorPhone: string;
  distributorPhonePlaceholder: string;
  distributorEmail: string;
  distributorEmailPlaceholder: string;
  distributorAddress: string;
  distributorAddressPlaceholder: string;
  distributorDeleteConfirmTitle: string;
  distributorDeleteConfirmDesc: string;
  distributorEmptyTitle: string;
  distributorEmptyDesc: string;
  distributorSave: string;
  distributorSaving: string;
  distributorDeleting: string;
  distributorNameRequired: string;
  distributorPhoneRequired: string;
  distributorAddressRequired: string;
  distributorEmailInvalid: string;
  distributorSearchPlaceholder: string;
  distributorNoResults: string;
  distributorTotal: string;
  distributorSingular: string;
  distributorPlural: string;
  distributorDetails: string;
  distributorDetailsTitle: string;
  distributorRegistered: string;
  distributorUpdated: string;
  distributorPermitNumber: string;
  distributorPermitNumberPlaceholder: string;
  distributorNotes: string;
  distributorNotesPlaceholder: string;
  distributorCreateSuccess: string;
  distributorUpdateSuccess: string;
  distributorDeleteSuccess: string;

  // Patients
  patientsSubtitle: string;
  patientAdd: string;
  patientEdit: string;
  patientDelete: string;
  patientDetails: string;
  patientDetailsTitle: string;
  patientSave: string;
  patientSaving: string;
  patientDeleting: string;
  patientName: string;
  patientNamePlaceholder: string;
  patientNameRequired: string;
  patientPhone: string;
  patientPhonePlaceholder: string;
  patientAddress: string;
  patientAddressPlaceholder: string;
  patientDescription: string;
  patientDescriptionPlaceholder: string;
  patientStatusLabel: string;
  patientStatusActive: string;
  patientStatusInactive: string;
  patientIsWalkIn: string;
  patientWalkInBadge: string;
  patientWalkInRegular: string;
  patientSearchPlaceholder: string;
  patientNoResults: string;
  patientEmptyTitle: string;
  patientEmptyDesc: string;
  patientDeleteConfirmTitle: string;
  patientDeleteConfirmDesc: string;
  patientTotal: string;
  patientSingular: string;
  patientPlural: string;
  patientCreateSuccess: string;
  patientUpdateSuccess: string;
  patientDeleteSuccess: string;
  patientFilterStatus: string;
  patientFilterIsWalkIn: string;
  patientFilterPartyType: string;
  patientPartyTypePatient: string;
  patientPartyTypeProfessional: string;
  patientNik: string;
  patientNikPlaceholder: string;
  patientGender: string;
  patientGenderMale: string;
  patientGenderFemale: string;
  patientDateOfBirth: string;
  patientBpjsNumber: string;
  patientBpjsNumberPlaceholder: string;
  patientMedicalRecordNumber: string;
  patientMedicalRecordNumberPlaceholder: string;
  patientDetailSectionTitle: string;

  // Customers
  customersSubtitle: string;
  customerAdd: string;
  customerEdit: string;
  customerDelete: string;
  customerDetails: string;
  customerDetailsTitle: string;
  customerSave: string;
  customerSaving: string;
  customerDeleting: string;
  customerSearchPlaceholder: string;
  customerNoResults: string;
  customerEmptyTitle: string;
  customerEmptyDesc: string;
  customerDeleteConfirmTitle: string;
  customerDeleteConfirmDesc: string;
  customerCreateSuccess: string;
  customerUpdateSuccess: string;
  customerDeleteSuccess: string;
  customerFilterStatus: string;
  customerFilterIsWalkIn: string;
  customerFilterType: string;
  customerTypePatient: string;
  customerTypeProfessional: string;
  customerMedicalRecordNumber: string;
  professionalStrNumber: string;
  professionalStrNumberPlaceholder: string;
  professionalSipNumber: string;
  professionalSipNumberPlaceholder: string;
  professionalProfession: string;
  professionalProfessionPlaceholder: string;
  professionalDetailSectionTitle: string;

  // Medical Records
  navMedicalRecords: string;
  medicalRecordsSubtitle: string;
  medicalRecordTitle: string;
  medicalRecordNumber: string;
  medicalRecordBloodType: string;
  medicalRecordBloodTypePlaceholder: string;
  medicalRecordEmergencyContact: string;
  medicalRecordEmergencyContactName: string;
  medicalRecordEmergencyContactNamePlaceholder: string;
  medicalRecordEmergencyContactPhone: string;
  medicalRecordEmergencyContactPhonePlaceholder: string;
  medicalRecordEdit: string;
  medicalRecordSave: string;
  medicalRecordSaving: string;
  medicalRecordUpdateSuccess: string;
  medicalRecordPatientSearchPlaceholder: string;
  medicalRecordSelectPatient: string;
  medicalRecordNoPatientSelected: string;
  medicalRecordNoPatientSelectedDesc: string;
  medicalRecordNotFoundTitle: string;
  medicalRecordNotFoundDesc: string;
  medicalRecordOverviewTab: string;
  medicalRecordAllergiesTab: string;
  medicalRecordAllergiesMore: string;
  medicalRecordVisitsTab: string;
  // Allergies
  medicalRecordAllergyAdd: string;
  medicalRecordAllergyDelete: string;
  medicalRecordAllergyDeleting: string;
  medicalRecordAllergyDeleteSuccess: string;
  medicalRecordAllergyAddSuccess: string;
  medicalRecordAllergyNoData: string;
  medicalRecordAllergyName: string;
  medicalRecordAllergyNamePlaceholder: string;
  medicalRecordAllergyNameRequired: string;
  medicalRecordAllergyType: string;
  medicalRecordAllergyTypeRequired: string;
  medicalRecordAllergyTypeMedicine: string;
  medicalRecordAllergyTypeFood: string;
  medicalRecordAllergyTypeEnvironment: string;
  medicalRecordAllergyTypeOther: string;
  medicalRecordAllergyReaction: string;
  medicalRecordAllergyReactionPlaceholder: string;
  medicalRecordAllergySeverity: string;
  medicalRecordAllergySeverityRequired: string;
  medicalRecordAllergySeverityMild: string;
  medicalRecordAllergySeverityModerate: string;
  medicalRecordAllergySeveritySevere: string;
  medicalRecordAllergyNotes: string;
  medicalRecordAllergyNotesPlaceholder: string;
  medicalRecordAllergyDeleteConfirmTitle: string;
  medicalRecordAllergyDeleteConfirmDesc: string;
  // Visits
  medicalRecordVisitAdd: string;
  medicalRecordVisitEdit: string;
  medicalRecordVisitDelete: string;
  medicalRecordVisitDeleting: string;
  medicalRecordVisitDeleteSuccess: string;
  medicalRecordVisitAddSuccess: string;
  medicalRecordVisitUpdateSuccess: string;
  medicalRecordVisitNoData: string;
  medicalRecordVisitDate: string;
  medicalRecordVisitDateRequired: string;
  medicalRecordVisitChiefComplaint: string;
  medicalRecordVisitChiefComplaintPlaceholder: string;
  medicalRecordVisitDiagnosis: string;
  medicalRecordVisitDiagnosisPlaceholder: string;
  medicalRecordVisitNotes: string;
  medicalRecordVisitNotesPlaceholder: string;
  medicalRecordVisitVitals: string;
  medicalRecordVisitWeight: string;
  medicalRecordVisitWeightPlaceholder: string;
  medicalRecordVisitHeight: string;
  medicalRecordVisitHeightPlaceholder: string;
  medicalRecordVisitBloodPressure: string;
  medicalRecordVisitBloodPressurePlaceholder: string;
  medicalRecordVisitTemperature: string;
  medicalRecordVisitTemperaturePlaceholder: string;
  medicalRecordVisitPulse: string;
  medicalRecordVisitPulsePlaceholder: string;
  medicalRecordVisitDoctor: string;
  medicalRecordVisitDoctorPlaceholder: string;
  medicalRecordVisitPrescription: string;
  medicalRecordVisitPrescriptionPlaceholder: string;
  medicalRecordVisitDeleteConfirmTitle: string;
  medicalRecordVisitDeleteConfirmDesc: string;
  medicalRecordVisitSave: string;
  medicalRecordVisitSaving: string;
  medicalRecordVisitDetails: string;

  // Doctors page
  navDoctors: string;
  doctorsSubtitle: string;
  doctorAdd: string;
  doctorEdit: string;
  doctorDelete: string;
  doctorDetails: string;
  doctorDetailsTitle: string;
  doctorSave: string;
  doctorSaving: string;
  doctorDeleting: string;
  doctorName: string;
  doctorNamePlaceholder: string;
  doctorNameRequired: string;
  doctorLicenseNumber: string;
  doctorLicenseNumberPlaceholder: string;
  doctorSpecialty: string;
  doctorSpecialtyPlaceholder: string;
  doctorClinicName: string;
  doctorClinicNamePlaceholder: string;
  doctorPhone: string;
  doctorPhonePlaceholder: string;
  doctorStatusLabel: string;
  doctorStatusActive: string;
  doctorStatusInactive: string;
  doctorFilterStatus: string;
  doctorSearchPlaceholder: string;
  doctorNoResults: string;
  doctorEmptyTitle: string;
  doctorEmptyDesc: string;
  doctorDeleteConfirmTitle: string;
  doctorDeleteConfirmDesc: string;
  doctorTotal: string;
  doctorSingular: string;
  doctorPlural: string;
  doctorRegistered: string;
  doctorUpdated: string;
  doctorCreateSuccess: string;
  doctorUpdateSuccess: string;
  doctorDeleteSuccess: string;
  doctorLinkedUser: string;

  // Prescriptions page
  prescriptionsSubtitle: string;
  prescriptionAdd: string;
  prescriptionEdit: string;
  prescriptionDelete: string;
  prescriptionDetails: string;
  prescriptionDetailsTitle: string;
  prescriptionSave: string;
  prescriptionSaving: string;
  prescriptionDeleting: string;
  prescriptionNumber: string;
  prescriptionNumberPlaceholder: string;
  prescriptionPrescribedAt: string;
  prescriptionNotes: string;
  prescriptionNotesPlaceholder: string;
  prescriptionPatient: string;
  prescriptionPatientPlaceholder: string;
  prescriptionPatientRequired: string;
  prescriptionDoctor: string;
  prescriptionDoctorPlaceholder: string;
  prescriptionStatusLabel: string;
  prescriptionStatusPending: string;
  prescriptionStatusDispensed: string;
  prescriptionStatusPartial: string;
  prescriptionStatusCancelled: string;
  prescriptionStatusExpired: string;
  prescriptionFilterStatus: string;
  prescriptionSearchPlaceholder: string;
  prescriptionNoResults: string;
  prescriptionEmptyTitle: string;
  prescriptionEmptyDesc: string;
  prescriptionDeleteConfirmTitle: string;
  prescriptionDeleteConfirmDesc: string;
  prescriptionTotal: string;
  prescriptionSingular: string;
  prescriptionPlural: string;
  prescriptionCreateSuccess: string;
  prescriptionUpdateSuccess: string;
  prescriptionDeleteSuccess: string;
  prescriptionAllTab: string;
  prescriptionQueueTab: string;
  prescriptionQueueTitle: string;
  prescriptionQueueEmpty: string;
  prescriptionQueueEmptyDesc: string;
  prescriptionLinkedSale: string;
  prescriptionItemsLabel: string;
  prescriptionItemAdd: string;
  prescriptionItemRemove: string;
  prescriptionItemMedicine: string;
  prescriptionItemMedicinePlaceholder: string;
  prescriptionItemMedicineRequired: string;
  prescriptionItemQty: string;
  prescriptionItemQtyRequired: string;
  prescriptionItemFrequency: string;
  prescriptionItemFrequencyPlaceholder: string;
  prescriptionItemDuration: string;
  prescriptionItemDurationPlaceholder: string;
  prescriptionItemNotes: string;
  prescriptionItemNotesPlaceholder: string;
  prescriptionItemDispensedOf: string;
  prescriptionDispense: string;
  prescriptionDispenseTitle: string;
  prescriptionDispensing: string;
  prescriptionDispenseSuccess: string;
  prescriptionCancel: string;
  prescriptionCancelConfirmTitle: string;
  prescriptionCancelConfirmDesc: string;
  prescriptionCancelling: string;
  prescriptionCancelSuccess: string;
  prescriptionDispenseStockBatch: string;
  prescriptionDispenseQty: string;
  prescriptionDispenseSellingPrice: string;
  prescriptionDispenseOriginalPrice: string;
  prescriptionDispenseSaleType: string;
  prescriptionDispensePaymentMethod: string;
  prescriptionDispenseGrandTotal: string;
  prescriptionDispenseTotalAmount: string;
  prescriptionDispenseStepItems: string;
  prescriptionDispenseStepPayment: string;
  prescriptionDispenseNext: string;
  prescriptionDispenseBack: string;
  prescriptionSaleTypeCash: string;
  prescriptionSaleTypeCredit: string;
  prescriptionPaymentCash: string;
  prescriptionPaymentTransfer: string;
  prescriptionPaymentDebit: string;
  prescriptionPaymentCreditCard: string;
  prescriptionPaymentQris: string;

  // Session expired
  sessionExpiredTitle: string;
  sessionExpiredDesc: string;

  // Login success
  loginSuccessTitle: string;
  loginSuccessDesc: string;
  loginSuccessDirectDesc: string;

  // Logout success
  logoutSuccessTitle: string;
  logoutSuccessDesc: string;

  // Pharmacy context lost (403 PHARMACY_NOT_SELECTED)
  pharmacyContextLostTitle: string;
  pharmacyContextLostDesc: string;

  // Server unavailable
  serverDownTitle: string;
  serverDownDesc: string;
  serverDownRetry: string;

  // Generic
  useValue: string;
  add: string;
  created: string;
  lastUpdated: string;
  cancel: string;
  save: string;
  deleteConfirm: string;
  showing: string;
  of: string;
  rowsPerPage: string;
  referenceStatusColumn: string;
  referenceStatusAll: string;
  referenceStatusActive: string;
  referenceStatusInactive: string;
  name: string;
  description: string;

  // Nav — medicine master data
  navMedicineClassification: string;
  navMedicineShapes: string;
  navMedicineTypes: string;
  navMedicineClasses: string;

  // Nav — parameters
  navBusinessParameters: string;
  navSystemParameters: string;
  navBackgroundJobs: string;
  jobsSubtitle: string;
  jobsRunNow: string;
  jobsLastRun: string;
  jobsNeverRun: string;
  jobsDailyAt: string;
  jobsSettings: string;
  jobsSettingsTitle: string;
  jobsEnabled: string;
  jobsEnabledHint: string;
  jobsTime: string;
  jobsTimeHint: string;
  jobsOff: string;
  jobsDefaultValue: string;
  jobsPharmacyParams: string;
  jobsPharmacyParamsHint: string;
  jobsSettingsSaved: string;
  jobsParamNotificationRetention: string;
  jobsParamJobRunRetention: string;
  jobsHistory: string;
  jobsAllJobs: string;
  jobsColJob: string;
  jobsColStatus: string;
  jobsColStarted: string;
  jobsColDuration: string;
  jobsColAffected: string;
  jobsColTrigger: string;
  jobsNoRuns: string;
  jobsStatusRunning: string;
  jobsStatusSuccess: string;
  jobsStatusFailed: string;
  jobsStatusSkipped: string;
  jobsTriggerSchedule: string;
  jobsTriggerManual: string;
  jobsConfirmTitle: string;
  jobsConfirmDesc: string;
  jobsRunDone: string;
  jobsRunSkippedMsg: string;
  jobsRunFailedMsg: string;
  jobNameCancelHeldSales: string;
  jobDescCancelHeldSales: string;
  jobNameExpirePrescriptions: string;
  jobDescExpirePrescriptions: string;
  jobNamePurgeExpired: string;
  jobDescPurgeExpired: string;
  jobNameDailyAlerts: string;
  jobDescDailyAlerts: string;
  navPharmacyList: string;

  // Parameters shared
  paramKey: string;
  paramValue: string;
  paramDescription: string;
  paramRegistered: string;
  paramUpdated: string;
  paramEdit: string;
  paramDetails: string;
  paramDetailsTitle: string;
  paramSave: string;
  paramSaving: string;
  paramValueRequired: string;
  paramSearchPlaceholder: string;
  paramNoResults: string;
  paramTotal: string;
  paramSingular: string;
  paramPlural: string;
  paramUpdateSuccess: string;
  paramValuePlaceholder: string;
  paramDescriptionPlaceholder: string;
  paramEmptyTitle: string;
  paramEmptyDesc: string;

  // Business parameters page
  businessParamSubtitle: string;

  // System parameters page
  systemParamSubtitle: string;

  // Medicine Classification page
  medicineClassificationSubtitle: string;

  // Medicine Shapes page
  medicineShapesSubtitle: string;
  medicineShapeAdd: string;
  medicineShapeEdit: string;
  medicineShapeDelete: string;
  medicineShapeName: string;
  medicineShapeNamePlaceholder: string;
  medicineShapeDescription: string;
  medicineShapeDescriptionPlaceholder: string;
  medicineShapeNameRequired: string;
  medicineShapeTotal: string;
  medicineShapeSingular: string;
  medicineShapePlural: string;
  medicineShapeSearchPlaceholder: string;
  medicineShapeNoResults: string;
  medicineShapeEmptyTitle: string;
  medicineShapeEmptyDesc: string;
  medicineShapeDetailsTitle: string;
  medicineShapeDetails: string;
  medicineShapeDeleteConfirmTitle: string;
  medicineShapeDeleteConfirmDesc: string;
  medicineShapeSave: string;
  medicineShapeSaving: string;
  medicineShapeDeleting: string;
  medicineShapeRegistered: string;
  medicineShapeUpdated: string;
  medicineShapeCreateSuccess: string;
  medicineShapeUpdateSuccess: string;
  medicineShapeDeleteSuccess: string;

  // Medicine Types page
  medicineTypesSubtitle: string;
  medicineTypeAdd: string;
  medicineTypeEdit: string;
  medicineTypeDelete: string;
  medicineTypeName: string;
  medicineTypeNamePlaceholder: string;
  medicineTypeDescription: string;
  medicineTypeDescriptionPlaceholder: string;
  medicineTypeNameRequired: string;
  medicineTypeTotal: string;
  medicineTypeSingular: string;
  medicineTypePlural: string;
  medicineTypeSearchPlaceholder: string;
  medicineTypeNoResults: string;
  medicineTypeEmptyTitle: string;
  medicineTypeEmptyDesc: string;
  medicineTypeDetailsTitle: string;
  medicineTypeDetails: string;
  medicineTypeDeleteConfirmTitle: string;
  medicineTypeDeleteConfirmDesc: string;
  medicineTypeSave: string;
  medicineTypeSaving: string;
  medicineTypeDeleting: string;
  medicineTypeRegistered: string;
  medicineTypeUpdated: string;
  medicineTypeCreateSuccess: string;
  medicineTypeUpdateSuccess: string;
  medicineTypeDeleteSuccess: string;
  medicineTypeRequiredPrescription: string;
  medicineTypeRequiredPrescriptionYes: string;
  medicineTypeRequiredPrescriptionNo: string;

  // Medicine Classes page
  medicineClassesSubtitle: string;
  medicineClassAdd: string;
  medicineClassEdit: string;
  medicineClassDelete: string;
  medicineClassName: string;
  medicineClassNamePlaceholder: string;
  medicineClassDescription: string;
  medicineClassDescriptionPlaceholder: string;
  medicineClassNameRequired: string;
  medicineClassTotal: string;
  medicineClassSingular: string;
  medicineClassPlural: string;
  medicineClassSearchPlaceholder: string;
  medicineClassNoResults: string;
  medicineClassEmptyTitle: string;
  medicineClassEmptyDesc: string;
  medicineClassDetailsTitle: string;
  medicineClassDetails: string;
  medicineClassDeleteConfirmTitle: string;
  medicineClassDeleteConfirmDesc: string;
  medicineClassSave: string;
  medicineClassSaving: string;
  medicineClassDeleting: string;
  medicineClassRegistered: string;
  medicineClassUpdated: string;
  medicineClassCreateSuccess: string;
  medicineClassUpdateSuccess: string;
  medicineClassDeleteSuccess: string;

  // Medicines page
  medicinesSubtitle: string;
  medicineAdd: string;
  medicineEdit: string;
  medicineDelete: string;
  medicineName: string;
  medicineNamePlaceholder: string;
  medicineGenericName: string;
  medicineGenericNamePlaceholder: string;
  medicineBarcode: string;
  medicineBarcodePlaceholder: string;
  medicineShapeLabel: string;
  medicineTypeLabel: string;
  medicineClassLabel: string;
  medicineSelectShape: string;
  medicineSelectType: string;
  medicineSelectClass: string;
  medicineUnit: string;
  medicineUnitPlaceholder: string;
  medicineBarcodeGenerate: string;
  medicineBarcodeHint: string;
  medicineBarcodeInvalid: string;
  medicineSellingPrice: string;
  medicinePurchasePrice: string;
  medicineStock: string;
  medicineMinStock: string;
  medicineManufacturer: string;
  medicineManufacturerPlaceholder: string;
  medicineNotes: string;
  medicineNotesPlaceholder: string;
  medicineNameRequired: string;
  medicineShapeRequired: string;
  medicineTypeRequired: string;
  medicineClassRequired: string;
  medicineUnitRequired: string;
  medicineSellingPriceRequired: string;
  medicineTotal: string;
  medicineSingular: string;
  medicinePlural: string;
  medicineSearchPlaceholder: string;
  medicineNoResults: string;
  medicineEmptyTitle: string;
  medicineEmptyDesc: string;
  medicineDetailsTitle: string;
  medicineDetails: string;
  medicineDeleteConfirmTitle: string;
  medicineDeleteConfirmDesc: string;
  medicineSave: string;
  medicineSaving: string;
  medicineDeleting: string;
  medicineRegistered: string;
  medicineUpdated: string;
  medicineCreateSuccess: string;
  medicineUpdateSuccess: string;
  medicineDeleteSuccess: string;
  medicineLowStock: string;
  medicineIngredients: string;
  medicineIngredientPlaceholder: string;
  medicineIngredientAdd: string;
  medicineIngredientRemove: string;
  medicineIngredientsRequired: string;
  medicineStatusLabel: string;
  medicineStatusActive: string;
  medicineStatusInactive: string;

  // Users page (platform admin)
  navUsers: string;
  usersSubtitle: string;
  userName: string;
  userNamePlaceholder: string;
  userEmail: string;
  userEmailPlaceholder: string;
  userPhone: string;
  userPhonePlaceholder: string;
  userAddress: string;
  userAddressPlaceholder: string;
  userPlatformRole: string;
  userSelectRole: string;
  userStatus: string;
  userStatusActive: string;
  userStatusInactive: string;
  userStatusDeleted: string;
  platformRoleAdmin: string;
  platformRoleViewer: string;
  platformRoleSupport: string;
  userNameRequired: string;
  userEmailRequired: string;
  userEmailInvalid: string;
  userAdd: string;
  userEdit: string;
  userDelete: string;
  userDetails: string;
  userResetPassword: string;
  userDeleteConfirmTitle: string;
  userDeleteConfirmDesc: string;
  userResetPasswordConfirmTitle: string;
  userResetPasswordConfirmDesc: string;
  userSave: string;
  userSaving: string;
  userDeleting: string;
  userResettingPassword: string;
  userSearchPlaceholder: string;
  userNoResults: string;
  userEmptyTitle: string;
  userEmptyDesc: string;
  userTotal: string;
  userSingular: string;
  userPlural: string;
  userPlacementCount: string;
  userDetailsTitle: string;
  userRegistered: string;
  userUpdated: string;
  userCreateSuccess: string;
  userUpdateSuccess: string;
  userDeleteSuccess: string;
  userResetPasswordSuccess: string;

  // User creation wizard
  userCreate: string;
  userCreating: string;
  userWizardStep1: string;
  userWizardStep2: string;
  userWizardStep3: string;
  userWizardStep1Hint: string;
  userWizardStep2Hint: string;
  userWizardStep3Hint: string;
  wizardNext: string;
  wizardBack: string;
  wizardSkip: string;
  wizardDone: string;

  // Placements
  placementSectionTitle: string;
  placementAdd: string;
  placementWizardStep1: string;
  placementWizardStep2: string;
  placementWizardStep1Hint: string;
  placementWizardStep2Hint: string;
  placementEdit: string;
  placementDelete: string;
  placementPharmacy: string;
  placementSelectPharmacy: string;
  placementRole: string;
  placementSelectRole: string;
  placementJoinedAt: string;
  placementLeftAt: string;
  placementStatus: string;
  placementEmptyTitle: string;
  placementEmptyDesc: string;
  placementDeleteConfirmTitle: string;
  placementDeleteConfirmDesc: string;
  placementSave: string;
  placementSaving: string;
  placementDeleting: string;
  placementCreateSuccess: string;
  placementUpdateSuccess: string;
  placementDeleteSuccess: string;
  placementPharmacyRequired: string;
  placementRoleRequired: string;
  placementJoinedAtRequired: string;
  placementLeftAtAfterJoinedAt: string;
  placementPresent: string;

  // Licenses
  licenseAdd: string;
  licenseEdit: string;
  licenseDelete: string;
  licenseNumber: string;
  licenseNumberPlaceholder: string;
  licenseValidFrom: string;
  licenseValidUntil: string;
  licenseStatus: string;
  licenseDeleteConfirmTitle: string;
  licenseDeleteConfirmDesc: string;
  licenseSave: string;
  licenseSaving: string;
  licenseDeleting: string;
  licenseCreateSuccess: string;
  licenseUpdateSuccess: string;
  licenseDeleteSuccess: string;
  licenseNumberRequired: string;
  licenseValidFromRequired: string;
  licenseValidUntilRequired: string;
  licenseValidUntilAfterFrom: string;
  licenseActiveBadge: string;
  licenseNoLicense: string;
  licenseHistory: string;
  licenseHistoryEmpty: string;

  // Pharmacies page (platform admin)
  navPharmacies: string;
  pharmaciesSubtitle: string;
  pharmaName: string;
  pharmaNamePlaceholder: string;
  pharmaCode: string;
  pharmaCodePlaceholder: string;
  pharmaCodeInvalid: string;
  pharmaCategory: string;
  pharmaSelectCategory: string;
  pharmaCategoryApotek: string;
  pharmaCategoryKlinik: string;
  pharmaCategoryRumahSakit: string;
  pharmaCategoryPuskesmas: string;
  pharmaPermitNumber: string;
  pharmaPermitNumberPlaceholder: string;
  pharmaPhone: string;
  pharmaPhonePlaceholder: string;
  pharmaAddress: string;
  pharmaAddressPlaceholder: string;
  pharmaLocation: string;
  pharmaLocationPlaceholder: string;
  pharmaLocationRequired: string;
  pharmaEmail: string;
  pharmaEmailPlaceholder: string;
  pharmaStatus: string;
  pharmaStatusActive: string;
  pharmaStatusInactive: string;
  pharmaStatusDeleted: string;
  pharmaNameRequired: string;
  pharmaCategoryRequired: string;
  pharmaPhoneRequired: string;
  pharmaAddressRequired: string;
  pharmaPermitNumberRequired: string;
  pharmaAdd: string;
  pharmaEdit: string;
  pharmaDelete: string;
  pharmaDetails: string;
  pharmaDeleteConfirmTitle: string;
  pharmaDeleteConfirmDesc: string;
  pharmaSave: string;
  pharmaSaving: string;
  pharmaDeleting: string;
  pharmaSearchPlaceholder: string;
  pharmaNoResults: string;
  pharmaEmptyTitle: string;
  pharmaEmptyDesc: string;
  pharmaTotal: string;
  pharmaSingular: string;
  pharmaPlural: string;
  pharmaDetailsTitle: string;
  pharmaRegistered: string;
  pharmaUpdated: string;
  pharmaCreateSuccess: string;
  pharmaUpdateSuccess: string;
  pharmaDeleteSuccess: string;
  pharmaWizardStep1: string;
  pharmaWizardStep2: string;
  pharmaWizardStep3: string;
  pharmaWizardStep1Hint: string;
  pharmaWizardStep2Hint: string;
  pharmaWizardStep3Hint: string;
  placementUser: string;
  placementSelectUser: string;
  placementUserRequired: string;
  pharmaNoHeadPharmacist: string;
  pharmaNoHeadPharmacistHint: string;

  // Business license (SIA)
  bizLicenseTitle: string;
  bizLicenseDesc: string;
  bizLicenseNumber: string;
  bizLicenseNumberPlaceholder: string;
  bizLicenseValidFrom: string;
  bizLicenseValidUntil: string;
  bizLicenseNumberRequired: string;
  bizLicenseValidFromRequired: string;
  bizLicenseValidUntilRequired: string;
  bizLicenseValidUntilAfterFrom: string;

  // Roles page
  navRoles: string;
  rolesSubtitle: string;
  roleAdd: string;
  roleEdit: string;
  roleDelete: string;
  roleDetails: string;
  roleName: string;
  roleNamePlaceholder: string;
  roleType: string;
  roleSelectType: string;
  roleTypeOwner: string;
  roleTypeAdmin: string;
  roleTypePharmacist: string;
  roleTypeHeadPharmacist: string;
  roleTypeCashier: string;
  roleStatus: string;
  roleStatusAll: string;
  roleStatusActive: string;
  roleStatusInactive: string;
  roleStatusDeleted: string;
  roleIsGlobal: string;
  roleScopeAll: string;
  roleScopeGlobal: string;
  roleScopePharmacy: string;
  roleRequiresLicense: string;
  roleRequiresLicenseYes: string;
  roleRequiresLicenseNo: string;
  roleFilterType: string;
  roleFilterTypeAll: string;
  rolePermissionCount: string;
  roleNameRequired: string;
  roleTypeRequired: string;
  roleSearchPlaceholder: string;
  roleNoResults: string;
  roleEmptyTitle: string;
  roleEmptyDesc: string;
  roleDetailsTitle: string;
  roleDeleteConfirmTitle: string;
  roleDeleteConfirmDesc: string;
  roleSave: string;
  roleSaving: string;
  roleDeleting: string;
  roleRegistered: string;
  roleUpdated: string;
  roleCreateSuccess: string;
  roleUpdateSuccess: string;
  roleDeleteSuccess: string;
  roleManagePermissions: string;
  rolePermissionsTitle: string;
  rolePermissionsDesc: string;
  rolePermissionsSave: string;
  rolePermissionsSaving: string;
  rolePermissionsSuccess: string;
  rolePermissionsNone: string;
  rolePermissionsSelectAll: string;
  rolePermissionsDeselectAll: string;
  rolePermissionsSearchPlaceholder: string;
  rolePermissionsNoResults: string;

  // Purchase Orders page
  poSubtitle: string;
  poAdd: string;
  poEdit: string;
  poDelete: string;
  poDetails: string;
  poCancel: string;
  poSubmit: string;
  poOrderNumber: string;
  poDistributor: string;
  poSelectDistributor: string;
  poDistributorRequired: string;
  poSignedBy: string;
  poSelectSignedBy: string;
  poDescription: string;
  poDescriptionPlaceholder: string;
  poCancellationReason: string;
  poCancellationReasonPlaceholder: string;
  poCancellationReasonRequired: string;
  poStatus: string;
  poStatusDraft: string;
  poStatusSent: string;
  poStatusCompleted: string;
  poStatusCancelled: string;
  poItemsSection: string;
  poItemMedicine: string;
  poItemSelectMedicine: string;
  poItemMedicineRequired: string;
  poItemQuantity: string;
  poItemQuantityRequired: string;
  poItemUnit: string;
  poItemUnitRequired: string;
  poItemDescription: string;
  poItemDescriptionPlaceholder: string;
  poItemAdd: string;
  poItemRemove: string;
  poItemsRequired: string;
  poItemCount: string;
  poTotal: string;
  poSingular: string;
  poPlural: string;
  poSearchPlaceholder: string;
  poNoResults: string;
  poEmptyTitle: string;
  poEmptyDesc: string;
  poDetailsTitle: string;
  poDeleteConfirmTitle: string;
  poDeleteConfirmDesc: string;
  poCancelConfirmTitle: string;
  poCancelConfirmDesc: string;
  poSubmitConfirmTitle: string;
  poSubmitConfirmDesc: string;
  poSave: string;
  poSaving: string;
  poDeleting: string;
  poCancelling: string;
  poSubmitting: string;
  poRegistered: string;
  poUpdated: string;
  poOrderedAt: string;
  poCreateSuccess: string;
  poUpdateSuccess: string;
  poDeleteSuccess: string;
  poCancelSuccess: string;
  poSubmitSuccess: string;
  poCompleteSuccess: string;
  poDateFrom: string;
  poDateTo: string;
  poFilterStatus: string;
  poFilterDistributor: string;
  poRepurchase: string;
  poPrint: string;
  poReprint: string;
  poPrinting: string;
  poPrintReceipt: string;
  poReceiptTitle: string;
  poReceiptPraktikApoteker: string;
  poReceiptKepada: string;
  poReceiptTotalItems: string;
  poReceiptPenanggungJawab: string;
  poMarkReceived: string;
  poMarkReceivedConfirmTitle: string;
  poMarkReceivedConfirmDesc: string;
  poMarkingReceived: string;

  // Inventory / Stock page
  stockSubtitle: string;
  stockSearchPlaceholder: string;
  stockNoResults: string;
  stockEmptyTitle: string;
  stockEmptyDesc: string;
  stockMedicineName: string;
  stockTotalPieces: string;
  stockReorderLevel: string;
  stockEffectivePrice: string;
  stockBasePrice: string;
  stockCalculatedPrice: string;
  stockDetails: string;
  stockDetailsTitle: string;
  stockBatchSection: string;
  stockBatchNumber: string;
  stockBarcode: string;
  stockExpiryDate: string;
  stockQtyPieces: string;
  stockQtyBox: string;
  stockQtyPerBox: string;
  stockDistributor: string;
  stockUpdated: string;
  stockSingular: string;
  stockPlural: string;
  stockTotal: string;
  stockStatusNormal: string;
  stockStatusLow: string;
  stockStatusCritical: string;
  stockFilterStatus: string;
  stockFilterLowStock: string;
  stockFilterExpiringSoon: string;
  stockManualPriceNote: string;
  stockAdjust: string;
  stockAdjustTitle: string;
  stockAdjustNewQty: string;
  stockAdjustNewQtyPlaceholder: string;
  stockAdjustNewQtyRequired: string;
  stockAdjustCurrentQty: string;
  stockAdjustDescription: string;
  stockAdjustDescriptionPlaceholder: string;
  stockAdjustDescriptionRequired: string;
  stockAdjustSignedBy: string;
  stockAdjustSelectSignedBy: string;
  stockAdjustSignedByRequired: string;
  stockAdjustSave: string;
  stockAdjustSaving: string;
  stockAdjustSuccess: string;
  stockUpdatePrice: string;
  stockUpdatePriceTitle: string;
  stockSellingPriceLabel: string;
  stockSellingPricePlaceholder: string;
  stockClearPriceHint: string;
  stockUpdatePriceSave: string;
  stockUpdatePriceSaving: string;
  stockUpdatePriceSuccess: string;
  stockUpdateReorder: string;
  stockUpdateReorderTitle: string;
  stockReorderLevelLabel: string;
  stockReorderLevelPlaceholder: string;
  stockReorderLevelRequired: string;
  stockUpdateReorderSave: string;
  stockUpdateReorderSaving: string;
  stockUpdateReorderSuccess: string;
  stockDispose: string;
  stockReturn: string;
  stockPrint: string;
  printTitle: string;
  printBatchLabel: string;
  printMedicineLabel: string;
  printStockCard: string;
  printBatchLabelHint: string;
  printMedicineLabelHint: string;
  printStockCardHint: string;
  printNoMedicineBarcode: string;
  printSize: string;
  printSizeThermal5030: string;
  printSizeThermal3825: string;
  printSizeA4: string;
  printCopies: string;
  printShowPrice: string;
  printItemLabel: string;
  printItemLabelHint: string;
  printFields: string;
  printShowStock: string;
  printShowTotalStock: string;
  printShowExpiry: string;
  printShowContents: string;
  printStartNumber: string;
  labelTotalStock: string;
  labelContents: string;
  labelItem: string;
  labelBox: string;
  printPreview: string;
  printButton: string;
  printPopupBlocked: string;
  labelBatch: string;
  labelExpiry: string;
  labelStock: string;
  labelAllBatches: string;
  labelStockCard: string;
  labelPackaging: string;
  labelLocation: string;
  labelMinStock: string;
  labelDate: string;
  labelIn: string;
  labelOut: string;
  labelBalance: string;
  labelInitials: string;
  labelOpeningBalance: string;
  labelPrintedOn: string;
  labelPage: string;
  labelNotes: string;
  labelPeriod: string;
  labelSalesCount: string;
  labelAdjustmentsCount: string;
  labelBatchesInStock: string;
  navStockLabels: string;
  stockLabelsSubtitle: string;
  stockLabelsTabLabels: string;
  stockLabelsTabCard: string;
  stockLabelsSearch: string;
  stockLabelsSearchHint: string;
  stockLabelsNoResults: string;
  stockLabelsNoBatches: string;
  stockLabelsAdd: string;
  stockLabelsQueue: string;
  stockLabelsQueueEmpty: string;
  stockLabelsClear: string;
  stockLabelsRemove: string;
  stockLabelsTotal: string;
  stockLabelsPrintAll: string;
  stockLabelsSettings: string;
  stockLabelsLoading: string;
  stockLabelsSkippedNoBarcode: string;
  stockCardPickMedicine: string;
  stockCardFrom: string;
  stockCardTo: string;
  stockCardPickHint: string;
  stockCardEmptyPeriod: string;
  stockCardAfterPeriod: string;
  stockCardInvalidPeriod: string;

  // Stock Disposals page
  sdSubtitle: string;
  sdAdd: string;
  sdEdit: string;
  sdDetails: string;
  sdDelete: string;
  sdCancel: string;
  sdComplete: string;
  sdDetailsTitle: string;
  sdSave: string;
  sdSaving: string;
  sdDeleting: string;
  sdCancelling: string;
  sdCompleting: string;
  sdStatusDraft: string;
  sdStatusCompleted: string;
  sdStatusCancelled: string;
  sdReasonExpired: string;
  sdReasonDamaged: string;
  sdReasonContaminated: string;
  sdDisposalNumber: string;
  sdStatus: string;
  sdDisposedAt: string;
  sdSignedBy: string;
  sdSelectSignedBy: string;
  sdDescription: string;
  sdDescriptionPlaceholder: string;
  sdCancellationReason: string;
  sdCancellationReasonPlaceholder: string;
  sdCancellationReasonRequired: string;
  sdItemsSection: string;
  sdItemBatch: string;
  sdItemSelectBatch: string;
  sdItemQuantity: string;
  sdItemReason: string;
  sdItemSelectReason: string;
  sdItemAdd: string;
  sdItemBatchRequired: string;
  sdItemQuantityRequired: string;
  sdItemReasonRequired: string;
  sdItemsRequired: string;
  sdItemCount: string;
  sdSingular: string;
  sdPlural: string;
  sdSearchPlaceholder: string;
  sdNoResults: string;
  sdEmptyTitle: string;
  sdEmptyDesc: string;
  sdFilterStatus: string;
  sdDeleteConfirmTitle: string;
  sdDeleteConfirmDesc: string;
  sdCancelConfirmTitle: string;
  sdCancelConfirmDesc: string;
  sdCompleteConfirmTitle: string;
  sdCompleteConfirmDesc: string;
  sdCompleteNoSignerWarning: string;
  sdCreateSuccess: string;
  sdUpdateSuccess: string;
  sdDeleteSuccess: string;
  sdCancelSuccess: string;
  sdCompleteSuccess: string;
  sdBatchLabel: string;
  sdExpiryLabel: string;

  // Sales History page
  salesSubtitle: string;
  saleNewSale: string;
  saleDetails: string;
  saleDetailsTitle: string;
  saleCancel: string;
  saleCancelling: string;
  saleRefund: string;
  saleRefunding: string;
  saleNumber: string;
  saleStatus: string;
  saleType: string;
  saleTypeCash: string;
  saleTypeCredit: string;
  saleStatusCompleted: string;
  saleStatusCancelled: string;
  saleStatusRefunded: string;
  saleStatusPending: string;
  salePatient: string;
  saleSoldAt: string;
  saleDueDate: string;
  saleDescription: string;
  saleTotalAmount: string;
  saleTaxAmount: string;
  salePaidAmount: string;
  saleRemaining: string;
  saleItemsSection: string;
  saleBatchLabel: string;
  saleDiscountLabel: string;
  saleSearchPlaceholder: string;
  saleNoResults: string;
  saleEmptyTitle: string;
  saleEmptyDesc: string;
  saleFilterStatus: string;
  saleFilterType: string;
  saleFilterPaymentStatus: string;
  saleFilterPatient: string;
  saleCancelConfirmTitle: string;
  saleCancelConfirmDesc: string;
  saleCancelReason: string;
  saleCancelReasonPlaceholder: string;
  saleCancelReasonRequired: string;
  saleCancelSuccess: string;
  saleRefundConfirmTitle: string;
  saleRefundConfirmDesc: string;
  saleRefundReason: string;
  saleRefundReasonPlaceholder: string;
  saleRefundReasonRequired: string;
  saleRefundSuccess: string;
  salePaymentStatusColumn: string;
  salePaymentStatusUnpaid: string;
  salePaymentStatusPartial: string;
  salePaymentStatusPaid: string;
  salePaymentMethodCash: string;
  salePaymentMethodTransfer: string;
  salePaymentMethodCredit: string;
  salePaymentHistorySection: string;
  salePaymentAdd: string;
  salePaymentAddSuccess: string;
  salePaymentMethodLabel: string;
  salePaymentAmountLabel: string;
  salePaymentAmountPlaceholder: string;
  salePaymentAmountRequired: string;
  salePaymentPayFull: string;
  salePaymentAfterLabel: string;
  salePaymentDateLabel: string;
  salePaymentDateRequired: string;
  salePaymentDescriptionLabel: string;
  salePaymentDescriptionPlaceholder: string;
  salePaymentSave: string;
  salePaymentSaving: string;
  saleComplete: string;
  saleCompleting: string;
  saleCompleteConfirmTitle: string;
  saleCompleteConfirmDesc: string;
  saleCompleteSuccess: string;
  salePrescriptionSection: string;
  salePrescriptionNumber: string;
  salePrescriptionDoctor: string;
  salePrescriptionDate: string;

  // Cashier / POS page
  posSubtitle: string;
  posSearchLabel: string;
  posSearchPlaceholder: string;
  posBatchLabel: string;
  posScanBarcode: string;
  posScanModalTitle: string;
  posScanInstructions: string;
  posScanNotFound: string;
  posScanCameraError: string;
  posCategoryAll: string;
  posProductsCountLabel: string;
  posStockLabel: string;
  posStockRemainingLabel: string;
  posOutOfStock: string;
  posNoProductsTitle: string;
  posNoProductsDesc: string;
  posLoadMore: string;
  posTransactionLabel: string;
  posReset: string;
  posSelectPatient: string;
  posAddNote: string;
  posHold: string;
  posHolding: string;
  posHoldSuccess: string;
  posHeldSalesBtn: string;
  posHeldSalesTitle: string;
  posHeldSalesEmpty: string;
  posHeldSalesResume: string;
  posHeldSalesResuming: string;
  posHeldSalesResumeSuccess: string;
  posHeldSalesClearWarning: string;
  posHeldSalesContinue: string;
  posHeldSalesCancelHeld: string;
  posHeldSalesCancelSuccess: string;
  posHeldSalesCancelConfirmTitle: string;
  posHeldSalesCancelConfirmDesc: string;
  posCartSection: string;
  posCartEmptyTitle: string;
  posCartEmptyDesc: string;
  posPatientLabel: string;
  posWalkInPatient: string;
  posPrescriptionLabel: string;
  posPrescriptionPlaceholder: string;
  posPrescriptionOptional: string;
  posRxNoPrescriptionWarning: string;
  posRxNoPatientWarning: string;
  posCreatePrescriptionButton: string;
  posCreatePrescriptionTitle: string;
  posCreatePrescriptionRequiresPatient: string;
  posCreatePrescriptionSuccess: string;
  posCreatePrescriptionSave: string;
  posSaleTypeLabel: string;
  posCreditRequiresPatient: string;
  posDescriptionLabel: string;
  posDescriptionPlaceholder: string;
  posSubtotal: string;
  posTaxNote: string;
  posCheckout: string;
  posProcessing: string;
  posStockInsufficient: string;
  posStockAvailable: string;
  posStockExceededItems: string;
  posSaleSuccessTitle: string;
  posNewSale: string;
  posPayLabel: string;
  posSelectPaymentMethod: string;
  posMethodSectionLabel: string;
  posPaymentMethodCard: string;
  posPaymentMethodCardDesc: string;
  posPaymentMethodCash: string;
  posPaymentMethodCashDesc: string;
  posPaymentMethodCredit: string;
  posPaymentMethodCreditDesc: string;
  posDownPaymentLabel: string;
  posRemainingLabel: string;
  posSummaryLabel: string;
  posPaymentCancel: string;
  posAcceptCash: string;
  posAcceptCard: string;
  posAcceptCredit: string;
  posReceiptSubtitle: string;
  posReceiptLabel: string;
  posReceiptDateLabel: string;
  posReceiptCashierLabel: string;
  posDiscountLabel: string;
  posViaLabel: string;
  posChangeLabel: string;
  posPrintReceipt: string;
  posPrintInvoice: string;
  saleDocPayment: string;
  saleDocThankYouVisit: string;
  saleDocInvoiceTitle: string;
  saleDocBilledTo: string;
  saleDocPaymentMethod: string;
  saleDocItemDescription: string;
  saleDocItemQty: string;
  saleDocItemPrice: string;
  saleDocItemAmount: string;
  saleDocThankYouTrust: string;
  saleDocQuestions: string;

  // Stock Returns page
  navStockReturns: string;
  srSubtitle: string;
  srAdd: string;
  srEdit: string;
  srDetails: string;
  srDelete: string;
  srCancel: string;
  srReject: string;
  srComplete: string;
  srDetailsTitle: string;
  srSave: string;
  srSaving: string;
  srDeleting: string;
  srCancelling: string;
  srRejecting: string;
  srCompleting: string;
  srStatusInProgress: string;
  srStatusCompleted: string;
  srStatusCancelled: string;
  srStatusRejected: string;
  srReturnNumber: string;
  srStatus: string;
  srReturnedAt: string;
  srDistributor: string;
  srSelectDistributor: string;
  srDistributorRequired: string;
  srSignedBy: string;
  srSelectSignedBy: string;
  srReason: string;
  srReasonPlaceholder: string;
  srDescription: string;
  srDescriptionPlaceholder: string;
  srCancellationReason: string;
  srCancellationReasonPlaceholder: string;
  srCancellationReasonRequired: string;
  srRejectionReason: string;
  srRejectionReasonPlaceholder: string;
  srRejectionReasonRequired: string;
  srItemsSection: string;
  srItemBatch: string;
  srItemSelectBatch: string;
  srItemQuantity: string;
  srItemReason: string;
  srItemReasonPlaceholder: string;
  srItemAdd: string;
  srItemBatchRequired: string;
  srItemQuantityRequired: string;
  srItemsRequired: string;
  srItemCount: string;
  srSingular: string;
  srPlural: string;
  srSearchPlaceholder: string;
  srNoResults: string;
  srEmptyTitle: string;
  srEmptyDesc: string;
  srFilterStatus: string;
  srFilterDistributor: string;
  srDeleteConfirmTitle: string;
  srDeleteConfirmDesc: string;
  srCancelConfirmTitle: string;
  srCancelConfirmDesc: string;
  srRejectConfirmTitle: string;
  srRejectConfirmDesc: string;
  srCompleteConfirmTitle: string;
  srCompleteConfirmDesc: string;
  srCompleteNoSignerWarning: string;
  srCreateSuccess: string;
  srUpdateSuccess: string;
  srDeleteSuccess: string;
  srCancelSuccess: string;
  srRejectSuccess: string;
  srCompleteSuccess: string;
  srBatchLabel: string;
  srExpiryLabel: string;
  srInvoiceLabel: string;
  srInvoice: string;
  srSearchInvoice: string;
  srSelectInvoice: string;
  srInvoiceRequired: string;
  srInvoiceItems: string;
  srReturnQty: string;
  srItemNoStock: string;
  srItemOutOfStock: string;
  srItemAvailable: string;
  srNoInvoiceSelected: string;
  srItemsCheckedRequired: string;
  srReturnQtyBox: string;
  srPricePerBox: string;
  srDiscountLabel: string;
  srEstimatedReturn: string;
  srTotalEstimated: string;
  srTotalAmount: string;
  sdMedicine: string;
  sdSelectMedicine: string;
  sdMedicineRequired: string;
  sdBarcodeOrBatch: string;
  sdBarcodePlaceholder: string;
  sdBarcodeNotFound: string;

  // Stock Movements page
  navStockMovements: string;
  smSubtitle: string;
  smType: string;
  smReason: string;
  smMedicine: string;
  smBatch: string;
  smQuantity: string;
  smQuantityBefore: string;
  smQuantityAfter: string;
  smReference: string;
  smCreatedBy: string;
  smDate: string;
  smTypeIn: string;
  smTypeOut: string;
  smReasonPurchase: string;
  smReasonSale: string;
  smReasonReturn: string;
  smReasonAdjustment: string;
  smReasonDisposal: string;
  smReasonDamaged: string;
  smReasonTransfer: string;
  smReasonDonation: string;
  smDetails: string;
  smDetailsTitle: string;
  smSearchPlaceholder: string;
  smNoResults: string;
  smEmptyTitle: string;
  smEmptyDesc: string;
  smFilterType: string;
  smFilterReason: string;
  smDescription: string;

  // Reports page
  reportsSubtitle: string;
  reportsSalesTab: string;
  reportsPurchaseTab: string;
  reportsInventoryTab: string;
  reportsStockMovementTab: string;
  reportsDisposalTab: string;
  reportsReturnsTab: string;
  reportSummaryTitle: string;
  reportNoData: string;
  reportDays: string;
  reportPeriodMonthly: string;
  reportPeriodCustom: string;
  reportDateFrom: string;
  reportDateTo: string;
  reportSalesTotalRevenue: string;
  reportSalesTotalSales: string;
  reportSalesAvgOrder: string;
  reportSalesPaymentBreakdown: string;
  reportSalesTopMedicines: string;
  reportSalesDailyRevenue: string;
  reportSalesMedicine: string;
  reportSalesQtyPieces: string;
  reportSalesRevenue: string;
  reportSalesDate: string;
  reportSalesTransactions: string;
  reportSalesMethod: string;
  reportSalesSaleNumber: string;
  reportSalesPatient: string;
  reportSalesSaleType: string;
  reportSalesStatus: string;
  reportSalesTotalAmount: string;
  reportSalesDiscountPct: string;
  reportSalesDiscountAmt: string;
  reportSalesPPN: string;
  reportSalesGrandTotal: string;
  reportSalesPaidAmount: string;
  reportSalesPaymentStatus: string;
  reportPurchaseTotalInvoices: string;
  reportPurchaseTotalAmount: string;
  reportPurchasePaidAmount: string;
  reportPurchaseUnpaidAmount: string;
  reportPurchaseByDistributor: string;
  reportPurchaseInvoiceList: string;
  reportPurchaseDistributor: string;
  reportPurchaseInvoiceCount: string;
  reportPurchaseInvoiceNumber: string;
  reportPurchaseDate: string;
  reportPurchasePONumber: string;
  reportPurchaseStatus: string;
  reportPurchaseFilterDistributor: string;
  reportInventoryTotalMedicines: string;
  reportInventoryStockValue: string;
  reportInventoryLowStockCount: string;
  reportInventoryExpiredCount: string;
  reportInventoryExpiringSoonCount: string;
  reportInventoryExpiryDays: string;
  reportInventoryStockLevels: string;
  reportInventoryLowStockSection: string;
  reportInventoryExpiringSoonSection: string;
  reportInventoryExpiredSection: string;
  reportInventoryMedicine: string;
  reportInventoryUnit: string;
  reportInventoryPieces: string;
  reportInventoryReorderLevel: string;
  reportInventoryBasePrice: string;
  reportInventorySellingPrice: string;
  reportInventoryStatus: string;
  reportInventoryBatch: string;
  reportInventoryExpiryDate: string;
  reportInventoryDaysLeft: string;
  reportInventoryDistributor: string;
  reportInventoryStatusLow: string;
  reportInventoryStatusNormal: string;
  reportSMTotalMovements: string;
  reportSMTotalIn: string;
  reportSMTotalOut: string;
  reportSMMovementList: string;
  reportSMMedicine: string;
  reportSMBatch: string;
  reportSMType: string;
  reportSMReason: string;
  reportSMQty: string;
  reportSMBefore: string;
  reportSMAfter: string;
  reportSMDate: string;
  reportSMReference: string;
  reportSMFilterType: string;
  reportSMFilterReason: string;
  reportDisposalTotalDisposals: string;
  reportDisposalTotalItems: string;
  reportDisposalTotalQty: string;
  reportDisposalByReason: string;
  reportDisposalList: string;
  reportDisposalNumber: string;
  reportDisposalDate: string;
  reportDisposalMedicine: string;
  reportDisposalBatch: string;
  reportDisposalQty: string;
  reportDisposalReason: string;
  reportDisposalStatus: string;
  reportDisposalCount: string;
  reportReturnTotalReturns: string;
  reportReturnTotalItems: string;
  reportReturnTotalQty: string;
  reportReturnByDistributor: string;
  reportReturnList: string;
  reportReturnNumber: string;
  reportReturnDate: string;
  reportReturnDistributor: string;
  reportReturnMedicine: string;
  reportReturnBatch: string;
  reportReturnQty: string;
  reportReturnReason: string;
  reportReturnStatus: string;
  reportReturnCount: string;
  reportReturnFilterDistributor: string;
  reportExport: string;
  reportExportCsv: string;
  reportExportExcel: string;

  // Invoices page
  invoicesSubtitle: string;
  invoiceAdd: string;
  invoiceDelete: string;
  invoiceDetails: string;
  invoiceNumber: string;
  invoiceNumberPlaceholder: string;
  invoiceNumberRequired: string;
  invoiceDate: string;
  invoiceDateRequired: string;
  invoiceDueDate: string;
  invoiceDistributor: string;
  invoiceSelectDistributor: string;
  invoiceDistributorRequired: string;
  invoicePurchaseOrder: string;
  invoiceSelectPurchaseOrder: string;
  invoiceSignedBy: string;
  invoiceSelectSignedBy: string;
  invoiceSignedByRequired: string;
  invoiceDescription: string;
  invoiceDescriptionPlaceholder: string;
  invoicePaymentStatus: string;
  invoicePaymentStatusUnpaid: string;
  invoicePaymentStatusPartial: string;
  invoicePaymentStatusPaid: string;
  invoiceTotalAmount: string;
  invoicePaidAmount: string;
  invoiceItemsSection: string;
  invoiceItemMedicine: string;
  invoiceItemSelectMedicine: string;
  invoiceItemMedicineRequired: string;
  invoiceItemBatchNumber: string;
  invoiceItemBatchNumberPlaceholder: string;
  invoiceItemBatchNumberRequired: string;
  invoiceItemExpiryDate: string;
  invoiceItemExpiryDateRequired: string;
  invoiceItemQtyBox: string;
  invoiceItemQtyBoxRequired: string;
  invoiceItemQtyPerBox: string;
  invoiceItemQtyPerBoxRequired: string;
  invoiceItemQtyPieces: string;
  invoiceItemQtyPiecesRequired: string;
  invoiceItemPrice: string;
  invoiceItemPriceRequired: string;
  invoiceItemDiscount: string;
  invoiceItemFinalPrice: string;
  invoiceItemTotal: string;
  invoiceItemAdd: string;
  invoiceItemsRequired: string;
  invoiceItemCount: string;
  invoiceSearchPlaceholder: string;
  invoiceNoResults: string;
  invoiceEmptyTitle: string;
  invoiceEmptyDesc: string;
  invoiceDetailsTitle: string;
  invoiceDeleteConfirmTitle: string;
  invoiceDeleteConfirmDesc: string;
  invoiceSave: string;
  invoiceSaving: string;
  invoiceDeleting: string;
  invoiceTotal: string;
  invoiceSingular: string;
  invoicePlural: string;
  invoiceRegistered: string;
  invoiceUpdated: string;
  invoiceFilterStatus: string;
  invoiceFilterDistributor: string;
  invoiceCreateSuccess: string;
  invoiceDeleteSuccess: string;
  invoiceDateFrom: string;
  invoiceDateTo: string;
  invoiceReceiveDate: string;
  invoicePpnEnabled: string;
  invoicePpnNominal: string;
  invoiceDiscountNominal: string;
  invoiceSubtotal: string;
  invoiceDiscount: string;
  invoiceRemaining: string;
  invoiceReceiveDateAfterInvoice: string;
  invoiceItemIncomplete: string;
  invoiceDueDateRequired: string;
  invoiceReceiveDateRequired: string;
  invoiceItemsIncompleteWarning: string;
  invoiceItemCabinet: string;
  invoiceItemShelf: string;
  invoiceItemBin: string;
  invoiceItemSelectBin: string;
  invoiceItemCabinetRequired: string;
  invoiceItemShelfRequired: string;
  invoiceItemBinRequired: string;
  // ── Invoice Payment ──────────────────────────────────
  invoicePaymentSectionTitle: string;
  invoicePaymentAdd: string;
  invoicePaymentAddBtn: string;
  invoicePaymentNoHistory: string;
  invoicePaymentMethodLabel: string;
  invoicePaymentMethodCash: string;
  invoicePaymentMethodTransfer: string;
  invoicePaymentMethodCredit: string;
  invoicePaymentAmountLabel: string;
  invoicePaymentAmountPlaceholder: string;
  invoicePaymentAmountRequired: string;
  invoicePaymentDateLabel: string;
  invoicePaymentDateRequired: string;
  invoicePaymentDescriptionLabel: string;
  invoicePaymentDescriptionPlaceholder: string;
  invoicePaymentAfterLabel: string;
  invoicePaymentPayFull: string;
  invoicePaymentSave: string;
  invoicePaymentSaving: string;
  invoicePaymentAddSuccess: string;
  invoicePaymentDeleteTitle: string;
  invoicePaymentDeleteDesc: string;
  invoicePaymentDeleteSuccess: string;
  invoicePaymentAlreadyPaid: string;

  // Storage page
  navStorage: string;
  storageSubtitle: string;
  storageFilterStatus: string;
  storageStatusActive: string;
  storageStatusInactive: string;

  // Storage — Cabinet
  cabinetAdd: string;
  cabinetEdit: string;
  cabinetDelete: string;
  cabinetDetails: string;
  cabinetName: string;
  cabinetNamePlaceholder: string;
  cabinetNameRequired: string;
  cabinetCode: string;
  cabinetCodePlaceholder: string;
  cabinetCodeRequired: string;
  cabinetDescription: string;
  cabinetDescriptionPlaceholder: string;
  cabinetStatus: string;
  cabinetSearchPlaceholder: string;
  cabinetNoResults: string;
  cabinetEmptyTitle: string;
  cabinetEmptyDesc: string;
  cabinetDeleteConfirmTitle: string;
  cabinetDeleteConfirmDesc: string;
  cabinetSave: string;
  cabinetSaving: string;
  cabinetDeleting: string;
  cabinetCreateSuccess: string;
  cabinetUpdateSuccess: string;
  cabinetDeleteSuccess: string;
  cabinetViewShelves: string;

  // Storage — Shelf
  shelfAdd: string;
  shelfEdit: string;
  shelfDelete: string;
  shelfDetails: string;
  shelfName: string;
  shelfNamePlaceholder: string;
  shelfNameRequired: string;
  shelfCode: string;
  shelfCodePlaceholder: string;
  shelfCodeRequired: string;
  shelfLevel: string;
  shelfLevelPlaceholder: string;
  shelfDescription: string;
  shelfDescriptionPlaceholder: string;
  shelfStatus: string;
  shelfSearchPlaceholder: string;
  shelfNoResults: string;
  shelfEmptyTitle: string;
  shelfEmptyDesc: string;
  shelfDeleteConfirmTitle: string;
  shelfDeleteConfirmDesc: string;
  shelfSave: string;
  shelfSaving: string;
  shelfDeleting: string;
  shelfCreateSuccess: string;
  shelfUpdateSuccess: string;
  shelfDeleteSuccess: string;
  shelfViewBins: string;

  // Storage — Bin
  binAdd: string;
  binEdit: string;
  binDelete: string;
  binDetails: string;
  binName: string;
  binNamePlaceholder: string;
  binNameRequired: string;
  binCode: string;
  binCodePlaceholder: string;
  binCodeRequired: string;
  binDescription: string;
  binDescriptionPlaceholder: string;
  binStatus: string;
  binSearchPlaceholder: string;
  binNoResults: string;
  binEmptyTitle: string;
  binEmptyDesc: string;
  binDeleteConfirmTitle: string;
  binDeleteConfirmDesc: string;
  binSave: string;
  binSaving: string;
  binDeleting: string;
  binCreateSuccess: string;
  binUpdateSuccess: string;
  binDeleteSuccess: string;

  // Inventory page
  navInventory: string;
  inventorySubtitle: string;
  inventoryCanvasTitle: string;
  inventorySelectBinPrompt: string;
  inventoryNoCabinets: string;
  inventoryBinEmpty: string;
  inventoryBinItemsTitle: string;
  inventoryExpiryOk: string;
  inventoryExpirySoon: string;
  inventoryExpired: string;
  inventoryBatchLabel: string;
  inventoryBarcodeLabel: string;
  inventoryExpiryLabel: string;
  inventoryRemainingLabel: string;
  inventoryDistributorLabel: string;
  inventoryItemCount: string;
  inventoryWarehouseLabel: string;
  inventoryCanvasSaveSuccess: string;
  inventoryRotate: string;
  inventoryShelvesLabel: string;
  inventoryBinsLabel: string;
  inventoryNoShelves: string;
  inventoryNoBins: string;
  userTempPasswordTitle: string;
  userTempPasswordDesc: string;
  copy: string;
  copied: string;
  done: string;
  errNetwork: string;
  errTimeout: string;
  errBadResponse: string;
  errServer: string;
  errForbidden: string;
  errOffline: string;
  forbiddenTitle: string;
  forbiddenDesc: string;
  notFoundTitle: string;
  notFoundDesc: string;
  backToHome: string;
  backToList: string;
  posQtyLabel: string;
  posAddBox: string;
  posBoxUnit: string;
  posPcsUnit: string;
  posAvailableShort: string;
  posPriceLockedHint: string;
  posEditPriceHint: string;
  posRxRequiredBadge: string;
  posTabProducts: string;
  posTabCart: string;
  posShortcutSearch: string;
  posShortcutHold: string;
  posShortcutPay: string;
  posShortcutsTitle: string;
  posScannerReady: string;
  posScanAdded: string;
  posDraftRestored: string;
  posAmountReceived: string;
  posExactAmount: string;
  posChangeDue: string;
  posAmountShort: string;
  posDiscountMaxHint: string;
  posDiscountLimited: string;
  posTotalsByServer: string;
  posRemoveItem: string;
  datePickPlaceholder: string;
  dateToday: string;
  dateClear: string;
  medicalRecordVisitTimelineEmpty: string;
  medicalRecordVisitLatest: string;
  medicalRecordVisitDaysAgo: string;
  medicalRecordVisitToday: string;
  medicalRecordVisitYesterday: string;
  medicalRecordVisitBy: string;
  medicalRecordVisitFutureDate: string;
  placementHeadPharmacist: string;
  placementHeadPharmacistDesc: string;
  placementHeadPharmacistForced: string;
  medicalRecordAllergyEdit: string;
  medicalRecordAllergyUpdateSuccess: string;
  medicalRecordLastVisit: string;
  medicalRecordNoKnownAllergies: string;
  medicalRecordNotSet: string;
  medicalRecordManage: string;
  medicalRecordVisitSectionExam: string;
  medicalRecordVisitSectionAssessment: string;
  medicalRecordVisitNotesLabel: string;
  medicalRecordVisitCreatePrescription: string;
  medicalRecordVisitNoPrescription: string;
  medicalRecordVisitOpenPrescription: string;
  medicalRecordVisitPrescriptionNoNumber: string;
  prescriptionFromVisit: string;
  medicalRecordPatientInfo: string;
  navExaminations: string;
  examSubtitle: string;
  examCheckIn: string;
  examCheckInTitle: string;
  examCheckInDesc: string;
  examPatient: string;
  examPatientPlaceholder: string;
  examPatientRequired: string;
  examDoctorOptional: string;
  examDoctorPlaceholder: string;
  examComplaintPlaceholder: string;
  examCheckInSuccess: string;
  examStatusWaiting: string;
  examStatusInProgress: string;
  examStatusCompleted: string;
  examStatusCancelled: string;
  examQueueEmpty: string;
  examWaitingFor: string;
  examSelectTitle: string;
  examSelectDesc: string;
  examCallIn: string;
  examCancel: string;
  examCancelTitle: string;
  examCancelDesc: string;
  examCancelReasonPlaceholder: string;
  examCancelConfirm: string;
  examKeep: string;
  examSaveDraft: string;
  examSavedDraft: string;
  examComplete: string;
  examCompleteSuccess: string;
  examCompleteWithRx: string;
  examAllergies: string;
  examNoAllergies: string;
  examPrescription: string;
  examPrescriptionHint: string;
  examAddMedicine: string;
  examMedicine: string;
  examMedicinePlaceholder: string;
  examUseTyped: string;
  examQty: string;
  examFrequency: string;
  examFrequencyPlaceholder: string;
  examDuration: string;
  examDurationPlaceholder: string;
  examRemoveLine: string;
  examRxNotes: string;
  examAllergyWarningTitle: string;
  examAllergyWarningLine: string;
  examAllergyConfirmTitle: string;
  examAllergyConfirmDesc: string;
  examAllergyConfirm: string;
  examRecentVisits: string;
  examNoRecentVisits: string;
  examOpenRecord: string;
  examOpenPrescription: string;
  examNoPrescription: string;
  examChooseDoctor: string;
  examYears: string;
  importDistributorsTitle: string;
  importDistributorsExportHint: string;
  importPatientsExportHint: string;
  importSkipExistingDesc: string;
  importPatientsTitle: string;
  importPatientsDesc: string;
  importOpeningStockTitle: string;
  importOpeningStockBtn: string;
  importOpeningStockDesc: string;
  importOpeningStockNote: string;
  importStockSigner: string;
  importStockDefaultDistributor: string;
  importWillAddDistributors: string;
  importAddedDistributors: string;
  importWillAddPatients: string;
  importAddedPatients: string;
  importWillAddBatches: string;
  importAddedBatches: string;
  importStockValue: string;
  importStockInvoices: string;
  importDownloadTemplate: string;
  importCompleteFields: string;
  importCheck: string;
  importFileEmpty: string;
  importDone: string;
  importReasonName: string;
  importReasonPhone: string;
  importReasonDate: string;
  importReasonMedicine: string;
  importReasonDistributor: string;
  importReasonBatch: string;
  importReasonExpired: string;
  importReasonQuantity: string;
  importReasonPrice: string;
  importReasonBatchExists: string;
  allergyWarningTitle: string;
  allergyWarningLine: string;
  medicineTypeControlled: string;
  medicineTypeControlledHint: string;
  medicineTypeControlledBadge: string;
  nameCaseUpper: string;
  nameCaseTitle: string;
  nameCaseLower: string;
  nameCaseAsTyped: string;
  nameCaseSample: string;
  nameCaseAsTypedNote: string;
  poSignerHint: string;
  sdSignerHint: string;
  pharmaNoOwner: string;
  navPharmacyProfile: string;
  pharmacyProfileSubtitle: string;
  pharmaInfoTitle: string;
  setupTitle: string;
  setupProgress: string;
  setupHide: string;
  setupLicense: string;
  setupHeadPharmacist: string;
  setupStaff: string;
  setupMedicines: string;
  setupDistributors: string;
  setupStorage: string;
  setupStock: string;
  catalogExport: string;
  catalogExportHint: string;
  catalogImport: string;
  catalogImportTitle: string;
  catalogImportDesc: string;
  catalogPickFile: string;
  catalogPickFileHint: string;
  catalogFileEmpty: string;
  catalogFileUnreadable: string;
  catalogWillAddMedicines: string;
  catalogWillAddClassifications: string;
  catalogDoneMedicines: string;
  catalogDoneClassifications: string;
  catalogSkippedExisting: string;
  catalogInvalidRows: string;
  catalogRow: string;
  catalogReasonName: string;
  catalogReasonUnit: string;
  catalogReasonShape: string;
  catalogReasonType: string;
  catalogReasonClass: string;
  catalogReasonDuplicate: string;
  catalogNoStockNote: string;
  catalogImportBtn: string;
  catalogImported: string;
  userPickPharmacyFirst: string;
  forcePwTitle: string;
  forcePwDesc: string;
  forcePwSubmit: string;
  forcePwBack: string;
  pharmaCodeRequired: string;
  pharmaEmailInvalid: string;
  onbCodeHint: string;
  onbLicenseHint: string;
  onbLicenseLater: string;
  onbStepOwner: string;
  onbOwnerTitle: string;
  onbOwnerDesc: string;
  onbOwnerNew: string;
  onbOwnerNewDesc: string;
  onbOwnerExisting: string;
  onbOwnerExistingDesc: string;
  onbOwnerLater: string;
  onbOwnerLaterDesc: string;
  onbOwnerLaterWarn: string;
  onbOwnerName: string;
  onbOwnerNameRequired: string;
  onbOwnerEmail: string;
  onbOwnerPhone: string;
  onbSearchUser: string;
  onbNoUserFound: string;
  onbPickUser: string;
  onbChange: string;
  onbPharmacyCount: string;
  onbStartTitle: string;
  onbStartDesc: string;
  onbStartTemplate: string;
  onbStartTemplateDesc: string;
  onbStartCopy: string;
  onbStartCopyDesc: string;
  onbPickPharmacy: string;
  onbCreate: string;
  onbDoneTitle: string;
  onbTempPasswordDesc: string;
  onbExistingOwnerDesc: string;
  onbCopiedSummary: string;
  onbNextTitle: string;
  onbNext1: string;
  onbNext2: string;
  onbNext3: string;
  onbNext4: string;
  purchaseHistoryTitle: string;
  purchaseHistoryShort: string;
  purchaseTab: string;
  purchaseToday: string;
  purchaseYesterday: string;
  purchaseDaysAgo: string;
  purchaseEmptyTitle: string;
  purchaseEmptyDesc: string;
  purchaseTransactions: string;
  purchaseTotalSpent: string;
  purchaseLast: string;
  purchaseCustomerSince: string;
  purchaseAverage: string;
  purchaseFrequent: string;
  purchaseTimesBought: string;
  purchaseAdd: string;
  purchaseSales: string;
  purchaseLoadMore: string;
  purchaseItemsCount: string;
  examEditVitals: string;
  examAddAllergy: string;
  examEditAllergy: string;
  examAdvice: string;
  examAdvicePlaceholder: string;
  examBloodTypeShort: string;
  examBmi: string;
  examCallInTitle: string;
  examCallInNotTriaged: string;
  examCancelReason: string;
  examFindings: string;
  examFindingsPlaceholder: string;
  examInternalNotes: string;
  examNoResult: string;
  examNoVitals: string;
  examNotTriaged: string;
  examQueueShort: string;
  examResultTitle: string;
  examSpo2: string;
  examTriageTitle: string;
  examTriageDesc: string;
  examTriageSave: string;
  examTriageUpdate: string;
  examTriageSaved: string;
  examTriagedBy: string;
  examVitalBp: string;
  examVitalTemp: string;
  examVitalPulse: string;
  examVitalWeight: string;
  examVitalHeight: string;
  examVitalsTitle: string;
  examStageWaiting: string;
  examStageReady: string;
  examReadyEmpty: string;
  examInProgressEmpty: string;
  examCompletedEmpty: string;
  examSeeWaiting: string;
  examAllergyTag: string;
  examCarriedOver: string;
  examFlowRegister: string;
  examFlowTriage: string;
  examFlowDoctor: string;
  examFlowDone: string;
  examViewByPatient: string;
  examViewByDoctor: string;
  examDoctorYou: string;
  examDoctorFree: string;
  examDoctorBusy: string;
  examCallNext: string;
  examNextUp: string;
  examLaneEmpty: string;
  examAnyDoctor: string;
  examAnyDoctorHint: string;
  examNoDoctorsTitle: string;
  examNoDoctorsDesc: string;
  examWaitingCount: string;
  examCalledIn: string;
  examNewPatient: string;
  examCheckInDescTriage: string;
  roleTypeDoctor: string;
  roleTypeNurse: string;
  examGenderMale: string;
  examGenderFemale: string;
  examLineRequired: string;
  examUnsaved: string;
}

const SUPPORTED_LANGUAGES: Language[] = ["en", "id"];

export const translations: Record<Language, Translations> = {
  en: {
    appName: "PharmaCare",
    appSubtitle: "Pharmacy Management System",
    featureHeadline: "Modern Pharmacy Management",
    featureDesc:
      "A complete digital solution for pharmacy operations, built for the modern healthcare team.",
    featureStock: "Smart inventory & stock management",
    featurePOS: "Seamless point-of-sale & billing",
    featurePrescriptions: "Digital prescription handling",
    welcomeBack: "Welcome back",
    signInDesc: "Sign in to your account to continue",
    signInHeadlinePrefix: "Sign in to",
    signInSubtitle: "Sign in to your pharmacy account",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Forgot?",
    rememberMe: "Stay signed in on this device",
    signIn: "Sign In",
    signingIn: "Signing in...",
    orDivider: "or",
    continueWithGoogle: "Continue with Google",
    noAccount: "Need an account?",
    contactAdmin: "Contact your administrator",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 8 characters",
    loginFailed: "Login failed. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    copyright: "© 2026 PharmaCare. All rights reserved.",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    selectPharmacyTitle: "Select Pharmacy",
    selectPharmacySubtitle: "Choose the pharmacy you want to work in today",
    selectButton: "Select",
    selecting: "Selecting...",
    noPharmaciesTitle: "No Pharmacies Available",
    noPharmaciesDesc: "You don't have access to any pharmacies. Please contact your administrator.",
    signOut: "Sign Out",
    signingOut: "Signing out...",
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    greetingNight: "Good night",
    dailySummary: "Daily Summary",
    yourPharmacies: "YOUR PHARMACIES",
    selectBranchSubtitle: "Select a branch to open the cashier",
    pharmacyAccessPrefix: "You have access to",
    pharmacySingular: "pharmacy",
    pharmacyPlural: "pharmacies",
    filterAll: "All",
    filterOpen: "Open",
    filterNeedsAttention: "Needs attention",
    statusOpen: "Open",
    statusClosed: "Closed",
    lowStockWarning: "low stock",
    salesLabel: "Sales",
    transactionsLabel: "Transactions",
    rxQueueLabel: "Rx Queue",
    navDashboard: "Dashboard",
    navGroupSales: "Sales",
    navGroupInventory: "Inventory",
    navGroupProcurement: "Procurement",
    navGroupPeople: "People",
    navGroupSettings: "Settings",

    // Dashboard page
    dashboardSubtitle: "Here's what's happening in your pharmacy today.",
    dashboardVsYesterday: "vs yesterday",
    dashboardTodayRevenue: "Today's Revenue",
    dashboardTransactionCount: "Transactions Today",
    dashboardAvgTransaction: "Avg. Transaction",
    dashboardSalesTrendTitle: "Sales Trend",
    dashboardRevenue7Days: "Last 7 Days",
    dashboardRevenue14Days: "Last 14 Days",
    dashboardRevenue30Days: "Last 30 Days",
    dashboardSaleTypeSplit: "Sale Type Split",
    dashboardNotAvailableTitle: "Not Available Yet",
    dashboardSaleTypeNotAvailableDesc: "OTC vs prescription split data is not yet available.",
    dashboardStockAlertsTitle: "Stock Alerts",
    dashboardStockAlertsEmpty: "No stock alerts at the moment.",
    dashboardStockLabel: "Stock",
    dashboardReorderLabel: "Reorder at",
    dashboardStockCritical: "Critical",
    dashboardStockLow: "Low",
    dashboardExpiryLabel: "Expires",
    dashboardDaysSuffix: "days",
    dashboardExpirySoon: "Expiring soon",
    dashboardTopProductsTitle: "Top Products",
    dashboardTopProductsEmpty: "No sales data available.",
    dashboardUnitsSoldSuffix: "units",
    dashboardOpenPOsTitle: "Open Purchase Orders",
    dashboardOpenPOsEmpty: "No open purchase orders.",
    dashboardComplianceTitle: "Pharmacy Compliance",
    dashboardSipnapLabel: "SIPNAP",
    dashboardSiaLabel: "SIA (Business License)",
    dashboardApjLabel: "Head Pharmacist",
    dashboardLicenseExpiresLabel: "Expires",
    dashboardLicenseOverdue: "Overdue",
    dashboardQuickActionsTitle: "Quick Actions",
    dashboardActionSell: "Sell",
    dashboardActionReceiveGoods: "Receive Goods",
    dashboardActionAdjustStock: "Adjust Stock",
    dashboardActionCreatePO: "Create PO",
    dashboardNeedRestockTitle: "Need to Restock",
    dashboardNeedRestockEmpty: "All stock levels are sufficient.",
    dashboardExpiringSoonTitle: "Expiring Soon",
    dashboardExpiringSoonEmpty: "No items expiring within 90 days.",
    dashboardRecentTransactionsTitle: "Recent Transactions",
    dashboardRecentTransactionsEmpty: "No transactions today.",
    dashboardTopByQtyTitle: "Top by Units Sold",
    dashboardTopByRevenueTitle: "Top by Revenue",
    dashboardInventoryAsset: "Inventory Value",
    dashboardUnpaidInvoicesTitle: "Unpaid Invoices by Distributor",
    dashboardUnpaidInvoicesEmpty: "No outstanding invoices.",
    dashboardUnpaidTotalLabel: "Total Outstanding",
    dashboardInventoryAssetVsQuarter: "vs prev. quarter",
    dashboardSlowMoversTitle: "Slow Moving Items",
    dashboardSlowMoversEmpty: "No slow-moving items found.",
    dashboardSlowMoversDaysSince: "days idle",
    dashboardSlowMoversEstValue: "Est. Value",
    dashboardSlowMoversNeverSold: "Never sold",
    dashboardSlowMoversTotalIdleValue: "Total idle value",
    dashboardStockRunwayTitle: "Stock Runway",
    dashboardStockRunwayEmpty: "No runway data available.",
    dashboardRunwayCritical: "Critical",
    dashboardRunwayLow: "Low",
    dashboardRunwayAdequate: "Adequate",
    dashboardRunwayOverstocked: "Overstocked",
    dashboardRunwayDaysLeft: "days left",
    dashboardRunwayNoSales: "No sales",
    dashboardAvgDailySalesLabel: "Avg/day",
    dashboardMonthlyRevenueTitle: "Monthly Revenue",
    dashboardMtdLabel: "Month-to-Date",
    dashboardMtdVsPrevLabel: "vs same period last month",
    dashboardGrossProfitTitle: "Gross Profit",
    dashboardGrossProfitMarginLabel: "Margin",
    dashboardGrossProfitVsLastMonth: "vs last month",
    dashboardCogsLabel: "COGS",
    dashboardRevenueLabel: "Revenue",
    dashboardPurchaseSpendTitle: "Purchase Spending",
    dashboardPurchaseSpendMtdLabel: "Month-to-date Spend",
    dashboardPaymentScheduleTitle: "Payment Schedule",
    dashboardPaymentScheduleEmpty: "No upcoming payments.",
    dashboardPaymentOverdueLabel: "Overdue",
    dashboardPaymentUpcomingLabel: "Upcoming",
    dashboardCreditSalesTitle: "Credit Sales Outstanding",
    dashboardCreditSalesEmpty: "No outstanding credit sales.",
    dashboardCreditSalesTotalLabel: "Total Outstanding",
    dashboardCreditSalesDaysSince: "days ago",

    navPOS: "Point of Sale",
    navSales: "Sales History",
    navStock: "Stock",
    navStockDisposals: "Stock Disposals",
    navMedicines: "Medicines",
    navPrescriptions: "Prescriptions",
    navPurchaseOrders: "Purchase Orders",
    navInvoices: "Invoices",
    navPatients: "Patients",
    navCustomers: "Customers",
    navDistributors: "Distributors",
    navReports: "Reports",
    navSettings: "Settings",
    searchPlaceholder: "Search...",
    notifications: "Notifications",
    notificationsEmpty: "You're all caught up",
    notificationsEmptyDesc: "Daily alerts about stock, payments and licenses appear here.",
    notificationsMarkAllRead: "Mark all as read",
    notificationsLoadError: "Couldn't load notifications",
    notificationExpiringBatches: "{n} batch(es) expire within {days} days",
    notificationExpiredBatches: "{n} expired batch(es) still in stock",
    notificationLowStock: "{n} medicine(s) at or below reorder level",
    notificationOverduePayables: "{n} supplier invoice(s) overdue · {amount}",
    notificationOverdueReceivables: "{n} customer credit sale(s) overdue · {amount}",
    notificationLicenseExpiring: "{n} license(s) expire within {days} days or have expired",
    sidebarCollapse: "Collapse sidebar",
    sidebarExpand: "Expand sidebar",
    branchSingular: "branch",
    branchPlural: "branches",
    switchPharmacy: "Switch pharmacy",
    profileSettings: "Profile Settings",

    profilePageSubtitle: "Manage your personal information and password",
    profileInfoSectionTitle: "Profile Information",
    profileInfoSectionDesc: "Update your name, phone number, and address",
    profileNameLabel: "Full Name",
    profileNamePlaceholder: "Enter your full name",
    profileNameRequired: "Name is required",
    profileEmailLabel: "Email",
    profileEmailHint: "Email cannot be changed",
    profilePhoneLabel: "Phone",
    profilePhonePlaceholder: "Enter your phone number",
    profileAddressLabel: "Address",
    profileAddressPlaceholder: "Enter your address",
    profileSaveChanges: "Save Changes",
    profileSaving: "Saving...",
    profileUpdateSuccess: "Profile updated successfully",
    profileMustChangePasswordBanner: "For your security, please update your password.",
    profilePasswordSectionTitle: "Change Password",
    profilePasswordSectionDesc: "Use a strong password you don't use elsewhere",
    profileCurrentPasswordLabel: "Current Password",
    profileNewPasswordLabel: "New Password",
    profileNewPasswordHint: "At least 8 characters, with an uppercase letter and a number",
    profileConfirmPasswordLabel: "Confirm New Password",
    profileCurrentPasswordRequired: "Current password is required",
    profileNewPasswordMinLength: "Password must be at least 8 characters",
    profileNewPasswordUppercase: "Must contain at least one uppercase letter",
    profileNewPasswordNumber: "Must contain at least one number",
    profilePasswordMismatch: "Passwords do not match",
    profileChangePasswordButton: "Update Password",
    profileChangingPassword: "Updating...",
    profilePasswordChangeSuccess: "Password changed successfully",
    profilePlacementSectionTitle: "Current Placement",
    profilePlacementPharmacyLabel: "Pharmacy",
    profilePlacementRoleLabel: "Role",
    profilePlacementJoinedLabel: "Joined",
    profilePlacementLicenseLabel: "Active License",
    profilePlacementNone: "No active placement",

    distributorsSubtitle: "Manage your medicine distributors and suppliers",
    distributorAdd: "Add",
    distributorEdit: "Edit",
    distributorDelete: "Delete",
    distributorName: "Company Name",
    distributorNamePlaceholder: "e.g. PT Kimia Farma",
    distributorContactPerson: "Contact Person",
    distributorContactPersonPlaceholder: "Person to contact",
    distributorPhone: "Phone",
    distributorPhonePlaceholder: "+62 xxx xxxx xxxx",
    distributorEmail: "Email",
    distributorEmailPlaceholder: "distributor@example.com",
    distributorAddress: "Address",
    distributorAddressPlaceholder: "Full address",
    distributorDeleteConfirmTitle: "Delete Distributor",
    distributorDeleteConfirmDesc: "This will permanently remove the distributor from the system. This action cannot be undone.",
    distributorEmptyTitle: "No distributors yet",
    distributorEmptyDesc: "Add your first distributor to start managing your supply chain",
    distributorSave: "Save",
    distributorSaving: "Saving...",
    distributorDeleting: "Deleting...",
    distributorNameRequired: "Company name is required",
    distributorPhoneRequired: "Phone number is required",
    distributorAddressRequired: "Address is required",
    distributorEmailInvalid: "Please enter a valid email address",
    distributorSearchPlaceholder: "Search distributors...",
    distributorNoResults: "No distributors match your search",
    distributorTotal: "Total Distributors",
    distributorSingular: "distributor",
    distributorPlural: "distributors",
    distributorDetails: "Details",
    distributorDetailsTitle: "Distributor Details",
    distributorRegistered: "Registered",
    distributorUpdated: "Last Updated",
    distributorPermitNumber: "Permit Number",
    distributorPermitNumberPlaceholder: "e.g. BPOM-123456",
    distributorNotes: "Notes",
    distributorNotesPlaceholder: "Additional notes about this distributor...",
    distributorCreateSuccess: "Distributor added successfully",
    distributorUpdateSuccess: "Distributor updated successfully",
    distributorDeleteSuccess: "Distributor deleted successfully",

    patientsSubtitle: "Manage your patients and walk-in buyers",
    patientAdd: "Add",
    patientEdit: "Edit",
    patientDelete: "Delete",
    patientDetails: "Details",
    patientDetailsTitle: "Patient Details",
    patientSave: "Save",
    patientSaving: "Saving...",
    patientDeleting: "Deleting...",
    patientName: "Name",
    patientNamePlaceholder: "Full name",
    patientNameRequired: "Name is required",
    patientPhone: "Phone",
    patientPhonePlaceholder: "Phone number",
    patientAddress: "Address",
    patientAddressPlaceholder: "Full address",
    patientDescription: "Notes",
    patientDescriptionPlaceholder: "Additional notes",
    patientStatusLabel: "Status",
    patientStatusActive: "Active",
    patientStatusInactive: "Inactive",
    patientIsWalkIn: "Type",
    patientWalkInBadge: "Walk-in",
    patientWalkInRegular: "Regular",
    patientSearchPlaceholder: "Search patients...",
    patientNoResults: "No patients found",
    patientEmptyTitle: "No patients yet",
    patientEmptyDesc: "Add your first patient to get started",
    patientDeleteConfirmTitle: "Delete Patient",
    patientDeleteConfirmDesc: "This action cannot be undone. The patient will be permanently removed from the system.",
    patientTotal: "patients",
    patientSingular: "patient",
    patientPlural: "patients",
    patientCreateSuccess: "Patient added successfully",
    patientUpdateSuccess: "Patient updated successfully",
    patientDeleteSuccess: "Patient deleted successfully",
    patientFilterStatus: "Status",
    patientFilterIsWalkIn: "Type",
    patientFilterPartyType: "Party Type",
    patientPartyTypePatient: "Patient",
    patientPartyTypeProfessional: "Professional",
    patientNik: "NIK",
    patientNikPlaceholder: "National ID number",
    patientGender: "Gender",
    patientGenderMale: "Male",
    patientGenderFemale: "Female",
    patientDateOfBirth: "Date of Birth",
    patientBpjsNumber: "BPJS Number",
    patientBpjsNumberPlaceholder: "BPJS membership number",
    patientMedicalRecordNumber: "Medical Record No.",
    patientMedicalRecordNumberPlaceholder: "Medical record number",
    patientDetailSectionTitle: "Medical Details",
    professionalStrNumber: "STR Number",
    professionalStrNumberPlaceholder: "Surat Tanda Registrasi number",
    professionalSipNumber: "SIP Number",
    professionalSipNumberPlaceholder: "Surat Izin Praktik number",
    professionalProfession: "Profession",
    professionalProfessionPlaceholder: "e.g. Doctor, Nurse, Pharmacist",
    professionalDetailSectionTitle: "Professional Details",

    // Customers
    customersSubtitle: "Manage your customers, patients, and professionals",
    customerAdd: "Add",
    customerEdit: "Edit",
    customerDelete: "Delete",
    customerDetails: "Details",
    customerDetailsTitle: "Customer Details",
    customerSave: "Save",
    customerSaving: "Saving...",
    customerDeleting: "Deleting...",
    customerSearchPlaceholder: "Search customers...",
    customerNoResults: "No customers found",
    customerEmptyTitle: "No customers yet",
    customerEmptyDesc: "Add your first customer to get started",
    customerDeleteConfirmTitle: "Delete Customer",
    customerDeleteConfirmDesc: "This action cannot be undone. The customer will be permanently removed.",
    customerCreateSuccess: "Customer added successfully",
    customerUpdateSuccess: "Customer updated successfully",
    customerDeleteSuccess: "Customer deleted successfully",
    customerFilterStatus: "Status",
    customerFilterIsWalkIn: "Type",
    customerFilterType: "Customer Type",
    customerTypePatient: "Patient",
    customerTypeProfessional: "Professional",
    customerMedicalRecordNumber: "Medical Record No.",

    // Medical Records
    navMedicalRecords: "Medical Records",
    medicalRecordsSubtitle: "View and manage patient medical records, allergies, and visit history",
    medicalRecordTitle: "Medical Record",
    medicalRecordNumber: "Record Number",
    medicalRecordBloodType: "Blood Type",
    medicalRecordBloodTypePlaceholder: "e.g. A+, B-, O+",
    medicalRecordEmergencyContact: "Emergency Contact",
    medicalRecordEmergencyContactName: "Contact Name",
    medicalRecordEmergencyContactNamePlaceholder: "Full name",
    medicalRecordEmergencyContactPhone: "Contact Phone",
    medicalRecordEmergencyContactPhonePlaceholder: "+62 xxx xxxx xxxx",
    medicalRecordEdit: "Edit Record",
    medicalRecordSave: "Save",
    medicalRecordSaving: "Saving...",
    medicalRecordUpdateSuccess: "Medical record updated successfully",
    medicalRecordPatientSearchPlaceholder: "Search patients...",
    medicalRecordSelectPatient: "Select a Patient",
    medicalRecordNoPatientSelected: "No Patient Selected",
    medicalRecordNoPatientSelectedDesc: "Select a patient from the list to view their medical record",
    medicalRecordNotFoundTitle: "No Medical Record Yet",
    medicalRecordNotFoundDesc: "This patient doesn't have a medical record yet. It will be created automatically once the backend generates one for this patient.",
    medicalRecordOverviewTab: "Overview",
    medicalRecordAllergiesTab: "Allergies",
    medicalRecordAllergiesMore: "+{n} more",
    medicalRecordVisitsTab: "Visit History",
    medicalRecordAllergyAdd: "Add Allergy",
    medicalRecordAllergyDelete: "Remove",
    medicalRecordAllergyDeleting: "Removing...",
    medicalRecordAllergyDeleteSuccess: "Allergy removed successfully",
    medicalRecordAllergyAddSuccess: "Allergy added successfully",
    medicalRecordAllergyNoData: "No allergies recorded",
    medicalRecordAllergyName: "Allergen",
    medicalRecordAllergyNamePlaceholder: "e.g. Penicillin, Peanuts",
    medicalRecordAllergyNameRequired: "Allergen name is required",
    medicalRecordAllergyType: "Type",
    medicalRecordAllergyTypeRequired: "Allergen type is required",
    medicalRecordAllergyTypeMedicine: "Medicine",
    medicalRecordAllergyTypeFood: "Food",
    medicalRecordAllergyTypeEnvironment: "Environment",
    medicalRecordAllergyTypeOther: "Other",
    medicalRecordAllergyReaction: "Reaction",
    medicalRecordAllergyReactionPlaceholder: "Describe the allergic reaction",
    medicalRecordAllergySeverity: "Severity",
    medicalRecordAllergySeverityRequired: "Severity is required",
    medicalRecordAllergySeverityMild: "Mild",
    medicalRecordAllergySeverityModerate: "Moderate",
    medicalRecordAllergySeveritySevere: "Severe",
    medicalRecordAllergyNotes: "Notes",
    medicalRecordAllergyNotesPlaceholder: "Additional notes",
    medicalRecordAllergyDeleteConfirmTitle: "Remove Allergy",
    medicalRecordAllergyDeleteConfirmDesc: "Are you sure you want to remove this allergy record?",
    medicalRecordVisitAdd: "Add Visit",
    medicalRecordVisitEdit: "Edit",
    medicalRecordVisitDelete: "Delete",
    medicalRecordVisitDeleting: "Deleting...",
    medicalRecordVisitDeleteSuccess: "Visit deleted successfully",
    medicalRecordVisitAddSuccess: "Visit recorded successfully",
    medicalRecordVisitUpdateSuccess: "Visit updated successfully",
    medicalRecordVisitNoData: "No visit history recorded",
    medicalRecordVisitDate: "Visit Date",
    medicalRecordVisitDateRequired: "Visit date is required",
    medicalRecordVisitChiefComplaint: "Chief Complaint",
    medicalRecordVisitChiefComplaintPlaceholder: "Main reason for the visit",
    medicalRecordVisitDiagnosis: "Diagnosis",
    medicalRecordVisitDiagnosisPlaceholder: "Diagnosis or assessment",
    medicalRecordVisitNotes: "Notes",
    medicalRecordVisitNotesPlaceholder: "Additional clinical notes",
    medicalRecordVisitVitals: "Vital Signs",
    medicalRecordVisitWeight: "Weight (kg)",
    medicalRecordVisitWeightPlaceholder: "e.g. 60.5",
    medicalRecordVisitHeight: "Height (cm)",
    medicalRecordVisitHeightPlaceholder: "e.g. 170",
    medicalRecordVisitBloodPressure: "Blood Pressure",
    medicalRecordVisitBloodPressurePlaceholder: "e.g. 120/80",
    medicalRecordVisitTemperature: "Temperature (°C)",
    medicalRecordVisitTemperaturePlaceholder: "e.g. 36.8",
    medicalRecordVisitPulse: "Pulse (bpm)",
    medicalRecordVisitPulsePlaceholder: "e.g. 80",
    medicalRecordVisitDoctor: "Doctor",
    medicalRecordVisitDoctorPlaceholder: "Select doctor",
    medicalRecordVisitPrescription: "Prescription",
    medicalRecordVisitPrescriptionPlaceholder: "Select prescription",
    medicalRecordVisitDeleteConfirmTitle: "Delete Visit",
    medicalRecordVisitDeleteConfirmDesc: "This will permanently delete this visit record. This action cannot be undone.",
    medicalRecordVisitSave: "Save Visit",
    medicalRecordVisitSaving: "Saving...",
    medicalRecordVisitDetails: "Visit Details",

    // Doctors page
    navDoctors: "Doctors",
    doctorsSubtitle: "Manage registered doctors and their clinic details",
    doctorAdd: "Add",
    doctorEdit: "Edit",
    doctorDelete: "Delete",
    doctorDetails: "Details",
    doctorDetailsTitle: "Doctor Details",
    doctorSave: "Save Doctor",
    doctorSaving: "Saving...",
    doctorDeleting: "Deleting...",
    doctorName: "Full Name",
    doctorNamePlaceholder: "e.g. Dr. John Smith",
    doctorNameRequired: "Doctor name is required",
    doctorLicenseNumber: "License Number",
    doctorLicenseNumberPlaceholder: "e.g. SIP-123456",
    doctorSpecialty: "Specialty",
    doctorSpecialtyPlaceholder: "e.g. General Practitioner",
    doctorClinicName: "Clinic / Hospital",
    doctorClinicNamePlaceholder: "e.g. City Clinic",
    doctorPhone: "Phone",
    doctorPhonePlaceholder: "e.g. 0812-3456-7890",
    doctorStatusLabel: "Status",
    doctorStatusActive: "Active",
    doctorStatusInactive: "Inactive",
    doctorFilterStatus: "Status",
    doctorSearchPlaceholder: "Search by name, license, or clinic...",
    doctorNoResults: "No doctors match your search",
    doctorEmptyTitle: "No doctors yet",
    doctorEmptyDesc: "Add your first doctor to start linking prescriptions",
    doctorDeleteConfirmTitle: "Delete Doctor",
    doctorDeleteConfirmDesc: "This doctor will be permanently deleted and unlinked from all prescriptions.",
    doctorTotal: "Total",
    doctorSingular: "doctor",
    doctorPlural: "doctors",
    doctorRegistered: "Registered",
    doctorUpdated: "Last updated",
    doctorCreateSuccess: "Doctor added successfully",
    doctorUpdateSuccess: "Doctor updated successfully",
    doctorDeleteSuccess: "Doctor deleted successfully",
    doctorLinkedUser: "Linked User",

    // Prescriptions page
    prescriptionsSubtitle: "Manage patient prescriptions and dispensing workflow",
    prescriptionAdd: "Add",
    prescriptionEdit: "Edit",
    prescriptionDelete: "Delete",
    prescriptionDetails: "Details",
    prescriptionDetailsTitle: "Prescription Details",
    prescriptionSave: "Save Prescription",
    prescriptionSaving: "Saving...",
    prescriptionDeleting: "Deleting...",
    prescriptionNumber: "Prescription No.",
    prescriptionNumberPlaceholder: "e.g. RX-20260001",
    prescriptionPrescribedAt: "Prescribed Date",
    prescriptionNotes: "Notes",
    prescriptionNotesPlaceholder: "Additional notes or instructions",
    prescriptionPatient: "Patient",
    prescriptionPatientPlaceholder: "Search patient...",
    prescriptionPatientRequired: "Patient is required",
    prescriptionDoctor: "Doctor",
    prescriptionDoctorPlaceholder: "Search doctor (optional)...",
    prescriptionStatusLabel: "Status",
    prescriptionStatusPending: "Pending",
    prescriptionStatusDispensed: "Dispensed",
    prescriptionStatusPartial: "Partial",
    prescriptionStatusCancelled: "Cancelled",
    prescriptionStatusExpired: "Expired",
    prescriptionFilterStatus: "Status",
    prescriptionSearchPlaceholder: "Search by patient or Rx number...",
    prescriptionNoResults: "No prescriptions match your search",
    prescriptionEmptyTitle: "No prescriptions yet",
    prescriptionEmptyDesc: "Add a new prescription to start the dispensing workflow",
    prescriptionDeleteConfirmTitle: "Delete Prescription",
    prescriptionDeleteConfirmDesc: "This prescription will be permanently deleted.",
    prescriptionTotal: "Total",
    prescriptionSingular: "prescription",
    prescriptionPlural: "prescriptions",
    prescriptionCreateSuccess: "Prescription added successfully",
    prescriptionUpdateSuccess: "Prescription updated successfully",
    prescriptionDeleteSuccess: "Prescription deleted successfully",
    prescriptionAllTab: "All",
    prescriptionQueueTab: "Queue",
    prescriptionQueueTitle: "Dispensing Queue",
    prescriptionQueueEmpty: "Queue is clear",
    prescriptionQueueEmptyDesc: "No pending prescriptions at the moment",
    prescriptionLinkedSale: "Linked Sale",
    prescriptionItemsLabel: "Medication Items",
    prescriptionItemAdd: "Add Item",
    prescriptionItemRemove: "Remove",
    prescriptionItemMedicine: "Medicine Name",
    prescriptionItemMedicinePlaceholder: "e.g. Amoxicillin 500mg",
    prescriptionItemMedicineRequired: "Medicine name is required",
    prescriptionItemQty: "Qty",
    prescriptionItemQtyRequired: "Quantity is required",
    prescriptionItemFrequency: "Frequency",
    prescriptionItemFrequencyPlaceholder: "e.g. 3x per day",
    prescriptionItemDuration: "Duration",
    prescriptionItemDurationPlaceholder: "e.g. 5 days",
    prescriptionItemNotes: "Item Notes",
    prescriptionItemNotesPlaceholder: "e.g. Take after meals",
    prescriptionItemDispensedOf: "dispensed of",
    prescriptionDispense: "Dispense",
    prescriptionDispenseTitle: "Dispense Prescription",
    prescriptionDispensing: "Dispensing...",
    prescriptionDispenseSuccess: "Prescription dispensed successfully",
    prescriptionCancel: "Cancel Rx",
    prescriptionCancelConfirmTitle: "Cancel Prescription",
    prescriptionCancelConfirmDesc: "This prescription will be marked as cancelled and cannot be dispensed.",
    prescriptionCancelling: "Cancelling...",
    prescriptionCancelSuccess: "Prescription cancelled successfully",
    prescriptionDispenseStockBatch: "Stock Batch",
    prescriptionDispenseQty: "Qty to Dispense",
    prescriptionDispenseSellingPrice: "Selling Price",
    prescriptionDispenseOriginalPrice: "Original Price",
    prescriptionDispenseSaleType: "Sale Type",
    prescriptionDispensePaymentMethod: "Payment Method",
    prescriptionDispenseGrandTotal: "Grand Total",
    prescriptionDispenseTotalAmount: "Subtotal",
    prescriptionDispenseStepItems: "Stock & Pricing",
    prescriptionDispenseStepPayment: "Payment",
    prescriptionDispenseNext: "Next",
    prescriptionDispenseBack: "Back",
    prescriptionSaleTypeCash: "Cash",
    prescriptionSaleTypeCredit: "Credit",
    prescriptionPaymentCash: "Cash",
    prescriptionPaymentTransfer: "Transfer",
    prescriptionPaymentDebit: "Debit",
    prescriptionPaymentCreditCard: "Credit Card",
    prescriptionPaymentQris: "QRIS",

    sessionExpiredTitle: "Session Ended",
    sessionExpiredDesc: "Your session has expired. Please sign in again.",

    loginSuccessTitle: "Signed in successfully",
    loginSuccessDesc: "Choose a pharmacy to continue.",
    loginSuccessDirectDesc: "You're in. Taking you to your dashboard.",

    logoutSuccessTitle: "Signed out",
    logoutSuccessDesc: "You have been signed out successfully.",

    pharmacyContextLostTitle: "Pharmacy session reset",
    pharmacyContextLostDesc: "Please select a pharmacy to continue.",

    serverDownTitle: "Server Unavailable",
    serverDownDesc: "Cannot connect to the server. Please check your connection or try again later.",
    serverDownRetry: "Try Again",

    useValue: 'Use "%s"',
    add: "Add",
    created: "Created",
    lastUpdated: "Last Updated",
    cancel: "Cancel",
    save: "Save",
    deleteConfirm: "Yes, delete",
    showing: "Showing",
    of: "of",
    rowsPerPage: "Rows per page",
    referenceStatusColumn: "Status",
    referenceStatusAll: "All Status",
    referenceStatusActive: "Active",
    referenceStatusInactive: "Inactive",
    name: "Name",
    description: "Description",

    navMedicineClassification: "Medicine Classification",
    medicineClassificationSubtitle: "Manage medicine shapes, types, and therapeutic classes",
    navMedicineShapes: "Medicine Shapes",
    navMedicineTypes: "Medicine Types",
    navMedicineClasses: "Medicine Therapeutic Classes",
    navBusinessParameters: "Business Parameters",
    navSystemParameters: "System Parameters",
    navBackgroundJobs: "Background Jobs",
    jobsSubtitle: "Scheduled tasks that keep data tidy and send the daily alerts",
    jobsRunNow: "Run now",
    jobsLastRun: "Last run",
    jobsNeverRun: "Not run yet",
    jobsDailyAt: "Daily at {time}",
    jobsSettings: "Settings",
    jobsSettingsTitle: "{name} settings",
    jobsEnabled: "Run on schedule",
    jobsEnabledHint: "When off, it only runs when started by hand.",
    jobsTime: "Time of day",
    jobsTimeHint: "Every day, {tz} time. Default {time}.",
    jobsOff: "Off",
    jobsDefaultValue: "Default {value}, range {min}–{max}",
    jobsPharmacyParams: "Set by each pharmacy",
    jobsPharmacyParamsHint: "Each pharmacy changes these in Business Parameters:",
    jobsSettingsSaved: "Settings saved",
    jobsParamNotificationRetention: "Keep notifications (days)",
    jobsParamJobRunRetention: "Keep run history (days)",
    jobsHistory: "Run history",
    jobsAllJobs: "All jobs",
    jobsColJob: "Job",
    jobsColStatus: "Status",
    jobsColStarted: "Started",
    jobsColDuration: "Duration",
    jobsColAffected: "Changed",
    jobsColTrigger: "Trigger",
    jobsNoRuns: "No runs yet",
    jobsStatusRunning: "Running",
    jobsStatusSuccess: "Success",
    jobsStatusFailed: "Failed",
    jobsStatusSkipped: "Skipped",
    jobsTriggerSchedule: "Schedule",
    jobsTriggerManual: "Manual · {name}",
    jobsConfirmTitle: "Run {name} now?",
    jobsConfirmDesc: "It also runs on its schedule. Running it again is safe: it only changes what still needs changing.",
    jobsRunDone: "{name} finished · {n} changed",
    jobsRunSkippedMsg: "{name} was skipped: it is already running",
    jobsRunFailedMsg: "{name} failed: {error}",
    jobNameCancelHeldSales: "Cancel held sales",
    jobDescCancelHeldSales: "Held sales still open after the day ends are cancelled and their reserved stock is released.",
    jobNameExpirePrescriptions: "Expire prescriptions",
    jobDescExpirePrescriptions: "Undispensed prescriptions older than PRESCRIPTION_VALID_DAYS are marked expired.",
    jobNamePurgeExpired: "Clean up",
    jobDescPurgeExpired: "Removes expired sign-in tokens and request keys, notifications older than 30 days and runs older than 90 days.",
    jobNameDailyAlerts: "Daily alerts",
    jobDescDailyAlerts: "Notifies each pharmacy of expiring stock, low stock, overdue payments and expiring licenses.",
    navPharmacyList: "Pharmacy List",

    medicineShapesSubtitle: "Manage medicine dosage forms",
    medicineShapeAdd: "Add",
    medicineShapeEdit: "Edit",
    medicineShapeDelete: "Delete",
    medicineShapeName: "Shape Name",
    medicineShapeNamePlaceholder: "e.g. Tablet, Capsule, Syrup",
    medicineShapeDescription: "Description",
    medicineShapeDescriptionPlaceholder: "Optional description...",
    medicineShapeNameRequired: "Shape name is required",
    medicineShapeTotal: "Total Shapes",
    medicineShapeSingular: "shape",
    medicineShapePlural: "shapes",
    medicineShapeSearchPlaceholder: "Search shapes...",
    medicineShapeNoResults: "No shapes match your search",
    medicineShapeEmptyTitle: "No shapes yet",
    medicineShapeEmptyDesc: "Add your first medicine dosage form",
    medicineShapeDetailsTitle: "Shape Details",
    medicineShapeDetails: "Details",
    medicineShapeDeleteConfirmTitle: "Delete Shape",
    medicineShapeDeleteConfirmDesc: "This will permanently remove this shape. This action cannot be undone.",
    medicineShapeSave: "Save",
    medicineShapeSaving: "Saving...",
    medicineShapeDeleting: "Deleting...",
    medicineShapeRegistered: "Registered",
    medicineShapeUpdated: "Last Updated",
    medicineShapeCreateSuccess: "Shape added successfully",
    medicineShapeUpdateSuccess: "Shape updated successfully",
    medicineShapeDeleteSuccess: "Shape deleted successfully",

    medicineTypesSubtitle: "Manage medicine types",
    medicineTypeAdd: "Add",
    medicineTypeEdit: "Edit",
    medicineTypeDelete: "Delete",
    medicineTypeName: "Type Name",
    medicineTypeNamePlaceholder: "e.g. Generic, Branded",
    medicineTypeDescription: "Description",
    medicineTypeDescriptionPlaceholder: "Optional description...",
    medicineTypeNameRequired: "Type name is required",
    medicineTypeTotal: "Total Types",
    medicineTypeSingular: "type",
    medicineTypePlural: "types",
    medicineTypeSearchPlaceholder: "Search types...",
    medicineTypeNoResults: "No types match your search",
    medicineTypeEmptyTitle: "No types yet",
    medicineTypeEmptyDesc: "Add your first medicine type",
    medicineTypeDetailsTitle: "Type Details",
    medicineTypeDetails: "Details",
    medicineTypeDeleteConfirmTitle: "Delete Type",
    medicineTypeDeleteConfirmDesc: "This will permanently remove this type. This action cannot be undone.",
    medicineTypeSave: "Save",
    medicineTypeSaving: "Saving...",
    medicineTypeDeleting: "Deleting...",
    medicineTypeRegistered: "Registered",
    medicineTypeUpdated: "Last Updated",
    medicineTypeCreateSuccess: "Type added successfully",
    medicineTypeUpdateSuccess: "Type updated successfully",
    medicineTypeDeleteSuccess: "Type deleted successfully",
    medicineTypeRequiredPrescription: "Requires Prescription",
    medicineTypeRequiredPrescriptionYes: "Yes",
    medicineTypeRequiredPrescriptionNo: "No",

    medicineClassesSubtitle: "Manage therapeutic classes",
    medicineClassAdd: "Add",
    medicineClassEdit: "Edit",
    medicineClassDelete: "Delete",
    medicineClassName: "Therapeutic Class Name",
    medicineClassNamePlaceholder: "e.g. OTC, Prescription, Narcotic",
    medicineClassDescription: "Description",
    medicineClassDescriptionPlaceholder: "Optional description...",
    medicineClassNameRequired: "Therapeutic Class name is required",
    medicineClassTotal: "Total Therapeutic Classes",
    medicineClassSingular: "therapeutic class",
    medicineClassPlural: "therapeutic classes",
    medicineClassSearchPlaceholder: "Search therapeutic classes...",
    medicineClassNoResults: "No therapeutic classes match your search",
    medicineClassEmptyTitle: "No therapeutic classes yet",
    medicineClassEmptyDesc: "Add your first therapeutic class",
    medicineClassDetailsTitle: "Therapeutic Class Details",
    medicineClassDetails: "Details",
    medicineClassDeleteConfirmTitle: "Delete Therapeutic Class",
    medicineClassDeleteConfirmDesc: "This will permanently remove this therapeutic class. This action cannot be undone.",
    medicineClassSave: "Save",
    medicineClassSaving: "Saving...",
    medicineClassDeleting: "Deleting...",
    medicineClassRegistered: "Registered",
    medicineClassUpdated: "Last Updated",
    medicineClassCreateSuccess: "Therapeutic Class added successfully",
    medicineClassUpdateSuccess: "Therapeutic Class updated successfully",
    medicineClassDeleteSuccess: "Therapeutic Class deleted successfully",

    medicinesSubtitle: "Manage your medicine catalog",
    medicineAdd: "Add",
    medicineEdit: "Edit",
    medicineDelete: "Delete",
    medicineName: "Medicine Name",
    medicineNamePlaceholder: "e.g. Paracetamol 500mg",
    medicineGenericName: "Generic Name",
    medicineGenericNamePlaceholder: "e.g. Acetaminophen",
    medicineBarcode: "Barcode",
    medicineBarcodePlaceholder: "Scan or enter barcode",
    medicineShapeLabel: "Shape",
    medicineTypeLabel: "Type",
    medicineClassLabel: "Therapeutic Class",
    medicineSelectShape: "Select a shape",
    medicineSelectType: "Select a type",
    medicineSelectClass: "Select a therapeutic class",
    medicineUnit: "Unit",
    medicineUnitPlaceholder: "e.g. Tablet, Strip, Box",
    medicineBarcodeGenerate: "Generate",
    medicineBarcodeHint: "One code for every batch. Leave empty to use batch barcodes only.",
    medicineBarcodeInvalid: "Only letters, digits and - . / are allowed",
    medicineSellingPrice: "Selling Price",
    medicinePurchasePrice: "Purchase Price",
    medicineStock: "Stock",
    medicineMinStock: "Min. Stock",
    medicineManufacturer: "Manufacturer",
    medicineManufacturerPlaceholder: "e.g. PT Sanbe Farma",
    medicineNotes: "Notes",
    medicineNotesPlaceholder: "Additional notes...",
    medicineNameRequired: "Medicine name is required",
    medicineShapeRequired: "Please select a shape",
    medicineTypeRequired: "Please select a type",
    medicineClassRequired: "Please select a therapeutic class",
    medicineUnitRequired: "Unit is required",
    medicineSellingPriceRequired: "Selling price is required",
    medicineTotal: "Total Medicines",
    medicineSingular: "medicine",
    medicinePlural: "medicines",
    medicineSearchPlaceholder: "Search medicines...",
    medicineNoResults: "No medicines match your search",
    medicineEmptyTitle: "No medicines yet",
    medicineEmptyDesc: "Add your first medicine to the catalog",
    medicineDetailsTitle: "Medicine Details",
    medicineDetails: "Details",
    medicineDeleteConfirmTitle: "Delete Medicine",
    medicineDeleteConfirmDesc: "This will permanently remove this medicine from the catalog. This action cannot be undone.",
    medicineSave: "Save",
    medicineSaving: "Saving...",
    medicineDeleting: "Deleting...",
    medicineRegistered: "Registered",
    medicineUpdated: "Last Updated",
    medicineCreateSuccess: "Medicine added successfully",
    medicineUpdateSuccess: "Medicine updated successfully",
    medicineDeleteSuccess: "Medicine deleted successfully",
    medicineLowStock: "Low stock",
    medicineIngredients: "Active Ingredients",
    medicineIngredientPlaceholder: "e.g. Paracetamol",
    medicineIngredientAdd: "Add Ingredient",
    medicineIngredientRemove: "Remove",
    medicineIngredientsRequired: "At least one ingredient is required",
    medicineStatusLabel: "Status",
    medicineStatusActive: "Active",
    medicineStatusInactive: "Inactive",
    paramKey: "Key",
    paramValue: "Value",
    paramDescription: "Description",
    paramRegistered: "Registered",
    paramUpdated: "Last Updated",
    paramEdit: "Edit",
    paramDetails: "Details",
    paramDetailsTitle: "Parameter Details",
    paramSave: "Save",
    paramSaving: "Saving...",
    paramValueRequired: "Value is required",
    paramSearchPlaceholder: "Search by key...",
    paramNoResults: "No parameters match your search",
    paramTotal: "Total Parameters",
    paramSingular: "parameter",
    paramPlural: "parameters",
    paramUpdateSuccess: "Parameter updated successfully",
    paramValuePlaceholder: "Enter value",
    paramDescriptionPlaceholder: "Enter description (optional)",
    paramEmptyTitle: "No parameters found",
    paramEmptyDesc: "Parameters are configured by the system",
    businessParamSubtitle: "Manage your pharmacy's business configuration",
    systemParamSubtitle: "Manage global system-level configuration",

    navUsers: "Users",
    usersSubtitle: "Manage platform users and access",
    userName: "Full Name",
    userNamePlaceholder: "e.g. John Doe",
    userEmail: "Email",
    userEmailPlaceholder: "user@example.com",
    userPhone: "Phone",
    userPhonePlaceholder: "+62 xxx xxxx xxxx",
    userAddress: "Address",
    userAddressPlaceholder: "Full address",
    userPlatformRole: "Platform Role",
    userSelectRole: "Select a role",
    userStatus: "Status",
    userStatusActive: "Active",
    userStatusInactive: "Inactive",
    userStatusDeleted: "Deleted",
    platformRoleAdmin: "Admin",
    platformRoleViewer: "Viewer",
    platformRoleSupport: "Support",
    userNameRequired: "Full name is required",
    userEmailRequired: "Email is required",
    userEmailInvalid: "Please enter a valid email address",
    userAdd: "Add",
    userEdit: "Edit",
    userDelete: "Delete",
    userDetails: "Details",
    userResetPassword: "Reset Password",
    userDeleteConfirmTitle: "Delete User",
    userDeleteConfirmDesc: "This will permanently remove the user from the system. This action cannot be undone. Are you sure you want to delete",
    userResetPasswordConfirmTitle: "Reset Password",
    userResetPasswordConfirmDesc: "A new password will be generated and sent to the user's email. Are you sure you want to reset the password for",
    userSave: "Save",
    userSaving: "Saving...",
    userDeleting: "Deleting...",
    userResettingPassword: "Resetting...",
    userSearchPlaceholder: "Search users...",
    userNoResults: "No users match your search",
    userEmptyTitle: "No users yet",
    userEmptyDesc: "Add your first platform user",
    userTotal: "Total Users",
    userSingular: "user",
    userPlural: "users",
    userPlacementCount: "placements",
    userDetailsTitle: "User Details",
    userRegistered: "Registered",
    userUpdated: "Last Updated",
    userCreateSuccess: "User created successfully",
    userUpdateSuccess: "User updated successfully",
    userDeleteSuccess: "User deleted successfully",
    userResetPasswordSuccess: "Password has been reset",

    userCreate: "Create User",
    userCreating: "Creating...",
    userWizardStep1: "Basic Info",
    userWizardStep2: "Pharmacy",
    userWizardStep3: "License",
    userWizardStep1Hint: "Enter the user's personal information to create their account",
    userWizardStep2Hint: "Assign the user to a pharmacy with a role",
    userWizardStep3Hint: "Add a practice license (SIPA) for this placement",
    wizardNext: "Next",
    wizardBack: "Back",
    wizardSkip: "Skip",
    wizardDone: "Done",

    placementSectionTitle: "Pharmacy Placements",
    placementAdd: "Add Placement",
    placementWizardStep1: "Placement",
    placementWizardStep2: "License",
    placementWizardStep1Hint: "Assign this user to a pharmacy with a role and start date",
    placementWizardStep2Hint: "Add a practice license (SIPA) for this placement",
    placementEdit: "Edit Placement",
    placementDelete: "Remove",
    placementPharmacy: "Pharmacy",
    placementSelectPharmacy: "Select a pharmacy",
    placementRole: "Role",
    placementSelectRole: "Select a role",
    placementJoinedAt: "Joined At",
    placementLeftAt: "Left At",
    placementStatus: "Status",
    placementEmptyTitle: "No placements yet",
    placementEmptyDesc: "Assign this user to a pharmacy",
    placementDeleteConfirmTitle: "Remove Placement",
    placementDeleteConfirmDesc: "This will remove the user from this pharmacy placement. Are you sure you want to remove",
    placementSave: "Save",
    placementSaving: "Saving...",
    placementDeleting: "Removing...",
    placementCreateSuccess: "Placement created successfully",
    placementUpdateSuccess: "Placement updated successfully",
    placementDeleteSuccess: "Placement removed successfully",
    placementPharmacyRequired: "Pharmacy is required",
    placementRoleRequired: "Role is required",
    placementJoinedAtRequired: "Join date is required",
    placementLeftAtAfterJoinedAt: "Left date must be after join date",
    placementPresent: "Present",

    licenseAdd: "Add License",
    licenseEdit: "Edit License",
    licenseDelete: "Delete License",
    licenseNumber: "License Number",
    licenseNumberPlaceholder: "e.g. SIPA-2024-001",
    licenseValidFrom: "Valid From",
    licenseValidUntil: "Valid Until",
    licenseStatus: "Status",
    licenseDeleteConfirmTitle: "Delete License",
    licenseDeleteConfirmDesc: "This will permanently delete this practice license. Are you sure you want to delete the license for",
    licenseSave: "Save",
    licenseSaving: "Saving...",
    licenseDeleting: "Deleting...",
    licenseCreateSuccess: "License added successfully",
    licenseUpdateSuccess: "License updated successfully",
    licenseDeleteSuccess: "License deleted successfully",
    licenseNumberRequired: "License number is required",
    licenseValidFromRequired: "Valid from date is required",
    licenseValidUntilRequired: "Valid until date is required",
    licenseValidUntilAfterFrom: "Valid until must be after valid from",
    licenseActiveBadge: "Licensed",
    licenseNoLicense: "No License",
    licenseHistory: "License History",
    licenseHistoryEmpty: "No license records found",

    navPharmacies: "Pharmacies",
    pharmaciesSubtitle: "Manage pharmacy branches",
    pharmaName: "Pharmacy Name",
    pharmaNamePlaceholder: "e.g. Apotek Sehat",
    pharmaCode: "Code",
    pharmaCodePlaceholder: "e.g. APT01",
    pharmaCodeInvalid: "Code must be alphanumeric (max 5 characters)",
    pharmaCategory: "Category",
    pharmaSelectCategory: "Select a category",
    pharmaCategoryApotek: "Pharmacy",
    pharmaCategoryKlinik: "Clinic",
    pharmaCategoryRumahSakit: "Hospital",
    pharmaCategoryPuskesmas: "Community Health Center",
    pharmaPermitNumber: "Permit Number",
    pharmaPermitNumberPlaceholder: "e.g. SIA-123456",
    pharmaPhone: "Phone",
    pharmaPhonePlaceholder: "+62 xxx xxxx xxxx",
    pharmaAddress: "Address",
    pharmaAddressPlaceholder: "Full address",
    pharmaLocation: "Location",
    pharmaLocationPlaceholder: "e.g. Jakarta Selatan",
    pharmaLocationRequired: "Location is required",
    pharmaEmail: "Email",
    pharmaEmailPlaceholder: "pharmacy@example.com",
    pharmaStatus: "Status",
    pharmaStatusActive: "Active",
    pharmaStatusInactive: "Inactive",
    pharmaStatusDeleted: "Deleted",
    pharmaNameRequired: "Pharmacy name is required",
    pharmaCategoryRequired: "Please select a category",
    pharmaPhoneRequired: "Phone number is required",
    pharmaAddressRequired: "Address is required",
    pharmaPermitNumberRequired: "Permit number is required",
    pharmaAdd: "Add",
    pharmaEdit: "Edit",
    pharmaDelete: "Delete",
    pharmaDetails: "Details",
    pharmaDeleteConfirmTitle: "Delete Pharmacy",
    pharmaDeleteConfirmDesc: "This will permanently remove the pharmacy from the system. This action cannot be undone. Are you sure you want to delete",
    pharmaSave: "Save",
    pharmaSaving: "Saving...",
    pharmaDeleting: "Deleting...",
    pharmaSearchPlaceholder: "Search pharmacies...",
    pharmaNoResults: "No pharmacies match your search",
    pharmaEmptyTitle: "No pharmacies yet",
    pharmaEmptyDesc: "Add your first pharmacy branch",
    pharmaTotal: "Total Pharmacies",
    pharmaSingular: "pharmacy",
    pharmaPlural: "pharmacies",
    pharmaDetailsTitle: "Pharmacy Details",
    pharmaRegistered: "Registered",
    pharmaUpdated: "Last Updated",
    pharmaCreateSuccess: "Pharmacy created successfully",
    pharmaUpdateSuccess: "Pharmacy updated successfully",
    pharmaDeleteSuccess: "Pharmacy deleted successfully",
    pharmaWizardStep1: "Pharmacy Info",
    pharmaWizardStep2: "Business License",
    pharmaWizardStep3: "User Role",
    pharmaWizardStep1Hint: "Enter the pharmacy's basic information",
    pharmaWizardStep2Hint: "Register the pharmacy's operating license (SIA)",
    pharmaWizardStep3Hint: "Assign an existing user to this pharmacy with a role",
    placementUser: "User",
    placementSelectUser: "Select a user",
    placementUserRequired: "User is required",
    pharmaNoHeadPharmacist: "No Head Pharmacist",
    pharmaNoHeadPharmacistHint: "This pharmacy has no Head Pharmacist yet and can't be selected",
    bizLicenseTitle: "Business License (SIA)",
    bizLicenseDesc: "Register the pharmacy's operating license",
    bizLicenseNumber: "License Number",
    bizLicenseNumberPlaceholder: "e.g. SIA-2024-001",
    bizLicenseValidFrom: "Valid From",
    bizLicenseValidUntil: "Valid Until",
    bizLicenseNumberRequired: "License number is required",
    bizLicenseValidFromRequired: "Valid from date is required",
    bizLicenseValidUntilRequired: "Valid until date is required",
    bizLicenseValidUntilAfterFrom: "Valid until must be after valid from",

    navRoles: "Roles",
    rolesSubtitle: "Manage roles and their permissions",
    roleAdd: "Add",
    roleEdit: "Edit",
    roleDelete: "Delete",
    roleDetails: "Details",
    roleName: "Role Name",
    roleNamePlaceholder: "e.g. Head Pharmacist",
    roleType: "Role Type",
    roleSelectType: "Select a type",
    roleTypeOwner: "Owner",
    roleTypeAdmin: "Admin",
    roleTypePharmacist: "Pharmacist",
    roleTypeHeadPharmacist: "Head Pharmacist",
    roleTypeCashier: "Cashier",
    roleStatus: "Status",
    roleStatusAll: "All Status",
    roleStatusActive: "Active",
    roleStatusInactive: "Inactive",
    roleStatusDeleted: "Deleted",
    roleIsGlobal: "Scope",
    roleScopeAll: "All",
    roleScopeGlobal: "Global",
    roleScopePharmacy: "Pharmacy",
    roleRequiresLicense: "Requires License",
    roleRequiresLicenseYes: "Yes — requires SIPA license",
    roleRequiresLicenseNo: "No — license not required",
    roleFilterType: "Type",
    roleFilterTypeAll: "All Types",
    rolePermissionCount: "permissions",
    roleNameRequired: "Role name is required",
    roleTypeRequired: "Please select a role type",
    roleSearchPlaceholder: "Search roles...",
    roleNoResults: "No roles match your search",
    roleEmptyTitle: "No roles yet",
    roleEmptyDesc: "Create your first role to manage access control",
    roleDetailsTitle: "Role Details",
    roleDeleteConfirmTitle: "Delete Role",
    roleDeleteConfirmDesc: "This will permanently remove this role from the system. This action cannot be undone.",
    roleSave: "Save",
    roleSaving: "Saving...",
    roleDeleting: "Deleting...",
    roleRegistered: "Registered",
    roleUpdated: "Last Updated",
    roleCreateSuccess: "Role created successfully",
    roleUpdateSuccess: "Role updated successfully",
    roleDeleteSuccess: "Role deleted successfully",
    roleManagePermissions: "Manage Permissions",
    rolePermissionsTitle: "Set Permissions",
    rolePermissionsDesc: "Select the permissions to assign to this role",
    rolePermissionsSave: "Save Permissions",
    rolePermissionsSaving: "Saving...",
    rolePermissionsSuccess: "Permissions updated successfully",
    rolePermissionsNone: "No permissions assigned",
    rolePermissionsSelectAll: "Select all",
    rolePermissionsDeselectAll: "Deselect all",
    rolePermissionsSearchPlaceholder: "Search permissions...",
    rolePermissionsNoResults: "No permissions match your search",

    poSubtitle: "Manage purchase orders to distributors",
    poAdd: "Add",
    poEdit: "Edit",
    poDelete: "Delete",
    poDetails: "Details",
    poCancel: "Cancel Order",
    poSubmit: "Print",
    poOrderNumber: "Order No.",
    poDistributor: "Distributor",
    poSelectDistributor: "Select a distributor",
    poDistributorRequired: "Distributor is required",
    poSignedBy: "Authorized By",
    poSelectSignedBy: "Select a signer (optional)",
    poDescription: "Notes",
    poDescriptionPlaceholder: "Additional notes about this order...",
    poCancellationReason: "Cancellation Reason",
    poCancellationReasonPlaceholder: "Explain why this order is being cancelled...",
    poCancellationReasonRequired: "Cancellation reason is required",
    poStatus: "Status",
    poStatusDraft: "Draft",
    poStatusSent: "Sent",
    poStatusCompleted: "Completed",
    poStatusCancelled: "Cancelled",
    poItemsSection: "Order Items",
    poItemMedicine: "Medicine",
    poItemSelectMedicine: "Select medicine",
    poItemMedicineRequired: "Please select a medicine",
    poItemQuantity: "Qty",
    poItemQuantityRequired: "Quantity must be a positive number",
    poItemUnit: "Unit",
    poItemUnitRequired: "Unit is required",
    poItemDescription: "Note",
    poItemDescriptionPlaceholder: "Optional note...",
    poItemAdd: "Add Item",
    poItemRemove: "Remove",
    poItemsRequired: "At least one item is required",
    poItemCount: "items",
    poTotal: "Total Purchase Orders",
    poSingular: "purchase order",
    poPlural: "purchase orders",
    poSearchPlaceholder: "Search by order number or distributor...",
    poNoResults: "No purchase orders match your search",
    poEmptyTitle: "No purchase orders yet",
    poEmptyDesc: "Create your first purchase order to start ordering from distributors",
    poDetailsTitle: "Purchase Order Details",
    poDeleteConfirmTitle: "Delete Purchase Order",
    poDeleteConfirmDesc: "This will permanently delete this draft purchase order. This action cannot be undone.",
    poCancelConfirmTitle: "Cancel Purchase Order",
    poCancelConfirmDesc: "This will cancel the purchase order and notify the distributor. Please provide a reason.",
    poSubmitConfirmTitle: "Print Purchase Order",
    poSubmitConfirmDesc: "Printing this order will submit it to the distributor. Make sure a signer is assigned before printing.",
    poSave: "Save",
    poSaving: "Saving...",
    poDeleting: "Deleting...",
    poCancelling: "Cancelling...",
    poSubmitting: "Printing...",
    poRegistered: "Created",
    poUpdated: "Last Updated",
    poOrderedAt: "Ordered At",
    poCreateSuccess: "Purchase order created successfully",
    poUpdateSuccess: "Purchase order updated successfully",
    poDeleteSuccess: "Purchase order deleted successfully",
    poCancelSuccess: "Purchase order cancelled successfully",
    poSubmitSuccess: "Purchase order printed and submitted",
    poCompleteSuccess: "Purchase order marked as complete",
    poDateFrom: "From",
    poDateTo: "To",
    poFilterStatus: "Status",
    poFilterDistributor: "Distributor",
    poRepurchase: "Repurchase",
    poPrint: "Print",
    poReprint: "Reprint",
    poPrinting: "Printing...",
    poPrintReceipt: "Print Receipt",
    poReceiptTitle: "PURCHASE ORDER",
    poReceiptPraktikApoteker: "Pharmacist Practice",
    poReceiptKepada: "To:",
    poReceiptTotalItems: "Total Items",
    poReceiptPenanggungJawab: "Responsible Pharmacist",
    poMarkReceived: "Mark as Received",
    poMarkReceivedConfirmTitle: "Mark Order as Received",
    poMarkReceivedConfirmDesc: "Confirm that the goods from this purchase order have been received from the distributor.",
    poMarkingReceived: "Marking...",

    invoicesSubtitle: "Manage supplier invoices and stock receipts",
    invoiceAdd: "Add",
    invoiceDelete: "Delete",
    invoiceDetails: "Details",
    invoiceNumber: "Invoice No.",
    invoiceNumberPlaceholder: "e.g. INV-2024-001",
    invoiceNumberRequired: "Invoice number is required",
    invoiceDate: "Invoice Date",
    invoiceDateRequired: "Invoice date is required",
    invoiceDueDate: "Due Date",
    invoiceDistributor: "Distributor",
    invoiceSelectDistributor: "Select a distributor",
    invoiceDistributorRequired: "Distributor is required",
    invoicePurchaseOrder: "Purchase Order",
    invoiceSelectPurchaseOrder: "Link to a purchase order (optional)",
    invoiceSignedBy: "Authorized By",
    invoiceSelectSignedBy: "Select a signer",
    invoiceSignedByRequired: "Signer is required",
    invoiceDescription: "Notes",
    invoiceDescriptionPlaceholder: "Additional notes about this invoice...",
    invoicePaymentStatus: "Payment Status",
    invoicePaymentStatusUnpaid: "Unpaid",
    invoicePaymentStatusPartial: "Partial",
    invoicePaymentStatusPaid: "Paid",
    invoiceTotalAmount: "Total Amount",
    invoicePaidAmount: "Paid Amount",
    invoiceItemsSection: "Invoice Items",
    invoiceItemMedicine: "Medicine",
    invoiceItemSelectMedicine: "Select medicine",
    invoiceItemMedicineRequired: "Please select a medicine",
    invoiceItemBatchNumber: "Batch No.",
    invoiceItemBatchNumberPlaceholder: "e.g. BT-20241201",
    invoiceItemBatchNumberRequired: "Batch number is required",
    invoiceItemExpiryDate: "Expiry Date",
    invoiceItemExpiryDateRequired: "Expiry date is required",
    invoiceItemQtyBox: "Qty Box",
    invoiceItemQtyBoxRequired: "Quantity (boxes) must be a positive number",
    invoiceItemQtyPerBox: "Per Box",
    invoiceItemQtyPerBoxRequired: "Quantity per box must be a positive number",
    invoiceItemQtyPieces: "Qty Pieces",
    invoiceItemQtyPiecesRequired: "Quantity (pieces) must be a positive number",
    invoiceItemPrice: "Price/Box",
    invoiceItemPriceRequired: "Price per box must be greater than 0",
    invoiceItemDiscount: "Disc %",
    invoiceItemFinalPrice: "Final Price",
    invoiceItemTotal: "Total Price",
    invoiceItemAdd: "Add Item",
    invoiceItemsRequired: "At least one item is required",
    invoiceItemCount: "items",
    invoiceSearchPlaceholder: "Search by invoice number or distributor...",
    invoiceNoResults: "No invoices match your search",
    invoiceEmptyTitle: "No invoices yet",
    invoiceEmptyDesc: "Create your first invoice to start tracking supplier deliveries",
    invoiceDetailsTitle: "Invoice Details",
    invoiceDeleteConfirmTitle: "Delete Invoice",
    invoiceDeleteConfirmDesc: "This will permanently delete this invoice and reverse the stock movements. This action cannot be undone.",
    invoiceSave: "Save",
    invoiceSaving: "Saving...",
    invoiceDeleting: "Deleting...",
    invoiceTotal: "Total Invoices",
    invoiceSingular: "invoice",
    invoicePlural: "invoices",
    invoiceRegistered: "Created",
    invoiceUpdated: "Last Updated",
    invoiceFilterStatus: "Status",
    invoiceFilterDistributor: "Distributor",
    invoiceCreateSuccess: "Invoice created successfully",
    invoiceDeleteSuccess: "Invoice deleted successfully",
    invoiceDateFrom: "From",
    invoiceDateTo: "To",
    invoiceReceiveDate: "Receive Date",
    invoicePpnEnabled: "Enable PPN",
    invoicePpnNominal: "PPN Amount (Rp)",
    invoiceDiscountNominal: "Discount Amount (Rp)",
    invoiceSubtotal: "Subtotal",
    invoiceDiscount: "Discount",
    invoiceRemaining: "Remaining",
    invoiceReceiveDateAfterInvoice: "Receive date must be after invoice date",
    invoiceItemIncomplete: "Incomplete",
    invoiceDueDateRequired: "Due date is required",
    invoiceReceiveDateRequired: "Receive date is required",
    invoiceItemsIncompleteWarning: "Complete all item data (batch no., expiry date, price) before saving",
    invoiceItemCabinet: "Cabinet",
    invoiceItemShelf: "Shelf",
    invoiceItemBin: "Bin",
    invoiceItemSelectBin: "Select bin",
    invoiceItemCabinetRequired: "Please select a cabinet",
    invoiceItemShelfRequired: "Please select a shelf",
    invoiceItemBinRequired: "Please select a bin",
    invoicePaymentSectionTitle: "Payment History",
    invoicePaymentAdd: "Add Payment",
    invoicePaymentAddBtn: "Add",
    invoicePaymentNoHistory: "No payments recorded yet",
    invoicePaymentMethodLabel: "Payment Method",
    invoicePaymentMethodCash: "Cash",
    invoicePaymentMethodTransfer: "Bank Transfer",
    invoicePaymentMethodCredit: "Credit",
    invoicePaymentAmountLabel: "Amount",
    invoicePaymentAmountPlaceholder: "0",
    invoicePaymentAmountRequired: "Amount is required",
    invoicePaymentDateLabel: "Payment Date",
    invoicePaymentDateRequired: "Payment date is required",
    invoicePaymentDescriptionLabel: "Note",
    invoicePaymentDescriptionPlaceholder: "Optional note",
    invoicePaymentAfterLabel: "After this payment",
    invoicePaymentPayFull: "Pay in full",
    invoicePaymentSave: "Save Payment",
    invoicePaymentSaving: "Saving...",
    invoicePaymentAddSuccess: "Payment recorded successfully",
    invoicePaymentDeleteTitle: "Delete Payment",
    invoicePaymentDeleteDesc: "This payment entry will be permanently removed and the paid amount will be reversed.",
    invoicePaymentDeleteSuccess: "Payment deleted successfully",
    invoicePaymentAlreadyPaid: "This invoice is already fully paid",

    stockSubtitle: "Monitor medicine inventory, batch details, and stock levels",
    stockSearchPlaceholder: "Search medicines...",
    stockNoResults: "No medicines match your search",
    stockEmptyTitle: "No stock records yet",
    stockEmptyDesc: "Stock is created automatically when invoices are received",
    stockMedicineName: "Medicine",
    stockTotalPieces: "Total Qty",
    stockReorderLevel: "Reorder At",
    stockEffectivePrice: "Effective Price",
    stockBasePrice: "Base Price",
    stockCalculatedPrice: "Calculated Price",
    stockDetails: "Details",
    stockDetailsTitle: "Stock Details",
    stockBatchSection: "Batch Details",
    stockBatchNumber: "Batch No.",
    stockBarcode: "Barcode",
    stockExpiryDate: "Expiry Date",
    stockQtyPieces: "Qty (Pieces)",
    stockQtyBox: "Qty (Box)",
    stockQtyPerBox: "Per Box",
    stockDistributor: "Distributor",
    stockUpdated: "Last Updated",
    stockSingular: "stock",
    stockPlural: "stocks",
    stockTotal: "Total Stocks",
    stockStatusNormal: "Normal",
    stockStatusLow: "Low Stock",
    stockStatusCritical: "Critical",
    stockFilterStatus: "Status",
    stockFilterLowStock: "Low Stock",
    stockFilterExpiringSoon: "Expiring Soon",
    stockManualPriceNote: "Manual price override",
    stockAdjust: "Adjust",
    stockAdjustTitle: "Adjust Stock",
    stockAdjustNewQty: "New Quantity",
    stockAdjustNewQtyPlaceholder: "Enter new quantity",
    stockAdjustNewQtyRequired: "Quantity must be 0 or greater",
    stockAdjustCurrentQty: "Current",
    stockAdjustDescription: "Reason / Notes",
    stockAdjustDescriptionPlaceholder: "Explain why this stock is being adjusted...",
    stockAdjustDescriptionRequired: "Reason is required",
    stockAdjustSignedBy: "Authorized By",
    stockAdjustSelectSignedBy: "Select a signer",
    stockAdjustSignedByRequired: "Signer is required",
    stockAdjustSave: "Adjust",
    stockAdjustSaving: "Adjusting...",
    stockAdjustSuccess: "Stock adjusted successfully",
    stockUpdatePrice: "Set Price",
    stockUpdatePriceTitle: "Set Selling Price",
    stockSellingPriceLabel: "Selling Price",
    stockSellingPricePlaceholder: "Leave empty to use calculated price",
    stockClearPriceHint: "Leave empty to reset to the auto-calculated price",
    stockUpdatePriceSave: "Save",
    stockUpdatePriceSaving: "Saving...",
    stockUpdatePriceSuccess: "Selling price updated successfully",
    stockUpdateReorder: "Set Reorder Level",
    stockUpdateReorderTitle: "Set Reorder Level",
    stockReorderLevelLabel: "Reorder Level",
    stockReorderLevelPlaceholder: "e.g. 50",
    stockReorderLevelRequired: "Reorder level must be 0 or greater",
    stockUpdateReorderSave: "Save",
    stockUpdateReorderSaving: "Saving...",
    stockUpdateReorderSuccess: "Reorder level updated successfully",
    stockDispose: "Dispose",
    stockReturn: "Return",
    stockPrint: "Print",
    printTitle: "Print barcode",
    printBatchLabel: "Batch label",
    printMedicineLabel: "Medicine label",
    printStockCard: "Stock card",
    printBatchLabelHint: "One code for the whole batch: every pack of it scans the same. Stock and ED can be shown.",
    printMedicineLabelHint: "For the shelf: one code for every batch. The till picks the batch that expires first.",
    printStockCardHint: "A5 card for the whole medicine: one row per day, all batches together.",
    printNoMedicineBarcode: "This medicine has no barcode yet. Add one (scan the pack or generate) in the medicine's form.",
    printSize: "Label size",
    printSizeThermal5030: "Thermal 50 × 30 mm",
    printSizeThermal3825: "Thermal 38 × 25 mm",
    printSizeA4: "A4 sheet, 3 × 8 (64 × 34 mm)",
    printCopies: "Number of labels",
    printShowPrice: "Show selling price",
    printItemLabel: "Item labels",
    printItemLabelHint: "One label per box, each with its own code (batch code + item number). No stock; shows the contents.",
    printFields: "Show on the label",
    printShowStock: "Batch stock",
    printShowTotalStock: "Total stock (all batches)",
    printShowExpiry: "Expiry date (ED)",
    printShowContents: "Contents (per box)",
    printStartNumber: "First item number",
    labelTotalStock: "Total stock",
    labelContents: "Contents",
    labelItem: "Item",
    labelBox: "box",
    printPreview: "Preview",
    printButton: "Print",
    printPopupBlocked: "The browser blocked the print window. Allow pop-ups for this site and try again.",
    labelBatch: "Batch",
    labelExpiry: "ED",
    labelStock: "Stock",
    labelAllBatches: "All batches",
    labelStockCard: "Stock card",
    labelPackaging: "Packaging",
    labelLocation: "Location",
    labelMinStock: "Min. stock",
    labelDate: "Date",
    labelIn: "In",
    labelOut: "Out",
    labelBalance: "Balance",
    labelInitials: "Initials",
    labelOpeningBalance: "Opening balance",
    labelPrintedOn: "Printed from PharmaCare ·",
    labelPage: "Page",
    labelNotes: "Notes",
    labelPeriod: "Period",
    labelSalesCount: "{n} sale(s)",
    labelAdjustmentsCount: "{n} adjustment(s)",
    labelBatchesInStock: "Batches in stock",
    navStockLabels: "Print Labels",
    stockLabelsSubtitle: "Barcode labels and stock cards, printed in one go",
    stockLabelsTabLabels: "Barcode labels",
    stockLabelsTabCard: "Stock card",
    stockLabelsSearch: "Search a medicine or scan its barcode…",
    stockLabelsSearchHint: "Search a medicine to add its labels.",
    stockLabelsNoResults: "No medicine in stock matches.",
    stockLabelsNoBatches: "No batch in stock",
    stockLabelsAdd: "Add",
    stockLabelsQueue: "Print queue",
    stockLabelsQueueEmpty: "No labels yet. Search a medicine, then add a batch, item or medicine label.",
    stockLabelsClear: "Clear",
    stockLabelsRemove: "Remove",
    stockLabelsTotal: "{n} label(s)",
    stockLabelsPrintAll: "Print all",
    stockLabelsSettings: "Label settings",
    stockLabelsLoading: "Loading label data…",
    stockLabelsSkippedNoBarcode: "{n} medicine label(s) skipped: the medicine has no barcode yet.",
    stockCardPickMedicine: "Choose a medicine",
    stockCardFrom: "From",
    stockCardTo: "To",
    stockCardPickHint: "Choose a medicine to see its stock card.",
    stockCardEmptyPeriod: "No movements in this period.",
    stockCardAfterPeriod: "Today's stock differs: {n} movement(s) happened after this period.",
    stockCardInvalidPeriod: "The start date must be before the end date, at most one year apart.",

    sdSubtitle: "Record and manage medicine stock write-offs and disposals",
    sdAdd: "Add",
    sdEdit: "Edit",
    sdDetails: "Details",
    sdDelete: "Delete",
    sdCancel: "Cancel",
    sdComplete: "Mark as Disposed",
    sdDetailsTitle: "Disposal Details",
    sdSave: "Save",
    sdSaving: "Saving...",
    sdDeleting: "Deleting...",
    sdCancelling: "Cancelling...",
    sdCompleting: "Processing...",
    sdStatusDraft: "Draft",
    sdStatusCompleted: "Completed",
    sdStatusCancelled: "Cancelled",
    sdReasonExpired: "Expired",
    sdReasonDamaged: "Damaged",
    sdReasonContaminated: "Contaminated",
    sdDisposalNumber: "Disposal #",
    sdStatus: "Status",
    sdDisposedAt: "Disposed At",
    sdSignedBy: "Authorized By",
    sdSelectSignedBy: "Select signer (optional)",
    sdDescription: "Description",
    sdDescriptionPlaceholder: "Optional notes about this disposal...",
    sdCancellationReason: "Cancellation Reason",
    sdCancellationReasonPlaceholder: "Reason for cancellation...",
    sdCancellationReasonRequired: "Cancellation reason is required",
    sdItemsSection: "Items",
    sdItemBatch: "Stock Batch",
    sdItemSelectBatch: "Select stock batch",
    sdItemQuantity: "Qty (pieces)",
    sdItemReason: "Reason",
    sdItemSelectReason: "Select reason",
    sdItemAdd: "Add Item",
    sdItemBatchRequired: "Stock batch is required",
    sdItemQuantityRequired: "Quantity must be a positive integer",
    sdItemReasonRequired: "Reason is required",
    sdItemsRequired: "At least one item is required",
    sdItemCount: "items",
    sdSingular: "item",
    sdPlural: "items",
    sdSearchPlaceholder: "Search disposals...",
    sdNoResults: "No disposals match your search",
    sdEmptyTitle: "No disposals yet",
    sdEmptyDesc: "Create a disposal record to write off expired or damaged stock",
    sdFilterStatus: "Status",
    sdDeleteConfirmTitle: "Delete Disposal",
    sdDeleteConfirmDesc: "This will permanently remove the draft disposal. This action cannot be undone.",
    sdCancelConfirmTitle: "Cancel Disposal",
    sdCancelConfirmDesc: "Provide a reason for cancellation. If already completed, stock will be restored.",
    sdCompleteConfirmTitle: "Mark as Disposed",
    sdCompleteConfirmDesc: "This will deduct the listed quantities from stock. This action can only be reversed by cancelling the disposal.",
    sdCompleteNoSignerWarning: "No signer is assigned. The server requires a signer before completion.",
    sdCreateSuccess: "Disposal created successfully",
    sdUpdateSuccess: "Disposal updated successfully",
    sdDeleteSuccess: "Disposal deleted successfully",
    sdCancelSuccess: "Disposal cancelled",
    sdCompleteSuccess: "Disposal marked as completed",
    sdBatchLabel: "Batch",
    sdExpiryLabel: "Exp",

    // Sales History page
    salesSubtitle: "View and manage sales transactions and payments",
    saleNewSale: "New Sale",
    saleDetails: "Details",
    saleDetailsTitle: "Sale Details",
    saleCancel: "Cancel",
    saleCancelling: "Cancelling...",
    saleRefund: "Refund",
    saleRefunding: "Refunding...",
    saleNumber: "Sale Number",
    saleStatus: "Status",
    saleType: "Sale Type",
    saleTypeCash: "Cash",
    saleTypeCredit: "Credit",
    saleStatusCompleted: "Completed",
    saleStatusCancelled: "Cancelled",
    saleStatusRefunded: "Refunded",
    saleStatusPending: "Pending",
    salePatient: "Patient",
    saleSoldAt: "Sold At",
    saleDueDate: "Due Date",
    saleDescription: "Description",
    saleTotalAmount: "Total Amount",
    saleTaxAmount: "PPN",
    salePaidAmount: "Paid Amount",
    saleRemaining: "Remaining",
    saleItemsSection: "Items",
    saleBatchLabel: "Batch",
    saleDiscountLabel: "Discount",
    saleSearchPlaceholder: "Search by sale number or patient...",
    saleNoResults: "No results found",
    saleEmptyTitle: "No sales found",
    saleEmptyDesc: "Sales will appear here once a checkout is completed",
    saleFilterStatus: "Status",
    saleFilterType: "Sale Type",
    saleFilterPaymentStatus: "Payment Status",
    saleFilterPatient: "Patient",
    saleCancelConfirmTitle: "Cancel Sale",
    saleCancelConfirmDesc: "This will cancel the sale and reverse its stock movement. This action cannot be undone.",
    saleCancelReason: "Cancellation Reason",
    saleCancelReasonPlaceholder: "Enter the reason for cancelling this sale",
    saleCancelReasonRequired: "Cancellation reason is required",
    saleCancelSuccess: "Sale cancelled successfully",
    saleRefundConfirmTitle: "Refund Sale",
    saleRefundConfirmDesc: "This will refund the sale and reverse its stock movement. This action cannot be undone.",
    saleRefundReason: "Refund Reason",
    saleRefundReasonPlaceholder: "Enter the reason for refunding this sale",
    saleRefundReasonRequired: "Refund reason is required",
    saleRefundSuccess: "Sale refunded successfully",
    salePaymentStatusColumn: "Payment Status",
    salePaymentStatusUnpaid: "Unpaid",
    salePaymentStatusPartial: "Partial",
    salePaymentStatusPaid: "Paid",
    salePaymentMethodCash: "Cash",
    salePaymentMethodTransfer: "Transfer",
    salePaymentMethodCredit: "Credit",
    salePaymentHistorySection: "Payment History",
    salePaymentAdd: "Add Payment",
    salePaymentAddSuccess: "Payment added successfully",
    salePaymentMethodLabel: "Payment Method",
    salePaymentAmountLabel: "Amount",
    salePaymentAmountPlaceholder: "Enter payment amount",
    salePaymentAmountRequired: "Payment amount is required",
    salePaymentPayFull: "Pay full remaining amount",
    salePaymentAfterLabel: "Remaining after this payment",
    salePaymentDateLabel: "Payment Date",
    salePaymentDateRequired: "Payment date is required",
    salePaymentDescriptionLabel: "Description",
    salePaymentDescriptionPlaceholder: "Enter a note for this payment (optional)",
    salePaymentSave: "Save",
    salePaymentSaving: "Saving...",
    saleComplete: "Complete",
    saleCompleting: "Completing...",
    saleCompleteConfirmTitle: "Complete Sale",
    saleCompleteConfirmDesc: "This will finalize the held sale and mark it as completed.",
    saleCompleteSuccess: "Sale completed successfully",
    salePrescriptionSection: "Prescription",
    salePrescriptionNumber: "Prescription No.",
    salePrescriptionDoctor: "Doctor",
    salePrescriptionDate: "Prescribed At",

    // Cashier / POS page
    posSubtitle: "Process sales transactions for walk-in and registered patients",
    posSearchLabel: "Search Medicine",
    posSearchPlaceholder: "Scan barcode or search by name / SKU...",
    posBatchLabel: "Batch",
    posScanBarcode: "Scan barcode",
    posScanModalTitle: "Scan Barcode",
    posScanInstructions: "Point the camera at the product barcode",
    posScanNotFound: "No product found for this barcode",
    posScanCameraError: "Unable to access the camera",
    posCategoryAll: "All",
    posProductsCountLabel: "products",
    posStockLabel: "Stock",
    posStockRemainingLabel: "Left",
    posOutOfStock: "Out of stock",
    posNoProductsTitle: "No products found",
    posNoProductsDesc: "Try a different search term or category",
    posLoadMore: "Load more",
    posTransactionLabel: "Transaction",
    posReset: "Reset",
    posSelectPatient: "Select patient",
    posAddNote: "Add note",
    posHold: "Hold",
    posHolding: "Holding...",
    posHoldSuccess: "Sale held successfully",
    posHeldSalesBtn: "Held",
    posHeldSalesTitle: "Held Transactions",
    posHeldSalesEmpty: "No held transactions",
    posHeldSalesResume: "Resume",
    posHeldSalesResuming: "Resuming...",
    posHeldSalesResumeSuccess: "Transaction resumed",
    posHeldSalesClearWarning: "Your current cart will be cleared",
    posHeldSalesContinue: "Continue",
    posHeldSalesCancelHeld: "Cancel Hold",
    posHeldSalesCancelSuccess: "Transaction cancelled",
    posHeldSalesCancelConfirmTitle: "Cancel this hold?",
    posHeldSalesCancelConfirmDesc: "This held transaction will be permanently cancelled and cannot be undone.",
    posCartSection: "Cart",
    posCartEmptyTitle: "Cart is empty",
    posCartEmptyDesc: "Search and add medicines to start a sale",
    posPatientLabel: "Patient",
    posWalkInPatient: "Walk-in Patient",
    posPrescriptionLabel: "Prescription",
    posPrescriptionPlaceholder: "Search prescription...",
    posPrescriptionOptional: "Optional — link a prescription to this sale",
    posRxNoPrescriptionWarning: "Cart contains Rx items — a prescription must be linked before checkout",
    posRxNoPatientWarning: "Prescription sales require a registered patient — walk-in is not allowed",
    posCreatePrescriptionButton: "New",
    posCreatePrescriptionTitle: "New Prescription",
    posCreatePrescriptionRequiresPatient: "Select a patient first to create a prescription",
    posCreatePrescriptionSuccess: "Prescription created and linked",
    posCreatePrescriptionSave: "Create & Link",
    posSaleTypeLabel: "Sale Type",
    posCreditRequiresPatient: "A registered patient is required for credit sales",
    posDescriptionLabel: "Description",
    posDescriptionPlaceholder: "Enter a note for this sale (optional)",
    posSubtotal: "Subtotal",
    posTaxNote: "PPN will be calculated at checkout",
    posCheckout: "Checkout",
    posProcessing: "Processing...",
    posStockInsufficient: "Insufficient Stock",
    posStockAvailable: "available",
    posStockExceededItems: "Insufficient stock for:",
    posSaleSuccessTitle: "Payment Successful",
    posNewSale: "New Transaction",
    posPayLabel: "Pay",
    posSelectPaymentMethod: "Select a payment method.",
    posMethodSectionLabel: "Method",
    posPaymentMethodCard: "Card",
    posPaymentMethodCardDesc: "Debit / Credit / QRIS",
    posPaymentMethodCash: "Cash",
    posPaymentMethodCashDesc: "Cash drawer opens",
    posPaymentMethodCredit: "Credit",
    posPaymentMethodCreditDesc: "Patient pays later",
    posDownPaymentLabel: "Down payment",
    posRemainingLabel: "Remaining balance",
    posSummaryLabel: "Summary",
    posPaymentCancel: "Cancel",
    posAcceptCash: "Accept cash",
    posAcceptCard: "Accept card",
    posAcceptCredit: "Confirm credit sale",
    posReceiptSubtitle: "Receipt ready to print or generate an invoice.",
    posReceiptLabel: "Receipt",
    posReceiptDateLabel: "Date",
    posReceiptCashierLabel: "Cashier",
    posDiscountLabel: "Discount",
    posViaLabel: "via",
    posChangeLabel: "change",
    posPrintReceipt: "Print receipt",
    posPrintInvoice: "Invoice",
    saleDocPayment: "Payment",
    saleDocThankYouVisit: "Thank you for your visit",
    saleDocInvoiceTitle: "Invoice",
    saleDocBilledTo: "Billed to",
    saleDocPaymentMethod: "Payment Method",
    saleDocItemDescription: "Description",
    saleDocItemQty: "Qty",
    saleDocItemPrice: "Price",
    saleDocItemAmount: "Amount",
    saleDocThankYouTrust: "Thank you for your trust in",
    saleDocQuestions: "Questions?",

    navStockReturns: "Stock Returns",
    srSubtitle: "Record and manage medicine stock returns to distributors",
    srAdd: "Add",
    srEdit: "Edit",
    srDetails: "Details",
    srDelete: "Delete",
    srCancel: "Cancel",
    srReject: "Reject",
    srComplete: "Complete",
    srDetailsTitle: "Return Details",
    srSave: "Save",
    srSaving: "Saving...",
    srDeleting: "Deleting...",
    srCancelling: "Cancelling...",
    srRejecting: "Rejecting...",
    srCompleting: "Processing...",
    srStatusInProgress: "In Progress",
    srStatusCompleted: "Completed",
    srStatusCancelled: "Cancelled",
    srStatusRejected: "Rejected",
    srReturnNumber: "Return #",
    srStatus: "Status",
    srReturnedAt: "Returned At",
    srDistributor: "Distributor",
    srSelectDistributor: "Select a distributor",
    srDistributorRequired: "Distributor is required",
    srSignedBy: "Authorized By",
    srSelectSignedBy: "Select signer (optional)",
    srReason: "Reason",
    srReasonPlaceholder: "Return reason (e.g. damaged, expired)...",
    srDescription: "Description",
    srDescriptionPlaceholder: "Optional notes about this return...",
    srCancellationReason: "Cancellation Reason",
    srCancellationReasonPlaceholder: "Reason for cancellation...",
    srCancellationReasonRequired: "Cancellation reason is required",
    srRejectionReason: "Rejection Reason",
    srRejectionReasonPlaceholder: "Reason for rejection...",
    srRejectionReasonRequired: "Rejection reason is required",
    srItemsSection: "Items",
    srItemBatch: "Stock Batch",
    srItemSelectBatch: "Select stock batch",
    srItemQuantity: "Qty (pieces)",
    srItemReason: "Reason",
    srItemReasonPlaceholder: "Optional return reason...",
    srItemAdd: "Add Item",
    srItemBatchRequired: "Stock batch is required",
    srItemQuantityRequired: "Quantity must be a positive integer",
    srItemsRequired: "At least one item is required",
    srItemCount: "items",
    srSingular: "item",
    srPlural: "items",
    srSearchPlaceholder: "Search returns...",
    srNoResults: "No returns match your search",
    srEmptyTitle: "No stock returns yet",
    srEmptyDesc: "Create a return record to send stock back to the distributor",
    srFilterStatus: "Status",
    srFilterDistributor: "Distributor",
    srDeleteConfirmTitle: "Delete Stock Return",
    srDeleteConfirmDesc: "This will permanently remove the draft stock return. This action cannot be undone.",
    srCancelConfirmTitle: "Cancel Stock Return",
    srCancelConfirmDesc: "This will cancel the stock return. Provide a reason for the cancellation.",
    srRejectConfirmTitle: "Reject Stock Return",
    srRejectConfirmDesc: "This will mark the return as rejected by the distributor. Provide a reason for rejection.",
    srCompleteConfirmTitle: "Complete Return",
    srCompleteConfirmDesc: "This will deduct the listed quantities from stock. This action can only be reversed by rejecting the return.",
    srCompleteNoSignerWarning: "No signer is assigned. Consider assigning a signer before completing.",
    srCreateSuccess: "Stock return created successfully",
    srUpdateSuccess: "Stock return updated successfully",
    srDeleteSuccess: "Stock return deleted successfully",
    srCancelSuccess: "Stock return cancelled",
    srRejectSuccess: "Stock return rejected",
    srCompleteSuccess: "Stock return completed",
    srBatchLabel: "Batch",
    srExpiryLabel: "Exp",
    srInvoiceLabel: "Invoice",
    srInvoice: "Invoice",
    srSearchInvoice: "Type invoice number...",
    srSelectInvoice: "Select an invoice",
    srInvoiceRequired: "Invoice is required",
    srInvoiceItems: "Items from Invoice",
    srReturnQty: "Return Qty",
    srItemNoStock: "Batch not found in current stock",
    srItemOutOfStock: "No stock available",
    srItemAvailable: "Available",
    srNoInvoiceSelected: "Search and select an invoice to view its items",
    srItemsCheckedRequired: "Select at least one item to return",
    srReturnQtyBox: "Return Qty (boxes)",
    srPricePerBox: "Price/Box",
    srDiscountLabel: "Discount",
    srEstimatedReturn: "Est. Return",
    srTotalEstimated: "Total Estimated Return",
    srTotalAmount: "Total Return Value",
    sdMedicine: "Medicine",
    sdSelectMedicine: "Select a medicine...",
    sdMedicineRequired: "Medicine is required",
    sdBarcodeOrBatch: "Barcode / Batch ID",
    sdBarcodePlaceholder: "Enter barcode or batch number...",
    sdBarcodeNotFound: "No batch found for this barcode",

    // Stock Movements page
    navStockMovements: "Inventory Movements",
    smSubtitle: "View and track all stock movements and transactions",
    smType: "Type",
    smReason: "Reason",
    smMedicine: "Medicine",
    smBatch: "Batch",
    smQuantity: "Quantity",
    smQuantityBefore: "Before",
    smQuantityAfter: "After",
    smReference: "Reference",
    smCreatedBy: "Created By",
    smDate: "Date",
    smTypeIn: "Stock In",
    smTypeOut: "Stock Out",
    smReasonPurchase: "Purchase",
    smReasonSale: "Sale",
    smReasonReturn: "Return",
    smReasonAdjustment: "Adjustment",
    smReasonDisposal: "Disposal",
    smReasonDamaged: "Damaged",
    smReasonTransfer: "Transfer",
    smReasonDonation: "Donation",
    smDetails: "Details",
    smDetailsTitle: "Movement Details",
    smSearchPlaceholder: "Search by medicine name...",
    smNoResults: "No movements match your filters",
    smEmptyTitle: "No stock movements yet",
    smEmptyDesc: "Stock movements are recorded automatically with each transaction",
    smFilterType: "Type",
    smFilterReason: "Reason",
    smDescription: "Description",

    // Reports page
    reportsSubtitle: "View and analyze pharmacy performance across all areas",
    reportsSalesTab: "Sales",
    reportsPurchaseTab: "Purchases",
    reportsInventoryTab: "Inventory",
    reportsStockMovementTab: "Inventory Movements",
    reportsDisposalTab: "Disposals",
    reportsReturnsTab: "Returns",
    reportSummaryTitle: "Summary",
    reportNoData: "No data available",
    reportDays: "days",
    reportPeriodMonthly: "Current Month",
    reportPeriodCustom: "Custom",
    reportDateFrom: "From date",
    reportDateTo: "To date",
    reportSalesTotalRevenue: "Total Revenue",
    reportSalesTotalSales: "Total Sales",
    reportSalesAvgOrder: "Avg. Order Value",
    reportSalesPaymentBreakdown: "Payment Breakdown",
    reportSalesTopMedicines: "Top Medicines",
    reportSalesDailyRevenue: "Daily Revenue",
    reportSalesMedicine: "Medicine",
    reportSalesQtyPieces: "Qty (pcs)",
    reportSalesRevenue: "Revenue",
    reportSalesDate: "Date",
    reportSalesTransactions: "Transactions",
    reportSalesMethod: "Payment Method",
    reportSalesSaleNumber: "Sale No.",
    reportSalesPatient: "Patient",
    reportSalesSaleType: "Sale Type",
    reportSalesStatus: "Status",
    reportSalesTotalAmount: "Total Amount",
    reportSalesDiscountPct: "Disc. %",
    reportSalesDiscountAmt: "Disc. Amount",
    reportSalesPPN: "PPN",
    reportSalesGrandTotal: "Grand Total",
    reportSalesPaidAmount: "Paid Amount",
    reportSalesPaymentStatus: "Payment Status",
    reportPurchaseTotalInvoices: "Total Invoices",
    reportPurchaseTotalAmount: "Total Amount",
    reportPurchasePaidAmount: "Paid",
    reportPurchaseUnpaidAmount: "Unpaid",
    reportPurchaseByDistributor: "By Distributor",
    reportPurchaseInvoiceList: "Invoice List",
    reportPurchaseDistributor: "Distributor",
    reportPurchaseInvoiceCount: "Invoices",
    reportPurchaseInvoiceNumber: "Invoice No.",
    reportPurchaseDate: "Date",
    reportPurchasePONumber: "PO No.",
    reportPurchaseStatus: "Status",
    reportPurchaseFilterDistributor: "Distributor",
    reportInventoryTotalMedicines: "Total Medicines",
    reportInventoryStockValue: "Total Stock Value",
    reportInventoryLowStockCount: "Low Stock",
    reportInventoryExpiredCount: "Expired",
    reportInventoryExpiringSoonCount: "Expiring Soon",
    reportInventoryExpiryDays: "Show items expiring within",
    reportInventoryStockLevels: "All Stock Levels",
    reportInventoryLowStockSection: "Low Stock Items",
    reportInventoryExpiringSoonSection: "Expiring Soon",
    reportInventoryExpiredSection: "Expired Items",
    reportInventoryMedicine: "Medicine",
    reportInventoryUnit: "Unit",
    reportInventoryPieces: "Stock (pcs)",
    reportInventoryReorderLevel: "Reorder Level",
    reportInventoryBasePrice: "Base Price",
    reportInventorySellingPrice: "Selling Price",
    reportInventoryStatus: "Status",
    reportInventoryBatch: "Batch",
    reportInventoryExpiryDate: "Expiry Date",
    reportInventoryDaysLeft: "Days Left",
    reportInventoryDistributor: "Distributor",
    reportInventoryStatusLow: "Low Stock",
    reportInventoryStatusNormal: "Normal",
    reportSMTotalMovements: "Total Movements",
    reportSMTotalIn: "Total Stock In",
    reportSMTotalOut: "Total Stock Out",
    reportSMMovementList: "Movement List",
    reportSMMedicine: "Medicine",
    reportSMBatch: "Batch",
    reportSMType: "Type",
    reportSMReason: "Reason",
    reportSMQty: "Qty",
    reportSMBefore: "Before",
    reportSMAfter: "After",
    reportSMDate: "Date",
    reportSMReference: "Reference",
    reportSMFilterType: "Type",
    reportSMFilterReason: "Reason",
    reportDisposalTotalDisposals: "Total Disposals",
    reportDisposalTotalItems: "Total Items",
    reportDisposalTotalQty: "Total Qty (pcs)",
    reportDisposalByReason: "By Reason",
    reportDisposalList: "Disposal List",
    reportDisposalNumber: "Disposal No.",
    reportDisposalDate: "Date",
    reportDisposalMedicine: "Medicine",
    reportDisposalBatch: "Batch",
    reportDisposalQty: "Qty (pcs)",
    reportDisposalReason: "Reason",
    reportDisposalStatus: "Status",
    reportDisposalCount: "Count",
    reportReturnTotalReturns: "Total Returns",
    reportReturnTotalItems: "Total Items",
    reportReturnTotalQty: "Total Qty (pcs)",
    reportReturnByDistributor: "By Distributor",
    reportReturnList: "Return List",
    reportReturnNumber: "Return No.",
    reportReturnDate: "Date",
    reportReturnDistributor: "Distributor",
    reportReturnMedicine: "Medicine",
    reportReturnBatch: "Batch",
    reportReturnQty: "Qty (pcs)",
    reportReturnReason: "Reason",
    reportReturnStatus: "Status",
    reportReturnCount: "Returns",
    reportReturnFilterDistributor: "Distributor",
    reportExport: "Export",
    reportExportCsv: "Export CSV",
    reportExportExcel: "Export Excel",

    // Storage page
    navStorage: "Storage",
    storageSubtitle: "Manage cabinets, shelves, and bins for physical stock locations",
    storageFilterStatus: "Status",
    storageStatusActive: "Active",
    storageStatusInactive: "Inactive",

    // Storage — Cabinet
    cabinetAdd: "Add",
    cabinetEdit: "Edit",
    cabinetDelete: "Delete",
    cabinetDetails: "Details",
    cabinetName: "Cabinet Name",
    cabinetNamePlaceholder: "e.g. Cabinet A",
    cabinetNameRequired: "Cabinet name is required",
    cabinetCode: "Code",
    cabinetCodePlaceholder: "e.g. CAB-A",
    cabinetCodeRequired: "Cabinet code is required",
    cabinetDescription: "Description",
    cabinetDescriptionPlaceholder: "Optional notes about this cabinet",
    cabinetStatus: "Status",
    cabinetSearchPlaceholder: "Search by name or code...",
    cabinetNoResults: "No cabinets match your search",
    cabinetEmptyTitle: "No cabinets yet",
    cabinetEmptyDesc: "Add your first storage cabinet to start organizing stock locations",
    cabinetDeleteConfirmTitle: "Delete Cabinet",
    cabinetDeleteConfirmDesc: "This cabinet will be permanently deleted. All shelves must be removed first.",
    cabinetSave: "Save Cabinet",
    cabinetSaving: "Saving...",
    cabinetDeleting: "Deleting...",
    cabinetCreateSuccess: "Cabinet created successfully",
    cabinetUpdateSuccess: "Cabinet updated successfully",
    cabinetDeleteSuccess: "Cabinet deleted successfully",
    cabinetViewShelves: "View Shelves",

    // Storage — Shelf
    shelfAdd: "Add",
    shelfEdit: "Edit",
    shelfDelete: "Delete",
    shelfDetails: "Details",
    shelfName: "Shelf Name",
    shelfNamePlaceholder: "e.g. Shelf 1",
    shelfNameRequired: "Shelf name is required",
    shelfCode: "Code",
    shelfCodePlaceholder: "e.g. S1",
    shelfCodeRequired: "Shelf code is required",
    shelfLevel: "Level",
    shelfLevelPlaceholder: "e.g. 1",
    shelfDescription: "Description",
    shelfDescriptionPlaceholder: "Optional notes about this shelf",
    shelfStatus: "Status",
    shelfSearchPlaceholder: "Search by name or code...",
    shelfNoResults: "No shelves match your search",
    shelfEmptyTitle: "No shelves yet",
    shelfEmptyDesc: "Add shelves to this cabinet to organize your bins",
    shelfDeleteConfirmTitle: "Delete Shelf",
    shelfDeleteConfirmDesc: "This shelf will be permanently deleted. All bins must be removed first.",
    shelfSave: "Save Shelf",
    shelfSaving: "Saving...",
    shelfDeleting: "Deleting...",
    shelfCreateSuccess: "Shelf created successfully",
    shelfUpdateSuccess: "Shelf updated successfully",
    shelfDeleteSuccess: "Shelf deleted successfully",
    shelfViewBins: "View Bins",

    // Storage — Bin
    binAdd: "Add",
    binEdit: "Edit",
    binDelete: "Delete",
    binDetails: "Details",
    binName: "Bin Name",
    binNamePlaceholder: "e.g. Bin 01",
    binNameRequired: "Bin name is required",
    binCode: "Code",
    binCodePlaceholder: "e.g. B01",
    binCodeRequired: "Bin code is required",
    binDescription: "Description",
    binDescriptionPlaceholder: "Optional notes about this bin",
    binStatus: "Status",
    binSearchPlaceholder: "Search by name or code...",
    binNoResults: "No bins match your search",
    binEmptyTitle: "No bins yet",
    binEmptyDesc: "Add bins to this shelf to assign stock locations",
    binDeleteConfirmTitle: "Delete Bin",
    binDeleteConfirmDesc: "This bin will be permanently deleted. It must not be assigned to any medicines or stock batches.",
    binSave: "Save Bin",
    binSaving: "Saving...",
    binDeleting: "Deleting...",
    binCreateSuccess: "Bin created successfully",
    binUpdateSuccess: "Bin updated successfully",
    binDeleteSuccess: "Bin deleted successfully",

    // Inventory page
    navInventory: "Inventory",
    inventorySubtitle: "Visualize and browse your pharmacy's physical storage layout",
    inventoryCanvasTitle: "Warehouse Floor Plan",
    inventorySelectBinPrompt: "Select a bin from the left panel to view its contents",
    inventoryNoCabinets: "No cabinets found. Add cabinets in the Storage module first.",
    inventoryBinEmpty: "This bin has no items",
    inventoryBinItemsTitle: "Bin Contents",
    inventoryExpiryOk: "OK",
    inventoryExpirySoon: "Expiring Soon",
    inventoryExpired: "Expired",
    inventoryBatchLabel: "Batch",
    inventoryBarcodeLabel: "Barcode",
    inventoryExpiryLabel: "Expiry",
    inventoryRemainingLabel: "Remaining",
    inventoryDistributorLabel: "Distributor",
    inventoryItemCount: "item",
    inventoryWarehouseLabel: "Warehouse",
    inventoryCanvasSaveSuccess: "Cabinet position saved",
    inventoryRotate: "Rotate",
    inventoryShelvesLabel: "shelves",
    inventoryBinsLabel: "bins",
    inventoryNoShelves: "No shelves in this cabinet",
    inventoryNoBins: "No bins in this shelf",
    userTempPasswordTitle: "Temporary password",
    userTempPasswordDesc: "Give this password to the user. It is shown only once — they must change it on next login.",
    copy: "Copy",
    copied: "Copied",
    done: "Done",
    errNetwork: "Cannot reach the server. Check your internet connection, or make sure the server is running.",
    errTimeout: "The server took too long to respond. Please check whether the action went through before trying again.",
    errBadResponse: "The server returned an unexpected response (HTTP {status}). The server address may be wrong.",
    errServer: "A server error occurred (HTTP {status}). Please try again; contact support if it persists.",
    errForbidden: "You do not have permission for this action.",
    errOffline: "You are offline. Reconnect to the internet and try again.",
    forbiddenTitle: "You don't have access to this page",
    forbiddenDesc: "Ask the pharmacy owner to grant your role access if you need it.",
    notFoundTitle: "Page not found",
    notFoundDesc: "The page you opened doesn't exist or has moved.",
    backToHome: "Back to home",
    backToList: "Back",
    posQtyLabel: "Qty",
    posAddBox: "+1 box",
    posBoxUnit: "box",
    posPcsUnit: "pcs",
    posAvailableShort: "{n} available",
    posPriceLockedHint: "Price changes need the 'override price' permission",
    posEditPriceHint: "Click to change the price",
    posRxRequiredBadge: "Prescription required",
    posTabProducts: "Products",
    posTabCart: "Cart",
    posShortcutSearch: "Search",
    posShortcutHold: "Hold",
    posShortcutPay: "Pay",
    posShortcutsTitle: "Shortcuts",
    posScannerReady: "Barcode scanner ready — scan anytime",
    posScanAdded: "Added: {name}",
    posDraftRestored: "Your unfinished cart was restored",
    posAmountReceived: "Amount received",
    posExactAmount: "Exact",
    posChangeDue: "Change",
    posAmountShort: "Amount received is less than the total",
    posDiscountMaxHint: "Max {n}% for your role",
    posDiscountLimited: "Discount was limited to {n}%",
    posTotalsByServer: "Totals are verified by the server at checkout",
    posRemoveItem: "Remove",
    datePickPlaceholder: "Pick a date",
    dateToday: "Today",
    dateClear: "Clear",
    medicalRecordVisitTimelineEmpty: "No visits recorded yet",
    medicalRecordVisitLatest: "Latest",
    medicalRecordVisitDaysAgo: "{n} days ago",
    medicalRecordVisitToday: "Today",
    medicalRecordVisitYesterday: "Yesterday",
    medicalRecordVisitBy: "by",
    medicalRecordVisitFutureDate: "Visit date can't be in the future",
    placementHeadPharmacist: "Head Pharmacist",
    placementHeadPharmacistDesc: "Responsible pharmacist for this pharmacy (one per pharmacy, needs an active license). The owner can be the Head Pharmacist too.",
    placementHeadPharmacistForced: "Always on for the Head Pharmacist role",
    medicalRecordAllergyEdit: "Edit allergy",
    medicalRecordAllergyUpdateSuccess: "Allergy updated",
    medicalRecordLastVisit: "Last visit",
    medicalRecordNoKnownAllergies: "No known allergies",
    medicalRecordNotSet: "Not set",
    medicalRecordManage: "Manage",
    medicalRecordVisitSectionExam: "Examination",
    medicalRecordVisitSectionAssessment: "Diagnosis & plan",
    medicalRecordVisitNotesLabel: "Notes / treatment",
    medicalRecordVisitCreatePrescription: "Write prescription",
    medicalRecordVisitNoPrescription: "No prescription",
    medicalRecordVisitOpenPrescription: "Open prescription",
    medicalRecordVisitPrescriptionNoNumber: "Prescription",
    prescriptionFromVisit: "From visit",
    medicalRecordPatientInfo: "Patient data",
    navExaminations: "Examinations",
    examSubtitle: "Today's patient queue and the doctor's examination room",
    examCheckIn: "Register patient",
    examCheckInTitle: "Register patient to the queue",
    examCheckInDesc: "Pick the patient who arrived. A new patient can be registered right here.",
    examPatient: "Patient",
    examPatientPlaceholder: "Search patient name",
    examPatientRequired: "Choose a patient",
    examDoctorOptional: "Doctor (optional)",
    examDoctorPlaceholder: "Any doctor",
    examComplaintPlaceholder: "e.g. fever for 2 days",
    examCheckInSuccess: "Patient added to the queue",
    examStatusWaiting: "Waiting",
    examStatusInProgress: "In exam",
    examStatusCompleted: "Done",
    examStatusCancelled: "Cancelled",
    examQueueEmpty: "No patients here yet",
    examWaitingFor: "waiting {n} min",
    examSelectTitle: "Choose a patient from the queue",
    examSelectDesc: "The examination opens here",
    examCallIn: "Call in & examine",
    examCancel: "Cancel visit",
    examCancelTitle: "Cancel this visit?",
    examCancelDesc: "The patient leaves the queue. Nothing is written to the medical record.",
    examCancelReasonPlaceholder: "Reason (optional), e.g. went home",
    examCancelConfirm: "Cancel visit",
    examKeep: "Keep",
    examSaveDraft: "Save draft",
    examSavedDraft: "Draft saved",
    examComplete: "Finish examination",
    examCompleteSuccess: "Examination finished",
    examCompleteWithRx: "Examination finished, prescription sent to the pharmacy",
    examAllergies: "Allergies",
    examNoAllergies: "No known allergies",
    examPrescription: "Prescription",
    examPrescriptionHint: "Optional. Leave empty if no medicine is needed.",
    examAddMedicine: "Add medicine",
    examMedicine: "Medicine",
    examMedicinePlaceholder: "Choose or type",
    examUseTyped: "Use \"{v}\"",
    examQty: "Qty",
    examFrequency: "Dosage",
    examFrequencyPlaceholder: "3x1",
    examDuration: "Duration",
    examDurationPlaceholder: "5 days",
    examRemoveLine: "Remove",
    examRxNotes: "Notes for the pharmacist",
    examAllergyWarningTitle: "Possible allergy",
    examAllergyWarningLine: "{medicine} — patient is allergic to {allergen}",
    examAllergyConfirmTitle: "Prescribe despite the allergy warning?",
    examAllergyConfirmDesc: "The check matches names only. Confirm you have reviewed it.",
    examAllergyConfirm: "Yes, I have reviewed it",
    examRecentVisits: "Recent visits",
    examNoRecentVisits: "First visit",
    examOpenRecord: "Open medical record",
    examOpenPrescription: "Open prescription",
    examNoPrescription: "No prescription written",
    examChooseDoctor: "Examining doctor",
    examYears: "{n} y",
    importDistributorsTitle: "Import distributors",
    importDistributorsExportHint: "Download all distributors as Excel",
    importPatientsExportHint: "Download all patients as Excel",
    importSkipExistingDesc: "Only new ones are added (matched by name); existing data is not changed.",
    importPatientsTitle: "Import patients",
    importPatientsDesc: "Matched by phone number, or by name when there is none. Each new patient gets a medical record number.",
    importOpeningStockTitle: "Import opening stock",
    importOpeningStockBtn: "Opening stock",
    importOpeningStockDesc: "The stock you have on hand when starting to use the system, per batch.",
    importOpeningStockNote: "Medicines and distributors must exist first (import the medicine list from another branch if needed). Each distributor becomes one paid receipt marked \"saldo awal\", so it is not a debt.",
    importStockSigner: "Counted & signed by",
    importStockDefaultDistributor: "Distributor for rows without one",
    importWillAddDistributors: "{n} distributors will be added",
    importAddedDistributors: "{n} distributors added",
    importWillAddPatients: "{n} patients will be added",
    importAddedPatients: "{n} patients added",
    importWillAddBatches: "{n} batches will be added to stock",
    importAddedBatches: "{n} batches added to stock",
    importStockValue: "value {amount}",
    importStockInvoices: "{n} receipt invoice(s)",
    importDownloadTemplate: "Download template",
    importCompleteFields: "Fill in the fields above to check the file.",
    importCheck: "Check file",
    importFileEmpty: "No rows found in this file",
    importDone: "Import finished",
    importReasonName: "no name",
    importReasonPhone: "no phone",
    importReasonDate: "invalid date",
    importReasonMedicine: "medicine not registered",
    importReasonDistributor: "distributor not registered",
    importReasonBatch: "no batch number",
    importReasonExpired: "already expired",
    importReasonQuantity: "invalid quantity",
    importReasonPrice: "invalid price",
    importReasonBatchExists: "batch already in stock",
    allergyWarningTitle: "Allergy warning",
    allergyWarningLine: "allergic to {allergen} ({severity})",
    medicineTypeControlled: "Controlled medicine",
    medicineTypeControlledHint: "Narcotics, psychotropics, precursors. Orders, receipts, returns and disposals must be signed by the Head Pharmacist; always needs a prescription.",
    medicineTypeControlledBadge: "Controlled",
    nameCaseUpper: "ALL CAPS",
    nameCaseTitle: "Title Case",
    nameCaseLower: "all lowercase",
    nameCaseAsTyped: "As typed",
    nameCaseSample: "paracetamol 500mg Tablet",
    nameCaseAsTypedNote: "Names saved before this setting existed were stored in lowercase and will show that way.",
    poSignerHint: "Pharmacists with an active practice license. Orders with narcotics, psychotropics or precursors must be signed by the Head Pharmacist.",
    sdSignerHint: "Disposal records are signed by the Head Pharmacist (active practice license).",
    pharmaNoOwner: "No owner yet",
    navPharmacyProfile: "Pharmacy profile",
    pharmacyProfileSubtitle: "Details and business licenses of the pharmacy you are working in",
    pharmaInfoTitle: "Pharmacy information",
    setupTitle: "Finish setting up this pharmacy",
    setupProgress: "{done} of {total} done",
    setupHide: "Hide",
    setupLicense: "Add the business license (SIA)",
    setupHeadPharmacist: "Appoint the Head Pharmacist",
    setupStaff: "Add staff accounts",
    setupMedicines: "Add medicines (or import from a branch)",
    setupDistributors: "Add distributors",
    setupStorage: "Set up storage cabinets",
    setupStock: "Add the first stock (invoice or opening stock import)",
    catalogExport: "Export",
    catalogExportHint: "Download the medicine list and classifications as Excel — import it at another branch",
    catalogImport: "Import",
    catalogImportTitle: "Import medicine list",
    catalogImportDesc: "From an Excel file exported at another branch. Only medicines and classifications not here yet are added.",
    catalogPickFile: "Choose an Excel file",
    catalogPickFileHint: "Sheet \"Obat\": Nama, Satuan, Bentuk, Golongan, Kelas, Komposisi",
    catalogFileEmpty: "No medicines found in this file",
    catalogFileUnreadable: "This file can't be read. Use the .xlsx from Export.",
    catalogWillAddMedicines: "{n} medicines will be added",
    catalogWillAddClassifications: "{n} new classifications",
    catalogDoneMedicines: "{n} medicines added",
    catalogDoneClassifications: "{n} classifications added",
    catalogSkippedExisting: "{n} already here (skipped)",
    catalogInvalidRows: "{n} rows skipped",
    catalogRow: "Row {n}",
    catalogReasonName: "no name",
    catalogReasonUnit: "no unit",
    catalogReasonShape: "no shape",
    catalogReasonType: "no type",
    catalogReasonClass: "no class",
    catalogReasonDuplicate: "duplicate in file",
    catalogNoStockNote: "Stock, prices and batches are not imported.",
    catalogImportBtn: "Import",
    catalogImported: "Medicine list imported",
    userPickPharmacyFirst: "Choose a pharmacy first",
    forcePwTitle: "Set your own password",
    forcePwDesc: "{email} is using a temporary password. Replace it to continue.",
    forcePwSubmit: "Save and sign in",
    forcePwBack: "Back to sign in",
    pharmaCodeRequired: "Code is required",
    pharmaEmailInvalid: "Invalid email address",
    onbCodeHint: "Up to 5 letters/digits. Appears on every document number (e.g. INV-APK1-…) and can't be reused.",
    onbLicenseHint: "The pharmacy's operating license (SIA). You can add it later from the pharmacy detail.",
    onbLicenseLater: "Add later",
    onbStepOwner: "Owner & data",
    onbOwnerTitle: "Owner",
    onbOwnerDesc: "The owner signs in, appoints the Head Pharmacist and adds the staff.",
    onbOwnerNew: "New account",
    onbOwnerNewDesc: "Create the owner's login",
    onbOwnerExisting: "Existing user",
    onbOwnerExistingDesc: "e.g. an owner opening another branch",
    onbOwnerLater: "Later",
    onbOwnerLaterDesc: "Assign from the Users page",
    onbOwnerLaterWarn: "Nobody can sign in to this pharmacy until it has an owner. Add one from Users → Placement.",
    onbOwnerName: "Owner name",
    onbOwnerNameRequired: "Owner name is required",
    onbOwnerEmail: "Login email",
    onbOwnerPhone: "Phone",
    onbSearchUser: "Search name or email…",
    onbNoUserFound: "No user found. Choose \"New account\" instead.",
    onbPickUser: "Choose a user",
    onbChange: "Change",
    onbPharmacyCount: "{n} pharmacy(ies)",
    onbStartTitle: "Starting data",
    onbStartDesc: "Medicine shapes, types and classes, plus business parameters. Each pharmacy keeps its own copy.",
    onbStartTemplate: "Standard template",
    onbStartTemplateDesc: "Common classifications, no medicines yet",
    onbStartCopy: "Copy from a branch",
    onbStartCopyDesc: "Medicines, classifications and parameters. Stock and prices are not copied.",
    onbPickPharmacy: "Choose the source pharmacy",
    onbCreate: "Create pharmacy",
    onbDoneTitle: "{name} ({code}) is ready.",
    onbTempPasswordDesc: "Temporary password — shown only once. Send it to the owner; they must replace it at first sign-in.",
    onbExistingOwnerDesc: "They can sign in with their current password and will see this pharmacy in their list.",
    onbCopiedSummary: "Copied {medicines} medicines and {classes} classifications.",
    onbNextTitle: "Next, the owner:",
    onbNext1: "Signs in and replaces the temporary password",
    onbNext2: "Adds the business license (SIA)",
    onbNext3: "Appoints the Head Pharmacist and adds staff — other staff can't enter until there is one",
    onbNext4: "Checks business parameters, then adds medicines (or imports them) and distributors",
    purchaseHistoryTitle: "Purchase history",
    purchaseHistoryShort: "History",
    purchaseTab: "Purchases",
    purchaseToday: "Today",
    purchaseYesterday: "Yesterday",
    purchaseDaysAgo: "{n} days ago",
    purchaseEmptyTitle: "No purchases yet",
    purchaseEmptyDesc: "Sales made for this customer at the till will show up here.",
    purchaseTransactions: "Transactions",
    purchaseTotalSpent: "Total spent",
    purchaseLast: "Last visit",
    purchaseCustomerSince: "Customer since {date}",
    purchaseAverage: "average {amount} per visit",
    purchaseFrequent: "Often bought",
    purchaseTimesBought: "{n}× bought",
    purchaseAdd: "Add",
    purchaseSales: "Transactions",
    purchaseLoadMore: "Load more",
    purchaseItemsCount: "{n} medicine(s) · tap for details",
    examEditVitals: "Edit",
    examAddAllergy: "Add allergy",
    examEditAllergy: "Edit allergy",
    examAdvice: "Treatment & advice",
    examAdvicePlaceholder: "e.g. rest, drink plenty of water, come back in 3 days if the fever persists",
    examBloodTypeShort: "Blood",
    examBmi: "BMI",
    examCallInTitle: "Call the patient in",
    examCallInNotTriaged: "Vital signs haven't been recorded yet; you can fill them in during the examination.",
    examCancelReason: "Cancellation reason",
    examFindings: "Physical examination",
    examFindingsPlaceholder: "e.g. pharynx hyperaemic, lungs clear, no tenderness",
    examInternalNotes: "Internal notes",
    examNoResult: "No examination result recorded.",
    examNoVitals: "No vital signs recorded.",
    examNotTriaged: "Not triaged",
    examQueueShort: "No.",
    examResultTitle: "Examination result",
    examSpo2: "SpO₂",
    examTriageTitle: "Triage",
    examTriageDesc: "Complaint and vital signs before the doctor.",
    examTriageSave: "Save & ready for doctor",
    examTriageUpdate: "Update vital signs",
    examTriageSaved: "Vital signs saved",
    examTriagedBy: "{name} · {time}",
    examVitalBp: "Blood pressure",
    examVitalTemp: "Temperature",
    examVitalPulse: "Pulse",
    examVitalWeight: "Weight",
    examVitalHeight: "Height",
    examVitalsTitle: "Vital signs",
    examStageWaiting: "Arrived",
    examStageReady: "Ready",
    examReadyEmpty: "No patient is ready for the doctor yet.",
    examInProgressEmpty: "Nobody is being examined.",
    examCompletedEmpty: "No examinations finished today.",
    examSeeWaiting: "{n} patient(s) still waiting for triage",
    examAllergyTag: "Allergy",
    examCarriedOver: "Since",
    examFlowRegister: "Register",
    examFlowTriage: "Triage",
    examFlowDoctor: "Doctor",
    examFlowDone: "Prescription / done",
    examViewByPatient: "By patient",
    examViewByDoctor: "By doctor",
    examDoctorYou: "you",
    examDoctorFree: "Free",
    examDoctorBusy: "Examining {n}",
    examCallNext: "Call next · {n} {name}",
    examNextUp: "Next: {n} {name}",
    examLaneEmpty: "No one waiting",
    examAnyDoctor: "Any doctor",
    examAnyDoctorHint: "Patients without a chosen doctor appear in every doctor's line; whoever calls them first takes them.",
    examNoDoctorsTitle: "No in-house doctors yet",
    examNoDoctorsDesc: "Link a doctor to a user account (Doctors page) to split the queue per doctor.",
    examWaitingCount: "{n} waiting",
    examCalledIn: "{name} called in",
    examNewPatient: "New patient",
    examCheckInDescTriage: "Pick the patient who arrived; record vital signs and allergies in the triage panel next.",
    roleTypeDoctor: "Doctor",
    roleTypeNurse: "Nurse",
    examGenderMale: "M",
    examGenderFemale: "F",
    examLineRequired: "Fill in the medicine name and quantity",
    examUnsaved: "Unsaved changes",
  },
  id: {
    appName: "PharmaCare",
    appSubtitle: "Sistem Manajemen Apotek",
    featureHeadline: "Manajemen Apotek Modern",
    featureDesc:
      "Solusi digital lengkap untuk operasi apotek, dirancang untuk tim layanan kesehatan modern.",
    featureStock: "Manajemen stok & inventori cerdas",
    featurePOS: "Kasir & penagihan yang mudah",
    featurePrescriptions: "Pengelolaan resep digital",
    welcomeBack: "Selamat datang kembali",
    signInDesc: "Masuk ke akun Anda untuk melanjutkan",
    signInHeadlinePrefix: "Masuk ke",
    signInSubtitle: "Masuk ke akun apotek Anda",
    email: "Email",
    emailPlaceholder: "anda@contoh.com",
    password: "Kata Sandi",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Lupa?",
    rememberMe: "Tetap masuk di perangkat ini",
    signIn: "Masuk",
    signingIn: "Sedang masuk...",
    orDivider: "atau",
    continueWithGoogle: "Lanjutkan dengan Google",
    noAccount: "Belum punya akun?",
    contactAdmin: "Hubungi administrator Anda",
    emailRequired: "Email wajib diisi",
    emailInvalid: "Masukkan alamat email yang valid",
    passwordRequired: "Kata sandi wajib diisi",
    passwordMinLength: "Kata sandi minimal 8 karakter",
    loginFailed: "Login gagal. Silakan coba lagi.",
    unexpectedError: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
    showPassword: "Tampilkan kata sandi",
    hidePassword: "Sembunyikan kata sandi",
    copyright: "© 2026 PharmaCare. Hak cipta dilindungi.",
    switchToLight: "Ganti ke mode terang",
    switchToDark: "Ganti ke mode gelap",
    selectPharmacyTitle: "Pilih Apotek",
    selectPharmacySubtitle: "Pilih apotek yang ingin Anda gunakan hari ini",
    selectButton: "Pilih",
    selecting: "Memilih...",
    noPharmaciesTitle: "Tidak Ada Apotek",
    noPharmaciesDesc: "Anda tidak memiliki akses ke apotek mana pun. Hubungi administrator Anda.",
    signOut: "Keluar",
    signingOut: "Sedang keluar...",
    greetingMorning: "Selamat pagi",
    greetingAfternoon: "Selamat siang",
    greetingEvening: "Selamat sore",
    greetingNight: "Selamat malam",
    dailySummary: "Ringkasan Harian",
    yourPharmacies: "APOTEK ANDA",
    selectBranchSubtitle: "Pilih cabang untuk membuka kasir",
    pharmacyAccessPrefix: "Anda punya akses ke",
    pharmacySingular: "apotek",
    pharmacyPlural: "apotek",
    filterAll: "Semua",
    filterOpen: "Buka",
    filterNeedsAttention: "Perlu perhatian",
    statusOpen: "Buka",
    statusClosed: "Tutup",
    lowStockWarning: "stok rendah",
    salesLabel: "Penjualan",
    transactionsLabel: "Transaksi",
    rxQueueLabel: "Antrian Rx",
    navDashboard: "Dasbor",
    navGroupSales: "Penjualan",
    navGroupInventory: "Inventaris",
    navGroupProcurement: "Pengadaan",
    navGroupPeople: "Pengguna",
    navGroupSettings: "Pengaturan",

    // Dashboard page
    dashboardSubtitle: "Ini yang terjadi di apotek Anda hari ini.",
    dashboardVsYesterday: "vs kemarin",
    dashboardTodayRevenue: "Pendapatan Hari Ini",
    dashboardTransactionCount: "Transaksi Hari Ini",
    dashboardAvgTransaction: "Rata-rata Transaksi",
    dashboardSalesTrendTitle: "Tren Penjualan",
    dashboardRevenue7Days: "7 Hari Terakhir",
    dashboardRevenue14Days: "14 Hari Terakhir",
    dashboardRevenue30Days: "30 Hari Terakhir",
    dashboardSaleTypeSplit: "Jenis Penjualan",
    dashboardNotAvailableTitle: "Belum Tersedia",
    dashboardSaleTypeNotAvailableDesc: "Data OTC vs resep belum tersedia.",
    dashboardStockAlertsTitle: "Peringatan Stok",
    dashboardStockAlertsEmpty: "Tidak ada peringatan stok saat ini.",
    dashboardStockLabel: "Stok",
    dashboardReorderLabel: "Pesan ulang di",
    dashboardStockCritical: "Kritis",
    dashboardStockLow: "Rendah",
    dashboardExpiryLabel: "Kedaluwarsa",
    dashboardDaysSuffix: "hari",
    dashboardExpirySoon: "Segera kedaluwarsa",
    dashboardTopProductsTitle: "Produk Terlaris",
    dashboardTopProductsEmpty: "Data penjualan tidak tersedia.",
    dashboardUnitsSoldSuffix: "unit",
    dashboardOpenPOsTitle: "Pesanan Pembelian Terbuka",
    dashboardOpenPOsEmpty: "Tidak ada pesanan pembelian terbuka.",
    dashboardComplianceTitle: "Kepatuhan Apotek",
    dashboardSipnapLabel: "SIPNAP",
    dashboardSiaLabel: "SIA (Izin Usaha)",
    dashboardApjLabel: "Head Pharmacist",
    dashboardLicenseExpiresLabel: "Kedaluwarsa",
    dashboardLicenseOverdue: "Terlambat",
    dashboardQuickActionsTitle: "Aksi Cepat",
    dashboardActionSell: "Jual",
    dashboardActionReceiveGoods: "Terima Barang",
    dashboardActionAdjustStock: "Sesuaikan Stok",
    dashboardActionCreatePO: "Buat PO",
    dashboardNeedRestockTitle: "Perlu Restock",
    dashboardNeedRestockEmpty: "Semua stok dalam kondisi cukup.",
    dashboardExpiringSoonTitle: "Segera Kedaluwarsa",
    dashboardExpiringSoonEmpty: "Tidak ada item kedaluwarsa dalam 90 hari ke depan.",
    dashboardRecentTransactionsTitle: "Transaksi Terbaru",
    dashboardRecentTransactionsEmpty: "Belum ada transaksi hari ini.",
    dashboardTopByQtyTitle: "Terlaris (Unit)",
    dashboardTopByRevenueTitle: "Terlaris (Pendapatan)",
    dashboardInventoryAsset: "Nilai Inventori",
    dashboardUnpaidInvoicesTitle: "Faktur Belum Lunas per Distributor",
    dashboardUnpaidInvoicesEmpty: "Tidak ada faktur yang belum lunas.",
    dashboardUnpaidTotalLabel: "Total Terutang",
    dashboardInventoryAssetVsQuarter: "vs kuartal sebelumnya",
    dashboardSlowMoversTitle: "Barang Lambat Bergerak",
    dashboardSlowMoversEmpty: "Tidak ada barang lambat bergerak.",
    dashboardSlowMoversDaysSince: "hari tidak aktif",
    dashboardSlowMoversEstValue: "Estimasi Nilai",
    dashboardSlowMoversNeverSold: "Belum pernah terjual",
    dashboardSlowMoversTotalIdleValue: "Total nilai idle",
    dashboardStockRunwayTitle: "Estimasi Stok Habis",
    dashboardStockRunwayEmpty: "Data estimasi stok tidak tersedia.",
    dashboardRunwayCritical: "Kritis",
    dashboardRunwayLow: "Rendah",
    dashboardRunwayAdequate: "Cukup",
    dashboardRunwayOverstocked: "Berlebih",
    dashboardRunwayDaysLeft: "hari tersisa",
    dashboardRunwayNoSales: "Tanpa penjualan",
    dashboardAvgDailySalesLabel: "Rata-rata/hari",
    dashboardMonthlyRevenueTitle: "Pendapatan Bulanan",
    dashboardMtdLabel: "Bulan Berjalan",
    dashboardMtdVsPrevLabel: "vs periode sama bulan lalu",
    dashboardGrossProfitTitle: "Laba Kotor",
    dashboardGrossProfitMarginLabel: "Margin",
    dashboardGrossProfitVsLastMonth: "vs bulan lalu",
    dashboardCogsLabel: "HPP",
    dashboardRevenueLabel: "Pendapatan",
    dashboardPurchaseSpendTitle: "Pengeluaran Pembelian",
    dashboardPurchaseSpendMtdLabel: "Pengeluaran Bulan Berjalan",
    dashboardPaymentScheduleTitle: "Jadwal Pembayaran",
    dashboardPaymentScheduleEmpty: "Tidak ada pembayaran mendatang.",
    dashboardPaymentOverdueLabel: "Terlambat",
    dashboardPaymentUpcomingLabel: "Mendatang",
    dashboardCreditSalesTitle: "Piutang Penjualan Kredit",
    dashboardCreditSalesEmpty: "Tidak ada piutang penjualan kredit.",
    dashboardCreditSalesTotalLabel: "Total Piutang",
    dashboardCreditSalesDaysSince: "hari lalu",

    navPOS: "Kasir",
    navSales: "Riwayat Penjualan",
    navStock: "Stok",
    navStockDisposals: "Disposal Stok",
    navMedicines: "Obat-obatan",
    navPrescriptions: "Resep",
    navPurchaseOrders: "Pesanan Pembelian",
    navInvoices: "Faktur",
    navPatients: "Pasien",
    navCustomers: "Pelanggan",
    navDistributors: "Distributor",
    navReports: "Laporan",
    navSettings: "Pengaturan",
    searchPlaceholder: "Cari...",
    notifications: "Notifikasi",
    notificationsEmpty: "Tidak ada notifikasi baru",
    notificationsEmptyDesc: "Peringatan harian soal stok, pembayaran dan izin akan muncul di sini.",
    notificationsMarkAllRead: "Tandai semua dibaca",
    notificationsLoadError: "Gagal memuat notifikasi",
    notificationExpiringBatches: "{n} batch akan kedaluwarsa dalam {days} hari",
    notificationExpiredBatches: "{n} batch kedaluwarsa masih ada di stok",
    notificationLowStock: "{n} obat berada di bawah batas pemesanan ulang",
    notificationOverduePayables: "{n} faktur distributor lewat jatuh tempo · {amount}",
    notificationOverdueReceivables: "{n} penjualan kredit pelanggan lewat jatuh tempo · {amount}",
    notificationLicenseExpiring: "{n} izin akan habis dalam {days} hari atau sudah habis",
    sidebarCollapse: "Ciutkan sidebar",
    sidebarExpand: "Perluas sidebar",
    branchSingular: "cabang",
    branchPlural: "cabang",
    switchPharmacy: "Ganti apotek",
    profileSettings: "Pengaturan Profil",

    profilePageSubtitle: "Kelola informasi pribadi dan kata sandi Anda",
    profileInfoSectionTitle: "Informasi Profil",
    profileInfoSectionDesc: "Perbarui nama, nomor telepon, dan alamat Anda",
    profileNameLabel: "Nama Lengkap",
    profileNamePlaceholder: "Masukkan nama lengkap Anda",
    profileNameRequired: "Nama wajib diisi",
    profileEmailLabel: "Email",
    profileEmailHint: "Email tidak dapat diubah",
    profilePhoneLabel: "Telepon",
    profilePhonePlaceholder: "Masukkan nomor telepon Anda",
    profileAddressLabel: "Alamat",
    profileAddressPlaceholder: "Masukkan alamat Anda",
    profileSaveChanges: "Simpan Perubahan",
    profileSaving: "Menyimpan...",
    profileUpdateSuccess: "Profil berhasil diperbarui",
    profileMustChangePasswordBanner: "Demi keamanan Anda, harap perbarui kata sandi Anda.",
    profilePasswordSectionTitle: "Ganti Kata Sandi",
    profilePasswordSectionDesc: "Gunakan kata sandi kuat yang tidak digunakan di tempat lain",
    profileCurrentPasswordLabel: "Kata Sandi Saat Ini",
    profileNewPasswordLabel: "Kata Sandi Baru",
    profileNewPasswordHint: "Minimal 8 karakter, dengan huruf besar dan angka",
    profileConfirmPasswordLabel: "Konfirmasi Kata Sandi Baru",
    profileCurrentPasswordRequired: "Kata sandi saat ini wajib diisi",
    profileNewPasswordMinLength: "Kata sandi minimal 8 karakter",
    profileNewPasswordUppercase: "Harus mengandung minimal satu huruf besar",
    profileNewPasswordNumber: "Harus mengandung minimal satu angka",
    profilePasswordMismatch: "Kata sandi tidak cocok",
    profileChangePasswordButton: "Perbarui Kata Sandi",
    profileChangingPassword: "Memperbarui...",
    profilePasswordChangeSuccess: "Kata sandi berhasil diubah",
    profilePlacementSectionTitle: "Penempatan Saat Ini",
    profilePlacementPharmacyLabel: "Apotek",
    profilePlacementRoleLabel: "Peran",
    profilePlacementJoinedLabel: "Bergabung",
    profilePlacementLicenseLabel: "Lisensi Aktif",
    profilePlacementNone: "Tidak ada penempatan aktif",

    distributorsSubtitle: "Kelola distributor dan pemasok obat Anda",
    distributorAdd: "Tambah",
    distributorEdit: "Edit",
    distributorDelete: "Hapus",
    distributorName: "Nama Perusahaan",
    distributorNamePlaceholder: "cth. PT ABC",
    distributorContactPerson: "Narahubung",
    distributorContactPersonPlaceholder: "Nama yang dapat dihubungi",
    distributorPhone: "Telepon",
    distributorPhonePlaceholder: "08 xxx xxxx xxxx",
    distributorEmail: "Email",
    distributorEmailPlaceholder: "distributor@contoh.com",
    distributorAddress: "Alamat",
    distributorAddressPlaceholder: "Alamat lengkap",
    distributorDeleteConfirmTitle: "Hapus Distributor",
    distributorDeleteConfirmDesc: "Ini akan menghapus distributor secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.",
    distributorEmptyTitle: "Belum ada distributor",
    distributorEmptyDesc: "Tambahkan distributor pertama Anda untuk mulai mengelola rantai pasokan",
    distributorSave: "Simpan",
    distributorSaving: "Menyimpan...",
    distributorDeleting: "Menghapus...",
    distributorNameRequired: "Nama perusahaan wajib diisi",
    distributorPhoneRequired: "Nomor telepon wajib diisi",
    distributorAddressRequired: "Alamat wajib diisi",
    distributorEmailInvalid: "Masukkan alamat email yang valid",
    distributorSearchPlaceholder: "Cari distributor...",
    distributorNoResults: "Tidak ada distributor yang cocok",
    distributorTotal: "Total Distributor",
    distributorSingular: "distributor",
    distributorPlural: "distributor",
    distributorDetails: "Detail",
    distributorDetailsTitle: "Detail Distributor",
    distributorRegistered: "Terdaftar",
    distributorUpdated: "Terakhir Diperbarui",
    distributorPermitNumber: "Nomor Izin",
    distributorPermitNumberPlaceholder: "cth. ABC-123456",
    distributorNotes: "Catatan",
    distributorNotesPlaceholder: "Catatan tambahan tentang distributor ini...",
    distributorCreateSuccess: "Distributor berhasil ditambahkan",
    distributorUpdateSuccess: "Distributor berhasil diperbarui",
    distributorDeleteSuccess: "Distributor berhasil dihapus",

    patientsSubtitle: "Kelola pasien dan pembeli walk-in Anda",
    patientAdd: "Tambah",
    patientEdit: "Edit",
    patientDelete: "Hapus",
    patientDetails: "Detail",
    patientDetailsTitle: "Detail Pasien",
    patientSave: "Simpan",
    patientSaving: "Menyimpan...",
    patientDeleting: "Menghapus...",
    patientName: "Nama",
    patientNamePlaceholder: "Nama lengkap",
    patientNameRequired: "Nama wajib diisi",
    patientPhone: "Telepon",
    patientPhonePlaceholder: "Nomor telepon",
    patientAddress: "Alamat",
    patientAddressPlaceholder: "Alamat lengkap",
    patientDescription: "Catatan",
    patientDescriptionPlaceholder: "Catatan tambahan",
    patientStatusLabel: "Status",
    patientStatusActive: "Aktif",
    patientStatusInactive: "Nonaktif",
    patientIsWalkIn: "Tipe",
    patientWalkInBadge: "Walk-in",
    patientWalkInRegular: "Reguler",
    patientSearchPlaceholder: "Cari pasien...",
    patientNoResults: "Pasien tidak ditemukan",
    patientEmptyTitle: "Belum ada pasien",
    patientEmptyDesc: "Tambahkan pasien pertama Anda untuk memulai",
    patientDeleteConfirmTitle: "Hapus Pasien",
    patientDeleteConfirmDesc: "Tindakan ini tidak dapat dibatalkan. Pasien akan dihapus secara permanen dari sistem.",
    patientTotal: "pasien",
    patientSingular: "pasien",
    patientPlural: "pasien",
    patientCreateSuccess: "Pasien berhasil ditambahkan",
    patientUpdateSuccess: "Pasien berhasil diperbarui",
    patientDeleteSuccess: "Pasien berhasil dihapus",
    patientFilterStatus: "Status",
    patientFilterIsWalkIn: "Tipe",
    patientFilterPartyType: "Jenis Pihak",
    patientPartyTypePatient: "Pasien",
    patientPartyTypeProfessional: "Profesional",
    patientNik: "NIK",
    patientNikPlaceholder: "Nomor Induk Kependudukan",
    patientGender: "Jenis Kelamin",
    patientGenderMale: "Laki-laki",
    patientGenderFemale: "Perempuan",
    patientDateOfBirth: "Tanggal Lahir",
    patientBpjsNumber: "No. BPJS",
    patientBpjsNumberPlaceholder: "Nomor kepesertaan BPJS",
    patientMedicalRecordNumber: "No. Rekam Medis",
    patientMedicalRecordNumberPlaceholder: "Nomor rekam medis",
    patientDetailSectionTitle: "Detail Medis",
    professionalStrNumber: "No. STR",
    professionalStrNumberPlaceholder: "Nomor Surat Tanda Registrasi",
    professionalSipNumber: "No. SIP",
    professionalSipNumberPlaceholder: "Nomor Surat Izin Praktik",
    professionalProfession: "Profesi",
    professionalProfessionPlaceholder: "mis. Dokter, Perawat, Apoteker",
    professionalDetailSectionTitle: "Detail Profesional",

    // Customers
    customersSubtitle: "Kelola pelanggan, pasien, dan tenaga profesional Anda",
    customerAdd: "Tambah",
    customerEdit: "Edit",
    customerDelete: "Hapus",
    customerDetails: "Detail",
    customerDetailsTitle: "Detail Pelanggan",
    customerSave: "Simpan",
    customerSaving: "Menyimpan...",
    customerDeleting: "Menghapus...",
    customerSearchPlaceholder: "Cari pelanggan...",
    customerNoResults: "Pelanggan tidak ditemukan",
    customerEmptyTitle: "Belum ada pelanggan",
    customerEmptyDesc: "Tambahkan pelanggan pertama Anda untuk memulai",
    customerDeleteConfirmTitle: "Hapus Pelanggan",
    customerDeleteConfirmDesc: "Tindakan ini tidak dapat dibatalkan. Pelanggan akan dihapus secara permanen.",
    customerCreateSuccess: "Pelanggan berhasil ditambahkan",
    customerUpdateSuccess: "Pelanggan berhasil diperbarui",
    customerDeleteSuccess: "Pelanggan berhasil dihapus",
    customerFilterStatus: "Status",
    customerFilterIsWalkIn: "Tipe",
    customerFilterType: "Tipe Pelanggan",
    customerTypePatient: "Pasien",
    customerTypeProfessional: "Profesional",
    customerMedicalRecordNumber: "No. Rekam Medis",

    // Medical Records
    navMedicalRecords: "Rekam Medis",
    medicalRecordsSubtitle: "Lihat dan kelola rekam medis pasien, alergi, dan riwayat kunjungan",
    medicalRecordTitle: "Rekam Medis",
    medicalRecordNumber: "Nomor Rekam Medis",
    medicalRecordBloodType: "Golongan Darah",
    medicalRecordBloodTypePlaceholder: "contoh: A+, B-, O+",
    medicalRecordEmergencyContact: "Kontak Darurat",
    medicalRecordEmergencyContactName: "Nama Kontak",
    medicalRecordEmergencyContactNamePlaceholder: "Nama lengkap",
    medicalRecordEmergencyContactPhone: "Telepon Kontak",
    medicalRecordEmergencyContactPhonePlaceholder: "+62 xxx xxxx xxxx",
    medicalRecordEdit: "Edit Rekam Medis",
    medicalRecordSave: "Simpan",
    medicalRecordSaving: "Menyimpan...",
    medicalRecordUpdateSuccess: "Rekam medis berhasil diperbarui",
    medicalRecordPatientSearchPlaceholder: "Cari pasien...",
    medicalRecordSelectPatient: "Pilih Pasien",
    medicalRecordNoPatientSelected: "Belum Ada Pasien Dipilih",
    medicalRecordNoPatientSelectedDesc: "Pilih pasien dari daftar untuk melihat rekam medisnya",
    medicalRecordNotFoundTitle: "Belum Ada Rekam Medis",
    medicalRecordNotFoundDesc: "Pasien ini belum memiliki rekam medis. Rekam medis akan dibuat otomatis setelah backend membuatkannya untuk pasien ini.",
    medicalRecordOverviewTab: "Ringkasan",
    medicalRecordAllergiesTab: "Alergi",
    medicalRecordAllergiesMore: "+{n} lainnya",
    medicalRecordVisitsTab: "Riwayat Kunjungan",
    medicalRecordAllergyAdd: "Tambah Alergi",
    medicalRecordAllergyDelete: "Hapus",
    medicalRecordAllergyDeleting: "Menghapus...",
    medicalRecordAllergyDeleteSuccess: "Alergi berhasil dihapus",
    medicalRecordAllergyAddSuccess: "Alergi berhasil ditambahkan",
    medicalRecordAllergyNoData: "Tidak ada alergi yang tercatat",
    medicalRecordAllergyName: "Alergen",
    medicalRecordAllergyNamePlaceholder: "contoh: Penisilin, Kacang",
    medicalRecordAllergyNameRequired: "Nama alergen wajib diisi",
    medicalRecordAllergyType: "Jenis",
    medicalRecordAllergyTypeRequired: "Jenis alergen wajib dipilih",
    medicalRecordAllergyTypeMedicine: "Obat",
    medicalRecordAllergyTypeFood: "Makanan",
    medicalRecordAllergyTypeEnvironment: "Lingkungan",
    medicalRecordAllergyTypeOther: "Lainnya",
    medicalRecordAllergyReaction: "Reaksi",
    medicalRecordAllergyReactionPlaceholder: "Jelaskan reaksi alergi",
    medicalRecordAllergySeverity: "Tingkat Keparahan",
    medicalRecordAllergySeverityRequired: "Tingkat keparahan wajib dipilih",
    medicalRecordAllergySeverityMild: "Ringan",
    medicalRecordAllergySeverityModerate: "Sedang",
    medicalRecordAllergySeveritySevere: "Berat",
    medicalRecordAllergyNotes: "Catatan",
    medicalRecordAllergyNotesPlaceholder: "Catatan tambahan",
    medicalRecordAllergyDeleteConfirmTitle: "Hapus Alergi",
    medicalRecordAllergyDeleteConfirmDesc: "Apakah Anda yakin ingin menghapus data alergi ini?",
    medicalRecordVisitAdd: "Tambah Kunjungan",
    medicalRecordVisitEdit: "Edit",
    medicalRecordVisitDelete: "Hapus",
    medicalRecordVisitDeleting: "Menghapus...",
    medicalRecordVisitDeleteSuccess: "Kunjungan berhasil dihapus",
    medicalRecordVisitAddSuccess: "Kunjungan berhasil dicatat",
    medicalRecordVisitUpdateSuccess: "Kunjungan berhasil diperbarui",
    medicalRecordVisitNoData: "Belum ada riwayat kunjungan",
    medicalRecordVisitDate: "Tanggal Kunjungan",
    medicalRecordVisitDateRequired: "Tanggal kunjungan wajib diisi",
    medicalRecordVisitChiefComplaint: "Keluhan Utama",
    medicalRecordVisitChiefComplaintPlaceholder: "Alasan utama kunjungan",
    medicalRecordVisitDiagnosis: "Diagnosis",
    medicalRecordVisitDiagnosisPlaceholder: "Diagnosis atau penilaian",
    medicalRecordVisitNotes: "Catatan",
    medicalRecordVisitNotesPlaceholder: "Catatan klinis tambahan",
    medicalRecordVisitVitals: "Tanda Vital",
    medicalRecordVisitWeight: "Berat Badan (kg)",
    medicalRecordVisitWeightPlaceholder: "contoh: 60.5",
    medicalRecordVisitHeight: "Tinggi Badan (cm)",
    medicalRecordVisitHeightPlaceholder: "contoh: 170",
    medicalRecordVisitBloodPressure: "Tekanan Darah",
    medicalRecordVisitBloodPressurePlaceholder: "contoh: 120/80",
    medicalRecordVisitTemperature: "Suhu (°C)",
    medicalRecordVisitTemperaturePlaceholder: "contoh: 36.8",
    medicalRecordVisitPulse: "Denyut Nadi (bpm)",
    medicalRecordVisitPulsePlaceholder: "contoh: 80",
    medicalRecordVisitDoctor: "Dokter",
    medicalRecordVisitDoctorPlaceholder: "Pilih dokter",
    medicalRecordVisitPrescription: "Resep",
    medicalRecordVisitPrescriptionPlaceholder: "Pilih resep",
    medicalRecordVisitDeleteConfirmTitle: "Hapus Kunjungan",
    medicalRecordVisitDeleteConfirmDesc: "Data kunjungan ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.",
    medicalRecordVisitSave: "Simpan Kunjungan",
    medicalRecordVisitSaving: "Menyimpan...",
    medicalRecordVisitDetails: "Detail Kunjungan",

    // Doctors page
    navDoctors: "Dokter",
    doctorsSubtitle: "Kelola data dokter dan informasi klinik terdaftar",
    doctorAdd: "Tambah",
    doctorEdit: "Edit",
    doctorDelete: "Hapus",
    doctorDetails: "Detail",
    doctorDetailsTitle: "Detail Dokter",
    doctorSave: "Simpan Dokter",
    doctorSaving: "Menyimpan...",
    doctorDeleting: "Menghapus...",
    doctorName: "Nama Lengkap",
    doctorNamePlaceholder: "mis. dr. Budi Santoso",
    doctorNameRequired: "Nama dokter wajib diisi",
    doctorLicenseNumber: "Nomor SIP",
    doctorLicenseNumberPlaceholder: "mis. SIP-123456",
    doctorSpecialty: "Spesialisasi",
    doctorSpecialtyPlaceholder: "mis. Dokter Umum",
    doctorClinicName: "Klinik / Rumah Sakit",
    doctorClinicNamePlaceholder: "mis. Klinik Sehat",
    doctorPhone: "Telepon",
    doctorPhonePlaceholder: "mis. 0812-3456-7890",
    doctorStatusLabel: "Status",
    doctorStatusActive: "Aktif",
    doctorStatusInactive: "Tidak Aktif",
    doctorFilterStatus: "Status",
    doctorSearchPlaceholder: "Cari berdasarkan nama, SIP, atau klinik...",
    doctorNoResults: "Tidak ada dokter yang sesuai pencarian",
    doctorEmptyTitle: "Belum ada dokter",
    doctorEmptyDesc: "Tambahkan dokter pertama untuk mulai menghubungkan resep",
    doctorDeleteConfirmTitle: "Hapus Dokter",
    doctorDeleteConfirmDesc: "Dokter ini akan dihapus secara permanen dan dilepas dari semua resep.",
    doctorTotal: "Total",
    doctorSingular: "dokter",
    doctorPlural: "dokter",
    doctorRegistered: "Terdaftar",
    doctorUpdated: "Terakhir diperbarui",
    doctorCreateSuccess: "Dokter berhasil ditambahkan",
    doctorUpdateSuccess: "Dokter berhasil diperbarui",
    doctorDeleteSuccess: "Dokter berhasil dihapus",
    doctorLinkedUser: "Pengguna Terhubung",

    // Prescriptions page
    prescriptionsSubtitle: "Kelola resep pasien dan alur dispensing obat",
    prescriptionAdd: "Tambah",
    prescriptionEdit: "Edit",
    prescriptionDelete: "Hapus",
    prescriptionDetails: "Detail",
    prescriptionDetailsTitle: "Detail Resep",
    prescriptionSave: "Simpan Resep",
    prescriptionSaving: "Menyimpan...",
    prescriptionDeleting: "Menghapus...",
    prescriptionNumber: "No. Resep",
    prescriptionNumberPlaceholder: "mis. RX-20260001",
    prescriptionPrescribedAt: "Tanggal Resep",
    prescriptionNotes: "Catatan",
    prescriptionNotesPlaceholder: "Catatan atau instruksi tambahan",
    prescriptionPatient: "Pasien",
    prescriptionPatientPlaceholder: "Cari pasien...",
    prescriptionPatientRequired: "Pasien wajib dipilih",
    prescriptionDoctor: "Dokter",
    prescriptionDoctorPlaceholder: "Cari dokter (opsional)...",
    prescriptionStatusLabel: "Status",
    prescriptionStatusPending: "Menunggu",
    prescriptionStatusDispensed: "Selesai",
    prescriptionStatusPartial: "Sebagian",
    prescriptionStatusCancelled: "Dibatalkan",
    prescriptionStatusExpired: "Kedaluwarsa",
    prescriptionFilterStatus: "Status",
    prescriptionSearchPlaceholder: "Cari berdasarkan pasien atau no. resep...",
    prescriptionNoResults: "Tidak ada resep yang sesuai pencarian",
    prescriptionEmptyTitle: "Belum ada resep",
    prescriptionEmptyDesc: "Tambahkan resep baru untuk memulai alur dispensing",
    prescriptionDeleteConfirmTitle: "Hapus Resep",
    prescriptionDeleteConfirmDesc: "Resep ini akan dihapus secara permanen.",
    prescriptionTotal: "Total",
    prescriptionSingular: "resep",
    prescriptionPlural: "resep",
    prescriptionCreateSuccess: "Resep berhasil ditambahkan",
    prescriptionUpdateSuccess: "Resep berhasil diperbarui",
    prescriptionDeleteSuccess: "Resep berhasil dihapus",
    prescriptionAllTab: "Semua",
    prescriptionQueueTab: "Antrean",
    prescriptionQueueTitle: "Antrean Dispensing",
    prescriptionQueueEmpty: "Antrean kosong",
    prescriptionQueueEmptyDesc: "Tidak ada resep yang menunggu saat ini",
    prescriptionLinkedSale: "Penjualan Terhubung",
    prescriptionItemsLabel: "Daftar Obat",
    prescriptionItemAdd: "Tambah Obat",
    prescriptionItemRemove: "Hapus",
    prescriptionItemMedicine: "Nama Obat",
    prescriptionItemMedicinePlaceholder: "mis. Amoxicillin 500mg",
    prescriptionItemMedicineRequired: "Nama obat wajib diisi",
    prescriptionItemQty: "Jumlah",
    prescriptionItemQtyRequired: "Jumlah wajib diisi",
    prescriptionItemFrequency: "Frekuensi",
    prescriptionItemFrequencyPlaceholder: "mis. 3x sehari",
    prescriptionItemDuration: "Durasi",
    prescriptionItemDurationPlaceholder: "mis. 5 hari",
    prescriptionItemNotes: "Catatan Item",
    prescriptionItemNotesPlaceholder: "mis. Diminum setelah makan",
    prescriptionItemDispensedOf: "dari",
    prescriptionDispense: "Dispens",
    prescriptionDispenseTitle: "Dispensing Resep",
    prescriptionDispensing: "Memproses...",
    prescriptionDispenseSuccess: "Resep berhasil didispens",
    prescriptionCancel: "Batalkan",
    prescriptionCancelConfirmTitle: "Batalkan Resep",
    prescriptionCancelConfirmDesc: "Resep ini akan ditandai sebagai dibatalkan dan tidak dapat didispens.",
    prescriptionCancelling: "Membatalkan...",
    prescriptionCancelSuccess: "Resep berhasil dibatalkan",
    prescriptionDispenseStockBatch: "Batch Stok",
    prescriptionDispenseQty: "Jumlah Dispens",
    prescriptionDispenseSellingPrice: "Harga Jual",
    prescriptionDispenseOriginalPrice: "Harga Asli",
    prescriptionDispenseSaleType: "Tipe Penjualan",
    prescriptionDispensePaymentMethod: "Metode Pembayaran",
    prescriptionDispenseGrandTotal: "Total Akhir",
    prescriptionDispenseTotalAmount: "Subtotal",
    prescriptionDispenseStepItems: "Stok & Harga",
    prescriptionDispenseStepPayment: "Pembayaran",
    prescriptionDispenseNext: "Lanjut",
    prescriptionDispenseBack: "Kembali",
    prescriptionSaleTypeCash: "Tunai",
    prescriptionSaleTypeCredit: "Kredit",
    prescriptionPaymentCash: "Tunai",
    prescriptionPaymentTransfer: "Transfer",
    prescriptionPaymentDebit: "Debit",
    prescriptionPaymentCreditCard: "Kartu Kredit",
    prescriptionPaymentQris: "QRIS",

    sessionExpiredTitle: "Sesi Berakhir",
    sessionExpiredDesc: "Sesi Anda telah berakhir. Silakan masuk kembali.",

    loginSuccessTitle: "Berhasil masuk",
    loginSuccessDesc: "Pilih apotek untuk melanjutkan.",
    loginSuccessDirectDesc: "Berhasil! Mengarahkan Anda ke dasbor.",

    logoutSuccessTitle: "Berhasil keluar",
    logoutSuccessDesc: "Anda telah berhasil keluar dari akun.",

    pharmacyContextLostTitle: "Sesi apotek direset",
    pharmacyContextLostDesc: "Silakan pilih apotek untuk melanjutkan.",

    serverDownTitle: "Server Tidak Tersedia",
    serverDownDesc: "Tidak dapat terhubung ke server. Periksa koneksi Anda atau coba lagi nanti.",
    serverDownRetry: "Coba Lagi",

    useValue: 'Gunakan "%s"',
    add: "Tambah",
    created: "Dibuat",
    lastUpdated: "Terakhir Diperbarui",
    cancel: "Batal",
    save: "Simpan",
    deleteConfirm: "Ya, hapus",
    showing: "Menampilkan",
    of: "dari",
    rowsPerPage: "Baris per halaman",
    referenceStatusColumn: "Status",
    referenceStatusAll: "Semua Status",
    referenceStatusActive: "Aktif",
    referenceStatusInactive: "Tidak Aktif",
    name: "Nama",
    description: "Deskripsi",

    navMedicineClassification: "Klasifikasi Obat",
    medicineClassificationSubtitle: "Kelola bentuk, golongan, dan kelas terapi obat",
    navMedicineShapes: "Bentuk Obat",
    navMedicineTypes: "Golongan Obat",
    navMedicineClasses: "Kelas Terapi Obat",
    navBusinessParameters: "Parameter Bisnis",
    navSystemParameters: "Parameter Sistem",
    navBackgroundJobs: "Job Latar Belakang",
    jobsSubtitle: "Tugas terjadwal yang merapikan data dan mengirim peringatan harian",
    jobsRunNow: "Jalankan sekarang",
    jobsLastRun: "Terakhir jalan",
    jobsNeverRun: "Belum pernah jalan",
    jobsDailyAt: "Setiap hari pukul {time}",
    jobsSettings: "Atur",
    jobsSettingsTitle: "Pengaturan {name}",
    jobsEnabled: "Jalan sesuai jadwal",
    jobsEnabledHint: "Jika dimatikan, job hanya jalan saat dijalankan manual.",
    jobsTime: "Jam",
    jobsTimeHint: "Setiap hari, waktu {tz}. Default {time}.",
    jobsOff: "Nonaktif",
    jobsDefaultValue: "Default {value}, rentang {min}–{max}",
    jobsPharmacyParams: "Diatur oleh setiap apotek",
    jobsPharmacyParamsHint: "Setiap apotek mengubahnya di Parameter Bisnis:",
    jobsSettingsSaved: "Pengaturan disimpan",
    jobsParamNotificationRetention: "Simpan notifikasi (hari)",
    jobsParamJobRunRetention: "Simpan riwayat job (hari)",
    jobsHistory: "Riwayat eksekusi",
    jobsAllJobs: "Semua job",
    jobsColJob: "Job",
    jobsColStatus: "Status",
    jobsColStarted: "Mulai",
    jobsColDuration: "Durasi",
    jobsColAffected: "Diubah",
    jobsColTrigger: "Pemicu",
    jobsNoRuns: "Belum ada eksekusi",
    jobsStatusRunning: "Berjalan",
    jobsStatusSuccess: "Berhasil",
    jobsStatusFailed: "Gagal",
    jobsStatusSkipped: "Dilewati",
    jobsTriggerSchedule: "Jadwal",
    jobsTriggerManual: "Manual · {name}",
    jobsConfirmTitle: "Jalankan {name} sekarang?",
    jobsConfirmDesc: "Job ini juga berjalan sesuai jadwal. Aman dijalankan ulang: hanya mengubah yang memang perlu diubah.",
    jobsRunDone: "{name} selesai · {n} data diubah",
    jobsRunSkippedMsg: "{name} dilewati: sedang berjalan",
    jobsRunFailedMsg: "{name} gagal: {error}",
    jobNameCancelHeldSales: "Batalkan transaksi tertahan",
    jobDescCancelHeldSales: "Transaksi hold yang masih terbuka setelah hari berganti dibatalkan dan stok yang ditahan dilepas.",
    jobNameExpirePrescriptions: "Kedaluwarsakan resep",
    jobDescExpirePrescriptions: "Resep yang belum ditebus dan lebih tua dari PRESCRIPTION_VALID_DAYS ditandai kedaluwarsa.",
    jobNamePurgeExpired: "Bersih-bersih data",
    jobDescPurgeExpired: "Menghapus token login dan kunci request yang kedaluwarsa, notifikasi > 30 hari dan riwayat job > 90 hari.",
    jobNameDailyAlerts: "Peringatan harian",
    jobDescDailyAlerts: "Memberi tahu setiap apotek soal stok hampir ED, stok menipis, pembayaran jatuh tempo dan izin yang hampir habis.",
    navPharmacyList: "Daftar Apotek",

    medicineShapesSubtitle: "Kelola bentuk sediaan obat",
    medicineShapeAdd: "Tambah",
    medicineShapeEdit: "Edit",
    medicineShapeDelete: "Hapus",
    medicineShapeName: "Nama Bentuk",
    medicineShapeNamePlaceholder: "cth. Tablet, Kapsul, Sirup",
    medicineShapeDescription: "Deskripsi",
    medicineShapeDescriptionPlaceholder: "Deskripsi opsional...",
    medicineShapeNameRequired: "Nama bentuk wajib diisi",
    medicineShapeTotal: "Total Bentuk",
    medicineShapeSingular: "bentuk",
    medicineShapePlural: "bentuk",
    medicineShapeSearchPlaceholder: "Cari bentuk...",
    medicineShapeNoResults: "Tidak ada bentuk yang cocok",
    medicineShapeEmptyTitle: "Belum ada bentuk",
    medicineShapeEmptyDesc: "Tambahkan bentuk sediaan obat pertama Anda",
    medicineShapeDetailsTitle: "Detail Bentuk",
    medicineShapeDetails: "Detail",
    medicineShapeDeleteConfirmTitle: "Hapus Bentuk",
    medicineShapeDeleteConfirmDesc: "Ini akan menghapus bentuk ini secara permanen. Tindakan ini tidak dapat dibatalkan.",
    medicineShapeSave: "Simpan",
    medicineShapeSaving: "Menyimpan...",
    medicineShapeDeleting: "Menghapus...",
    medicineShapeRegistered: "Terdaftar",
    medicineShapeUpdated: "Terakhir Diperbarui",
    medicineShapeCreateSuccess: "Bentuk berhasil ditambahkan",
    medicineShapeUpdateSuccess: "Bentuk berhasil diperbarui",
    medicineShapeDeleteSuccess: "Bentuk berhasil dihapus",

    medicineTypesSubtitle: "Kelola golongan obat",
    medicineTypeAdd: "Tambah",
    medicineTypeEdit: "Edit",
    medicineTypeDelete: "Hapus",
    medicineTypeName: "Nama Golongan",
    medicineTypeNamePlaceholder: "cth. Generik, Bermerek",
    medicineTypeDescription: "Deskripsi",
    medicineTypeDescriptionPlaceholder: "Deskripsi opsional...",
    medicineTypeNameRequired: "Nama golongan wajib diisi",
    medicineTypeTotal: "Total Golongan",
    medicineTypeSingular: "golongan",
    medicineTypePlural: "golongan",
    medicineTypeSearchPlaceholder: "Cari golongan...",
    medicineTypeNoResults: "Tidak ada golongan yang cocok",
    medicineTypeEmptyTitle: "Belum ada golongan",
    medicineTypeEmptyDesc: "Tambahkan golongan obat pertama Anda",
    medicineTypeDetailsTitle: "Detail Golongan",
    medicineTypeDetails: "Detail",
    medicineTypeDeleteConfirmTitle: "Hapus Golongan",
    medicineTypeDeleteConfirmDesc: "Ini akan menghapus golongan ini secara permanen. Tindakan ini tidak dapat dibatalkan.",
    medicineTypeSave: "Simpan",
    medicineTypeSaving: "Menyimpan...",
    medicineTypeDeleting: "Menghapus...",
    medicineTypeRegistered: "Terdaftar",
    medicineTypeUpdated: "Terakhir Diperbarui",
    medicineTypeCreateSuccess: "Golongan berhasil ditambahkan",
    medicineTypeUpdateSuccess: "Golongan berhasil diperbarui",
    medicineTypeDeleteSuccess: "Golongan berhasil dihapus",
    medicineTypeRequiredPrescription: "Perlu Resep",
    medicineTypeRequiredPrescriptionYes: "Ya",
    medicineTypeRequiredPrescriptionNo: "Tidak",

    medicineClassesSubtitle: "Kelola kelas terapi obat",
    medicineClassAdd: "Tambah",
    medicineClassEdit: "Edit",
    medicineClassDelete: "Hapus",
    medicineClassName: "Nama Kelas Terapi",
    medicineClassNamePlaceholder: "cth. Bebas, Keras, Narkotika",
    medicineClassDescription: "Deskripsi",
    medicineClassDescriptionPlaceholder: "Deskripsi opsional...",
    medicineClassNameRequired: "Nama kelas terapi wajib diisi",
    medicineClassTotal: "Total Kelas Terapi",
    medicineClassSingular: "kelas terapi",
    medicineClassPlural: "kelas terapi",
    medicineClassSearchPlaceholder: "Cari kelas terapi...",
    medicineClassNoResults: "Tidak ada kelas terapi yang cocok",
    medicineClassEmptyTitle: "Belum ada kelas terapi",
    medicineClassEmptyDesc: "Tambahkan kelas terapi obat pertama Anda",
    medicineClassDetailsTitle: "Detail Kelas Terapi",
    medicineClassDetails: "Detail",
    medicineClassDeleteConfirmTitle: "Hapus Kelas Terapi",
    medicineClassDeleteConfirmDesc: "Ini akan menghapus kelas terapi ini secara permanen. Tindakan ini tidak dapat dibatalkan.",
    medicineClassSave: "Simpan",
    medicineClassSaving: "Menyimpan...",
    medicineClassDeleting: "Menghapus...",
    medicineClassRegistered: "Terdaftar",
    medicineClassUpdated: "Terakhir Diperbarui",
    medicineClassCreateSuccess: "Kelas Terapi berhasil ditambahkan",
    medicineClassUpdateSuccess: "Kelas Terapi berhasil diperbarui",
    medicineClassDeleteSuccess: "Kelas Terapi berhasil dihapus",

    medicinesSubtitle: "Kelola katalog obat Anda",
    medicineAdd: "Tambah",
    medicineEdit: "Edit",
    medicineDelete: "Hapus",
    medicineName: "Nama Obat",
    medicineNamePlaceholder: "cth. Paracetamol 500mg",
    medicineGenericName: "Nama Generik",
    medicineGenericNamePlaceholder: "cth. Asetaminofen",
    medicineBarcode: "Barcode",
    medicineBarcodePlaceholder: "Scan atau masukkan barcode",
    medicineShapeLabel: "Bentuk",
    medicineTypeLabel: "Golongan",
    medicineClassLabel: "Kelas Terapi",
    medicineSelectShape: "Pilih bentuk",
    medicineSelectType: "Pilih golongan",
    medicineSelectClass: "Pilih kelas terapi",
    medicineUnit: "Satuan",
    medicineUnitPlaceholder: "cth. Tablet, Strip, Box",
    medicineBarcodeGenerate: "Buat",
    medicineBarcodeHint: "Satu kode untuk semua batch. Kosongkan bila hanya memakai barcode per batch.",
    medicineBarcodeInvalid: "Hanya huruf, angka dan - . / yang diperbolehkan",
    medicineSellingPrice: "Harga Jual",
    medicinePurchasePrice: "Harga Beli",
    medicineStock: "Stok",
    medicineMinStock: "Stok Minimum",
    medicineManufacturer: "Produsen",
    medicineManufacturerPlaceholder: "cth. PT Sanbe Farma",
    medicineNotes: "Catatan",
    medicineNotesPlaceholder: "Catatan tambahan...",
    medicineNameRequired: "Nama obat wajib diisi",
    medicineShapeRequired: "Pilih bentuk obat",
    medicineTypeRequired: "Pilih golongan obat",
    medicineClassRequired: "Pilih kelas terapi obat",
    medicineUnitRequired: "Satuan wajib diisi",
    medicineSellingPriceRequired: "Harga jual wajib diisi",
    medicineTotal: "Total Obat",
    medicineSingular: "obat",
    medicinePlural: "obat",
    medicineSearchPlaceholder: "Cari obat...",
    medicineNoResults: "Tidak ada obat yang cocok",
    medicineEmptyTitle: "Belum ada obat",
    medicineEmptyDesc: "Tambahkan obat pertama ke katalog Anda",
    medicineDetailsTitle: "Detail Obat",
    medicineDetails: "Detail",
    medicineDeleteConfirmTitle: "Hapus Obat",
    medicineDeleteConfirmDesc: "Ini akan menghapus obat ini secara permanen dari katalog. Tindakan ini tidak dapat dibatalkan.",
    medicineSave: "Simpan",
    medicineSaving: "Menyimpan...",
    medicineDeleting: "Menghapus...",
    medicineRegistered: "Terdaftar",
    medicineUpdated: "Terakhir Diperbarui",
    medicineCreateSuccess: "Obat berhasil ditambahkan",
    medicineUpdateSuccess: "Obat berhasil diperbarui",
    medicineDeleteSuccess: "Obat berhasil dihapus",
    medicineLowStock: "Stok rendah",
    medicineIngredients: "Bahan Aktif",
    medicineIngredientPlaceholder: "cth. Paracetamol",
    medicineIngredientAdd: "Tambah Bahan",
    medicineIngredientRemove: "Hapus",
    medicineIngredientsRequired: "Minimal satu bahan aktif wajib diisi",
    medicineStatusLabel: "Status",
    medicineStatusActive: "Aktif",
    medicineStatusInactive: "Tidak Aktif",
    paramKey: "Kunci",
    paramValue: "Nilai",
    paramDescription: "Deskripsi",
    paramRegistered: "Terdaftar",
    paramUpdated: "Terakhir Diperbarui",
    paramEdit: "Edit",
    paramDetails: "Detail",
    paramDetailsTitle: "Detail Parameter",
    paramSave: "Simpan",
    paramSaving: "Menyimpan...",
    paramValueRequired: "Nilai wajib diisi",
    paramSearchPlaceholder: "Cari berdasarkan kunci...",
    paramNoResults: "Tidak ada parameter yang cocok",
    paramTotal: "Total Parameter",
    paramSingular: "parameter",
    paramPlural: "parameter",
    paramUpdateSuccess: "Parameter berhasil diperbarui",
    paramValuePlaceholder: "Masukkan nilai",
    paramDescriptionPlaceholder: "Masukkan deskripsi (opsional)",
    paramEmptyTitle: "Tidak ada parameter",
    paramEmptyDesc: "Parameter dikonfigurasi oleh sistem",
    businessParamSubtitle: "Kelola konfigurasi bisnis apotek Anda",
    systemParamSubtitle: "Kelola konfigurasi sistem platform secara global",

    navUsers: "Pengguna",
    usersSubtitle: "Kelola pengguna platform dan akses",
    userName: "Nama Lengkap",
    userNamePlaceholder: "cth. Budi Santoso",
    userEmail: "Email",
    userEmailPlaceholder: "pengguna@contoh.com",
    userPhone: "Telepon",
    userPhonePlaceholder: "08 xxx xxxx xxxx",
    userAddress: "Alamat",
    userAddressPlaceholder: "Alamat lengkap",
    userPlatformRole: "Role Platform",
    userSelectRole: "Pilih role",
    userStatus: "Status",
    userStatusActive: "Aktif",
    userStatusInactive: "Tidak Aktif",
    userStatusDeleted: "Dihapus",
    platformRoleAdmin: "Admin",
    platformRoleViewer: "Viewer",
    platformRoleSupport: "Support",
    userNameRequired: "Nama lengkap wajib diisi",
    userEmailRequired: "Email wajib diisi",
    userEmailInvalid: "Masukkan alamat email yang valid",
    userAdd: "Tambah",
    userEdit: "Edit",
    userDelete: "Hapus",
    userDetails: "Detail",
    userResetPassword: "Reset Kata Sandi",
    userDeleteConfirmTitle: "Hapus Pengguna",
    userDeleteConfirmDesc: "Ini akan menghapus pengguna secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan. Yakin ingin menghapus",
    userResetPasswordConfirmTitle: "Reset Kata Sandi",
    userResetPasswordConfirmDesc: "Kata sandi baru akan dibuat dan dikirim ke email pengguna. Yakin ingin mereset kata sandi untuk",
    userSave: "Simpan",
    userSaving: "Menyimpan...",
    userDeleting: "Menghapus...",
    userResettingPassword: "Mereset...",
    userSearchPlaceholder: "Cari pengguna...",
    userNoResults: "Tidak ada pengguna yang cocok",
    userEmptyTitle: "Belum ada pengguna",
    userEmptyDesc: "Tambahkan pengguna platform pertama Anda",
    userTotal: "Total Pengguna",
    userSingular: "pengguna",
    userPlural: "pengguna",
    userPlacementCount: "penempatan",
    userDetailsTitle: "Detail Pengguna",
    userRegistered: "Terdaftar",
    userUpdated: "Terakhir Diperbarui",
    userCreateSuccess: "Pengguna berhasil dibuat",
    userUpdateSuccess: "Pengguna berhasil diperbarui",
    userDeleteSuccess: "Pengguna berhasil dihapus",
    userResetPasswordSuccess: "Kata sandi berhasil direset",

    userCreate: "Buat Pengguna",
    userCreating: "Membuat...",
    userWizardStep1: "Info Dasar",
    userWizardStep2: "Apotek",
    userWizardStep3: "Lisensi",
    userWizardStep1Hint: "Masukkan informasi pribadi pengguna untuk membuat akun",
    userWizardStep2Hint: "Tetapkan pengguna ke apotek dengan peran tertentu",
    userWizardStep3Hint: "Tambahkan lisensi praktik (SIPA) untuk penempatan ini",
    wizardNext: "Lanjut",
    wizardBack: "Kembali",
    wizardSkip: "Lewati",
    wizardDone: "Selesai",

    placementSectionTitle: "Penempatan Apotek",
    placementAdd: "Tambah Penempatan",
    placementWizardStep1: "Penempatan",
    placementWizardStep2: "Lisensi",
    placementWizardStep1Hint: "Tetapkan pengguna ke apotek dengan peran dan tanggal mulai",
    placementWizardStep2Hint: "Tambahkan lisensi praktik (SIPA) untuk penempatan ini",
    placementEdit: "Edit Penempatan",
    placementDelete: "Hapus",
    placementPharmacy: "Apotek",
    placementSelectPharmacy: "Pilih apotek",
    placementRole: "Role",
    placementSelectRole: "Pilih role",
    placementJoinedAt: "Tanggal Bergabung",
    placementLeftAt: "Tanggal Keluar",
    placementStatus: "Status",
    placementEmptyTitle: "Belum ada penempatan",
    placementEmptyDesc: "Tugaskan pengguna ini ke apotek",
    placementDeleteConfirmTitle: "Hapus Penempatan",
    placementDeleteConfirmDesc: "Ini akan menghapus penugasan pengguna dari apotek ini. Yakin ingin menghapus",
    placementSave: "Simpan",
    placementSaving: "Menyimpan...",
    placementDeleting: "Menghapus...",
    placementCreateSuccess: "Penempatan berhasil dibuat",
    placementUpdateSuccess: "Penempatan berhasil diperbarui",
    placementDeleteSuccess: "Penempatan berhasil dihapus",
    placementPharmacyRequired: "Apotek wajib dipilih",
    placementRoleRequired: "Role wajib dipilih",
    placementJoinedAtRequired: "Tanggal bergabung wajib diisi",
    placementLeftAtAfterJoinedAt: "Tanggal keluar harus setelah tanggal bergabung",
    placementPresent: "Sekarang",

    licenseAdd: "Tambah Lisensi",
    licenseEdit: "Edit Lisensi",
    licenseDelete: "Hapus Lisensi",
    licenseNumber: "Nomor Lisensi",
    licenseNumberPlaceholder: "cth. SIPA-2024-001",
    licenseValidFrom: "Berlaku Dari",
    licenseValidUntil: "Berlaku Sampai",
    licenseStatus: "Status",
    licenseDeleteConfirmTitle: "Hapus Lisensi",
    licenseDeleteConfirmDesc: "Ini akan menghapus lisensi praktik secara permanen. Yakin ingin menghapus lisensi untuk",
    licenseSave: "Simpan",
    licenseSaving: "Menyimpan...",
    licenseDeleting: "Menghapus...",
    licenseCreateSuccess: "Lisensi berhasil ditambahkan",
    licenseUpdateSuccess: "Lisensi berhasil diperbarui",
    licenseDeleteSuccess: "Lisensi berhasil dihapus",
    licenseNumberRequired: "Nomor lisensi wajib diisi",
    licenseValidFromRequired: "Tanggal berlaku wajib diisi",
    licenseValidUntilRequired: "Tanggal berakhir wajib diisi",
    licenseValidUntilAfterFrom: "Tanggal berakhir harus setelah tanggal berlaku",
    licenseActiveBadge: "Berlisensi",
    licenseNoLicense: "Belum Ada Lisensi",
    licenseHistory: "Riwayat Lisensi",
    licenseHistoryEmpty: "Belum ada riwayat lisensi",

    navPharmacies: "Apotek",
    pharmaciesSubtitle: "Kelola cabang apotek",
    pharmaName: "Nama Apotek",
    pharmaNamePlaceholder: "cth. Apotek Sehat",
    pharmaCode: "Kode",
    pharmaCodePlaceholder: "cth. APT01",
    pharmaCodeInvalid: "Kode hanya boleh alfanumerik (maks 5 karakter)",
    pharmaCategory: "Kategori",
    pharmaSelectCategory: "Pilih kategori",
    pharmaCategoryApotek: "Apotek",
    pharmaCategoryKlinik: "Klinik",
    pharmaCategoryRumahSakit: "Rumah Sakit",
    pharmaCategoryPuskesmas: "Puskesmas",
    pharmaPermitNumber: "Nomor Izin",
    pharmaPermitNumberPlaceholder: "cth. SIA-123456",
    pharmaPhone: "Telepon",
    pharmaPhonePlaceholder: "08 xxx xxxx xxxx",
    pharmaAddress: "Alamat",
    pharmaAddressPlaceholder: "Alamat lengkap",
    pharmaLocation: "Lokasi",
    pharmaLocationPlaceholder: "mis. Jakarta Selatan",
    pharmaLocationRequired: "Lokasi wajib diisi",
    pharmaEmail: "Email",
    pharmaEmailPlaceholder: "apotek@contoh.com",
    pharmaStatus: "Status",
    pharmaStatusActive: "Aktif",
    pharmaStatusInactive: "Tidak Aktif",
    pharmaStatusDeleted: "Dihapus",
    pharmaNameRequired: "Nama apotek wajib diisi",
    pharmaCategoryRequired: "Pilih kategori apotek",
    pharmaPhoneRequired: "Nomor telepon wajib diisi",
    pharmaAddressRequired: "Alamat wajib diisi",
    pharmaPermitNumberRequired: "Nomor izin wajib diisi",
    pharmaAdd: "Tambah",
    pharmaEdit: "Edit",
    pharmaDelete: "Hapus",
    pharmaDetails: "Detail",
    pharmaDeleteConfirmTitle: "Hapus Apotek",
    pharmaDeleteConfirmDesc: "Ini akan menghapus apotek secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan. Yakin ingin menghapus",
    pharmaSave: "Simpan",
    pharmaSaving: "Menyimpan...",
    pharmaDeleting: "Menghapus...",
    pharmaSearchPlaceholder: "Cari apotek...",
    pharmaNoResults: "Tidak ada apotek yang cocok",
    pharmaEmptyTitle: "Belum ada apotek",
    pharmaEmptyDesc: "Tambahkan cabang apotek pertama Anda",
    pharmaTotal: "Total Apotek",
    pharmaSingular: "apotek",
    pharmaPlural: "apotek",
    pharmaDetailsTitle: "Detail Apotek",
    pharmaRegistered: "Terdaftar",
    pharmaUpdated: "Terakhir Diperbarui",
    pharmaCreateSuccess: "Apotek berhasil dibuat",
    pharmaUpdateSuccess: "Apotek berhasil diperbarui",
    pharmaDeleteSuccess: "Apotek berhasil dihapus",
    pharmaWizardStep1: "Info Apotek",
    pharmaWizardStep2: "Izin Usaha",
    pharmaWizardStep3: "Pengguna & Peran",
    pharmaWizardStep1Hint: "Masukkan informasi dasar apotek",
    pharmaWizardStep2Hint: "Daftarkan izin operasional apotek (SIA)",
    pharmaWizardStep3Hint: "Tambahkan pengguna ke apotek ini dengan peran yang sesuai",
    placementUser: "Pengguna",
    placementSelectUser: "Pilih pengguna",
    placementUserRequired: "Pengguna wajib diisi",
    pharmaNoHeadPharmacist: "Belum ada Head Pharmacist",
    pharmaNoHeadPharmacistHint: "Apotek ini belum memiliki Head Pharmacist dan belum bisa dipilih",
    bizLicenseTitle: "Izin Usaha (SIA)",
    bizLicenseDesc: "Daftarkan izin operasional apotek",
    bizLicenseNumber: "Nomor Izin",
    bizLicenseNumberPlaceholder: "cth. SIA-2024-001",
    bizLicenseValidFrom: "Berlaku Dari",
    bizLicenseValidUntil: "Berlaku Sampai",
    bizLicenseNumberRequired: "Nomor izin wajib diisi",
    bizLicenseValidFromRequired: "Tanggal berlaku wajib diisi",
    bizLicenseValidUntilRequired: "Tanggal berakhir wajib diisi",
    bizLicenseValidUntilAfterFrom: "Tanggal berakhir harus setelah tanggal berlaku",

    navRoles: "Role",
    rolesSubtitle: "Kelola role dan izin akses",
    roleAdd: "Tambah",
    roleEdit: "Edit",
    roleDelete: "Hapus",
    roleDetails: "Detail",
    roleName: "Nama Role",
    roleNamePlaceholder: "cth. Kepala Apoteker",
    roleType: "Tipe Role",
    roleSelectType: "Pilih tipe",
    roleTypeOwner: "Owner",
    roleTypeAdmin: "Admin",
    roleTypePharmacist: "Apoteker",
    roleTypeHeadPharmacist: "Kepala Apoteker",
    roleTypeCashier: "Kasir",
    roleStatus: "Status",
    roleStatusAll: "Semua Status",
    roleStatusActive: "Aktif",
    roleStatusInactive: "Tidak Aktif",
    roleStatusDeleted: "Dihapus",
    roleIsGlobal: "Cakupan",
    roleScopeAll: "Semua",
    roleScopeGlobal: "Global",
    roleScopePharmacy: "Apotek",
    roleRequiresLicense: "Butuh Lisensi",
    roleRequiresLicenseYes: "Ya — wajib memiliki SIPA",
    roleRequiresLicenseNo: "Tidak — tanpa lisensi",
    roleFilterType: "Tipe",
    roleFilterTypeAll: "Semua Tipe",
    rolePermissionCount: "izin",
    roleNameRequired: "Nama role wajib diisi",
    roleTypeRequired: "Pilih tipe role",
    roleSearchPlaceholder: "Cari role...",
    roleNoResults: "Tidak ada role yang cocok",
    roleEmptyTitle: "Belum ada role",
    roleEmptyDesc: "Buat role pertama untuk mengelola kontrol akses",
    roleDetailsTitle: "Detail Role",
    roleDeleteConfirmTitle: "Hapus Role",
    roleDeleteConfirmDesc: "Ini akan menghapus role secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.",
    roleSave: "Simpan",
    roleSaving: "Menyimpan...",
    roleDeleting: "Menghapus...",
    roleRegistered: "Terdaftar",
    roleUpdated: "Terakhir Diperbarui",
    roleCreateSuccess: "Role berhasil dibuat",
    roleUpdateSuccess: "Role berhasil diperbarui",
    roleDeleteSuccess: "Role berhasil dihapus",
    roleManagePermissions: "Kelola Izin",
    rolePermissionsTitle: "Atur Izin",
    rolePermissionsDesc: "Pilih izin yang akan diberikan kepada role ini",
    rolePermissionsSave: "Simpan Izin",
    rolePermissionsSaving: "Menyimpan...",
    rolePermissionsSuccess: "Izin berhasil diperbarui",
    rolePermissionsNone: "Belum ada izin yang ditetapkan",
    rolePermissionsSelectAll: "Pilih semua",
    rolePermissionsDeselectAll: "Batalkan semua",
    rolePermissionsSearchPlaceholder: "Cari izin...",
    rolePermissionsNoResults: "Tidak ada izin yang cocok",

    poSubtitle: "Kelola pesanan pembelian ke distributor",
    poAdd: "Tambah",
    poEdit: "Edit",
    poDelete: "Hapus",
    poDetails: "Detail",
    poCancel: "Batalkan Pesanan",
    poSubmit: "Cetak",
    poOrderNumber: "No. Pesanan",
    poDistributor: "Distributor",
    poSelectDistributor: "Pilih distributor",
    poDistributorRequired: "Distributor wajib dipilih",
    poSignedBy: "Ditandatangani Oleh",
    poSelectSignedBy: "Pilih penandatangan (opsional)",
    poDescription: "Catatan",
    poDescriptionPlaceholder: "Catatan tambahan tentang pesanan ini...",
    poCancellationReason: "Alasan Pembatalan",
    poCancellationReasonPlaceholder: "Jelaskan alasan pembatalan pesanan ini...",
    poCancellationReasonRequired: "Alasan pembatalan wajib diisi",
    poStatus: "Status",
    poStatusDraft: "Draf",
    poStatusSent: "Terkirim",
    poStatusCompleted: "Selesai",
    poStatusCancelled: "Dibatalkan",
    poItemsSection: "Item Pesanan",
    poItemMedicine: "Obat",
    poItemSelectMedicine: "Pilih obat",
    poItemMedicineRequired: "Pilih obat terlebih dahulu",
    poItemQuantity: "Qty",
    poItemQuantityRequired: "Jumlah harus lebih dari 0",
    poItemUnit: "Satuan",
    poItemUnitRequired: "Satuan wajib diisi",
    poItemDescription: "Catatan",
    poItemDescriptionPlaceholder: "Catatan opsional...",
    poItemAdd: "Tambah Item",
    poItemRemove: "Hapus",
    poItemsRequired: "Minimal satu item diperlukan",
    poItemCount: "item",
    poTotal: "Total Pesanan Pembelian",
    poSingular: "pesanan pembelian",
    poPlural: "pesanan pembelian",
    poSearchPlaceholder: "Cari nomor pesanan atau distributor...",
    poNoResults: "Tidak ada pesanan yang cocok",
    poEmptyTitle: "Belum ada pesanan pembelian",
    poEmptyDesc: "Buat pesanan pembelian pertama untuk mulai memesan dari distributor",
    poDetailsTitle: "Detail Pesanan Pembelian",
    poDeleteConfirmTitle: "Hapus Pesanan Pembelian",
    poDeleteConfirmDesc: "Ini akan menghapus pesanan pembelian draf ini secara permanen. Tindakan ini tidak dapat dibatalkan.",
    poCancelConfirmTitle: "Batalkan Pesanan Pembelian",
    poCancelConfirmDesc: "Ini akan membatalkan pesanan pembelian. Harap berikan alasan pembatalan.",
    poSubmitConfirmTitle: "Cetak Pesanan Pembelian",
    poSubmitConfirmDesc: "Mencetak pesanan ini akan mengirimkannya ke distributor. Pastikan penandatangan sudah ditetapkan sebelum mencetak.",
    poSave: "Simpan",
    poSaving: "Menyimpan...",
    poDeleting: "Menghapus...",
    poCancelling: "Membatalkan...",
    poSubmitting: "Mencetak...",
    poRegistered: "Dibuat",
    poUpdated: "Terakhir Diperbarui",
    poOrderedAt: "Tanggal Pesan",
    poCreateSuccess: "Pesanan pembelian berhasil dibuat",
    poUpdateSuccess: "Pesanan pembelian berhasil diperbarui",
    poDeleteSuccess: "Pesanan pembelian berhasil dihapus",
    poCancelSuccess: "Pesanan pembelian berhasil dibatalkan",
    poSubmitSuccess: "Pesanan pembelian berhasil dicetak dan dikirim",
    poCompleteSuccess: "Pesanan pembelian ditandai selesai",
    poDateFrom: "Dari",
    poDateTo: "Sampai",
    poFilterStatus: "Status",
    poFilterDistributor: "Distributor",
    poRepurchase: "Pesan Ulang",
    poPrint: "Cetak",
    poReprint: "Cetak Ulang",
    poPrinting: "Mencetak...",
    poPrintReceipt: "Cetak Struk",
    poReceiptTitle: "PESANAN PEMBELIAN",
    poReceiptPraktikApoteker: "Praktik Apoteker",
    poReceiptKepada: "Kepada:",
    poReceiptTotalItems: "Total Item",
    poReceiptPenanggungJawab: "Penanggung Jawab",
    poMarkReceived: "Tandai Diterima",
    poMarkReceivedConfirmTitle: "Tandai Pesanan Diterima",
    poMarkReceivedConfirmDesc: "Konfirmasi bahwa barang dari pesanan pembelian ini telah diterima dari distributor.",
    poMarkingReceived: "Memproses...",

    invoicesSubtitle: "Kelola faktur pembelian dan penerimaan stok",
    invoiceAdd: "Tambah",
    invoiceDelete: "Hapus",
    invoiceDetails: "Detail",
    invoiceNumber: "No. Faktur",
    invoiceNumberPlaceholder: "cth. INV-2024-001",
    invoiceNumberRequired: "Nomor faktur wajib diisi",
    invoiceDate: "Tanggal Faktur",
    invoiceDateRequired: "Tanggal faktur wajib diisi",
    invoiceDueDate: "Jatuh Tempo",
    invoiceDistributor: "Distributor",
    invoiceSelectDistributor: "Pilih distributor",
    invoiceDistributorRequired: "Distributor wajib dipilih",
    invoicePurchaseOrder: "Pesanan Pembelian",
    invoiceSelectPurchaseOrder: "Tautkan ke pesanan pembelian (opsional)",
    invoiceSignedBy: "Ditandatangani Oleh",
    invoiceSelectSignedBy: "Pilih penandatangan",
    invoiceSignedByRequired: "Penandatangan wajib dipilih",
    invoiceDescription: "Catatan",
    invoiceDescriptionPlaceholder: "Catatan tambahan tentang faktur ini...",
    invoicePaymentStatus: "Status Pembayaran",
    invoicePaymentStatusUnpaid: "Belum Dibayar",
    invoicePaymentStatusPartial: "Sebagian",
    invoicePaymentStatusPaid: "Lunas",
    invoiceTotalAmount: "Total Tagihan",
    invoicePaidAmount: "Sudah Dibayar",
    invoiceItemsSection: "Item Faktur",
    invoiceItemMedicine: "Obat",
    invoiceItemSelectMedicine: "Pilih obat",
    invoiceItemMedicineRequired: "Pilih obat terlebih dahulu",
    invoiceItemBatchNumber: "No. Batch",
    invoiceItemBatchNumberPlaceholder: "cth. BT-20241201",
    invoiceItemBatchNumberRequired: "Nomor batch wajib diisi",
    invoiceItemExpiryDate: "Tanggal Kadaluarsa",
    invoiceItemExpiryDateRequired: "Tanggal kadaluarsa wajib diisi",
    invoiceItemQtyBox: "Qty Kotak",
    invoiceItemQtyBoxRequired: "Jumlah kotak harus lebih dari 0",
    invoiceItemQtyPerBox: "Per Kotak",
    invoiceItemQtyPerBoxRequired: "Jumlah per kotak harus lebih dari 0",
    invoiceItemQtyPieces: "Qty Satuan",
    invoiceItemQtyPiecesRequired: "Jumlah satuan harus lebih dari 0",
    invoiceItemPrice: "Harga/Kotak",
    invoiceItemPriceRequired: "Harga per kotak harus lebih dari 0",
    invoiceItemDiscount: "Disc %",
    invoiceItemFinalPrice: "Harga Akhir",
    invoiceItemTotal: "Total Harga",
    invoiceItemAdd: "Tambah Item",
    invoiceItemsRequired: "Minimal satu item diperlukan",
    invoiceItemCount: "item",
    invoiceSearchPlaceholder: "Cari nomor faktur atau distributor...",
    invoiceNoResults: "Tidak ada faktur yang cocok",
    invoiceEmptyTitle: "Belum ada faktur",
    invoiceEmptyDesc: "Buat faktur pertama untuk mulai mencatat penerimaan barang",
    invoiceDetailsTitle: "Detail Faktur",
    invoiceDeleteConfirmTitle: "Hapus Faktur",
    invoiceDeleteConfirmDesc: "Ini akan menghapus faktur secara permanen dan membalik pergerakan stok. Tindakan ini tidak dapat dibatalkan.",
    invoiceSave: "Simpan",
    invoiceSaving: "Menyimpan...",
    invoiceDeleting: "Menghapus...",
    invoiceTotal: "Total Faktur",
    invoiceSingular: "faktur",
    invoicePlural: "faktur",
    invoiceRegistered: "Dibuat",
    invoiceUpdated: "Terakhir Diperbarui",
    invoiceFilterStatus: "Status",
    invoiceFilterDistributor: "Distributor",
    invoiceCreateSuccess: "Faktur berhasil dibuat",
    invoiceDeleteSuccess: "Faktur berhasil dihapus",
    invoiceDateFrom: "Dari",
    invoiceDateTo: "Sampai",
    invoiceReceiveDate: "Tanggal Terima",
    invoicePpnEnabled: "Aktifkan PPN",
    invoicePpnNominal: "Nominal PPN (Rp)",
    invoiceDiscountNominal: "Nominal Diskon (Rp)",
    invoiceSubtotal: "Subtotal",
    invoiceDiscount: "Diskon",
    invoiceRemaining: "Sisa",
    invoiceReceiveDateAfterInvoice: "Tanggal terima harus setelah tanggal faktur",
    invoiceItemIncomplete: "Tidak Lengkap",
    invoiceDueDateRequired: "Jatuh tempo wajib diisi",
    invoiceReceiveDateRequired: "Tanggal terima wajib diisi",
    invoiceItemsIncompleteWarning: "Lengkapi semua data item (no. batch, tanggal kadaluarsa, harga) sebelum menyimpan",
    invoiceItemCabinet: "Lemari",
    invoiceItemShelf: "Rak",
    invoiceItemBin: "Laci",
    invoiceItemSelectBin: "Pilih laci",
    invoiceItemCabinetRequired: "Silakan pilih lemari",
    invoiceItemShelfRequired: "Silakan pilih rak",
    invoiceItemBinRequired: "Silakan pilih laci",
    invoicePaymentSectionTitle: "Riwayat Pembayaran",
    invoicePaymentAdd: "Tambah Pembayaran",
    invoicePaymentAddBtn: "Tambah",
    invoicePaymentNoHistory: "Belum ada pembayaran tercatat",
    invoicePaymentMethodLabel: "Metode Pembayaran",
    invoicePaymentMethodCash: "Tunai",
    invoicePaymentMethodTransfer: "Transfer Bank",
    invoicePaymentMethodCredit: "Kredit",
    invoicePaymentAmountLabel: "Jumlah",
    invoicePaymentAmountPlaceholder: "0",
    invoicePaymentAmountRequired: "Jumlah wajib diisi",
    invoicePaymentDateLabel: "Tanggal Pembayaran",
    invoicePaymentDateRequired: "Tanggal pembayaran wajib diisi",
    invoicePaymentDescriptionLabel: "Catatan",
    invoicePaymentDescriptionPlaceholder: "Catatan opsional",
    invoicePaymentAfterLabel: "Setelah pembayaran ini",
    invoicePaymentPayFull: "Bayar penuh",
    invoicePaymentSave: "Simpan Pembayaran",
    invoicePaymentSaving: "Menyimpan...",
    invoicePaymentAddSuccess: "Pembayaran berhasil dicatat",
    invoicePaymentDeleteTitle: "Hapus Pembayaran",
    invoicePaymentDeleteDesc: "Entri pembayaran ini akan dihapus permanen dan jumlah yang dibayar akan dikurangi.",
    invoicePaymentDeleteSuccess: "Pembayaran berhasil dihapus",
    invoicePaymentAlreadyPaid: "Faktur ini sudah lunas",

    stockSubtitle: "Pantau inventori obat, detail batch, dan level stok",
    stockSearchPlaceholder: "Cari obat...",
    stockNoResults: "Tidak ada obat yang cocok",
    stockEmptyTitle: "Belum ada data stok",
    stockEmptyDesc: "Stok dibuat otomatis saat faktur diterima",
    stockMedicineName: "Obat",
    stockTotalPieces: "Total Qty",
    stockReorderLevel: "Reorder Di",
    stockEffectivePrice: "Harga Efektif",
    stockBasePrice: "Harga Dasar",
    stockCalculatedPrice: "Harga Kalkulasi",
    stockDetails: "Detail",
    stockDetailsTitle: "Detail Stok",
    stockBatchSection: "Detail Batch",
    stockBatchNumber: "No. Batch",
    stockBarcode: "Barcode",
    stockExpiryDate: "Kadaluarsa",
    stockQtyPieces: "Qty (Satuan)",
    stockQtyBox: "Qty (Kotak)",
    stockQtyPerBox: "Per Kotak",
    stockDistributor: "Distributor",
    stockUpdated: "Terakhir Diperbarui",
    stockSingular: "stok",
    stockPlural: "stok",
    stockTotal: "Total Stok",
    stockStatusNormal: "Normal",
    stockStatusLow: "Stok Rendah",
    stockStatusCritical: "Kritis",
    stockFilterStatus: "Status",
    stockFilterLowStock: "Stok Rendah",
    stockFilterExpiringSoon: "Hampir Kadaluarsa",
    stockManualPriceNote: "Harga diatur manual",
    stockAdjust: "Sesuaikan",
    stockAdjustTitle: "Sesuaikan Stok",
    stockAdjustNewQty: "Jumlah Baru",
    stockAdjustNewQtyPlaceholder: "Masukkan jumlah baru",
    stockAdjustNewQtyRequired: "Jumlah harus 0 atau lebih",
    stockAdjustCurrentQty: "Saat ini",
    stockAdjustDescription: "Alasan / Catatan",
    stockAdjustDescriptionPlaceholder: "Jelaskan mengapa stok ini disesuaikan...",
    stockAdjustDescriptionRequired: "Alasan wajib diisi",
    stockAdjustSignedBy: "Ditandatangani Oleh",
    stockAdjustSelectSignedBy: "Pilih penandatangan",
    stockAdjustSignedByRequired: "Penandatangan wajib dipilih",
    stockAdjustSave: "Sesuaikan",
    stockAdjustSaving: "Menyesuaikan...",
    stockAdjustSuccess: "Stok berhasil disesuaikan",
    stockUpdatePrice: "Atur Harga",
    stockUpdatePriceTitle: "Atur Harga Jual",
    stockSellingPriceLabel: "Harga Jual",
    stockSellingPricePlaceholder: "Kosongkan untuk menggunakan harga kalkulasi",
    stockClearPriceHint: "Kosongkan untuk mereset ke harga kalkulasi otomatis",
    stockUpdatePriceSave: "Simpan",
    stockUpdatePriceSaving: "Menyimpan...",
    stockUpdatePriceSuccess: "Harga jual berhasil diperbarui",
    stockUpdateReorder: "Atur Reorder",
    stockUpdateReorderTitle: "Atur Level Reorder",
    stockReorderLevelLabel: "Level Reorder",
    stockReorderLevelPlaceholder: "cth. 50",
    stockReorderLevelRequired: "Level reorder harus 0 atau lebih",
    stockUpdateReorderSave: "Simpan",
    stockUpdateReorderSaving: "Menyimpan...",
    stockUpdateReorderSuccess: "Level reorder berhasil diperbarui",
    stockDispose: "Disposal",
    stockReturn: "Retur",
    stockPrint: "Cetak",
    printTitle: "Cetak barcode",
    printBatchLabel: "Label batch",
    printMedicineLabel: "Label obat",
    printStockCard: "Kartu stok",
    printBatchLabelHint: "Satu kode untuk seluruh batch: semua kemasan batch ini discan sama. Stok dan ED bisa ditampilkan.",
    printMedicineLabelHint: "Untuk rak: satu kode untuk semua batch. Kasir otomatis memakai batch dengan ED terdekat.",
    printStockCardHint: "Kartu A5 per obat: satu baris per hari, semua batch digabung.",
    printNoMedicineBarcode: "Obat ini belum punya barcode. Tambahkan dulu (scan kemasan atau buat otomatis) di form obat.",
    printSize: "Ukuran label",
    printSizeThermal5030: "Thermal 50 × 30 mm",
    printSizeThermal3825: "Thermal 38 × 25 mm",
    printSizeA4: "Lembar A4, 3 × 8 (64 × 34 mm)",
    printCopies: "Jumlah label",
    printShowPrice: "Tampilkan harga jual",
    printItemLabel: "Label per item",
    printItemLabelHint: "Satu label per box, masing-masing kodenya sendiri (kode batch + nomor item). Tanpa stok, berisi isi kemasan.",
    printFields: "Tampilkan di label",
    printShowStock: "Stok batch",
    printShowTotalStock: "Total stok (semua batch)",
    printShowExpiry: "Tanggal ED",
    printShowContents: "Isi (per box)",
    printStartNumber: "Nomor item awal",
    labelTotalStock: "Total stok",
    labelContents: "Isi",
    labelItem: "Item",
    labelBox: "box",
    printPreview: "Pratinjau",
    printButton: "Cetak",
    printPopupBlocked: "Browser memblokir jendela cetak. Izinkan pop-up untuk situs ini lalu coba lagi.",
    labelBatch: "Batch",
    labelExpiry: "ED",
    labelStock: "Stok",
    labelAllBatches: "Semua batch",
    labelStockCard: "Kartu stok",
    labelPackaging: "Bentuk / kemasan",
    labelLocation: "Lokasi",
    labelMinStock: "Stok min.",
    labelDate: "Tanggal",
    labelIn: "Masuk",
    labelOut: "Keluar",
    labelBalance: "Sisa",
    labelInitials: "Paraf",
    labelOpeningBalance: "Saldo awal",
    labelPrintedOn: "Dicetak dari PharmaCare ·",
    labelPage: "Lembar",
    labelNotes: "Keterangan",
    labelPeriod: "Periode",
    labelSalesCount: "{n} penjualan",
    labelAdjustmentsCount: "{n} penyesuaian",
    labelBatchesInStock: "Batch tersedia",
    navStockLabels: "Cetak Label",
    stockLabelsSubtitle: "Label barcode dan kartu stok, dicetak sekaligus",
    stockLabelsTabLabels: "Label barcode",
    stockLabelsTabCard: "Kartu stok",
    stockLabelsSearch: "Cari obat atau scan barcodenya…",
    stockLabelsSearchHint: "Cari obat untuk menambahkan labelnya.",
    stockLabelsNoResults: "Tidak ada obat dengan stok yang cocok.",
    stockLabelsNoBatches: "Tidak ada batch dengan stok",
    stockLabelsAdd: "Tambah",
    stockLabelsQueue: "Antrean cetak",
    stockLabelsQueueEmpty: "Belum ada label. Cari obat, lalu tambahkan label batch, per item, atau label obat.",
    stockLabelsClear: "Kosongkan",
    stockLabelsRemove: "Hapus",
    stockLabelsTotal: "{n} label",
    stockLabelsPrintAll: "Cetak semua",
    stockLabelsSettings: "Pengaturan label",
    stockLabelsLoading: "Memuat data label…",
    stockLabelsSkippedNoBarcode: "{n} label obat dilewati: obatnya belum punya barcode.",
    stockCardPickMedicine: "Pilih obat",
    stockCardFrom: "Dari tanggal",
    stockCardTo: "Sampai tanggal",
    stockCardPickHint: "Pilih obat untuk melihat kartu stoknya.",
    stockCardEmptyPeriod: "Tidak ada keluar-masuk pada periode ini.",
    stockCardAfterPeriod: "Stok hari ini berbeda: ada {n} transaksi setelah periode ini.",
    stockCardInvalidPeriod: "Tanggal mulai harus sebelum tanggal akhir, maksimal satu tahun.",

    sdSubtitle: "Catat dan kelola penghapusan serta disposal stok obat",
    sdAdd: "Tambah",
    sdEdit: "Edit",
    sdDetails: "Detail",
    sdDelete: "Hapus",
    sdCancel: "Batalkan",
    sdComplete: "Tandai Terbuang",
    sdDetailsTitle: "Detail Disposal",
    sdSave: "Simpan",
    sdSaving: "Menyimpan...",
    sdDeleting: "Menghapus...",
    sdCancelling: "Membatalkan...",
    sdCompleting: "Memproses...",
    sdStatusDraft: "Draf",
    sdStatusCompleted: "Selesai",
    sdStatusCancelled: "Dibatalkan",
    sdReasonExpired: "Kadaluarsa",
    sdReasonDamaged: "Rusak",
    sdReasonContaminated: "Terkontaminasi",
    sdDisposalNumber: "No. Disposal",
    sdStatus: "Status",
    sdDisposedAt: "Tanggal Disposal",
    sdSignedBy: "Ditandatangani Oleh",
    sdSelectSignedBy: "Pilih penandatangan (opsional)",
    sdDescription: "Keterangan",
    sdDescriptionPlaceholder: "Catatan opsional tentang disposal ini...",
    sdCancellationReason: "Alasan Pembatalan",
    sdCancellationReasonPlaceholder: "Alasan pembatalan...",
    sdCancellationReasonRequired: "Alasan pembatalan wajib diisi",
    sdItemsSection: "Item",
    sdItemBatch: "Batch Stok",
    sdItemSelectBatch: "Pilih batch stok",
    sdItemQuantity: "Jml (pcs)",
    sdItemReason: "Alasan",
    sdItemSelectReason: "Pilih alasan",
    sdItemAdd: "Tambah Item",
    sdItemBatchRequired: "Batch stok wajib dipilih",
    sdItemQuantityRequired: "Jumlah harus bilangan bulat positif",
    sdItemReasonRequired: "Alasan wajib dipilih",
    sdItemsRequired: "Minimal satu item diperlukan",
    sdItemCount: "item",
    sdSingular: "item",
    sdPlural: "item",
    sdSearchPlaceholder: "Cari disposal...",
    sdNoResults: "Disposal tidak ditemukan",
    sdEmptyTitle: "Belum ada disposal",
    sdEmptyDesc: "Buat catatan disposal untuk menghapus stok kadaluarsa atau rusak",
    sdFilterStatus: "Status",
    sdDeleteConfirmTitle: "Hapus Disposal",
    sdDeleteConfirmDesc: "Draf disposal akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.",
    sdCancelConfirmTitle: "Batalkan Disposal",
    sdCancelConfirmDesc: "Berikan alasan pembatalan. Jika sudah selesai, stok akan dikembalikan.",
    sdCompleteConfirmTitle: "Tandai Terbuang",
    sdCompleteConfirmDesc: "Jumlah stok yang tercantum akan dikurangi. Tindakan ini hanya dapat dibatalkan dengan membatalkan disposal.",
    sdCompleteNoSignerWarning: "Belum ada penandatangan. Server membutuhkan penandatangan sebelum disposal diselesaikan.",
    sdCreateSuccess: "Disposal berhasil dibuat",
    sdUpdateSuccess: "Disposal berhasil diperbarui",
    sdDeleteSuccess: "Disposal berhasil dihapus",
    sdCancelSuccess: "Disposal berhasil dibatalkan",
    sdCompleteSuccess: "Disposal berhasil diselesaikan",
    sdBatchLabel: "Batch",
    sdExpiryLabel: "Exp",

    // Sales History page
    salesSubtitle: "Lihat dan kelola transaksi penjualan serta pembayaran",
    saleNewSale: "Penjualan Baru",
    saleDetails: "Detail",
    saleDetailsTitle: "Detail Penjualan",
    saleCancel: "Batalkan",
    saleCancelling: "Membatalkan...",
    saleRefund: "Refund",
    saleRefunding: "Memproses refund...",
    saleNumber: "Nomor Penjualan",
    saleStatus: "Status",
    saleType: "Jenis Penjualan",
    saleTypeCash: "Tunai",
    saleTypeCredit: "Kredit",
    saleStatusCompleted: "Selesai",
    saleStatusCancelled: "Dibatalkan",
    saleStatusRefunded: "Direfund",
    saleStatusPending: "Tertunda",
    salePatient: "Pasien",
    saleSoldAt: "Tanggal Penjualan",
    saleDueDate: "Tanggal Jatuh Tempo",
    saleDescription: "Deskripsi",
    saleTotalAmount: "Total Tagihan",
    saleTaxAmount: "PPN",
    salePaidAmount: "Jumlah Terbayar",
    saleRemaining: "Sisa Tagihan",
    saleItemsSection: "Item",
    saleBatchLabel: "Batch",
    saleDiscountLabel: "Diskon",
    saleSearchPlaceholder: "Cari berdasarkan nomor penjualan atau pasien...",
    saleNoResults: "Tidak ada hasil ditemukan",
    saleEmptyTitle: "Belum ada penjualan",
    saleEmptyDesc: "Penjualan akan muncul di sini setelah transaksi kasir diselesaikan",
    saleFilterStatus: "Status",
    saleFilterType: "Jenis Penjualan",
    saleFilterPaymentStatus: "Status Pembayaran",
    saleFilterPatient: "Pasien",
    saleCancelConfirmTitle: "Batalkan Penjualan",
    saleCancelConfirmDesc: "Tindakan ini akan membatalkan penjualan dan mengembalikan pergerakan stok. Tindakan ini tidak dapat dibatalkan.",
    saleCancelReason: "Alasan Pembatalan",
    saleCancelReasonPlaceholder: "Masukkan alasan pembatalan penjualan ini",
    saleCancelReasonRequired: "Alasan pembatalan wajib diisi",
    saleCancelSuccess: "Penjualan berhasil dibatalkan",
    saleRefundConfirmTitle: "Refund Penjualan",
    saleRefundConfirmDesc: "Tindakan ini akan merefund penjualan dan mengembalikan pergerakan stok. Tindakan ini tidak dapat dibatalkan.",
    saleRefundReason: "Alasan Refund",
    saleRefundReasonPlaceholder: "Masukkan alasan refund penjualan ini",
    saleRefundReasonRequired: "Alasan refund wajib diisi",
    saleRefundSuccess: "Penjualan berhasil direfund",
    salePaymentStatusColumn: "Status Pembayaran",
    salePaymentStatusUnpaid: "Belum Dibayar",
    salePaymentStatusPartial: "Sebagian",
    salePaymentStatusPaid: "Lunas",
    salePaymentMethodCash: "Tunai",
    salePaymentMethodTransfer: "Transfer",
    salePaymentMethodCredit: "Kredit",
    salePaymentHistorySection: "Riwayat Pembayaran",
    salePaymentAdd: "Tambah Pembayaran",
    salePaymentAddSuccess: "Pembayaran berhasil ditambahkan",
    salePaymentMethodLabel: "Metode Pembayaran",
    salePaymentAmountLabel: "Jumlah",
    salePaymentAmountPlaceholder: "Masukkan jumlah pembayaran",
    salePaymentAmountRequired: "Jumlah pembayaran wajib diisi",
    salePaymentPayFull: "Bayar seluruh sisa tagihan",
    salePaymentAfterLabel: "Sisa tagihan setelah pembayaran ini",
    salePaymentDateLabel: "Tanggal Pembayaran",
    salePaymentDateRequired: "Tanggal pembayaran wajib diisi",
    salePaymentDescriptionLabel: "Deskripsi",
    salePaymentDescriptionPlaceholder: "Masukkan catatan untuk pembayaran ini (opsional)",
    salePaymentSave: "Simpan",
    salePaymentSaving: "Menyimpan...",
    saleComplete: "Selesaikan",
    saleCompleting: "Menyelesaikan...",
    saleCompleteConfirmTitle: "Selesaikan Penjualan",
    saleCompleteConfirmDesc: "Tindakan ini akan menyelesaikan penjualan yang ditunda dan menandainya sebagai selesai.",
    saleCompleteSuccess: "Penjualan berhasil diselesaikan",
    salePrescriptionSection: "Resep",
    salePrescriptionNumber: "No. Resep",
    salePrescriptionDoctor: "Dokter",
    salePrescriptionDate: "Tanggal Resep",

    // Cashier / POS page
    posSubtitle: "Proses transaksi penjualan untuk pasien walk-in maupun terdaftar",
    posSearchLabel: "Cari Obat",
    posSearchPlaceholder: "Scan barcode atau cari nama / SKU...",
    posBatchLabel: "Batch",
    posScanBarcode: "Scan barcode",
    posScanModalTitle: "Scan Barcode",
    posScanInstructions: "Arahkan kamera ke barcode produk",
    posScanNotFound: "Tidak ada produk untuk barcode ini",
    posScanCameraError: "Tidak dapat mengakses kamera",
    posCategoryAll: "Semua",
    posProductsCountLabel: "produk",
    posStockLabel: "Stok",
    posStockRemainingLabel: "Sisa",
    posOutOfStock: "Stok habis",
    posNoProductsTitle: "Tidak ada produk ditemukan",
    posNoProductsDesc: "Coba kata kunci atau kategori lain",
    posLoadMore: "Muat lebih banyak",
    posTransactionLabel: "Transaksi",
    posReset: "Reset",
    posSelectPatient: "Pilih pasien",
    posAddNote: "Tambah catatan",
    posHold: "Tunda",
    posHolding: "Menunda...",
    posHoldSuccess: "Penjualan berhasil ditunda",
    posHeldSalesBtn: "Tertunda",
    posHeldSalesTitle: "Transaksi Tertunda",
    posHeldSalesEmpty: "Tidak ada transaksi tertunda",
    posHeldSalesResume: "Lanjutkan",
    posHeldSalesResuming: "Melanjutkan...",
    posHeldSalesResumeSuccess: "Transaksi dilanjutkan",
    posHeldSalesClearWarning: "Keranjang saat ini akan dikosongkan",
    posHeldSalesContinue: "Lanjutkan",
    posHeldSalesCancelHeld: "Batalkan",
    posHeldSalesCancelSuccess: "Transaksi dibatalkan",
    posHeldSalesCancelConfirmTitle: "Batalkan transaksi ini?",
    posHeldSalesCancelConfirmDesc: "Transaksi yang ditahan ini akan dibatalkan secara permanen dan tidak dapat dikembalikan.",
    posCartSection: "Keranjang",
    posCartEmptyTitle: "Keranjang masih kosong",
    posCartEmptyDesc: "Cari dan tambahkan obat untuk memulai penjualan",
    posPatientLabel: "Pasien",
    posWalkInPatient: "Pasien Walk-in",
    posPrescriptionLabel: "Resep",
    posPrescriptionPlaceholder: "Cari resep...",
    posPrescriptionOptional: "Opsional — tautkan resep ke transaksi ini",
    posRxNoPrescriptionWarning: "Keranjang mengandung item Rx — resep wajib ditautkan sebelum checkout",
    posRxNoPatientWarning: "Penjualan resep memerlukan pasien terdaftar — walk-in tidak diizinkan",
    posCreatePrescriptionButton: "Baru",
    posCreatePrescriptionTitle: "Resep Baru",
    posCreatePrescriptionRequiresPatient: "Pilih pasien terlebih dahulu untuk membuat resep",
    posCreatePrescriptionSuccess: "Resep berhasil dibuat dan ditautkan",
    posCreatePrescriptionSave: "Buat & Tautkan",
    posSaleTypeLabel: "Jenis Penjualan",
    posCreditRequiresPatient: "Pasien terdaftar diperlukan untuk penjualan kredit",
    posDescriptionLabel: "Deskripsi",
    posDescriptionPlaceholder: "Masukkan catatan untuk penjualan ini (opsional)",
    posSubtotal: "Subtotal",
    posTaxNote: "PPN akan dihitung saat checkout",
    posCheckout: "Checkout",
    posProcessing: "Memproses...",
    posStockInsufficient: "Stok Tidak Cukup",
    posStockAvailable: "tersedia",
    posStockExceededItems: "Stok tidak cukup untuk:",
    posSaleSuccessTitle: "Pembayaran Berhasil",
    posNewSale: "Transaksi Baru",
    posPayLabel: "Bayar",
    posSelectPaymentMethod: "Pilih metode pembayaran.",
    posMethodSectionLabel: "Metode",
    posPaymentMethodCard: "Kartu",
    posPaymentMethodCardDesc: "Debit / Kredit / QRIS",
    posPaymentMethodCash: "Tunai",
    posPaymentMethodCashDesc: "Laci kasir terbuka",
    posPaymentMethodCredit: "Kredit",
    posPaymentMethodCreditDesc: "Pasien bayar nanti",
    posDownPaymentLabel: "Uang muka",
    posRemainingLabel: "Sisa tagihan",
    posSummaryLabel: "Ringkasan",
    posPaymentCancel: "Batal",
    posAcceptCash: "Terima tunai",
    posAcceptCard: "Terima kartu",
    posAcceptCredit: "Catat sebagai kredit",
    posReceiptSubtitle: "Struk siap dicetak atau dibuat fakturnya.",
    posReceiptLabel: "Struk",
    posReceiptDateLabel: "Tanggal",
    posReceiptCashierLabel: "Kasir",
    posDiscountLabel: "Diskon",
    posViaLabel: "via",
    posChangeLabel: "kembalian",
    posPrintReceipt: "Cetak struk",
    posPrintInvoice: "Faktur",
    saleDocPayment: "Bayar",
    saleDocThankYouVisit: "Terima kasih atas kunjungan Anda",
    saleDocInvoiceTitle: "Faktur",
    saleDocBilledTo: "Ditagihkan kepada",
    saleDocPaymentMethod: "Metode Pembayaran",
    saleDocItemDescription: "Deskripsi",
    saleDocItemQty: "Qty",
    saleDocItemPrice: "Harga",
    saleDocItemAmount: "Jumlah",
    saleDocThankYouTrust: "Terima kasih atas kepercayaan Anda kepada",
    saleDocQuestions: "Pertanyaan?",

    navStockReturns: "Retur Stok",
    srSubtitle: "Catat dan kelola pengembalian stok obat ke distributor",
    srAdd: "Tambah",
    srEdit: "Edit",
    srDetails: "Detail",
    srDelete: "Hapus",
    srCancel: "Batalkan",
    srReject: "Tolak",
    srComplete: "Selesaikan",
    srDetailsTitle: "Detail Retur",
    srSave: "Simpan",
    srSaving: "Menyimpan...",
    srDeleting: "Menghapus...",
    srCancelling: "Membatalkan...",
    srRejecting: "Menolak...",
    srCompleting: "Memproses...",
    srStatusInProgress: "Sedang Diproses",
    srStatusCompleted: "Selesai",
    srStatusCancelled: "Dibatalkan",
    srStatusRejected: "Ditolak",
    srReturnNumber: "No. Retur",
    srStatus: "Status",
    srReturnedAt: "Tanggal Retur",
    srDistributor: "Distributor",
    srSelectDistributor: "Pilih distributor",
    srDistributorRequired: "Distributor wajib dipilih",
    srSignedBy: "Ditandatangani Oleh",
    srSelectSignedBy: "Pilih penandatangan (opsional)",
    srReason: "Alasan",
    srReasonPlaceholder: "Alasan retur (mis. rusak, kadaluarsa)...",
    srDescription: "Keterangan",
    srDescriptionPlaceholder: "Catatan opsional tentang retur ini...",
    srCancellationReason: "Alasan Pembatalan",
    srCancellationReasonPlaceholder: "Alasan pembatalan...",
    srCancellationReasonRequired: "Alasan pembatalan wajib diisi",
    srRejectionReason: "Alasan Penolakan",
    srRejectionReasonPlaceholder: "Alasan penolakan...",
    srRejectionReasonRequired: "Alasan penolakan wajib diisi",
    srItemsSection: "Item",
    srItemBatch: "Batch Stok",
    srItemSelectBatch: "Pilih batch stok",
    srItemQuantity: "Jml (pcs)",
    srItemReason: "Alasan",
    srItemReasonPlaceholder: "Alasan retur (opsional)...",
    srItemAdd: "Tambah Item",
    srItemBatchRequired: "Batch stok wajib dipilih",
    srItemQuantityRequired: "Jumlah harus bilangan bulat positif",
    srItemsRequired: "Minimal satu item diperlukan",
    srItemCount: "item",
    srSingular: "item",
    srPlural: "item",
    srSearchPlaceholder: "Cari retur...",
    srNoResults: "Retur tidak ditemukan",
    srEmptyTitle: "Belum ada retur stok",
    srEmptyDesc: "Buat catatan retur untuk mengembalikan stok ke distributor",
    srFilterStatus: "Status",
    srFilterDistributor: "Distributor",
    srDeleteConfirmTitle: "Hapus Retur Stok",
    srDeleteConfirmDesc: "Draf retur stok akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.",
    srCancelConfirmTitle: "Batalkan Retur Stok",
    srCancelConfirmDesc: "Retur stok ini akan dibatalkan. Berikan alasan pembatalan.",
    srRejectConfirmTitle: "Tolak Retur Stok",
    srRejectConfirmDesc: "Retur ini ditolak oleh distributor. Berikan alasan penolakan.",
    srCompleteConfirmTitle: "Selesaikan Retur",
    srCompleteConfirmDesc: "Jumlah stok yang tercantum akan dikurangi. Tindakan ini hanya dapat dibalik dengan menolak retur.",
    srCompleteNoSignerWarning: "Belum ada penandatangan. Pertimbangkan menambahkan penandatangan sebelum menyelesaikan.",
    srCreateSuccess: "Retur stok berhasil dibuat",
    srUpdateSuccess: "Retur stok berhasil diperbarui",
    srDeleteSuccess: "Retur stok berhasil dihapus",
    srCancelSuccess: "Retur stok berhasil dibatalkan",
    srRejectSuccess: "Retur stok berhasil ditolak",
    srCompleteSuccess: "Retur stok berhasil diselesaikan",
    srBatchLabel: "Batch",
    srExpiryLabel: "Exp",
    srInvoiceLabel: "Faktur",
    srInvoice: "Faktur",
    srSearchInvoice: "Ketik nomor faktur...",
    srSelectInvoice: "Pilih faktur",
    srInvoiceRequired: "Faktur wajib dipilih",
    srInvoiceItems: "Item dari Faktur",
    srReturnQty: "Qty Retur",
    srItemNoStock: "Batch tidak ditemukan di stok",
    srItemOutOfStock: "Stok tidak tersedia",
    srItemAvailable: "Tersedia",
    srNoInvoiceSelected: "Cari dan pilih faktur untuk melihat item-nya",
    srItemsCheckedRequired: "Pilih minimal satu item untuk diretur",
    srReturnQtyBox: "Qty Retur (box)",
    srPricePerBox: "Harga/Box",
    srDiscountLabel: "Diskon",
    srEstimatedReturn: "Est. Retur",
    srTotalEstimated: "Total Estimasi Retur",
    srTotalAmount: "Nilai Total Retur",
    sdMedicine: "Obat",
    sdSelectMedicine: "Pilih obat...",
    sdMedicineRequired: "Obat wajib dipilih",
    sdBarcodeOrBatch: "Barcode / ID Batch",
    sdBarcodePlaceholder: "Masukkan barcode atau nomor batch...",
    sdBarcodeNotFound: "Batch tidak ditemukan untuk barcode ini",

    // Stock Movements page
    navStockMovements: "Pergerakan Stok",
    smSubtitle: "Lihat dan lacak semua pergerakan dan transaksi stok",
    smType: "Tipe",
    smReason: "Alasan",
    smMedicine: "Obat",
    smBatch: "Batch",
    smQuantity: "Kuantitas",
    smQuantityBefore: "Sebelum",
    smQuantityAfter: "Sesudah",
    smReference: "Referensi",
    smCreatedBy: "Dibuat Oleh",
    smDate: "Tanggal",
    smTypeIn: "Stok Masuk",
    smTypeOut: "Stok Keluar",
    smReasonPurchase: "Pembelian",
    smReasonSale: "Penjualan",
    smReasonReturn: "Retur",
    smReasonAdjustment: "Penyesuaian",
    smReasonDisposal: "Disposal",
    smReasonDamaged: "Rusak",
    smReasonTransfer: "Transfer",
    smReasonDonation: "Donasi",
    smDetails: "Details",
    smDetailsTitle: "Detail Pergerakan",
    smSearchPlaceholder: "Cari nama obat...",
    smNoResults: "Tidak ada pergerakan yang cocok dengan filter",
    smEmptyTitle: "Belum ada pergerakan stok",
    smEmptyDesc: "Pergerakan stok dicatat secara otomatis dengan setiap transaksi",
    smFilterType: "Tipe",
    smFilterReason: "Alasan",
    smDescription: "Deskripsi",

    // Reports page
    reportsSubtitle: "Lihat dan analisis performa apotek di semua area",
    reportsSalesTab: "Penjualan",
    reportsPurchaseTab: "Pembelian",
    reportsInventoryTab: "Inventori",
    reportsStockMovementTab: "Pergerakan Stok",
    reportsDisposalTab: "Disposal",
    reportsReturnsTab: "Retur",
    reportSummaryTitle: "Ringkasan",
    reportNoData: "Tidak ada data tersedia",
    reportDays: "hari",
    reportPeriodMonthly: "Bulan Ini",
    reportPeriodCustom: "Kustom",
    reportDateFrom: "Dari tanggal",
    reportDateTo: "Sampai tanggal",
    reportSalesTotalRevenue: "Total Pendapatan",
    reportSalesTotalSales: "Total Penjualan",
    reportSalesAvgOrder: "Rata-rata Nilai Pesanan",
    reportSalesPaymentBreakdown: "Rincian Pembayaran",
    reportSalesTopMedicines: "Obat Terlaris",
    reportSalesDailyRevenue: "Pendapatan Harian",
    reportSalesMedicine: "Obat",
    reportSalesQtyPieces: "Qty (pcs)",
    reportSalesRevenue: "Pendapatan",
    reportSalesDate: "Tanggal",
    reportSalesTransactions: "Transaksi",
    reportSalesMethod: "Metode Pembayaran",
    reportSalesSaleNumber: "No. Penjualan",
    reportSalesPatient: "Pasien",
    reportSalesSaleType: "Jenis Penjualan",
    reportSalesStatus: "Status",
    reportSalesTotalAmount: "Total Harga",
    reportSalesDiscountPct: "Diskon %",
    reportSalesDiscountAmt: "Jumlah Diskon",
    reportSalesPPN: "PPN",
    reportSalesGrandTotal: "Total Akhir",
    reportSalesPaidAmount: "Jumlah Bayar",
    reportSalesPaymentStatus: "Status Pembayaran",
    reportPurchaseTotalInvoices: "Total Faktur",
    reportPurchaseTotalAmount: "Total Jumlah",
    reportPurchasePaidAmount: "Dibayar",
    reportPurchaseUnpaidAmount: "Belum Dibayar",
    reportPurchaseByDistributor: "Per Distributor",
    reportPurchaseInvoiceList: "Daftar Faktur",
    reportPurchaseDistributor: "Distributor",
    reportPurchaseInvoiceCount: "Faktur",
    reportPurchaseInvoiceNumber: "No. Faktur",
    reportPurchaseDate: "Tanggal",
    reportPurchasePONumber: "No. PO",
    reportPurchaseStatus: "Status",
    reportPurchaseFilterDistributor: "Distributor",
    reportInventoryTotalMedicines: "Total Obat",
    reportInventoryStockValue: "Nilai Total Stok",
    reportInventoryLowStockCount: "Stok Rendah",
    reportInventoryExpiredCount: "Kedaluwarsa",
    reportInventoryExpiringSoonCount: "Segera Kedaluwarsa",
    reportInventoryExpiryDays: "Tampilkan item yang kedaluwarsa dalam",
    reportInventoryStockLevels: "Semua Level Stok",
    reportInventoryLowStockSection: "Item Stok Rendah",
    reportInventoryExpiringSoonSection: "Segera Kedaluwarsa",
    reportInventoryExpiredSection: "Item Kedaluwarsa",
    reportInventoryMedicine: "Obat",
    reportInventoryUnit: "Satuan",
    reportInventoryPieces: "Stok (pcs)",
    reportInventoryReorderLevel: "Level Pesan Ulang",
    reportInventoryBasePrice: "Harga Beli",
    reportInventorySellingPrice: "Harga Jual",
    reportInventoryStatus: "Status",
    reportInventoryBatch: "Batch",
    reportInventoryExpiryDate: "Tgl Kedaluwarsa",
    reportInventoryDaysLeft: "Sisa Hari",
    reportInventoryDistributor: "Distributor",
    reportInventoryStatusLow: "Stok Rendah",
    reportInventoryStatusNormal: "Normal",
    reportSMTotalMovements: "Total Pergerakan",
    reportSMTotalIn: "Total Stok Masuk",
    reportSMTotalOut: "Total Stok Keluar",
    reportSMMovementList: "Daftar Pergerakan",
    reportSMMedicine: "Obat",
    reportSMBatch: "Batch",
    reportSMType: "Tipe",
    reportSMReason: "Alasan",
    reportSMQty: "Qty",
    reportSMBefore: "Sebelum",
    reportSMAfter: "Sesudah",
    reportSMDate: "Tanggal",
    reportSMReference: "Referensi",
    reportSMFilterType: "Tipe",
    reportSMFilterReason: "Alasan",
    reportDisposalTotalDisposals: "Total Disposal",
    reportDisposalTotalItems: "Total Item",
    reportDisposalTotalQty: "Total Qty (pcs)",
    reportDisposalByReason: "Per Alasan",
    reportDisposalList: "Daftar Disposal",
    reportDisposalNumber: "No. Disposal",
    reportDisposalDate: "Tanggal",
    reportDisposalMedicine: "Obat",
    reportDisposalBatch: "Batch",
    reportDisposalQty: "Qty (pcs)",
    reportDisposalReason: "Alasan",
    reportDisposalStatus: "Status",
    reportDisposalCount: "Jumlah",
    reportReturnTotalReturns: "Total Retur",
    reportReturnTotalItems: "Total Item",
    reportReturnTotalQty: "Total Qty (pcs)",
    reportReturnByDistributor: "Per Distributor",
    reportReturnList: "Daftar Retur",
    reportReturnNumber: "No. Retur",
    reportReturnDate: "Tanggal",
    reportReturnDistributor: "Distributor",
    reportReturnMedicine: "Obat",
    reportReturnBatch: "Batch",
    reportReturnQty: "Qty (pcs)",
    reportReturnReason: "Alasan",
    reportReturnStatus: "Status",
    reportReturnCount: "Retur",
    reportReturnFilterDistributor: "Distributor",
    reportExport: "Ekspor",
    reportExportCsv: "Ekspor CSV",
    reportExportExcel: "Ekspor Excel",

    // Storage page
    navStorage: "Penyimpanan",
    storageSubtitle: "Kelola lemari, rak, dan tempat penyimpanan stok fisik",
    storageFilterStatus: "Status",
    storageStatusActive: "Aktif",
    storageStatusInactive: "Tidak Aktif",

    // Storage — Cabinet
    cabinetAdd: "Tambah",
    cabinetEdit: "Edit",
    cabinetDelete: "Hapus",
    cabinetDetails: "Detail",
    cabinetName: "Nama Lemari",
    cabinetNamePlaceholder: "mis. Lemari A",
    cabinetNameRequired: "Nama lemari wajib diisi",
    cabinetCode: "Kode",
    cabinetCodePlaceholder: "mis. LMR-A",
    cabinetCodeRequired: "Kode lemari wajib diisi",
    cabinetDescription: "Deskripsi",
    cabinetDescriptionPlaceholder: "Catatan opsional tentang lemari ini",
    cabinetStatus: "Status",
    cabinetSearchPlaceholder: "Cari berdasarkan nama atau kode...",
    cabinetNoResults: "Tidak ada lemari yang sesuai pencarian",
    cabinetEmptyTitle: "Belum ada lemari",
    cabinetEmptyDesc: "Tambahkan lemari penyimpanan pertama untuk mulai mengatur lokasi stok",
    cabinetDeleteConfirmTitle: "Hapus Lemari",
    cabinetDeleteConfirmDesc: "Lemari ini akan dihapus secara permanen. Semua rak harus dihapus terlebih dahulu.",
    cabinetSave: "Simpan Lemari",
    cabinetSaving: "Menyimpan...",
    cabinetDeleting: "Menghapus...",
    cabinetCreateSuccess: "Lemari berhasil ditambahkan",
    cabinetUpdateSuccess: "Lemari berhasil diperbarui",
    cabinetDeleteSuccess: "Lemari berhasil dihapus",
    cabinetViewShelves: "Lihat Rak",

    // Storage — Shelf
    shelfAdd: "Tambah",
    shelfEdit: "Edit",
    shelfDelete: "Hapus",
    shelfDetails: "Detail",
    shelfName: "Nama Rak",
    shelfNamePlaceholder: "mis. Rak 1",
    shelfNameRequired: "Nama rak wajib diisi",
    shelfCode: "Kode",
    shelfCodePlaceholder: "mis. R1",
    shelfCodeRequired: "Kode rak wajib diisi",
    shelfLevel: "Level",
    shelfLevelPlaceholder: "mis. 1",
    shelfDescription: "Deskripsi",
    shelfDescriptionPlaceholder: "Catatan opsional tentang rak ini",
    shelfStatus: "Status",
    shelfSearchPlaceholder: "Cari berdasarkan nama atau kode...",
    shelfNoResults: "Tidak ada rak yang sesuai pencarian",
    shelfEmptyTitle: "Belum ada rak",
    shelfEmptyDesc: "Tambahkan rak ke lemari ini untuk mengatur tempat penyimpanan",
    shelfDeleteConfirmTitle: "Hapus Rak",
    shelfDeleteConfirmDesc: "Rak ini akan dihapus secara permanen. Semua tempat penyimpanan harus dihapus terlebih dahulu.",
    shelfSave: "Simpan Rak",
    shelfSaving: "Menyimpan...",
    shelfDeleting: "Menghapus...",
    shelfCreateSuccess: "Rak berhasil ditambahkan",
    shelfUpdateSuccess: "Rak berhasil diperbarui",
    shelfDeleteSuccess: "Rak berhasil dihapus",
    shelfViewBins: "Lihat Tempat",

    // Storage — Bin
    binAdd: "Tambah",
    binEdit: "Edit",
    binDelete: "Hapus",
    binDetails: "Detail",
    binName: "Nama Tempat",
    binNamePlaceholder: "mis. Tempat 01",
    binNameRequired: "Nama tempat penyimpanan wajib diisi",
    binCode: "Kode",
    binCodePlaceholder: "mis. T01",
    binCodeRequired: "Kode tempat penyimpanan wajib diisi",
    binDescription: "Deskripsi",
    binDescriptionPlaceholder: "Catatan opsional tentang tempat penyimpanan ini",
    binStatus: "Status",
    binSearchPlaceholder: "Cari berdasarkan nama atau kode...",
    binNoResults: "Tidak ada tempat penyimpanan yang sesuai pencarian",
    binEmptyTitle: "Belum ada tempat penyimpanan",
    binEmptyDesc: "Tambahkan tempat penyimpanan ke rak ini untuk menetapkan lokasi stok",
    binDeleteConfirmTitle: "Hapus Tempat Penyimpanan",
    binDeleteConfirmDesc: "Tempat penyimpanan ini akan dihapus secara permanen. Pastikan tidak ada obat atau batch stok yang terhubung.",
    binSave: "Simpan Tempat",
    binSaving: "Menyimpan...",
    binDeleting: "Menghapus...",
    binCreateSuccess: "Tempat penyimpanan berhasil ditambahkan",
    binUpdateSuccess: "Tempat penyimpanan berhasil diperbarui",
    binDeleteSuccess: "Tempat penyimpanan berhasil dihapus",

    // Inventory page
    navInventory: "Inventori",
    inventorySubtitle: "Visualisasikan dan telusuri tata letak penyimpanan fisik apotek Anda",
    inventoryCanvasTitle: "Denah Gudang",
    inventorySelectBinPrompt: "Pilih tempat penyimpanan dari panel kiri untuk melihat isinya",
    inventoryNoCabinets: "Tidak ada lemari ditemukan. Tambahkan lemari di modul Penyimpanan terlebih dahulu.",
    inventoryBinEmpty: "Tempat penyimpanan ini tidak memiliki item",
    inventoryBinItemsTitle: "Isi Tempat Penyimpanan",
    inventoryExpiryOk: "Baik",
    inventoryExpirySoon: "Segera Kadaluarsa",
    inventoryExpired: "Kadaluarsa",
    inventoryBatchLabel: "Batch",
    inventoryBarcodeLabel: "Barcode",
    inventoryExpiryLabel: "Kadaluarsa",
    inventoryRemainingLabel: "Tersisa",
    inventoryDistributorLabel: "Distributor",
    inventoryItemCount: "item",
    inventoryWarehouseLabel: "Gudang",
    inventoryCanvasSaveSuccess: "Posisi lemari berhasil disimpan",
    inventoryRotate: "Putar",
    inventoryShelvesLabel: "rak",
    inventoryBinsLabel: "tempat",
    inventoryNoShelves: "Tidak ada rak di lemari ini",
    inventoryNoBins: "Tidak ada tempat penyimpanan di rak ini",
    userTempPasswordTitle: "Kata sandi sementara",
    userTempPasswordDesc: "Berikan kata sandi ini ke pengguna. Hanya ditampilkan sekali — pengguna wajib menggantinya saat login berikutnya.",
    copy: "Salin",
    copied: "Tersalin",
    done: "Selesai",
    errNetwork: "Tidak dapat terhubung ke server. Periksa koneksi internet, atau pastikan server sedang berjalan.",
    errTimeout: "Server terlalu lama merespons. Periksa dulu apakah proses sudah tersimpan sebelum mencoba lagi.",
    errBadResponse: "Server mengembalikan respons yang tidak dikenal (HTTP {status}). Kemungkinan alamat server salah.",
    errServer: "Terjadi kesalahan pada server (HTTP {status}). Silakan coba lagi; hubungi admin jika terus terjadi.",
    errForbidden: "Anda tidak memiliki izin untuk tindakan ini.",
    errOffline: "Anda sedang offline. Sambungkan kembali internet lalu coba lagi.",
    forbiddenTitle: "Anda tidak memiliki akses ke halaman ini",
    forbiddenDesc: "Minta pemilik apotek untuk memberi akses pada peran Anda jika diperlukan.",
    notFoundTitle: "Halaman tidak ditemukan",
    notFoundDesc: "Halaman yang Anda buka tidak ada atau sudah dipindahkan.",
    backToHome: "Kembali ke beranda",
    backToList: "Kembali",
    posQtyLabel: "Jml",
    posAddBox: "+1 box",
    posBoxUnit: "box",
    posPcsUnit: "pcs",
    posAvailableShort: "tersedia {n}",
    posPriceLockedHint: "Ubah harga memerlukan izin 'ubah harga'",
    posEditPriceHint: "Klik untuk mengubah harga",
    posRxRequiredBadge: "Wajib resep",
    posTabProducts: "Produk",
    posTabCart: "Keranjang",
    posShortcutSearch: "Cari",
    posShortcutHold: "Tahan",
    posShortcutPay: "Bayar",
    posShortcutsTitle: "Pintasan",
    posScannerReady: "Scanner barcode siap — scan kapan saja",
    posScanAdded: "Ditambahkan: {name}",
    posDraftRestored: "Keranjang yang belum selesai dipulihkan",
    posAmountReceived: "Uang diterima",
    posExactAmount: "Uang pas",
    posChangeDue: "Kembalian",
    posAmountShort: "Uang yang diterima kurang dari total",
    posDiscountMaxHint: "Maks {n}% untuk peran Anda",
    posDiscountLimited: "Diskon dibatasi {n}%",
    posTotalsByServer: "Total diverifikasi server saat pembayaran",
    posRemoveItem: "Hapus",
    datePickPlaceholder: "Pilih tanggal",
    dateToday: "Hari ini",
    dateClear: "Hapus",
    medicalRecordVisitTimelineEmpty: "Belum ada kunjungan tercatat",
    medicalRecordVisitLatest: "Terbaru",
    medicalRecordVisitDaysAgo: "{n} hari lalu",
    medicalRecordVisitToday: "Hari ini",
    medicalRecordVisitYesterday: "Kemarin",
    medicalRecordVisitBy: "oleh",
    medicalRecordVisitFutureDate: "Tanggal kunjungan tidak boleh di masa depan",
    placementHeadPharmacist: "Head Pharmacist",
    placementHeadPharmacistDesc: "Apoteker yang bertanggung jawab atas apotek ini (satu per apotek, wajib izin praktik aktif). Owner juga boleh menjadi Head Pharmacist.",
    placementHeadPharmacistForced: "Selalu aktif untuk peran Head Pharmacist",
    medicalRecordAllergyEdit: "Ubah alergi",
    medicalRecordAllergyUpdateSuccess: "Data alergi berhasil diperbarui",
    medicalRecordLastVisit: "Kunjungan terakhir",
    medicalRecordNoKnownAllergies: "Tidak ada alergi tercatat",
    medicalRecordNotSet: "Belum diisi",
    medicalRecordManage: "Kelola",
    medicalRecordVisitSectionExam: "Pemeriksaan",
    medicalRecordVisitSectionAssessment: "Diagnosis & tindakan",
    medicalRecordVisitNotesLabel: "Catatan / tindakan",
    medicalRecordVisitCreatePrescription: "Buat resep",
    medicalRecordVisitNoPrescription: "Tanpa resep",
    medicalRecordVisitOpenPrescription: "Lihat resep",
    medicalRecordVisitPrescriptionNoNumber: "Resep",
    prescriptionFromVisit: "Dari kunjungan",
    medicalRecordPatientInfo: "Data pasien",
    navExaminations: "Pemeriksaan",
    examSubtitle: "Antrean pasien hari ini dan ruang periksa dokter",
    examCheckIn: "Daftarkan pasien",
    examCheckInTitle: "Daftarkan pasien ke antrean",
    examCheckInDesc: "Pilih pasien yang datang. Pasien baru bisa langsung didaftarkan di sini.",
    examPatient: "Pasien",
    examPatientPlaceholder: "Cari nama pasien",
    examPatientRequired: "Pilih pasien",
    examDoctorOptional: "Dokter (opsional)",
    examDoctorPlaceholder: "Dokter mana saja",
    examComplaintPlaceholder: "mis. demam sejak 2 hari",
    examCheckInSuccess: "Pasien masuk antrean",
    examStatusWaiting: "Menunggu",
    examStatusInProgress: "Diperiksa",
    examStatusCompleted: "Selesai",
    examStatusCancelled: "Batal",
    examQueueEmpty: "Belum ada pasien",
    examWaitingFor: "menunggu {n} mnt",
    examSelectTitle: "Pilih pasien dari antrean",
    examSelectDesc: "Ruang periksa akan tampil di sini",
    examCallIn: "Panggil & periksa",
    examCancel: "Batalkan kunjungan",
    examCancelTitle: "Batalkan kunjungan ini?",
    examCancelDesc: "Pasien keluar dari antrean. Tidak ada yang dicatat ke rekam medis.",
    examCancelReasonPlaceholder: "Alasan (opsional), mis. pulang sebelum dipanggil",
    examCancelConfirm: "Batalkan",
    examKeep: "Kembali",
    examSaveDraft: "Simpan draf",
    examSavedDraft: "Draf tersimpan",
    examComplete: "Selesai periksa",
    examCompleteSuccess: "Pemeriksaan selesai",
    examCompleteWithRx: "Pemeriksaan selesai, resep diteruskan ke apotek",
    examAllergies: "Alergi",
    examNoAllergies: "Tidak ada alergi tercatat",
    examPrescription: "Resep",
    examPrescriptionHint: "Opsional. Kosongkan bila tidak perlu obat.",
    examAddMedicine: "Tambah obat",
    examMedicine: "Obat",
    examMedicinePlaceholder: "Pilih atau ketik",
    examUseTyped: "Pakai \"{v}\"",
    examQty: "Jml",
    examFrequency: "Aturan pakai",
    examFrequencyPlaceholder: "3x1",
    examDuration: "Lama",
    examDurationPlaceholder: "5 hari",
    examRemoveLine: "Hapus",
    examRxNotes: "Catatan untuk apoteker",
    examAllergyWarningTitle: "Kemungkinan alergi",
    examAllergyWarningLine: "{medicine} — pasien alergi {allergen}",
    examAllergyConfirmTitle: "Tetap resepkan meski ada peringatan alergi?",
    examAllergyConfirmDesc: "Pengecekan hanya mencocokkan nama. Pastikan Anda sudah meninjaunya.",
    examAllergyConfirm: "Ya, sudah saya tinjau",
    examRecentVisits: "Kunjungan sebelumnya",
    examNoRecentVisits: "Kunjungan pertama",
    examOpenRecord: "Buka rekam medis",
    examOpenPrescription: "Lihat resep",
    examNoPrescription: "Tanpa resep",
    examChooseDoctor: "Dokter pemeriksa",
    examYears: "{n} th",
    importDistributorsTitle: "Impor distributor",
    importDistributorsExportHint: "Unduh semua distributor (Excel)",
    importPatientsExportHint: "Unduh semua pasien (Excel)",
    importSkipExistingDesc: "Hanya yang baru ditambahkan (dicocokkan per nama); data yang sudah ada tidak diubah.",
    importPatientsTitle: "Impor pasien",
    importPatientsDesc: "Dicocokkan per nomor telepon, atau per nama jika tanpa telepon. Pasien baru otomatis mendapat nomor rekam medis.",
    importOpeningStockTitle: "Impor saldo stok awal",
    importOpeningStockBtn: "Saldo awal",
    importOpeningStockDesc: "Stok yang ada saat mulai memakai sistem, per batch.",
    importOpeningStockNote: "Obat dan distributor harus sudah terdaftar (impor daftar obat dari cabang lain bila perlu). Per distributor dibuat satu faktur penerimaan \"saldo awal\" berstatus lunas, jadi tidak menjadi utang.",
    importStockSigner: "Dihitung & ditandatangani",
    importStockDefaultDistributor: "Distributor untuk baris yang kosong",
    importWillAddDistributors: "{n} distributor akan ditambahkan",
    importAddedDistributors: "{n} distributor ditambahkan",
    importWillAddPatients: "{n} pasien akan ditambahkan",
    importAddedPatients: "{n} pasien ditambahkan",
    importWillAddBatches: "{n} batch akan masuk stok",
    importAddedBatches: "{n} batch masuk stok",
    importStockValue: "nilai {amount}",
    importStockInvoices: "{n} faktur penerimaan",
    importDownloadTemplate: "Unduh template",
    importCompleteFields: "Lengkapi isian di atas untuk memeriksa file.",
    importCheck: "Periksa file",
    importFileEmpty: "Tidak ada data di file ini",
    importDone: "Impor selesai",
    importReasonName: "nama kosong",
    importReasonPhone: "telepon kosong",
    importReasonDate: "tanggal tidak valid",
    importReasonMedicine: "obat belum terdaftar",
    importReasonDistributor: "distributor belum terdaftar",
    importReasonBatch: "no. batch kosong",
    importReasonExpired: "sudah kedaluwarsa",
    importReasonQuantity: "jumlah tidak valid",
    importReasonPrice: "harga tidak valid",
    importReasonBatchExists: "batch sudah ada di stok",
    allergyWarningTitle: "Peringatan alergi",
    allergyWarningLine: "alergi {allergen} ({severity})",
    medicineTypeControlled: "Obat terkendali",
    medicineTypeControlledHint: "Narkotika, psikotropika, prekursor. Surat pesanan, penerimaan, retur, dan pemusnahan wajib ditandatangani Head Pharmacist; selalu wajib resep.",
    medicineTypeControlledBadge: "Terkendali",
    nameCaseUpper: "KAPITAL SEMUA",
    nameCaseTitle: "Huruf Awal Kapital",
    nameCaseLower: "huruf kecil semua",
    nameCaseAsTyped: "Sesuai ketikan",
    nameCaseSample: "paracetamol 500mg Tablet",
    nameCaseAsTypedNote: "Nama yang disimpan sebelum ada pengaturan ini tersimpan huruf kecil dan akan tampil begitu.",
    poSignerHint: "Apoteker dengan SIPA aktif. Pesanan narkotika, psikotropika, atau prekursor wajib ditandatangani Head Pharmacist.",
    sdSignerHint: "Berita acara pemusnahan ditandatangani Head Pharmacist (SIPA aktif).",
    pharmaNoOwner: "Belum ada pemilik",
    navPharmacyProfile: "Profil apotek",
    pharmacyProfileSubtitle: "Data dan izin usaha apotek yang sedang Anda buka",
    pharmaInfoTitle: "Informasi apotek",
    setupTitle: "Lengkapi pengaturan apotek",
    setupProgress: "{done} dari {total} selesai",
    setupHide: "Sembunyikan",
    setupLicense: "Tambahkan izin usaha (SIA)",
    setupHeadPharmacist: "Tunjuk Head Pharmacist",
    setupStaff: "Tambahkan akun staf",
    setupMedicines: "Tambahkan obat (atau impor dari cabang)",
    setupDistributors: "Tambahkan distributor",
    setupStorage: "Atur lemari penyimpanan",
    setupStock: "Masukkan stok pertama (faktur atau impor saldo awal)",
    catalogExport: "Ekspor",
    catalogExportHint: "Unduh daftar obat & klasifikasi (Excel) — bisa diimpor di cabang lain",
    catalogImport: "Impor",
    catalogImportTitle: "Impor daftar obat",
    catalogImportDesc: "Dari file Excel hasil ekspor cabang lain. Hanya obat & klasifikasi yang belum ada yang ditambahkan.",
    catalogPickFile: "Pilih file Excel",
    catalogPickFileHint: "Sheet \"Obat\": Nama, Satuan, Bentuk, Golongan, Kelas, Komposisi",
    catalogFileEmpty: "Tidak ada data obat di file ini",
    catalogFileUnreadable: "File tidak bisa dibaca. Gunakan file .xlsx hasil Ekspor.",
    catalogWillAddMedicines: "{n} obat akan ditambahkan",
    catalogWillAddClassifications: "{n} klasifikasi baru",
    catalogDoneMedicines: "{n} obat ditambahkan",
    catalogDoneClassifications: "{n} klasifikasi ditambahkan",
    catalogSkippedExisting: "{n} sudah ada (dilewati)",
    catalogInvalidRows: "{n} baris dilewati",
    catalogRow: "Baris {n}",
    catalogReasonName: "nama kosong",
    catalogReasonUnit: "satuan kosong",
    catalogReasonShape: "bentuk kosong",
    catalogReasonType: "golongan kosong",
    catalogReasonClass: "kelas kosong",
    catalogReasonDuplicate: "dobel di file",
    catalogNoStockNote: "Stok, harga, dan batch tidak ikut diimpor.",
    catalogImportBtn: "Impor sekarang",
    catalogImported: "Daftar obat berhasil diimpor",
    userPickPharmacyFirst: "Pilih apotek dulu",
    forcePwTitle: "Buat kata sandi Anda sendiri",
    forcePwDesc: "{email} masih memakai kata sandi sementara. Ganti dulu untuk melanjutkan.",
    forcePwSubmit: "Simpan & masuk",
    forcePwBack: "Kembali ke halaman masuk",
    pharmaCodeRequired: "Kode wajib diisi",
    pharmaEmailInvalid: "Alamat email tidak valid",
    onbCodeHint: "Maks. 5 huruf/angka. Dipakai di setiap nomor dokumen (mis. INV-APK1-…) dan tidak bisa dipakai ulang.",
    onbLicenseHint: "Izin operasional apotek (SIA). Bisa juga ditambahkan nanti dari detail apotek.",
    onbLicenseLater: "Isi nanti",
    onbStepOwner: "Pemilik & data",
    onbOwnerTitle: "Pemilik",
    onbOwnerDesc: "Pemilik yang akan masuk, menunjuk Head Pharmacist, dan menambahkan staf.",
    onbOwnerNew: "Akun baru",
    onbOwnerNewDesc: "Buat akun login pemilik",
    onbOwnerExisting: "Pengguna terdaftar",
    onbOwnerExistingDesc: "mis. pemilik yang membuka cabang baru",
    onbOwnerLater: "Nanti",
    onbOwnerLaterDesc: "Atur dari menu Pengguna",
    onbOwnerLaterWarn: "Belum ada yang bisa masuk ke apotek ini sampai pemiliknya ditambahkan. Tambahkan dari Pengguna → Penempatan.",
    onbOwnerName: "Nama pemilik",
    onbOwnerNameRequired: "Nama pemilik wajib diisi",
    onbOwnerEmail: "Email login",
    onbOwnerPhone: "No. telepon",
    onbSearchUser: "Cari nama atau email…",
    onbNoUserFound: "Pengguna tidak ditemukan. Pilih \"Akun baru\" saja.",
    onbPickUser: "Pilih pengguna",
    onbChange: "Ganti",
    onbPharmacyCount: "{n} apotek",
    onbStartTitle: "Data awal",
    onbStartDesc: "Bentuk, golongan, dan kelas obat, serta parameter bisnis. Setiap apotek punya salinannya sendiri.",
    onbStartTemplate: "Template standar",
    onbStartTemplateDesc: "Klasifikasi umum, belum ada daftar obat",
    onbStartCopy: "Salin dari cabang",
    onbStartCopyDesc: "Daftar obat, klasifikasi, dan parameter. Stok & harga tidak ikut.",
    onbPickPharmacy: "Pilih apotek sumber",
    onbCreate: "Buat apotek",
    onbDoneTitle: "{name} ({code}) sudah dibuat.",
    onbTempPasswordDesc: "Kata sandi sementara — hanya ditampilkan sekali. Kirimkan ke pemilik; wajib diganti saat pertama masuk.",
    onbExistingOwnerDesc: "Pemilik masuk dengan kata sandinya sekarang dan apotek ini langsung muncul di daftarnya.",
    onbCopiedSummary: "Tersalin {medicines} obat dan {classes} klasifikasi.",
    onbNextTitle: "Langkah berikutnya untuk pemilik:",
    onbNext1: "Masuk dan mengganti kata sandi sementara",
    onbNext2: "Menambahkan izin usaha (SIA)",
    onbNext3: "Menunjuk Head Pharmacist dan menambah staf — staf lain belum bisa masuk sebelum ada",
    onbNext4: "Mengecek parameter bisnis, lalu menambah obat (atau impor) dan distributor",
    purchaseHistoryTitle: "Riwayat pembelian",
    purchaseHistoryShort: "Riwayat",
    purchaseTab: "Pembelian",
    purchaseToday: "Hari ini",
    purchaseYesterday: "Kemarin",
    purchaseDaysAgo: "{n} hari lalu",
    purchaseEmptyTitle: "Belum ada pembelian",
    purchaseEmptyDesc: "Transaksi pelanggan ini di kasir akan muncul di sini.",
    purchaseTransactions: "Transaksi",
    purchaseTotalSpent: "Total belanja",
    purchaseLast: "Terakhir beli",
    purchaseCustomerSince: "Pelanggan sejak {date}",
    purchaseAverage: "rata-rata {amount} per transaksi",
    purchaseFrequent: "Sering dibeli",
    purchaseTimesBought: "{n}× dibeli",
    purchaseAdd: "Tambah",
    purchaseSales: "Transaksi",
    purchaseLoadMore: "Muat lagi",
    purchaseItemsCount: "{n} obat · ketuk untuk detail",
    examEditVitals: "Ubah",
    examAddAllergy: "Tambah alergi",
    examEditAllergy: "Ubah alergi",
    examAdvice: "Tindakan & anjuran",
    examAdvicePlaceholder: "mis. istirahat, banyak minum, kontrol 3 hari lagi bila demam berlanjut",
    examBloodTypeShort: "Gol.",
    examBmi: "IMT",
    examCallInTitle: "Panggil pasien",
    examCallInNotTriaged: "Tanda vital belum dicatat; bisa diisi saat pemeriksaan.",
    examCancelReason: "Alasan pembatalan",
    examFindings: "Pemeriksaan fisik",
    examFindingsPlaceholder: "mis. faring hiperemis, paru bersih, tidak ada nyeri tekan",
    examInternalNotes: "Catatan internal",
    examNoResult: "Belum ada hasil pemeriksaan.",
    examNoVitals: "Tanda vital belum dicatat.",
    examNotTriaged: "Belum triase",
    examQueueShort: "No.",
    examResultTitle: "Hasil pemeriksaan",
    examSpo2: "SpO₂",
    examTriageTitle: "Triase",
    examTriageDesc: "Keluhan dan tanda vital sebelum ke dokter.",
    examTriageSave: "Simpan & siap diperiksa",
    examTriageUpdate: "Perbarui tanda vital",
    examTriageSaved: "Tanda vital tersimpan",
    examTriagedBy: "{name} · {time}",
    examVitalBp: "Tensi",
    examVitalTemp: "Suhu",
    examVitalPulse: "Nadi",
    examVitalWeight: "Berat",
    examVitalHeight: "Tinggi",
    examVitalsTitle: "Tanda vital",
    examStageWaiting: "Antre",
    examStageReady: "Siap periksa",
    examReadyEmpty: "Belum ada pasien yang siap diperiksa.",
    examInProgressEmpty: "Tidak ada pasien yang sedang diperiksa.",
    examCompletedEmpty: "Belum ada pemeriksaan yang selesai hari ini.",
    examSeeWaiting: "{n} pasien masih menunggu triase",
    examAllergyTag: "Alergi",
    examCarriedOver: "Sejak",
    examFlowRegister: "Daftar",
    examFlowTriage: "Triase",
    examFlowDoctor: "Dokter",
    examFlowDone: "Resep / selesai",
    examViewByPatient: "Per pasien",
    examViewByDoctor: "Per dokter",
    examDoctorYou: "Anda",
    examDoctorFree: "Kosong",
    examDoctorBusy: "Memeriksa {n}",
    examCallNext: "Panggil berikutnya · {n} {name}",
    examNextUp: "Berikutnya: {n} {name}",
    examLaneEmpty: "Tidak ada yang menunggu",
    examAnyDoctor: "Bebas",
    examAnyDoctorHint: "Pasien tanpa pilihan dokter muncul di urutan semua dokter; siapa yang memanggil duluan yang menangani.",
    examNoDoctorsTitle: "Belum ada dokter praktik",
    examNoDoctorsDesc: "Hubungkan dokter dengan akun user (halaman Dokter) agar antrean bisa dibagi per dokter.",
    examWaitingCount: "{n} menunggu",
    examCalledIn: "{name} dipanggil",
    examNewPatient: "Pasien baru",
    examCheckInDescTriage: "Pilih pasien yang datang, lalu catat tanda vital dan alergi di panel triase.",
    roleTypeDoctor: "Dokter",
    roleTypeNurse: "Perawat",
    examGenderMale: "L",
    examGenderFemale: "P",
    examLineRequired: "Isi nama obat dan jumlahnya",
    examUnsaved: "Ada perubahan belum disimpan",
  },
};

export function getSavedLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
  return saved && SUPPORTED_LANGUAGES.includes(saved) ? saved : "en";
}

export function saveLanguage(lang: Language): void {
  localStorage.setItem(LANGUAGE_KEY, lang);
}
