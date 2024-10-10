<!-- CreditCardModal.vue -->
<template>
  <v-dialog v-model="localModalVisible" max-width="500px">
    <v-card>
      <v-card-title class="headline">Enter Credit Card Details</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="cardNumber"
          label="Card Number"
          maxlength="16"
          type="text"
          outlined
        ></v-text-field>

        <v-text-field
          v-model="cardExpiry"
          label="Expiry Date (MM/YY)"
          maxlength="5"
          type="text"
          outlined
        ></v-text-field>

        <v-text-field
          v-model="cardCVC"
          label="CVC"
          maxlength="3"
          type="password"
          outlined
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="green" @click="processPayment">Submit Payment</v-btn>
        <v-btn color="red" @click="closeModal">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['isModalVisible', 'amount', 'onPaymentSuccess'])
const emit = defineEmits(['update:isModalVisible'])

// Local state for the modal visibility
const localModalVisible = ref(props.isModalVisible)

// Watcher to sync prop changes with local modal visibility
watch(
  () => props.isModalVisible,
  (newVal) => {
    localModalVisible.value = newVal
  }
)

// Watch for local changes and emit to the parent
watch(localModalVisible, (newValue) => {
  emit('update:isModalVisible', newValue)
})

// Local state for card details
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCVC = ref('')

// Function to simulate payment processing
const processPayment = () => {
  if (
    cardNumber.value.length === 16 &&
    cardExpiry.value.length === 5 &&
    cardCVC.value.length === 3
  ) {
    alert('Payment processed successfully!')
    props.onPaymentSuccess()
    closeModal()
  } else {
    alert('Please enter valid card details!')
  }
}

// Close the modal
const closeModal = () => {
  localModalVisible.value = false
}
</script>
