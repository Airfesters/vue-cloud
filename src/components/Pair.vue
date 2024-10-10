<!-- Pair.vue -->
<template>
  <div class="flex flex-col items-center justify-center">
    <h2 class="text-lg font-bold">Paired Devices</h2>
    <p>Your IP is: {{ clientIp }}</p>

    <!-- Display list of connected IPs -->
    <h3 class="text-md font-semibold mt-4">Connected IPs: {{ connectedIPs.length }}</h3>
    <ul>
      <li v-for="ip in connectedIPs" :key="ip" class="text-sm">{{ ip }}</li>
    </ul>
  </div>

  <!-- Show pairing request only if a visitor is attempting to connect -->
  <div v-if="pendingVisitorIp" class="mt-6">
    <h3>New IP Address: {{ pendingVisitorIp }} wants to connect</h3>
    <div class="actions">
      <v-btn @click="declineConnection" color="red">DECLINE</v-btn>
      <v-btn @click="acceptConnection" color="green">ACCEPT</v-btn>
    </div>
  </div>
</template>
<!-- Pair.vueeeeeeeeeeee -->
<script setup>
import { useLiveDataStore } from '@/composables/store'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Store instance
const liveDataStore = useLiveDataStore()

// Initialize WebSocket connection when the component mounts
onMounted(() => {
  liveDataStore.initWebSocket()  // Connect to the WebSocket server
})

// Cleanup WebSocket connection when the component is unmounted
onBeforeUnmount(() => {
  liveDataStore.closeConnection()
})

// Get client IP from the store
const clientIp = computed(() => liveDataStore.clientIp)

// Get the list of connected IPs from the store
const connectedIPs = computed(() => liveDataStore.connectedIPs)

// A ref to store the pending visitor IP that is requesting a connection
const pendingVisitorIp = ref('')

// Accept the connection: add the pending visitor's IP to the connected list
function acceptConnection() {
  if (pendingVisitorIp.value) {
    liveDataStore.addConnectedIP(pendingVisitorIp.value) // Add the IP to the connected IPs
    pendingVisitorIp.value = '' // Reset the pending IP after accepting
  }
}

// Decline the connection: simply discard the pending visitor's IP
function declineConnection() {
  pendingVisitorIp.value = '' // Reset the pending IP after declining
}

// Simulate receiving a pairing request from the visitor (this should be integrated into the WebSocket connection or any real-time system)
function handlePairRequest(ip) {
  pendingVisitorIp.value = ip
}
// Simulate incoming connection request for testing (in a real case, this would be triggered by WebSocket)
setTimeout(() => {
  handlePairRequest('192.168.72.233') // Example visitor IP requesting connection
}, 3000)
</script>



