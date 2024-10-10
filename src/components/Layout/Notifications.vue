<!-- eslint-disable vue/multi-word-component-names -->
<!-- Notifications.vue -->
<template>
  <!-- Notification button with badge -->
  <v-btn class="text-none" icon @click="showNotifications = !showNotifications">
    <!-- Badge showing the number of unread notifications -->
    <v-badge :content="unreadNotifications" color="error" v-if="unreadNotifications > 0">
      <v-icon>mdi-bell-outline</v-icon>
    </v-badge>
    <v-icon v-else>mdi-bell-outline</v-icon>
  </v-btn>

  <!-- List of notifications (dropdown, modal, etc.) -->
  <v-menu v-model="showNotifications" close-on-content-click>
    <v-list>
      <v-list-item
        v-for="(notification, index) in notifications"
        :key="index"
        @click="markAsRead(index)"
      >
        <v-list-item-title>
          {{ notification.message }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ notification.date }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref, computed } from 'vue'

// List of example notifications
const notifications = ref([
  { message: 'Deposit received: ₦2000', date: '2024-09-25', read: false },
  { message: 'Low balance alert', date: '2024-09-24', read: false },
  { message: 'Electricity bill paid', date: '2024-09-23', read: true }
])

// Show the notification dropdown menu
const showNotifications = ref(false)

// Computed to count unread notifications
const unreadNotifications = computed(() => {
  return notifications.value.filter((notification) => !notification.read).length
})

// Mark a notification as read
const markAsRead = (index) => {
  notifications.value[index].read = true
}
</script>

<script>
// This is the script block for exporting methods outside of <script setup>
export function addNotification(message) {
  const newNotification = {
    message,
    date: new Date().toLocaleDateString(),
    read: false
  }
  notifications.value.push(newNotification)
}
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
</style>
