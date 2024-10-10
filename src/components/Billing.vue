<!-- eslint-disable vue/multi-word-component-names -->
<!-- Billing.vue -->
<template>
  <div class="flex flex-col items-center justify-center">
    <h2 class="text-lg font-bold mb-4">Prepaid Billing System</h2>

    <!-- Tariff Calculation -->
    <div class="flex items-center space-x-4 mb-4">
      <h2 class="text-lg font-sm">
        ₦{{ liveDataStore.costPerKwh }}/kWh : {{ liveDataStore.filteredTotalUsage }}kWh
      </h2>
    </div>

    <!-- Total Billing -->
    <div class="flex items-center space-x-4 mb-4">
      <h2 class="text-lg font-bold">Total Billing: ₦{{ totalBilling }}</h2>
    </div>

    <!-- Individual Room Billing -->
    <div v-for="(room, index) in rooms" :key="index" class="mb-4 overflow-hidden">
      <div class="flex items-center space-x-4">
        <!-- Display room name, usage, and billing -->
        <p v-if="roomSwitches[index]">
          Room {{ index + 1 }}: {{ room }} kWh, Billing: ₦{{ roomBilling[index] }}
        </p>
        <p v-else>Room {{ index + 1 }} (Turned off)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLiveDataStore } from '@/composables/store'
import { computed } from 'vue'

const liveDataStore = useLiveDataStore()

// Data for rooms and switches from store
const rooms = computed(() => liveDataStore.rooms)
const roomSwitches = computed(() => liveDataStore.roomSwitches)

// Billing information from store
const roomBilling = computed(() => liveDataStore.roomBilling)
const totalBilling = computed(() => liveDataStore.totalBilling)
</script>
