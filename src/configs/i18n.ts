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
  navCustomers: string;
  navDistributors: string;
  navReports: string;
  navSettings: string;
  searchPlaceholder: string;
  notifications: string;
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
  customerName: string;
  customerNamePlaceholder: string;
  customerNameRequired: string;
  customerPhone: string;
  customerPhonePlaceholder: string;
  customerAddress: string;
  customerAddressPlaceholder: string;
  customerDescription: string;
  customerDescriptionPlaceholder: string;
  customerStatusLabel: string;
  customerStatusActive: string;
  customerStatusInactive: string;
  customerIsWalkIn: string;
  customerWalkInBadge: string;
  customerWalkInRegular: string;
  customerSearchPlaceholder: string;
  customerNoResults: string;
  customerEmptyTitle: string;
  customerEmptyDesc: string;
  customerDeleteConfirmTitle: string;
  customerDeleteConfirmDesc: string;
  customerTotal: string;
  customerSingular: string;
  customerPlural: string;
  customerCreateSuccess: string;
  customerUpdateSuccess: string;
  customerDeleteSuccess: string;
  customerFilterStatus: string;
  customerFilterIsWalkIn: string;

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
  add: string;
  created: string;
  lastUpdated: string;
  cancel: string;
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
  pharmaWizardStep1Hint: string;
  pharmaWizardStep2Hint: string;

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
  saleCustomer: string;
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
  saleFilterCustomer: string;
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
  posSelectCustomer: string;
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
  posCustomerLabel: string;
  posWalkInCustomer: string;
  posSaleTypeLabel: string;
  posCreditRequiresCustomer: string;
  posDescriptionLabel: string;
  posDescriptionPlaceholder: string;
  posSubtotal: string;
  posTaxNote: string;
  posCheckout: string;
  posProcessing: string;
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
  srStatusOnProcess: string;
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
  reportSalesCustomer: string;
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
    dashboardApjLabel: "APJ (Pharmacist-in-Charge)",
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
    navCustomers: "Customers",
    navDistributors: "Distributors",
    navReports: "Reports",
    navSettings: "Settings",
    searchPlaceholder: "Search...",
    notifications: "Notifications",
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

    customersSubtitle: "Manage your customers and walk-in buyers",
    customerAdd: "Add",
    customerEdit: "Edit",
    customerDelete: "Delete",
    customerDetails: "Details",
    customerDetailsTitle: "Customer Details",
    customerSave: "Save",
    customerSaving: "Saving...",
    customerDeleting: "Deleting...",
    customerName: "Name",
    customerNamePlaceholder: "Full name",
    customerNameRequired: "Name is required",
    customerPhone: "Phone",
    customerPhonePlaceholder: "Phone number",
    customerAddress: "Address",
    customerAddressPlaceholder: "Full address",
    customerDescription: "Notes",
    customerDescriptionPlaceholder: "Additional notes",
    customerStatusLabel: "Status",
    customerStatusActive: "Active",
    customerStatusInactive: "Inactive",
    customerIsWalkIn: "Type",
    customerWalkInBadge: "Walk-in",
    customerWalkInRegular: "Regular",
    customerSearchPlaceholder: "Search customers...",
    customerNoResults: "No customers found",
    customerEmptyTitle: "No customers yet",
    customerEmptyDesc: "Add your first customer to get started",
    customerDeleteConfirmTitle: "Delete Customer",
    customerDeleteConfirmDesc: "This action cannot be undone. The customer will be permanently removed from the system.",
    customerTotal: "customers",
    customerSingular: "customer",
    customerPlural: "customers",
    customerCreateSuccess: "Customer added successfully",
    customerUpdateSuccess: "Customer updated successfully",
    customerDeleteSuccess: "Customer deleted successfully",
    customerFilterStatus: "Status",
    customerFilterIsWalkIn: "Type",

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

    add: "Add",
    created: "Created",
    lastUpdated: "Last Updated",
    cancel: "Cancel",
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
    userResetPasswordSuccess: "Password reset email sent",

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
    pharmaWizardStep1Hint: "Enter the pharmacy's basic information",
    pharmaWizardStep2Hint: "Register the pharmacy's operating license (SIA)",
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
    poSignedBy: "Signed By",
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
    poReceiptPenanggungJawab: "Person in Charge",
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
    invoiceSignedBy: "Signed By",
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
    stockAdjustSignedBy: "Signed By",
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
    sdSignedBy: "Signed By",
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
    saleCustomer: "Customer",
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
    saleSearchPlaceholder: "Search by sale number or customer...",
    saleNoResults: "No results found",
    saleEmptyTitle: "No sales found",
    saleEmptyDesc: "Sales will appear here once a checkout is completed",
    saleFilterStatus: "Status",
    saleFilterType: "Sale Type",
    saleFilterPaymentStatus: "Payment Status",
    saleFilterCustomer: "Customer",
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

    // Cashier / POS page
    posSubtitle: "Process sales transactions for walk-in and registered customers",
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
    posSelectCustomer: "Select customer",
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
    posCustomerLabel: "Customer",
    posWalkInCustomer: "Walk-in Customer",
    posSaleTypeLabel: "Sale Type",
    posCreditRequiresCustomer: "A registered customer is required for credit sales",
    posDescriptionLabel: "Description",
    posDescriptionPlaceholder: "Enter a note for this sale (optional)",
    posSubtotal: "Subtotal",
    posTaxNote: "PPN will be calculated at checkout",
    posCheckout: "Checkout",
    posProcessing: "Processing...",
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
    posPaymentMethodCreditDesc: "Customer pays later",
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
    srStatusOnProcess: "On Process",
    srStatusCompleted: "Completed",
    srStatusCancelled: "Cancelled",
    srStatusRejected: "Rejected",
    srReturnNumber: "Return #",
    srStatus: "Status",
    srReturnedAt: "Returned At",
    srDistributor: "Distributor",
    srSelectDistributor: "Select a distributor",
    srDistributorRequired: "Distributor is required",
    srSignedBy: "Signed By",
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
    navStockMovements: "Stock Movements",
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
    reportsStockMovementTab: "Stock Movements",
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
    reportSalesCustomer: "Customer",
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
    dashboardApjLabel: "APJ (Apoteker Penanggung Jawab)",
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
    navCustomers: "Pelanggan",
    navDistributors: "Distributor",
    navReports: "Laporan",
    navSettings: "Pengaturan",
    searchPlaceholder: "Cari...",
    notifications: "Notifikasi",
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

    customersSubtitle: "Kelola pelanggan dan pembeli walk-in Anda",
    customerAdd: "Tambah",
    customerEdit: "Edit",
    customerDelete: "Hapus",
    customerDetails: "Detail",
    customerDetailsTitle: "Detail Pelanggan",
    customerSave: "Simpan",
    customerSaving: "Menyimpan...",
    customerDeleting: "Menghapus...",
    customerName: "Nama",
    customerNamePlaceholder: "Nama lengkap",
    customerNameRequired: "Nama wajib diisi",
    customerPhone: "Telepon",
    customerPhonePlaceholder: "Nomor telepon",
    customerAddress: "Alamat",
    customerAddressPlaceholder: "Alamat lengkap",
    customerDescription: "Catatan",
    customerDescriptionPlaceholder: "Catatan tambahan",
    customerStatusLabel: "Status",
    customerStatusActive: "Aktif",
    customerStatusInactive: "Nonaktif",
    customerIsWalkIn: "Tipe",
    customerWalkInBadge: "Walk-in",
    customerWalkInRegular: "Reguler",
    customerSearchPlaceholder: "Cari pelanggan...",
    customerNoResults: "Pelanggan tidak ditemukan",
    customerEmptyTitle: "Belum ada pelanggan",
    customerEmptyDesc: "Tambahkan pelanggan pertama Anda untuk memulai",
    customerDeleteConfirmTitle: "Hapus Pelanggan",
    customerDeleteConfirmDesc: "Tindakan ini tidak dapat dibatalkan. Pelanggan akan dihapus secara permanen dari sistem.",
    customerTotal: "pelanggan",
    customerSingular: "pelanggan",
    customerPlural: "pelanggan",
    customerCreateSuccess: "Pelanggan berhasil ditambahkan",
    customerUpdateSuccess: "Pelanggan berhasil diperbarui",
    customerDeleteSuccess: "Pelanggan berhasil dihapus",
    customerFilterStatus: "Status",
    customerFilterIsWalkIn: "Tipe",

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

    add: "Tambah",
    created: "Dibuat",
    lastUpdated: "Terakhir Diperbarui",
    cancel: "Batal",
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
    userResetPasswordSuccess: "Email reset kata sandi telah dikirim",

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
    pharmaWizardStep1Hint: "Masukkan informasi dasar apotek",
    pharmaWizardStep2Hint: "Daftarkan izin operasional apotek (SIA)",
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
    saleCustomer: "Pelanggan",
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
    saleSearchPlaceholder: "Cari berdasarkan nomor penjualan atau pelanggan...",
    saleNoResults: "Tidak ada hasil ditemukan",
    saleEmptyTitle: "Belum ada penjualan",
    saleEmptyDesc: "Penjualan akan muncul di sini setelah transaksi kasir diselesaikan",
    saleFilterStatus: "Status",
    saleFilterType: "Jenis Penjualan",
    saleFilterPaymentStatus: "Status Pembayaran",
    saleFilterCustomer: "Pelanggan",
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

    // Cashier / POS page
    posSubtitle: "Proses transaksi penjualan untuk pelanggan walk-in maupun terdaftar",
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
    posSelectCustomer: "Pilih pelanggan",
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
    posCustomerLabel: "Pelanggan",
    posWalkInCustomer: "Pelanggan Walk-in",
    posSaleTypeLabel: "Jenis Penjualan",
    posCreditRequiresCustomer: "Pelanggan terdaftar diperlukan untuk penjualan kredit",
    posDescriptionLabel: "Deskripsi",
    posDescriptionPlaceholder: "Masukkan catatan untuk penjualan ini (opsional)",
    posSubtotal: "Subtotal",
    posTaxNote: "PPN akan dihitung saat checkout",
    posCheckout: "Checkout",
    posProcessing: "Memproses...",
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
    posPaymentMethodCreditDesc: "Pelanggan bayar nanti",
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
    srStatusOnProcess: "Sedang Diproses",
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
    reportSalesCustomer: "Pelanggan",
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
  },
};

export function getSavedLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
  return saved && SUPPORTED_LANGUAGES.includes(saved) ? saved : "en";
}

export function saveLanguage(lang: Language): void {
  localStorage.setItem(LANGUAGE_KEY, lang);
}
