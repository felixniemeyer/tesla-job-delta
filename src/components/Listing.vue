<script setup lang="ts">
import type { Listing } from '../status'

defineProps<{ 
  listing: Listing, 
}>()

</script>

<template>
  <a class=container
    target="_blank"
    :href="'https://www.tesla.com/careers/search/job/tjt-' + listing.id">
    <div class=id>{{ listing.id }}: </div> 
    <div class=title>{{ listing.t }}</div>
  </a>
</template>

<style scoped>
/* place title right of id */
.container {
  display: flex;
  margin: 0.3rem 0; 
}
.id {
  opacity: 0.5; 
}
/* maximize title, but align left */
.title{
  flex: 1;
  text-align: left;
  margin: 0rem 0.4rem;
}
</style>
