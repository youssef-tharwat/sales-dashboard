<template>
  <div id="incentive-target-edit">
    <breadcrumb
      title="Dashboard"
      subtitle="Target Incentive"
      sub-sub-title="Edit Target Incentive"
    ></breadcrumb>
    <div class="row lnv-main-card">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <form>
                <div class="row mb-4 mt-2">
                  <div class="col-12">
                    <div class="mt-5">
                      <h4 class="text-center">
                        {{
                          isSingleAccu
                            ? "Target Incentive Single Accumulative"
                            : isMultipleAccu
                              ? "Target Incentive Multiple Accumulative"
                              : "Target Incentive"
                        }}
                      </h4>
                    </div>
                  </div>
                </div>

                <div class="row form-group">
                  <div class="col-12 mb-4">
                    <label class="text-label">Incentive Target Name*</label>
                    <input
                      v-model="incentiveTarget.name"
                      v-validate="'required'"
                      type="text"
                      name="Incentive Target Name"
                      class="form-control"
                      :diabled="!incentiveTarget"
                    />
                    <span class="invalid-field mt-2">
                      {{ errors.first("Incentive Target Name") }}
                    </span>
                  </div>

                  <div class="col-12 mb-4">
                    <div class>
                      <label class="text-label">Target Type*</label>
                      <multiselect
                        v-model="incentiveTarget.type"
                        v-validate="'required'"
                        placeholder="Select Target Type"
                        name="Target Type"
                        :searchable="false"
                        :options="targetTypes"
                        :open-direction="'bottom'"
                        :disabled="true"
                        :loading="!incentiveTarget.type || !targetTypes"
                        select-label
                        deselect-label
                      ></multiselect>
                    </div>
                    <span class="invalid-field mt-2 mb-2">{{
                      errors.first("Target Type")
                    }}</span>
                  </div>

                  <div class="col-6 mb-4">
                    <label class="text-label">Start Date*</label>
                    <Datepicker
                      v-model="incentiveTarget.startDate"
                      v-validate="'required'"
                      :minimum-view="'day'"
                      :open-date="today"
                      :maximum-view="'year'"
                      :initial-view="'day'"
                      name="Start Date"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select Start Date"
                      :disabled-dates="disabledDates"
                      :disabled="!incentiveTarget.startdate"
                      class="top"
                      @closed="checkDates"
                    ></Datepicker>
                    <span class="invalid-field mt-2">{{
                      errors.first("Start Date")
                    }}</span>
                    <span
                      v-if="incentiveTargetErrors.startDate"
                      class="invalid-field mt-2"
                    >
                      {{ incentiveTargetErrors.startDate }}
                    </span>
                  </div>

                  <div class="col-6 mb-4">
                    <label class="text-label">End Date*</label>
                    <Datepicker
                      v-model="incentiveTarget.endDate"
                      v-validate="'required'"
                      name="End Date"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select End Date"
                      :minimum-view="'day'"
                      :open-date="new Date(incentiveTarget.startDate)"
                      :maximum-view="'year'"
                      :initial-view="'day'"
                      :disabled-dates="disabledDates"
                      :disabled="!incentiveTarget.endDate"
                      class="top"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">{{
                      errors.first("End Date")
                    }}</span>
                    <span
                      v-if="incentiveTargetErrors.endDate"
                      class="invalid-field mt-2"
                    >
                      {{ incentiveTargetErrors.endDate }}
                    </span>
                  </div>
                </div>
                <div>
                  <div class="row form-group d-flex align-items-center">
                    <div class="col-lg-12 mb-sm-3">
                      <label class="text-label">Dealers</label>
                      <div class="d-flex align-items-center">
                        <div class="w-100">
                          <div>
                            <multiselect
                              v-model="dealers"
                              v-validate="'required'"
                              placeholder="Select Dealer"
                              name="Dealer"
                              :searchable="true"
                              :close-on-select="false"
                              :options="dealersOutlets"
                              label="dealerName"
                              :multiple="true"
                              track-by="id"
                              :open-direction="'bottom'"
                              select-label
                              deselect-label
                              @input="dealersOutletsChecking"
                            ></multiselect>
                          </div>
                          <div>
                            <span class="invalid-field mt-2">
                              {{ errors.first("Dealer") }}
                            </span>
                            <span
                              v-if="incentiveTargetErrors.dealer"
                              class="invalid-field mt-3"
                            >{{ incentiveTargetErrors.dealer }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-5">
                          <button
                            type="button"
                            class="btn btn-sm"
                            @click="selectAllDealers"
                          >
                            Select all
                          </button>
                        </div>
                      </div>
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
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-12 d-flex flex-column">
                      <div>
                        <label class="text-label mb-0">Incentive List Actions</label>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="mr-4">
                          <button
                            type="button"
                            class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                            @click="doExport()"
                          >
                            Incentive list Download
                            <i
                              class="fa fa-download fa-lg"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                        <div class="mr-4">
                          <button
                            type="button"
                            class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                            @click="incentivePreviewModalToggle"
                          >
                            Incentive list Preview
                            <i
                              class="fa fa-search fa-lg"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                            @click="rulesModalToggle"
                          >
                            Incentive List Edit Rules
                            <i class="fa fa-edit fa-lg" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <BModal
                    ref="rules-editing-modal"
                    size="lg"
                    hide-footer
                    title="Edit Incentive List Rules"
                  >
                    <div class="row mt-3">
                      <div class="col-12 text-center">
                        <h4>Target Incentive Rules</h4>
                      </div>
                      <div class="col-12 mb-4 d-flex align-items-center">
                        <div class="d-flex flex-column mr-5 mt-4">
                          <div class="mr-4">
                            <div class="d-flex flex-column">
                              <label for>Target in unit</label>
                              <input
                                v-model="tiersArray[0].targetUnit"
                                v-validate="'required|integer'"
                                type="text"
                                name="Target"
                                class="form-control mb-3"
                              />
                              <div>
                                <span class="invalid-field mt-2">{{
                                  errors.first("Target")
                                }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="mr-4">
                            <div
                              v-if="isSingleAccu"
                              class="d-flex flex-column mt-4"
                            >
                              <label for>Reward in Monetary</label>
                              <input
                                v-model="tiersArray[0].rewardAmount"
                                v-validate="'required'"
                                type="number"
                                name="Reward"
                                class="form-control"
                              />
                              <div>
                                <span class="invalid-field mt-2">{{
                                  errors.first("Reward")
                                }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                      <button
                        type="btn"
                        class="btn btn-primary btn-sm"
                        @click="rulesModalToggle"
                      >
                        Close
                      </button>
                    </div>
                  </BModal>
                  <BModal
                    ref="incentive-preview-modal"
                    size="lg"
                    hide-footer
                    title="Preview Incentive List"
                  >
                    <div>
                      <VueBootstrap4Table
                        :classes="classes"
                        :rows="filterVal"
                        :columns="columnsIncentiveList"
                        :config="incentivePreviewConfig"
                        :total-rows="filterVal.length"
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
                          <div class="bold-text">No incentives Found!</div>
                        </template>
                      </VueBootstrap4Table>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                      <button
                        type="btn"
                        class="btn btn-primary btn-sm"
                        @click="incentivePreviewModalToggle"
                      >
                        Close
                      </button>
                    </div>
                  </BModal>
                </div>
                <div class="row mt-3">
                  <div class="col-12">
                    <button
                      type="button"
                      class="btn btn-primary pull-right ml-3"
                      @click.prevent="handleSubmit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal, BFormFile } from "bootstrap-vue";

import breadcrumb from "../../components/breadcrumb/breadcrumb";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import multiselect from "vue-multiselect";
import XLSX from "xlsx";
import { export_json_to_excel } from "../../utils/Export2Excel";

import {
  INCENTIVE_TARGET_UPDATE,
  INCENTIVE_TARGET_GET_BY_ID,
  INCENTIVE_TARGET_UTILITY_REQUEST
} from "../../store/modules/incentive/action";

import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR
} from "../../store/modules/ui/actions";

export default {
  name: "InctargetEdit",
  components: {
    Datepicker,
    breadcrumb,
    multiselect,
    VueBootstrap4Table,
    BModal,
    BFormFile
  },
  computed: {
    inputType() {
      if (this.incentiveTarget.rewardType == "Monetary") {
        return "number";
      } else {
        return "text";
      }
    },
    startDateDisabled() {
      if (this.today > new Date(this.incentiveTarget.startDate)) {
        return true;
      } else {
        return false;
      }
    },
    isAccu() {
      if (
        this.incentiveTarget.type == "SINGLE_REWARD_ACC" ||
        this.incentiveTarget.type == "MULTI_REWARD_ACC"
      ) {
        return true;
      } else {
        return false;
      }
    },
    isSingleAccu() {
      if (this.incentiveTarget.type == "SINGLE_REWARD_ACC") {
        return true;
      } else {
        return false;
      }
    },
    isMultipleAccu() {
      if (this.incentiveTarget.type == "MULTI_REWARD_ACC") {
        return true;
      } else {
        return false;
      }
    },
    fileName(formatDate) {
      formatDate =
        "target-inc-" + moment(this.incentiveTarget.startDate).format("MM-YY");
      return formatDate;
    }
  },
  isSingleTargetType() {
    if (
      this.incentiveTarget.type == "SINGLE_REWARD_NON_ACC" ||
      this.incentiveTarget.type == "SINGLE_REWARD_ACC"
    ) {
      return true;
    } else {
      return false;
    }
  },
  data() {
    return {
      config: {
        checkbox_rows: true,
        rows_selectable: true,
        server_mode: false,
        card_title: "Dealers",
        card_mode: false,
        show_refresh_button: true,
        show_reset_button: true,
        num_of_visible_pagination_buttons: 5,
        per_page_options: [10, 25, 50, 100],
        per_page: 10,
        preservePageOnDateChange: true,
        pagination: true,
        pagination_info: true,
        multi_column_sort: false,
        global_search: {
          placeholder: "Search keyword",
          visibility: true,
          case_sensitive: false
        },

        higlight_row_hover_color: "grey"
      },
      incentivePreviewConfig: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Incentives",
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
          name: "dealerInfo",
          label: "Dealer Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      columnsIncentiveList: [],
      total: 0,
      step: 0,
      today: new Date(),
      targetTypes: [],
      dealersOutlets: [],
      dealerOutletsIsLoading: false,
      dealers: "",
      products: [],
      productsubGroups: [],
      mtmsArray: [],
      tiersArray: [],
      tiersCount: 0,
      fileUpload: [],
      disabledDates: {
        to: "", // Disable all dates up to specific date
        from: "" // Disable all dates after specific date
      },
      submitted: false,
      incentiveTargetErrors: {},
      incentiveTarget: {
        id: "",
        countryId: 21,
        name: "",
        dealerId: [],
        type: "",
        roleId: 20,
        startDate: new Date(),
        endDate: "",
        tierList: []
      },
      tHeader: [],
      filterVal: [],
      filterValNames: []
    };
  },

  methods: {
    gettargetIncentive() {
      const targetId = this.$route.params.id;
      this.$store
        .dispatch(INCENTIVE_TARGET_GET_BY_ID, { id: targetId })
        .then(res => {
          if (res.resultCode === 0) {
            this.incentiveTarget = res.content;
            this.dealers = this.incentiveTarget.dealerObjects;
            this.dataTransfer();
          }
        });
    },
    async getTargetUtility() {
      const res = await this.$store.dispatch(INCENTIVE_TARGET_UTILITY_REQUEST);
      if (res.resultCode === 0) {
        // change back to targetTypes
        this.targetTypes = await res.content.targetTypes;
        let dealersOutlets = await res.content.dealers;
        this.dealersOutlets = dealersOutlets.filter(dealer => {
          return dealer.status == "ACTIVE";
        });
      }
    },
    selectAllDealers() {
      this.dealers = [...this.dealersOutlets];
      this.dealersOutletsChecking();
    },
    dealersOutletsChecking() {
      this.incentiveTarget.outlets = [];
      this.dealers.forEach(item => {
        item.outletList.forEach(outletObject => {
          this.incentiveTarget.outlets.push(outletObject);
        });
      });
    },
    incentivePreviewModalToggle() {
      this.$refs["incentive-preview-modal"].toggle();
    },
    rulesModalToggle() {
      this.$refs["rules-editing-modal"].toggle();
    },
    addRule() {
      if (this.tiersCount < 5) {
        let tier = {
          tierLevel: this.tiersArray.length,
          targetUnit: "",
          rewardAmount: "",
          modelTargetUnitList: [...this.mtmsArray]
        };
        this.tiersArray.push(tier);
      }
    },
    tierCounter(index) {
      return index + 1;
    },
    removeRule() {
      this.tiersArray.pop();
      this.tiersCount--;
    },
    dateAdjustmentsAndChecking() {
      if (
        !this.incentiveTarget.startDate ||
        this.incentiveTarget.startDate === "Invalid date"
      ) {
        this.incentiveTargetErrors.startDate = "Start date is required";
      } else {
        delete this.incentiveTargetErrors.startDate;
        this.incentiveTarget.startDate = moment(
          this.incentiveTarget.startDate
        ).format("YYYY-MM-DD 00:00:00");
      }

      if (
        !this.incentiveTarget.endDate ||
        this.incentiveTarget.endDate === "Invalid date"
      ) {
        this.incentiveTargetErrors.endDate = "End date is required";
      } else {
        delete this.incentiveTargetErrors.endDate;
        this.incentiveTarget.endDate = moment(
          this.incentiveTarget.endDate
        ).format("YYYY-MM-DD 23:59:59");
      }
    },
    disablingDates() {
      const date = moment(this.today);
      const month = date.month();
      const year = date.year();

      this.disabledDates.to = new Date(year, month, 1);
    },
    checkDates() {
      const startDate = moment(this.incentiveTarget.startDate).format(
        "YYYY-MM-DD"
      );
      const endDate = moment(this.incentiveTarget.endDate).format("YYYY-MM-DD");

      if (
        !moment(startDate).isSame(endDate) &&
        !moment(startDate).isBefore(endDate)
      ) {
        this.incentiveTargetErrors.startDate =
          "Start date must be before end date";
      } else {
        delete this.incentiveTargetErrors.startDate;
      }

      if (
        !moment(endDate).isSame(startDate) &&
        !moment(endDate).isAfter(startDate)
      ) {
        this.incentiveTargetErrors.endDate =
          "End date must be after or equal to start date";
      } else {
        delete this.incentiveTargetErrors.endDate;
      }
    },

    dataTransfer() {
      // Mtms and Tiers adjustment
      const adjustedArray = JSON.parse(
        JSON.stringify(this.incentiveTarget.tierList)
      );

      const mtms = JSON.parse(
        JSON.stringify(adjustedArray[0].modelTargetUnitList)
      );

      this.tiersArray = adjustedArray;
      this.mtmsArray = mtms;

      // Tiers counter setting
      const tiersLength = this.tiersArray.length;
      this.tiersCount = tiersLength;
      this.adJustFileHeaders();
    },
    dataAdjustmentAfterFileUpload(sheet) {
      // TODO Accumatlive type is left to be handeled
      if (this.isSingleAccu) {
        this.tiersArray.forEach(item => {
          item.modelTargetUnitList = sheet.map(item => {
            item.mtmNo = item.Mtm;
            return item;
          });
        });
      } else {
        this.tiersArray.forEach(item => {
          item.modelTargetUnitList = sheet.map(item => {
            item.mtmNo = item.Mtm;
            item.rewardAmount = item.Reward;
            return item;
          });
        });
      }
    },
    dataAdjustmentBeforeSubmission() {
      const adjustedArray = JSON.parse(JSON.stringify(this.tiersArray));
      this.incentiveTarget.tierList = adjustedArray;

      if (!this.isSingleAccu) {
        this.incentiveTarget.tierList.forEach(item => {
          item.modelTargetUnitList.forEach(item2 => {
            if (item2.targetUnit) {
              item2.targetUnit = item2.targetUnit[item.tierLevel];
            }
          });
        });
      } else if (this.isSingleAccu) {
        this.incentiveTarget.tierList.forEach(item => {
          item.modelTargetUnitList.forEach(item2 => {
            if (item2.targetUnit) {
              item2.targetUnit = item.targetUnit;
            }
          });
        });
      }

      this.incentiveTarget.dealerId = this.dealers.map(obj => obj.id);
    },
    handleSubmit() {
      this.$validator.validateAll().then(result => {
        this.dateAdjustmentsAndChecking();
        if (result && Object.keys(this.incentiveTargetErrors).length === 0) {
          this.dataAdjustmentBeforeSubmission();
          this.$store
            .dispatch(INCENTIVE_TARGET_UPDATE, this.incentiveTarget)
            .then(res => {
              this.submitted = true;
              if (res.resultCode === 0) {
                // this.stepIncrement();
                this.$router.push("/dashboard/incentive/target");
                this.$store.dispatch(NOTIFICATION_SUCCESS, {
                  message: "Target Incentive Successfully Added",
                  timeOut: true
                });
              }
            });
        }
      });
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

      // Validating file upload extension
      if (this.checkUploadType(file.name)) {
        this.getBase64(file).then(data => {
          var workbook = XLSX.read(data, { type: "base64" });
          var first_sheet_name = workbook.SheetNames[0];

          // Get worksheet
          let worksheet = workbook.Sheets[first_sheet_name];
          const sheet = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          //Validating file upload columns
          if (sheet.length > 0) {
            if (this.checkFileHeaders(Object.keys(sheet[0]))) {
              this.dataAdjustmentAfterFileUpload(sheet);

              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: "File validation completed successfully",
                timeOut: true
              });
            } else {
              this.resetUploadedFile();
              this.$store.dispatch(NOTIFICATION_ERROR, {
                message:
                  "File format incorrect. Please use provided incentive list template"
              });
            }
          } else {
            this.resetUploadedFile();
            this.$store.dispatch(NOTIFICATION_ERROR, {
              message: "No data in file!"
            });
          }
        });
      }
    },
    adJustFileHeaders() {
      this.filterValNames = [];
      this.columnsIncentiveList = [];
      if (this.isSingleAccu) {
        this.tHeader = ["Mtm"];
        this.filterVal = this.mtmsArray;
        this.filterValNames.push("mtmNo");
        this.columnsIncentiveList.push({
          name: "mtmNo",
          label: "Mtm Number",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        });
      } else {
        this.tHeader = ["Mtm", "Reward"];
        this.filterVal = this.tiersArray[0].modelTargetUnitList;
        this.filterValNames.push("mtmNo", "rewardAmount");
        this.columnsIncentiveList.push(
          {
            name: "mtmNo",
            label: "Mtm Number",
            sort: true,
            row_text_alignment: "text-left",
            column_text_alignment: "text-left"
          },
          {
            name: "rewardAmount",
            label: "Reward",
            sort: true,
            row_text_alignment: "text-left",
            column_text_alignment: "text-left"
          }
        );
      }
    },
    adjustTiersArray() {
      if (this.isSingleAccu) {
        this.tiersArray = [];
        this.addRule();
      }
    },

    checkFileHeaders(headers) {
      // Normalizing column heads for comparision
      const formattedHeaders = JSON.stringify(headers);
      const formattedTheader = JSON.stringify(this.tHeader);

      return formattedHeaders === formattedTheader;
    },
    checkUploadType(fileName) {
      if (fileName) {
        let filename = fileName.split(".").pop();
        if (filename === "xlsx") {
          delete this.incentiveTargetErrors.file;
          return true;
        } else {
          this.incentiveTargetErrors.file = "File type must be .xlsx";
          return false;
        }
      }
    },
    resetUploadedFile() {
      this.$refs["file"].reset();
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.filterOutlet();
    },
    toggleModalAddMtm() {
      this.$refs["add-mtm-modal"].toggle();
    },
    doExport() {
      let data = this.formatJson(this.filterValNames, this.filterVal);
      export_json_to_excel({
        header: this.tHeader,
        data,
        filename: this.fileName,
        sheetName: this.fileName,
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  },
  mounted() {
    this.getTargetUtility();
    this.gettargetIncentive();
    this.disablingDates();
    // this.addRule();
  }
};
</script>
<style lang="scss">
#app {
  overflow-x: auto;
  #targetAddTable {
    th {
      white-space: nowrap;
      vertical-align: middle;
    }
  }
  .targetIncentive__multiple__editBtn {
    cursor: pointer;
  }
}
</style>
