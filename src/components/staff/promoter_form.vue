<template>
  <div>
    <p
      v-if="canEdit && currectAction === 'edit'"
      class="required-title"
      v-text="$ml.get('form_required_title')"
    ></p>
    <form v-if="canEdit && currectAction === 'edit'" @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_promoter_name')"></label>
            <span class="required-star">*</span>
            <input
              id="name"
              v-model="promoter.name"
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
            <label class="text-label" v-text="$ml.get('form_promoter_ic_number')"></label>
            <span class="required-star">*</span>
            <input
              id="icNumber"
              v-model="promoter.icNumber"
              v-validate="'alpha_num'"
              name="IC Number"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.icNumber = ''"
            />
            <span v-if="errors.first('IC Number')" class="invalid-field">
              {{ errors.first("IC Number") }}
            </span>
            <span v-if="formErrors.icNumber" class="invalid-field">{{ formErrors.icNumber }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_promoter_gender')"></label>
            <span class="required-star">*</span>
            <!-- <select class="form-control" id="gender" name="gender" v-model="promoter.genderId">
            <option
              v-for="(gender, index2) of genders"
              :key="index2"
              :value="gender.id"
            >{{gender.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect-gender"
              v-model="promoter.genderId"
              placeholder="Select Gender"
              :searchable="true"
              :options="genders"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isGendersLoading"
            ></Multiselect>
            <span v-if="formErrors.genderId" class="invalid-field">{{ formErrors.genderId }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_promoter_contact_number')"></label>
            <span class="required-star">*</span>
            <input
              v-model="promoter.phoneNumber"
              v-validate="{ regex: getPhoneRegex() }"
              name="form_promoter_phone"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.phoneNumber = ''"
            />
            <span v-if="formErrors.phoneNumber" class="invalid-field">
              {{ formErrors.phoneNumber }}
            </span>
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-if="errors.firstByRule('form_promoter_phone', 'regex') && !formErrors.phoneNumber"
              class="invalid-field"
              v-html="$ml.get('invalid_phone_number')"
            ></span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_promoter_email')"></label>
            <span class="required-star">*</span>
            <input
              v-model="promoter.email"
              v-validate="{ regex: getEmailRegex() }"
              name="form_promoter_email"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.email = ''"
            />
            <span v-if="formErrors.email" class="invalid-field">{{ formErrors.email }}</span>
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-if="errors.firstByRule('form_promoter_email', 'regex') && !formErrors.email"
              class="invalid-field"
              v-html="$ml.get('invalid_email_address')"
            ></span>
          </div>
        </div>
        <div v-if="!isLeader" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_promoter_leader_email')"></label>
            <span class="required-star">*</span>
            <!-- <select
            class="form-control"
            id="leaderEmail"
            name="leaderEmail"
            v-model="promoter.promoterLeaderId"
          >
            <option
              v-for="(leader, index) of promoLeaders"
              :key="index"
              :value="leader.id"
            >{{leader.email}}</option>
            </select>-->

            <Multiselect
              ref="multiselect"
              v-model="promoter.promoterLeaderId"
              placeholder="Select Email"
              :searchable="true"
              :options="promoLeaders"
              label="email"
              track-by="id"
              select-label
              deselect-label
              :loading="isLeadersLoading"
            ></Multiselect>

            <span v-if="formErrors.promoterLeaderId" class="invalid-field">
              {{ formErrors.promoterLeaderId }}
            </span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Promoter Types</label>
            <Multiselect
              ref="multiselect-type"
              v-model="promoter.promoterTypeId"
              placeholder="Select Promoter Type"
              :searchable="true"
              :options="promoterTypes"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isPromoterTypesLoading"
            ></Multiselect>
          </div>
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-lg-12">
              <button type="submit" class="btn btn-secondary pull-right">
                <span v-if="!promoter.staffId" v-text="$ml.get('form_promoter_add_button')"></span>
                <span
                  v-if="promoter.staffId"
                  v-text="$ml.get('form_promoter_update_button')"
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
            <td v-text="$ml.get('form_promoter_name')"></td>
            <td>{{ promoter.name }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_promoter_ic_number')"></td>
            <td>{{ promoter.icNumber }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_promoter_gender')"></td>
            <td>{{ promoter.genderId.text }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_promoter_contact_number')"></td>
            <td>{{ promoter.phoneNumber }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_promoter_email')"></td>
            <td>{{ promoter.email }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_promoter_leader_email')"></td>
            <td>{{ promoter.promoterLeaderId.email }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Name : {{promoter.name}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">IC/ID Number : {{promoter.icNumber}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Gender : {{promoter.genderId.text}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Phone Number : {{promoter.phoneNumber}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Email ID : {{promoter.email}}</label>
          </div>
        </div>
        <div class="col-lg-6" v-if="!isLeader">
          <div class="form-group flex-grow-1">
            <label class="text-label">Promoter Leader Email : {{promoter.promoterLeaderId.email}}</label>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { POST_STAFF_REQUEST, GET_STAFF_LIST_REQUEST } from "../../store/modules/staff/actions";
import {
  GENDER_LIST_REQUEST,
  PROMOTER_TYPE_LIST_REQUEST
} from "../../store/modules/utility/actions";
import { nameValidate, emailValidate, phoneValidate } from "../../utils/helpers";
import Multiselect from "vue-multiselect";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  name: "PromoterForm",
  components: {
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    promoterSelected: { type: Object, default: () => {} },
    canView: { type: Boolean },
    canEdit: { type: Boolean },
    currectAction: { type: String, default: "" }
  },
  computed: {},
  data() {
    return {
      promoter: {
        name: this.promoterSelected.name,
        email: this.promoterSelected.email,
        phoneNumber: this.promoterSelected.phoneNumber,
        icNumber: this.promoterSelected.icNumber,
        genderId: this.promoterSelected.genderId,
        promoterTypeId: this.promoterSelected.promoterTypeId,
        promoterLeaderId: this.promoterSelected.promoterLeaderId,
        staffId: this.promoterSelected.id,
        type: "promoters"
      },
      submitted: false,
      formErrors: [],
      genders: [],
      promoterTypes: [],
      promoLeaders: [],
      userRole: "",
      isLeader: false,
      userId: 0,
      isGendersLoading: false,
      isLeadersLoading: false,
      isPromoterTypesLoading: false
    };
  },
  methods: {
    getPhoneRegex() {
      return phoneValidate(this.promoter.phoneNumber, 1);
    },
    getEmailRegex() {
      return emailValidate(this.promoter.email, 1);
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

      if (!this.promoter.name) {
        this.formErrors.name = this.$ml.get("form_promoter_name_required");
        error++;
      } else {
        if (!nameValidate(this.promoter.name)) {
          this.formErrors.name = this.$ml.get("form_promoter_name_invalid");
          error++;
        }
      }

      if (!this.promoter.email) {
        this.formErrors.email = this.$ml.get("form_promoter_email_required");
        error++;
      } else {
        if (!emailValidate(this.promoter.email)) {
          this.formErrors.email = this.$ml.get("form_promoter_email_invalid");
          error++;
        }
      }

      if (!this.promoter.icNumber) {
        this.formErrors.icNumber = this.$ml.get("form_promoter_ic_required");
        error++;
      }

      if (!this.promoter.phoneNumber) {
        this.formErrors.phoneNumber = this.$ml.get("form_promoter_contact_number_required");
        error++;
      } else {
        if (!phoneValidate(this.promoter.phoneNumber)) {
          this.formErrors.phoneNumber = this.$ml.get("invalid_phone_number");
          error++;
        }
      }

      if (!this.promoter.genderId) {
        this.formErrors.genderId = this.$ml.get("form_promoter_gender_required");
        error++;
      }
      if (!this.isLeader) {
        if (!this.promoter.promoterLeaderId) {
          this.formErrors.promoterLeaderId = this.$ml.get("form_promoter_promoter_leader_required");
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
      if (this.checkFormValidity(e)) {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$store.dispatch(NOTIFICATION_REQUEST, {
              message: this.$ml.get("request_submitting")
            });
            let pdata = {};
            if (this.promoter.staffId > 0) {
              pdata.data = {}; //this.promoter;
              pdata.staffId = this.promoter.staffId;
              pdata.data.name = this.promoter.name;
              pdata.data.icNumber = this.promoter.icNumber;
              pdata.data.phoneNumber = this.promoter.phoneNumber;
              pdata.data.email = this.promoter.email;
              pdata.data.id = this.promoter.staffId;
              pdata.data.type = this.promoter.type;
              pdata.data.genderId = this.promoter.genderId ? this.promoter.genderId.id : 0;
              if (this.promoter.promoterTypeId) {
                pdata.data.promoterTypeId = this.promoter.promoterTypeId.id;
              }
              if (!this.isLeader) {
                pdata.data.promoterLeaderId = this.promoter.promoterLeaderId
                  ? this.promoter.promoterLeaderId.id
                  : 0;
                // pdata.data.promoterLeaderId = this.userId;
              }
            } else {
              let staff = {};
              // staff = this.promoter;
              staff.name = this.promoter.name;
              staff.icNumber = this.promoter.icNumber;
              staff.phoneNumber = this.promoter.phoneNumber;
              staff.email = this.promoter.email;
              staff.genderId = this.promoter.genderId ? this.promoter.genderId.id : 0;
              if (this.promoter.promoterTypeId) {
                staff.promoterTypeId = this.promoter.promoterTypeId.id;
              }
              if (!this.isLeader) {
                staff.promoterLeaderId = this.promoter.promoterLeaderId
                  ? this.promoter.promoterLeaderId.id
                  : 0;
                // staff.promoterLeaderId = this.userId;
              }

              pdata.data = [staff];
            }
            pdata.type = this.promoter.type;

            this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
              if (res.resultCode === 0) {
                this.success();
                if (this.promoter.staffId) {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: this.$ml.get("promoter_added")
                  });
                } else {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: this.$ml.get("promoter_updated")
                  });
                }
                // Message({
                //   message: this.promoter.staffId
                //     ? "Promoter Successfully Updated."
                //     : "Promoter Successfully Added.",
                //   type: "success",
                //   duration: 5 * 1000
                // });
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

          if (this.promoter.genderId) {
            this.promoter.genderId = this.getSelectedGender(this.promoter.genderId);
          }
          this.isGendersLoading = false;
        } else {
          this.isGendersLoading = false;
        }
      });
    },
    getPromoterTypes() {
      this.isPromoterTypesLoading = true;
      this.$store.dispatch(PROMOTER_TYPE_LIST_REQUEST).then(res => {
        if (res.content && res.resultCode === 0) {
          this.promoterTypes = res.content;

          if (this.promoter.promoterTypeId) {
            this.promoter.promoterTypeId = this.getSelectedType(this.promoter.promoterTypeId);
          }
          this.isPromoterTypesLoading = false;
        } else {
          this.isPromoterTypesLoading = false;
        }
      });
    },
    getLeaders() {
      this.promoLeaders = [];
      this.isLeadersLoading = true;
      this.$store.dispatch(GET_STAFF_LIST_REQUEST, { type: "leaders" }).then(res => {
        if (res.resultCode === 0) {
          // this.promoLeaders = res.content;

          res.content.forEach(leader => {
            if (leader.status) {
              this.promoLeaders.push(leader);
            }
          });

          if (this.promoter.promoterLeaderId) {
            this.promoter.promoterLeaderId = this.getSelectedLeader(this.promoter.promoterLeaderId);
          }
          this.isLeadersLoading = false;
          // alert(JSON.stringify(this.promoter.promoterLeaderId));
        } else {
          this.isLeadersLoading = false;
        }
      });
    },
    getStaff() {},
    getSelectedLeader(id) {
      let c = this.promoLeaders.filter(function(elem) {
        if (elem.id === id) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    getSelectedGender(id) {
      let c = this.genders.filter(function(elem) {
        if (elem.id === id) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    getSelectedType(id) {
      let c = this.promoterTypes.filter(function(elem) {
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
    this.isLeader = this.$store.getters.isPromoLeader;
    this.getGenders();
    this.getPromoterTypes();
    if (!this.isLeader) {
      this.getLeaders();
    }
  }
};
</script>
