<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// fuse
import Fuse from 'fuse.js'

export type Checklist = {[key: string]: boolean}
export type Labels = {[key: string]: string}

const props = defineProps<{ 
  checklist: Checklist
  labels: Labels
  name: string
}>()

// make Fuse object when labels change
let fuse: Fuse<any> | null = null
onMounted(initFuse)
watch(() => props.labels, initFuse)
let list = [] as { id: string, label: string }[]
function initFuse() {
  list = Object.keys(props.labels).map(key => ({ 
    id: key,
    label: props.labels[key] 
  }))
  console.log(`initializing fuse for ${props.name} with list: ${list}`)
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
      console.log('searching for', search.value, 'found', result)
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

</script>

<template>
  <div class="checklist">
    {{ name }}
    <input v-model="search" placeholder="Search" />
    <button @click="toggleCollapsed">{{ collapsed ? 'Show' : 'Hide' }}</button>
    <div v-if="!collapsed" class='boxes'>
      <span class=option v-for="value, key in filteredChecklist" :key="key">
        <input type="checkbox" v-model="props.checklist[value.item.id]" @input="collapsed = false" />
        <label>{{ value.item.label }}</label>
      </span>
    </div>
  </div>
</template>

<style scoped>
.checklist {
  margin: 0.5rem; 
}
.option {
  margin-right: 0.3rem; 
}
.boxes {
  margin: 0.5rem; 
}
</style>
