<template>
  <div class="add-employee-form">
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-lg-12 mb-sm-3">
          <label class="text-label">Select Incentive List</label>
          <Multiselect
            id="Incentive List Select"
            ref="multiselect"
            v-model="incentiveListSelected"
            v-validate="'required'"
            name="Incentive List Select"
            placeholder="Select incentive"
            :searchable="true"
            :options="incentiveLists"
            label="name"
            track-by="id"
            select-label
            deselect-label
            @select="populatingFields"
          ></Multiselect>
          <span class="invalid-field mt-2">{{ errors.first("Incentive List Select") }}</span>
        </div>
        <div class="col-lg-12 mb-sm-3">
          <label class="text-label">Incentive List Name</label>
          <input
            id="Incentive list name"
            v-model="incentiveNormal.name"
            v-validate="'required'"
            type="text"
            class="form-control"
            name="Incentive list name"
          />
          <span class="invalid-field mt-2">{{ errors.first("Incentive list name") }}</span>
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
            :disabled="true"
            placeholder="Select Start Date"
            :disabled-dates="disabledDates"
            @closed="checkDates"
          ></Datepicker>

          <span class="invalid-field mt-2">{{ errors.first("Start Date") }}</span>
          <span v-if="incentiveNormalErrors.startDate" class="invalid-field mt-2">{{
            incentiveNormalErrors.startDate
          }}</span>
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
            @closed="checkDates"
          ></Datepicker>

          <span class="invalid-field mt-2">{{ errors.first("End Date") }}</span>
          <span v-if="incentiveNormalErrors.endDate" class="invalid-field mt-2">{{
            incentiveNormalErrors.endDate
          }}</span>
        </div>
        <div class="col-lg-6 d-flex flex-column mt-3">
          <label class="text-label">Incentive List*</label>
          <input id="file" ref="file" type="file" name="file" @change="handleFileUpload($event)" />
          <span class="invalid-field mt-2">{{ errors.first("file") }}</span>
          <span v-if="incentiveNormalErrors.file" class="invalid-field mt-2">{{
            incentiveNormalErrors.file
          }}</span>
          <button
            type="button"
            class="ml-0 p-0 mt-3 btn-link btn text-info width-fit-content"
            @click="doExport()"
          >
            Download selected incntive list
            <i class="fa fa-download fa-lg" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <button type="submit" class="btn btn-primary pull-right ml-3">Update Incentive</button>
          <button type="button" class="btn pull-right" data-dismiss="modal" @click="close()">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {
  INCENTIVE_NORMAL_LIST_UPDATE,
  INCENTIVE_NORMAL_GET_BY_ID
} from "../../store/modules/incentive/action.js";
import { export_json_to_excel } from "../../utils/Export2Excel";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import { Message } from "element-ui";

export default {
  name: "IncentiveNormalUpdateForm",
  components: { Datepicker, Multiselect },
  props: {
    incentiveLists: {
      type: Array,
      default: () => {
        return [];
      }
    },
    closeModal: { type: Function, default: () => {} },
    allMtm: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      today: new Date(),
      incentiveNormal: {
        id: "",
        name: "",
        startDate: new Date(),
        endDate: "",
        excelBase64: ""
      },
      disabledDates: {
        to: "", // Disable all dates up to specific date
        from: "" // Disable all dates after specific date
      },
      submitted: false,
      incentiveListSelected: "",
      incentiveNormalErrors: {},
      incentiveList: "",
      isRegionAdmin: false,
      tHeader: ["Product Family", "Mtm", "Sales Persons", "Promoters"],
      filterVal: ["mtmName", "mtmNo", "salesPerson", "promoter"]
    };
  },
  methods: {
    dataAdjustmentsAndChecking() {
      if (!this.incentiveNormal.startDate || this.incentiveNormal.startDate === "Invalid date") {
        this.incentiveNormalErrors.startDate = "Start date is required";
      } else {
        delete this.incentiveNormalErrors.startDate;
        this.incentiveNormal.startDate = moment(this.incentiveNormal.startDate).format(
          "YYYY-MM-DD 00:00:00"
        );
      }

      if (!this.incentiveNormal.endDate || this.incentiveNormal.endDate === "Invalid date") {
        this.incentiveNormalErrors.endDate = "End date is required";
      } else {
        delete this.incentiveNormalErrors.endDate;
        this.incentiveNormal.endDate = moment(this.incentiveNormal.endDate).format(
          "YYYY-MM-DD 23:59:59"
        );
      }
    },
    disablingDates() {
      const date = moment(this.today);
      const month = date.month();
      const year = date.year();

      this.disabledDates.to = new Date(year, month, 1);
    },
    checkDates() {
      let startDate = moment(this.incentiveNormal.startDate).format("YYYY-MM-DD");
      let endDate = moment(this.incentiveNormal.endDate).format("YYYY-MM-DD");

      if (!moment(endDate).isSame(startDate) && !moment(endDate).isAfter(startDate)) {
        this.incentiveNormalErrors.endDate = "End date must be after or equal to start date";
      } else {
        delete this.incentiveNormalErrors.endDate;
      }
    },
    checkUploadType(file) {
      let filename = file.split(".").pop();
      if (filename == "xlsx" || filename == "xlsm" || filename == "xls" || filename == "xltx") {
        delete this.incentiveNormalErrors.file;
        return true;
      } else {
        this.incentiveNormalErrors.file = "File type must be .xlsx, xlsm, xls, or xltx";
        return false;
      }
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
      const file = event.target.files[0];
      if (this.checkUploadType(file.name)) {
        this.getBase64(file).then(data => {
          this.incentiveNormal.excelBase64 = data;
        });
      }
    },
    doExport() {
      if (this.incentiveListSelected) {
        this.$store
          .dispatch(INCENTIVE_NORMAL_GET_BY_ID, this.incentiveListSelected.id)
          .then(res => {
            this.incentiveList = res.content;
            this.total = this.incentiveList.length;

            const data = this.formatJson(this.filterVal, this.incentiveList);
            const fileName = this.incentiveListSelected.name;

            if (this.incentiveList.length <= 0) {
              Message({
                message: "No records found",
                type: "error",
                duration: 5 * 1000
              });
            } else {
              export_json_to_excel({
                header: this.tHeader,
                data,
                filename: fileName,
                sheetName: "Sheet 1",
                autoWidth: true,
                bookType: "xlsx"
              });
            }
          });
      } else {
        Message({
          message: "Select a incentive to download.",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    populatingFields(selection) {
      this.incentiveNormal.id = selection.id;
      this.incentiveNormal.name = selection.name;
      this.incentiveNormal.startDate = selection.startDate;
      this.incentiveNormal.endDate = selection.endDate;
      this.incentiveNormal.excelBase64 = selection.excelBase64;
    },
    handleSubmit() {
      this.dataAdjustmentsAndChecking();

      this.$validator.validateAll().then(result => {
        if (result && Object.keys(this.incentiveNormalErrors).length === 0) {
          this.$store.dispatch(INCENTIVE_NORMAL_LIST_UPDATE, this.incentiveNormal).then(res => {
            this.submitted = true;
            if (res.resultCode === 0) {
              this.success();
              return Message({
                message: "Incentive list Successfully Added.",
                type: "success",
                duration: 5 * 1000
              });
            }
          });
        }
      });
    },
    close() {
      this.closeModal();
    },
    success() {
      this.$emit("get-normal-incentives");
      this.close();
    },
    regionAdminCheck() {
      this.isRegionAdmin = this.$store.getters.isRegionAdmin;
      if (!this.isRegionAdmin && this.$store.getters.getCountryCode == "MY") {
        this.tHeader.push("Dealers");
        this.filterVal.push("dealer");
      }
    }
  },
  mounted() {
    this.regionAdminCheck();
    this.disablingDates();
    this.closeModal();
  }
};
</script>
