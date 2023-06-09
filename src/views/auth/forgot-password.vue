<template>
  <div>
    <div class="login-bg h-100" style="margin-top:100px;">
      <div class="container h-100">
        <div class="row justify-content-center h-100">
          <div class="col-xl-6">
            <div class="form-input-content login-form">
              <div class="card">
                <div class="card-body">
                  <div class="logo text-center">
                    <a href="index.html">
                      <img src="../../../public/images/logo.png" alt />
                    </a>
                  </div>
                  <h4 class="text-center mt-4">Enter your email</h4>
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
                    <div class="form-row">
                      <div class="form-group col-md-6"></div>
                      <div class="form-group col-md-6 text-right">
                        <router-link to="/signin">
                          Login to your account?
                        </router-link>
                      </div>
                    </div>
                    <div class="text-center mb-4 mt-4">
                      <button type="submit" class="btn btn-primary">
                        Reset Password
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
import { PASSWORD_RESET_REQUEST } from "../../store/modules/auth/actions";
// import {
//   NOTIFICATION_REQUEST,
//   NOTIFICATION_SUCCESS,
//   NOTIFICATION_ERROR,
//   NOTIFICATION_CLOSE
// } from "../../store/modules/ui/actions";
import { Message } from "element-ui";
export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    onSubmit() {
      // this.$store.dispatch(NOTIFICATION_REQUEST, {
      //   message: "Submitting..."
      // });

      this.$store
        .dispatch(PASSWORD_RESET_REQUEST, { username: this.email })
        .then(resp => {
          if (resp.resultCode === 0) {
            // this.$store.dispatch(NOTIFICATION_SUCCESS, {
            //   message: "Password reset email sent to your given email address."
            // });
            Message({
              message: "Password reset email sent to '" + this.email + "'.",
              type: "success",
              duration: 5 * 1000
            });
            this.email = "";
          } else {
            // this.$store.dispatch(NOTIFICATION_CLOSE, {
            //   message: resp.content.message
            // });
          }
        });
    }
  }
};
</script>
