<template>
  <div id="distributor-form">
    <p class="required-title" v-text="$ml.get('form_required_title')"></p>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div v-if="!isCountryAdmin" class="col-lg-12">
          <div class="form-group flex-grow-1">
            <label class="text-label">
              Country
              <span class="required-star">*</span>
            </label>
            <Multiselect
              ref="multiselect"
              v-model="distributor.countryId"
              placeholder="Select Country"
              :searchable="true"
              :options="countries"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="getCountriesIsLoading"
            ></Multiselect>
            <span v-if="formErrors.countryId" class="invalid-field">
              {{ formErrors.countryId }}
            </span>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="form-group flex-grow-1">
            <label class="text-label">
              Code
              <span class="required-star">*</span>
            </label>
            <input v-model="distributor.code" type="text" class="form-control" placeholder />
            <span v-if="formErrors.code" class="invalid-field">{{ formErrors.code }}</span>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="form-group flex-grow-1">
            <label class="text-label">
              Name
              <span class="required-star">*</span>
            </label>
            <input v-model="distributor.name" type="text" class="form-control" placeholder />
            <span v-if="formErrors.name" class="invalid-field">{{ formErrors.name }}</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <button type="submit" class="btn btn-secondary pull-right">
            <span v-if="!distributor.id">Add Distributor</span>
            <span v-if="distributor.id > 0">Update Distributor</span>
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
    </form>
  </div>
</template>

<script>
import { DISTRIBUTOR_POST_REQUEST } from "../../store/modules/distributor/actions";

import { nameValidate } from "../../utils/helpers";
import Multiselect from "vue-multiselect";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  name: "DistributorForm",
  components: {
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    distributorSelected: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {},
  data() {
    return {
      distributor: {
        countryId: this.distributorSelected.countryId,
        code: this.distributorSelected.code,
        name: this.distributorSelected.name,
        id: this.distributorSelected.id
      },
      submitted: false,
      formErrors: [],
      countries: [],
      isCountryAdmin: false,
      countryId: null,
      getCountriesIsLoading: false
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

      if (!this.distributor.name) {
        this.formErrors.name = "Distributor name is required.";
        error++;
      } else {
        if (!nameValidate(this.distributor.name)) {
          this.formErrors.name = "Enter a valid name.";
          error++;
        }
      }

      if (!this.distributor.code) {
        this.formErrors.code = "Code Id is required.";
        error++;
      }

      if (!this.distributor.countryId && !this.isCountryAdmin) {
        this.formErrors.countryId = "Country is required.";
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
          message: "Submitting..."
        });
        if (this.isCountryAdmin) {
          this.distributor.countryId = this.countryId;
        } else {
          this.distributor.countryId = this.distributor.countryId.id;
        }

        this.$store.dispatch(DISTRIBUTOR_POST_REQUEST, this.distributor).then(res => {
          if (res.resultCode === 0) {
            this.success();
            if (this.distributor.id) {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: "Distributor Successfully Updated."
              });
            } else {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: "Distributor Successfully Added."
              });
            }
            // return Message({
            //   message: this.distributor.id
            //     ? "Distributor Successfully Updated."
            //     : "Distributor Successfully Added.",
            //   type: "success",
            //   duration: 5 * 1000
            // });

            // this.success();
            // this.$emit("success", 1);
          }
        });
      }
    },
    getCountries() {
      this.getCountriesIsLoading = true;
      this.$store.dispatch(COUNTRY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.countries = res.content;

          if (this.distributor.countryId > 0) {
            this.distributor.countryId = this.getSelectedCountry(this.distributor.countryId);
          }
        }
        this.getCountriesIsLoading = false;
      });
    },
    getSelectedCountry(id) {
      let c = this.countries.filter(function(elem) {
        if (elem.id === id) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    getDistributorById() {
      // if (id > 0) {
      //   this.$store.dispatch(DISTRIBUTOR_REQUEST, { id: id }).then(res => {
      //     if (res.resultCode === 0) {
      //       this.distributor = res.content;
      //       this.getCountries();
      //     }
      //   });
      // } else {
      //   this.getCountries();
      // }
      this.getCountries();
    }
  },
  created() {},
  mounted() {
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    this.countryId = this.$store.getters.getCountryId;

    if (this.distributor.id) {
      this.getDistributorById(this.distributor.id);
    } else {
      this.getCountries();
    }
  }
};
</script>
