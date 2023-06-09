<template>
  <div id="download-incentive-payable">
    <breadcrumb
      title="Dashboard"
      subtitle="Download"
      sub-sub-title="Incentive Payable"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <b-tabs v-model="activeTab">
              <b-tab-item label="Normal">
                <div class="d-flex flex-row align-items-center mb-3">
                  <div v-if="isRegionAdmin" class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_country')"
                    ></label>
                    <Multiselect
                      ref="multiselect-country"
                      v-model="normal.countryId"
                      placeholder="Select Country"
                      :searchable="true"
                      :options="countries"
                      label="text"
                      track-by="id"
                      :loading="isCountriesLoading"
                      select-label
                      deselect-label
                      @input="onChangeNormalCountry"
                    ></Multiselect>
                  </div>
                  <div class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_year')"
                    ></label>
                    <Multiselect
                      ref="multiselect-nyr"
                      v-model="normal.year"
                      placeholder="Select Year"
                      :searchable="true"
                      :options="yearList"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                    ></Multiselect>
                  </div>
                  <div class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_month')"
                    ></label>
                    <Multiselect
                      ref="multiselect-nmn"
                      v-model="normal.month"
                      placeholder="Select Month"
                      :searchable="true"
                      :options="monthList"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                    ></Multiselect>
                  </div>
                </div>
                <div class="d-flex align-items-start">
                  <div>
                    <button
                      class="btn btn-primary"
                      @click="getNormalIncentivesData"
                    >
                      <i class="fa fa-download"></i>
                      <span v-text="$ml.get('button_download_text')"></span>
                    </button>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item label="Bonus">
                <div class="d-flex flex-row align-items-center mb-3">
                  <div v-if="isRegionAdmin" class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_country')"
                    ></label>
                    <Multiselect
                      ref="multiselect-country"
                      v-model="bonus.countryId"
                      placeholder="Select Country"
                      :searchable="true"
                      :options="countries"
                      :loading="isCountriesLoading"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                      @input="onChangeBonusCountry"
                    ></Multiselect>
                  </div>
                  <div class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_year')"
                    ></label>
                    <Multiselect
                      ref="multiselect-byr"
                      v-model="bonus.year"
                      placeholder="Select Year"
                      :searchable="true"
                      :options="yearList"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                      @input="onBonusYearChange"
                    ></Multiselect>
                  </div>
                  <div class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_incentive')"
                    ></label>
                    <Multiselect
                      ref="multiselect-bname"
                      v-model="bonus.name"
                      placeholder="Select Incentive"
                      :searchable="true"
                      :options="filteredBonusIncentives"
                      :loading="isIncentiveLoading"
                      label="name"
                      track-by="id"
                      select-label
                      deselect-label
                    ></Multiselect>
                  </div>
                </div>
                <div class="d-flex align-items-start">
                  <button
                    class="btn btn-primary pull-right"
                    @click="getBonusIncentivesData"
                  >
                    <i class="fa fa-download"></i>
                    <span v-text="$ml.get('button_download_text')"></span>
                  </button>
                </div>
              </b-tab-item>
              <b-tab-item label="Target">
                <div class="d-flex flex-row align-items-center mb-3">
                  <div v-if="isRegionAdmin" class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_country')"
                    ></label>
                    <Multiselect
                      ref="multiselect-country"
                      v-model="target.countryId"
                      placeholder="Select Country"
                      :searchable="true"
                      :loading="isCountriesLoading"
                      :options="countries"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                      @input="onChangeTargetCountry"
                    ></Multiselect>
                  </div>
                  <div class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_year')"
                    ></label>
                    <Multiselect
                      ref="multiselect-tyr"
                      v-model="target.year"
                      placeholder="Select Year"
                      :searchable="true"
                      :options="yearList"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                      @input="onTargetYearChange"
                    ></Multiselect>
                  </div>
                  <div class="form-group mb-0 mr-3 w-100">
                    <label
                      class="text-label"
                      v-text="$ml.get('incp_title_incentive')"
                    ></label>
                    <Multiselect
                      ref="multiselect-tname"
                      v-model="target.name"
                      placeholder="Select Incentive"
                      :searchable="true"
                      :options="filteredTargetIncentives"
                      :loading="isIncentiveLoading"
                      label="name"
                      track-by="id"
                      select-label
                      deselect-label
                    ></Multiselect>
                  </div>
                </div>
                <div class="d-flex align-items-start">
                  <button
                    class="btn btn-primary pull-right"
                    @click="getTargetIncentivesData"
                  >
                    <i class="fa fa-download"></i>
                    <span v-text="$ml.get('button_download_text')"></span>
                  </button>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import Multiselect from "vue-multiselect";
import { Message } from "element-ui";
import { export_json_to_excel } from "../../utils/Export2Excel";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import { convertDateFormat, urlValidate } from "../../utils/helpers";
import {
  INCENTIVE_BONUS_LIST_REQUEST,
  INCENTIVE_TARGET_LIST_REQUEST
} from "../../store/modules/incentive/action";
import { DOWNLOAD_INCENTIVE_PAYABLE_REQUEST } from "../../store/modules/download/actions";

export default {
  name: "DownloadIncentivePayable",
  components: {
    breadcrumb: breadcrumb,
    Multiselect: Multiselect
  },
  computed: {},
  data() {
    return {
      activeTab: 0,
      monthList: [],
      yearList: [],
      bonusIncentives: [],
      filteredBonusIncentives: [],
      targetIncetives: [],
      filteredTargetIncentives: [],
      normal: { id: 178 },
      bonus: { id: 179 },
      target: { id: 180 },
      search: {},
      isRegionAdmin: false,
      countries: [],
      countryId: null,
      isIncentiveLoading: false,
      isCountriesLoading: false
    };
  },
  methods: {
    getMonths() {
      const month = 0;
      for (let i = 1; i <= 12; i++) {
        let m = month + i;
        let mName = convertDateFormat("2019-" + m + "-01", "MMMM");
        this.monthList.push({ id: m, text: mName });
      }

      return this.yearList;
    },
    getYears() {
      const startYear = parseInt(2018);
      const year = parseInt(new Date().getFullYear());
      for (let i = startYear; i <= year; i++) {
        this.yearList.push({ id: i, text: i });
      }

      return this.yearList;
    },
    onBonusYearChange(value) {
      this.filteredBonusIncentives = [];
      if (value) {
        let sDate = convertDateFormat(
          value.id + "-01-01 00:00:01",
          "YYYY-MM-DD hh:mm:ss"
        );
        let eDate = convertDateFormat(
          value.id + "-12-31 23:59:59",
          "YYYY-MM-DD hh:mm:ss"
        );
        // alert(value.id);
        this.bonusIncentives.forEach(inc => {
          if (inc.startDate >= sDate && inc.endDate <= eDate) {
            this.filteredBonusIncentives.push(inc);
          }
        });
      }
    },
    onTargetYearChange(value) {
      this.filteredTargetIncentives = [];
      if (value) {
        let sDate = convertDateFormat(
          value.id + "-01-01 00:00:01",
          "YYYY-MM-DD hh:mm:ss"
        );
        let eDate = convertDateFormat(
          value.id + "-12-31 23:59:59",
          "YYYY-MM-DD hh:mm:ss"
        );
        // alert(value.id);
        this.targetIncentives.forEach(inc => {
          if (inc.startDate >= sDate && inc.endDate <= eDate) {
            this.filteredTargetIncentives.push(inc);
          }
        });
      }
    },
    onChangeNormalCountry(value) {
      if (value) {
        // this.countryId = value.id;
        // this.getIncentiveList();
      }
    },
    onChangeBonusCountry(value) {
      if (value) {
        this.bonus.countryId = value;
        this.getBonusIncentives();
      }
    },
    onChangeTargetCountry(value) {
      if (value) {
        this.target.countryId = value;
        this.getTargetIncetives();
      }
    },
    getBonusIncentives() {
      let pdata = {};
      this.isIncentiveLoading = true;

      if (this.isRegionAdmin) {
        pdata.countryId = this.bonus.countryId ? this.bonus.countryId.id : null;
      } else {
        pdata.countryId = this.countryId;
      }

      this.$store.dispatch(INCENTIVE_BONUS_LIST_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          // this.bonusIncentives = res.content;
          res.content.forEach(item => {
            let row = item;
            row.id = item.id;
            row.name =
              item.name +
              " " +
              convertDateFormat(item.startDate, "YYYY-MM-DD") +
              " To " +
              convertDateFormat(item.endDate, "YYYY-MM-DD");
            this.filteredBonusIncentives.push(row);
          });
          this.bonusIncentives = this.filteredBonusIncentives;
          this.isIncentiveLoading = false;
        } else {
          this.isIncentiveLoading = false;
        }
      });
    },
    getTargetIncetives() {
      let pdata = {};
      this.isIncentiveLoading = true;

      if (this.isRegionAdmin) {
        pdata.countryId = this.target.countryId
          ? this.target.countryId.id
          : null;
      } else {
        pdata.countryId = this.countryId;
      }

      this.$store.dispatch(INCENTIVE_TARGET_LIST_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          res.content.forEach(item => {
            let row = item;
            row.id = item.id;
            row.name =
              item.name +
              " " +
              convertDateFormat(item.startDate, "YYYY-MM-DD") +
              " To " +
              convertDateFormat(item.endDate, "YYYY-MM-DD");
            this.filteredTargetIncentives.push(row);
          });

          this.targetIncentives = this.filteredTargetIncentives;
          this.isIncentiveLoading = false;
        } else {
          this.isIncentiveLoading = false;
        }
      });
    },
    getNormalIncentivesData() {
      let countryId = this.normal.countryId ? this.normal.countryId.id : null;
      let curMonth = new Date().getMonth();
      let curYear = new Date().getFullYear();
      let pdata = {};
      if (this.isRegionAdmin && !countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      } else if (!this.normal.year || !this.normal.month) {
        return Message({
          message: "Year and month are required.",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        pdata.typeId = this.normal.id;
        pdata.month = this.normal.month ? this.normal.month.id : curMonth;
        pdata.year = this.normal.year ? this.normal.year.id : curYear;

        if (this.isRegionAdmin) {
          pdata.countryId = countryId;
        }

        this.$store
          .dispatch(DOWNLOAD_INCENTIVE_PAYABLE_REQUEST, pdata)
          .then(res => {
            if (res.resultCode === 0) {
              if (urlValidate(res.content.fileLink)) {
                let fileLink = res.content.fileLink;
                var win = window.open(fileLink, "_blank");
                win.focus();
              } else {
                let ym = convertDateFormat(
                  pdata.year + "-" + pdata.month + "-01",
                  "MMMM YYYY"
                );
                return Message({
                  message: "Normal Incentive file not found for " + ym,
                  type: "error",
                  duration: 5 * 1000
                });
              }
              // this.exportNormalIncentive(res.content);
            }
          });
      }
    },
    exportNormalIncentive(rowData) {
      const tHeader = [
        "Staff ID",
        "Staff Name",
        "Staff IC Number",
        "Staff Email",
        "Staff Phone Number",
        "Staff Bank",
        "Staff Other Bank",
        "CIMB Bank Code",
        "Staff Bank Account",
        "Total Payable",
        "Total Payable Exclude Fall"
      ];
      const filterVal = [
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id"
      ];
      const data = this.formatJson(filterVal, rowData);
      const fileName = "normalIncetivePayable";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "Sheet 1",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    getBonusIncentivesData() {
      let countryId = this.bonus.countryId ? this.bonus.countryId.id : null;
      let curYear = new Date().getFullYear();
      let pdata = {};
      if (this.isRegionAdmin && !countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      } else if (!this.bonus.year) {
        return Message({
          message: "Year is required.",
          type: "error",
          duration: 5 * 1000
        });
      } else if (!this.bonus.name) {
        return Message({
          message: "Incentive name is required.",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        pdata.typeId = this.bonus.id;
        pdata.year = this.bonus.year ? this.bonus.year.id : curYear;
        pdata.incentive_id = this.bonus.name ? this.bonus.name.id : null;

        if (this.isRegionAdmin) {
          pdata.countryId = countryId;
        }

        this.$store
          .dispatch(DOWNLOAD_INCENTIVE_PAYABLE_REQUEST, pdata)
          .then(res => {
            if (res.resultCode === 0) {
              if (urlValidate(res.content.fileLink)) {
                let fileLink = res.content.fileLink;
                var win = window.open(fileLink, "_blank");
                win.focus();
              } else {
                return Message({
                  message:
                    this.bonus.name.name +
                    " for " +
                    pdata.year +
                    " Payable file not found",
                  type: "error",
                  duration: 5 * 1000
                });
              }
              // this.exportNormalIncentive(res.content);
            }
          });
      }
    },
    exportBonusIncentives(rowData) {
      const tHeader = [
        "Staff ID",
        "Staff Name",
        "Staff IC Number",
        "Staff Email",
        "Staff Phone Number",
        "Staff Bank",
        "Staff Other Bank",
        "CIMB Bank Code",
        "Staff Bank Account",
        "Total Payable",
        "Total Payable Exclude Fall"
      ];
      const filterVal = [
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id"
      ];
      const data = this.formatJson(filterVal, rowData);
      const fileName = "normalIncetivePayable";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "Sheet 1",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    getTargetIncentivesData() {
      let countryId = this.target.countryId ? this.target.countryId.id : null;
      let curYear = new Date().getFullYear();
      let pdata = {};
      if (this.isRegionAdmin && !countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      } else if (!this.target.year) {
        return Message({
          message: "Year is required.",
          type: "error",
          duration: 5 * 1000
        });
      } else if (!this.target.name) {
        return Message({
          message: "Incentive name is required.",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        pdata.typeId = this.target.id;
        pdata.year = this.target.year ? this.target.year.id : curYear;
        pdata.incentive_id = this.target.name ? this.target.name.id : null;

        if (this.isRegionAdmin) {
          pdata.countryId = countryId;
        }

        this.$store
          .dispatch(DOWNLOAD_INCENTIVE_PAYABLE_REQUEST, pdata)
          .then(res => {
            if (res.resultCode === 0) {
              if (urlValidate(res.content.fileLink)) {
                let fileLink = res.content.fileLink;
                var win = window.open(fileLink, "_blank");
                win.focus();
              } else {
                return Message({
                  message:
                    this.target.name.name +
                    " for " +
                    pdata.year +
                    " Payable file not found",
                  type: "error",
                  duration: 5 * 1000
                });
              }
              // this.exportNormalIncentive(res.content);
            }
          });
      }
    },
    exportTargetIncentives(rowData) {
      const tHeader = [
        "Staff ID",
        "Staff Name",
        "Staff IC Number",
        "Staff Email",
        "Staff Phone Number",
        "Staff Bank",
        "Staff Other Bank",
        "CIMB Bank Code",
        "Staff Bank Account",
        "Total Payable",
        "Total Payable Exclude Fall"
      ];
      const filterVal = [
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id",
        "id"
      ];
      const data = this.formatJson(filterVal, rowData);
      const fileName = "normalIncetivePayable";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "Sheet 1",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            return convertDateFormat(v[j], "YYYY-MM-DD");
          } else {
            return v[j];
          }
        })
      );
    },
    getCountries() {
      this.isCountriesLoading = true;
      this.$store
        .dispatch(COUNTRY_LIST_REQUEST, { withRegion: false })
        .then(res => {
          if (res.resultCode === 0) {
            this.countries = res.content;
            this.isCountriesLoading = false;
          } else {
            this.isCountriesLoading = false;
          }
        });
    }
  },
  mounted() {
    this.countryId = this.$store.getters.getCountryId;
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.getMonths();
    this.getYears();

    this.getCountries();

    if (!this.isRegionAdmin) {
      this.getBonusIncentives();
      this.getTargetIncetives();
    }
  }
};
</script>
