<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'

import type { Status, Listing } from '../status'

import ListingWrapperComponent from './ListingWrapper.vue'
import ChecklistComponent from './Checklist.vue'
import type { Checklist, Labels } from './Checklist.vue'

const props = defineProps<{ 
  from: Status, 
  to: Status
}>()

export interface ListingInfo {
  location: string
  department: string
  type: string
}

interface Entry {
  listing: Listing
  info: ListingInfo
}

const deleted = ref<Entry[]>([])
const added = ref<Entry[]>([])
const updated = ref<Entry[]>([])

onBeforeMount(() => {
  findDelta()
})

// watch for changes in the props
watch(() => props.from, findDelta)
watch(() => props.to, findDelta)

function findDelta() {
  const pastListings = {} as {[key: string]: Listing}
  props.from.listings.filter(filter).forEach(listing => {
    pastListings[listing.id] = listing
  })

  deleted.value = []
  added.value = []
  updated.value = []

  findOptions()

  props.to.listings
    .filter(filter)
    .forEach(listing => {
      if (pastListings[listing.id]) {
        if(different(pastListings[listing.id], listing)) {
          updated.value.push({
            listing, 
            info: getInfo(listing, props.to)
          })
        } else {
          delete pastListings[listing.id]
        }
      } else {
        added.value.push({
          listing, 
          info: getInfo(listing, props.to)
        })
      }
    })

  for(const key in pastListings) {
    deleted.value.push({
      listing: pastListings[key], 
      info: getInfo(pastListings[key], props.from)
    })
  }
}

const locationNames = ref<Labels>({})
const departmentNames = ref<Labels>({})
const typeNames = ref<Labels>({})

const selectedLocations = ref<Checklist>({})
const selectedDepartments = ref<Checklist>({})
const selectedTypes = ref<Checklist>({})

function findOptions() {
  console.log('find options, e.g. departments=', JSON.stringify(props.to.lookup.departments))
  Object.entries(props.to.lookup.locations).forEach(([key, value]) => {
    locationNames.value[key] = value
    selectedLocations.value[key] ||= true
  })
  Object.entries(props.to.lookup.departments).forEach(([key, value]) => {
    departmentNames.value[key] = value
    selectedDepartments.value[key] ||= true
  })
  Object.entries(props.to.lookup.types).forEach(([key, value]) => {
    typeNames.value[key] = value
    selectedTypes.value[key] ||= true
  }, {} as Checklist)
}

function getInfo(listing: Listing, state: Status) {
  return {
    location: state.lookup.locations[listing.l], 
    department: state.lookup.departments[listing.dp], 
    type: state.lookup.types[listing.y], 
  }
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
  <div class=filter>
    <ChecklistComponent name="locations" :checklist="selectedLocations" :labels="locationNames" />
    <ChecklistComponent name="departments" :checklist="selectedDepartments" :labels="departmentNames" />
    <ChecklistComponent name="types" :checklist="selectedTypes" :labels="typeNames" />
  </div>  
  <div class='added'>
    <h2>{{ added.length }} Added</h2>
    <ListingWrapperComponent v-for="entry in added" :key="entry.listing.id" :listing="entry.listing" :info="entry.info" :link=true />
    <div v-if="added.length === 0" class="read-the-docs">No added listings</div>
  </div>
  <div class='updated'>
    <h2>{{ updated.length }} Updated</h2>
    <ListingWrapperComponent v-for="entry in updated" :key="entry.listing.id" :listing="entry.listing" :info="entry.info" :link=true />
    <div v-if="updated.length === 0" class="read-the-docs">No updated listings</div>
  </div>
  <div class='deleted'>
    <h2>{{ deleted.length }} Deleted</h2>
    <ListingWrapperComponent v-for="entry in deleted" :key="entry.listing.id" :listing="entry.listing" :info="entry.info" :link=false />
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
