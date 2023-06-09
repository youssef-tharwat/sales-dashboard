<template>
  <div class="row page-titles">
    <div class="col p-md-0">
      <!-- <h4>{{title}}</h4> -->
      <h4>{{ this.$route.name }}</h4>
    </div>
    <div class="col p-md-0">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/dashboard">Home</router-link>
        </li>
        <li v-if="subtitle" class="breadcrumb-item" :class="{ active: !subSubTitle }">
          <router-link v-if="!subSubTitle" :to="this.$route">{{ subtitle }}</router-link>
          <router-link v-else :to="{ name: subtitle }">{{ subtitle }}</router-link>
        </li>
        <li v-if="subSubTitle" class="breadcrumb-item active">
          <router-link :to="this.$route">{{ subSubTitle }}</router-link>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    subSubTitle: { type: String, default: "" }
  }
};
</script>

<style></style>
