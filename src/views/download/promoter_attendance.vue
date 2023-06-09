<template>
  <div id="promoter-attendance-download">
    <breadcrumb
      title="Dashboard"
      subtitle="Download"
      sub-sub-title="Promoter Attendance"
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
                      v-text="$ml.get('att_title_country')"
                    ></label>
                    <Multiselect
                      ref="multiselect-country"
                      v-model="search.countryId"
                      placeholder="Select Country"
                      :searchable="true"
                      :options="countries"
                      label="text"
                      :loading="isCountriesLoading"
                      track-by="id"
                      select-label
                      deselect-label
                    ></Multiselect>
                  </div>
                </div>

                <div
                  :class="{
                    'col-lg-12': !isRegionAdmin,
                    'col-lg-6': isRegionAdmin
                  }"
                >
                  <div class="form-group flex-grow-1">
                    <label
                      class="text-label"
                      v-text="$ml.get('att_title_period')"
                    ></label>
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
                      @update="
                        updateDateValues();
                        searchAttendanceData(0);
                      "
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
                      @click="searchAttendanceData(1)"
                    >
                      <i class="fa fa-download"></i>
                      <span v-text="$ml.get('button_download_text')"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="row">
                <div
                  class="col-lg-12 promoterAttendanceTheaderNoWrap"
                  style="width: 1px;"
                >
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="dataList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                  >
                    <template slot="sort-asc-icon">
                      <i class="mdi mdi-sort-ascending"></i>
                    </template>
                    <template slot="sort-desc-icon">
                      <i class="mdi mdi-sort-descending"></i>
                    </template>
                    <template slot="no-sort-icon">
                      <i class="mdi mdi-sort-variant"></i>
                    </template>
                    <template slot="empty-results">
                      <div
                        class="bold-text"
                        v-text="$ml.get('no_data_found')"
                      ></div>
                    </template>

                    <template slot="stacked" slot-scope="props">
                      <ol class="pl-5">
                        <li class="whitespace-no-wrap">
                          <strong>ID:</strong>
                          {{ props.row.id }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>Promoter:</strong>
                          {{ props.row.promoterName }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>Promoter Type:</strong>
                          {{
                            props.row.promoterTypeName
                              ? props.row.promoterTypeName
                              : "-"
                          }}
                        </li>
                        <!-- <li class="whitespace-no-wrap">
                          <strong>User ID Number:</strong>
                          {{ props.row.promoterId ? props.row.promoterId : "-" }}
                        </li> -->
                        <li class="whitespace-no-wrap">
                          <strong>Dealer:</strong>
                          {{ props.row.dealerName }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>LPP Code:</strong>
                          {{ props.row.lppCode }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>Outlet:</strong>
                          {{ props.row.outletName }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>Outlet Code:</strong>
                          {{ props.row.outletCode }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>Country:</strong>
                          {{ props.row.country }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>Region:</strong>
                          {{ props.row.region }}
                        </li>
                        <li class="whitespace-no-wrap">
                          <strong>State:</strong>
                          {{ props.row.state }}
                        </li>
                      </ol>
                    </template>

                    <template slot="distance" slot-scope="props">
                      <ul>
                        <li>
                          <strong>CI:</strong>
                          {{ props.row.checkInDistance }}
                        </li>
                        <li>
                          <strong>CO:</strong>
                          {{ props.row.checkOutDistance }}
                        </li>
                      </ul>
                    </template>

                    <template slot="checkInDateTime" slot-scope="props">
                      <span v-if="props.row.checkInDateTime">{{
                        changeDateFormat(
                          props.row.checkInDateTime,
                          "YYYY-MM-DD hh:mm A"
                        )
                      }}</span>
                    </template>

                    <template slot="checkOutDateTime" slot-scope="props">
                      <span v-if="props.row.checkOutDateTime">{{
                        changeDateFormat(
                          props.row.checkOutDateTime,
                          "YYYY-MM-DD HH:mm A"
                        )
                      }}</span>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="defaultTime" slot-scope="props">
                      <ul>
                        <li>
                          <strong>CI:</strong>
                          {{ props.row.defaultCheckInTime }}
                        </li>
                        <li>
                          <strong>CO:</strong>
                          {{ props.row.defaultCheckOutTime }}
                        </li>
                      </ul>
                    </template>

                    <template slot="location" slot-scope="props">
                      <ul>
                        <li>
                          <div
                            class="d-flex align-items-center whitespace-no-wrap"
                          >
                            <strong>CI:</strong>
                            <div
                              v-if="props.row.checkInCoordinate"
                              class="ml-3 clickable"
                              @click="toggleCiModal"
                            >
                              <i class="fa fa-map-marker"></i>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div
                            class="d-flex align-items-center whitespace-no-wrap"
                          >
                            <strong>CO:</strong>
                            <div
                              v-if="props.row.checkOutCoordinate"
                              class="ml-3 clickable"
                              @click="toggleCoModal"
                            >
                              <i class="fa fa-map-marker"></i>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <BModal
                        v-if="props.row.checkInCoordinate"
                        ref="ci-location"
                        size="lg"
                        hide-footer
                        title="Check-in Location"
                      >
                        <GmapMap
                          style="width: 100%; height: 300px"
                          :zoom="17"
                          :center="{
                            lat: latGetter(props.row.checkInCoordinate),
                            lng: lngGetter(props.row.checkInCoordinate)
                          }"
                        >
                          <GmapMarker
                            v-if="props.row.checkInCoordinate"
                            label="★"
                            :position="{
                              lat: latGetter(props.row.checkInCoordinate),
                              lng: lngGetter(props.row.checkInCoordinate)
                            }"
                          />
                        </GmapMap>
                      </BModal>
                      <BModal
                        v-if="props.row.checkOutCoordinate"
                        ref="co-location"
                        size="lg"
                        hide-footer
                        title="Check-out Location"
                      >
                        <GmapMap
                          style="width: 100%; height: 300px"
                          :zoom="17"
                          :center="{
                            lat: latGetter(props.row.checkOutCoordinate),
                            lng: lngGetter(props.row.checkOutCoordinate)
                          }"
                        >
                          <GmapMarker
                            label="★"
                            :position="{
                              lat: latGetter(props.row.checkOutCoordinate),
                              lng: lngGetter(props.row.checkOutCoordinate)
                            }"
                          />
                        </GmapMap>
                      </BModal>
                    </template>

                    <template slot="checkInPhotoUrl" slot-scope="props">
                      <div v-viewer class="media-img-container mr-3">
                        <img
                          class="img-fluid media-img"
                          :src="props.cell_value"
                          alt="Leader"
                        />
                      </div>
                    </template>
                  </VueBootstrap4Table>
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
import { convertDateFormat } from "../../utils/helpers";
import { export_json_to_excel } from "../../utils/Export2Excel";
import DateRangePicker from "../../components/ui/vue2-daterange-picker";
import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { DOWNLOAD_PROMOTER_ATTENDANCE_REQUEST } from "../../store/modules/download/actions";
import { Message } from "element-ui";
import Multiselect from "vue-multiselect";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";

const today = new Date();

export default {
  name: "PromoterAttDPage",
  components: {
    breadcrumb: breadcrumb,
    DateRangePicker: DateRangePicker,
    Multiselect: Multiselect,
    VueBootstrap4Table: VueBootstrap4Table,
    BModal: BModal
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
      isCountriesLoading: false,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Attendance",
        card_mode: false,
        show_refresh_button: false,
        show_reset_button: false,
        num_of_visibile_pagination_buttons: 5,
        per_page_options: [10, 25, 50, 100],
        per_page: 10,
        preservePageOnDataChange: true,
        pagination: true,
        pagination_info: true,
        multi_column_sort: false,
        global_search: {
          placeholder: "Search keyword",
          visibility: true,
          case_sensitive: false
        },
        highlight_row_hover_color: "grey"
      },
      queryParams: {
        sort: [],
        filters: [],
        global_search: "",
        per_page: 10,
        page: 1
      },
      classes: {
        tableWrapper: "table-responsive",
        table: {
          "table table-bordered": true,
          "table-bordered": function() {
            return true;
          }
        },
        row: {},
        cell: {}
      },
      columns: [
        {
          name: "stacked",
          label: "",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "checkInDateTime",
          label: "CI Date Time",
          sort: true
        },
        {
          name: "checkOutDateTime",
          label: "CO Date Time",
          sort: true
        },
        {
          name: "workingDuration",
          label: "Work Duration",
          sort: true
        },
        {
          name: "distance",
          label: "Distance",
          sort: true
        },
        {
          name: "defaultTime",
          label: "Default Time",
          sort: true
        },
        {
          name: "lateCheckInDuration",
          label: "Late CI Duration",
          sort: true
        },
        {
          name: "earlyCheckOutDuration",
          label: "Early CO Duration",
          sort: true
        },
        {
          name: "location",
          label: "Location",
          sort: true
        },
        {
          name: "checkInPhotoUrl",
          label: "CI Photo",
          sort: true
        }
      ]
    };
  },
  methods: {
    changeDateFormat(date, format) {
      return convertDateFormat(date, format);
    },
    downloadAttendanceData() {},
    async searchAttendanceData(doDownload) {
      this.dataList = [];
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");
      let countryId = this.search.countryId ? this.search.countryId.id : null;

      let pData = {
        startDate: startDate,
        endDate: endDate,
        countryId: countryId
      };

      if (this.isRegionAdmin && !countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      }

      this.$store
        .dispatch(DOWNLOAD_PROMOTER_ATTENDANCE_REQUEST, pData)
        .then(res => {
          if (res.resultCode === 0) {
            // this.dataList = res.content;
            this.total = this.dataList.length;

            res.content.forEach(d => {
              let row = d;
              row.checkInDate = d.checkInDateTime;
              row.checkOutDate = d.checkOutDateTime;

              this.dataList.push(row);
            });

            this.total = this.dataList.length;
            if (doDownload === 1) {
              this.exportExcel(this.dataList, pData);
            }
          }
        });
    },
    exportExcel(exdata, post) {
      const tHeader = [
        "Promoter Name",
        "Promoter Type",
        "User ID Number", //new 20/03/10
        "LPP Code", //new 19/10/02
        "Dealer Name", //new 19/10/02
        "Outlet Code",
        "Outlet Name",
        "Country",
        "Region",
        "State",

        // "Outlet System ID", //new 19/10/02
        // "Lenovo Store ID", //new 19/10/02

        // "Outlet Address",
        "Check-In Date",
        "Check-In Time",
        "Check-Out Date",
        "Check-Out Time",
        "Work Duration",
        "Check-In Distance",
        "Check-Out Distance",
        "Default Check-In Time",
        "Late Check-In Duration",
        "Default Check-Out Time",
        "Early Check-Out Duration",
        "Check-In Coordinate",
        "Check-Out Coordinate",
        "Check-In Photo URL"
      ];
      const filterVal = [
        "promoterName",
        "promoterTypeName",
        "promoterId", //new 20/03/10
        "lppCode", //new 19/10/02
        "dealerName", //new 19/10/02
        "outletCode",
        "outletName",
        "country",
        "region",
        "state",

        // "outletId", // new 19/10/02
        // "storeId", //new 19/10/02

        // "outletAddress",
        "checkInDate",
        "checkInDateTime",
        "checkOutDate",
        "checkOutDateTime",
        "workingDuration",
        "checkInDistance",
        "checkOutDistance",
        "defaultCheckInTime",
        "lateCheckInDuration",
        "defaultCheckOutTime",
        "earlyCheckOutDuration",
        "checkInCoordinate",
        "checkOutCoordinate",
        "checkInPhotoUrl"
      ];
      const data = this.formatJson(filterVal, exdata);
      const fileName =
        "promoterAttendance-" + post.startDate + "-" + post.endDate;

      if (exdata.length <= 0) {
        Message({
          message: "No attendance records found on selected period!",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName,
          sheetName: "Sheet1",
          autoWidth: true,
          bookType: "xlsx"
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "checkInDate" || j === "checkOutDate") {
            if (v[j] !== null) {
              return convertDateFormat(v[j], "YYYY-MM-DD");
            }
            return v[j];
          } else if (j === "checkInDateTime" || j === "checkOutDateTime") {
            if (v[j] !== null) {
              return convertDateFormat(v[j], "h:mm A");
            }
            return v[j];
          } else if (j === "promoterTypeName") {
            if (v[j] === null) {
              return "-";
            }
            return v[j];
          } else {
            return v[j];
          }
        })
      );
    },
    updateDateValues() {},
    formatDate: function(date) {
      return convertDateFormat(String(date), "YYYY-MM-DD");
    },
    formatTime: function(date) {
      return convertDateFormat(String(date), "h:m A");
    },
    getCountries() {
      this.isCountriesLoading = true;
      this.$store.dispatch(COUNTRY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.countries = res.content;
          this.isCountriesLoading = false;
        } else {
          this.isCountriesLoading = false;
        }
      });
    },
    latGetter(coordinates) {
      if (coordinates) {
        return parseFloat(coordinates.split(",")[0]);
      }
    },
    lngGetter(coordinates) {
      if (coordinates) {
        return parseFloat(coordinates.split(",")[1]);
      }
    },
    toggleCiModal() {
      this.$refs["ci-location"].toggle("#toggle-btn");
    },
    toggleCoModal() {
      this.$refs["co-location"].toggle("#toggle-btn");
    }
  },
  mounted() {
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
  },
  created() {
    // this.getNewsList();
  }
};
</script>
<style lang="scss">
.promoterAttendanceTheaderNoWrap {
  .table > thead > tr > th {
    white-space: nowrap !important;
  }
}
</style>
