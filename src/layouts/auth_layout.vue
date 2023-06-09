<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "Admin",
  computed: {
    ...mapGetters(["getProfile", "isAuthenticated", "isProfileLoaded"]),
    ...mapState({
      authLoading: state => state.auth.status === "loading"
    })
  }
};
</script>

<template>
  <div id="auth-layout">
    <slot />
  </div>
</template>
