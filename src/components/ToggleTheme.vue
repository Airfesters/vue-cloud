<!-- ToggleTheme.vue -->
<template>
  <button @click="toggleTheme" class="bg-[rgb(60,59,59)] text-white-100 px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
    <FontAwesomeIcon :icon="isDarkMode ? faMoon : faSun" />
  </button>
</template>

  
  <script setup>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
  import { ref, watch, onMounted } from 'vue'
  
  // Add icons to the library
  library.add(faMoon, faSun)
  
 // Set default mode to dark
const isDarkMode = ref(true)  // Default to dark mode
  
  // Toggle between light and dark modes
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }
  
  // Apply the selected theme
  const applyTheme = () => {
    const theme = isDarkMode.value ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)  // Save theme preference in local storage
  }
  
  // Set initial theme based on local storage or default
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme === 'dark'
    applyTheme()
  })
  
  // Watch for changes in theme and apply them
  watch(isDarkMode, applyTheme)
  </script>
  
  <style>
  /* Light and Dark mode colors */
  [data-theme='light'] {
    --bg-color: #2d2d2d;
    --text-color: gray;
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --accent-color: #e74c3c;
    --border-color: #ccc;
    --button-bg: #fff;
    --button-text: #ffffff;
  }
  
  [data-theme='dark'] {
    --bg-color: #2d2d2d;
    --text-color: gray;
    --primary-color: #2980b9;
    --secondary-color: #27ae60;
    --accent-color: #c0392b;
    --border-color: #444;
    --button-bg: #333;
    --button-text: #fff;
  }
  </style>
  
