<template>
  <div id="promoter-pending-list">
    <breadcrumb title="Dashboard" subtitle="Promoter Pending Approval" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="pendingList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getSalespersonList"
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
                      <div class="bold-text">No Pending Approvals Found!</div>
                    </template>
                    <template slot="status" slot-scope="props">
                      <lnvStatusTextBox :status="props.cell_value" />
                    </template>
                    <!-- <template slot="status" slot-scope="props">
                      <span
                        v-if="props.cell_value == 'Pending'"
                        class="label label-rounded label-warning"
                      >{{props.cell_value }}</span>
                      <span
                        v-if="props.cell_value == 'Approved'"
                        class="label label-rounded label-success"
                      >{{props.cell_value }}</span>
                      <span
                        v-if="props.cell_value == 'Rejected'"
                        class="label label-rounded label-danger"
                      >{{props.cell_value }}</span>
                    </template>-->

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="remarks" slot-scope="props">
                      <span>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <p v-html="props.row.remarks"></p>
                      </span>
                    </template>

                    <template slot="outlet" slot-scope="props">
                      <div class="inner-data">
                        <span>{{ props.row.outlet }}</span>
                        <br />
                        <span>{{ props.row.outletAddress }}</span>
                      </div>
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div class="inner-buttons float-left">
                        <button
                          v-if="props.row.status == 'Pending'"
                          type="button"
                          class="btn btn-info"
                          @click="doApproveReject(props.row, 1)"
                        >
                          <i class="fa fa-check color-info"></i>
                          Approve
                        </button>

                        <button
                          v-if="props.row.status == 'Pending'"
                          type="button"
                          class="btn btn-warning"
                          @click="doApproveReject(props.row, 0)"
                        >
                          <i class="fa fa-times color-warning"></i>
                          Reject
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
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import {
  PENDING_SALESP_LIST_REQUEST,
  PENDING_SALESP_STATUS_REQUEST
} from "../../store/modules/staff/actions";
import lnvStatusTextBox from "../../components/ui/statusTextBox";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { EventBus } from "@/utils/EventBus";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS
} from "../../store/modules/ui/actions";

export default {
  name: "PendingPromoterPage",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {},
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Pending Approvals",
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
          visibility: false,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "name",
          label: "Name",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "remarks",
          label: "Remarks",
          sort: true,
          width: "25%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletAddress",
          label: "Outlet Address",
          visibility: false
        },
        {
          name: "actionBy",
          label: "Approve/Rejected by",
          sort: true,
          width: "20%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "status",
          label: "Status",
          width: "9%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Action",
          label: "Action",
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      pendingList: [],
      salesp: {},
      isPromoLeader: false
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getSalespersonList();
    },
    getSalespersonList() {
      this.$store.dispatch(PENDING_SALESP_LIST_REQUEST, {}).then(res => {
        if (res.content && res.resultCode === 0) {
          this.pendingList = res.content;
          this.total = this.pendingList.length;
        }
      });
    },
    doApproveReject(row, status) {
      //this.$buefy.toast.open("User confirmed")
      this.$buefy.dialog.confirm({
        message: "Continue on this task?",
        onConfirm: () => {
          const data = {
            id: row.id,
            action: status
          };
          this.$store.dispatch(NOTIFICATION_REQUEST, {
            message: "Submitting..."
          });
          this.$store
            .dispatch(PENDING_SALESP_STATUS_REQUEST, data)
            .then(res => {
              if (res.resultCode === 0) {
                this.getSalespersonList();
                if (status === 1) {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: "Successfully Approved."
                  });
                } else {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: "Successfully Rejected."
                  });
                }
                EventBus.$emit("getUnreadData", 1);
              }
            });
        }
      });
    }
  },
  mounted() {
    this.isPromoLeader = this.$store.getters.isPromoLeader;

    //  alert(this.isPromoLeader);
    if (!this.isPromoLeader) {
      this.columns.splice(3, 0, {
        name: "dealer",
        label: "Dealer Name",
        sort: true,
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });

      this.columns.splice(4, 0, {
        name: "outlet",
        label: "Outlet Info",
        sort: true,
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }

    this.getSalespersonList();
  },
  created() {
    // this.getSalespersonList();
  }
};
</script>
