<template>
  <div id="upload-receipt">
    <breadcrumb
      title="Dashboard"
      subtitle="Generate Incentive Payable"
      sub-sub-title="Upload Receipt"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-4">
                  <label class="text-label" v-text="$ml.get('title_year')"></label>
                  <Multiselect
                    ref="multiselect-nyr"
                    v-model="selectedYear"
                    placeholder="Select Year"
                    :searchable="true"
                    :options="yearList"
                    label="text"
                    track-by="id"
                    select-label
                    deselect-label
                    @input="getUploadList"
                  ></Multiselect>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="uploadList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getUploadList"
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

                    <template slot="no" slot-scope="props">
                      {{ props.row.month }}
                    </template>
                    <template slot="month" slot-scope="props">
                      {{ formatDateToMonth(props.row.month) }}
                    </template>
                    <template slot="edit" slot-scope="props">
                      <div
                        v-if="props.row.totalDealer > 0"
                        role="group"
                        class="inner-buttons btn-group float-right"
                      >
                        <button
                          class="btn btn-info btn-xs"
                          @click.prevent="openDealerList(props.row)"
                        >
                          View & Upload
                        </button>
                        <br />
                        <button
                          class="btn btn-warning btn-xs"
                          @click.prevent="openFileSelection(null, props.row.month)"
                        >
                          Batch Upload
                        </button>
                        <input
                          id="fileInput"
                          ref="fileInput"
                          type="file"
                          accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                          style="display:none"
                          name="file"
                          @change="fileUpload"
                        />
                      </div>
                      <span v-if="props.row.updatedDate" class="float-left text-sm-left">
                        Last upload on {{ props.row.updatedDate }}
                      </span>
                    </template>
                  </VueBootstrap4Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BModal ref="dealer-modal" size="lg" hide-footer title="Dealer List">
      <div>
        <VueBootstrap4Table
          :classes="classes"
          :rows="selectedDealerList"
          :columns="columns1"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
          @refresh-data="getUploadList"
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
            <div class="bold-text">No Dealer Found!</div>
          </template>

          <template slot="name" slot-scope="props">
            <div class="inner-data">
              <span class="bold-text">{{ props.row.name }}</span>
              <br />
              <span>{{ props.row.prmLppName }}</span>
              <br />
              <i class="fa fa-suitcase" aria-hidden="true"></i>
              <span>{{ " " }} {{ props.row.businessRegNo }}</span>
            </div>
          </template>
          <template slot="fileUrl" slot-scope="props">
            <div v-if="props.row.fileUrl">
              <a class="btn btn-info" :href="props.row.fileUrl" target="_blank">
                View
              </a>
            </div>
            <div v-else>
              <button class="btn btn-info" @click="openFileSelection(props.row, null)">
                Upload
              </button>
              <input
                id="imgInput"
                ref="imgInput"
                type="file"
                accept="image/gif, image/jpeg, image/png"
                style="display:none"
                name="image"
                @change="uploadReceipt"
              />
            </div>
          </template>
        </VueBootstrap4Table>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <button type="btn" class="btn btn-primary btn-sm" @click="modalToggle(true)">Close</button>
      </div>
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";
import { convertDateFormat } from "../../utils/helpers";
import {
  DEALER_INC_RECEIPT_LIST_REQUEST,
  RECEIPT_UPLOAD_BY_DEALER_REQUEST,
  RECEIPT_UPLOAD_BY_MONTH_REQUEST
} from "../../store/modules/dealer/actions";
import Multiselect from "vue-multiselect";

export default {
  name: "UploadReceipt",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table,
    Multiselect: Multiselect,
    BModal
  },
  data() {
    return {
      uploadList: [],
      total: 0,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Incentives Promoter",
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
          name: "no",
          label: "No",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "month",
          label: "Month",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalDealer",
          label: "Total Dealer",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalUploaded",
          label: "Uploaded",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalNotUploaded",
          label: "Not Uploaded",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "edit",
          label: "Action",
          width: "20%",
          sort: true,
          row_text_alignment: "text-center",
          column_text_alignment: "text-left"
        }
      ],
      columns1: [
        {
          name: "name",
          label: "Dealer Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalAmount",
          label: "Total Amount",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "fileUrl",
          label: "Action",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      search: {},
      yearList: [],
      month: new Date().getMonth(),
      selectedYear: {
        id: new Date().getFullYear(),
        text: new Date().getFullYear()
      },
      selectedMonth: 0,
      selectedDealerList: [],
      selectedDealer: []
    };
  },
  methods: {
    async getUploadList() {
      let pData = {
        year: this.selectedYear.id
      };
      // this.uploadList = [];
      // console.log(pData);
      const res = await this.$store.dispatch(DEALER_INC_RECEIPT_LIST_REQUEST, pData);
      if (res.resultCode === 0) {
        this.uploadList = await res.content;
        this.total = this.uploadList.length;
      }
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getUploadList();
    },
    openDealerList(data) {
      // console.log(data);
      this.selectedDealerList = data ? data.listAll : [];
      this.selectedMonth = data ? data.month : 0;
      this.modalToggle(false);
    },
    formatDateToMonth: function(date) {
      let month = date.toString().length < 2 ? "0" + date : date.toString();
      return convertDateFormat(month, "MMM");
    },
    setYears() {
      const yearRange = this.selectedYear.id - 3;
      for (let i = 0; i <= 6; i++) {
        let yr = yearRange + i;
        // this.yearList.push(yr);
        this.yearList.push({ id: yr, text: yr });
      }
      return this.yearList;
    },
    modalToggle(isClose) {
      if (isClose) {
        this.selectedDealerList = [];
        this.selectedDealer = [];
        this.selectedMonth = 0;
      }
      this.$refs["dealer-modal"].toggle();
    },
    openFileSelection(dealer, month) {
      if (dealer) {
        this.selectedDealer = dealer;
        this.$refs.imgInput.click();
      } else {
        this.selectedMonth = month;
        this.$refs.fileInput.click();
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(btoa(reader.result));
        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
      });
    },
    async uploadReceipt(event) {
      const file = await event.target.files[0];
      this.getBase64(file).then(data => {
        let pData = {
          dealerId: this.selectedDealer.dealerId,
          month: this.selectedMonth,
          year: this.selectedYear.id,
          fileBase64: data
        };
        // console.log(pData);
        this.$store.dispatch(RECEIPT_UPLOAD_BY_DEALER_REQUEST, pData).then(res => {
          if (res.resultCode === 0) {
            this.getUploadList();
            this.refreshSelectedDealerList();
          }
        });
      });
    },
    refreshSelectedDealerList() {
      const temp = this.selectedDealerList;
      this.selectedDealerList = this.uploadList.filter(obj => {
        return obj.month === temp.month;
      });
    },
    async fileUpload(event) {
      const file = await event.target.files[0];
      this.getBase64(file).then(data => {
        let pData = {
          month: this.selectedMonth,
          year: this.selectedYear.id,
          fileBase64: data
        };
        // console.log(pData);
        this.$store.dispatch(RECEIPT_UPLOAD_BY_MONTH_REQUEST, pData).then(res => {
          if (res.resultCode === 0) {
            this.getUploadList();
          }
        });
      });
    }
  },
  mounted() {
    this.setYears();
    this.getUploadList();
  }
};
</script>
<style lang="scss"></style>
