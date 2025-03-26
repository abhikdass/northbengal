// Utility for syncing offline data with the backend when connection is restored

import { itineraryApi, userApi } from "./api";

// Queue for storing operations that need to be synced
interface SyncOperation {
  type: "create" | "update" | "delete";
  resource: "itinerary" | "profile" | "settings";
  id?: string;
  data?: any;
}

// Get sync queue from localStorage
const getSyncQueue = (): SyncOperation[] => {
  try {
    const queue = localStorage.getItem("syncQueue");
    return queue ? JSON.parse(queue) : [];
  } catch (e) {
    console.error("Error parsing sync queue:", e);
    return [];
  }
};

// Save sync queue to localStorage
const saveSyncQueue = (queue: SyncOperation[]): void => {
  localStorage.setItem("syncQueue", JSON.stringify(queue));
};

// Add operation to sync queue
export const addToSyncQueue = (operation: SyncOperation): void => {
  const queue = getSyncQueue();
  queue.push(operation);
  saveSyncQueue(queue);
};

// Process sync queue
export const processSyncQueue = async (): Promise<void> => {
  const queue = getSyncQueue();
  if (queue.length === 0) return;

  const newQueue: SyncOperation[] = [];

  for (const operation of queue) {
    try {
      switch (operation.resource) {
        case "itinerary":
          await syncItineraryOperation(operation);
          break;
        case "profile":
          await userApi.updateProfile(operation.data);
          break;
        case "settings":
          await userApi.updateSettings(operation.data);
          break;
      }
    } catch (error) {
      console.error(`Failed to sync operation:`, operation, error);
      // Keep failed operations in the queue
      newQueue.push(operation);
    }
  }

  // Update queue with only failed operations
  saveSyncQueue(newQueue);
};

// Sync itinerary operations
const syncItineraryOperation = async (
  operation: SyncOperation,
): Promise<void> => {
  switch (operation.type) {
    case "create":
      await itineraryApi.create(operation.data);
      break;
    case "update":
      if (operation.id) {
        await itineraryApi.update(operation.id, operation.data);
      }
      break;
    case "delete":
      if (operation.id) {
        await itineraryApi.delete(operation.id);
      }
      break;
  }
};

// Setup online/offline detection and sync
export const setupOfflineSync = (): void => {
  // Process queue when coming online
  window.addEventListener("online", async () => {
    console.log("Back online, syncing data...");
    await processSyncQueue();
  });

  // Check if we're online now and process queue
  if (navigator.onLine) {
    processSyncQueue();
  }
};

export default {
  addToSyncQueue,
  processSyncQueue,
  setupOfflineSync,
};
