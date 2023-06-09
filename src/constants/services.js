// Auth Services
export const API_LOGIN_SERVICE = "authenticate";
export const API_LOGOUT_SERVICE = "";
export const API_FORGOT_PW_SERVICE = "signup/reset-password-web";
export const API_RESET_PW_SERVICE = "";
export const API_USER_PROFILE = "user-profiles/web";
export const API_UPDATE_USER_PROFILE = "user-profiles/web/update";
export const API_UPDATE_USER_PASSWORD = "user-profiles/web/update";

//Regional Dashboard Services
export const API_DASHBOARD_TOP_ROW_DATA_SERVICE = "dashboard/toprowdata";
export const API_DASHBOARD_TOP_FILTERS_SERVICE = "dashboard/regional/dropdowns";
export const API_DASHBOARD_PRODUCT_FILTERS_SERVICE =
  "dashboard/regional/dropdowns/product-performance/category";
export const API_DASHBOARD_COMPONENT_FILTERS_SERVICE =
  "dashboard/regional/dropdowns/product-performance/component";
export const API_REGIONAL_DASHBOARD_DATA_SERVICE = "dashboard/regional/charts";

//Country Dashboard Service
export const API_COUNTRY_DASHBOARD_FILTERS_SERVICE =
  "dashboard/country/dropdowns";
export const API_COUNTRY_DASHBOARD_PRODUCT_FILTERS_SERVICE =
  "dashboard/country/dropdowns/product-performance/category";
export const API_COUNTRY_DASHBOARD_COMPONENT_FILTERS_SERVICE =
  "dashboard/country/dropdowns/product-performance/component";
export const API_COUNTRY_DASHBOARD_DATA_SERVICE = "dashboard/country/charts";

// User Services

export const API_SINGLE_USER = "user-profiles/web";

// Incentive Services
export const API_INCENTIVE_NORMAL_LIST_SERVICE = "incentive-normal/list/";
export const API_INCENTIVE_NORMAL_LIST_ADD_SERVICE =
  "incentive-normal/list/add";
export const API_INCENTIVE_NORMAL_LIST_UPDATE_SERVICE =
  "incentive-normal/list/update";
export const API_INCENTIVE_NORMAL_GET_BY_ID =
  "incentive-normal/incentives-with-dealer-outlets/";
export const API_INCENTIVE_NORMAL_ALL_SERVICE = "/incentive-normal/list/all/";
export const API_GENERATE_INCENTIVE_PAYABLE_SERVIVE = "payout/generate";
export const API_INCENTIVE_NORMAL_GET_ALL_MTM = "incentive-normal/list/mtm";
export const API_GET_PAYOUT_BY_YEAR_SERVICE = "payout/list/";

// Incentive Bonus Services
export const API_INCENTIVE_BONUS_LIST_SERVICE = "incentive-bonus/list/";
export const API_INCENTIVE_BONUS_UTILITY_GET_SERVICE =
  "incentive-bonus/utility"; // "utility/incentive-bonus";
export const API_INCENTIVE_BONUS_ADD = "incentive-bonus/add-by-mtm";
export const API_INCENTIVE_BONUS_UPDATE = "incentive-bonus/update-by-mtm";
export const API_INCENTIVE_BONUS_GET_BY_ID = "incentive-bonus/";

// Incentive Target Services
export const API_INCENTIVE_TARGET_LIST_SERVICE = "incentive-target/list/";
export const API_INCENTIVE_TARGET_ADD = "incentive-target/add-by-mtm";
export const API_INCENTIVE_TARGET_UPDATE = "incentive-target/update-by-mtm";
export const API_INCENTIVE_TARGET_GET_BY_ID = "incentive-target/";
export const API_INCENTIVE_TARGET_UTILITY_GET_SERVICE =
  "incentive-target/utility";

// Incentive Promoter Services
export const API_INCENTIVE_PROMOTER_LIST_SERVICE = "incentive-promoter/list";
export const API_INCENTIVE_PROMOTER_ADD = "incentive-promoter/add";
export const API_INCENTIVE_PROMOTER_UPDATE = "incentive-promoter/update";
export const API_INCENTIVE_PROMOTER_GET_BY_ID = "incentive-promoter/list/";
export const API_INCENTIVE_PROMOTER_PRODUCT_FAMILY =
  "incentive-promoter/product-family";

//Dealer Incentive Entitlement Services
export const API_DEALER_INC_ENT_LIST_SERVICE = "dealer-incentive-entitlement/list";
export const API_DEALER_INC_RECEIPT_LIST_SERVICE =
  "dealer-incentive-entitlement/list-receipt-upload/";
export const API_DEALER_INC_ENT_UPLOAD_BY_DEALER_SERVICE =
  "dealer-incentive-entitlement/upload-by-dealer";
export const API_DEALER_INC_ENT_UPLOAD_BY_MONTH_SERVICE =
  "dealer-incentive-entitlement/upload-by-month-year";

// Dealer Services
export const API_DEALER_LIST_SERVICE = "dealer-info/viewall/pic"; //'dealer-outlets/viewall';
export const API_ALL_DEALER_LIST_SERVICE = "dealer-info/viewall";
export const API_SINGLE_DEALER_SERVICE = "dealer-info/view/";
export const ADD_DEALER_SERVICE = "dealer-info/add";
export const EXPORT_DEALER_SERVICE = "";
export const UPDATE_DEAER_SERVICE = "dealer-info/update";
export const SUBMIT_DEALER_INCENTIVE_SERVICE = "dealer-info/grp/update";
export const API_DEALERS_OUTLETS_LIST_SERVICE = "dealer-info/viewall/outlets";
export const API_DEALER_SELL_IN_LIST_SERVICE = "sell-in/list";
export const API_DEALER_SELL_IN_ADD_SERVICE = "sell-in/create";
export const API_DEALER_SELL_OUT_LIST_SERVICE = "sell-out/list";
export const API_DEALER_SELL_OUT_ADD_SERVICE = "sell-out/create";
export const API_DEALER_STOCK_LIST_SERVICE = "dealer-stock/list-by-dealer";
export const API_DEALER_STOCK_LIST_MONTHLY_SERVICE =
  "dealer-stock/list-monthly";
export const API_DEALER_STOCK_LIST_DOWNLOAD_SERVICE = "dealer-stock/download";

// Bulk Sales Services

// Outlet Services
export const API_OUTLET_PIC_LIST_SERVICE = "outlet-pic/viewall/outlets";
export const API_SINGLE_OUTLET_PIC_SERVICE = "outlet-pic/view/";
export const ADD_OUTLET_PIC_SERVICE = "outlet-pic/add";
export const EXPORT_OUTLET_PIC_SERVICE = "";
export const UPDATE_OUTLET_PIC_SERVICE = "outlet-pic/update";

// Dealer Outlet Services
export const API_DEALER_OUTLET_LIST_SERVICE = "dealer-outlets/all-by-region";
export const API_OUTLET_LIST_SERVICE = "dealer-outlets/viewall"; // 'outlet-pic/viewall';
export const API_SINGLE_OUTLET_SERVICE = "dealer-outlets/view/";
export const ADD_OUTLET_SERVICE = "dealer-outlets/add";
export const EXPORT_OUTLET_SERVICE = "";
export const UPDATE_OUTLET_SERVICE = "dealer-outlets/update";
export const UPLOAD_BULK_OUTLET_SERVICE = "dealer-outlets/upload";
export const API_OUTLET_WITH_PIC_LIST_SERVICE = "dealer-outlets/viewall";

// Staff Services
export const PENDING_SALESPERSON_LIST_SERVICE = "approval/all";
export const APPROVE_REJECT_SALESPERSON_SERVICE = "approval/update";
export const GET_PROMOTER_LEADERS_SERVICE = "staff-list/promoter-leader/all";
export const GET_PROMOTER_LIST_SERVICE = "staff-list/promoter/all";
export const GET_SALESPERSON_LIST_SERVICE = "staff-list/salesperson/all";
export const ADD_PROMOTER_LEADER_SERVICE = "staff-list/promoter-leader/add";
export const ADD_PROMOTER_SERVICE = "staff-list/promoter/add";
export const ADD_SALESPERSON_SERVICE = "staff-list/salesperson/add";
export const UPDATE_SALESPERSON_SERVICE = "staff-list/salesperson/update";
export const UPDATE_PROMOTER_SERVICE = "staff-list/promoter/update";
export const UPDATE_PROMOTER_LEADER_SERVICE =
  "staff-list/promoter-leader/update";
export const GET_PROMOTERS_WITH_OUTLETS_SERVICE =
  "staff-list/promoter/all/with-outlets";
export const GET_ACTIVE_PROMOTERS_WITH_OUTLETS_SERVICE =
  "staff-list/promoters/active/with-outlets";
export const ASSIGN_PROMOTER_OUTLET_SERVICE =
  "staff-list/promoter/assign-outlet";
export const UNASSIGN_PROMOTER_OUTLET_SERVICE =
  "staff-list/promoter/unassign-outlet";
export const ADD_STATE_MANAGER_SERVICE = "manager/state/create";
export const UPDATE_STATE_MANAGER_SERVICE = "manager/state/update";
export const GET_STATE_MANAGER_LIST_SERVICE = "manager/state/list"
export const GET_REGIONAL_MANAGER_LIST_SERVICE = "manager/regional/list";
export const ADD_REGIONAL_MANAGER_SERVICE = "manager/regional/create";
export const UPDATE_REGIONAL_MANAGER_SERVICE = "manager/regional/update";

// Product Services
export const API_PRODUCT_LIST_SERVICE = "product-info/viewall/web";
export const API_SINGLE_PRODUCT_SERVICE = "product-info/view/";
export const DELETE_PRODUCT_SERVICE = "product-info/delete";
export const ADD_PRODUCT_SERVICE = "product-info/add";
export const ADD_PRODUCT_BULK_SERVICE = "product-info/add/bulk";
export const UPDATE_PRODUCT_SERVICE = "product-info/update";
export const UPLOAD_PRODUCT_GUILD_SERIVE = "poduct-info/upload-guide";
export const API_PRODUCT_SKU_LIST_SERVICE = "product-sku/all";

// Report Services

// Common Services(lnv)

// News Services
export const API_NEWS_LIST_SERVICE = "news/all/";
export const API_SINGLE_NEWS_SERVICE = "/api/news/";
export const DELETE_NEWS_SERVICE = "/news/delete/";
export const ADD_NEWS_SERVICE = "news/add";
export const UPLOAD_NEWS_IMAGE_SERVICE = "news/uploads";
export const UPDATE_NEWS_SERVICE = "news/update";

// Utility Services
export const GET_BANK_LIST_SERVICE = "utility/banks/";
export const GET_STATE_LIST_SERVICE = "utility/state/";
export const GET_CATEGORY_LIST_SERVICE = "utility/outlet/category";
export const GET_COUNTRY_LIST_SERVICE = "utility/countries";
export const GET_COUNTRIES_WITH_REGION_SERVICE = "utility/countries-region";
export const GET_GENDER_LIST_SERVICE = "utility/genders";
export const GET_NEWS_TARGETS_SERVICE = "utility/news-target";
export const GET_PRODUCT_TYPES_SERVICE = "utility/product-type";
export const GET_PRODUCT_GROUPS_SERVICE = "utility/product-group";
export const GET_SALE_STATUS_SERVICE = "utility/sales-status-web";
export const GET_SERIAL_TYPE_SERVICE = "utility/serial-type-web";
export const GET_CHECK_STATUS_SERVICE = "utility/check-status";
export const GET_FAILE_REASONS_SERVICE = "utility/failed-reason";
export const GET_INCENTIVE_TARGET_TYPES_SERVICE =
  "utility/incentive-generation-type";
export const GET_TARGET_SALES_TYPES_SERVICE = "utility/target-sales-type";
export const GET_PROMOTER_TYPES_SERVICE = "utility/promoter-type";

// Message Services
export const ADD_MESSAGE_TREAD_SERVICE = "private-message/thread/add";
export const GET_MESSAGES_TREAD_BY_USER_SERVICE = "private-message/thread/list";
export const GET_MESSAGES_TREAD_BY_COUNTRY_SERVICE =
  "private-message/thread/list/country";
export const SEND_MESSGAE_BY_TREAD_SERVICE = "private-message/reply";
export const GET_MESSAGES_TREAD_SERVICE = "private-message/list";
export const READ_MESSAGE_SERVICE = "private-message/read/web";
export const GET_UNREAD_MESSAGE_SERVICE = "private-message/unread-count";

// Bulk Sales
export const UPLOAD_BULK_SALE_SERVICE = "sales/add/web";
export const GET_BULK_SALES_SERVICE = "sales/get/sales-upload";
export const DOWNLOAD_BULK_SALES_SERVICE = "sales/get/sales-upload/detail/";
export const GET_UNKNOWN_SERIAL_LIST_SERVICE = "sales/get/web";
export const UPDATE_SALE_DATA_SERVICE = "sales/update/web";
export const CHECK_SERIAL_NUMBER_SERVICE = "product-serial/check-serial-web/";

//Exclusive MTM
export const GET_EXCLUSIVE_MTM_SERVICE = "exclusive-mtm/list";
export const UPLOAD_EXCLUSIVE_MTM_SERVICE = "exclusive-mtm/create";
export const UPDATE_EXCLUSIVE_MTM_SERVICE = "exclusive-mtm/update";

// Target Service

export const GET_SALES_DATA_SERVICE = "sales/get/web";
export const UPDATE_SALES_DATA_SERVICE = "sales/update/web";
export const DOWNLOAD_SALES_DATA_SERVICE = "sales/get/web/download";
export const DOWNLOAD_INCENTIVE_PAYABLE_SERVICE = "payout/download";

// Target Country Services
export const GET_TARGET_COUNTRY_BY_YEAR_SERVICE = "target/country/all/";
export const ADD_TARGET_COUNTRY_BY_YEAR_SERVICE = "target/country/add";
export const ADD_TARGET_COUNTRY_BY_WEEK_SERVICE =
  "target/country/weekly/update"; // "target/country/weekly/add";
export const GET_TARGET_COUNTRY_BY_WEEK_SERVICE =
  "target/country/weekly/fiscal/";
export const GET_TARGET_PROMOTER_BY_YEAR_SERVICE = "target/promoter/all/";
export const ADD_TARGET_PROMOTER_BY_YEAR_SERVICE = "target/promoter/add";
export const ADD_TARGET_PROMOTER_BY_WEEK_SERVICE =
  "target/promoter/weekly/update";
export const GET_TARGET_PROMOTER_BY_WEEK_SERVICE =
  "target/promoter/weekly/fiscal/";

// Target Promoter Leader Services
export const GET_TARGET_PROMOTER_LEADER_BY_WEEK_SERVICE =
  "target/promoter-leader/weekly/fiscal/";
export const ADD_TARGET_PROMOTER_LEADER_BY_WEEK_SERVICE =
  "target/promoter-leader/weekly/update";

// Reports
export const DOWNLOAD_PROMOTER_ATTENDANCE_SERVICE =
  "promo-atten-info/get/web/download";
export const DOWNLOAD_NORMAL_INC_ENT_SERVICE = "";
export const DOWNLOAD_BONUS_INC_ENT_SERVICE = "";
export const DOWNLOAD_TARGET_INC_ENT_SERVICE = "incentive-target/payable/all";
export const DOWNLOAD_DEALER_INC_ENT_SERVICE = "";

// Distributor Services
export const API_DISTRIBUTOR_LIST_SERVICE = "distributor/get";
export const API_SINGLE_DISTRIBUTOR_SERVICE = "distributor/view/";
export const ADD_DISTRIBUTOR_SERVICE = "distributor/add";
export const UPDATE_DISTRIBUTOR_SERVICE = "distributor/update";

// Settings
export const API_GET_MOBILE_APP_SETTINGS = "app-setting/get/";
export const API_UPDATE_MOBILE_APP_SETTINGS = "app-setting/update";

// Tableau
export const API_TABLEAU_LOGIN_SERVICE =
  "https://lrcm-analytics.chimaera.my/trusted";
