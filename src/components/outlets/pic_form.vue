<template>
  <div>
    <p class="required-title" v-text="$ml.get('form_required_title')"></p>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div v-if="!isDealer" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_dealer_name')"></label>
            <span class="required-star">*</span>
            <!-- <select v-model="outlet.dealerId" id="dealerId" class="form-control">
            <option disabled selected value>Please Select Dealer</option>
            <option
              :key="index"
              v-for="(dealer, index) of dealerList"
              :value="dealer.id"
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
            ></Multiselect>
            <span v-if="formErrors.dealerId" class="invalid-field">{{ formErrors.dealerId }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_pic_name')"></label>
            <span class="required-star">*</span>
            <input
              v-model="outlet.picName"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.picName = ''"
            />
            <span v-if="formErrors.picName" class="invalid-field">{{ formErrors.picName }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_outlet_pic_email')"></label>
            <span class="required-star">*</span>
            <input
              v-model="outlet.email"
              v-validate="{ regex: getEmailRegex() }"
              name="form_outlet_pic_email"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.email = ''"
            />
            <span v-if="formErrors.email" class="invalid-field">{{ formErrors.email }}</span>
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-if="errors.firstByRule('form_outlet_pic_email', 'regex') && !formErrors.email"
              class="invalid-field"
              v-html="$ml.get('invalid_email_address')"
            ></span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <button
            v-if="!outlet.id"
            type="submit"
            class="btn btn-secondary pull-right"
            v-text="$ml.get('form_outlet_pic_add_button')"
          ></button>
          <button
            v-if="outlet.id"
            type="submit"
            class="btn btn-secondary pull-right"
            v-text="$ml.get('form_outlet_pic_update_button')"
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
import { OUTLET_PIC_POST_REQUEST, OUTLET_PIC_REQUEST } from "../../store/modules/outlet/actions";
import { DEALER_LIST_REQUEST } from "../../store/modules/dealer/actions";
import { nameValidate, emailValidate } from "../../utils/helpers";
import Multiselect from "vue-multiselect";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  components: {
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    selectedOutlet: {
      type: Object,
      default: () => {
        return {};
      }
    },
    loadData: { type: Function, default: () => {} }
  },
  computed: {},
  data() {
    return {
      outlet: {
        dealerId: this.selectedOutlet.dealerId,
        email: this.selectedOutlet.email,
        picName: this.selectedOutlet.picName,
        outletId: this.selectedOutlet.id,
        countryId: this.selectedOutlet.countryId,
        ownerAccId: this.selectedOutlet.ownerAccId,
        statusType: this.selectedOutlet.statusType
      },
      dealerList: [],
      submitted: false,
      formErrors: {},
      userRole: "",
      isDealer: false,
      userId: 0,
      isDealersLoading: false
    };
  },
  methods: {
    getEmailRegex() {
      return emailValidate(this.outlet.email, 1);
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

      if (!this.outlet.dealerId) {
        this.formErrors.dealerId = this.$ml.get("form_outlet_pic_dealer_name_required");
        error++;
      }

      if (!this.outlet.picName) {
        this.formErrors.picName = this.$ml.get("form_outlet_pic_name_required");
        error++;
      } else {
        if (!nameValidate(this.outlet.picName)) {
          this.formErrors.picName = this.$ml.get("form_outlet_pic_name_invalid");
          error++;
        }
      }

      if (!this.outlet.email) {
        this.formErrors.email = this.$ml.get("form_outlet_pic_email_required");
        error++;
      } else {
        if (!emailValidate(this.outlet.email)) {
          this.formErrors.email = this.$ml.get("form_outlet_pic_email_invalid");
          error++;
        }
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
        // alert(JSON.stringify(this.dealer));
        this.$store.dispatch(OUTLET_PIC_POST_REQUEST, this.outlet).then(res => {
          if (res.resultCode === 0) {
            this.success();
            if (this.outlet.id) {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("pic_outlet_updated")
              });
            } else {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("pic_outlet_added")
              });
            }
            // return Message({
            //   message: this.outlet.id
            //     ? "PIC Outlet Successfully Updated."
            //     : "PIC Outlet Successfully Added.",
            //   type: "success",
            //   duration: 5 * 1000
            // });
            // this.success();
            // this.$emit("success", 1);
          }
        });
      }
    },
    getPICById(id) {
      let pdata = {
        id: id
      };
      if (id > 0) {
        this.$store.dispatch(OUTLET_PIC_REQUEST, pdata).then(res => {
          if (res.resultCode === 0) {
            this.outlet = res.content;
            this.getDealers();
          }
        });
      } else {
        this.getDealers();
      }
    },
    getDealers() {
      this.isDealersLoading = true;
      this.$store.dispatch(DEALER_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.dealerList = res.content;
          // alert(this.outlet.dealerId);
          if (this.outlet.dealerId > 0) {
            this.outlet.dealerId = this.getDataRowById(this.dealerList, this.outlet.dealerId);
          }
          this.isDealersLoading = false;
        } else {
          this.isDealersLoading = false;
        }
      });
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
    }
  },
  created() {
    // this.getBanks();
  },
  mounted() {
    // this.closeModal();
    this.userRole = this.$store.getters.getUserRole;
    this.userId = this.$store.getters.getUserId;
    this.isDealer = this.$store.getters.isDealer;

    if (this.isDealer) {
      this.outlet.dealerId = {};
      // this.outlet.dealerId.id = this.userId;
    } else {
      this.getDealers();
    }

    if (this.outlet.outletId > 0) {
      this.getPICById(this.outlet.outletId);
    }
  }
};
</script>
