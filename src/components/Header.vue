<!-- Header.vue -->
<!-- Header.vue -->
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import ToggleTheme from './ToggleTheme.vue';

// Add icons to the library
library.add(faBell, faBars);

// State to track header visibility
const isHeaderVisible = ref(true);
let lastScrollTop = 0;

// Header text (MooonSign, MooonPower, etc.)
const headerText = ref('MooonSIGN');

// Define a mapping of route paths to the header text
const routeToHeaderMap = {
  '/': 'Vue CLoud',
  '/power': 'MooonPower',
  '/pay': 'Pay',
  '/device': 'MooonDevice',
  '/server': 'Server',
};

// Get current route
const route = useRoute();

// Update header text based on the current route
const updateHeaderText = () => {
  const routePath = route.path;
  headerText.value = routeToHeaderMap[routePath] || 'MooonSIGN'; // Default to MooonSIGN if the route doesn't match
};

// Watch for route changes and update header text
watch(route, updateHeaderText);

// Detect if the user is scrolling up or down
const handleScroll = () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    isHeaderVisible.value = false;
  } else {
    isHeaderVisible.value = true;
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

// Add scroll event listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  updateHeaderText(); // Set initial header text on mount
});

// Clean up event listener when component unmounts
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="min-h-full flex flex-col">
    <!-- Sticky Header with transition -->
    <nav
      class="bg-[rgb(60,59,59)] border-b border-gray-500 w-full fixed top-0 left-0 transition-transform duration-1000 z-50 h-16"
      :class="{
        'translate-y-0': isHeaderVisible,
        '-translate-y-0': !isHeaderVisible
      }"
    >
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <RouterLink class="flex items-center" to="/">
            <span class="md:block text-white text-2xl font-bold ml-2">{{ headerText }}</span>
          </RouterLink>

          <!-- Icons -->
          <div class="flex items-center space-x-2">
            <ToggleTheme/>
            <RouterLink to="/">
              <!-- Notification Icon Button -->
              <button
                class="h-10 w-10 flex items-center justify-center text-white bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition duration-300"
              >
                <font-awesome-icon icon="bell" />
              </button>
            </RouterLink>

            <RouterLink to="/">
              <!-- Menu Icon Button -->
              <button
                class="h-10 w-10 flex items-center justify-center text-white bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition duration-300"
              >
                <font-awesome-icon icon="bars" />
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content (flex-grow ensures it takes up the remaining space) -->
    <div class="flex-grow mt-16">
      <!-- Your main page content here -->
    </div>
  </div>
</template>
