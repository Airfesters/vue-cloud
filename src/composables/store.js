// store.js
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { connectWebSocket, closeWebSocket } from '@/composables/webSocketService'

export const useLiveDataStore = defineStore('liveData', () => {
  const totalUsage = ref(Number(localStorage.getItem('totalUsage')) || 0)
  const rooms = ref(JSON.parse(localStorage.getItem('rooms')) || Array(3).fill(0))
  const roomSwitches = ref(JSON.parse(localStorage.getItem('roomSwitches')) || Array(3).fill(true))
  const costPerKwh = 10
  const clientIp = ref('') // Store client IP
  const connectedIPs = ref([]) // Add state for connected IPs
  const pendingVisitorIp = ref('') // To store the IP of the visitor requesting to connect

  const addConnectedIP = (ip) => {
    if (!connectedIPs.value.includes(ip)) {
      connectedIPs.value.push(ip) // Add new IP if not already in the list
    }
  }
  // Wallet state
  const walletBalance = ref(Number(localStorage.getItem('walletBalance')) || 0)
  const transactions = ref(JSON.parse(localStorage.getItem('transactions')) || [])

  // Method to add funds to wallet
  const addFunds = (amount) => {
    if (amount > 0) {
      walletBalance.value += amount
      transactions.value.unshift({ type: 'deposit', amount, date: new Date().toLocaleString() })
      localStorage.setItem('walletBalance', walletBalance.value)
      localStorage.setItem('transactions', JSON.stringify(transactions.value))
      checkWalletAndUpdateSwitches()
    } else {
      console.warn('Invalid amount, no funds added')
    }
  }

  // Watchers for persistence
  watch(walletBalance, (newValue) => {
    localStorage.setItem('walletBalance', newValue)
  })

  watch(transactions, (newValue) => {
    localStorage.setItem('transactions', newValue.length ? JSON.stringify(newValue) : '[]')
  })

  // Method to handle pairing request from visitor IP
  const handlePairRequest = (ip) => {
    pendingVisitorIp.value = ip // Store the visitor IP
  }

  // Method to accept visitor's connection request
  const acceptConnection = () => {
    if (pendingVisitorIp.value && !connectedIPs.value.includes(pendingVisitorIp.value)) {
      connectedIPs.value.push(pendingVisitorIp.value) // Add the visitor IP to connected IPs
      pendingVisitorIp.value = '' // Clear the pending IP after accepting
    }
  }

  // Method to decline visitor's connection request
  const declineConnection = () => {
    pendingVisitorIp.value = '' // Clear the pending IP after declining
  }

  // Watchers for connected IPs state change
  watch(connectedIPs, (newValue) => {
    console.log('Updated connected IPs:', newValue)
    // Persist connected IPs if needed (localStorage or server)
  })

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    console.log('WebSocket message received:', data)

    if (data && data.action === 'updateConnectedIPs' && Array.isArray(data.connectedIPs)) {
      connectedIPs.value = data.connectedIPs
      console.log('Updated connected IPs:', connectedIPs.value)
    }

    // Update client IP if present
    if (data && data.clientIp) {
      console.log('Client IP found:', data.clientIp)
      clientIp.value = data.clientIp
    } else {
      console.warn('No client IP found in WebSocket message')
    }

    if (data && !isNaN(data.totalUsage)) {
      totalUsage.value = data.totalUsage
      splitUsageBetweenRooms(data.totalUsage)
    }
    autoDeductBill()
  }

  const splitUsageBetweenRooms = (usage) => {
    let remainingUsage = usage
    const roomCount = rooms.value.length

    rooms.value = rooms.value.map((_, i) => {
      if (i === roomCount - 1) {
        return remainingUsage
      }
      const randomUsage = Math.floor(Math.random() * (remainingUsage / (roomCount - i)))
      remainingUsage -= randomUsage
      return randomUsage
    })
  }

  const filteredTotalUsage = computed(() => {
    return rooms.value.reduce((sum, room, index) => {
      return roomSwitches.value[index] ? sum + room : sum
    }, 0)
  })

  const masterSwitch = computed({
    get: () => roomSwitches.value.every((switchState) => switchState),
    set: (value) => {
      roomSwitches.value.fill(value)
      localStorage.setItem('roomSwitches', JSON.stringify(roomSwitches.value))
    }
  })

  const activeRoomsCount = computed(() => {
    return roomSwitches.value.filter((switchState) => switchState).length
  })

  const roomBilling = computed(() => {
    return rooms.value.map((room, index) => {
      return roomSwitches.value[index] ? room * costPerKwh : 0
    })
  })

  const totalBilling = computed(() => {
    return filteredTotalUsage.value * costPerKwh
  })

  const autoDeductBill = () => {
    const currentBill = totalBilling.value
    if (walletBalance.value >= currentBill) {
      walletBalance.value -= currentBill
      transactions.value.push({
        type: 'payment',
        amount: currentBill,
        date: new Date().toLocaleString()
      })
      localStorage.setItem('walletBalance', walletBalance.value)
      localStorage.setItem('transactions', JSON.stringify(transactions.value))
    } else {
      roomSwitches.value = roomSwitches.value.map(() => false)
      localStorage.setItem('roomSwitches', JSON.stringify(roomSwitches.value))
      alert(
        'Insufficient funds! All rooms have been turned off. Please add more funds to your wallet.'
      )
    }
  }

  const checkWalletAndUpdateSwitches = () => {
    if (walletBalance.value > 0) {
      alert('Funds added. You can now turn on the rooms.')
    }
  }

  watch(totalUsage, (newValue) => {
    localStorage.setItem('totalUsage', newValue)
  })

  watch(rooms, (newValue) => {
    localStorage.setItem('rooms', JSON.stringify(newValue))
  })

  watch(
    roomSwitches,
    (newValue) => {
      localStorage.setItem('roomSwitches', JSON.stringify(newValue))
    },
    { deep: true }
  )

  const initWebSocket = () => {
    connectWebSocket(handleWebSocketMessage)
    console.log('WebSocket connection initialized')
  }

  const closeConnection = () => {
    closeWebSocket()
    console.log('WebSocket connection closed')
  }

  return {
    clientIp,
    connectedIPs,
    addConnectedIP,
    pendingVisitorIp,
    handlePairRequest,
    acceptConnection,
    declineConnection,
    totalUsage,
    costPerKwh,
    rooms,
    roomSwitches,
    filteredTotalUsage,
    activeRoomsCount,
    walletBalance,
    transactions,
    addFunds,
    roomBilling,
    totalBilling,
    masterSwitch,
    initWebSocket,
    closeConnection
  }
})






