<template>
  <div id="promoter-outlet-list">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="
            isRegionAdmin
              ? promoterSelected.promoterOutlets
              : promoterOutletList
          "
          :columns="columns"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
          @refresh-data="getPromoterOutletList"
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
          <template v-if="!isLoadingOutlets" slot="empty-results">
            No Outlets found
          </template>
          <div
            v-if="isLoadingOutlets"
            class="bold-text"
            v-text="$ml.get('data_loading')"
          ></div>

          <template slot="id" slot-scope="props">
            <span>{{ props.row.id }}</span>
          </template>

          <template slot="dealerName" slot-scope="props">
            <div class="inner-data">
              <span class="bold-text">{{ props.row.dealerName }}</span>
              <br />
              <span>{{ props.row.lppCode }}</span>
            </div>
          </template>
          <template slot="name" slot-scope="props">
            <div class="inner-data">
              <span class="bold-text">{{ props.row.name }}</span>
              <br />
              <span>{{ props.row.dealerCode }}</span>
              <br />
              <span v-if="props.row.address">
                <i class="fa fa-map-marker"></i>
                {{ props.row.address }}
              </span>
            </div>
          </template>

          <template slot="Action" slot-scope="props">
            <button
              v-if="!props.row.assigned"
              class="btn btn-success btn-xs"
              @click="addOrRemoveOutlet(props.row, 1)"
            >
              <i class="fa fa-plus"></i> ASSIGN
            </button>
            <button
              v-if="props.row.assigned"
              class="btn btn-danger btn-xs"
              @click="addOrRemoveOutlet(props.row, 0)"
            >
              <i class="fa fa-close"></i> REMOVE
            </button>
          </template>
        </VueBootstrap4Table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { OUTLET_LIST_REQUEST } from "../../store/modules/outlet/actions";

import { POST_PROMOTER_OUTLET_REQUEST } from "../../store/modules/staff/actions";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS
} from "../../store/modules/ui/actions";

export default {
  name: "PromoterOutlets",
  components: {
    VueBootstrap4Table: VueBootstrap4Table
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    promoterSelected: {
      type: Object,
      default: () => {
        return {};
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
        card_title: "Outlets",
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
          name: "dealerName",
          label: "Dealer Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "name",
          label: "Outlet Info",
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
          name: "address",
          label: "Address",
          visibility: false
        }
      ],
      total: 0,
      promoterOutletList: [],
      promoter: this.promoterSelected,
      assignedOutlets: this.promoterSelected.promoterOutlets,
      assignedOutletsTotal: this.promoterSelected.promoterOutlets.length,
      isRegionAdmin: false,
      isLoadingOutlets: false
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getPromoterOutletList();
    },
    getPromoterOutletList() {
      let lst = [];
      this.isLoadingOutlets = true;
      this.$store.dispatch(OUTLET_LIST_REQUEST).then(res => {
        if (res.resultCode === 0) {
          res.content.forEach(item => {
            item.assigned = this.checkOutletAssigned(item.id);

            lst.push(item);
          });

          // this.promoterOutletList.sort((a, b) =>
          //   a.assigned > b.assigned ? 1 : -1
          // );

          lst.sort(function(a, b) {
            return b.assigned - a.assigned;
          });

          this.promoterOutletList = lst;
          this.total = this.promoterOutletList.length;
          this.isLoadingOutlets = false;
        } else {
          this.isLoadingOutlets = false;
        }
      });
    },
    checkOutletAssigned(id) {
      const hvPic = this.assignedOutlets.filter(function(elem) {
        if (elem.outletId == id) return elem;
      });
      if (hvPic[0]) {
        return true;
      } else {
        return false;
      }
    },
    addOrRemoveOutlet(row, type) {
      let pdata = {};

      if (type === 0) {
        pdata.type = 0;
      } else {
        pdata.type = 1;
      }

      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Submitting..."
      });

      pdata.outletId = row.id;
      pdata.accId = this.promoter.id;

      this.$store.dispatch(POST_PROMOTER_OUTLET_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.success();
          if (pdata.type === 1) {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Outlet Assigned."
            });
          } else {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Outlet Removed."
            });
          }

          // this.$store.dispatch(NOTIFICATION_CLOSE, {
          //   message: ""
          // });
        }
      });
    },
    formatDate: function(date) {
      return moment(String(date)).format("YYYY-MM-DD HH:MM A");
    },
    close() {
      this.closeModal();
    },
    success() {
      this.close();
      this.loadData();
    }
  },
  mounted() {
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;

    if (!this.isRegionAdmin) {
      this.columns.push({
        name: "Action",
        label: "Action",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }
    this.getPromoterOutletList();
    // alert(JSON.stringify(this.assignedOutlets));
  },
  created() {
    // this.getLeaderPromotersList();
  }
};
</script>
