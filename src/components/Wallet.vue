<!-- Wallet.vue -->
<template>
  <div class="flex flex-col items-center justify-center">
    <h2 class="text-lg font-bold mb-4">Your Wallet</h2>

    <!-- Wallet Balance Display -->
    <div class="mb-4">
      <h3 class="text-xl font-bold">Bal: ₦{{ walletBalance }}</h3>
    </div>

    <!-- Add Funds Form -->
    <div class="mb-4">
      <v-text-field
        v-model="amountToAdd"
        label="Enter Amount to Add"
        type="number"
        outlined
        hide-details
        class="mb-4"
      ></v-text-field>
      <v-btn @click="openCreditCardModal" color="orange">Add Funds</v-btn>
    </div>

    <!-- Transaction History - Only show deposits -->
    <div class="mt-8">
      <h3 class="text-lg font-bold mb-4">Deposit History</h3>
      <v-list>
        <v-list-item v-for="(transaction, index) in depositTransactions" :key="index">
          <v-list-item-content>
            <v-list-item-title> Deposit: ₦{{ transaction.amount }} </v-list-item-title>
            <v-list-item-subtitle>{{ transaction.date }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>

    <!-- Credit Card Modal Component -->
    <CreditCardModal
      v-model:isModalVisible="isModalVisible"
      :amount="amountToAdd"
      :onPaymentSuccess="addFundsToWallet"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLiveDataStore } from '@/composables/store'
import CreditCardModal from '@/components/CreditCardModal.vue'

// Store reference
const liveDataStore = useLiveDataStore()

// Use computed for walletBalance and transactions to ensure reactivity
const walletBalance = computed(() => liveDataStore.walletBalance)
// Computed property for filtering deposits only
const depositTransactions = computed(() =>
  liveDataStore.transactions.filter(
    (transaction) => transaction.type === 'deposit' && transaction.amount > 0
  )
)

// Local state to manage the amount to add and modal visibility
const amountToAdd = ref(0)
const isModalVisible = ref(false)

// Method to open the credit card modal
const openCreditCardModal = () => {
  if (amountToAdd.value > 0) {
    isModalVisible.value = true
  } else {
    alert('Please enter a valid amount')
  }
}

// Method to add funds to the wallet (only called after successful payment)
const addFundsToWallet = () => {
  liveDataStore.addFunds(Number(amountToAdd.value))
  amountToAdd.value = 0
  isModalVisible.value = false
}
</script>
