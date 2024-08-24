<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { Status } from './status'

import Delta from './components/Delta.vue'

const fromState = ref<Status>()
const toState = ref<Status>()

const fromTimestamp = ref<string>()
const toTimestamp = ref<string>()

onMounted(() => {
  loadDelta()
})

const encouragement = ref(false)
const canGoBack = ref(false)

const currentD = ref(0)

function loadDelta(d = 0) {
  currentD.value = d

  const dp1 = d + 1
  const stateJson = localStorage.getItem('state' + d)
  const stateTimestamp = localStorage.getItem('timestamp' + d)

  console.log('state' + d, stateJson, stateTimestamp)

  fromState.value = undefined
  toState.value = undefined
  canGoBack.value = false
  encouragement.value = false

  if(stateJson != null && stateTimestamp != null) {
    const prevStateJson = localStorage.getItem('state' + dp1)
    const prevStateTimestamp = localStorage.getItem('timestamp' + dp1)

    console.log('prev state', prevStateJson, prevStateTimestamp)
    if(prevStateJson != null && prevStateTimestamp != null) {
      fromTimestamp.value = new Date(parseInt(prevStateTimestamp)).toString()
      toTimestamp.value = new Date(parseInt(stateTimestamp)).toString()

      const dp2 = dp1 + 1
      canGoBack.value = (localStorage.getItem('state' + dp2) != null && localStorage.getItem('timestamp' + dp2) != null)

      fromState.value = JSON.parse(prevStateJson)
      toState.value = JSON.parse(stateJson)
      console.log('fromState', fromState.value)
    } else if (d == 0) {
      encouragement.value = true
    }     
  }
}

const statusInput = ref<HTMLInputElement>()
const error = ref<string>()

function setNewStatus() {
  if(statusInput.value) {
    const json = statusInput.value.value
    if(json !== "") {
      try {
        JSON.parse(statusInput.value.value) // try parsing catch else
        
        let d = 0
        let previousState = localStorage.getItem('state' + d)
        let previousTimestamp = localStorage.getItem('stateTimestamp' + d)
        localStorage.setItem('state' + d, json)
        localStorage.setItem('timestamp' + d, Date.now().toString())

        // shift history
        while(previousState != null && previousTimestamp != null) {
          d++
          const tempState = localStorage.getItem('state' + d)
          const tempStateTimestamp = localStorage.getItem('stateTimestamp' + d)
          localStorage.setItem('state' + d, previousState)
          localStorage.setItem('timestamp' + d, previousTimestamp)
          previousState = tempState
          previousTimestamp = tempStateTimestamp
        }

        error.value = ""
        statusInput.value.value = ""
        loadDelta()
      } catch(e) {
        error.value = "failed to set new state: " + e
      }
    } else {
      error.value = "empty input"
    }
  }
}

function clearStorage() {
  localStorage.clear()
  loadDelta()
}

function clearHistory() {
  let d = 2
  let previousState = localStorage.getItem('state' + d)
  let previousTimestamp = localStorage.getItem('stateTimestamp' + d)
  while(previousState != null || previousTimestamp != null) {
    localStorage.removeItem('state' + d)
    localStorage.removeItem('timestamp' + d)
    d++
    previousState = localStorage.getItem('state' + d)
    previousTimestamp = localStorage.getItem('stateTimestamp' + d)
  }
  loadDelta(0)
}

function goBack() {
  if(canGoBack.value) {
    loadDelta(currentD.value + 1)
  }
}

function goForward() {
  if(currentD.value > 0) {
    loadDelta(currentD.value - 1)
  }
}

</script>

<template>
  <h1>Tesla Job Delta</h1>
  <template v-if="encouragement">
    <p>
      Great, you have already added the state of tesla jobs once. 
      When you add a new state, you will see the changes.
    </p>
  </template>
  <p>
    Tell me the current state of tesla jobs. <br/>
    Follow these manual steps: 
    <ol>
      <li>go to <a target="_blank" href="https://www.tesla.com/cua-api/apps/careers/state">https://www.tesla.com/cua-api/apps/careers/state</a></li>
      <li>copy the json response to your clipboard</li>
      <li>paste the json in the following input field and submit</li>
    </ol>
  </p>
  <p class=inputs>
    <input type="text" accept=".json" ref="statusInput" />
    <button @click="setNewStatus">set current state</button>
    <span class=error>{{ error }}</span>
  </p>
  <div  v-if="fromState && toState" >
    <div class=info>
      <div class=button :class="{disabled: !canGoBack}" @click="goBack">
        &#9668;
      </div>
      <p> 
        Showing change of tesla job set from <br/> {{ fromTimestamp }} to <br/> {{ toTimestamp }}
      </p>
      <div class=button :class="{disabled: currentD == 0}" @click="goForward">
        &#9658;
      </div>
    </div>
    <div class=list>
      <Delta :from="fromState" :to="toState" />
    </div>
  </div>
  <p>
    Browse jobs on the official site: <a href="https://www.tesla.com/careers/search">Tesla Careers</a>
  </p>
  <p>
    clear local storage: <button @click="clearStorage">clear</button>
  </p>
  <p>
    clear history: <button @click="clearHistory">clear</button>
  </p>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.list {
  margin-bottom: 2em;
}
.error {
  color: #faa;
}
.inputs * {
  margin: 0.5em;
}
.info {
  display: flex;
  justify-content: space-between;
  /* align vertical mid */
  align-items: center;
  & .button {
    font-size: 2em;
    cursor: pointer;
    padding: 0.5em;
    border-radius: 0.5em;
    background-color: #7777;
    user-select: none;
    &.disabled {
      opacity: 0.5;
      cursor: default;
    }
  }
}

</style>
