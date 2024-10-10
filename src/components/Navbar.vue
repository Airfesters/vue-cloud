<!-- Navbar.vue -->
<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { ref, onMounted, onUnmounted } from 'vue';

// Add icons to the library
library.add(faBell, faBars);

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

// State to track footer visibility
const isFooterVisible = ref(true);
let lastScrollTop = 0;

// Detect if the user is scrolling up or down
const handleScroll = () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    // User is scrolling down - hide footer
    isFooterVisible.value = false;
  } else {
    // User is scrolling up or stopped - show footer
    isFooterVisible.value = true;
  }
  
  // Update the last scroll position
  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

// Add scroll event listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// Clean up event listener when component unmounts
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="min-h-full flex flex-col">
    <!-- Main Content (flex-grow ensures it takes up the remaining space) -->
    <div class="flex-grow">
      <!-- Your main page content here -->
    </div>

    <!-- Footer Navigation with transition -->
    <nav
      class="bg-[rgb(60,59,59)] border-t border-gray-500 w-full fixed bottom-0 left-0 transition-transform duration-200"
      :class="{
        'translate-y-0': isFooterVisible,
        'translate-y-full': !isFooterVisible
      }"
    >
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-center">
          <!-- Nav Menu Links -->
          <div class="flex space-x-4">
            <RouterLink
              to="/"
              :class="[
                isActiveLink('/') ? 'bg-[rgb(229,135,0)]' : 'hover:bg-gray-900 hover:text-white',
                'text-white',
                'px-4',
                'py-2',
                'rounded-full',
                'flex',
                'items-center',
                'justify-center'
              ]"
            >
              Power
            </RouterLink>
           <!--  <RouterLink
              to="/power"
              :class="[
                isActiveLink('/power') ? 'bg-[rgb(229,135,0)]' : 'hover:bg-gray-900 hover:text-white',
                'text-white',
                'px-4',
                'py-2',
                'rounded-full',
                'flex',
                'items-center',
                'justify-center'
              ]"
            >
              Power
            </RouterLink> -->
          <!--   <RouterLink
              to="/pay"
              :class="[
                isActiveLink('/pay') ? 'bg-[rgb(229,135,0)]' : 'hover:bg-gray-900 hover:text-white',
                'text-white',
                'px-4',
                'py-2',
                'rounded-full',
                'flex',
                'items-center',
                'justify-center'
              ]"
            >
              Pay
            </RouterLink> -->
           <!--  <RouterLink
              to="/device"
              :class="[
                isActiveLink('/device') ? 'bg-[rgb(229,135,0)]' : 'hover:bg-gray-900 hover:text-white',
                'text-white',
                'px-4',
                'py-2',
                'rounded-full',
                'flex',
                'items-center',
                'justify-center'
              ]"
            >
              Device
            </RouterLink> -->
            <RouterLink
              to="/server"
              :class="[
                isActiveLink('/server') ? 'bg-[rgb(229,135,0)]' : 'hover:bg-gray-900 hover:text-white',
                'text-white',
                'px-4',
                'py-2',
                'rounded-full',
                'flex',
                'items-center',
                'justify-center'
              ]"
            >
              Server
            </RouterLink>
          </div>

          
        </div>
      </div>
    </nav>
  </div>
</template>

