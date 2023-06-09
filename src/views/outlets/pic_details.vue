<template>
  <div id="outlet-pic-list">
    <breadcrumb
      title="Dashboard"
      subtitle="Outlet Management"
      sub-sub-title="Outlet PIC Details"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div
                  class="col-lg-12 add-employee-button d-flex align-items-center"
                >
                  <b-field class="mr-auto" grouped group-multiline>
                    <div class="control">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">Outlet PIC</b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ total }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">Active</b-tag>
                        <b-tag type="is-success" size="is-large">
                          <strong>{{ outletPicListActive }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">
                          Deactivated
                        </b-tag>
                        <b-tag type="is-danger" size="is-large">
                          <strong>{{ outletPicListDeactivated }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">No Outlet</b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ outletPicListNoOutlet }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                  <button
                    class="btn btn-card btn-primary"
                    @click="toggleModal({})"
                  >
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_pic_outlet_title')"></span>
                  </button>
                  <button class="btn btn-card btn-primary" @click="doExport">
                    <i class="fa fa-file-excel-o"></i>
                    <span v-text="$ml.get('export_to_excel')"></span>
                  </button>
                </div>
              </div>
              <br />

              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="outletPicList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getoutletPicList"
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
                    <template
                      slot="empty-results"
                      v-text="$ml.get('no_outlet_found')"
                    ></template>

                    <template slot="picName" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{ props.row.picName }}</span>
                        <br />
                        <span>
                          <i class="fa fa-envelope-o"></i>
                          {{ props.row.picEmail }}
                        </span>
                      </div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="statusType" slot-scope="props">
                      <!-- <span>{{props.row.statusType}}</span> -->
                      <lnvStatusTextBox :status="props.row.statusType" />
                      <!-- <span
                        class="label label-rounded label-success"
                        v-if="props.row.statusType ==='ACTIVE'"
                        v-text="$ml.get('active_status_text')"
                      ></span>
                      <span
                        class="label label-rounded label-danger"
                        v-if="props.row.statusType ==='DEACTIVATED'"
                        v-text="$ml.get('deactive_status_text')"
                      ></span>-->
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div
                        class="inner-buttons btn-group float-right"
                        role="group"
                      >
                        <button
                          class="btn btn-warning btn-xs"
                          @click="toggleModal(props.row)"
                        >
                          <i class="fa fa-edit"></i>
                          <span v-text="$ml.get('button_edit_text')"></span>
                        </button>
                        <button
                          class="btn btn-info btn-xs"
                          @click="showOutlets(props.row)"
                        >
                          <i class="fa fa-building-o"></i>
                          &nbsp; Outlet ({{ props.row.dealerOutlets.length }})
                        </button>

                        <button
                          class="btn btn-danger btn-xs"
                          @click="doStatusChange(props.row)"
                        >
                          <i class="fa fa-exchange"></i>
                          <span v-text="$ml.get('button_status_text')"></span>
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

    <BModal ref="outlet-modal" size="lg" hide-footer :title="outletFormTitle">
      <picForm
        :close-modal="toggleModal"
        :selected-outlet="outlet"
        :load-data="getoutletPicList"
      />
    </BModal>

    <BModal ref="outlet-details-modal" size="lg" hide-footer title="Outlets">
      <VueBootstrap4Table
        :classes="classes"
        :rows="dealerOutlets"
        :columns="dealerOutletsColumns"
        :config="config"
        :total-rows="dealerOutletsTotal"
        @on-change-query="onChangeQuery2"
        @refresh-data="getDealerOutlets"
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
          <div
            v-if="isDataLoading"
            class="bold-text"
            v-text="$ml.get('no_outlet_found')"
          ></div>
          <div
            v-if="isDataLoading"
            class="bold-text"
            v-text="$ml.get('data_loading')"
          ></div>
        </template>

        <template slot="name" slot-scope="props">
          <div class="inner-data">
            <span class="bold-text">{{ props.row.name }}</span>
            <br />
            <span>{{ props.row.dealerCode }}</span>
            <br />
            <span>
              <i class="fa fa-map-marker"></i>
              {{ props.row.address }}
            </span>
          </div>
        </template>

        <template slot="Action" slot-scope="props">
          <button
            v-if="checkPicAssigned(props.row.id)"
            class="btn btn-danger btn-xs"
            @click="addOrRemoveOutlet(props.row, 0)"
          >
            <i class="fa fa-times"></i> REMOVE
          </button>
          <button
            v-if="!checkPicAssigned(props.row.id)"
            class="btn btn-success btn-xs"
            @click="addOrRemoveOutlet(props.row, 1)"
          >
            <i class="fa fa-plus"></i> ADD
          </button>
        </template>
      </VueBootstrap4Table>
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import picForm from "../../components/outlets/pic_form";
import { BModal } from "bootstrap-vue";

import {
  OUTLET_PIC_LIST_REQUEST,
  OUTLET_PIC_POST_REQUEST,
  OUTLET_LIST_REQUEST,
  OUTLET_POST_REQUEST
} from "../../store/modules/outlet/actions";
import { convertDateFormat } from "../../utils/helpers";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { export_json_to_excel } from "../../utils/Export2Excel";
import { Message } from "element-ui";
import lnvStatusTextBox from "../../components/ui/statusTextBox";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS
} from "../../store/modules/ui/actions";

export default {
  name: "OutletsPicPage",
  components: {
    breadcrumb: breadcrumb,
    picForm: picForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {},
  data() {
    return {
      outletFormTitle: "Add Outlet PIC",
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Outlet PIC",
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
          width: "5%",
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "picName",
          label: "PIC Name",
          sort: true,
          width: "35%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "picEmail",
          label: "PIC email",
          visibility: false
        },
        {
          name: "statusType",
          label: "Status",
          sort: true,
          width: "5%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Action",
          label: "Action",
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "address",
          label: "Address",
          visibility: false
        }
      ],
      dealerOutletsColumns: [
        {
          name: "id",
          label: "#",
          sort: true,
          visibility: false
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "name",
          label: "Outlet Info",
          width: "55%",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerCode",
          label: "Dealer Code",
          visibility: false
        },
        {
          name: "address",
          label: "Address",
          visibility: false
        },
        {
          name: "type",
          label: "Category",
          sort: true,
          width: "25%",
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
      outletPicList: [],
      outletPicListActive: 0,
      outletPicListDeactivated: 0,
      outletPicListNoOutlet: 0,
      outlet: {},
      dealerOutlets: [],
      dealerOutletsTotal: 0,
      assignedDealerOutlets: [],
      assignedDealerOutletsTotal: 0,
      isDealer: false,
      isDataLoading: false
    };
  },
  methods: {
    showModal() {
      this.$refs["outlet-modal"].show();
    },
    hideModal() {
      this.$refs["outlet-modal"].hide();
    },
    toggleModal(row) {
      if (row) {
        this.outlet = row;
        if (row.id) {
          this.outletFormTitle = "Update Outlet PIC";
        } else {
          this.outletFormTitle = "Add Outlet PIC";
        }
      } else {
        this.outlet = {};
        this.outletFormTitle = "Add Outlet PIC";
      }

      // if (row) {
      //   this.outlet = row;
      // } else {
      //   this.outlet = {};
      // }

      this.$refs["outlet-modal"].toggle("#toggle-btn");
    },
    showModalODetails() {
      this.$refs["outlet-details-modal"].show();
    },
    hideModalODetails() {
      this.$refs["outlet-details-modal"].hide();
    },
    toggleModalODetails() {
      this.$refs["outlet-details-modal"].toggle("#toggle-btn");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getoutletPicList();
    },
    onChangeQuery2(queryParams) {
      this.queryParams = queryParams;
      // this.getoutletPicList();
    },
    getoutletPicList() {
      this.outletPicList = [];
      this.isDataLoading = true;
      this.total = 0;
      this.$store.dispatch(OUTLET_PIC_LIST_REQUEST, {}).then(res => {
        if (res.content && res.resultCode === 0) {
          this.outletPicList = res.content;
          this.total = this.outletPicList.length;
          this.getStats();
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doEdit(row) {
      this.outlet = row;
      this.$refs["outlet-modal"].toggle("#toggle-btn");
    },
    doStatusChange(row) {
      this.$buefy.dialog.confirm({
        message:
          row.statusType == "ACTIVE"
            ? "Do you want to <b class='red-heighlighted'>deactivete</b> " +
              row.picName
            : "Do you want to <b class='red-heighlighted'>activete</b> " +
              row.picName,
        onConfirm: () => {
          //  this.$buefy.toast.open("User confirmed")
          row.change_status = true;
          this.$store.dispatch(OUTLET_PIC_POST_REQUEST, row).then(() => {
            this.getoutletPicList();
            Message({
              message:
                row.statusType == "ACTIVE"
                  ? "Outlet Deactivated."
                  : "Outlet Activated.",
              type: "success",
              duration: 5 * 1000
            });
          });
        }
      });
    },
    showOutlets(row) {
      // console.log(row.dealerOutlets);
      if (row) {
        this.outlet = row;
        this.getDealerOutlets(row);
        this.assignedDealerOutlets = row.dealerOutlets;
        this.assignedDealerOutletsTotal = row.dealerOutlets.length;
        this.$refs["outlet-details-modal"].toggle("#toggle-btn2");
      }
    },
    getDealerOutlets(pic) {
      // console.log(pic);
      let dealerOutlets = [];
      this.$store.dispatch(OUTLET_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          res.content.forEach(item => {
            if (
              (item.picName === pic.picName && item.status === "ACTIVE") ||
              (item.picName === null && item.status === "ACTIVE")
            ) {
              item.assigned = item.picName ? 1 : 0;
              dealerOutlets.push(item);
            }
          });

          dealerOutlets.sort(function(a, b) {
            return b.assigned - a.assigned;
          });

          this.dealerOutlets = dealerOutlets;

          // dealerOutlets.sort(function(a, b) {
          //   alert(a.picName + " " + b.picName);
          //   return a.picName < b.picName;
          // });
          // this.dealerOutlets = dealerOutlets;
          this.dealerOutletsTotal = this.dealerOutlets.length;
        }
      });
    },
    checkPicAssigned(id) {
      const hvPic = this.assignedDealerOutlets.filter(function(elem) {
        if (elem.id == id) return elem;
      });
      if (hvPic[0]) {
        return true;
      } else {
        return false;
      }
    },
    doDelete() {
      this.$buefy.dialog.confirm({
        message: "Do you want to delete thus item ",
        onConfirm: () => {}
      });
    },
    doExport() {
      const tHeader = ["ID", "PIC Name", "Dealer Name", "Status"];
      const filterVal = ["id", "picName", "dealerName", "statusType"];
      const data = this.formatJson(filterVal, this.outletPicList);
      const fileName = "outletPic";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "outletPic",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            return convertDateFormat(v[j], "YYYY-MM-DD");
          } else if (j === "statusType") {
            return v[j] === "ACTIVE" ? "Active" : "Deactive";
          } else {
            return v[j];
          }
        })
      );
    },
    addOrRemoveOutlet(row, state) {
      let pdata = {};
      pdata = row;
      pdata.outletPicId = {};
      if (state === 1) {
        pdata.outletPicId = this.outlet;
      } else {
        pdata.outletPicId = null;
      }
      // alert(JSON.stringify(pdata));
      pdata.change_outlet = true;
      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Submitting..."
      });

      // return false;
      this.$store.dispatch(OUTLET_POST_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.toggleModalODetails();
          this.getDealerOutlets(this.outlet);
          this.getoutletPicList();
          if (state) {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Outlet Successfully Added."
            });
          } else {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Outlet Successfully Removed."
            });
          }
          // Message({
          //   message: state
          //     ? "Outlet Successfully Added."
          //     : "Outlet Successfully Removed.",
          //   type: "success",
          //   duration: 5 * 1000
          // });
        }
      });
      //outletPicId
    },
    getStats() {
      this.outletPicListActive = 0;
      this.outletPicListDeactivated = 0;
      this.outletPicListNoOutlet = 0;

      this.outletPicList.filter(list => {
        // eslint-disable-next-line no-unused-expressions
        list.statusType == "ACTIVE"
          ? this.outletPicListActive++
          : list.statusType == "DEACTIVATED"
          ? this.outletPicListDeactivated++
          : "";
        // eslint-disable-next-line no-unused-expressions
        list.dealerOutlets == 0 ? this.outletPicListNoOutlet++ : "";
      });
    }
  },
  mounted() {
    this.isDealer = this.$store.getters.isDealer;
    this.getoutletPicList();
    // this.getDealerOutlets();

    if (!this.isDealer) {
      this.columns.splice(2, 0, {
        name: "dealerName",
        label: "Dealer Name",
        sort: true,
        width: "30%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }
  },
  created() {
    // this.getoutletPicList();
  }
};
</script>
