<template>
  <div id="promoter-leader-weekly-target">
    <div class="row">
      <div class="col-lg-12">
        <div class="row d-flex align-items-center mb-3">
          <div class="form-group flex-grow-1 mr-4">
            <label class="text-label">Year</label>
            <select
              id="year"
              v-model="target_year"
              class="form-control"
              @change="onFilterChanged($event)"
            >
              <option v-for="(year, index) of fiscalYearList" :key="index">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="form-group flex-grow-1 mr-4">
            <label class="text-label">Quarter</label>
            <select
              id="type"
              v-model="target_quarter"
              class="form-control"
              @change="onFilterChanged($event)"
            >
              <option v-for="(type, index) of quarterList" :key="index" :value="type.id">
                {{ type.text }}
              </option>
            </select>
          </div>
          <div class="form-group flex-grow-1">
            <label class="text-label">Type</label>
            <select
              id="type"
              v-model="target_type"
              class="form-control"
              @change="onFilterChanged($event)"
            >
              <option v-for="(type, index) of targetTypes" :key="index" :value="type.id">
                {{ type.text }}
              </option>
            </select>
          </div>
        </div>
        <div class="row d-flex align-items-center justify-content-end mb-5">
          <div>
            <button class="btn btn-sm btn-primary" @click="doExport">
              <i class="fa fa-download"></i> Export
            </button>
          </div>
          <div v-if="!isCountryAdmin">
            <button class="btn btn-sm btn-primary" @click="toggleModal">
              <i class="fa fa-upload"></i> Upload
            </button>
          </div>
          <div v-else>
            <button class="btn btn-sm btn-primary" @click="downloadTemplate">
              Download Template
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <VueBootstrap4Table
              :classes="classes"
              :rows="dataList"
              :columns="columns"
              :config="config"
              :total-rows="total"
              @on-change-query="onChangeQuery"
              @refresh-data="getLeaderDataList"
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
        :file-data="fileColumnData"
      />
    </BModal>
  </div>
</template>

<script>
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import excelUploadForm from "../../components/excel_upload/index";
import { TARGET_SALE_TYPE_REQUEST } from "../../store/modules/utility/actions";
import {
  GET_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST,
  UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST
} from "../../store/modules/target/actions";
import { export_json_to_excel } from "../../utils/Export2Excel";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";

export default {
  name: "TargetLeaderPromoterWeeklyData",
  components: {
    VueBootstrap4Table: VueBootstrap4Table,
    BModal: BModal,
    excelUploadForm: excelUploadForm
  },
  props: {
    leaders: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    fileName() {
      return `Promoter-target-${this.target_quarter}-${this.target_year}`;
    }
  },
  data() {
    return {
      allLeaders: this.leaders,
      sampleFile: "targetPromoterLeaderUpload",
      content:
        "Your EXCEL data file should contain all the columns specific to the operation you are performing. The sample EXCEL file has most of the columns required for the operation. Do not edit the colunm labels in the sample file and make sure the file extasion is .xlsx file.",
      targetTypes: [],
      quarterList: [
        { id: 1, text: "Q1" },
        { id: 2, text: "Q2" },
        { id: 3, text: "Q3" },
        { id: 4, text: "Q4" }
      ],
      fiscalYearList: ["FY1920", "FY2021", "FY2122"],
      leaderList: this.leaders,
      dataList: [],
      postTargetData: {},
      target_year: null,
      target_type: null,
      target_quarter: null,
      total: 0,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Promoter Leader Traget",
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
          sort: true,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "promoterLeader",
          label: "Promoter Leader",
          width: "13%"
        },
        {
          name: "week1",
          label: "Week 01"
        },
        {
          name: "week2",
          label: "Week 02"
        },
        {
          name: "week3",
          label: "Week 03"
        },
        {
          name: "week4",
          label: "Week 04"
        },
        {
          name: "week5",
          label: "Week 05"
        },
        {
          name: "week6",
          label: "Week 06"
        },
        {
          name: "week7",
          label: "Week 07"
        },
        {
          name: "week8",
          label: "Week 08"
        },
        {
          name: "week9",
          label: "Week 09"
        },
        {
          name: "week10",
          label: "Week 10"
        },
        {
          name: "week11",
          label: "Week 11"
        },
        {
          name: "week12",
          label: "Week 12"
        },
        {
          name: "week13",
          label: "Week 13"
        }
      ],
      tHeader: [
        "Promoter Leader",
        "Week 01",
        "Week 02",
        "Week 03",
        "Week 04",
        "Week 05",
        "Week 06",
        "Week 07",
        "Week 08",
        "Week 09",
        "Week 10",
        "Week 11",
        "Week 12",
        "Week 13"
      ],
      filterVal: [
        "promoterLeader",
        "week1",
        "week2",
        "week3",
        "week4",
        "week5",
        "week6",
        "week7",
        "week8",
        "week9",
        "week10",
        "week11",
        "week12",
        "week13"
      ],
      fileColumnData: [],
      fileColumnStructure: [
        "PROMOTER LEADER",
        "Fiscal Year",
        "Year",
        "Type",
        "quarter",
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
        "Week 9",
        "Week 10",
        "Week 11",
        "Week 12",
        "Week 13"
      ],
      isCountryAdmin: false
    };
  },
  watch: {
    leaders: function(valNew) {
      this.allLeaders = valNew;

      const pLeaders = this.filterActiveLeader(valNew);
      this.leaderList = pLeaders;
      this.setExcelSampleData(pLeaders);
    }
  },
  methods: {
    filterActiveLeader(leaders) {
      const result = leaders.filter(leader => leader.status);
      return result;
    },
    setExcelSampleData(arr) {
      this.fileColumnData = [];
      if (!this.isCountryAdmin) {
        arr.forEach(item => {
          let row = [item.name, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
          this.fileColumnData.push(row);
        });
      } else {
        arr.forEach(item => {
          let row = [
            item.id,
            item.name,
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
            "",
            "",
            "",
            ""
          ];
          this.fileColumnData.push(row);
        });
      }
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
    },
    getLeaderDataList(postData) {
      this.$store.dispatch(GET_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST, postData).then(res => {
        if (res.resultCode === 0) {
          this.formatDataArray(res.content.targetByPromoterLeaderWeeklyList);
        }
      });
    },
    formatDataArray(data) {
      let rows = [];
      data.forEach(row => {
        let a = {
          promoterLeader: row.promoterLeaderName,
          week1: this.filterWeeklyTarget("W1", row.data),
          week2: this.filterWeeklyTarget("W2", row.data),
          week3: this.filterWeeklyTarget("W3", row.data),
          week4: this.filterWeeklyTarget("W4", row.data),
          week5: this.filterWeeklyTarget("W5", row.data),
          week6: this.filterWeeklyTarget("W6", row.data),
          week7: this.filterWeeklyTarget("W7", row.data),
          week8: this.filterWeeklyTarget("W8", row.data),
          week9: this.filterWeeklyTarget("W9", row.data),
          week10: this.filterWeeklyTarget("W10", row.data),
          week11: this.filterWeeklyTarget("W11", row.data),
          week12: this.filterWeeklyTarget("W12", row.data),
          week13: this.filterWeeklyTarget("W13", row.data)
        };

        rows.push(a);
      });
      this.dataList = rows;
    },
    filterWeeklyTarget(id, arr) {
      let week = arr.filter(function(elem) {
        if (elem.week === id) return elem;
      });
      if (week[0]) {
        return this.addCommaSeparator(week[0].target ? week[0].target : 0);
      } else {
        return 0;
      }
    },
    addCommaSeparator(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    onFilterChanged() {
      const tdata = {
        year: this.target_year,
        type: this.target_type,
        quarter: this.target_quarter,
        monthly: false,
        weekly: true
      };
      this.getLeaderDataList(tdata);
    },
    setDefaultData() {
      if (!this.target_year) {
        this.target_year = this.fiscalYearList[0];
      }
      if (!this.target_type) {
        if (this.targetTypes[0]) {
          this.target_type = this.targetTypes[0].id;
        }
      }
      if (!this.target_quarter) {
        this.target_quarter = this.quarterList[0]["id"];
      }
    },
    getTargetTypes() {
      this.$store.dispatch(TARGET_SALE_TYPE_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.targetTypes = res.content;
          if (!this.target_type) {
            this.target_type = this.targetTypes[0].id;
            this.onFilterChanged();
          }
        }
      });
    },
    doExport() {
      let data = this.formatJson(this.filterVal, this.dataList);
      export_json_to_excel({
        header: this.tHeader,
        data,
        filename: this.fileName,
        sheetName: this.fileName,
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    async downloadTemplate() {
      await this.setExcelSampleData(this.leaderList);
      let data = await this.fileColumnData;
      let header = [
        "User ID",
        "PROMOTER LEADER",
        "Week 01",
        "Week 02",
        "Week 03",
        "Week 04",
        "Week 05",
        "Week 06",
        "Week 07",
        "Week 08",
        "Week 09",
        "Week 10",
        "Week 11",
        "Week 12",
        "Week 13"
      ];
      export_json_to_excel({
        header: header,
        data,
        filename: this.sampleFile,
        sheetName: this.sampleFile,
        autoWidth: false,
        bookType: "xlsx"
      });
    },
    showModal() {
      this.$refs["upload-modal"].show();
    },
    hideModal() {
      this.$refs["upload-modal"].hide();
    },
    toggleModal() {
      this.$refs["upload-modal"].toggle("#toggle-btn");
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    validateFields(value, field) {
      //   return true;
      let isValid = false;
      let leaders = this.leaderList;
      let targetTypes = this.targetTypes;
      let quarterList = this.quarterList;
      let fiscalyearList = this.fiscalYearList;

      let leader = leaders.filter(function(elem) {
        if (elem.name.toLowerCase() === value.toLowerCase()) return elem.id;
      });
      let type = targetTypes.filter(function(elem) {
        if (elem.text.toLowerCase() === value.toLowerCase()) return elem.id;
      });
      let quarter = quarterList.filter(function(elem) {
        if (elem.text.toLowerCase() === value.toLowerCase()) return elem.id;
      });
      let fiscalyear = fiscalyearList.filter(function(elem) {
        if (elem.toLowerCase() === value.toLowerCase()) return elem;
      });

      let RE = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/; // /^-{0,1}\d*\.{0,1}\d+$/;
      switch (field) {
        case "PROMOTER LEADER":
          if (leader[0]) {
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
        case "quarter":
          if (quarter[0]) {
            isValid = true;
          }
          break;
        case "Fiscal Year":
          if (fiscalyear[0]) {
            isValid = true;
          }
          break;
        case "Week 1":
        case "Week 2":
        case "Week 3":
        case "Week 4":
        case "Week 5":
        case "Week 6":
        case "Week 7":
        case "Week 8":
        case "Week 9":
        case "Week 10":
        case "Week 11":
        case "Week 12":
        case "Week 13":
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
      let leaders = this.leaderList;
      let quarters = this.quarterList;
      let targettypes = this.targetTypes;
      let fiscalyears = this.fiscalYearList;

      pdata.forEach(function(row) {
        let leader = leaders.filter(function(elem) {
          if (elem.name.toLowerCase() === row[0].toLowerCase()) return elem;
        });

        let quarter = quarters.filter(function(elem) {
          if (elem.text.toLowerCase() === row[4].toLowerCase()) return elem.id;
        });
        let type = targettypes.filter(function(elem) {
          if (elem.text.toLowerCase() === row[3].toLowerCase()) return elem.id;
        });

        let fiscalyear = fiscalyears.filter(function(elem) {
          if (elem.toLowerCase() === row[1].toLowerCase()) return elem;
        });

        if (!leader[0]) {
          Message({
            message: "Invalid promoter leader (" + row[0] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else if (!quarter[0]) {
          Message({
            message: "Invalid quarter (" + row[4] + ").",
            type: "error",
            duration: 5 * 1000
          });
          return true;
        } else if (!type[0]) {
          Message({
            message: "Invalid type (" + row[3] + ").",
            type: "error",
            duration: 5 * 1000
          });
          return true;
        } else if (!fiscalyear[0]) {
          Message({
            message: "Invalid fiscal year (" + row[1] + ").",
            type: "error",
            duration: 5 * 1000
          });
          return true;
        } else {
          let promoterLeaderId = leader[0].id;
          let typeId = type[0].id;
          let quarterId = quarter[0].id;
          let yearId = parseInt(row[2]);
          let fiscalYear = fiscalyear[0];
          for (let m = 1; m <= 13; m++) {
            let tindx = m + 4;
            if (row[tindx]) {
              tdata.push({
                promoterLeaderId: promoterLeaderId,
                year: yearId,
                week: "W" + m,
                typeId: typeId,
                quarter: "Q" + quarterId,
                target: Number(row[tindx].trim()),
                fiscalYear: fiscalYear
              });
            }
          }
        }
      });
      this.postTargetData.data = tdata;
      this.postTargetData.type = "weekly";
      if (this.postTargetData.data.length > 0) {
        this.submitTargetData();
      }
    },
    submitTargetData() {
      this.$store
        .dispatch(UPLOAD_PROMOTER_LEADER_TARGET_DATA_LIST_REQUEST, this.postTargetData)
        .then(res => {
          if (res.resultCode === 0) {
            this.toggleModal();
            Message({
              message: "Promoter Leader target data Successfully Added.",
              type: "success",
              duration: 5 * 1000
            });
            this.onFilterChanged();
          }
        });
    },
    getUploadFile() {}
  },
  mounted() {
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    this.getTargetTypes();
    this.setDefaultData();
  }
};
</script>
