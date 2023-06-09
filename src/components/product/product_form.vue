<template>
  <div>
    <p
      v-if="canEdit && currectAction === 'edit'"
      class="required-title"
      v-text="$ml.get('form_required_title')"
    ></p>
    <form v-if="canEdit && currectAction === 'edit'" @submit.prevent="handleSubmit">
      <div class="row">
        <div v-if="isRegionAdmin && !product.productId" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_country_name')"></label>
            <span class="required-star">*</span>
            <Multiselect
              ref="multiselect"
              v-model="product.countryId"
              placeholder="Select Country"
              :searchable="true"
              :options="countries"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isCountriesLoading"
            ></Multiselect>
            <span v-if="formErrors.countryId" class="invalid-field">{{
              formErrors.countryId
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_family_name')"></label>
            <span class="required-star">*</span>
            <input
              id="name"
              v-model="product.name"
              name="name"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.name = ''"
            />
            <span v-if="formErrors.name" class="invalid-field">{{ formErrors.name }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_brands')"></label>
            <span class="required-star">*</span>
            <select
              id="productGroupId"
              v-model="product.productGroupId"
              style="display:none"
              class="form-control"
              @change="onPGroupChanged"
            >
              <option disabled selected value>Please Select Product Group</option>
              <option v-for="group of productGroups" :key="group.id" :value="group.id">
                {{
                  group.text
                }}
              </option>
            </select>
            <input
              id="productGroupText"
              v-model="product.productGroupText"
              type="text"
              name="productGroupText"
              class="form-control"
              @keyup="formErrors.productGroupText = ''"
            />

            <span v-if="formErrors.productGroupId" class="invalid-field">{{
              formErrors.productGroupId
            }}</span>
            <span v-if="formErrors.productGroupText" class="invalid-field">{{
              formErrors.productGroupText
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_series')"></label>
            <span class="required-star">*</span>
            <select
              id="productGroupId"
              v-model="product.productSubGroupId"
              style="display:none"
              class="form-control"
            >
              <option disabled selected value>Please Select Product Series</option>
              <option v-for="series of productSubGroups" :key="series.id" :value="series.id">
                {{
                  series.text
                }}
              </option>
            </select>
            <input
              id="productSubGroupText"
              v-model="product.productSubGroupText"
              type="text"
              name="productSubGroupText"
              class="form-control"
              @keyup="formErrors.productSubGroupText = ''"
            />
            <span v-if="formErrors.productSubGroupId" class="invalid-field">{{
              formErrors.productSubGroupId
            }}</span>
            <span v-if="formErrors.productSubGroupText" class="invalid-field">{{
              formErrors.productSubGroupText
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_product_type')"></label>
            <span class="required-star">*</span>
            <!-- <select v-model="product.deviceTypeId" id="ptype" class="form-control">
            <option disabled selected value>Please Select Product Type</option>
            <option v-for="ptype of productTypes" :key="ptype.id" :value="ptype.id">{{ptype.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect"
              v-model="product.deviceTypeId"
              placeholder="Select Product Type"
              :searchable="true"
              :options="productTypes"
              label="text"
              track-by="id"
              select-label
              deselect-label
            ></Multiselect>

            <span v-if="formErrors.deviceTypeId" class="invalid-field">{{
              formErrors.deviceTypeId
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_image_1')"></label>
            <input v-model="product.imageUrl1" type="url" class="form-control" placeholder />
            <img
              v-if="product.imageUrl1"
              :src="product.imageUrl1"
              alt="1"
              class="product-img"
              @error="replaceImageByDefault"
            />
            <span v-if="formErrors.imageUrl1" class="invalid-field">{{
              formErrors.imageUrl1
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_image_2')"></label>
            <input v-model="product.imageUrl2" type="url" class="form-control" placeholder />
            <img
              v-if="product.imageUrl2"
              :src="product.imageUrl2"
              alt="1"
              class="product-img"
              @error="replaceImageByDefault"
            />
            <span v-if="formErrors.imageUrl2" class="invalid-field">{{
              formErrors.imageUrl3
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_image_3')"></label>
            <input v-model="product.imageUrl3" type="text" class="form-control" placeholder />
            <img
              v-if="product.imageUrl3"
              :src="product.imageUrl3"
              alt="1"
              class="product-img"
              @error="replaceImageByDefault"
            />
            <span v-if="formErrors.imageUrl3" class="invalid-field">{{
              formErrors.imageUrl3
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_image_4')"></label>
            <input v-model="product.imageUrl4" type="url" class="form-control" placeholder />
            <img
              v-if="product.imageUrl4"
              :src="product.imageUrl4"
              alt="1"
              class="product-img"
              @error="replaceImageByDefault"
            />
            <span v-if="formErrors.imageUrl4" class="invalid-field">{{
              formErrors.imageUrl4
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_image_5')"></label>
            <input v-model="product.imageUrl5" type="url" class="form-control" placeholder />
            <img
              v-if="product.imageUrl5"
              :src="product.imageUrl5"
              alt="1"
              class="product-img"
              @error="replaceImageByDefault"
            />
            <span v-if="formErrors.imageUrl5" class="invalid-field">{{
              formErrors.imageUrl5
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_video_url')"></label>
            <input v-model="product.videoUrl" type="url" class="form-control" placeholder />
            <span v-if="formErrors.videoUrl" class="invalid-field">{{ formErrors.videoUrl }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_product_guide')"></label>
            <input
              type="file"
              accept="application/pdf"
              class="form-control"
              @change="onProductGuideChanged"
            />
            <span v-if="formErrors.productGuide" class="invalid-field">{{
              formErrors.productGuide
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">
              <br />
              <br />
              <span v-if="product.salesGuideUrl">
                <span v-if="product.uploadFileName">
                  <a class="lnv-link" target="_blank" :href="product.salesGuideUrl">
                    <b>{{ product.uploadFileName }}</b>
                  </a>
                </span>
                <span v-if="!product.uploadFileName">
                  <a class="lnv-link" target="_blank" :href="product.salesGuideUrl">
                    <b>{{ product.salesGuideUrl }}</b>
                  </a>
                </span>
              </span>
            </label>
          </div>
        </div>

        <div class="col-lg-12">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_features')"></label>
            <VueEditor v-model="product.features"></VueEditor>
            <span v-if="formErrors.features" class="invalid-field">{{ formErrors.features }}</span>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_tech_spec')"></label>
            <span class="required-star">*</span>
            <VueEditor v-model="product.techSpec"></VueEditor>
            <span v-if="formErrors.techSpec" class="invalid-field">{{ formErrors.techSpec }}</span>
          </div>
        </div>

        <div class="col-lg-12">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_product_model')"></label>
            <VueEditor v-model="product.model"></VueEditor>
            <span v-if="formErrors.model" class="invalid-field">{{ formErrors.model }}</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <button type="submit" class="btn btn-secondary pull-right">
            <span v-if="product.productId > 0" v-text="$ml.get('form_product_add_button')"></span>
            <span
              v-if="product.productId <= 0 || !product.productId"
              v-text="$ml.get('form_product_update_button')"
            ></span>
          </button>
          <button
            type="button"
            class="btn btn-light pull-right"
            data-dismiss="modal"
            @click="close()"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- <img style="display:none;" :src="product.imageUrl1" @error="validateImageUrl(1)" />
    <img style="display:none;" :src="product.imageUrl2" @error="validateImageUrl(2)" />
    <img style="display:none;" :src="product.imageUrl3" @error="validateImageUrl(3)" />
    <img style="display:none;" :src="product.imageUrl4" @error="validateImageUrl(4)" />
      <img style="display:none;" :src="product.imageUrl5" @error="validateImageUrl(5)" />-->
    </form>
  </div>
</template>

<script>
import { NEWS_IMAGE_UPLOAD_REQUEST } from "../../store/modules/news/actions";
import { PRODUCT_POST_REQUEST, PRODUCT_REQUEST } from "../../store/modules/product/actions";
import default_image from "../../assets/default_image.jpg";
import {
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_GROUP_LIST_REQUEST,
  COUNTRY_LIST_REQUEST
} from "../../store/modules/utility/actions";
import { VueEditor } from "vue2-editor";
import { Message } from "element-ui";

import Multiselect from "vue-multiselect";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR
} from "../../store/modules/ui/actions";

export default {
  components: {
    VueEditor: VueEditor,
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    productSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    canEdit: { type: Boolean },
    canView: { type: Boolean },
    currectAction: { type: String, default: "" }
  },
  computed: {},
  data() {
    return {
      product: {
        name: this.productSelected.name,
        productGroupId: this.productSelected.productGroupId,
        productSubGroupId: this.productSelected.productSubGroupId,
        deviceTypeId: this.productSelected.deviceTypeId,
        imageUrl1: this.productSelected.imageUrl1,
        imageUrl2: this.productSelected.imageUrl2,
        imageUrl3: this.productSelected.imageUrl3,
        imageUrl4: this.productSelected.imageUrl4,
        imageUrl5: this.productSelected.imageUrl5,
        videoUrl: this.productSelected.videoUrl,
        productSubGroupText: this.productSelected.productSubGroupText,
        productGroupText: this.productSelected.productGroupText,
        features: this.productSelected.features,
        techSpec: this.productSelected.techSpec,
        model: this.productSelected.model,
        productId: this.productSelected.id,
        salesGuideUrl: this.productSelected.salesGuideUrl,
        uploadFileName: this.productSelected.uploadFileName,
        countryId: this.productSelected.countryId
      },
      submitted: false,
      formErrors: [],
      productTypes: [],
      productGroups: [],
      productSubGroups: [],
      productGuideFile: {},
      base64GuideFile: null,
      image1Error: false,
      image2Error: false,
      image3Error: false,
      image4Error: false,
      image5Error: false,
      countryId: 0,
      countries: [],
      isCountriesLoading: false,
      isRegionAdmin: false
    };
  },
  methods: {
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    validateImageUrl(imageId) {
      switch (imageId) {
        case 1:
          if (this.product.imageUrl1) {
            this.image1Error = true;
            this.formErrors.imageUrl1 = this.$ml.get("form_product_invalid_image");
          } else {
            this.image1Error = false;
            this.formErrors.imageUrl1 = "";
          }
          break;
        case 2:
          if (this.product.imageUrl2) {
            this.image2Error = true;
          } else {
            this.image2Error = false;
          }
          break;
        case 3:
          if (this.product.imageUrl3) {
            this.image3Error = true;
          } else {
            this.image3Error = false;
          }
          break;
        case 4:
          if (this.product.imageUrl4) {
            this.image4Error = true;
          } else {
            this.image4Error = false;
          }
          break;
        case 5:
          if (this.product.imageUrl5) {
            this.image5Error = true;
          } else {
            this.image5Error = false;
          }
          break;
        default:
          break;
      }
    },
    imageExists(url, callback) {
      var img = new Image();
      img.onload = function() {
        callback(true);
      };
      img.onerror = function() {
        callback(false);
      };
      img.src = url;
    },
    close() {
      this.closeModal();
    },
    success() {
      this.close();
      this.loadData();
    },
    checkFormValidity() {
      this.formErrors = {};
      let error = 0;

      if (this.isRegionAdmin && !this.product.countryId) {
        this.formErrors.countryId = this.$ml.get("form_product_country_required");
        // this.$refs.nameDiv.scrollTop = 0;
        error++;
      }
      if (!this.product.name) {
        this.formErrors.name = this.$ml.get("form_product_family_name_required");
        // this.$refs.nameDiv.scrollTop = 0;
        error++;
      }

      // if (!this.product.productGroupId) {
      //   this.formErrors.productGroupId = "Brand is required.";
      //   error++;
      // }
      if (!this.product.productGroupText) {
        this.formErrors.productGroupText = this.$ml.get("form_product_brand_required");
        error++;
      }

      // if (!this.product.productSubGroupId) {
      //   this.formErrors.productSubGroupId = "Series is required.";
      //   error++;
      // }

      if (!this.product.productSubGroupText) {
        this.formErrors.productSubGroupText = this.$ml.get("form_product_series_required");
        error++;
      }

      if (!this.product.deviceTypeId) {
        this.formErrors.deviceTypeId = this.$ml.get("form_product_product_type_required");
        error++;
      }

      if (!this.product.techSpec) {
        this.formErrors.techSpec = this.$ml.get("form_product_tech_spec_required");
        error++;
      }

      // if (this.product.imageUrl1) {
      //   error++;
      //   this.imageExists(this.product.imageUrl1, exists => {
      //     if (!exists) {
      //       alert("a");
      //       this.formErrors.imageUrl1 = "Invalid image URL";
      //       error++;
      //     } else {
      //       error--;
      //     }
      //     alert("RESULT: url=" + this.product.imageUrl1 + ", exists=" + exists);
      //   });
      // }

      if (this.image2Error) {
        this.formErrors.imageUrl2 = this.$ml.get("form_product_invalid_image");
        error++;
      }

      if (this.image3Error) {
        this.formErrors.imageUrl3 = this.$ml.get("form_product_invalid_image");
        error++;
      }

      if (this.image4Error) {
        this.formErrors.imageUrl4 = this.$ml.get("form_product_invalid_image");
        error++;
      }

      if (this.image5Error) {
        this.formErrors.imageUrl5 = this.$ml.get("form_product_invalid_image");
        error++;
      }

      // if (!this.product.features) {
      //   this.formErrors.features = "Feature is required.";
      //   error++;
      // }

      // if (!this.product.techSpec) {
      //   this.formErrors.techSpec = "Tech spec is required.";
      //   error++;
      // }

      // if (!this.product.videoUrl) {
      // } else {
      //   if (urlValidate(this.product.videoUrl)) {
      //     this.formErrors.videoUrl = "Enter a valid video URL.";
      //     error++;
      //   }
      // }

      if (error) {
        // Message({
        //   message: "Validation failed.",
        //   type: "error",
        //   duration: 5 * 1000
        // });
        return false;
      } else {
        return true;
      }
    },
    handleReset() {},
    handleCancel() {},
    handleSubmit(e) {
      this.submitted = true;
      if (!this.checkFormValidity(e)) {
        return;
      } else {
        this.$store.dispatch(NOTIFICATION_REQUEST, {
          message: this.$ml.get("request_submitting")
        });
        this.product.salesGuidePdf = this.base64GuideFile;
        if (this.isRegionAdmin) {
          this.product.countryId = this.product.countryId ? this.product.countryId.id : null;
        } else {
          this.product.countryId = this.product.countryId;
        }

        this.$store.dispatch(PRODUCT_POST_REQUEST, this.product).then(res => {
          if (res.resultCode === 0) {
            this.success();
            if (this.product.productId) {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("product_updated")
              });
            } else {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("product_added")
              });
            }
            // Message({
            //   message: this.product.productId
            //     ? "Product Successfully Updated."
            //     : "Product Successfully Added.",
            //   type: "success",
            //   duration: 5 * 1000
            // });
            // this.uploadProductGuide(1, this.product.productId);
          } else {
            this.$store.dispatch(NOTIFICATION_ERROR, {
              message: this.$ml.get("product_submit_failed")
            });
            // Message({
            //   message: "Unable to submit product information, try again later.",
            //   type: "error",
            //   duration: 5 * 1000
            // });
          }
        });
      }
    },
    onProductGuideChanged(event) {
      this.productGuideFile = event.target.files[0];
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          this.base64GuideFile = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    uploadProductGuide(prodId, isUpdate) {
      if (this.productGuideFile && this.base64GuideFile) {
        this.$store
          .dispatch(NEWS_IMAGE_UPLOAD_REQUEST, {
            id: prodId,
            image: this.base64GuideFile
          })
          .then(res => {
            if (res.resultCode === 0) {
              this.success();
              Message({
                message: isUpdate ? "Product Successfully Updated." : "Product Successfully Added.",
                type: "success",
                duration: 5 * 1000
              });
            }
          });
      } else {
        this.success();
        Message({
          message: isUpdate ? "Product Successfully Updated." : "Product Successfully Added.",
          type: "success",
          duration: 5 * 1000
        });
      }
    },
    getProductTypes() {
      this.$store.dispatch(PRODUCT_TYPE_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.productTypes = res.content;
          this.product.deviceTypeId = this.getDataRowById(res.content, this.product.deviceTypeId);
        }
      });
    },
    getDataRowById(arr, id) {
      let c = arr.filter(function(elem) {
        if (elem.id == id) {
          return elem;
        }
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    getSelectedProductType(id) {
      let c = this.productTypes.filter(function(elem) {
        if (elem.id === id) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    getProductGroups() {
      this.$store.dispatch(PRODUCT_GROUP_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.productGroups = res.content;

          if (this.product.productGroupId > 0) {
            this.onPGroupChanged();
          }
        }
      });
    },
    onPGroupChanged() {
      // console.log(this.product.productGroupId);
      let c = {};
      c = this.productGroups.filter(x => x.id === this.product.productGroupId);
      if (c[0]) {
        this.productSubGroups = c[0].children;
      }

      // console.log(this.productSubGroups);
    },
    getProductById(id) {
      if (id > 0) {
        this.$store.dispatch(PRODUCT_REQUEST, { id: id }).then(res => {
          if (res.resultCode === 0) {
            // this.product = res.content;
            const product = res.content;
            this.product.productId = res.content.id;

            this.productname = product.name;
            this.productproductGroupId = product.productGroupId;
            this.productproductSubGroupId = product.productSubGroupId;
            this.productdeviceTypeId = product.deviceTypeId;
            this.productimageUrl1 = product.imageUrl1;
            this.productimageUrl2 = product.imageUrl2;
            this.productimageUrl3 = product.imageUrl3;
            this.productimageUrl4 = product.imageUrl4;
            this.productimageUrl5 = product.imageUrl5;
            this.productvideoUrl = product.videoUrl;
            this.productproductSubGroupText = product.productSubGroupText;
            this.productproductGroupText = product.productGroupText;
            this.productfeatures = product.features;
            this.producttechSpec = product.techSpec;
            this.productmodel = product.model;
            this.productproductId = product.id;
            this.productsalesGuideUrl = product.salesGuideUrl;
            this.productuploadFileName = product.uploadFileName;

            this.getProductTypes();
            this.getProductGroups();

            if (this.product.productGroupId > 0) {
              this.onPGroupChanged();
            }
          }
        });
      } else {
        this.getProductTypes();
        this.getProductGroups();

        if (this.product.productGroupId > 0) {
          this.onPGroupChanged();
        }
      }
    },
    getCountries() {
      this.isCountriesLoading = true;
      this.$store.dispatch(COUNTRY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.countries = res.content;
          this.isCountriesLoading = false;

          if (this.isRegionAdmin) {
            let c = this.countries.filter(elem => {
              if (elem.id === this.product.countryId) return elem;
            });

            this.product.countryId = c[0];
          }
        } else {
          this.isCountriesLoading = false;
        }
      });
    }
  },
  created() {
    // this.getProductTypes();
  },
  mounted() {
    this.countryId = this.$store.getters.getCountryId;
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.getCountries();
    if (this.product.productId) {
      this.getProductById(this.product.productId);
    } else {
      this.getProductTypes();
      this.getProductGroups();

      if (this.product.productGroupId > 0) {
        this.onPGroupChanged();
      }
    }
    // this.loadData();
  }
};
</script>
