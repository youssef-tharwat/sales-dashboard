<template>
  <div id="exclusive-mtm">
    <breadcrumb title="Dashboard" subtitle="Exclusive MTM" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-7">
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
                  @update="getExclusiveMTMList"
                >
                  <div
                    slot="input"
                    slot-scope="picker"
                    style="width: 100%; float: left;"
                  >
                    <span v-if="picker.startDate && picker.endDate">{{ formatDate(picker.startDate) }} to
                      {{ formatDate(picker.endDate) }}</span>
                  </div>
                </DateRangePicker>
              </div>
              <div class="col-lg-5">
                <div class="form-group flex-grow-1">
                  <br />
                  <button
                    class="btn btn-primary pull-right"
                    @click="toggleModal(null)"
                  >
                    <i class="fa fa-upload"></i> Upload
                  </button>
                </div>
              </div>
            </div>
            <br />
            <div class="row">
              <div class="col-lg-12">
                <VueBootstrap4Table
                  :classes="classes"
                  :rows="mtmList"
                  :columns="columns"
                  :config="config"
                  :total-rows="total"
                  @on-change-query="onChangeQuery"
                  @refresh-data="getExclusiveMTMList"
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
                    <div class="bold-text">No MTM Found!</div>
                  </template>

                  <template slot="Action" slot-scope="props">
                    <div class="inner-buttons float-left">
                      <button
                        class="btn btn-warning btn-xs"
                        @click="toggleModal(props.row)"
                      >
                        <i class="fa fa-edit"></i>
                        <span>Edit</span>
                      </button>
                    </div>
                  </template>
                </VueBootstrap4Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BModal ref="mtm-upload-modal" size="lg" hide-footer title="Exclusive MTM">
      <MTMUpload
        :close-modal="toggleModal"
        :can-edit="canEdit"
        :selected-mtm="mtm"
        :load-data="getExclusiveMTMList"
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import DateRangePicker from "../../components/ui/vue2-daterange-picker";
import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import { convertDateFormat } from "../../utils/helpers";
import { EXCLUSIVE_MTM_POST_REQUEST } from "../../store/modules/mtm/actions";
import MTMUpload from "../../components/mtm/upload_form";
const today = new Date();

export default {
  name: "ExclusiveMTM",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table,
    DateRangePicker: DateRangePicker,
    BModal: BModal,
    MTMUpload: MTMUpload
  },
  computed: {},
  data() {
    return {
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
      mtmList: [],
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Exclusive MTM",
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
          visibility: false,
          sort: true,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "startDate",
          label: "Start Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "endDate",
          label: "End Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "mtm",
          label: "MTM",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerName",
          label: "Dealer Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Action",
          label: "Action",
          width: "20%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      mtm: {},
      canEdit: false
    };
  },
  methods: {
    async toggleModal(data) {
      if (data) {
        this.mtm = data;
        this.canEdit = true;
      } else {
        this.mtm = {};
        this.canEdit = false;
      }
      console.log(this.mtm);
      this.$refs["mtm-upload-modal"].toggle("#toggle-btn");
    },
    formatDate: function(date) {
      return convertDateFormat(date, "DD-MM-YYYY");
    },
    getExclusiveMTMList() {
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");

      const pdata = {
        startDate: startDate,
        endDate: endDate
      };
      if (startDate !== "Invalid date" && endDate !== "Invalid date") {
        this.$store.dispatch(EXCLUSIVE_MTM_POST_REQUEST, pdata).then(res => {
          if (res.content && res.resultCode === 0) {
            this.mtmList = res.content;
          }
        });
      } else {
        Message({
          message: "Invalid date selection.",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getExclusiveMTMList();
    }
  },
  mounted() {
    this.getExclusiveMTMList();
  }
};
</script>
