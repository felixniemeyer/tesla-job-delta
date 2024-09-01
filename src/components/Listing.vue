<script setup lang="ts">
import type { Listing } from '../status'
import type { ListingInfo } from './Delta.vue'

defineProps<{ 
  listing: Listing, 
  info: ListingInfo,
}>()

</script>

<template>
  <div class=id>
    <span class=number> {{ listing.id }} </span>
    <span class=type>{{ info.type }}</span>
  </div> 
  <div class=listing>
    <span class=title>{{ listing.t }}</span>
    <span class=department>{{ info.department }}</span>
    <span class=location>{{ info.location }}</span>
  </div>
</template>

<style scoped>
.id {
  text-align: right; 
  & span {
    display: block; 
  }
  & .number {
    opacity: 0.5; 
  }
}
/* maximize title, but align left */
.listing{
  flex: 1;
  text-align: left;
  margin: 0rem 0.4rem;
  & span {
    display:block; 
  }
}
.location {
  color: #fa8; 
}
.department {
  color: #4fb; 
}
.type {
  color: #3cf; 
}
</style>
