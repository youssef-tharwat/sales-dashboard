<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Dealer Name</label>
            <Multiselect
              v-if="!canEdit"
              ref="multiselect"
              v-model="dealerId"
              placeholder="Select Dealer"
              :searchable="true"
              :options="dealerList"
              label="dealerName"
              track-by="id"
              select-label
              deselect-label
              :loading="isDealersLoading"
            ></Multiselect>
            <input
              v-if="canEdit"
              v-model="selectedMtm.dealerName"
              type="text"
              class="form-control"
              disabled="true"
            />
          </div>
        </div>
        <div class="col-lg-6">
          <label class="text-label">Select Period</label>
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
            <div slot="input" slot-scope="picker" style="width: 100%; float: left;">
              <span v-if="picker.startDate && picker.endDate">{{ formatDate(picker.startDate) }} to {{ formatDate(picker.endDate) }}</span>
            </div>
          </DateRangePicker>
        </div>
        <div v-if="!canEdit" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">MTM File</label>
            <div class="input-group mb-3">
              <input
                id="upFile"
                ref="upFile"
                type="file"
                class="form-control"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                @change="addFile($event)"
              />
              <div class="input-group-append">
                <span id="reset-upload" class="input-group-text" @click="resetUpload($event)">Reset</span>
              </div>
            </div>

            <p>
              <a class="link lnv-link" @click="doExportDefault">
                <i class="fa fa-download"></i>
                <span class="ml-2">Download sample EXCEL file</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      <div v-if="displayDataTable" class="row">
        <div class="col-md-12">
          <table class="table">
            <thead>
              <tr>
                <th v-for="(item, index) of headers" :key="index">{{ item }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) of rows" :key="index">
                <td v-for="(key, index3) of item" :key="index3">
                  <!--  eslint-disable vue/no-v-html -->
                  <label v-html="key"></label>
                  <!-- <p>{{item.key}}</p> -->
                </td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <button
            v-if="!canEdit"
            type="button"
            class="btn btn-primary pull-right"
            @click="doUpload($event)"
          >
            <i class="fa fa-upload"></i> UPLOAD
          </button>
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-primary pull-right"
            @click="doUpdate($event)"
          >
            <i class="fa fa-upload"></i> UPDATE
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DEALER_LIST_REQUEST } from "../../store/modules/dealer/actions";
import readXlsxFile from "read-excel-file";
import { Message } from "element-ui";
import { EXCLUSIVE_MTM_UPLOAD_REQUEST } from "../../store/modules/mtm/actions";
import DateRangePicker from "../ui/vue2-daterange-picker";
import "../ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { convertDateFormat } from "../../utils/helpers";
import { export_json_to_excel } from "../../utils/Export2Excel";
import Multiselect from "vue-multiselect";
const today = new Date();

export default {
  name: "MTMUpload",
  components: {
    Multiselect: Multiselect,
    DateRangePicker: DateRangePicker
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    selectedMtm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    canEdit: { type: Boolean }
  },
  computed: {},
  data() {
    return {
      dateRange: {
        startDate: this.selectedMtm.startDate
          ? convertDateFormat(this.selectedMtm.startDate, "YYYY-MM-DD")
          : convertDateFormat(new Date(today.getFullYear(), today.getMonth(), 1), "YYYY-MM-DD"),
        endDate: this.selectedMtm.endDate
          ? convertDateFormat(this.selectedMtm.endDate, "YYYY-MM-DD")
          : convertDateFormat(new Date(today.getFullYear(), today.getMonth() + 1, 0), "YYYY-MM-DD")
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
      dealerList: [],
      dealerId: null,
      displayDataTable: true,
      headers: [],
      rows: [],
      file: {},
      dataErrors: [],
      fileValid: false,
      fileErrors: 0,
      defaultFileName: "mtmUpload",
      fileHeaderColumns: ["MTM No"],
      isDealersLoading: false,
      mtm: {
        id: this.selectedMtm.id,
        startDate: this.selectedMtm.startDate,
        endDate: this.selectedMtm.endDate
      }
    };
  },
  methods: {
    getDealers() {
      this.isDealersLoading = true;
      this.dealerList = [];
      this.$store.dispatch(DEALER_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          res.content.forEach(dealer => {
            if (dealer.status === "ACTIVE") {
              this.dealerList.push(dealer);
            }
          });
          this.isDealersLoading = false;
        } else {
          this.isDealersLoading = false;
        }
      });
    },
    checkFormValidity(value, row, column) {
      let field = this.headers[column];

      const resp = this.validateFields(value, field);
      this.dataErrors[row] = resp.valid ? true : false;

      if (resp.valid) {
        this.fileValid = true;
      } else {
        this.fileValid = false;
        this.fileErrors++;
      }

      return resp.value;
    },
    validateFields(value, field) {
      let isValid = false;
      switch (field) {
        case "MTM No":
          isValid = true;
          break;
        default:
          isValid = true;
          break;
      }

      if (!isValid) {
        value = '<span class="invalid-field">' + value + "</span>";
      }

      return {
        value: value,
        valid: isValid
      };
    },
    addFile() {
      this.fileErrors = 0;
      // eslint-disable-next-line no-unused-vars
      let file = this.$refs.upFile.files[0];
      this.file = {
        name: this.$refs.upFile.files[0].name,
        size: this.$refs.upFile.files[0].size,
        type: this.$refs.upFile.files[0].type,
        lastModified: this.$refs.upFile.files[0].lastModified
      };
      readXlsxFile(this.$refs.upFile.files[0]).then(rows => {
        const head = rows[0];
        const items = rows;
        this.headers = head;
        delete items[0];

        const validFileHeader = this.isHeaderMatch(this.fileHeaderColumns, this.headers);

        if (validFileHeader) {
          this.setRows(items);
        } else {
          Message({
            message: "Invalid header titles found, correct and upload again.",
            type: "error",
            duration: 5 * 1000
          });

          this.headers = [];
        }
      });
    },
    isHeaderMatch(a, b) {
      return a.toString() === b.toString();
    },
    setRows(data) {
      data.forEach((row, index) => {
        let item = {};
        row.forEach((key, index3) => {
          item[index3] = this.checkFormValidity(key, index, index3);
        });

        this.rows.push(item);
      });
    },
    formatPostData(id, sDate, eDate, rows) {
      let arr = [];
      rows.forEach(row => {
        let i = {
          dealerId: id,
          startDate: sDate,
          endDate: eDate,
          mtm: row[0]
        };
        arr.push(i);
      });

      return arr;
    },
    doUpload(e) {
      if (this.dealerId == null) {
        Message({
          message: "Please select the dealer before upload.",
          type: "error",
          duration: 5 * 1000
        });
      } else if (!this.fileValid || this.fileErrors > 0) {
        Message({
          message: "File contain invalid data, correct and upload again.",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
        let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");

        const mtm = this.formatPostData(this.dealerId.id, startDate, endDate, this.rows);
        console.log(mtm);
        this.$store.dispatch(EXCLUSIVE_MTM_UPLOAD_REQUEST, mtm).then(res => {
          if (res.resultCode === 0) {
            Message({
              message: "Exclusive MTM uploaded.",
              type: "success",
              duration: 5 * 1000
            });
            this.loadData();
            this.closeModal();
            this.resetUpload(e);
          }
        });
      }
    },
    resetUpload() {
      if (document.getElementById("upFile")) document.getElementById("upFile").value = "";
      this.headers = [];
      this.rows = [];
      this.dealerId = null;
      this.fileError = 0;
      this.fileValid = false;
    },
    doExportDefault() {
      const tHeader = this.fileHeaderColumns;
      const data = [];
      const fileName = this.defaultFileName;
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "Sheet 1",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    updateDateValues() {},
    formatDate: function(date) {
      return convertDateFormat(date, "DD-MM-YYYY");
    },
    doUpdate(e) {
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");

      const mtm = {
        id: this.mtm.id,
        startDate: startDate,
        endDate: endDate
      };
      console.log(mtm);

      this.$store.dispatch(EXCLUSIVE_MTM_UPLOAD_REQUEST, mtm).then(res => {
        if (res.resultCode === 0) {
          Message({
            message: "Exclusive MTM Successfully Updated.",
            type: "success",
            duration: 5 * 1000
          });
          this.loadData();
          this.closeModal();
          this.resetUpload(e);
        }
      });
    }
  },
  mounted() {
    this.getDealers();
  },
  created() {}
};
</script>
