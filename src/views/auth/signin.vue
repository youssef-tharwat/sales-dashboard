<template>
  <div id="signin_page">
    <div class="login-bg h-100" style="margin-top:100px;">
      <div class="container h-100">
        <div class="row justify-content-center h-100">
          <div class="col-xl-6">
            <div class="form-input-content login-form">
              <div class="card">
                <div class="card-body">
                  <div class="logo text-center">
                    <router-link to="/signin">
                      <img src="../../../public/images/logo.png" alt />
                    </router-link>
                  </div>
                  <h2
                    v-if="env == 'development'"
                    class="text-danger text-center"
                  >
                    Development Env
                  </h2>
                  <h2
                    v-else-if="env == 'training'"
                    class="text-danger text-center"
                  >
                    Training Env
                  </h2>
                  <h4 class="text-center mt-4">Log into Your Account</h4>
                  <form class="mt-5 mb-5" @submit.prevent="onSubmit">
                    <div class="form-group">
                      <label>Email</label>
                      <input
                        id="email"
                        v-model="email"
                        type="email"
                        class="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <div class="form-group">
                      <label>Password</label>
                      <div
                        id="password_container"
                        class="d-flex align-items-center"
                      >
                        <input
                          id="password"
                          v-model="password"
                          :type="passwordShow ? 'text' : 'password'"
                          class="form-control"
                          placeholder="Password"
                        />
                        <i
                          v-if="!passwordShow"
                          class="fa fa-eye fa-lg"
                          @click="passwordShow = !passwordShow"
                        ></i>
                        <i
                          v-if="passwordShow"
                          class="fa fa-eye-slash fa-lg"
                          @click="passwordShow = !passwordShow"
                        ></i>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6"></div>
                      <div class="form-group col-md-6 text-right">
                        <router-link to="/forgot-password">
                          Forgot Password?
                        </router-link>
                      </div>
                    </div>
                    <div class="text-center mb-4 mt-4">
                      <button type="submit" class="btn btn-primary">
                        Sign in
                      </button>
                    </div>
                  </form>
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
import {
  AUTH_REQUEST,
  PROFILE_REQUEST
} from "../../store/modules/auth/actions";
export default {
  name: "SigninPage",
  data() {
    return {
      email: "",
      password: "",
      env: process.env.VUE_APP_NODE_ENV,
      passwordShow: false
    };
  },
  methods: {
    onSubmit() {
      const { email, password } = this;
      this.$store
        .dispatch(AUTH_REQUEST, { username: email, password: password })
        .then(resp => {
          if (resp.resultCode === 0) {
            if (resp.content.accessToken) {
              this.$store.dispatch(PROFILE_REQUEST, {}).then(resp2 => {
                if (resp2.content.userProfile.id) {
                  // console.log(resp.content);
                  if (resp2.content.countryRoleList[0]["role"] === "Agency") {
                    this.$router.push("/dashboard/download/sales-data", {
                      reload: true
                    });
                  } else {
                    this.$router.push("/dashboard", { reload: true });
                  }

                  location.reload();
                }
              });
              // this.$router.push("/dashboard", { reload: true });
              // location.reload();
            }
          }
        });
    }
  }
};
</script>
<style lang="scss">
#signin_page {
  #password_container {
    background: 0 0;
    min-height: 4rem;
    height: 4rem;
    font-size: 1.3rem;
    padding-left: 1.5rem;
    color: #000;
    box-shadow: none;
    border-radius: 0;
    font-family: "Poppins", sans-serif;
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    line-height: 1.5;
    border-color: 0.15s ease-in-out;
    box-shadow: 0.15s ease-in-out;
    border: 1px solid #dddfe1;
    font-weight: 500;
    #password {
      border: none;
      padding: 0.5rem;
    }
  }
}
</style>
