<!-- Dashboard.vue -->
<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-center space-x-4 mb-4">
      <v-switch
        v-model="liveDataStore.masterSwitch"
        color="orange-darken-3"
        inset
        hide-details
        :disabled="walletBalance <= 0"
      ></v-switch>
      <h2 class="text-lg font-bold">Total Room Usage: {{ filteredTotalUsage }} kWh</h2>
    </div>

    <div v-for="(room, index) in rooms" :key="index" class="mb-4 overflow-hidden">
      <div class="flex items-center space-x-4">
        <v-switch
          v-model="roomSwitches[index]"
          color="orange-darken-3"
          hide-details
          :disabled="walletBalance <= 0"
        ></v-switch>
        <p v-if="roomSwitches[index]">Room {{ index + 1 }}: {{ room }} kWh</p>
        <p v-else>Room {{ index + 1 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLiveDataStore } from '@/composables/store'
import { computed } from 'vue'

const liveDataStore = useLiveDataStore()
const rooms = computed(() => liveDataStore.rooms)
const roomSwitches = computed(() => liveDataStore.roomSwitches)
const filteredTotalUsage = computed(() => liveDataStore.filteredTotalUsage)
const walletBalance = computed(() => liveDataStore.walletBalance)
</script>
