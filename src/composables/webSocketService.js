// webSocketService.js
import { ref } from 'vue'

// Reactive state to track if the tab should be inactive
export const isTabInactive = ref(false)

let socket
let isConnected = false

const connectWebSocket = (onMessage) => {
  if (isConnected) return // Avoid reconnecting if already connected

  socket = new WebSocket('ws://192.168.65.231:8080')
  isConnected = true

  socket.onopen = () => {
    console.log('WebSocket connection established')
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // console.log('WebSocket message received:', data)

    // Handle disconnect message
    if (data.action === 'disconnect') {
      isTabInactive.value = true // Set the tab as inactive
      showDisconnectAlert(onMessage) // Show custom alert with Reactivate button
      closeWebSocket() // Close this WebSocket connection
      return
    }

    onMessage(data)
  }

  socket.onclose = () => {
    console.log('WebSocket connection closed')
    isConnected = false // Reset connection state on close
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

const closeWebSocket = () => {
  if (socket) {
    socket.close()
    isConnected = false
  }
}

// Restore Inactive Tab
const reactivateConnection = (onMessage) => {
  connectWebSocket(onMessage)

  // Remove any existing custom alert
  const customAlert = document.getElementById('customAlert')
  if (customAlert) {
    document.body.removeChild(customAlert)
  }

  // Set the tab to active again
  isTabInactive.value = false
}

// Function to show custom alert with Reactivate button
const showDisconnectAlert = (onMessage) => {
  if (document.getElementById('customAlert')) return

  const alertDiv = document.createElement('div')
  alertDiv.id = 'customAlert'
  alertDiv.style.position = 'fixed'
  alertDiv.style.top = '20%'
  alertDiv.style.left = '50%'
  alertDiv.style.transform = 'translate(-50%, -50%)'
  alertDiv.style.backgroundColor = 'white'
  alertDiv.style.padding = '20px'
  alertDiv.style.borderRadius = '8px' // Added border-radius for rounded corners
  alertDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
  alertDiv.style.zIndex = '1000'

  alertDiv.innerHTML = `
    <div>
     <button id="okButton" style="margin-right: 10px;"></button>
     <button 
        id="reactivateButton"
        style="
          background-color: #2563eb; /* Primary blue */
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        "
        onmouseover="this.style.backgroundColor='#1d4ed8'" 
        onmouseout="this.style.backgroundColor='#2563eb'"
      >
        Oya run am here
      </button>
    </div>
  `
  document.body.appendChild(alertDiv)

  document.getElementById('okButton').addEventListener('click', () => {
    document.body.removeChild(alertDiv)
  })

  document.getElementById('reactivateButton').addEventListener('click', () => {
    reactivateConnection(onMessage)
  })
}

export { connectWebSocket, closeWebSocket, reactivateConnection }






