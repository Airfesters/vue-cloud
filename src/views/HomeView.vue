<script setup>

import MainDashboard from '@/components/MainDashboard.vue';
import PowerView from './PowerView.vue';
import PayView from './PayView.vue';



</script>
<template>
      <!-- Meter Details -->
      <div class="flex flex-col items-center justify-center">
      <v-text-field
        label="Enter Meter Number"
        type="number"
        class="mb-4"
         maxlength="12"
        clearable
      ></v-text-field>
    <p>Account Name:</p>
  </div>

<MainDashboard/>
<PowerView/>
<!-- <PayView/> -->
</template>
