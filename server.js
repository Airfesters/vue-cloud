// server.js
import { WebSocketServer } from 'ws'

// Track connected IP addresses and corresponding WebSocket connections
const connectedClients = new Map()

const wss = new WebSocketServer({ host: '0.0.0.0', port: 8080 })

// Function to broadcast the list of connected IPs to all clients
function broadcastConnectedIPs() {
  const connectedIPs = Array.from(connectedClients.keys()) // Get all connected IPs
  const data = {
    action: 'updateConnectedIPs',
    connectedIPs
  }

  // Send the updated IP list to all connected clients
  connectedClients.forEach((ws) => {
    ws.send(JSON.stringify(data))
  })
}

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress

  // Check if this IP is already connected
  if (connectedClients.has(clientIp)) {
    console.log(`IP ${clientIp} is already connected. Closing the previous connection.`)

    // Send a message to the old connection to inform it to close
    const oldConnection = connectedClients.get(clientIp)
    oldConnection.send(
      JSON.stringify({
        action: 'disconnect',
        message: 'You have been disconnected because a new session was opened on another tab.'
      })
    )
    oldConnection.close() // Close the old WebSocket
  }

  // Add new connection for this IP
  connectedClients.set(clientIp, ws)
  console.log(`New client connected from IP: ${clientIp}`)

  // Broadcast updated IP list to all clients
  broadcastConnectedIPs()

  // Send random total estate usage every 2 seconds (example data)
  const interval = setInterval(() => {
    const totalUsage = Math.floor(Math.random() * (100000 - 2000 + 1)) + 2000
    const data = { totalUsage, clientIp }
    ws.send(JSON.stringify(data))
  }, 2000)

  ws.on('close', () => {
    console.log(`Client disconnected from IP: ${clientIp}`)
    clearInterval(interval)

    // Remove the IP from connectedClients on disconnect
    if (connectedClients.get(clientIp) === ws) {
      connectedClients.delete(clientIp)

      // Broadcast updated IP list when a client disconnects
      broadcastConnectedIPs()
    }
  })

  ws.onerror = (error) => {
    console.error(`Error from IP ${clientIp}:`, error)
  }
})

console.log('WebSocket server is running on ws://0.0.0.0:8080')




