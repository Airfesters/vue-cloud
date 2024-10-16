<template>
  <div class="mx-auto py-20 flex items-center justify-center">
    <div class="relative flex items-center justify-center">
      <div
        class="w-72 h-72 rounded-full bg-[#e58700] flex flex-col items-center justify-center overflow-hidden"
      >
        <h1 class="text-black text-4xl font-bold">{{ filteredTotalUsage }} kWh</h1>
        <!-- <h1 class="text-black text-4xl font-bold">24586 kWh</h1> -->
        <div class="flex justify-between w-56">
          <p class="text-black text-sm mt-2">240v</p>
          <p class="text-black text-sm mt-2">
            Rooms: {{ liveDataStore.activeRoomsCount }}/{{ liveDataStore.rooms.length }}
          </p>
          <p class="text-black text-sm mt-2">Health: 0%</p>
        </div>
    <!--     <div class="mb-4 flex items-center">
          <span class="text-black text-sm font-bold">
            <span v-if="showBalance">Bal: ₦{{ walletBalance }}</span>
            <span v-else>Bal: {{ '●●●●●●●●' }}</span>
          </span>
          <span @click="toggleBalance" class="cursor-pointer text-black ml-2">
            <i :class="showBalance ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"></i>
          </span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLiveDataStore } from '@/composables/store'
import { computed, onMounted, ref } from 'vue'

const liveDataStore = useLiveDataStore()
const walletBalance = computed(() => liveDataStore.walletBalance)
const filteredTotalUsage = computed(() => liveDataStore.filteredTotalUsage)
const showBalance = ref(true)

const toggleBalance = () => {
  showBalance.value = !showBalance.value
}

onMounted(() => {
  liveDataStore.initWebSocket()
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
