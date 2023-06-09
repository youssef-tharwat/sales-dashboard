<template>
  <div>
    <div class="nav-header d-flex align-items-center justify-content-start">
      <div class="brand-logo d-flex p-1 pl-lg-2 pr-lg-2 pt-md-1 pb-lg-1">
        <router-link to="/">
          <img class="img-fluid" src="../../../public/images/logo.png" alt />
        </router-link>
      </div>
      <div class="nav-control">
        <div class="hamburger">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </div>
      </div>
    </div>
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <ul>
            <li class="icons position-relative">
              <div v-if="env === 'development' || env === 'test'">
                DEVELOPMENT MODE ({{ userRole }})
              </div>
              <div v-else-if="env === 'training'">TRAINING MODE ({{ userRole }})</div>
              <div class="drop-down animated bounceInDown">
                <div class="dropdown-content-body"></div>
              </div>
            </li>
          </ul>
        </div>
        <div class="header-right">
          <ul>
            <li v-if="unreadCount > 0 && !isDealer" class="icons">
              <router-link class="link" to="/dashboard/messages">
                <i class="mdi mdi-comment" @click="loadNewMessage"></i>
                <div class="pulse-css" @click="loadNewMessage">{{ unreadCount }}</div>
              </router-link>
            </li>
            <li class="icons">
              <a class="log-user link">
                <img :src="profilePic" alt="Profile" />
                <span>{{ name }}</span>
                <i class="fa fa-caret-down f-s-14" aria-hidden="true"></i>
              </a>
              <div class="drop-down dropdown-profile animated bounceInDown">
                <div class="dropdown-content-body">
                  <ul>
                    <li>
                      <router-link to="/profile">
                        <i class="icon-user"></i>
                        <span>My Profile</span>
                      </router-link>
                    </li>
                    <li v-if="isCountryAdmin">
                      <router-link to="/dashboard/settings" class="link">
                        <i class="fa fa-cog"></i>
                        <span>Setting</span>
                      </router-link>
                    </li>
                    <li>
                      <a class="link" @click="onLogout">
                        <i class="icon-power"></i>
                        <span>Logout</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { AUTH_LOGOUT } from "../../store/modules/auth/actions";

import { GET_UNREAD_MESSAGE_COUNT_REQUEST } from "../../store/modules/message/actions";
import { EventBus } from "../../utils/EventBus";

export default {
  name: "Lnvheader",
  props: {
    unreadMessages: { type: Number, default: 0 },
    recountMessages: { type: Function, default: () => {} }
  },
  computed: {
    ...mapGetters(["getUser", "isAuthenticated", "isProfileLoaded"]),
    ...mapState({
      authLoading: state => state.auth.status === "loading",
      name: state => `${state.auth.user.name}`,
      profilePic: state => `${state.auth.user.profilePic}`
    })
  },
  data() {
    return {
      unreadCount: this.unreadMessages,
      countryId: 0,
      isDealer: false,
      isCountryAdmin: false,
      getUserId: null,
      env: process.env.VUE_APP_NODE_ENV,
      userRole: null
    };
  },
  watch: {
    unreadMessages: function(newVal) {
      this.unreadCount = newVal;
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch(AUTH_LOGOUT).then(res => {
        if (res.logout) {
          EventBus.$emit("userLogout", 1);
          // this.$router.push("/signin");
          // location.reload();
        }
      });
    },
    getUnreadMessages() {
      if (this.getUserId > 0) {
        let pdata = {
          countryId: this.countryId
        };
        this.$store.dispatch(GET_UNREAD_MESSAGE_COUNT_REQUEST, pdata).then(res => {
          if (res.resultCode === 0) {
            this.unreadCount = res.content.privateMessageCount;
            // localStorage.setItem("unread-messages", this.unreadCount);
          }
        });
      }
    },
    loadNewMessage() {
      this.recountMessages();
    }
  },
  mounted() {
    this.countryId = this.$store.getters.getCountryId;
    this.isDealer = this.$store.getters.isDealer;
    this.getUserId = this.$store.getters.getUserId;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    this.userRole = this.$store.getters.getUserRole;
    // this.getUnreadMessages();
    // alert(this.unreadCount);
  }
};
</script>
<style>
@media only screen and (max-width: 768px) {
  .nav-header {
    height: 6rem;
  }
  #regional-dashboard .page-titles {
    display: none;
  }
}
.link {
  cursor: pointer;
}
.dev-mod {
  background-color: #f70001;
  color: #fff !important;
  text-align: center;
}
</style>
