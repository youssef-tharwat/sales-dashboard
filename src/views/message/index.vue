<template>
  <div id="private-message">
    <breadcrumb title="Dashboard" subtitle="Message" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="contact-list-wrapper">
          <div v-if="isRegionAdmin" class="col-lg-12">
            <div class="row">
              <div class="col-lg-12">
                <Multiselect
                  ref="multiselect"
                  v-model="search.countryId"
                  placeholder="Select Country"
                  :searchable="true"
                  :options="countries"
                  label="text"
                  track-by="id"
                  select-label
                  deselect-label
                  :loading="isCountriesLoading"
                  @input="doSearch()"
                ></Multiselect>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row chat-app-wrapper">
              <div class="col-xl-3 mb-5 mb-xl-0 chat-contacts">
                <userList
                  :tread-selected="activeTread"
                  :active-message-tread="setActiveTread"
                  :selected-country-id="countryId"
                />
              </div>
              <div class="col-xl-9">
                <div v-if="loadMessages" class="event-chat-ryt">
                  <messages
                    :selected-country-id="countryId"
                    :tread-selected="activeTread"
                    :new-message-received="newMessage"
                    :recount-messages="getUnreadMessageCount"
                  />
                  <messageBox
                    v-if="!isRegionAdmin"
                    :tread-selected="activeTread"
                    :add-message="addMessage"
                    :load-messages="setActiveTread"
                    :selected-country-id="countryId"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import userList from "../../components/message/user_list";
import messageBox from "../../components/message/message_box";
import messages from "../../components/message/messages";
import { EventBus } from "@/utils/EventBus";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import { Message } from "element-ui";

export default {
  name: "PrivateMessagePage",
  components: {
    breadcrumb: breadcrumb,
    userList: userList,
    messageBox: messageBox,
    messages: messages,
    Multiselect: Multiselect
  },
  props: {
    recountMessages: { type: Function, default: () => {} }
  },
  computed: {},
  data: function() {
    return {
      activeTread: {},
      newMessage: {},
      isRegionAdmin: false,
      countries: [],
      search: {},
      countryId: null,
      loadMessages: false,
      isCountriesLoading: false
    };
  },
  methods: {
    getUnreadMessageCount() {
      EventBus.$emit("getUnreadData", 1);
      // this.recountMessages();
      // alert("sdf");
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      if (this.isRegionAdmin && !this.countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    checkFormValidity() {
      this.errors = {};
      let error = 0;

      if (error) {
        return false;
      } else {
        return true;
      }
    },
    setActiveTread(tread) {
      this.activeTread = tread;
    },
    addMessage(msg) {
      this.newMessage = msg;
    },
    handleReset() {},
    handleCancel() {},
    handleSubmit() {},
    getCountries() {
      this.isCountriesLoading = true;
      this.$store.dispatch(COUNTRY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.countries = res.content;
          this.isCountriesLoading = false;

          if (this.isRegionAdmin) {
            // alert(JSON.stringify(res.content[0]));
            // this.search.countryId = res.content[0];
            // this.countryId = res.content[0] ? res.content[0].id : 0;
            this.loadMessages = true;
          }
          // alert(this.countryId);
        } else {
          this.isCountriesLoading = false;
        }
      });
    }
  },
  mounted() {
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.getCountries();

    if (!this.isRegionAdmin) {
      this.loadMessages = true;
    }
  }
};
</script>
