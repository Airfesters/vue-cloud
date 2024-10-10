<template  class="container">
  <div v-if="!isTabInactive">
  <Header />
  <RouterView />
 
  <Navbar />
</div>
  <div v-else>
    <InactiveTab />
  </div>

</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Header from '@/components/Header.vue';
import { RouterView } from 'vue-router';

import InactiveTab from './components/InactiveTab.vue';
import { isTabInactive } from '@/composables/webSocketService'
</script>