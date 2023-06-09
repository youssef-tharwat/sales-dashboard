<template>
  <div id="target-monthly-list">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-3">
            <div class="form-group flex-grow-1">
              <label class="text-label">Year</label>
              <select
                id="year"
                v-model="target_year"
                class="form-control"
                @change="onYearChange($event)"
              >
                <option v-for="(year, index) of yearList" :key="index">
                  {{
                    year
                  }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <div class="form-group flex-grow-1">
              <label class="text-label">Type</label>
              <select
                id="type"
                v-model="target_type"
                class="form-control"
                @change="onTargetTypeChange($event)"
              >
                <option
                  v-for="(type, index) of targetTypes"
                  :key="index"
                  :value="type.id"
                >
                  {{ type.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-6 add-employee-button">
            <br />
            <button class="btn btn-sm btn-primary" @click="toggleModal">
              <i class="fa fa-upload"></i> Upload
            </button>
          </div>
        </div>
        <br />

        <div class="row">
          <div class="col-lg-12">
            <VueBootstrap4Table
              :classes="classes"
              :rows="dataList"
              :columns="columns"
              :config="config"
              :total-rows="total"
              @on-change-query="onChangeQuery"
              @refresh-data="getCountryDataList"
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
                <div class="bold-text">No Data Found!</div>
              </template>

              <template slot="id" slot-scope="props">
                <span>{{ props.row.vbt_id }}</span>
              </template>
            </VueBootstrap4Table>
          </div>
        </div>
      </div>
    </div>

    <BModal ref="upload-modal" size="xl" hide-footer title="Upload">
      <excelUploadForm
        :close-modal="toggleModal"
        :validations="validateFields"
        :sample-file="sampleFile"
        :content="content"
        :set-post-data="setPostData"
        :show-data-list="true"
        :submit-button-text="'Submit'"
        :get-upload-file="getUploadFile"
        :file-columns="fileColumnStructure"
        :file-data="excelSampleData"
      />
    </BModal>
  </div>
</template>

<script>
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import excelUploadForm from "../../components/excel_upload/index";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import {
  GET_COUNTRY_TARGET_DATA_LIST_REQUEST,
  UPLOAD_COUNTRY_TARGET_DATA_LIST_REQUEST
} from "../../store/modules/target/actions";
import {
  COUNTRY_LIST_REQUEST,
  TARGET_SALE_TYPE_REQUEST
} from "../../store/modules/utility/actions";

export default {
  name: "TargetCountryMonthlyData",
  components: {
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    excelUploadForm: excelUploadForm
  },
  computed: {
    filterCountryId(name) {
      return name;
    }
  },
  data() {
    return {
      sampleFile: "targetCountryMonthlyUpload",
      excel_fields: {
        No: "id",
        Family_Name: "name",
        Brand: "productGroupId",
        Series: "productSubGroupId",
        Product_Type: "deviceType"
      },
      content:
        "Your EXCEL data file should contain all the columns specific to the operation you are performing. The sample EXCEL file has most of the columns required for the operation. Do not edit the colunm labels in the sample file and make sure the file extasion is .xlsx file.",
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Country Traget",
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
          label: "No",
          sort: false,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "country",
          label: "Country",
          width: "13%"
        },
        {
          name: "jan",
          label: "JAN"
        },
        {
          name: "feb",
          label: "FEB"
        },
        {
          name: "mar",
          label: "MAR"
        },
        {
          name: "apr",
          label: "APR"
        },
        {
          name: "may",
          label: "MAY"
        },
        {
          name: "jun",
          label: "JUN"
        },
        {
          name: "jul",
          label: "JUL"
        },
        {
          name: "aug",
          label: "AUG"
        },
        {
          name: "sep",
          label: "SEP"
        },
        {
          name: "oct",
          label: "OCT"
        },
        {
          name: "nov",
          label: "NOV"
        },
        {
          name: "dec",
          label: "DEC"
        }
      ],
      fileColumnStructure: [
        "Country",
        "Year",
        "Type",
        "JAN TARGET",
        "FEB TARGET",
        "MAR TARGET",
        "APR TARGET",
        "MAY TARGET",
        "JUN TARGET",
        "JUL TARGET",
        "AUG TARGET",
        "SEP TARGET",
        "OCT TARGET",
        "NOV TARGET",
        "DEC TARGET"
      ],
      total: 0,
      dataList: [],
      target_year: null,
      target_type: null,
      postTargetData: {},
      countryList: [],
      yearList: [],
      targetTypes: [],
      excelSampleData: []
    };
  },
  methods: {
    showModal() {
      this.$refs["upload-modal"].show();
    },
    hideModal() {
      this.$refs["upload-modal"].hide();
    },
    toggleModal() {
      this.$refs["upload-modal"].toggle("#toggle-btn");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getCountryDataList({});
    },
    getCountryDataList(postd) {
      this.$store
        .dispatch(GET_COUNTRY_TARGET_DATA_LIST_REQUEST, postd)
        .then(res => {
          if (res.resultCode === 0) {
            this.formatDataArray(res.content.targetByCountryList);
          }

          // this.dataList = res.content;
        });
    },
    formatDataArray(data) {
      let rows = [];
      data.forEach(row => {
        let a = {
          country: row.countryName,
          jan: this.filterMonthlyTarget(1, row.data),
          feb: this.filterMonthlyTarget(2, row.data),
          mar: this.filterMonthlyTarget(3, row.data),
          apr: this.filterMonthlyTarget(4, row.data),
          may: this.filterMonthlyTarget(5, row.data),
          jun: this.filterMonthlyTarget(6, row.data),
          jul: this.filterMonthlyTarget(7, row.data),
          aug: this.filterMonthlyTarget(8, row.data),
          sep: this.filterMonthlyTarget(9, row.data),
          oct: this.filterMonthlyTarget(10, row.data),
          nov: this.filterMonthlyTarget(11, row.data),
          dec: this.filterMonthlyTarget(12, row.data)
        };

        rows.push(a);
      });

      this.dataList = rows;
    },
    filterMonthlyTarget(id, arr) {
      let month = arr.filter(function(elem) {
        if (elem.month == id) return elem;
      });
      if (month[0]) {
        return this.addCommaSeparator(month[0].target ? month[0].target : 0);
      } else {
        return 0;
      }
      // console.log(month);
    },
    setDefaultData() {
      if (!this.target_year) {
        this.target_year = new Date().getFullYear();
      }
    },
    onYearChange() {
      const tdata = {
        year: this.target_year,
        type: this.target_type,
        monthly: true,
        weekly: false
      };
      this.getCountryDataList(tdata);
    },
    onTargetTypeChange() {
      const tdata = {
        type: this.target_type,
        year: this.target_year,
        monthly: true,
        weekly: false
      };
      this.getCountryDataList(tdata);
    },
    validateFields(value, field) {
      //   return true;
      let isValid = false;
      let countries = this.countryList;
      let targetTypes = this.targetTypes;
      let type = targetTypes.filter(function(elem) {
        if (elem.text.toLowerCase() === value.toLowerCase()) return elem.id;
      });
      let country = countries.filter(function(elem) {
        if (elem.text.toLowerCase() === value.toLowerCase()) return elem.id;
      });
      let RE = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/; // /^-{0,1}\d*\.{0,1}\d+$/;
      switch (field) {
        case "Country":
          if (country[0]) {
            isValid = true;
          }
          break;
        case "Year":
          isValid = true;
          break;
        case "Type":
          if (type[0]) {
            isValid = true;
          }
          break;
        case "JAN TARGET":
        case "FEB TARGET":
        case "MAR TARGET":
        case "APR TARGET":
        case "MAY TARGET":
        case "JUN TARGET":
        case "JUL TARGET":
        case "AUG TARGET":
        case "SEP TARGET":
        case "OCT TARGET":
        case "NOV TARGET":
        case "DEC TARGET":
          isValid = RE.test(value.trim());
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
    setPostData(pdata) {
      let tdata = [];
      let countries = this.countryList;
      let types = this.targetTypes;
      pdata.forEach(function(row) {
        // eslint-disable-next-line no-unused-vars
        let i = 1;

        let country = countries.filter(function(elem) {
          if (elem.text.toLowerCase() === row[0].toLowerCase()) return elem.id;
        });

        let type = types.filter(function(elem) {
          if (elem.text.toLowerCase() === row[2].toLowerCase()) return elem.id;
        });
        // alert(JSON.stringify(type[0]));
        if (!country[0]) {
          Message({
            message: "Invalid country (" + row[0] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        }
        if (!type[0]) {
          Message({
            message: "Invalid type (" + row[2] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else {
          let countryId = country[0].id; //this.filterCountryId(row[0]);
          let typeId = type[0].id;
          let yearId = row[1];
          for (let m = 1; m <= 12; m++) {
            let tindx = m + 2;
            if (row[tindx]) {
              tdata.push({
                countryId: countryId,
                typeId: typeId,
                year: yearId,
                month: m,
                target: row[tindx].trim()
              });
            }
          }
        }
      });

      this.postTargetData.data = tdata;
      this.postTargetData.type = "monthly";
      if (this.postTargetData.data.length > 0) {
        this.submitTargetData();
      }
    },
    submitTargetData() {
      // console.log(this.postTargetData);
      this.$store
        .dispatch(UPLOAD_COUNTRY_TARGET_DATA_LIST_REQUEST, this.postTargetData)
        .then(res => {
          // console.log(res);
          if (res.resultCode === 0) {
            this.toggleModal();
            Message({
              message: "Country target data Successfully Added.",
              type: "success",
              duration: 5 * 1000
            });
            this.onTargetTypeChange();
          }
        });
    },
    getUploadFile() {},
    getCountryList() {
      this.$store
        .dispatch(COUNTRY_LIST_REQUEST, { withRegion: false })
        .then(res => {
          if (res.resultCode === 0) {
            this.countryList = res.content;

            res.content.forEach(item => {
              this.excelSampleData.push([
                item.text,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
              ]);
            });
          }
        });
    },
    setYears() {
      const year = new Date().getFullYear() - 3;
      for (let i = 0; i <= 6; i++) {
        let yr = year + i;
        this.yearList.push(yr);
      }

      return this.yearList;
    },
    setTargetTypes() {
      this.$store.dispatch(TARGET_SALE_TYPE_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.targetTypes = res.content;

          if (!this.target_type) {
            this.target_type = this.targetTypes[0].id;
            this.onTargetTypeChange();
          }
        }
      });
      // this.targetTypes = [
      //   { id: 1, text: "Amount" },
      //   { id: 2, text: "Quantity" }
      // ];
    },
    addCommaSeparator(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  mounted() {
    this.setYears();
    this.getCountryList();
    this.setTargetTypes();
    this.setDefaultData();
    const tdata = {
      year: this.target_year,
      type: this.target_type,
      weekly: false,
      monthly: true
    };

    if (this.target_year && this.target_type) {
      this.getCountryDataList(tdata);
    }
    // this.getCountryList();
  }
};
</script>
