<template>
  <div id="download-sales-data">
    <breadcrumb
      title="Dashboard"
      subtitle="Download"
      sub-sub-title="Sales Data"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div v-if="isRegionAdmin" class="col-lg-6">
                  <div class="form-group flex-grow-1">
                    <label
                      class="text-label"
                      v-text="$ml.get('sd_title_country')"
                    ></label>
                    <Multiselect
                      ref="multiselect-country"
                      v-model="search.countryId"
                      placeholder="Select Country"
                      :searchable="true"
                      :options="countries"
                      label="text"
                      track-by="id"
                      :loading="isCountriesLoading"
                      select-label
                      deselect-label
                      @input="filterRegions"
                    ></Multiselect>
                  </div>
                </div>
                <!-- <div class="col-lg-6" v-if="!isRegionAdmin">
                  <div class="form-group flex-grow-1">
                    <label class="text-label" v-text="$ml.get('sd_title_region')"></label>
                    <multiselect
                      ref="multiselect-region"
                      placeholder="Select Region"
                      :searchable="true"
                      v-model="search.regionId"
                      :options="regions"
                      :loading="isRegionsLoading"
                      label="text"
                      track-by="code"
                      selectLabel
                      deselectLabel
                    ></multiselect>
                  </div>
                </div>-->

                <div
                  :class="{
                    'col-lg-12': !isRegionAdmin,
                    'col-lg-6': isRegionAdmin
                  }"
                >
                  <div class="form-group flex-grow-1">
                    <label
                      class="text-label"
                      v-text="$ml.get('sd_title_period')"
                    ></label>
                    <br />
                    <DateRangePicker
                      ref="picker"
                      v-model="dateRange"
                      :opens="datePicker.opens"
                      :locale-data="{ firstDay: 1, format: 'YYYY-MM-DD' }"
                      :min-date="datePicker.minDate"
                      :max-date="datePicker.maxDate"
                      :single-date-picker="datePicker.singleDatePicker"
                      :time-picker="datePicker.timePicker"
                      :time-picker24hour="datePicker.timePicker24Hour"
                      :show-week-numbers="datePicker.showWeekNumbers"
                      :show-dropdowns="datePicker.showDropdowns"
                      :auto-apply="datePicker.autoApply"
                      :linked-calendars="datePicker.linkedCalendars"
                      :date-format="datePicker.dateFormat"
                      :ranges="datePicker.ranges"
                      @update="updateDateValues"
                    >
                      <div
                        slot="input"
                        slot-scope="picker"
                        style="min-width: 310px; width: 100%; float: left;"
                      >
                        <span v-if="picker.startDate && picker.endDate">{{ formatDate(picker.startDate) }} to
                          {{ formatDate(picker.endDate) }}</span>
                      </div>
                    </DateRangePicker>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="downloadSalesData"
                    >
                      <i class="fa fa-download"></i>
                      <span v-text="$ml.get('button_download_text')"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import DateRangePicker from "../../components/ui/vue2-daterange-picker";
import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { convertDateFormat } from "../../utils/helpers";
import { DOWNLOAD_SALES_DATA_REQUEST } from "../../store/modules/sales/actions";
import { export_json_to_excel } from "../../utils/Export2Excel";
import { Message } from "element-ui";
import Multiselect from "vue-multiselect";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";

const today = new Date();
export default {
  name: "SalesDataDPage",
  components: {
    breadcrumb: breadcrumb,
    DateRangePicker: DateRangePicker,
    Multiselect: Multiselect
  },
  computed: {},
  data() {
    return {
      total: 0,
      dataList: [],
      dateRange: {
        startDate: convertDateFormat(
          new Date(today.getFullYear(), today.getMonth(), 1),
          "YYYY-MM-DD"
        ),
        endDate: convertDateFormat(
          new Date(today.getFullYear(), today.getMonth() + 1, 0),
          "YYYY-MM-DD"
        )
      },
      datePicker: {
        opens: "center",
        // minDate: "2019-08-01",
        // maxDate: "2019-12-31",
        singleDatePicker: false,
        timePicker24Hour: false,
        showWeekNumbers: false,
        showDropdowns: false,
        timePicker: false,
        autoApply: false,
        ranges: false
      },
      search: {},
      isRegionAdmin: false,
      countries: [],
      regions: [],
      isCountriesLoading: false,
      isRegionsLoading: false,
      isPromoLeader: false,
      userCountryId: 0
    };
  },
  methods: {
    async downloadSalesData() {
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");
      let countryId = this.search.countryId ? this.search.countryId.id : null;
      let regionId = this.search.regionId ? this.search.regionId.code : null;

      let pData = {
        startDate: startDate,
        endDate: endDate,
        statusId: null,
        serialNumberTypeId: null,
        countryId: countryId,
        region: regionId
      };

      if (this.isRegionAdmin && !countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      }

      this.$store.dispatch(DOWNLOAD_SALES_DATA_REQUEST, pData).then(res => {
        if (res.resultCode === 0) {
          this.dataList = res.content;
          // res.content.forEach(item => {
          //   item.invoiceYear = item.invoiceDate;
          //   item.invoiceMonth = item.invoiceDate;
          //   this.dataList.push(item);
          // });

          this.total = this.dataList.length;
          this.exportExcel(this.dataList, pData);
        }
      });
    },
    exportExcel(exdata, post) {
      let tHeader = [];
      let filterVal = [];
      if (this.isPromoLeader) {
        tHeader = [
          "Sales Id",
          "LPP Code",
          "Dealer Name",
          "Account Manager",
          "Region Manager",
          "State Manager",
          "Outlet Code",
          "Outlet Name",
          "Outlet Address",
          "Region",
          "State",
          "Staff Name",
          "Staff IC Number",
          "Staff Email",
          "Staff Phone Number",
          "Staff Role",
          "User ID Number", //new
          "Promoter Type", //new
          "Promoter Leader Name", //new
          "Serial Number",
          "Submission Date",
          "Invoice Number",
          "Invoice Date",
          "Serial No, Status",
          "Validation",
          "Reason",
          "Normal Incentive",
          "MTM Number",
          "Family Name",
          "Product Group",
          "Product Category",
          "CPU",
          "HDD",
          "LCD",
          "OS Category",
          "Warranty"
        ];
        filterVal = [
          "salesId",
          "prmLppCode",
          "dealerName",
          "accountManager",
          "regionalManager",
          "stateManager",
          "dealerCode",
          "outletName", //new 19/10/02
          "outletAddress",
          "region",
          "state",
          "staffName",
          "staffIcNumber",
          "staffEmail",
          "staffPhoneNumber",
          "staffRole",
          "userId", //new
          "promoterType", //new
          "promoterLeaderName", //new
          "serialNumber",
          "submissionDate",
          "invoiceNumber",
          "invoiceDate",
          "status",
          "checkStatus",
          "reason",
          "normal",
          "mtmNumber",
          "familyName",
          "productGroup",
          "productCategory",
          "cpu",
          "hddType",
          "lcd",
          "osCategory",
          "warranty"
        ];
      } else {
        tHeader = [
          "Sales Id",
          "LPP Code",
          "Dealer Name",
          "Account Manager",
          "Region Manager",
          "State Manager",
          "Outlet Code",
          "Outlet Name",
          "Outlet Address",
          "Region",
          "State",
          "Staff Name",
          "Staff Role",
          "Staff IC Number",
          "Staff Email",
          "Staff Phone Number",
          "User ID Number", //new
          "Promoter Type", //new
          "Promoter Leader Name", //new
          "Serial Number",
          "Submission Date",
          "Invoice Year",
          "Invoice Month",
          "Invoice Number",
          "Invoice Date",
          "Serial No, Status",
          "Validation",
          "Reason",
          "Normal Incentive",
          "MTM Number",
          "Family Name",
          "Product Group",
          "Product Category",
          "CPU",
          "HDD",
          "LCD",
          "OS Category",
          "Warranty"
        ];
        filterVal = [
          "salesId",
          "prmLppCode",
          "dealerName",
          "accountManager",
          "regionalManager",
          "stateManager",
          "dealerCode",
          "outletName", //new 19/10/02
          "outletAddress",
          "region",
          "state",
          "staffName",
          "staffRole",
          "staffIcNumber",
          "staffEmail",
          "staffPhoneNumber",
          "userId", //new
          "promoterType", //new
          "promoterLeaderName", //new
          "serialNumber",
          "submissionDate",
          "invoiceYear",
          "invoiceMonth",
          "invoiceNumber",
          "invoiceDate",
          "status",
          "checkStatus",
          "reason",
          "normal",
          "mtmNumber",
          "familyName",
          "productGroup",
          "productCategory",
          "cpu",
          "hddType",
          "lcd",
          "osCategory",
          "warranty"
        ];
      }

      const data = this.formatJson(filterVal, exdata);
      const fileName = "salesFile-" + post.startDate + "-" + post.endDate;

      if (exdata.length <= 0) {
        Message({
          message: "No sales data found on selected period!",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName,
          sheetName: "salesFile",
          autoWidth: true,
          bookType: "xlsx"
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (
            j === "invoiceDate" ||
            j === "submissionDate" ||
            j === "updatedDate" ||
            j === "scanDate"
          ) {
            if (v[j] !== null) {
              return convertDateFormat(v[j], "YYYY-MM-DD");
            }
            return v[j];
          } else {
            return v[j];
          }

          // else if (j === "invoiceYear") {
          //   if (v[j] !== null) {
          //     return convertDateFormat(v[j], "YYYY");
          //   }
          // } else if (j === "invoiceMonth") {
          //   if (v[j] !== null) {
          //     return convertDateFormat(v[j], "MM");
          //   }
          // }
        })
      );
    },
    updateDateValues() {},
    formatDate: function(date) {
      return convertDateFormat(String(date), "YYYY-MM-DD");
    },
    getCountries() {
      this.isCountriesLoading = true;
      const needRegions = this.isRegionAdmin;
      this.$store
        .dispatch(COUNTRY_LIST_REQUEST, { withRegion: needRegions })
        .then(res => {
          if (res.resultCode === 0) {
            this.countries = res.content;
            this.isCountriesLoading = false;

            // if (!this.isRegionAdmin) {
            //   this.regionsByUserCountry();
            // }
          } else {
            this.isCountriesLoading = false;
          }
          this.getCountriesIsLoading = false;
        });
    },
    filterRegions() {
      this.isRegionsLoading = true;
      this.getRegions();
    },
    getRegions() {
      this.regions = this.search.countryId.children;
      this.isRegionsLoading = false;
    },
    getStates() {
      // let regions = [];
      // // this.search.regionId = {};
      // if (this.search.countryId) {
      //   this.$store
      //     .dispatch(STATE_LIST_REQUEST, { countryId: this.search.countryId.id })
      //     .then(res => {
      //       if (res.resultCode === 0) {
      //         this.regions = res.content;
      //         // this.search.regionId = res.content[0];
      //       }
      //     });
      // }
    },
    regionsByUserCountry() {
      // this.search.countryId = {};
      let userCountryId = this.userCountryId;
      // console.log(this.countries);
      if (!this.isRegionAdmin) {
        let c = this.countries.filter(function(elem) {
          if (elem.id === userCountryId) return elem;
        });
        // alert(JSON.stringify(c));
        if (c[0]) {
          this.search.countryId = c[0];
        } else {
          this.search.countryId = {};
        }

        this.filterRegions();
      }
    }
  },
  mounted() {
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isPromoLeader = this.$store.getters.isPromoLeader;
    this.userCountryId = this.$store.getters.getCountryId;
  },
  created() {
    // this.getNewsList();
  }
};
</script>
