/** When your routing table is too long, you can split it into small modules* */
import store from "@/store";
import DashboardPage from "@/views/dashboard/dashboard.vue";
import RegionalPage from "@/views/dashboard/regional.vue";
import CountryPage from "@/views/dashboard/country.vue";
import promoLeaderDashboard from "@/views/dashboard/promoter_leader.vue";
import AgencyDashboard from "@/views/dashboard/agency.vue";
import DealerDashboard from "@/views/dashboard/dealer.vue";
import OutletDashboard from "@/views/dashboard/outlet.vue";
import stateManagerDashboard from "@/views/dashboard/state_manager.vue";
import regionManagerDashboard from "@/views/dashboard/region_manager.vue";

import NormalIncentivePage from "@/views/incentiveM/normal.vue";
import NormalIncentiveAddPage from "@/views/incentiveM/normal_add.vue";
import NormalIncentiveEditPage from "@/views/incentiveM/normal_edit.vue";

import BonusIncentivePage from "@/views/incentiveM/bonus.vue";
import BonusIncentiveAddPage from "@/views/incentiveM/bonus_add.vue";
import BonusIncentiveEditPage from "@/views/incentiveM/bonus_edit.vue";

import TargetIncentivePage from "@/views/incentiveM/target.vue";
import TargetIncentiveAddPage from "@/views/incentiveM/target_add.vue";
import TargetIncentiveEditPage from "@/views/incentiveM/target_edit.vue";
import GenerateIncentivePayable from "@/views/incentiveM/incentive_payable.vue";

import PromoterIncentivePage from "@/views/incentiveM/promoter.vue";
import PromoterIncentiveAddPage from "@/views/incentiveM/promoter_add.vue";
import PromoterIncentiveEditPage from "@/views/incentiveM/promoter_edit.vue";

import UploadReceipt from "@/views/incentiveM/upload_receipt.vue";

import DealerListPage from "@/views/dealer/dealer_list.vue";
import DealerIncentivePage from "@/views/dealer/dealer_incentive.vue";
import DealerSellIn from "@/views/dealer/dealer_sell_in.vue";
import DealerSellOut from "@/views/dealer/dealer_sell_out.vue";
import DealerInventory from "@/views/dealer/dealer_inventory.vue";
import DealerIncentiveEntitlement from "@/views/dealer/dealer_incentive_entitlement.vue";

import NewsListPage from "@/views/news/news_list.vue";

import OutletPicPage from "@/views/outlets/pic_details.vue";
import OutletPage from "@/views/outlets/outlet_list.vue";

import ProductsPage from "@/views/products/product_list.vue";

import SalespersonPendingApprovalPage from "@/views/staff/salesperson_pending_approval.vue";
import PendingPromoterPage from "@/views/staff/promoter_pending_approval.vue";

import MessagePage from "@/views/message";

import DownloadSalesDataPage from "@/views/download/sales_data.vue";
import DownloadPromoterAttPage from "@/views/download/promoter_attendance.vue";
import DownloadIncentivePayable from "@/views/download/incentive_payable.vue";
import DownloadDealerIncentiveEntitlementPage from "@/views/download/dealer_incentive_entitlement.vue";

import BulkSaleUpload from "@/views/sales/bulk_sale_upload.vue";
import VerifySerial from "@/views/sales/verify_serial.vue";
import salesDataIndex from "@/views/sales/sales_data_index.vue";

import promoterLeaders from "@/views/staff/promoter_leaders.vue";
import promoterStaff from "@/views/staff/promoters.vue";
import salespersonStaff from "@/views/staff/salespersons.vue";
import stateManagers from "@/views/staff/state_managers.vue";
import regionalManagers from "@/views/staff/regional_managers.vue";

import TargetCountryData from "@/views/targets/country.vue";
import TargetPromoterData from "@/views/targets/promoter.vue";
import TargetPromoterLeaderData from "@/views/targets/promoter_leader.vue";

import DistributorPage from "@/views/distributor/index.vue";
import CheckSerialNumber from "@/views/sales/check_serial.vue";

import SettingsPage from "@/views/settings/index.vue";
import ExclusiveMTM from "@/views/mtm/mtm.vue";

import {
  ROLE_ADMIN,
  ROLE_COUNTRY_ADMIN,
  ROLE_GLN_COUNTRY_ADMIN,
  ROLE_PROMOTER_LEADER,
  ROLE_REGION_ADMIN,
  ROLE_DEALER,
  ROLE_CHECKER,
  LAYOUT_ADMIN,
  ROLE_OUTLET_PIC,
  ROLE_AGENCY,
  ROLE_COUNTRY_AGENCY,
  ROLE_REGION_MANAGER,
  ROLE_STATE_MANAGER
} from "../../constants";

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    // let permissions = to.meta.permission.split(",");
    // alert(to.meta.permission[1]);
    let user = JSON.parse(localStorage.getItem("user"));
    let allowed = 0;
    for (var i = 0; i < to.meta.permission.length; i++) {
      if (to.meta.permission[i] == user.role) {
        allowed = 1;
        next();
        return;
      }
    }
    if (allowed == 0) {
      next("/not-allowed");
      return;
    }
  }
  next("/signin");
};
// alert(store.getters.isPromoLeader);
//ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN, ROLE_PROMOTER_LEADER, ROLE_DEALER
const dashboardRouter = {
  path: "/dashboard",
  name: "Dashboard Layout",
  component: DashboardPage,
  meta: {
    layout: LAYOUT_ADMIN,
    permission: [
      ROLE_ADMIN,
      ROLE_REGION_ADMIN,
      ROLE_COUNTRY_ADMIN,
      ROLE_GLN_COUNTRY_ADMIN,
      ROLE_PROMOTER_LEADER,
      ROLE_DEALER,
      ROLE_OUTLET_PIC,
      ROLE_AGENCY,
      ROLE_COUNTRY_AGENCY,
      ROLE_REGION_MANAGER,
      ROLE_STATE_MANAGER
    ]
  },
  children: [
    {
      path: "",
      name: "Dashboard",
      component: store.getters.isPromoLeader
        ? promoLeaderDashboard
        : store.getters.isCountryAgency
        ? AgencyDashboard
        : store.getters.isDealer
        ? DealerDashboard
        : store.getters.isPicOutlet
        ? OutletDashboard
        : store.getters.isAgency
        ? DownloadSalesDataPage
        : store.getters.isRegionAdmin
        ? RegionalPage
        : store.getters.isStateManager
        ? stateManagerDashboard
        : store.getters.isRegionManager
        ? regionManagerDashboard
        : CountryPage, //promoLeaderDashboard
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_DEALER,
          ROLE_OUTLET_PIC,
          ROLE_CHECKER,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY,
          ROLE_REGION_MANAGER,
          ROLE_STATE_MANAGER
        ]
      }
    },
    {
      path: "regional",
      name: "Regional Dashboard",
      component: RegionalPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN]
      }
    },
    {
      path: "country",
      name: "Country Dashboard",
      component: CountryPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN]
      }
    },
    {
      path: "incentive/normal",
      name: "Normal Incentive",
      component: NormalIncentivePage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "incentive/normal/add",
      name: "Add Normal Incentive",
      component: NormalIncentiveAddPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "incentive/normal/:type/:id",
      name: "Edit Normal Incentive",
      component: NormalIncentiveEditPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "incentive/bonus",
      name: "Bonus Incentive",
      component: BonusIncentivePage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "incentive/bonus/add",
      name: "Add Bonus Incentive",
      component: BonusIncentiveAddPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "incentive/bonus/edit/:id",
      name: "Edit Bonus Incentive",
      component: BonusIncentiveEditPage,
      beforeEnter: ifAuthenticated,
      props: true,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "incentive/target",
      name: "Target Incentive",
      component: TargetIncentivePage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "incentive/target/add",
      name: "Add Target Incentive",
      component: TargetIncentiveAddPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "incentive/target/edit/:id",
      name: "Edit Target Incentive ",
      component: TargetIncentiveEditPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "incentive/promoter",
      name: "Promoter Incentive",
      component: PromoterIncentivePage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "incentive/promoter/add",
      name: "Add Promoter Incentive",
      component: PromoterIncentiveAddPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "incentive/promoter/edit/:id",
      name: "Edit Promoter Incentive",
      component: PromoterIncentiveEditPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "dealers",
      name: "Dealer Details",
      component: DealerListPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "download/dealer-incentive-entitlement",
      name: "Dealer Incentive Entitlement",
      component: DownloadDealerIncentiveEntitlementPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_DEALER]
      }
    },
    {
      path: "dealer-incentive-entitlement",
      name: "Dealer Incentive Entitlement",
      component: DealerIncentiveEntitlement,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_DEALER]
      }
    },
    {
      path: "distributors",
      name: "Distributor Details",
      component: DistributorPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "incentive/dealer",
      name: "Dealer Incentive Management",
      component: DealerIncentivePage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "dealer-sell-in",
      name: "Dealer Sell In",
      component: DealerSellIn,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "dealer-sell-out",
      name: "Dealer Sell Out",
      component: DealerSellOut,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_DEALER
        ]
      }
    },
    {
      path: "dealer-inventory",
      name: "Dealer Inventory",
      component: DealerInventory,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN, ROLE_REGION_ADMIN]
      }
    },
    {
      path: "bulk-upload",
      name: "Bulk Upload Submission",
      component: BulkSaleUpload,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_DEALER]
      }
    },
    {
      path: "outlets/pic",
      name: "Outlet PIC Details",
      component: OutletPicPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_DEALER, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "outlets",
      name: "Outlet Details",
      component: OutletPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_DEALER,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_OUTLET_PIC,
          ROLE_PROMOTER_LEADER,
          ROLE_AGENCY,
          ROLE_REGION_ADMIN
        ]
      }
    },
    {
      path: "staff/promoter-leaders",
      name: "Promoter Leaders",
      component: promoterLeaders,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY
        ]
      }
    },
    {
      path: "staff/promoters",
      name: "Promoters",
      component: promoterStaff,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY
        ]
      }
    },
    {
      path: "staff/salespersons",
      name: "Salesperson",
      component: salespersonStaff,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_REGION_ADMIN,
          ROLE_OUTLET_PIC,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "staff/state-manager",
      name: "State Manager",
      component: stateManagers,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY
        ]
      }
    },
    {
      path: "staff/regional-manager",
      name: "Regional Manager",
      component: regionalManagers,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY,
          ROLE_COUNTRY_AGENCY
        ]
      }
    },
    {
      path: "salesperson-pending-approval",
      name: "Pending Approval",
      component: SalespersonPendingApprovalPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_REGION_ADMIN,
          ROLE_OUTLET_PIC,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "promoter-pending-approval",
      name: "Promoter Pending Approval",
      component: PendingPromoterPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER
        ]
      }
    },
    {
      path: "products",
      name: "Products",
      component: ProductsPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "targets/country",
      name: "Country Target",
      component: TargetCountryData,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN]
      }
    },
    {
      path: "targets/promoter",
      name: "Promoter Target",
      component: TargetPromoterData,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN
        ]
      }
    },
    {
      path: "targets/promoter-leader",
      name: "Promoter Leader Target",
      component: TargetPromoterLeaderData,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "sales-data",
      name: "Sales Validation",
      component: salesDataIndex,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_DEALER,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_OUTLET_PIC,
          ROLE_CHECKER,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "incentive-payable",
      name: "Generate Incentive Payable File",
      component: GenerateIncentivePayable,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "incentive-payable/upload-receipt",
      name: "Upload Receipt",
      component: UploadReceipt,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_COUNTRY_ADMIN]
      }
    },
    {
      path: "download/sales-data",
      name: "Sales Data",
      component: DownloadSalesDataPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "download/promoter-attendance",
      name: "Promoter Attendance",
      component: DownloadPromoterAttPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "downloads/incentive-payable",
      name: "Incentive Payable File",
      component: DownloadIncentivePayable,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER
        ]
      }
    },
    {
      path: "news",
      name: "News",
      component: NewsListPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "messages",
      name: "Message",
      component: MessagePage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "downloads/verify-serial",
      name: "Unknown Serial Number",
      component: VerifySerial,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_ADMIN, ROLE_REGION_ADMIN, ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "check-serial",
      name: "Check Serial Number",
      component: CheckSerialNumber,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [
          ROLE_ADMIN,
          ROLE_REGION_ADMIN,
          ROLE_COUNTRY_ADMIN,
          ROLE_GLN_COUNTRY_ADMIN,
          ROLE_PROMOTER_LEADER,
          ROLE_AGENCY
        ]
      }
    },
    {
      path: "settings",
      name: "Mobile Application Settings",
      component: SettingsPage,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    },
    {
      path: "exclusive-mtm",
      name: "Exclusive MTM",
      component: ExclusiveMTM,
      beforeEnter: ifAuthenticated,
      meta: {
        permission: [ROLE_COUNTRY_ADMIN, ROLE_GLN_COUNTRY_ADMIN]
      }
    }
  ],
  beforeEnter: ifAuthenticated
};

export default dashboardRouter;
