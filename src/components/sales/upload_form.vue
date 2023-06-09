<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Outlet Name</label>
            <Multiselect
              ref="multiselect"
              v-model="outletId"
              placeholder="Select Outlet"
              :searchable="true"
              :options="outletList"
              label="name"
              track-by="id"
              select-label
              deselect-label
              :loading="isOutletsLoading"
            />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Sales File</label>
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
              <a
                class="link link-highlighted lnv-link"
                @click="doExportDefault"
              >Please click here to download file format.</a>
              <br />Please make sure invoice date format as per DD-MM-YYYY
              (01-07-2019)
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
          <button type="button" class="btn btn-primary pull-right" @click="doUpload($event)">
            <i class="fa fa-upload"></i> UPLOAD
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { OUTLET_LIST_REQUEST } from "../../store/modules/outlet/actions";
import readXlsxFile from "read-excel-file";
import { Message } from "element-ui";
import { UPLOAD_BULK_SALE_REQUEST } from "../../store/modules/sales/actions";
import { convertDateFormat } from "../../utils/helpers";
import { export_json_to_excel } from "../../utils/Export2Excel";
import Multiselect from "vue-multiselect";

export default {
  name: "BulkSaleUpload",
  components: {
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} }
  },
  computed: {},
  data() {
    return {
      outletList: [],
      outletId: null,
      displayDataTable: true,
      headers: [],
      rows: [],
      file: {},
      dataErrors: [],
      fileValid: false,
      fileErrors: 0,
      defaultFileName: "bulkUpload",
      fileHeaderColumns: ["Serial Number", "Invoice Date", "Invoice No"],
      isOutletsLoading: false
    };
  },
  methods: {
    getOutlets() {
      this.isOutletsLoading = true;
      this.$store.dispatch(OUTLET_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.outletList = res.content;
          this.isOutletsLoading = false;
        } else {
          this.isOutletsLoading = false;
        }

        // if (this.outletList.length === 0) {
        //   this.outletList = [
        //     {
        //       id: 1,
        //       outletName: "Sample Outlet"
        //     }
        //   ];
        // }
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
      //   return true;
      let isValid = false;
      switch (field) {
        case "Serial Number":
          isValid = true;
          break;
        case "Invoice Date":
          // eslint-disable-next-line no-case-declarations
          let d = convertDateFormat(value, "DD-MM-YYYY");
          if (d === "Invalid date" && value !== "NA") {
            isValid = false;
          } else if (value === "NA") {
            let crDate = new Date();
            value = convertDateFormat(crDate, "DD-MM-YYYY");
            isValid = true;
          } else {
            isValid = true;
            value = d;
          }
          // isValid = true;
          // isValid = d;
          break;
        case "Invoice No":
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

        const validFileHeader = this.isHeaderMatch(
          this.fileHeaderColumns,
          this.headers
        );

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
      // var sorted_a = a.concat().sort();
      // var sorted_b = b.concat().sort();
      // var common = [];
      // var a_i = 0;
      // var b_i = 0;

      // while (a_i < a.length && b_i < b.length) {
      //   if (sorted_a[a_i] === sorted_b[b_i]) {
      //     common.push(sorted_a[a_i]);
      //     a_i++;
      //     b_i++;
      //   } else if (sorted_a[a_i] < sorted_b[b_i]) {
      //     a_i++;
      //   } else {
      //     b_i++;
      //   }
      // }
      // return common;
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

      // checkFormValidity(key, index, index3 )
    },
    formatPostData(rows) {
      let arr = [];
      rows.forEach(row => {
        let d = row[1].split("-");
        let date = convertDateFormat(
          d[2] + "-" + d[1] + "-" + d[0],
          "YYYY-MM-DD"
        );

        let i = {
          serial: row[0],
          invoiceNumber: row[2],
          invoiceDate: date
        };
        arr.push(i);
      });

      return arr;
    },
    doUpload(e) {
      if (!this.fileValid || this.fileErrors > 0) {
        Message({
          message: "File contain invalid data, correct and upload again.",
          type: "error",
          duration: 5 * 1000
        });
      } else if (this.outletId.id == null) {
        Message({
          message: "Please select the outlet before upload.",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        const upData = {
          outletId: this.outletId.id,
          fileName: this.file.name,
          salesList: this.formatPostData(this.rows)
        };
        this.$store.dispatch(UPLOAD_BULK_SALE_REQUEST, upData).then(res => {
          if (res.resultCode === 0) {
            Message({
              message: "Sales uploaded.",
              type: "success",
              duration: 5 * 1000
            });
            this.closeModal();
            this.resetUpload(e);
          }
        });
      }
    },
    resetUpload() {
      document.getElementById("upFile").value = "";
      this.headers = [];
      this.rows = [];
      this.outletId = null;
      this.this.fileError = 0;
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
    }
  },
  mounted() {
    this.getOutlets();
  },
  created() {}
};
</script>
