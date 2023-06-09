<template>
  <div id="product-list">
    <breadcrumb title="Dashboard" subtitle="Product Management" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-12 add-employee-button">
                  <button
                    v-if="canAdd"
                    class="btn btn-xs btn-primary"
                    @click="toggleModal(null)"
                  >
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_product_title')"></span>
                  </button>
                  <button
                    v-if="canAdd"
                    class="btn btn-xs btn-primary"
                    @click="toggleUploadModal"
                  >
                    <i class="fa fa-upload"></i>
                    <span v-text="$ml.get('button_upload_title')"></span>
                  </button>
                </div>
              </div>
              <br />

              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="productList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getproductList"
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
                        v-if="!isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('no_product_found')"
                      ></div>
                      <div
                        v-if="isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('data_loading')"
                      ></div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>
                    <template slot="name" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{ props.row.name }}</span>
                      </div>
                    </template>
                    <template slot="imageUrl1" slot-scope="props">
                      <div v-viewer class="media-img-container mr-3">
                        <img
                          class="img-fluid"
                          :src="
                            props.cell_value ? props.cell_value : defaultImage
                          "
                          alt="Product"
                          @error="replaceImageByDefault"
                        />
                      </div>
                    </template>

                    <template slot="bActive" slot-scope="props">
                      <!-- <span v-if="!props.row.bActive">DEACTIVE</span>
                      <span v-if="props.row.bActive">ACTIVE</span>-->
                      <lnvStatusTextBox :active="props.row.bActive" />
                      <!-- <span
                        class="label label-rounded label-success"
                        v-if="props.row.bActive"
                        v-text="$ml.get('active_status_text')"
                      ></span>
                      <span
                        class="label label-rounded label-danger"
                        v-if="!props.row.bActive"
                        v-text="$ml.get('deactive_status_text')"
                      ></span>-->
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div
                        class="inner-buttons btn-group float-right"
                        role="group"
                      >
                        <button
                          v-if="canEdit"
                          class="btn btn-warning btn-xs"
                          @click="toggleModal(props.row)"
                        >
                          <i class="fa fa-edit"></i>
                          <span v-text="$ml.get('button_edit_text')"></span>
                        </button>

                        <button
                          v-if="canChangeStatus"
                          class="btn btn-danger btn-xs"
                          @click="doChangeStatus(props.row)"
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

    <BModal ref="product-modal" size="lg" hide-footer :title="setFormTitle">
      <productForm
        :close-modal="toggleModal"
        :product-selected="product"
        :load-data="getproductList"
        :can-edit="canEdit"
        :can-view="canView"
        :currect-action="currectAction"
      />
    </BModal>

    <BModal ref="upload-modal" size="xl" hide-footer title="Upload">
      <excelUploadForm
        :close-modal="toggleUploadModal"
        :validations="validateFields"
        :sample-file="sampleFile"
        :content="content"
        :set-post-data="setPostData"
        :show-data-list="true"
        :submit-button-text="'Submit'"
        :get-upload-file="getUploadFile"
        :file-columns="fileColumnStructure"
        :country-id="countryId"
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import productForm from "../../components/product/product_form";
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import excelUploadForm from "../../components/excel_upload/index";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_POST_REQUEST,
  PRODUCT_BULK_POST_REQUEST
} from "../../store/modules/product/actions";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { export_json_to_excel } from "../../utils/Export2Excel";
import { PRODUCT_TYPE_LIST_REQUEST } from "../../store/modules/utility/actions";
import default_image from "../../assets/default_image.jpg";
import "viewerjs/dist/viewer.css";
import lnvStatusTextBox from "../../components/ui/statusTextBox";
import { convertDateFormat } from "../../utils/helpers";

export default {
  name: "ProductsPage",
  components: {
    breadcrumb: breadcrumb,
    productForm: productForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    excelUploadForm: excelUploadForm,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    // setFormTitle() {
    //   if (this.product.id) {
    //     return "Edit Product";
    //   } else {
    //     return "Add Product";
    //   }
    // }
  },
  data() {
    return {
      defaultImage: default_image,
      sampleFile: "productInformationUpload.xlsx",
      content:
        "Your EXCEL data file should contain all the columns specific to the operation you are performing. The sample EXCEL file has most of the columns required for the operation. Do not edit the colunm labels in the sample file and make sure the file extasion is .xlsx file.",
      excel_fields: {
        No: "id",
        Family_Name: "name",
        Brand: "productGroupId",
        Series: "productSubGroupId",
        Product_Type: "deviceType"
      },
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Products",
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
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "imageUrl1",
          label: "Image",
          width: "10%"
        },
        {
          name: "name",
          label: "Family Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          width: "20%"
        },
        {
          name: "productGroupText",
          label: "Brands",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "productSubGroupText",
          label: "Series",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "deviceType",
          label: "Product Type",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "bActive",
          label: "Status",
          sort: true,
          width: "80px",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      fileColumnStructure: [
        "Family Name",
        "Brands",
        "Series",
        "Product type",
        "Features",
        "Specs",
        "Available Model",
        "Image URL 1",
        "Image URL 2",
        "Image URL 3",
        "Image URL 4",
        "Image URL 5",
        "Video URL"
      ],
      total: 0,
      productList: [],
      productGroups: [],
      productSubGroups: [],
      product: {},
      postProductData: [],
      productFormTitle: "Add Product",
      countryId: 0,
      productTypes: [],
      canEdit: false,
      canAdd: false,
      canChangeStatus: false,
      isCountryAdmin: false,
      isRegionAdmin: false,
      currectAction: false,
      canView: false,
      setFormTitle: "Add Product",
      isDataLoading: false,
      isAgency: false,
      isAdmin: false
    };
  },
  methods: {
    showModal() {
      // this.product = {};
      this.$refs["product-modal"].show();
    },
    hideModal() {
      // this.product = {};
      this.$refs["product-modal"].hide();
    },
    toggleModal(row, view) {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      // this.product = {};
      if (row) {
        this.product = row;
        if (view) {
          this.currectAction = "view";
          this.setFormTitle = "View Product";
        } else {
          this.currectAction = "edit";
          this.setFormTitle = "Edit Product";
        }
      } else {
        this.product = {};
        this.setFormTitle = "Add Product";
        this.currectAction = "edit";
      }

      this.$refs["product-modal"].toggle("#toggle-btn");
    },
    toggleUploadModal() {
      this.$refs["upload-modal"].toggle("#toggle-btn2");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getproductList();
    },
    getproductList() {
      this.productList = [];
      this.total = 0;
      this.isDataLoading = true;
      this.$store.dispatch(PRODUCT_LIST_REQUEST, {}).then(res => {
        if (res.content && res.resultCode === 0) {
          this.productList = res.content.productInfo;
          this.productGroups = res.content.productGroups;
          this.total = this.productList.length;
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    doEdit(row) {
      this.product = row;
      this.$refs["product-modal"].toggle("#toggle-btn");
    },
    doChangeStatus(row) {
      this.$buefy.dialog.confirm({
        message: row.bActive
          ? "Do you want to <b class='red-heighlighted'>deactivete</b> " +
            row.name
          : "Do you want to <b class='red-heighlighted'>activete</b> " +
            row.name,
        onConfirm: () => {
          //  this.$buefy.toast.open("User confirmed")
          row.status = true;
          this.$store.dispatch(PRODUCT_POST_REQUEST, row).then(() => {
            this.getproductList();
            Message({
              message: row.bActive
                ? "Product Deactivated."
                : "Product Activated.",
              type: "success",
              duration: 5 * 1000
            });
          });
        }
      });
    },
    doDelete(row) {
      this.$buefy.dialog.confirm({
        message: "Do you want to delete " + row.name,
        onConfirm: () => {
          //  this.$buefy.toast.open("User confirmed")
        }
      });
    },
    doExport() {
      const tHeader = [
        "Family Name",
        "Brands",
        "Series",
        "Product Type",
        "Features",
        "Specs",
        "Available Model",
        "Image URL 1",
        "Image URL 2",
        "Image URL 3",
        "Image URL 4",
        "Image URL 5",
        "Video URL"
      ];
      const filterVal = [
        "name",
        "productGroupText",
        "productSubGroupText",
        "deviceType",
        "features",
        "techSpec",
        "model",
        "imageUrl1",
        "imageUrl2",
        "imageUrl3",
        "imageUrl4",
        "imageUrl5",
        "videoUrl"
      ];
      const data = this.formatJson(filterVal, this.productList);
      const fileName = "productInformation";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "productInformation",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            return convertDateFormat(v[j], "YYYY-MM-DD");
          } else {
            return v[j];
          }
        })
      );
    },
    validateFields(value, field) {
      //   return true;
      let isValid = false;
      switch (field) {
        case "Family Name":
          isValid = value ? true : false;
          break;
        case "Brands":
          isValid = value ? true : false;
          break;
        case "Series":
          isValid = value ? true : false;
          break;
        case "Product type":
          isValid = this.isValidDeviceType(value);
          break;
        case "Features":
          isValid = true;
          break;
        case "Specs":
          isValid = true;
          break;
        case "Available Model":
          isValid = true;
          break;
        case "Image URL 1":
          isValid = this.isValidURL(value); //true;
          break;
        case "Image URL 2":
          isValid = this.isValidURL(value); //true;
          break;
        case "Image URL 3":
          isValid = this.isValidURL(value); //true;
          break;
        case "Image URL 4":
          isValid = this.isValidURL(value); //true;
          break;
        case "Image URL 5":
          isValid = this.isValidURL(value); //true;
          break;
        case "Video URL":
          isValid = this.isValidURL(value); //true;
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
    isValidURL(url) {
      if (!url) {
        return true;
      }
      var r = /^(http|https):\/\/[^ "]+$/;
      return r.test(url);
    },
    isValidDeviceType(name) {
      let cat = this.productTypes.filter(function(elem) {
        if (elem.text == name) return elem;
      });
      if (cat[0]) {
        return cat[0];
      } else {
        return false;
      }
      // eslint-disable-next-line no-unreachable
      return false;
    },
    getProductTypes() {
      this.$store.dispatch(PRODUCT_TYPE_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.productTypes = res.content;
        }
      });
    },
    setPostData(pdata) {
      let tdata = [];

      pdata.forEach(row => {
        let deviceType = this.isValidDeviceType(row[3]);

        if (!deviceType) {
          Message({
            message: "Invalid device type (" + row[3] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else {
          // console.log(row);
          // return;
          tdata.push({
            bActive: true,
            productGroupId: 0,
            productSubGroupId: 0,
            description: "",
            detailDescription: "",
            name: row[0],
            ownerIcOrId: 8,
            imageFilename: "",
            deviceTypeId: deviceType ? deviceType.id : null,
            model: row[6],
            techSpec: row[5],
            features: row[4],
            imageUrl1: row[7],
            imageUrl2: row[8],
            imageUrl3: row[9],
            imageUrl4: row[10],
            imageUrl5: row[11],
            productSubGroupText: row[2],
            productGroupText: row[1],
            videoUrl: row[12],
            countryId: this.countryId
          });

          // console.log(tdata);
        }
      });

      this.postProductData = tdata;
      if (this.postProductData.length > 0) {
        this.submitProductData();
      }
    },
    submitProductData() {
      let pdata = {};
      pdata = this.postProductData;

      this.$store.dispatch(PRODUCT_BULK_POST_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.getproductList();
          this.toggleUploadModal();
          return Message({
            message: "Products Successfully Added.",
            type: "success",
            duration: 5 * 1000
          });
        }
      });
    },
    getUploadFile() {}
  },
  mounted() {
    this.countryId = this.$store.getters.getCountryId;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isAgency = this.$store.getters.isAgency;
    this.isAdmin = this.$store.getters.isAdmin;

    if (this.isCountryAdmin || this.isAgency) {
      this.canEdit = true;
      this.canView = false;
      this.canAdd = false;
      this.canChangeStatus = false;
    } else if (this.isRegionAdmin || this.isAdmin) {
      this.canEdit = true;
      this.canView = true;
      this.canAdd = true;
      this.canChangeStatus = true;
    }
    if (!this.isAgency) {
      this.columns.push({
        name: "Action",
        label: "Action",
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }

    this.getproductList();
    this.getProductTypes();
  },
  created() {
    // this.getproductList();
  }
};
</script>
