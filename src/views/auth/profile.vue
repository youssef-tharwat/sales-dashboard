<template>
  <div id="profile">
    <div class="row">
      <div class="col-lg-12">
        <div class="profile">
          <div class="profile-head">
            <div class="photo-content">
              <div class="cover-photo"></div>
              <div class="profile-photo">
                <!-- <img
                  :src="profilePic"
                  @error="replaceImageByDefault"
                  class="img-fluid rounded-circle"
                  alt
                />-->
              </div>
            </div>
            <div class="profile-info">
              <div class="row justify-content-center">
                <div class="col-12">
                  <div class="row">
                    <div class="col-xl-4 col-sm-4 border-right-1 prf-col">
                      <div class="profile-name">
                        <h4 class="text-primary">{{ profile.fullname }}</h4>
                        <p>{{ userRole }}</p>
                      </div>
                    </div>
                    <div class="col-xl-4 col-sm-4 border-right-1 prf-col">
                      <div class="profile-email">
                        <h4 class="text-muted">{{ country }}</h4>
                        <p>Country</p>
                      </div>
                    </div>
                    <div class="col-xl-4 col-sm-4 prf-col">
                      <div class="profile-call">
                        <h4 class="text-muted">{{ profile.phoneNo }}</h4>
                        <p>Phone No.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="onProfileSubmit">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">Name*</label>
                    <input
                      id="fullname"
                      v-model="profile.fullname"
                      readonly
                      name="fullname"
                      type="text"
                      class="form-control"
                      placeholder
                    />
                    <span v-if="formErrors.fullname" class="invalid-field">{{
                      formErrors.fullname
                    }}</span>
                  </div>
                </div>

                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">Phone Number*</label>
                    <input
                      v-model="profile.phoneNo"
                      type="text"
                      class="form-control"
                      placeholder
                    />
                    <span v-if="formErrors.phoneNo" class="invalid-field">{{
                      formErrors.phoneNo
                    }}</span>
                  </div>
                </div>

                <!-- <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">Gender*</label>
                    <multiselect
                      ref="multiselect-gender"
                      placeholder="Select Gender"
                      :searchable="true"
                      v-model="profile.genderId"
                      :options="genders"
                      label="text"
                      track-by="id"
                      selectLabel
              deselectLabel
                    ></multiselect>
                    <span v-if="formErrors.genderId" class="invalid-field">{{formErrors.genderId}}</span>
                  </div>
                </div>-->

                <!-- <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">Birth Date*</label>
                    <datepicker
                      v-model="profile.birthDate"
                      input-class="form-control"
                      name="uniquename"
                    ></datepicker>
                    <span v-if="formErrors.birthDate" class="invalid-field">{{formErrors.birthDate}}</span>
                  </div>
                </div>-->

                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">National ID No.*</label>
                    <input
                      v-model="profile.nationalIdNo"
                      readonly
                      type="text"
                      class="form-control"
                      placeholder
                    />
                    <span
                      v-if="formErrors.nationalIdNo"
                      class="invalid-field"
                    >{{ formErrors.nationalIdNo }}</span>
                  </div>
                </div>

                <div class="col-12">
                  <div class="row">
                    <div class="col-lg-12">
                      <button
                        type="submit"
                        class="btn btn-secondary pull-right"
                      >
                        <span>Update Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="onPasswordUpdate">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">Current Password*</label>
                    <input
                      v-model="password.password"
                      type="password"
                      class="form-control"
                      placeholder
                    />
                    <span v-if="formErrors.password" class="invalid-field">{{
                      formErrors.password
                    }}</span>
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">New Password*</label>
                    <input
                      v-model="password.newPassword"
                      type="password"
                      class="form-control"
                      placeholder
                    />
                    <span v-if="formErrors.newPassword" class="invalid-field">{{
                      formErrors.newPassword
                    }}</span>
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">Confirm New Password*</label>
                    <input
                      v-model="password.confirmPassword"
                      type="password"
                      class="form-control"
                      placeholder
                    />
                    <span
                      v-if="formErrors.confirmPassword"
                      class="invalid-field"
                    >{{ formErrors.confirmPassword }}</span>
                  </div>
                </div>

                <div class="col-12">
                  <div class="row">
                    <div class="col-lg-12">
                      <button
                        type="submit"
                        class="btn btn-secondary pull-right"
                      >
                        <span>Update Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  PROFILE_REQUEST,
  PASSWORD_POST_REQUEST,
  PROFILE_POST_REQUEST
} from "../../store/modules/auth/actions";
import { nameValidate, phoneValidate } from "../../utils/helpers";
import { GENDER_LIST_REQUEST } from "../../store/modules/utility/actions";
import { Message } from "element-ui";
import profile_cover from "../../assets/profile_cover.jpg";
import default_image from "../../assets/default_image.jpg";

export default {
  name: "ProfilePage",
  data() {
    return {
      profile: {},
      userRole: "",
      country: "",
      profilePic: "",
      submitted: false,
      formErrors: [],
      genders: [],
      password: {},
      backgroundImage: profile_cover
    };
  },
  methods: {
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    getProfile() {
      this.$store.dispatch(PROFILE_REQUEST, {}).then(resp => {
        if (resp.resultCode === 0) {
          this.profile = resp.content.userProfile;
          this.country = resp.content.countryRoleList[0]["country"];
          this.getGenders();
        }
        // console.log(this.profile);
      });
    },
    checkFormValidity(e, isProfile) {
      this.formErrors = {};
      let error = 0;

      if (isProfile) {
        if (!this.profile.fullname) {
          this.formErrors.fullname = "Name is required.";
          error++;
        } else {
          if (!nameValidate(this.profile.fullname)) {
            this.formErrors.fullname = "Name is invalid.";
            error++;
          }
        }

        if (!this.profile.phoneNo) {
          this.formErrors.phoneNo = "Phone number is required.";
          error++;
        } else {
          if (!phoneValidate(this.profile.phoneNo)) {
            this.formErrors.phoneNo = "Invalid phone number.";
            error++;
          }
        }
      } else {
        if (!this.password.password) {
          this.formErrors.password = "Current password is required.";
          error++;
        }

        if (!this.password.newPassword) {
          this.formErrors.newPassword = "New password is required.";
          error++;
        }

        if (!this.password.confirmPassword) {
          this.formErrors.confirmPassword =
            "Password confirmation is required.";
          error++;
        }

        if (this.password.confirmPassword != this.password.newPassword) {
          this.formErrors.confirmPassword = "Password not matched.";
          error++;
        }
      }

      if (error) {
        return false;
      } else {
        return true;
      }
    },
    onProfileSubmit(e) {
      this.submitted = true;
      let profile = {};
      if (!this.checkFormValidity(e, true)) {
        return;
      } else {
        profile.genderId = this.profile.genderId
          ? this.profile.genderId.id
          : null;
        profile.name = this.profile.fullname;
        profile.phoneNumber = this.profile.phoneNo;
        profile.nationalId = this.profile.nationalIdNo;
        profile.birthDate = this.profile.birthDate;
        this.$store.dispatch(PROFILE_POST_REQUEST, profile).then(res => {
          if (res.resultCode === 0) {
            Message({
              message: "Profile Successfully Updated.",
              type: "success",
              duration: 5 * 1000
            });
          }
        });
      }
    },
    onPasswordUpdate(e) {
      this.submitted = true;
      if (!this.checkFormValidity(e, false)) {
        return;
      } else {
        this.$store.dispatch(PASSWORD_POST_REQUEST, this.password).then(res => {
          if (res.resultCode === 0) {
            this.password = {};
            Message({
              message: "Password Successfully Updated.",
              type: "success",
              duration: 5 * 1000
            });
          }
        });
      }
    },
    getGenders() {
      this.$store.dispatch(GENDER_LIST_REQUEST).then(res => {
        if (res.content && res.resultCode === 0) {
          this.genders = res.content;
          // alert(JSON.stringify(this.profile));
          if (this.profile.genderId) {
            this.profile.genderId = this.getDataRowById(
              this.genders,
              this.profile.genderId
            );
          }
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
  mounted() {
    this.getProfile();

    this.userRole = this.$store.getters.getUserRole.replace("_", " ");
    this.profilePic = this.$store.getters.user.profilePic;
  },
  created() {}
};
</script>
