<template>
  <div id="incentive-target-add">
    <breadcrumb
      title="Dashboard"
      subtitle="Target Incentive"
      sub-sub-title="Add Target Incentive"
    ></breadcrumb>
    <div class="row lnv-main-card">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <form>
                <div class="row mb-4 mt-2">
                  <div class="col-12">
                    <div class="form-group">
                      <b-progress
                        size="is-large"
                        :type="progressBar[step].status"
                        :value="progressBar[step].value"
                        show-value
                        format="percent"
                      ></b-progress>
                    </div>
                    <div v-if="step === 1" class="mt-5">
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

                <div v-if="step === 0" class="row form-group">
                  <div class="col-12 mb-4">
                    <label class="text-label">Incentive Target Name*</label>
                    <input
                      v-model="incentiveTarget.name"
                      v-validate="'required'"
                      type="text"
                      name="Incentive Target Name"
                      class="form-control"
                    />
                    <span class="invalid-field mt-2">{{
                      errors.first("Incentive Target Name")
                    }}</span>
                  </div>

                  <div class="col-12 mb-4">
                    <div class>
                      <label class="text-label">Target Type*</label>
                      <multiselect
                        v-model="incentiveTarget.type"
                        v-validate="'required'"
                        placeholder="Select Target Type"
                        name="target Type"
                        :searchable="false"
                        :options="targetTypes"
                        :open-direction="'bottom'"
                        select-label
                        deselect-label
                      ></multiselect>
                    </div>
                    <span class="invalid-field mt-2 mb-2">
                      {{ errors.first("target Type") }}
                    </span>
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
                      class="top"
                      :disabled-dates="disabledDates"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">
                      {{ errors.first("Start Date") }}
                    </span>
                    <span
                      v-if="incentiveTargetErrors.startDate"
                      class="invalid-field mt-2"
                    >{{ incentiveTargetErrors.startDate }}</span>
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
                      class="top"
                      :disabled-dates="disabledDates"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">
                      {{ errors.first("End Date") }}
                    </span>
                    <span
                      v-if="incentiveTargetErrors.endDate"
                      class="invalid-field mt-2"
                    >{{ incentiveTargetErrors.endDate }}</span>
                  </div>
                </div>

                <div v-if="step === 1">
                  <div class="row form-group d-flex align-items-center">
                    <div class="col-12 mb-4">
                      <label class="text-label">Dealers*</label>
                      <div class="d-flex align-items-center">
                        <div class="w-100">
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

                      <span class="invalid-field mt-2">
                        {{ errors.first("Dealer") }}
                      </span>
                      <span
                        v-if="incentiveTargetErrors.dealer"
                        class="invalid-field mt-3"
                      >{{ incentiveTargetErrors.dealer }}</span>
                    </div>
                  </div>
                  <div class="mt-4 mr-4 d-flex flex-column">
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
                              <span class="invalid-field">
                                {{ errors.first("file") }}
                              </span>
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
                  <div class="row mt-4">
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
                              <span class="invalid-field mt-2">
                                {{ errors.first("Target") }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mr-4">
                      <div v-if="isSingleAccu" class="d-flex flex-column mt-4">
                        <label for>Reward in Monetary</label>
                        <input
                          v-model="tiersArray[0].rewardAmount"
                          v-validate="'required'"
                          type="number"
                          name="Reward"
                          class="form-control"
                        />
                        <div>
                          <span class="invalid-field mt-2">
                            {{ errors.first("Reward") }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-5">
                  <div class="col-12">
                    <button
                      v-if="step === 1"
                      type="button"
                      class="btn btn-primary pull-right ml-3"
                      @click="handleSubmit"
                    >
                      Confirm
                    </button>

                    <button
                      v-if="step != 1"
                      type="button"
                      class="btn btn-primary pull-right ml-3"
                      @click="stepIncrement"
                    >
                      Next
                    </button>

                    <button
                      v-if="step != 0"
                      type="button"
                      class="btn btn-secondary pull-right ml-3"
                      @click="stepDecrement"
                    >
                      Back
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
import { BFormFile } from "bootstrap-vue";
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import multiselect from "vue-multiselect";
import XLSX from "xlsx";
import { export_json_to_excel } from "../../utils/Export2Excel";

import { INCENTIVE_TARGET_ADD } from "../../store/modules/incentive/action";
import { INCENTIVE_TARGET_UTILITY_REQUEST } from "../../store/modules/incentive/action";

import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR
} from "../../store/modules/ui/actions";

export default {
  name: "InctargetAdd",
  components: {
    Datepicker,
    breadcrumb,
    multiselect,
    BFormFile
  },
  computed: {
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
    isSingleNoneAccu() {
      if (this.incentiveTarget.type == "SINGLE_REWARD_NON_ACC") {
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
    isMultipleNoneAccu() {
      if (this.incentiveTarget.type == "MULTI_REWARD_NON_ACC") {
        return true;
      } else {
        return false;
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
      progressBar: [
        { status: "is-danger", value: 0 },
        { status: "is-warning", value: 50 },
        { status: "is-success", value: 100 }
      ],
      columnsIncentiveList: [],
      total: 0,
      step: 0,
      today: new Date(),
      targetTypes: [],
      rewardTypes: [],
      dealerOutlets: [],
      dealers: "",
      dealerOutletsIsLoading: false,
      statesList: [],
      statesSelected: [],
      outletList: [],
      outletsSelected: [],
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
    async getTargetUtility() {
      const res = await this.$store.dispatch(INCENTIVE_TARGET_UTILITY_REQUEST);
      if (res.resultCode === 0) {
        this.targetTypes = await res.content.targetTypes;
        this.products = await res.content.productFamilies;
        let dealersOutlets = await res.content.dealers;
        this.dealersOutlets = dealersOutlets.filter(dealer => {
          return dealer.status == "ACTIVE";
        });
        this.adjustProductsData();
      }
    },
    adjustProductsData() {
      this.products.forEach(item => {
        if (item.mtmList) {
          item.mtmList.forEach(mtm => {
            mtm.productSkuId = mtm.id;
            mtm.targetUnit = [0, 0, 0, 0, 0];
          });
        }
      });
    },
    adjustTiersArray() {
      if (this.isSingleTargetType) {
        this.tiersArray = [];
        this.addRule();
      }
    },
    stepDecrement() {
      if (this.step === 1) {
        this.mtmsArray = [];
      }
      this.step--;
    },
    stepIncrement() {
      this.$validator.validateAll().then(result => {
        if (this.step === 0) {
          this.dateAdjustmentsAndChecking();
        }
        if (result && Object.keys(this.incentiveTargetErrors).length === 0) {
          // Next tick is used here to fix vee-validate attach() issue
          this.$nextTick(() => {
            this.step++;
            if (this.step === 1) {
              this.adJustFileHeaders();
              this.adjustTiersArray();
            }
          });
        }
      });
    },
    getCurrentSelectedMtms() {
      this.tiersArray.forEach(item => {
        item.modelTargetUnitList = [...this.mtmsArray];
      });
    },
    productFamilySelected() {
      this.mtmsArray = [];
      this.productsubGroups.forEach(item => {
        if (item.mtmList) {
          item.mtmList.forEach(mtm => {
            this.mtmsArray.push(mtm);
          });
        }
      });
      this.getCurrentSelectedMtms();
    },
    removeRule() {
      this.tiersArray.pop();
      this.tiersCount--;
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
    selectAllMtms() {
      this.productFamilySelected();
      this.getCurrentSelectedMtms();
    },
    selectAllProductFamilys() {
      this.productsubGroups = [];
      this.products.forEach(item => {
        this.productsubGroups.push(item);
      });
      this.selectAllMtms();
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
      if (this.incentiveTarget.startDate && this.incentiveTarget.endDate) {
        const startDate = moment(this.incentiveTarget.startDate).format(
          "YYYY-MM-DD"
        );
        const endDate = moment(this.incentiveTarget.endDate).format(
          "YYYY-MM-DD"
        );

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
      }
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
    dataChecking() {
      if (this.mtmsArray.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    handleSubmit() {
      this.$validator.validateAll().then(result => {
        if (result && Object.keys(this.incentiveTargetErrors).length === 0) {
          this.dataAdjustmentBeforeSubmission();
          this.$store
            .dispatch(INCENTIVE_TARGET_ADD, this.incentiveTarget)
            .then(res => {
              this.submitted = true;
              if (res.resultCode === 0) {
                this.stepIncrement();
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
              //  This if function uses checkFileContent function. Might be used in the future. Not required now.
              // if (!this.isAccu) {
              //   if(this.checkFileContent(sheet)){
              //     this.$store.dispatch(NOTIFICATION_SUCCESS, {
              //       message: "File validation completed successfully",
              //       timeOut: true
              //     });
              //   } else {
              //     this.$store.dispatch(NOTIFICATION_ERROR, {
              //       message: "File Content issue"
              //     });
              //   }
              // } else {
              //   this.$store.dispatch(NOTIFICATION_SUCCESS, {
              //     message: "File validation completed successfully",
              //     timeOut: true
              //   });
              // }
              this.dataAdjustmentAfterFileUpload(sheet);

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
    handleTiersInput(value) {
      this.tiersArray = [];
      for (let i = 0; i < value; i++) this.addRule();
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
    toggleModalAddMtm() {
      this.$refs["add-mtm-modal"].toggle();
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
      this.fileUpload = [];
    },
    adJustFileHeaders() {
      if (this.isSingleAccu) {
        this.tHeader = ["Mtm"];
      } else {
        this.tHeader = ["Mtm", "Reward"];
      }
    },
    doExport() {
      const data = "";
      const fileName = this.isSingleAccu
        ? "inc target single accu"
        : this.isMultipleAccu
        ? "inc target multiple accu"
        : "inc target example";
      export_json_to_excel({
        header: this.tHeader,
        data,
        filename: fileName,
        sheetName: fileName,
        autoWidth: true,
        bookType: "xlsx"
      });
    }
  },
  mounted() {
    this.disablingDates();
    this.getTargetUtility();
    this.addRule();
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
