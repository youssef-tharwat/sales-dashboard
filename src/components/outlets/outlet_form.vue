<template>
  <div>
    <p class="required-title" v-text="$ml.get('form_required_title')"></p>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_name')"></label>
            <span class="required-star">*</span>
            <input
              v-model="outlet.name"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.name = ''"
            />
            <span v-if="formErrors.name" class="invalid-field">{{ formErrors.name }}</span>
          </div>
        </div>
        <div v-if="showDealerField" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_dealer_name')"></label>
            <span class="required-star">*</span>
            <!-- <select v-model="outlet.dealerId" @change="filterPICs" id="dealerId" class="form-control">
            <option disabled selected value>Please Select Dealer</option>
            <option
              v-for="(dealer, index) of dealerList"
              :value="dealer.id"
              :key="index"
            >{{dealer.dealerName}}</option>
            </select>-->
            <Multiselect
              ref="multiselect"
              v-model="outlet.dealerId"
              placeholder="Select Dealer"
              :searchable="true"
              :options="dealerList"
              label="dealerName"
              track-by="id"
              select-label
              deselect-label
              :loading="isDealersLoading"
              @input="filterPICs"
            ></Multiselect>
            <span v-if="formErrors.dealerId" class="invalid-field">{{ formErrors.dealerId }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_category')"></label>
            <span class="required-star">*</span>
            <!-- <select v-model="outlet.typeId" id="categoryId" class="form-control">
            <option disabled selected value>Please Select Category</option>
            <option
              v-for="(category, index) of categoryList"
              :value="category.id"
              :key="index"
            >{{category.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect-type"
              v-model="outlet.typeId"
              placeholder="Select Type"
              :searchable="true"
              :options="categoryList"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isCategoryLoading"
            ></Multiselect>
            <span v-if="formErrors.typeId" class="invalid-field">{{ formErrors.typeId }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_state')"></label>
            <span class="required-star">*</span>
            <!-- <select v-model="outlet.stateId" id="stateId" class="form-control">
            <option disabled selected value>Please Select State</option>
            <option
              v-for="(state, index) of stateList"
              :value="state.id"
              :key="index"
            >{{state.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect-state"
              v-model="outlet.stateId"
              placeholder="Select State"
              :searchable="true"
              :options="stateList"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isStatesLoading"
            ></Multiselect>
            <span v-if="formErrors.stateId" class="invalid-field">{{ formErrors.stateId }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_area')"></label>
            <span class="required-star">*</span>
            <input
              v-model="outlet.area"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.area = ''"
            />
            <span v-if="formErrors.area" class="invalid-field">{{ formErrors.area }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_postcode')"></label>
            <span class="required-star">*</span>
            <input
              v-model="outlet.postCode"
              v-validate="'integer'"
              name="Postcode"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.postCode = ''"
            />
            <span v-if="formErrors.postCode" class="invalid-field">{{ formErrors.postCode }}</span>
            <span v-if="errors.first('Postcode')" class="invalid-field">
              {{ errors.first("Postcode") }}
            </span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_address')"></label>
            <span class="required-star">*</span>
            <div class="d-flex align-items-center">
              <input
                v-model="outlet.address"
                type="text"
                class="form-control"
                placeholder
                @keyup="formErrors.address = ''"
                @change="initGeoCoding()"
              />

              <b-button
                type="button"
                class="btn addressRefreshButton btn-sm"
                @click="initGeoCoding()"
                v-text="$ml.get('form_outlet_update_map')"
              ></b-button>
            </div>

            <!-- <GmapAutocomplete
              :value="outlet.address"
              class="form-control"
              @place_changed="setPlace"
            ></GmapAutocomplete>-->
            <span v-if="formErrors.address" class="invalid-field">{{ formErrors.address }}</span>
          </div>
        </div>
        <div v-if="!isPicOutlet && !isCountryAdmin" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_pic_name')"></label>
            <!-- <select v-model="outlet.outletPicId" id="outletPicId" class="form-control">
            <option disabled selected value>Please Select PIC</option>
            <option v-for="(pic, index) of picList" :value="pic.id" :key="index">{{pic.picName}}</option>
            </select>-->
            <Multiselect
              ref="multiselect-pic"
              v-model="outlet.outletPicId"
              placeholder="Select PIC"
              :searchable="true"
              :options="picList"
              label="picName"
              track-by="id"
              select-label
              deselect-label
              :loading="isPicLoading"
            ></Multiselect>
            <span v-if="formErrors.outletPicId" class="invalid-field">
              {{ formErrors.outletPicId }}
            </span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_dealer_outlet_code')"></label>
            <input
              v-model="outlet.dealerOutletCode"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.dealerOutletCode = ''"
            />
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <div class="form-group">
          <!-- <button @click="usePlace" type="button">Add</button> -->
          <!-- {{centerLan}} -->
          <GmapMap
            style="width: 100%; height: 300px"
            :zoom="17"
            :center="{ lat: location.lat, lng: location.lng }"
          >
            <GmapMarker
              v-if="location"
              label="★"
              :position="{
                lat: location.lat,
                lng: location.lng
              }"
            />
          </GmapMap>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <button
            v-if="!outlet.id"
            type="submit"
            class="btn btn-secondary pull-right"
            v-text="$ml.get('form_outlet_add_button')"
          ></button>
          <button
            v-if="outlet.id"
            type="submit"
            class="btn btn-secondary pull-right"
            v-text="$ml.get('form_outlet_update_button')"
          ></button>
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
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import {
  OUTLET_POST_REQUEST,
  OUTLET_REQUEST,
  OUTLET_PIC_LIST_REQUEST
} from "../../store/modules/outlet/actions";
import { STATE_LIST_REQUEST, CATEGORY_LIST_REQUEST } from "../../store/modules/utility/actions";
import { DEALER_LIST_REQUEST } from "../../store/modules/dealer/actions";
import Multiselect from "vue-multiselect";
import { postalCodeValidate } from "../../utils/helpers";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  components: {
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    selectedOutlet: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {},
  data() {
    return {
      outlet: {
        name: this.selectedOutlet.name,
        dealerId: this.selectedOutlet.dealerId,
        typeId: this.selectedOutlet.typeId,
        stateId: this.selectedOutlet.stateId,
        area: this.selectedOutlet.area,
        postCode: this.selectedOutlet.postCode,
        latitude: this.selectedOutlet.latitude ? this.selectedOutlet.latitude : 0,
        longitude: this.selectedOutlet.longitude ? this.selectedOutlet.longitude : 0,
        address: this.selectedOutlet.address,
        outletPicId: this.selectedOutlet.outletPicId,
        id: this.selectedOutlet.id,
        dealerOutletCode: this.selectedOutlet.dealerOutletCode
      },
      dealerList: [],
      stateList: [],
      categoryList: [],
      picList: [],
      submitted: false,
      formErrors: [],
      countryId: 0,
      userRole: "",
      isDealer: false,
      userId: 0,
      isPicOutlet: false,
      showDealerField: false,
      isCountryAdmin: false,
      place: null,
      markers: [],
      isDealersLoading: false,
      isPicLoading: false,
      isStatesLoading: false,
      isCategoryLoading: false,
      location: {}
    };
  },
  methods: {
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

      if (!this.outlet.dealerId) {
        this.formErrors.dealerId = this.$ml.get("form_outlet_dealer_name_required");
        error++;
      }

      if (!this.outlet.name) {
        this.formErrors.name = this.$ml.get("form_outlet_name_required");
        error++;
      }

      if (!this.outlet.stateId) {
        this.formErrors.stateId = this.$ml.get("form_outlet_state_required");
        error++;
      }

      if (!this.outlet.address) {
        this.formErrors.address = this.$ml.get("form_outlet_address_required");
        error++;
      }

      if (!this.outlet.postCode) {
        this.formErrors.postCode = this.$ml.get("form_outlet_postcode_required");
        error++;
      } else {
        if (!postalCodeValidate(this.outlet.postCode)) {
          this.formErrors.postCode = this.$ml.get("form_outlet_postcode_invalid");
          error++;
        }
      }

      if (!this.outlet.area) {
        this.formErrors.area = this.$ml.get("form_outlet_area_required");
        error++;
      }

      // if (!this.outlet.outletPicId) {
      //   this.formErrors.outletPicId = "PIC name is required.";
      //   error++;
      // }

      if (!this.outlet.typeId) {
        this.formErrors.typeId = this.$ml.get("form_outlet_category_required");
        error++;
      }

      if (error) {
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
        // const { email, password } = this;
        // alert(JSON.stringify(this.outlet));
        // return;
        this.outlet.countryId = this.countryId;
        this.$store.dispatch(OUTLET_POST_REQUEST, this.outlet).then(res => {
          if (res.resultCode === 0) {
            this.success();
            if (this.outlet.id) {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("form_outlet_updated")
              });
            } else {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("form_outlet_added")
              });
            }
            // return Message({
            //   message: this.outlet.id
            //     ? "Outlet Successfully Updated."
            //     : "Outlet Successfully Added.",
            //   type: "success",
            //   duration: 5 * 1000
            // });
          }
        });
      }
    },
    filterPICs() {
      const dId = this.outlet.dealerId;
      let dealer = this.dealerList.filter(function(elem) {
        if (elem.id == dId.id) return elem;
      });

      if (!this.isPicOutlet) {
        if (dealer) {
          this.getDealersPIC(dealer[0]);
        }
      } else {
        this.outlet.dealerId = { id: this.selectedOutlet.dealerId };
        this.outlet.outletPicId = { id: this.selectedOutlet.outletPicId };
      }
    },
    getOutlet(id) {
      if (id) {
        this.$store.dispatch(OUTLET_REQUEST, { id: id }).then(res => {
          if (res.resultCode === 0) {
            const outlet = res.content;
            // this.outlet = res.content;
            this.outlet.name = outlet.name;
            this.outlet.typeId = outlet.typeId;
            this.outlet.stateId = outlet.stateId;
            this.outlet.area = outlet.area;
            this.outlet.postCode = outlet.postCode;
            this.outlet.latitude = outlet.latitude ? outlet.latitude : 0;
            this.outlet.longitude = outlet.longitude ? outlet.longitude : 0;
            this.outlet.address = outlet.address;
            this.outlet.id = outlet.id;
            this.outlet.dealerOutletCode = outlet.dealerOutletCode;
            this.outlet.dealerId = outlet.dealerId;

            if (this.isDealer) {
              this.getDealersPIC({});
            } else if (this.isPicOutlet) {
              this.outlet.dealerId = { id: res.content.dealerId };
              this.outlet.outletPicId = { id: res.content.outletPicId };
            } else {
              this.getDealers();
            }

            if (this.outlet.latitude && this.outlet.longitude) {
              this.markers.push({
                position: {
                  lat: this.outlet.latitude ? this.outlet.latitude : 0,
                  lng: this.outlet.longitude ? this.outlet.longitude : 0
                }
              });
            }

            // this.getDealers();

            this.getStates();
            this.getCategories();
          }
        });
      } else {
        if (this.isDealer) {
          this.outlet.dealerId = { id: this.selectedOutlet.dealerId };
          this.outlet.outletPicId = { id: this.selectedOutlet.outletPicId };

          this.getDealersPIC(this.outlet.dealerId);
        } else if (this.isPicOutlet) {
          this.outlet.dealerId = { id: this.selectedOutlet.dealerId };
          this.outlet.outletPicId = { id: this.selectedOutlet.outletPicId };
        } else {
          this.getDealers();
        }

        this.getStates();
        this.getCategories();
      }
    },
    getDealers() {
      this.isDealersLoading = true;
      this.dealerList = [];
      this.$store.dispatch(DEALER_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.dealerList = [];
          // this.dealerList = res.content;
          res.content.forEach(dealer => {
            if (dealer.status === "ACTIVE") {
              this.dealerList.push(dealer);
            }
          });

          if (this.outlet.dealerId > 0) {
            // alert(this.outlet.dealerId);
            this.outlet.dealerId = this.getDataRowById(this.dealerList, this.outlet.dealerId);

            this.filterPICs();
          }
          this.isDealersLoading = false;
        } else {
          this.isDealersLoading = false;
        }
      });
    },
    getStates() {
      this.isStatesLoading = true;
      const countryId = this.countryId;
      this.$store.dispatch(STATE_LIST_REQUEST, { countryId: countryId }).then(res => {
        if (res.resultCode === 0) {
          this.isStatesLoading = false;

          this.stateList = res.content;

          if (this.outlet.stateId > 0) {
            this.outlet.stateId = this.getDataRowById(this.stateList, this.outlet.stateId);
          }
        } else {
          this.isStatesLoading = false;
        }
      });
    },
    getCategories() {
      this.isCategoryLoading = true;
      this.$store.dispatch(CATEGORY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.categoryList = res.content;
          this.isCategoryLoading = false;
        } else {
          // this.categoryList = [
          //   {
          //     id: 23,
          //     text: "Sample Type"
          //   }
          // ];
          this.isCategoryLoading = false;
        }

        if (this.outlet.typeId > 0) {
          this.outlet.typeId = this.getDataRowById(this.categoryList, this.outlet.typeId);
        }
      });
    },
    getDealersPIC(dealer) {
      this.picList = [];
      this.isPicLoading = true;
      if (this.isDealer) {
        this.$store.dispatch(OUTLET_PIC_LIST_REQUEST, {}).then(res => {
          if (res.resultCode === 0) {
            // this.picList = res.content;
            res.content.forEach(pic => {
              if (pic.statusType === "ACTIVE") {
                this.picList.push(pic);
              }
            });
            if (this.outlet.outletPicId) {
              if (this.outlet.outletPicId > 0 || this.outlet.outletPicId.id > 0) {
                this.outlet.outletPicId = this.getDataRowById(
                  this.picList,
                  this.outlet.outletPicId
                );
              } else {
                this.outlet.outletPicId = {};
              }
            }
            this.isPicLoading = false;
          } else {
            this.isPicLoading = false;
          }
        });
      } else {
        this.picList = dealer.picList;

        if (this.outlet.outletPicId) {
          if (this.outlet.outletPicId > 0 || this.outlet.outletPicId.id > 0) {
            this.outlet.outletPicId = this.getDataRowById(this.picList, this.outlet.outletPicId);
          } else {
            this.outlet.outletPicId = {};
          }
        }

        this.isPicLoading = false;
      }
    },
    getDataRowById(arr, id) {
      let c = arr.filter(function(elem) {
        if (elem.id === id) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    initGeoCoding() {
      Vue.$geocoder.setDefaultMode("address"); // this is default
      let addressObj = {
        address_line_1: this.outlet.address
      };
      Vue.$geocoder.send(addressObj, response => {
        this.location = response.results[0].geometry.location;
      });
    }
  },
  created() {
    // this.getBanks();
  },
  mounted() {
    this.initGeoCoding();
    this.countryId = this.$store.getters.getCountryId;
    this.userRole = this.$store.getters.getUserRole;
    this.userId = this.$store.getters.getUserId;
    this.isDealer = this.$store.getters.isDealer;
    this.isPicOutlet = this.$store.getters.isPicOutlet;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    if (this.selectedOutlet.id) {
      this.outlet.dealerId = { id: this.selectedOutlet.dealerId };
      this.outlet.outletPicId = { id: this.selectedOutlet.outletPicId };
    }

    if (this.isDealer) {
      // this.outlet.dealerId = {};
      // this.getDealersPIC(this.outlet.dealerId);
    } else if (this.isPicOutlet) {
      this.outlet.dealerId = { id: this.selectedOutlet.dealerId };
      this.outlet.outletPicId = { id: this.selectedOutlet.outletPicId };
    } else {
      this.getDealers();
    }

    if (this.outlet.id > 0 || this.isDealer) {
      this.getOutlet(this.outlet.id);
    } else {
      this.getStates();
      this.getCategories();
    }

    if (this.isDealer || this.isPicOutlet) {
      this.showDealerField = false;
    } else {
      this.showDealerField = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.addressRefreshButton,
.addressRefreshButton:focus,
.addressRefreshButton:active,
.addressRefreshButton:hover {
  min-height: 4rem;
  height: 4rem;
  font-size: 1.3rem;
  border-radius: 0;
  outline-color: rgb(221, 223, 225);
  border-color: rgb(221, 223, 225);
}
</style>
