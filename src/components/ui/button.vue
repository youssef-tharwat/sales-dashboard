<template>
  <div id="submit-button" class="submit-container">
    <div
      ref="submit-btn"
      :class="buttonClass"
      class="submit-btn"
      @click="clickedSubmit"
    >
      <span v-show="!clicked">Submit</span>
      <span v-show="loaded">✔</span>
    </div>

    <!--  grey circle  -->
    <svg v-if="loading" class="loader-svg">
      <path
        stroke="#CCCCCC"
        fill="none"
        stroke-width="4"
        d="M25,2.5A22.5,22.5 0 1 1 2.5,25A22.5,22.5 0 0 1 25,2.5"
      />
    </svg>

    <!--  green circle  -->
    <!--  circumference  -->
    <!-- 3.1416 * 50 = ~157 -->
    <svg v-if="loading" class="loader-svg">
      <path
        stroke="#20BF7E"
        fill="none"
        stroke-width="4"
        d="M25,2.5A22.5,22.5 0 1 1 2.5,25A22.5,22.5 0 0 1 25,2.5"
        stroke-dasharray="157"
        :stroke-dashoffset="loaderOffset"
      />
    </svg>
  </div>
</template>

<script>
const circumference = 157;
export default {
  name: "LnvButton",
  computed: {
    buttonClass() {
      if (this.loaded) {
        return "loaded";
      }

      if (this.clicked) {
        return "round";
      }

      return "";
    }
  },
  data() {
    return {
      clicked: false,
      loading: false,
      loaded: false,
      loaderOffset: circumference
    };
  },
  methods: {
    clickedSubmit() {
      // no actions until loading finishes
      if (this.clicked && !this.loaded) return;

      // restart when button finished the animation
      if (this.loaded) {
        this.restart();
        return;
      }

      // start loading animation
      this.clicked = true;

      // when css transition ends, execute animateLoader method
      this.$refs["submit-btn"].addEventListener(
        "transitionend",
        this.animateLoader,
        false
      );
    },
    animateLoader() {
      this.loading = true;
      // remove transition end event listener
      this.$refs["submit-btn"].removeEventListener(
        "transitionend",
        this.animateLoader,
        false
      );

      // animate the loaderOffset property,
      // on production this should be replaced
      // with the real loading progress
      //   TweenLite.to(this, 3, {
      //     loaderOffset: 0,
      //     ease: Power4.easeInOut,
      //     onComplete: this.completeLoading // execute this method when animation ends
      //   });
    },
    completeLoading() {
      this.loading = false;
      this.loaded = true;
    },
    restart() {
      this.clicked = false;
      this.loaded = false;
      this.loaderOffset = circumference;
    }
  }
};
</script>

<style scoped>
.submit-container {
  position: relative;
  margin: 80px;
}

.submit-btn {
  width: 100px;
  color: #20bf7e;
  font-size: 20px;
  font-family: Arial;
  text-align: center;
  text-decoration: none;
  padding: 10px 20px 10px 20px;
  border: solid #20bf7e 4px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 25px;
  transition: width 0.3s, margin 0.3s, background-color 0.3s, color 0.3s;
}

.submit-btn:hover {
  background-color: #20bf7e;
  color: white;
}

.submit-btn.round {
  margin-left: 50px;
  border-color: #cccccc;
  background: white;

  /*  circle should be 50px width & height */
  /* borderLeft + paddingLeft + paddingRight + borderRight  */
  /* 4 + 20 + 20 + 4 = 48 + 2 = 50 */
  width: 2px;
  /* borderTop + paddingTop + paddingBottom + borderBottom  */
  /* 4 + 10 + 10 + 4 = 28 + 22 = 50 */
  height: 22px;
}
.submit-btn.loaded {
  color: white;
  background-color: #20bf7e;
}

.loader-svg {
  pointer-events: none;
  position: absolute;
  top: 0px;
  left: 50px;
  width: 50px;
  height: 50px;
  transform-origin: 25px 25px 25px;
}
</style>
