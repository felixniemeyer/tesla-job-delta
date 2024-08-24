<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

import type { Status, Listing } from '../status'

import ListingComponent from './Listing.vue'

const props = defineProps<{ 
  from: Status, 
  to: Status
}>()

interface ListingInfo {
  location: string
  department: string
  type: string
}

interface Entry {
  from?: Listing
  to?: Listing
  delta: "added" | "removed" | "updated"
  info?: ListingInfo
}

const map = ref<Record<string, Entry>>({})

const deleted = computed(() => Object.values(map.value).filter(entry => entry.delta === "removed"))
const added = computed(() => Object.values(map.value).filter(entry => entry.delta === "added"))
const updated = computed(() => Object.values(map.value).filter(entry => entry.delta === "updated"))

onMounted(() => {
  findDelta()
  loadFilter()
})

// watch for changes in the props
watch(() => props.from, findDelta)
watch(() => props.to, findDelta)

function findDelta() {
  const tempMap: any = {}
  props.from.listings
    .filter(filter)
    .forEach(listing => {
      tempMap[listing.id] = {
        from: listing,
        delta: "removed"
      }
    })
  props.to.listings
    .filter(filter)
    .forEach(listing => {
      if (tempMap[listing.id]) {
        if(different(tempMap[listing.id].from, listing)) {
          tempMap[listing.id].to = listing
          tempMap[listing.id].delta = "updated"
        } else {
          delete tempMap[listing.id]
        }
      } else {
        tempMap[listing.id] = {
          to: listing, 
          delta: "added"
        }
      }
    })
  for(const key in tempMap) {
    const entry = tempMap[key]
    const state = entry.delta === "removed" ? props.from : props.to
    const location = state.lookup.locations[entry.l]
    entry.info = {
      location,
      department: state.lookup.departments[entry.dp], 
      type: state.lookup.types[entry.y], 
    }
  }
  map.value = tempMap
}

const filters = 0 
function loadFilter() {
}

function filter(_listing: Listing) {
  return true
}

function different(from: Listing, to: Listing) {
  Object.keys(from).forEach(key => {
    if ((from as any)[key] !== (to as any)[key]) {
      return true
    }
  })
  return false
}

</script>

<template>
  <div class='added'>
    <h2>{{ added.length }} Added</h2>
    <div v-for="entry in added" :key="entry.to!.id">
      <ListingComponent :listing="entry.to!" :link=true />
    </div>
    <div v-if="added.length === 0" class="read-the-docs">No added listings</div>
  </div>
  <div class='updated'>
    <h2>{{ updated.length }} Updated</h2>
    <div v-for="entry in updated" :key="entry.to!.id">
      <ListingComponent :listing="entry.to!" :link=true />
    </div>
    <div v-if="updated.length === 0" class="read-the-docs">No updated listings</div>
  </div>
  <div class='deleted'>
    <h2>{{ deleted.length }} Deleted</h2>
    <div v-for="entry in deleted" :key="entry.from!.id">
      <ListingComponent :listing="entry.from!" :link=false />
    </div>
    <div v-if="deleted.length === 0" class="read-the-docs">No deleted listings</div>
  </div>
</template>

<style scoped>
.read-the-docs {
  opacity: 0.5;
}

h2 {
  font-weight: bold;
}

.deleted, .added, .updated {
  background-color: 7777; 
}
</style>
