<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// fuse
import Fuse from 'fuse.js'

export type Checklist = {[key: string]: boolean}
export type Labels = {[key: string]: string}

const props = defineProps<{ 
  labels: Labels
  checklist: Checklist
  name: string
}>()

// make Fuse object when labels change
let fuse: Fuse<any> | null = null
let list = [] as { id: string, label: string }[]

onMounted(initFuse)
// watch labels
watch(() => props.labels, initFuse)
function initFuse() {
  console.log('init fuse', props.labels)
  list = Object.keys(props.labels).map(key => ({ 
    id: key,
    label: props.labels[key] 
  }))
  fuse = new Fuse(list, {
    keys: ['label'], 
    threshold: 0.1, 
    distance: 1000
  })
}

const search = ref('')
const filteredChecklist = computed(() => {
  if( fuse !== null ) {
    if (search.value !== '') {
      const result = fuse.search(search.value)// .filter(result => result.score! < 0.1)
      return result
    } else {
      return list.map(element => ({ item: element }))
    }
  } else {
    return []
  }
})

const collapsed = ref(true)

// button for toggling collapsed
function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

function expand() {
  if (search.value !== '') {
    collapsed.value = false
  } 
}

function selectNone() {
  filteredChecklist.value.forEach(entry => {
    props.checklist[entry.item.id] = false
  }) 
}

function selectAll() {
  filteredChecklist.value.forEach(entry => {
    props.checklist[entry.item.id] = true
  })
}

function invertSelection() {
  filteredChecklist.value.forEach(entry => {
    props.checklist[entry.item.id] = !props.checklist[entry.item.id]
  })
}

function exclusiveSelect() {
  list.forEach(entry => {
    props.checklist[entry.id] = false
  })
  selectAll()
}

</script>

<template>
  <div class="checklist">
    {{ name }}
    <input v-model="search" placeholder="Search" @input="expand" />
    <button @click="search = ''">X</button>
    <button @click="toggleCollapsed">{{ collapsed ? 'show' : 'hide' }}</button>
    <div class='buttons'>
      <button @click="selectNone">Select None</button>
      <button @click="selectAll">Select All</button>
      <button @click="invertSelection">Invert Selection</button> 
      <template v-if='search !== ""'>
        <span > (refers to search results) </span>
        <button @click="exclusiveSelect">Exclusively Select Search Results</button>
      </template>
    </div>
    <div v-if="!collapsed" class='boxes'>
      <span class=option v-for="value, key in filteredChecklist" :key="key">
        <label>
          <input type="checkbox" v-model="props.checklist[value.item.id]"/>
          {{ value.item.label }}
        </label>
      </span>
    </div>
  </div>
</template>

<style scoped>
.checklist {
  margin: 0.5rem; 
}
.option {
  margin-right: 1rem; 
  vertical-align: middle;
  & input {
    margin: 0.1rem; 
  }
}
.boxes {
  margin: 0.5rem; 
  /* no break */
  & * {
    white-space: nowrap;
  }
}

button {
  margin: 0.2rem; 
}
</style>
