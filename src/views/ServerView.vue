<template>
  <div class="container">
  
    <div v-if="notification" class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded shadow">
      {{ notification }}
      <button @click="clearNotification" class="ml-2">X</button> <!-- Optional: to manually clear notification -->
    </div>
  
   <!-- Top Bar with Light/Dark Mode, Add Server Button, and Server Counter -->
   <div class="flex justify-between text-white-800 items-center p-4">
    <!-- Search Bar -->
  <input
      type="text"
      v-model="searchQuery"
      placeholder="Search Server"
      class="bg-[rgb(60,59,59)]  text-white-800 px-4 py-2 rounded-full"
    />  
    
   <!-- Dropdown list of servers -->
    <div class="bg-[rgb(60,59,59)] text-white-800 px-4 py-2 rounded-full">
      <select id="server-dropdown" v-model="selectedServerId" @change="onServerSelect" class="bg-[rgb(60,59,59)]">
        <option v-for="server in servers" :key="server.id" :value="server.id">
          {{ server.text }}
        </option>
      </select>
    </div>
  
    <div class="flex justify-between items-center space-x--1">
    <button @click="openModal" class="text-white-200 px-4 py-2">
    <FontAwesomeIcon :icon="faFolderPlus"  /></button>
    <div class=" hidden md:block text-lg text-white-800"> {{ totalServersCount }}
      <span class="text-white-800">: {{ formatSize(calculateTotalServersSize(servers)) }}</span>
    </div>
  
  </div>
    </div>
  
    <!-- Hidden input for folder selection -->
    <input 
      type="file" 
      ref="folderInput" 
      @change="handleFolderUpload" 
      webkitdirectory 
      multiple 
      class="hidden" 
    />
  
   
  
   <!-- Add Server Modal -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click.self="closeModal">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-xl mb-4">Add New Server</h2>
          <input v-model="newServerName" placeholder="New Server" ref="firstFocusable" @keyup.enter="addServer" class="w-full p-2 border border-gray-300 rounded mb-4"/>
          <div class="flex justify-between">
            <button @click="addServer" type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Add Server</button>
            <button @click="closeModal" type="button" ref="lastFocusable" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
          </div>
          <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
        </div>
      </div>
    </transition>
    <!-- List of Servers -->
    <ol class="server-list">
      <li 
        v-for="server in servers" 
        :key="server.id" 
        :class="{ 'selected': selectedServer?.id === server.id }"
        @click="selectServer(server)"
        class="server-item"
      >
        <!-- Display Mode -->
        <div class="flex justify-between items-center">
    <span v-if="!server.isEditing" @dblclick="enableEditing(server)">
      {{ server.text }} ({{ server.folderCount || 0 }} folders) - {{ formatSize(calculateServerSize(server)) }}
    </span>
  
          <!-- Editing Mode (only for non-default servers) -->
          <input
            v-else
            v-model="server.text"
            @blur="saveServerName(server)"
            @keyup.enter="saveServerName(server)"
            :id="`edit-${server.id}`"
            type="text"
          />
        <!-- Server Menu Icon (3 dots) -->
        <button class="menu-icon" @click="toggleMenu(server)">⋮</button>
        </div>
  <!-- Server Menu Dropdown Menu -->
  <ul v-if="showMenu === server.id" class="menu-dropdown">
          <li v-if="!defaultServers.some(defaultServer => defaultServer.id === server.id)" 
              @click="() => { enableEditing(server); handleMenuItemClick(); }">Rename</li>
          <li v-if="!defaultServers.some(defaultServer => defaultServer.id === server.id)" 
              @click="() => { confirmDelete(server); handleMenuItemClick(); }">Delete</li>
          <!-- Additional menu options if needed -->
          <li @click="() => { downloadServer(server); handleMenuItemClick(); }">Download</li>
          <li @click="() => { searchServer(server); handleMenuItemClick(); }">Search Server</li>
          <li @click="() => { shareServer(server); handleMenuItemClick(); }">Share</li>
          <li @click="() => { viewDetails(server); handleMenuItemClick(); }">Details</li>
          <li @click="() => { viewActivity(server); handleMenuItemClick(); }">Activity</li>
          <li @click="() => { setColor(server); handleMenuItemClick(); }">Set Color</li>
        </ul>
  
  
        <!-- Folder Details -->
       <ul v-if="selectedServer?.id === server.id && selectedServer?.folders?.length > 0" class="folder-list">
    <li v-for="folder in selectedServer.folders" :key="folder.id" class="folder-item">
          <!-- Toggle between folder name and input field based on renaming state -->
      <div v-if="!folder.isRenaming">
        {{ folder.name }} ({{ folder.files.length }} files, {{ formatSize(calculateFolderSize(folder)) }})
       </div>
      <!-- Folder Renaming Input -->
      <div v-else>
        <input
          v-model="folder.name"
          @keyup.enter="saveFolderName(folder, selectedServer)"
          @blur="saveFolderName(folder, selectedServer)"
          :id="'edit-folder-' + folder.id"
        />
      </div>
        <!-- Folder Menu Icon (3 dots) -->
        <button class="folder-menu-icon" @click="toggleFolderMenu">
          ⋮
      </button>
      <!-- Folder Menu Dropdown -->
      <ul v-if="showFolderMenu" class="folder-menu-dropdown">
    <li @click="() => { enableFolderRenaming(folder,  selectedServer); handleMenuItemClick(); }">Rename</li>
    <li @click="() => { deleteFolder(folder, selectedServer); handleMenuItemClick(); }">Delete</li>
    <li @click="() => { downloadFolder(folder); handleMenuItemClick(); }">Download</li>
    <li @click="() => { shareFolder(folder); handleMenuItemClick(); }">Share</li>
    <li @click="() => { viewFolderDetails(folder); handleMenuItemClick(); }">Details</li>
  </ul>
    </li>
  </ul>
              
      </li>
    </ol>
   
    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div v-if="showDeleteConfirmation" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal" role="dialog" aria-labelledby="delete-confirmation-title" aria-modal="true">
          <h2 id="delete-confirmation-title">Confirm Deletion</h2>
          <p>Are you sure you want to delete the server "{{ serverToDelete?.text }}"?</p>
          <button @click="deleteServer">Yes, Delete</button>
          <button @click="closeDeleteModal">Cancel</button>
        </div>
      </div> 
    </transition>
  
    </div>
  
   <!-- Sticky Upload Button with Transition -->
   <transition name="slide-up">
      <button
        v-show="!isScrolling"
        @click="triggerFolderUpload"
      class="fixed bottom-20 right-12 bg-[rgb(229,135,0)] text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-300 transition duration-300"
    >
        <FontAwesomeIcon :icon="faCloudArrowUp" />
        Upload Folder
      </button>
    </transition>
  </template>

  
<script setup>
import { RouterLink } from 'vue-router';

import { ref, reactive, nextTick, computed, watch, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMoon, faSun, faCloudArrowUp, faChevronDown, faChevronUp, faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons'



const notification = ref('')
const showFolderMenu = ref(false)

// Menu toggle for folder menu
const toggleFolderMenu = () => {
  showFolderMenu.value = !showFolderMenu.value
}

// Add icons to the library
library.add(faMoon, faSun, faCloudArrowUp, faFolderPlus, faPlus, faChevronDown, faChevronUp )

// Unique ID generator
let id = 0

// Default Servers
const defaultServers = [
  { id: id++, text: 'Admin', folders: 0 },
  { id: id++, text: 'Manager', folders: 0 },
  { id: id++, text: 'Staff', folders: 0 },
  { id: id++, text: 'MoooNet', folders: 0 },
  { id: id++, text: 'Server5', folders: 0 }
]

// Load servers from localStorage or fall back to default servers
const loadServersFromStorage = () => {
  const savedServers = localStorage.getItem('servers')
  return savedServers ? JSON.parse(savedServers) : [...defaultServers]
}

// Servers list that includes both default and newly added servers
const servers = ref(loadServersFromStorage())

// Watch for changes to the servers and save to localStorage
watch(servers, (newServers) => {
  localStorage.setItem('servers', JSON.stringify(newServers))
}, { deep: true })

// Function to select a server
function selectServer(server) {
  selectedServer.value = server;
  errorMessage.value = ''; // Clear error on valid selection
}

const selectedServerId = ref(null)

const onServerSelect = () => {
   const server = servers.value.find(s => s.id === selectedServerId.value)
   if (server) {
      selectedServer.value = server
   }
}

// Selected server state (default to null)
const selectedServer = ref(null);

const folderInput = ref(null)

// Function to trigger the folder upload input
function triggerFolderUpload() {
  if (!selectedServer.value) {
    errorMessage.value = 'Please select a server before uploading folders.'
    return
  }
 
  // Ensure folderInput exists before trying to trigger click
  if (folderInput.value) {
    folderInput.value.click()
  }
}

const handleFolderUpload = (event) => {
  const files = Array.from(event.target.files);
  const folderName = files[0]?.webkitRelativePath.split('/')[0];
  
  const server = servers.value.find(s => s.id === selectedServerId.value);

  if (!server) {
    alert('Please select a server to upload the folder.');
    return;
  }

  // Initialize folders array if not already done
  if (!server.folders) {
    server.folders = [];
  }

   // Check for duplicate folder names
   const isDuplicate = server.folders.some(folder => folder.name === folderName);
  if (isDuplicate) {
    notification.value = `Folder "${folderName}" already exists.`;
    return; // Stop further execution
  }

    // Add the new folder
    server.folders.push({ name: folderName, files });

    // Update the folder count directly
    server.folderCount = server.folders.length; // Directly update the folder count

    // Clear notification after successful addition
    notification.value = '';

    console.log(`Uploaded folder '${folderName}' to server '${server.text}'`);
    event.target.value = null;
};

// Define `clearNotification` function separately
const clearNotification = () => {
  notification.value = '';
};

onMounted(() => {
  if (!selectedServerId.value && servers.value.length > 0) {
    selectedServerId.value = servers.value[0].id; // Select the first server by default
  }
});

const updateServerFolderCounts = () => {
  servers.value.forEach(server => {
    server.folderCount = server.folders.length;
  });
};

// Watch the servers to update the selectedServer if a new server is added or removed
watch(servers, (newServers) => {
  if (newServers.length === 0) {
    selectedServer.value = null // Reset if no servers
  } else if (!newServers.some(server => server.id === selectedServer.value?.id)) {
    selectedServer.value = newServers[0] // Select the first server if selected one is deleted
  }
}, { immediate: true, deep: true })

// Computed property to calculate total server count
const totalServersCount = computed(() => servers.value.length)

// Modal controls
const showModal = ref(false)
const newServerName = ref('')
const errorMessage = ref('')

// Validation rules
const MIN_NAME_LENGTH = 3
const MAX_NAME_LENGTH = 20
const validNamePattern = /^[a-zA-Z0-9 ]+$/


// Track focusable elements in the modal
const firstFocusable = ref(null)
const lastFocusable = ref(null)

const focusTrap = (event) => {
  if (event.key === 'Tab') {
    const focusableElements = [
      firstFocusable.value,
      document.querySelector('.modal button[type="submit"]'),
      document.querySelector('.modal button[type="button"]'),
      lastFocusable.value
    ].filter(Boolean)

    const focusedIndex = focusableElements.indexOf(document.activeElement)
    
    // Handle Tab key for forward navigation
    if (!event.shiftKey) {
      if (focusedIndex === focusableElements.length - 1) {
        event.preventDefault()
        firstFocusable.value.focus() // Move focus to the first element
      }
    } else { // Handle Shift+Tab key for backward navigation
      if (focusedIndex === 0) {
        event.preventDefault()
        lastFocusable.value.focus() // Move focus to the last element
      }
    }
  }
}

// Add New Server with enhanced validation
function addServer() {
  const trimmedName = newServerName.value.trim()

  // Validation checks
  if (trimmedName === '') {
    errorMessage.value = 'Server name cannot be empty!'
    return
  }
  if (trimmedName.length < MIN_NAME_LENGTH) {
    errorMessage.value = `Server name must be at least ${MIN_NAME_LENGTH} characters long!`
    return
  }
  if (trimmedName.length > MAX_NAME_LENGTH) {
    errorMessage.value = `Server name cannot exceed ${MAX_NAME_LENGTH} characters!`
    return
  }
  if (!validNamePattern.test(trimmedName)) {
    errorMessage.value = 'Server name can only contain letters, numbers, and spaces!'
    return
  }
  if (servers.value.some(server => server.text.toLowerCase() === trimmedName.toLowerCase())) {
    errorMessage.value = 'Server name already exists!'
    return
  }

// Add new server after default servers
const defaultServersCount = defaultServers.length
  servers.value.splice(defaultServersCount, 0, { id: id++, text: trimmedName })
  closeModal()
}

// Show modal and trap focus
function openModal() {
  showModal.value = true
  newServerName.value = ''
  errorMessage.value = '' // Clear error message on open
  nextTick(() => {
    if (firstFocusable.value) {
      firstFocusable.value.focus() // Focus on first input
    }
    document.addEventListener('keydown', focusTrap) // Trap focus in the modal
  })
}

// Press Alt + A to open the modal
const handleGlobalKeydown = (event) => {
  if (event.altKey && event.key.toLowerCase() === 'a') {
    event.preventDefault()
    openModal()
  }
}

document.addEventListener('keydown', handleGlobalKeydown)

// Close modal and remove focus trap
function closeModal() {
  showModal.value = false
  document.removeEventListener('keydown', focusTrap) // Remove focus trap
}

// Handle key events: Enter to add server, Escape to close modal
function handleKeyEvents(event) {
  if (event.key === 'Enter') {
    addServer()
  } else if (event.key === 'Escape') {
    closeModal()
  }
}

// Watch for the showModal state and bind/unbind event listeners
watch(showModal, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeyEvents)
  } else {
    document.removeEventListener('keydown', handleKeyEvents)
  }
})

// Cleanup event listeners when component unmounts
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyEvents)
  document.removeEventListener('keydown', focusTrap)
})

// Menu toggle state
const showMenu = ref(null)

// Close menu when clicking outside
const handleClickOutsideMenu = (event) => {
  if (showMenu.value && !event.target.closest('.menu-dropdown') && !event.target.closest('.menu-icon')) {
    showMenu.value = null
  }
}

// Close menu on `Escape` key press
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    showMenu.value = null;
    showFolderMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideMenu)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideMenu)
  document.removeEventListener('keydown', handleKeydown)
})


// Watch for clicks outside the folder menu to close it
const handleClickOutsideFolderMenu = (event) => {
  if (showFolderMenu.value && !event.target.closest('.folder-menu-dropdown') && !event.target.closest('.folder-menu-icon')) {
    showFolderMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideFolderMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideFolderMenu)
})



// Toggle the menu for a specific server
const toggleMenu = (server) => {
  if (showMenu.value === server.id) {
    showMenu.value = null // Close if clicked again
  } else {
    showMenu.value = server.id // Show menu for that server
  }
}

const handleMenuItemClick = () => {
  showMenu.value = false;
  showFolderMenu.value = false;
}

// Enable editing mode for a specific server
function enableEditing(server) {
  if (!defaultServers.some(defaultServer => defaultServer.id === server.id)) {
    server.isEditing = true
    server.previousName = server.text // Store previous name
    nextTick(() => {
      document.getElementById(`edit-${server.id}`).focus() // Focus the input field
    })
  }
}

// Save the new server name and exit editing mode with validation
function saveServerName(server) {
  const trimmedName = server.text.trim()

  // Validation checks
  if (trimmedName === '') {
    errorMessage.value = 'Server name cannot be empty!'
    server.text = server.previousName // Revert to previous name
  } else if (trimmedName.length < MIN_NAME_LENGTH) {
    errorMessage.value = `Server name must be at least ${MIN_NAME_LENGTH} characters long!`
    server.text = server.previousName // Revert to previous name
  } else if (trimmedName.length > MAX_NAME_LENGTH) {
    errorMessage.value = `Server name cannot exceed ${MAX_NAME_LENGTH} characters!`
    server.text = server.previousName // Revert to previous name
  } else if (!validNamePattern.test(trimmedName)) {
    errorMessage.value = 'Server name can only contain letters, numbers, and spaces!'
    server.text = server.previousName // Revert to previous name
  } else if (servers.value.some(s => s.id !== server.id && s.text.toLowerCase() === trimmedName.toLowerCase())) {
    errorMessage.value = 'Server name already exists!'
    server.text = server.previousName // Revert to previous name
  } else {
    errorMessage.value = ''
    server.isEditing = false
  }
}

// Confirmation modal controls  
const showDeleteConfirmation = ref(false)
const serverToDelete = ref(null)

// Open confirmation modal for deletion
function confirmDelete(server) {
  serverToDelete.value = server
  showDeleteConfirmation.value = true
}

// Delete server after confirmation
function deleteServer() {
  if (serverToDelete.value && !defaultServers.some(defaultServer => defaultServer.id === serverToDelete.value.id)) {
    servers.value = servers.value.filter(s => s.id !== serverToDelete.value.id)
  }
  closeDeleteModal()
}

// Close confirmation modal
function closeDeleteModal() {
  serverToDelete.value = null
  showDeleteConfirmation.value = false
}

// Utility function to format bytes to KB, MB, GB
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Calculate total size of a folder by summing up its file sizes
function calculateFolderSize(folder) {
  return folder.files.reduce((totalSize, file) => totalSize + file.size, 0);
}

// Calculate total size of all folders in a server
function calculateServerSize(server) {
  if (!server.folders || server.folders.length === 0) return 0;
  return server.folders.reduce((totalSize, folder) => totalSize + calculateFolderSize(folder), 0);
}

// Calculate the total size of all servers
function calculateTotalServersSize(servers) {
  return servers.reduce((totalSize, server) => totalSize + calculateServerSize(server), 0);
}

function downloadFolder(folder) {
  console.log(`Downloading folder ${folder.name}`)
}

function shareFolder(folder) {
  console.log(`Sharing folder ${folder.name}`)
}

function viewFolderDetails(folder) {
  console.log(`Viewing details for folder ${folder.name}`)
}

// Function to delete a folder from the selected server
function deleteFolder(folder, server) {
  // Find the server
  const serverIndex = servers.value.findIndex(s => s.id === server.id)
  if (serverIndex !== -1) {
    // Filter out the folder to be deleted
    const updatedFolders = servers.value[serverIndex].folders.filter(f => f.name !== folder.name)
    servers.value[serverIndex].folders = updatedFolders

    // Update the folder count
    servers.value[serverIndex].folderCount = updatedFolders.length
    notification.value = `Folder "${folder.name}" has been deleted.`
  }
}

// Function to enable folder renaming
function enableFolderRenaming(folder) {
  folder.isRenaming = true;
  folder.previousName = folder.name // Store the old name
  nextTick(() => {
    document.getElementById(`edit-folder-${folder.name}`).focus() // Focus on the input field
  })
}

function saveFolderName(folder, server) {
  const trimmedName = folder.name.trim();

  // Validation checks
  if (trimmedName === '') {
    notification.value = 'Folder name cannot be empty!';
    folder.name = folder.previousName; // Revert to the previous name
  } else if (
    server.folders.some(
      (f) => f.name.toLowerCase() === trimmedName.toLowerCase() && f !== folder
    )
  ) {
    notification.value = `A folder with the name "${trimmedName}" already exists!`;
    folder.name = folder.previousName; // Revert to the previous name
  } else {
    folder.name = trimmedName; // Set the new name
    folder.isRenaming = false; // Exit renaming mode
    notification.value = `Folder renamed to "${trimmedName}".`;
  }
}

// Track the dragged item
const draggedItem = ref(null);

// Function to make a folder draggable
const makeFolderDraggable = (folderElement) => {
  folderElement.draggable = true;

  folderElement.addEventListener('dragstart', (event) => {
    draggedItem.value = folderElement;
    setTimeout(() => {
      folderElement.style.display = 'none';
    }, 0);
  });

  folderElement.addEventListener('dragend', () => {
    setTimeout(() => {
      if (draggedItem.value) {
        draggedItem.value.style.display = 'block';
        draggedItem.value = null;
      }
    }, 0);
  });

  folderElement.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  folderElement.addEventListener('drop', (event) => {
    event.preventDefault();
    const folderList = folderElement.parentNode;
    if (draggedItem.value !== folderElement) {
      folderList.insertBefore(draggedItem.value, folderElement);
    }
  });
};

// Setup drag-and-drop functionality after the DOM is updated
const setupDragAndDrop = () => {
  nextTick(() => {
    const folderElements = document.querySelectorAll('.folder-item');
    folderElements.forEach(el => makeFolderDraggable(el));
  });
};

// Call setupDragAndDrop on mount
onMounted(() => {
  setupDragAndDrop();
});

// State to control visibility of the button
const isScrolling = ref(false);
let timeoutId = null;

const handleScroll = () => {
  isScrolling.value = true;

  // Clear the previous timeout and start a new one
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    isScrolling.value = false;
  }, 500); // Delay before button reappears
};

// Add event listener for scrolling
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// Remove event listener when component is destroyed
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});



</script>
<style>

.fixed {
  position: fixed;
  z-index: 1000;
}

/* Slide-up/slide-down transition */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to, .slide-up-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

body, html {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-family: 'UniSansBook';
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}



.server-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
 
 
}

.server-item {
  background-color: var(--button-bg);
  color: var(--text-color);
  padding: 5px 10px;
  border-radius: 20px;
 
  
}

.server-item button {
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
 }


.folder-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.folder-item {
 
  border: 1px solid var(--border-color);
  border-radius: 15px;
  background-color: var(--button-bg);
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.folder-item button {
  color: #fff;
   border: none;
   cursor: pointer;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-color);
  border: 2px solid var(--border-color);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.modal button {
  background-color: var(--secondary-color);
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.modal button:hover {
  background-color: var(--accent-color);
}

.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-color);
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .server-item, .folder-item {
    padding: 10px;
  }

  .server-list {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}

</style>

