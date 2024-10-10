// useLiveUpdates.js
import { onMounted, onUnmounted } from 'vue'
import { useLiveDataStore } from '@/store'
import { connectWebSocket, closeWebSocket } from './webSocketService'

export function useLiveUpdates() {
  const liveDataStore = useLiveDataStore()

  const splitUsageBetweenRooms = (usage) => {
    if (isNaN(usage) || usage <= 0) {
      console.error('Invalid total usage received:', usage)
      return
    }

    let remainingUsage = usage
    const roomCount = liveDataStore.rooms.length

    const updatedRooms = liveDataStore.rooms.map((_, i) => {
      if (i === roomCount - 1) {
        return remainingUsage
      }
      const randomUsage = Math.floor(Math.random() * (remainingUsage / (roomCount - i)))
      remainingUsage -= randomUsage
      return randomUsage
    })

    liveDataStore.updateRooms(updatedRooms)
  }

  const handleWebSocketMessage = (data) => {
    if (data && !isNaN(data.totalUsage)) {
      liveDataStore.updateTotalUsage(data.totalUsage)
      splitUsageBetweenRooms(data.totalUsage)
    } else {
      console.error('Invalid data received from WebSocket:', data)
    }
  }

  onMounted(() => {
    console.log('Attempting to connect to WebSocket...')
    connectWebSocket(handleWebSocketMessage)
  })

  onUnmounted(() => {
    closeWebSocket()
    console.log('WebSocket connection closed on unmount')
  })

  return {
    totalUsage: liveDataStore.totalUsage,
    rooms: liveDataStore.rooms
  }
}
