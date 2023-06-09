<template>
  <div id="mobile-settings">
    <breadcrumb title="Dashboard" subtitle="Mobile Application Settings" />
    <form>
      <div class="row lnv-main-card">
        <div
          v-for="(role, index) of settings.appSettingByRoleList"
          :key="index"
          class="col-xl-6"
        >
          <div class="card forms-card">
            <div class="card-body">
              <h4 class="card-title mb-4">{{ role.role }}</h4>
              <div class="basic-form">
                <div
                  v-for="(setting, index2) of role.appSettingList"
                  :key="index2"
                  class="form-group row align-items-center"
                >
                  <label class="col-sm-6 col-form-label text-label">{{
                    setting.setting
                  }}</label>
                  <div
                    :class="
                      setting.code === 'AP13' ||
                        setting.code === 'AP12' ||
                        setting.code === 'AP13'
                        ? 'col-sm-5'
                        : 'col-sm-6'
                    "
                  >
                    <div
                      v-if="
                        setting.code != 'AP11' &&
                          setting.code != 'AP12' &&
                          setting.code != 'AP13'
                      "
                      class="input-group"
                    >
                      <label class="switch" :for="setting.id">
                        <input
                          :id="setting.id"
                          v-model="setting.bActive"
                          type="checkbox"
                          @change="updateSettings(setting)"
                        />
                        <div class="slider round"></div>
                      </label>
                    </div>
                    <div
                      v-if="setting.code === 'AP11'"
                      class="input-group d-flex align-items-center"
                    >
                      <div class="d-flex align-items-center">
                        <input
                          :id="setting.code"
                          v-model="setting.value"
                          type="number"
                          min="0"
                          value="0"
                          step="1"
                          class="form-control"
                          @change="updateSettings(setting)"
                        />
                        <div class="ml-3">days</div>
                      </div>
                    </div>
                    <div
                      v-if="setting.code === 'AP12' || setting.code === 'AP13'"
                      class="input-group"
                    >
                      <VueTimepicker
                        :id="setting.code"
                        v-model="setting.value"
                        format="hh:mm A"
                        @change="updateSettings(setting)"
                      ></VueTimepicker>
                      <!-- <input
                        type="text"
                        class="form-control"
                        :id="setting.code"
                        v-model="setting.value"
                        @change="updateSettings(setting)"
                      />-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import {
  MOBILE_APP_SETTINGS_REQUEST,
  MOBILE_APP_SETTINGS_POST_REQUEST
} from "../../store/modules/settings/actions";

import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";

export default {
  name: "SettingsPage",
  components: {
    breadcrumb: breadcrumb,
    VueTimepicker: VueTimepicker
  },
  computed: {},
  data() {
    return {
      isRegionAdmin: false,
      settings: {},
      salespSettings: [],
      promoterSettings: []
    };
  },
  methods: {
    getSettings() {
      let pdata = { countryId: this.$store.getters.getCountryId };

      this.$store.dispatch(MOBILE_APP_SETTINGS_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.settings = res.content;
          this.salespSettings = res.content[0];
          this.promoterSettings = res.content[1];
        }
      });
    },
    updateSettings(pdata) {
      this.$store
        .dispatch(MOBILE_APP_SETTINGS_POST_REQUEST, pdata)
        .then(res => {
          if (res.resultCode === 0) {
            return;
          }
        });
    }
  },
  mounted() {
    this.getSettings();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
  },
  created() {}
};
</script>

<style>
.time-picker {
  width: 100% !important;
}

.display-time {
  width: 100% !important;
  height: 4rem !important;
}
</style>
