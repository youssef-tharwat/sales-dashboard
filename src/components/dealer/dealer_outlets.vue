<template>
  <div id="dealer-outlet-list">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="outletList"
          :columns="columns"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
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
          <template slot="empty-results">No Outlet found</template>

          <template slot="id" slot-scope="props">
            <span>{{ props.row.vbt_id }}</span>
          </template>

          <template slot="status" slot-scope="props">
            <lnvStatusTextBox :status="props.row.status" />
            <!-- <span
              class="label label-rounded label-success"
              v-if="props.row.status ==='ACTIVE'"
            >ACTIVE</span>
            <span
              class="label label-rounded label-danger"
              v-if="props.row.status ==='DEACTIVATED'"
            >DEACTIVE</span>-->
          </template>

          <template slot="name" slot-scope="props">
            <div class="inner-data">
              <span class="bold-text">{{ props.row.name }}</span>
              <br />
              <i class="fa fa-map-marker"></i>
              {{ props.row.address }}
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
  name: "DealerOutletList",
  components: {
    VueBootstrap4Table: VueBootstrap4Table,
    lnvStatusTextBox: lnvStatusTextBox
  },
  props: {
    outletList: {
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
        card_title: "Dealer Outlets",
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
          name: "name",
          label: "Outlet Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "picName",
          label: "PIC Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "type",
          label: "Category",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "status",
          label: "Status",
          width: 100,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          initial_sort: true, // "false" by default
          initial_sort_order: "asc" // "asc" by default
        }
      ],
      total: this.outletList.length,
      dealerOutletList: this.outletList
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getDealerOutletList();
    },
    getDealerOutletList() {
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
    this.getDealerOutletList();
  },
  created() {
    // this.getDealerOutletList();
  }
};
</script>
