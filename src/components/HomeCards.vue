<script setup>
import { RouterLink } from 'vue-router';
import Card from '@/components/Card.vue';
import Dashboard from './Dashboard.vue';
import Billing from './Billing.vue';
</script>

<template>
      <!-- Add Funds Form -->
      <div class="flex flex-col items-center justify-center">
      <v-text-field
        label="Enter Meter Number"
        type="number"
        class="mb-4"
      ></v-text-field>
    <p>Account Name:</p>
  </div>

  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card>
          <Dashboard/>
        </Card>
        <Card bg="bg-green-100">
         <Billing/>
        </Card>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Remove spinners for Vuetify number input */
.v-input__control input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  -webkit-appearance: none; /* Chrome, Safari, newer Opera */
  appearance: none; /* Standard property */
}

.v-input__control input[type="number"]::-webkit-inner-spin-button, 
.v-input__control input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0; /* Remove default margin */
}
</style>