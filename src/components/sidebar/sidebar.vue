<template>
  <div class="nk-sidebar">
    <div class="nk-nav-scroll">
      <ul id="menu" class="metismenu">
        <li
          v-for="(menu, index) of routerLinks"
          :key="index"
          class="mega-menu mega-menu-lg"
          :class="isActiveMenu(menu) ? 'lenovo-active active' : ''"
          @click="menu.subMenu.length == 0 ? setActiveMenu(menu, {}) : ''"
        >
          <a v-if="menu.subMenu.length > 0" class="has-arrow link" aria-expanded="false">
            <i :class="getIcon(menu)"></i>
            <span class="nav-text">
              {{ menu.menu }}
              <!-- v-if="unreadMessageCount > 0"  -->
            </span>
          </a>
          <ul v-if="menu.subMenu.length > 0" aria-expanded="false">
            <li
              v-for="(subm, index2) of menu.subMenu"
              :key="index2"
              @click="setActiveMenu(menu, subm)"
            >
              <router-link :to="getRouterLink(subm)">
                <span @click="loadNewMessage">{{ subm.menu }}</span>
              </router-link>
            </li>
          </ul>
          <router-link
            v-if="menu.subMenu.length == 0"
            class="d-flex align-items-center"
            :to="getRouterLink(menu)"
          >
            <i :class="getIcon(menu)" @click="loadNewMessage"></i>
            <span class="nav-text" @click="loadNewMessage">{{ menu.menu }} {{ " " }}</span>
            <span
              v-if="
                (unreadMessageCount > 0 && menu.menu === 'Message' && !isDealer) ||
                  (ApprovalCount > 0 && menu.menu === 'Pending Approval' && !isRegionalAdmin)
              "
              class="unread-signal-nav pull-right"
            />
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  props: {
    unreadMessages: { type: Number, default: 0 },
    recountMessages: { type: Function, default: () => {} },
    pendingApprovalCount: { type: Number, default: 0 },
    reRenderComponent: { type: Boolean }
  },
  computed: {
    getAuthUser() {
      return this.$store.getters.user;
    },
    isMobile() {
      return window.innerWidth <= 768;
    },
    dashboardCheck() {
      return (
        this.$route.path.includes("dashboard/regional") ||
        this.$route.path.includes("dashboard/country")
      );
    },
    isRegionalAdmin() {
      return this.$store.getters.isRegionAdmin;
    }
  },
  data() {
    return {
      routerLinks: [],
      currentUrl: this.$route.path,
      activeMenu: "",
      isLoading: false,
      unreadMessageCount: this.unreadMessages,
      ApprovalCount: this.pendingApprovalCount,
      isDealer: false,
      countryId: 0,
      reloadData: false
    };
  },
  watch: {
    unreadMessages: function(newVal) {
      this.unreadMessageCount = newVal;
    },
    pendingApprovalCount: function(newVal) {
      this.ApprovalCount = newVal;
    },
    reRenderComponent: function(newVal) {
      this.reloadData = newVal;
    }
  },
  methods: {
    getIcon(menu) {
      return menu.icon;
    },
    getRouterLink(menu) {
      return "/dashboard" + menu.route;
    },
    setActiveMenu(menu) {
      /* eslint-disable no-undef */
      if (this.isMobile) {
        $("#main-wrapper").toggleClass("menu-toggle");
        $(".hamburger").toggleClass("is-active");
      }
      this.activeMenu = menu.id;
      this.currentUrl = this.$route.path;
      this.loadNewMessage();
    },
    isActiveMenu(menu) {
      if (this.activeMenu === menu.id) {
        return true;
      } else {
        return false;
      }
    },
    getRouterLinksArray() {
      this.routerLinks = [];
      this.isLoading = true;
      if (this.$store.getters.user.countryRoleList) {
        this.routerLinks = this.$store.getters.user.countryRoleList[0].menuItemList;
        if (this.isDealer && !this.getAuthUser.canBulkUpload) {
          this.routerLinks = this.routerLinks.filter(link => {
            return link.id !== 29;
          });
        }
      }
      this.isLoading = false;
    },
    getCurrentlyActive() {
      const route = this.$route.name;
      this.routerLinks.forEach(item => {
        if (Object.keys(item.subMenu).length > 0) {
          item.subMenu.forEach(sub => {
            if (sub.menu == route) {
              this.activeMenu = item.id;
            }
          });
        } else {
          if (item.menu == route) {
            this.activeMenu = item.id;
          }
        }
      });
    },
    loadNewMessage() {
      this.recountMessages();
    }
  },
  mounted() {
    this.isDealer = this.$store.getters.isDealer;
    this.countryId = this.$store.getters.getCountryId;
    if (!this.isLoading) {
      this.getCurrentlyActive();
    }
  },
  created() {
    this.getRouterLinksArray();
  }
};
</script>

<style scoped>
.link {
  cursor: pointer;
}
</style>
