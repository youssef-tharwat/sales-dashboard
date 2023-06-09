<template>
  <div id="dealer-pic-list">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="dealerPicList"
          :columns="columns"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
          @refresh-data="getDealerPicList"
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
          <template slot="empty-results">No PIC found</template>

          <template slot="id" slot-scope="props">
            <span>{{ props.row.vbt_id }}</span>
          </template>

          <template slot="statusType" slot-scope="props">
            <lnvStatusTextBox :status="props.row.statusType" />
            <!-- <span
              class="label label-rounded label-success"
              v-if="props.row.statusType ==='ACTIVE'"
            >ACTIVE</span>
            <span
              class="label label-rounded label-danger"
              v-if="props.row.statusType ==='DEACTIVATED'"
            >DEACTIVE</span>-->
          </template>

          <template slot="picName" slot-scope="props">
            <div class="inner-data">
              <span class="bold-text">{{ props.row.picName }}</span>
              <br />
              <i class="fa fa-envelope-o"></i>
              {{ props.row.picEmail }}
              <br />
            </div>
          </template>
        </VueBootstrap4Table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import lnvStatusTextBox from "../../components/ui/statusTextBox";

export default {
  name: "DealerPicList",
  components: {
    VueBootstrap4Table: VueBootstrap4Table,
    lnvStatusTextBox: lnvStatusTextBox
  },
  props: {
    picList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {},
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Dealer PIC",
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
          visibility: false
        },
        {
          name: "picName",
          label: "PIC Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "statusType",
          label: "Status",
          width: 100,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          initial_sort: true, // "false" by default
          initial_sort_order: "asc" // "asc" by default
        }
      ],
      total: this.picList.length,
      dealerPicList: this.picList
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getDealerPicList();
    },
    getDealerPicList() {
      //   this.$store.dispatch(DEALER_LIST_REQUEST, {}).then(res => {
      //     if (res.content && res.resultCode === 0) {
      //       this.dealerList = res.content;
      //       this.total = this.dealerList.length;
      //     }
      //   });
    },

    formatDate: function(date) {
      return moment(String(date)).format("YYYY-MM-DD HH:MM A");
    }
  },
  mounted() {
    this.getDealerPicList();
  },
  created() {
    // this.getDealerPicList();
  }
};
</script>
