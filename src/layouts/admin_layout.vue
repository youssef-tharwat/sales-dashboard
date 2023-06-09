<script>
import { mapGetters, mapState } from "vuex";
import Header from "../components/header/header.vue";
import Sidebar from "../components/sidebar/sidebar.vue";
import Footer from "../components/footer/footer.vue";
import { EventBus } from "@/utils/EventBus";
import { GET_UNREAD_MESSAGE_COUNT_REQUEST } from "../store/modules/message/actions";
export default {
  name: "Admin",
  components: {
    "admin-header": Header,
    "admin-sidebar": Sidebar,
    "admin-footer": Footer
  },
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated", "isProfileLoaded"]),
    ...mapState({
      authLoading: state => state.auth.status === "loading"
    })
  },
  data() {
    return {
      unreadCount: 0,
      pendingApprovalCount: 0,
      countryId: null,
      getUserId: 0,
      reRenderComponent: false
    };
  },
  watch: {
    getUserId: function() {
      // alert("fg");
    }
  },
  methods: {
    getUnreadMessages() {
      // alert("as");
      if (this.getUserId > 0) {
        let pdata = {
          countryId: this.countryId
        };
        this.$store
          .dispatch(GET_UNREAD_MESSAGE_COUNT_REQUEST, pdata)
          .then(res => {
            if (res.resultCode === 0) {
              this.unreadCount = res.content.privateMessageCount;
              this.pendingApprovalCount = res.content.pendingApprovalCount;
              // alert(this.unreadCount);
            }
            //
          });
      }
    }
  },
  mounted() {
    this.getUserId = this.$store.getters.getUserId;
    this.countryId = this.$store.getters.getCountryId;
    // this.getUserId = this.$store.getters.getUserId;
    this.getUnreadMessages();

    EventBus.$on("getUnreadData", () => {
      this.getUnreadMessages();
    });

    EventBus.$on("userLogout", () => {
      this.$router.push("/signin");
      location.reload();
    });

    EventBus.$on("reRenderApp", data => {
      let userData = JSON.parse(localStorage.getItem("user")) || {};
      let userId = userData.user ? userData.user.id : 0;

      if (userId != this.getUserId) {
        location.reload();
      }
      this.reRenderComponent = data;
    });
  }
};

// eslint-disable-next-line no-unused-vars
(function($) {
  "use strict";

  var vis = (function() {
    var stateKey,
      eventKey,
      keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
      };
    for (stateKey in keys) {
      if (stateKey in document) {
        eventKey = keys[stateKey];
        break;
      }
    }
    return function(c) {
      if (c) document.addEventListener(eventKey, c);
      return !document[stateKey];
    };
  })();

  // eslint-disable-next-line no-unused-vars
  var visible = vis(); // gives current state

  vis(); // registers a handler for visibility changes`

  vis(function() {
    if (vis()) {
      EventBus.$emit("reRenderApp", true);
      // this.reRenderComponent = true;
      document.title = "Lenovo CMS ";
      // EventBus.$emit("reRenderApp", data => {
      //   // console.log("caught in parent", data);
      //   // this.getUnreadMessages();
      // });
    } else {
      EventBus.$emit("reRenderApp", false);
      // this.reRenderComponent = false;
      document.title = "Lenovo CMS | Offline";
    }
  });
  // eslint-disable-next-line no-undef
})(jQuery);
</script>

<template>
  <div>
    <div id="main-wrapper" class="lnv-wrapper">
      <admin-header
        :pending-approval-count="pendingApprovalCount"
        :unread-messages="unreadCount"
        :recount-messages="getUnreadMessages"
        :re-render-component="reRenderComponent"
      />
      <admin-sidebar
        :pending-approval-count="pendingApprovalCount"
        :unread-messages="unreadCount"
        :recount-messages="getUnreadMessages"
        :re-render-component="reRenderComponent"
      />
      <div class="lnv-container">
        <div class="content-body main-container">
          <div class="container-fluid admin-layout-body">
            <!-- <router-view></router-view> -->
            <slot
              :pending-approval-count="pendingApprovalCount"
              :count-messages="getUnreadMessages"
              :re-render-component="reRenderComponent"
            />
          </div>
        </div>
        <admin-footer />
      </div>
    </div>
  </div>
</template>
