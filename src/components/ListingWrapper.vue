<script setup lang="ts">
import type { Listing } from '../status'
import type { ListingInfo } from './Delta.vue'

import ListingComponent from './Listing.vue'

defineProps<{ 
  listing: Listing, 
  info: ListingInfo,
  link: boolean
}>()

</script>

<template>
  <a class=container
    v-if="link"
    target="_blank"
    :href="'https://www.tesla.com/careers/search/job/tjt-' + listing.id">
    <ListingComponent :listing="listing" :info="info" />
  </a>
  <div class=container v-else>
    <ListingComponent :listing="listing" :info="info" />
  </div>
</template>

<style scoped>
/* place title right of id */
.container {
  display: flex;
  margin: 0.3rem 0; 
}
div {
  color: #aaa !important;
}
</style>
