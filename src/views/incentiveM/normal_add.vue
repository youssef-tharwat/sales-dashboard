<template>
  <div id="incentive-target-add">
    <Breadcrumb
      title="Dashboard"
      subtitle="Normal Incentive"
      sub-sub-title="Add Normal Incentive"
    ></Breadcrumb>
    <div class="row lnv-main-card">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <form @submit.prevent="handleSubmit">
                <div class="row">
                  <div class="col-lg-12 mb-sm-3">
                    <label class="text-label">Normal Incentive Name</label>
                    <input
                      id="Incentive Name"
                      v-model="incentiveNormal.name"
                      v-validate="'required'"
                      type="text"
                      class="form-control mb-2"
                      name="Incentive Name"
                    />
                    <span class="invalid-field mt-2">{{
                      errors.first("Incentive Name")
                    }}</span>
                  </div>
                  <div class="col-lg-12 mb-sm-3">
                    <label class="text-label">Region</label>
                    <div class="d-flex align-items-center">
                      <div class="w-100">
                        <Multiselect
                          v-model="regionsSelected"
                          v-validate="'required'"
                          placeholder="Select Region"
                          name="Region"
                          :searchable="true"
                          :options="dealerOutlets"
                          :close-on-select="false"
                          :multiple="true"
                          track-by="region"
                          label="region"
                          :open-direction="'bottom'"
                          :loading="dealerOutletsIsLoading"
                          :disabled="dealerOutletsIsLoading"
                          select-label
                          deselect-label
                          @input="filterStates"
                          @remove="regionRemoved"
                        ></Multiselect>
                        <span class="invalid-field mt-2">{{
                          errors.first("Region")
                        }}</span>
                        <span
                          v-if="incentiveNormalErrors.region"
                          class="invalid-field mt-2"
                        >
                          {{ incentiveNormalErrors.region }}
                        </span>
                      </div>
                      <div class="ml-5">
                        <button
                          type="button"
                          :disabled="dealerOutletsIsLoading"
                          class="btn btn-sm btn-primary"
                          @click="
                            selectAll('region');
                            filterStates();
                          "
                        >
                          Select All
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 mb-sm-3">
                    <label class="text-label">State</label>
                    <div class="d-flex align-items-center">
                      <div class="w-100">
                        <Multiselect
                          v-model="statesSelected"
                          v-validate="'required'"
                          placeholder="Select State"
                          name="State"
                          :searchable="true"
                          :options="statesList"
                          :close-on-select="false"
                          :multiple="true"
                          track-by="state"
                          label="state"
                          :open-direction="'bottom'"
                          :loading="dealerOutletsIsLoading"
                          :disabled="
                            dealerOutletsIsLoading || regionsSelected <= 0
                          "
                          select-label
                          deselect-label
                          @input="filterOutlet"
                          @remove="stateRemoved"
                        ></Multiselect>
                        <span class="invalid-field mt-2">{{
                          errors.first("State")
                        }}</span>
                        <span
                          v-if="incentiveNormalErrors.state"
                          class="invalid-field mt-2"
                        >
                          {{ incentiveNormalErrors.state }}
                        </span>
                      </div>
                      <div class="ml-5">
                        <button
                          type="button"
                          :disabled="
                            dealerOutletsIsLoading || regionsSelected <= 0
                          "
                          class="btn btn-sm btn-primary"
                          @click="
                            selectAll('state');
                            filterOutlet();
                          "
                        >
                          Select All
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12 mb-sm-3">
                    <label class="text-label">Outlets*</label>
                    <div class="d-flex align-items-center">
                      <div
                        class="w-100"
                        @click="
                          statesSelected.length > 0 ? outletModalToggle() : ''
                        "
                      >
                        <div>
                          <Multiselect
                            v-model="outletsSelected"
                            v-validate="'required'"
                            placeholder="Select Outlet"
                            name="Outlets"
                            :searchable="false"
                            :options="outletList"
                            :close-on-select="false"
                            :multiple="true"
                            track-by="state"
                            label="state"
                            :open-direction="'bottom'"
                            :loading="dealerOutletsIsLoading"
                            :disabled="true"
                            class="mb-3"
                            select-label
                            deselect-label
                          >
                            <template
                              slot="selection"
                              slot-scope="{ values, search, isOpen }"
                            >
                              <span
                                v-if="values.length &amp;&amp; !isOpen"
                                class="multiselect__single"
                              >{{ values.length }} options selected</span>
                            </template>
                          </Multiselect>
                          <span class="invalid-field mt-2">{{
                            errors.first("Outlets")
                          }}</span>
                          <span
                            v-if="incentiveNormalErrors.outlets"
                            class="invalid-field mt-2"
                          >
                            {{ incentiveNormalErrors.outlets }}
                          </span>
                        </div>
                        <div>
                          <span class="invalid-field mt-2">
                            {{ errors.first("outlets") }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-5">
                        <button
                          type="button"
                          :disabled="
                            dealerOutletsIsLoading || statesSelected.length <= 0
                          "
                          class="btn btn-sm btn-primary"
                          @click="selectAll('outlet')"
                        >
                          Select All
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 mb-sm-3">
                    <label class="text-label">Start Date*</label>
                    <Datepicker
                      v-model="incentiveNormal.startDate"
                      :minimum-view="'day'"
                      :open-date="today"
                      :maximum-view="'year'"
                      :initial-view="'day'"
                      name="Start Date"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select Start Date"
                      :disabled-dates="disabledDates"
                      class="top mb-2"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">{{
                      errors.first("Start Date")
                    }}</span>
                    <span
                      v-if="incentiveNormalErrors.startDate"
                      class="invalid-field mt-2"
                    >
                      {{ incentiveNormalErrors.startDate }}
                    </span>
                  </div>
                  <div class="col-lg-6 mb-sm-3">
                    <label class="text-label">End Date*</label>

                    <Datepicker
                      v-model="incentiveNormal.endDate"
                      name="End Date"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select End Date"
                      :minimum-view="'day'"
                      :open-date="new Date(incentiveNormal.startDate)"
                      :maximum-view="'year'"
                      :initial-view="'day'"
                      :disabled-dates="disabledDates"
                      class="top mb-2"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">{{
                      errors.first("End Date")
                    }}</span>
                    <span
                      v-if="incentiveNormalErrors.endDate"
                      class="invalid-field mt-2"
                    >
                      {{ incentiveNormalErrors.endDate }}
                    </span>
                  </div>
                  <div class="col-lg-12 d-flex flex-column">
                    <div>
                      <label class="text-label">Incentive List Upload*</label>
                    </div>
                    <div class="d-flex">
                      <div class="d-flex flex-column w-100">
                        <div class="d-flex align-items-center">
                          <div class="w-100">
                            <div class="w-100 d-flex align-items-center">
                              <div class="w-100">
                                <BFormFile
                                  id="file"
                                  ref="file"
                                  v-model="fileUpload"
                                  v-validate="'required'"
                                  name="file"
                                  accept=".xlsx"
                                  size="lg"
                                  class="mb-3 cursor-pointer"
                                  @change="handleFileUpload($event)"
                                ></BFormFile>
                              </div>
                              <div class="ml-4">
                                <button
                                  type="button"
                                  class="btn btn-primary btn-xs"
                                  @click="resetUploadedFile()"
                                >
                                  Reset
                                </button>
                              </div>
                            </div>
                            <div class="mt-3">
                              <span class="invalid-field">{{
                                errors.first("file")
                              }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="mt-2">
                          <button
                            type="button"
                            class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                            @click="doExport()"
                          >
                            Incentive list template
                            <i
                              class="fa fa-info-circle fa-lg"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <button
                      type="submit"
                      class="btn btn-primary pull-right ml-3"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BModal
      ref="outlet-editing-modal"
      size="lg"
      hide-footer
      title="Edit Outlets"
    >
      <div>
        <VueBootstrap4Table
          :classes="classes"
          :rows="outletList"
          :columns="columns"
          :config="config"
          :total-rows="total"
          :selected_items="outletsSelected"
          :show-loader="true"
          @on-change-query="onChangeQuery"
          @refresh-data="getDealerOutlets"
          @on-select-row="outletInput"
          @on-all-select-rows="outletInput"
          @on-unselect-row="outletInput"
          @on-all-unselect-rows="outletInput"
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
            <div class="bold-text">No Outlets Found!</div>
          </template>
        </VueBootstrap4Table>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <button
          type="btn"
          class="btn btn-primary btn-sm"
          @click="outletModalToggle"
        >
          Close
        </button>
      </div>
    </BModal>
  </div>
</template>

<script>
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal, BFormFile } from "bootstrap-vue";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import Multiselect from "vue-multiselect";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import { export_json_to_excel } from "../../utils/Export2Excel";
import XLSX from "xlsx";

import { INCENTIVE_NORMAL_LIST_ADD } from "../../store/modules/incentive/action.js";
import { DEALER_OUTLET_LIST_REQUEST } from "../../store/modules/outlet/actions";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR
} from "../../store/modules/ui/actions";

export default {
  name: "IncnormalAdd",
  components: {
    Datepicker,
    Breadcrumb,
    Multiselect,
    VueBootstrap4Table,
    BModal,
    BFormFile
  },
  data() {
    return {
      config: {
        checkbox_rows: true,
        rows_selectable: true,
        server_mode: false,
        card_title: "Outlets",
        card_mode: false,
        show_refresh_button: true,
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
          name: "id",
          label: "Id",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          uniqueId: true,
          visibility: false
        },
        {
          name: "dealerName",
          label: "Dealer Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "lppCode",
          label: "Dealer LPP Code",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerOutletCode",
          label: "Dealer Outlet Code",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "name",
          label: "Outlet Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "address",
          label: "Outlet Address",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      today: new Date(),
      incentiveNormal: {
        name: "",
        countryId: 21,
        startDate: new Date(),
        endDate: "",
        dealerOutletsId: [],
        excelBase64: ""
      },
      dealerOutletsIsLoading: false,
      dealerOutlets: [],
      regionsSelected: [],
      statesList: [],
      statesSelected: [],
      outletList: [],
      outletsSelected: [],
      disabledDates: {
        to: "", // Disable all dates up to specific date
        from: "" // Disable all dates after specific date
      },
      fileUpload: [],
      submitted: false,
      incentiveNormalErrors: {},
      isRegionAdmin: false,
      tHeader: ["Product Family", "Mtm", "Salesperson/Dealer", "Promoters"],
      filterVal: ["mtmName", "mtmNo", "salesP", "promoter"]
    };
  },
  methods: {
    async getDealerOutlets() {
      this.dealerOutletsIsLoading = true;
      const res = await this.$store.dispatch(DEALER_OUTLET_LIST_REQUEST);
      this.dealerOutlets = await res.content;
      this.dealerOutletsIsLoading = false;
    },
    filterStates() {
      this.statesList = [];
      this.regionsSelected.map(region => {
        this.statesList.push(...region.stateList);
      });
    },
    filterOutlet() {
      this.outletList = [];
      this.statesSelected.map(state => {
        this.outletList.push(
          ...state.dealerOutletList.filter(item => item.status === "ACTIVE")
        );
      });
    },
    async outletInput(outlets) {
      const localOutlets = await outlets.selected_items;
      this.outletsSelected = [];
      // Filtering out deactivated dealers
      this.outletsSelected = [
        ...localOutlets.filter(item => item.status === "ACTIVE")
      ];
    },
    outletModalToggle() {
      this.$refs["outlet-editing-modal"].toggle();
    },
    toggleIncentiveListUploadModal() {
      this.$refs["upload-modal"].toggle("#upload-btn");
    },
    regionRemoved(regionRemoved) {
      if (this.statesSelected.length > 0) {
        const result = this.statesSelected.filter(state => {
          return !regionRemoved.stateList.includes(state);
        });
        this.statesSelected = result;
      }
    },
    stateRemoved(stateRemoved) {
      if (this.outletsSelected.length > 0) {
        const result = this.outletsSelected.filter(outlet => {
          stateRemoved.dealerOutletList.forEach(item => {
            if (item.id !== outlet.id) {
              return true;
            } else {
              return false;
            }
          });
        });

        this.outletsSelected = result;
      }
    },
    selectAll(inputType) {
      if (inputType === "region") {
        this.regionsSelected = [];
        this.regionsSelected = this.dealerOutlets;
        this.filterStates();
      } else if (inputType === "state") {
        this.statesSelected = [];
        this.statesSelected = this.statesList;
      } else if (inputType === "outlet") {
        this.outletsSelected = [];
        this.outletsSelected = this.outletList.filter(
          item => item.status === "ACTIVE"
        );
      }
    },
    dataAdjustmentsAndChecking() {
      // Checking Incentive Normal Start Date before Submitting
      if (
        !this.incentiveNormal.startDate ||
        this.incentiveNormal.startDate === "Invalid date"
      ) {
        this.incentiveNormalErrors.startDate = "Start date is required";
      } else {
        delete this.incentiveNormalErrors.startDate;
        this.incentiveNormal.startDate = moment(
          this.incentiveNormal.startDate
        ).format("YYYY-MM-DD 00:00:00");
      }

      // Checking Incentive Normal End Date before Submitting
      if (
        !this.incentiveNormal.endDate ||
        this.incentiveNormal.endDate === "Invalid date"
      ) {
        this.incentiveNormalErrors.endDate = "End date is required";
      } else {
        delete this.incentiveNormalErrors.endDate;
        this.incentiveNormal.endDate = moment(
          this.incentiveNormal.endDate
        ).format("YYYY-MM-DD 23:59:59");
      }

      // Checking Incentive Normal excel file upload before Submitting
      if (!this.incentiveNormal.excelBase64) {
        this.incentiveNormalErrors.file = "The file field is required";
      }

      // Extracting outlets ids to prepare for submission
      this.incentiveNormal.dealerOutletsId = this.outletsSelected.map(
        outlet => outlet.id
      );
    },
    disablingDates() {
      const date = moment(this.today);
      const month = date.month();
      const year = date.year();

      this.disabledDates.to = new Date(year, month, 1);
    },
    checkDates() {
      if (this.incentiveNormal.startDate && this.incentiveNormal.endDate) {
        let startDate = moment(this.incentiveNormal.startDate).format(
          "YYYY-MM-DD"
        );
        let endDate = moment(this.incentiveNormal.endDate).format("YYYY-MM-DD");

        if (
          !moment(startDate).isSame(endDate) &&
          !moment(startDate).isBefore(endDate)
        ) {
          this.incentiveNormalErrors.startDate =
            "Start date must be before end date";
        } else {
          delete this.incentiveNormalErrors.startDate;
        }

        if (
          !moment(endDate).isSame(startDate) &&
          !moment(endDate).isAfter(startDate)
        ) {
          this.incentiveNormalErrors.endDate =
            "End date must be after or equal to start date";
        } else {
          delete this.incentiveNormalErrors.endDate;
        }
      }
    },
    handleSubmit() {
      this.dataAdjustmentsAndChecking();

      this.$validator.validateAll().then(result => {
        if (result && Object.keys(this.incentiveNormalErrors).length === 0) {
          this.$store.dispatch(NOTIFICATION_REQUEST, {
            message: "Uploading normal incentive"
          });

          this.$store
            .dispatch(INCENTIVE_NORMAL_LIST_ADD, this.incentiveNormal)
            .then(res => {
              this.submitted = true;
              if (res.resultCode === 0) {
                this.$store.dispatch(NOTIFICATION_SUCCESS, {
                  message: "Incentive list Successfully Added."
                });
                this.$router.push("/dashboard/incentive/normal");
              }
            })
            .catch(err => {
              this.$store.dispatch(NOTIFICATION_ERROR, {
                message: err
              });
            });
        }
      });
    },
    resetUploadedFile() {
      this.fileUpload = [];
      // this.$refs["file"].reset();
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getDealerOutlets();
    },
    regionAdminCheck() {
      this.isRegionAdmin = this.$store.getters.isRegionAdmin;
      // TODO decide later regarding this part to keep or remove
      // if (!this.isRegionAdmin && this.$store.getters.getCountryCode == "MY") {
      this.tHeader.push("Blind Bonus");
      //   this.filterVal.push("dealer");
      // }
    },
    checkUploadType(file) {
      let filename = file.split(".").pop();
      if (filename === "xlsx") {
        delete this.incentiveNormalErrors.file;
        return true;
      } else {
        this.incentiveNormalErrors.file = "File type must be .xlsx";
        return false;
      }
    },
    checkFileHeaders(headers) {
      // Normalizing column heads for comparision
      const formattedHeaders = JSON.stringify(headers);
      const formattedTheader = JSON.stringify(this.tHeader);

      return formattedHeaders === formattedTheader;
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(btoa(reader.result));
        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
      });
    },
    handleFileUpload(event) {
      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Validating file..."
      });

      const file = event.target.files[0];

      if (this.checkUploadType(file.name)) {
        this.getBase64(file).then(data => {
          var workbook = XLSX.read(data, { type: "base64" });
          var first_sheet_name = workbook.SheetNames[0];

          // Get worksheet
          let worksheet = workbook.Sheets[first_sheet_name];
          const sheet = XLSX.utils.sheet_to_json(worksheet, {
            raw: true,
            blankrows: true,
            header: this.tHeader
          });
          //Validating file upload columns
          if (sheet.length > 0) {
            if (this.checkFileHeaders(Object.keys(sheet[0]))) {
              this.incentiveNormal.excelBase64 = data;
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: "File validation completed successfully",
                timeOut: true
              });
            } else {
              this.$store.dispatch(NOTIFICATION_ERROR, {
                message:
                  "File format incorrect. Please use provided incentive list template"
              });
            }
          } else {
            this.$store.dispatch(NOTIFICATION_ERROR, {
              message: "No data in file!"
            });
          }
        });
      }
    },
    doExport() {
      const data = "";
      const fileName = "incentiveNormalExample";
      export_json_to_excel({
        header: this.tHeader,
        data,
        filename: fileName,
        sheetName: "incentiveNormalExample",
        autoWidth: true,
        bookType: "xlsx"
      });
    }
  },
  mounted() {
    this.getDealerOutlets();
    this.regionAdminCheck();
    this.disablingDates();
  }
};
</script>
