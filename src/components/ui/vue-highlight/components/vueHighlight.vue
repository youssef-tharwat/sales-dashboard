<template>
  <div :class="'context' + index">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "VueHighlight",
  props: {
    query: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      markInstance: []
    };
  },
  watch: {
    query: function(newValue) {
      this.query = newValue;
      this.mark();
    }
  },
  methods: {
    init() {
      this.markInstance = this.$mark(
        document.querySelector(".context" + this.index)
      );
    },
    mark() {
      let mark = this.markInstance;

      let keyword = this.query;

      // // Determine selected options
      let options = {};

      // Remove previous marked elements and mark
      // the new keyword inside the context
      mark.unmark({
        done: function() {
          mark.mark(keyword, options);
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
mark {
  background-color: yellow;
  padding: 0.2em;
}
</style>
