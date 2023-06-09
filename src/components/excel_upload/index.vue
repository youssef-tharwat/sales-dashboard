<template>
  <div class="row">
    <div class="col-md-12 uploadSection">
      <div class="input-group mb-3">
        <vue-xlsx-table class="btn-lg" @on-select-file="handleSelectedFile">
          Select File
          <small>** Only .xlsx files are allowed.</small>
        </vue-xlsx-table>
      </div>
    </div>

    <div class="col-md-12 mt-5">
      <a v-if="doExportDefault" class="link lnv-link" @click="doExportDefault">
        <i class="fa fa-download"></i>
        <span class="ml-2">Download sample EXCEL file</span>
      </a>
      <br />
      <br />

      <p v-if="contentHtml" class="black-text">{{ contentHtml }}</p>
    </div>

    <div v-if="displayDataTable" class="col-md-12">
      <table class="table">
        <thead>
          <tr>
            <th v-for="(item, index) of headers" :key="index">{{ item }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) of rows" :key="index">
            <td v-for="(key, index3) of item" :key="index3">
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="displayText(key, index3)"></div>

              <!-- <p>{{item.key}}</p> -->
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>

    <div class="col-lg-12">
      <button type="submit" class="btn btn-secondary pull-right" @click="handleSubmit($event)">
        {{ submitButton }}
      </button>
      <button type="button" class="btn btn-light pull-right" @click="close()">Cancel</button>
    </div>
  </div>
</template>

<script>
import readXlsxFile from "read-excel-file";
import { Message } from "element-ui";
import { export_json_to_excel } from "../../utils/Export2Excel";

export default {
  name: "ExcelUploadForm",
  components: {},
  props: {
    closeModal: { type: Function, default: () => {} },
    validations: { type: Function, default: () => {} },
    content: { type: String, default: "" },
    sampleFile: { type: String, default: "" },
    setPostData: { type: Function, default: () => {} },
    showDataList: { type: Boolean },
    submitButtonText: { type: String, default: "" },
    getUploadFile: { type: Function, default: () => {} },
    fileColumns: { type: Array, default: () => [] },
    fileData: { type: Array, default: () => [] }
  },
  computed: {},
  data() {
    return {
      validateFields: this.validations,
      contentHtml: this.content,
      displayDataTable: this.showDataList,
      submitButton: this.submitButtonText ? this.submitButtonText : "Upload",
      rows: [],
      headers: [],
      file: {},
      dataErrors: [],
      fileValid: false,
      fileErrors: 0,
      defaultFileName: this.sampleFile,
      fileHeaderColumns: this.fileColumns ? this.fileColumns : [],
      fileSampleData: this.fileData ? this.fileData : []
    };
  },
  methods: {
    displayText(text) {
      var r = /^(http|https):\/\/[^ "]+$/;
      if (text) {
        if (r.test(text)) {
          return "Valid URL";
        } else {
          return text.substr(0, 50);
        }
      } else {
        return text;
      }
    },
    handleSelectedFile(convertedData) {
      this.headers = [];
      this.rows = [];

      try {
        const validFileHeader = this.isHeaderMatch(this.fileHeaderColumns, convertedData.header);

        if (validFileHeader) {
          this.rows = [];
          this.fileErrors = 0;
          this.fileValid = false;

          this.headers = this.fileHeaderColumns; //convertedData.header;
          const items = convertedData.body;
          let arr = [];

          items.forEach(row => {
            let i = [];
            this.headers.forEach((row2, index2) => {
              i[index2] = row[row2] ? row[row2] : null;
            });
            arr.push(i);
          });
          this.setRows(arr);
        } else {
          Message({
            message:
              "Invalid header titles found, correct and upload again. (Download the correct sample file below)",
            type: "error",
            duration: 5 * 1000
          });

          this.headers = [];
        }
      } catch (err) {
        console.log(err);
      }
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
      // return a.toString() === b.toString();
      return b.every(val => a.includes(val));
    },
    close() {
      this.closeModal();
    },
    success() {
      this.close();
      this.loadData();
    },
    checkFormValidity(value, row, column) {
      let field = this.headers[column];
      // if (value) {
      const resp = this.validations(value, field);
      this.dataErrors[row] = resp.valid ? true : false;

      if (resp.valid) {
        this.fileValid = true;
      } else {
        this.fileValid = false;
        // alert(field);
        // alert(this.dataErrors[row]);
        this.fileErrors++;
      }

      return resp.value;
      // } else {
      //   this.fileValid = false;
      //   this.fileErrors++;
      //   this.dataErrors[row] = false;
      //   return value + "<span class='invalid-field'>*Required</span>";
      // }
      // return value;
    },
    handleReset() {},
    handleCancel() {},
    handleSubmit() {
      if (this.rows <= 0) {
        Message({
          message: "No data found!, try again.",
          type: "error",
          duration: 5 * 1000
        });
      } else if (!this.fileValid || this.fileErrors > 0) {
        // alert(this.fileValid);
        // alert(this.fileErrors);
        Message({
          message: "File contain invalid data, correct and upload again.",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        // this.resetUpload(e);
        this.setPostData(this.rows);
        // this.getUploadFile(this.$refs.upFile.files);
      }
    },
    addFile() {
      //   console.log(this.$refs.upFile.files[0]);
      this.fileErrors = 0;
      try {
        readXlsxFile(this.$refs.upFile.files[0]).then(rows => {
          const head = rows[0];
          const items = rows;
          this.headers = head;
          delete items[0];
          // this.rows = items;
          // alert("a");
          // console.log(items);
          this.setRows(items);
        });
      } catch (error) {
        // console.log(error);
      }
    },
    setRows(data) {
      data.forEach((row, index) => {
        let item = {};
        // console.log(row[0]);
        row.forEach((key, index3) => {
          item[index3] = this.checkFormValidity(key, index, index3);
        });

        this.rows.push(item);
      });

      // checkFormValidity(key, index, index3 )
    },
    resetUpload() {
      // document.getElementById("upFile").value = "";
      this.headers = [];
      this.rows = [];
      this.outletId = null;
      this.fileError = 0;
      this.fileValid = false;
    },
    doExportDefault() {
      const tHeader = this.fileHeaderColumns;
      const data = this.fileSampleData;
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
  created() {},
  mounted() {
    // this.closeModal();
    // this.setPostData(this.rows);
  }
};
</script>

<style>
.vue-xlsx-container {
  width: 100% !important;
}
.xlsx-button {
  width: 100%;
  height: 130px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #ccc !important;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  padding: 7px 9px;
  font-size: 15px;
  border-radius: 4px;
  color: #949090 !important;
  background-color: #f9f2f2 !important;
}

.link {
  cursor: pointer;
}

.uploadSection {
  height: 120px;
}
</style>
