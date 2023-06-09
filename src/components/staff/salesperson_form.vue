<template>
  <div>
    <p
      v-if="canEdit && currectAction === 'edit'"
      class="required-title"
      v-text="$ml.get('form_required_title')"
    ></p>
    <form
      v-if="canEdit && currectAction === 'edit'"
      @submit.prevent="handleSubmit"
    >
      <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_name')"
            ></label>
            <span class="required-star">*</span>
            <input
              id="name"
              v-model="salesp.name"
              name="name"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.name = ''"
            />
            <span v-if="formErrors.name" class="invalid-field">{{
              formErrors.name
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_ic_number')"
            ></label>
            <span class="required-star">*</span>
            <input
              id="icNumber"
              v-model="salesp.icNumber"
              v-validate="'alpha_num'"
              name="IC Number"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.icNumber = ''"
            />
            <span v-if="errors.first('IC Number')" class="invalid-field">{{
              errors.first("IC Number")
            }}</span>
            <span v-if="formErrors.icNumber" class="invalid-field">{{
              formErrors.icNumber
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_gender')"
            ></label>
            <span class="required-star">*</span>
            <!-- <select class="form-control" id="genderId" name="genderId" v-model="salesp.genderId">
            <option
              v-for="(gender, index2) of genders"
              :key="index2"
              :value="gender.id"
            >{{gender.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect-gender"
              v-model="salesp.genderId"
              placeholder="Select Gender"
              :searchable="true"
              :options="genders"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isGendersLoading"
            ></Multiselect>
            <span v-if="formErrors.genderId" class="invalid-field">{{
              formErrors.genderId
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_contact_number')"
            ></label>
            <span class="required-star">*</span>
            <input
              v-model="salesp.phoneNumber"
              v-validate="{ regex: getPhoneRegex() }"
              name="form_salesperson_phone"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.phoneNumber = ''"
            />
            <span v-if="formErrors.phoneNumber" class="invalid-field">{{
              formErrors.phoneNumber
            }}</span>
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-if="
                errors.firstByRule('form_salesperson_phone', 'regex') &&
                  !formErrors.phoneNumber
              "
              class="invalid-field"
              v-html="$ml.get('invalid_phone_number')"
            ></span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_email')"
            ></label>
            <span class="required-star">*</span>
            <input
              v-model="salesp.email"
              v-validate="{ regex: getEmailRegex() }"
              name="form_salesperson_email"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.email = ''"
            />
            <span v-if="formErrors.email" class="invalid-field">{{
              formErrors.email
            }}</span>
            <span
              v-if="
                errors.firstByRule('form_salesperson_email', 'regex') &&
                  !formErrors.email
              "
              class="invalid-field"
              v-html="$ml.get('invalid_email_address')"
            ></span>
          </div>
        </div>
        <div v-if="showDealerField" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_dealer_name')"
            ></label>
            <span class="required-star">*</span>
            <!-- <select class="form-control" id="dealerId" name="dealerId" v-model="salesp.dealerId">
            <option
              v-for="(dealer, index) of dealers"
              :key="index"
              :value="dealer.id"
            >{{dealer.dealerName}}</option>
            </select>-->
            <Multiselect
              ref="multiselect-dealer"
              v-model="salesp.dealerId"
              placeholder="Select Dealer"
              :searchable="true"
              :options="dealers"
              label="dealerName"
              track-by="id"
              select-label
              deselect-label
              :loading="isDealersLoading"
              @input="filterOutlets"
            ></Multiselect>
            <span v-if="formErrors.dealerId" class="invalid-field">{{
              formErrors.dealerId
            }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_outlet_name')"
            ></label>
            <span class="required-star">*</span>
            <!-- <select class="form-control" id="outletId" name="outletId" v-model="salesp.outletId">
            <option
              v-for="(outlet, index) of outlets"
              :key="index"
              :value="outlet.id"
            >{{outlet.name}}</option>
            </select>-->
            <!-- {{outlets}} -->
            <Multiselect
              ref="multiselect-outlet"
              v-model="salesp.outletId"
              placeholder="Select Outlet"
              :searchable="true"
              :options="outlets"
              label="name"
              track-by="id"
              select-label
              deselect-label
              :loading="isOutletsLoading"
              @input="formErrors.outletId = ''"
            ></Multiselect>
            <span v-if="formErrors.outletId" class="invalid-field">{{
              formErrors.outletId
            }}</span>
          </div>
        </div>

        <div class="col-12">
          <br />
          <h4
            class="text-primary"
            v-text="$ml.get('form_salesperson_bank_information')"
          ></h4>
          <br />
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_bank_name')"
            ></label>
            <span class="required-star">*</span>
            <!-- <select class="form-control" id="bankId" name="bankId" v-model="salesp.bankId">
            <option v-for="(bank, index) of banks" :key="index" :value="bank.id">{{bank.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect-bank"
              v-model="salesp.bankId"
              placeholder="Select Bank"
              :searchable="true"
              :options="banks"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isBanksLoading"
            ></Multiselect>

            <span v-if="formErrors.bankId" class="invalid-field">{{
              formErrors.bankId
            }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label
              class="text-label"
              v-text="$ml.get('form_salesperson_bank_acc_number')"
            ></label>
            <span class="required-star">*</span>
            <input
              v-model="salesp.bankAccount"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.bankAccount = ''"
            />
            <span v-if="formErrors.bankAccount" class="invalid-field">{{
              formErrors.bankAccount
            }}</span>
          </div>
        </div>

        <div class="col-12">
          <div class="row">
            <div class="col-lg-12">
              <button type="submit" class="btn btn-secondary pull-right">
                <span
                  v-if="!salesp.staffId"
                  v-text="$ml.get('form_salesperson_add_button')"
                ></span>
                <span
                  v-if="salesp.staffId"
                  v-text="$ml.get('form_salesperson_update_button')"
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
        </div>
      </div>
    </form>

    <!-- View -->
    <div v-if="canView && currectAction === 'view'">
      <table class="table">
        <tbody>
          <tr>
            <td v-text="$ml.get('form_salesperson_name')"></td>
            <td>{{ salesp.name }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_ic_number')"></td>
            <td>{{ salesp.icNumber }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_gender')"></td>
            <td>{{ salesp.genderId.text }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_contact_number')"></td>
            <td>{{ salesp.phoneNumber }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_email')"></td>
            <td>{{ salesp.email }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_dealer_name')"></td>
            <td>{{ salesp.dealerId.dealerName }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_outlet_name')"></td>
            <td>{{ salesp.outletId.name }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <h4
                class="text-primary"
                v-text="$ml.get('form_salesperson_bank_information')"
              ></h4>
            </td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_bank_name')"></td>
            <td>{{ salesp.bankId.text }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_salesperson_bank_acc_number')"></td>
            <td>{{ salesp.bankAccount }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Name : {{salesp.name}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">IC/ID Number : {{salesp.icNumber}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Gender : {{salesp.genderId.text}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Phone Number : {{salesp.phoneNumber}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Email : {{salesp.email}}</label>
          </div>
        </div>
        <div class="col-lg-6" v-if="showDealerField">
          <div class="form-group flex-grow-1">
            <label class="text-label">Dealer Name : {{salesp.dealerId.dealerName}}</label>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Outlet Name : {{salesp.outletId.name}}</label>
          </div>
        </div>

        <div class="col-12">
          <br />
          <h4 class="text-primary">Bank Information</h4>
          <br />
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Bank Name : {{salesp.bankId.text}}</label>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Bank Account Number : {{salesp.bankAccount}}</label>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { POST_STAFF_REQUEST } from "../../store/modules/staff/actions";
import {
  GENDER_LIST_REQUEST,
  BANK_LIST_REQUEST
} from "../../store/modules/utility/actions";
import { DEALER_LIST_REQUEST } from "../../store/modules/dealer/actions";
import { OUTLET_LIST_REQUEST } from "../../store/modules/outlet/actions";
import {
  nameValidate,
  emailValidate,
  phoneValidate
} from "../../utils/helpers";
import Multiselect from "vue-multiselect";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS
} from "../../store/modules/ui/actions";

export default {
  name: "SalespersonForm",
  components: {
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    salespSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    canView: { type: Boolean },
    canEdit: { type: Boolean },
    currectAction: { type: String, default: "" }
  },
  computed: {},
  data() {
    return {
      salesp: {
        name: this.salespSelected.name,
        email: this.salespSelected.email,
        phoneNumber: this.salespSelected.phoneNumber,
        icNumber: this.salespSelected.icNumber,
        genderId: this.salespSelected.genderId,
        dealerId: this.salespSelected.dealerId,
        outletId: this.salespSelected.outletId,
        bankId: this.salespSelected.bankId,
        bankAccount: this.salespSelected.bankAccount,
        staffId: this.salespSelected.id,
        type: "salespersons"
      },
      submitted: false,
      formErrors: [],
      genders: [],
      banks: [],
      outlets: [],
      dealers: [],
      userRole: "",
      isDealer: false,
      userId: 0,
      isPicOutlet: false,
      showDealerField: false,
      isGendersLoading: false,
      isOutletsLoading: false,
      isDealersLoading: false,
      isBanksLoading: false
    };
  },
  methods: {
    getPhoneRegex() {
      return phoneValidate(this.salesp.phoneNumber, 1);
    },
    getEmailRegex() {
      return emailValidate(this.salesp.email, 1);
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

      if (!this.salesp.name) {
        this.formErrors.name = this.$ml.get("form_salesperson_name_required");
        error++;
      } else {
        if (!nameValidate(this.salesp.name)) {
          this.formErrors.name = this.$ml.get("form_salesperson_name_invalid");
          error++;
        }
      }

      if (!this.salesp.icNumber) {
        this.formErrors.icNumber = this.$ml.get("form_salesperson_ic_required");
        error++;
      }

      if (this.showDealerField) {
        if (!this.salesp.dealerId) {
          this.formErrors.dealerId = this.$ml.get(
            "form_salesperson_dealer_name_required"
          );
          error++;
        }
      }

      if (!this.salesp.genderId) {
        this.formErrors.genderId = this.$ml.get(
          "form_salesperson_gender_required"
        );
        error++;
      }

      if (!this.salesp.email) {
        this.formErrors.email = this.$ml.get("form_salesperson_email_required");
        error++;
      } else {
        if (!emailValidate(this.salesp.email)) {
          this.formErrors.email = this.$ml.get(
            "form_salesperson_email_invalid"
          );
          error++;
        }
      }

      if (!this.salesp.phoneNumber) {
        this.formErrors.phoneNumber = this.$ml.get(
          "form_salesperson_contact_number_required"
        );
        error++;
      } else {
        if (!phoneValidate(this.salesp.phoneNumber)) {
          this.formErrors.phoneNumber = this.$ml.get("invalid_phone_number");
          error++;
        }
      }

      if (!this.salesp.outletId) {
        this.formErrors.outletId = this.$ml.get(
          "form_salesperson_outlet_required"
        );
        error++;
      }

      if (!this.salesp.bankId) {
        this.formErrors.bankId = this.$ml.get(
          "form_salesperson_bank_name_required"
        );
        error++;
      }

      if (!this.salesp.bankAccount) {
        this.formErrors.bankAccount = this.$ml.get(
          "form_salesperson_bank_acc_number_required"
        );
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
      if (this.checkFormValidity(e)) {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$store.dispatch(NOTIFICATION_REQUEST, {
              message: this.$ml.get("request_submitting")
            });
            let pdata = {};
            if (this.salesp.staffId > 0) {
              pdata.data = {}; // this.salesp;
              pdata.data.name = this.salesp.name;
              pdata.data.icNumber = this.salesp.icNumber;
              pdata.data.phoneNumber = this.salesp.phoneNumber;
              pdata.data.email = this.salesp.email;
              pdata.data.bankAccount = this.salesp.bankAccount;

              pdata.staffId = this.salesp.staffId;
              pdata.data.id = this.salesp.staffId;
              pdata.data.genderId = this.salesp.genderId
                ? this.salesp.genderId.id
                : 0;
              pdata.data.bankId = this.salesp.bankId
                ? this.salesp.bankId.id
                : 0;
              pdata.data.dealerId = this.salesp.dealerId
                ? this.salesp.dealerId.id
                : 0;
              pdata.data.outletId = this.salesp.outletId
                ? this.salesp.outletId.id
                : 0;
            } else {
              let staff = {};
              // staff = this.salesp;
              let genderId = this.salesp.genderId ? this.salesp.genderId.id : 0;
              staff.genderId = genderId;
              staff.bankId = this.salesp.bankId ? this.salesp.bankId.id : 0;
              staff.dealerId = this.salesp.dealerId
                ? this.salesp.dealerId.id
                : 0;
              staff.outletId = this.salesp.outletId
                ? this.salesp.outletId.id
                : 0;
              staff.name = this.salesp.name;
              staff.icNumber = this.salesp.icNumber;
              staff.phoneNumber = this.salesp.phoneNumber;
              staff.email = this.salesp.email;
              staff.bankAccount = this.salesp.bankAccount;
              pdata.data = [staff];
              // this.salesp = this.salesp;
            }
            pdata.type = this.salesp.type;

            this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
              if (res.resultCode === 0) {
                this.success();
                if (this.salesp.staffId) {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: this.$ml.get("salesperson_updated")
                  });
                } else {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: this.$ml.get("salesperson_added")
                  });
                }
              }
            });
          }
        });
      }
    },
    getGenders() {
      this.isGendersLoading = true;
      this.$store.dispatch(GENDER_LIST_REQUEST).then(res => {
        if (res.content && res.resultCode === 0) {
          this.genders = res.content;

          if (this.salesp.genderId) {
            this.salesp.genderId = this.getDataRowById(
              this.genders,
              this.salesp.genderId
            );
          }
          this.isGendersLoading = false;
        } else {
          this.isGendersLoading = false;
        }
      });
    },
    getDealers() {
      this.isDealersLoading = true;
      this.dealers = [];
      this.$store.dispatch(DEALER_LIST_REQUEST, { type: "pic" }).then(res => {
        if (res.content && res.resultCode === 0) {
          // this.dealers = res.content;
          res.content.forEach(dealer => {
            if (dealer.status === "ACTIVE") {
              this.dealers.push(dealer);
            }
          });

          if (this.isDealer) {
            this.salesp.dealerId = {};
            this.salesp.dealerId.id = this.userId;
          }
          // alert(this.salesp.dealerId);
          if (this.salesp.dealerId) {
            this.salesp.dealerId = this.getDataRowById(
              this.dealers,
              this.salesp.dealerId
            );
            this.filterOutlets();
          }
          this.isDealersLoading = false;
        } else {
          this.isDealersLoading = false;
        }
      });
    },
    getOutlets() {
      this.outlets = [];
      this.isOutletsLoading = true;
      this.$store.dispatch(OUTLET_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          // this.outlets = res.content;

          res.content.forEach(outlet => {
            if (outlet.status === "ACTIVE") {
              this.outlets.push(outlet);
            }
          });

          if (this.salesp.outletId) {
            this.salesp.outletId = this.getDataRowById(
              this.outlets,
              this.salesp.outletId
            );
          }
          this.isOutletsLoading = false;
        } else {
          this.isOutletsLoading = false;
        }
      });
    },
    filterOutlets() {
      let outlets = [];
      this.isOutletsLoading = true;
      const dealer = this.salesp.dealerId;
      this.outlets = [];

      if (dealer) {
        if (dealer.picList) {
          dealer.picList.forEach(pic => {
            pic.dealerOutlets.forEach(outlet => {
              outlets.push(outlet);
            });
          });

          this.outlets = outlets;
          this.isOutletsLoading = false;
        }

        if (dealer.outletList.length > 0) {
          this.outlets = dealer.outletList;
        }

        if (this.salesp.outletId) {
          this.salesp.outletId = this.getDataRowById(
            this.outlets,
            this.salesp.outletId
          );
        }
      } else {
        this.salesp.outletId = null;
      }

      // console.log(dealer);

      this.isOutletsLoading = false;
    },
    getBanks() {
      this.isBanksLoading = true;
      let pdata = { countryCode: this.$store.getters.getCountryCode };
      this.$store.dispatch(BANK_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.banks = res.content;

          if (this.salesp.bankId) {
            this.salesp.bankId = this.getDataRowById(
              this.banks,
              this.salesp.bankId
            );
          }
          this.isBanksLoading = false;
        } else {
          this.isBanksLoading = false;
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
  created() {},
  mounted() {
    this.userRole = this.$store.getters.getUserRole;
    this.userId = this.$store.getters.getUserId;
    this.isDealer = this.$store.getters.isDealer;
    this.isPicOutlet = this.$store.getters.isPicOutlet;
    // alert(this.isPicOutlet);
    // if (isDealer || isPicOutlet) {
    //   this.showDealerField = false;
    // } else {
    //   this.showDealerField = true;
    // }

    if (this.isDealer) {
      this.showDealerField = false;
      this.getOutlets();
      this.salesp.dealerId = {};
      this.salesp.dealerId.id = this.userId;
    } else if (this.isPicOutlet) {
      // alert("a");
      this.showDealerField = false;
      this.getOutlets();
    } else {
      this.showDealerField = true;
      this.getDealers();
    }
    this.getGenders();
    this.getBanks();
  }
};
</script>
