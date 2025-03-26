// IndexedDB utility functions for storing and retrieving itineraries

// Define the database name and version
const DB_NAME = "northBengalTravelDB";
const DB_VERSION = 1;
const ITINERARY_STORE = "itineraries";

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event);
      reject("Error opening IndexedDB");
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store for itineraries if it doesn't exist
      if (!db.objectStoreNames.contains(ITINERARY_STORE)) {
        const store = db.createObjectStore(ITINERARY_STORE, { keyPath: "id" });

        // Create indexes for searching
        store.createIndex("title", "title", { unique: false });
        store.createIndex("destination", "destination", { unique: false });
        store.createIndex("startDate", "startDate", { unique: false });
        store.createIndex("tags", "tags", { unique: false, multiEntry: true });
      }
    };
  });
};

// Save an itinerary to IndexedDB
export const saveItinerary = async (itinerary: any): Promise<string> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ITINERARY_STORE], "readwrite");
      const store = transaction.objectStore(ITINERARY_STORE);

      // Ensure the itinerary has an ID
      if (!itinerary.id) {
        itinerary.id = `itinerary-${Date.now()}`;
      }

      const request = store.put(itinerary);

      request.onsuccess = () => {
        resolve(itinerary.id);
      };

      request.onerror = (event) => {
        console.error("Error saving itinerary:", event);
        reject("Error saving itinerary");
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
    throw error;
  }
};

// Get all itineraries from backend API with fallback to IndexedDB
export const getAllItineraries = async (): Promise<any[]> => {
  try {
    // First try to get from API
    const response = await fetch(
      "https://api.northbengaltravel.com/api/itineraries",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched itineraries from API:", data);

      // Update local storage with the latest data
      try {
        const db = await initDB();
        const transaction = db.transaction([ITINERARY_STORE], "readwrite");
        const store = transaction.objectStore(ITINERARY_STORE);

        // Clear existing data
        store.clear();

        // Add new data
        for (const itinerary of data) {
          store.put(itinerary);
        }

        transaction.oncomplete = () => {
          db.close();
          console.log("Updated IndexedDB with API data");
        };
      } catch (syncError) {
        console.warn("Failed to sync API data with IndexedDB:", syncError);
      }

      return data;
    } else {
      console.warn("API request failed, falling back to IndexedDB");
      throw new Error("API request failed");
    }
  } catch (error) {
    console.error("API error, using IndexedDB fallback:", error);
    // Fallback to IndexedDB if API fails
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([ITINERARY_STORE], "readonly");
        const store = transaction.objectStore(ITINERARY_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Error getting itineraries from IndexedDB:", event);
          reject("Error getting itineraries");
        };

        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (dbError) {
      console.error("IndexedDB error, using localStorage fallback:", dbError);
      // Fallback to localStorage if IndexedDB fails
      try {
        const storedItineraries = localStorage.getItem("savedItineraries");
        return storedItineraries ? JSON.parse(storedItineraries) : [];
      } catch (e) {
        console.error("All fallbacks failed:", e);
        return [];
      }
    }
  }
};

// Get a specific itinerary by ID
export const getItineraryById = async (id: string): Promise<any> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ITINERARY_STORE], "readonly");
      const store = transaction.objectStore(ITINERARY_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error("Error getting itinerary:", event);
        reject("Error getting itinerary");
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
    throw error;
  }
};

// Delete an itinerary by ID from backend API and local storage
export const deleteItinerary = async (id: string): Promise<void> => {
  try {
    // First try to delete from API
    const response = await fetch(
      `https://api.northbengaltravel.com/api/itineraries/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      console.warn(
        `API delete failed: ${response.statusText}, proceeding with local delete`,
      );
    } else {
      console.log("Successfully deleted itinerary from API");
    }

    // Always delete from IndexedDB regardless of API success
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ITINERARY_STORE], "readwrite");
      const store = transaction.objectStore(ITINERARY_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        // Also remove from localStorage if present
        try {
          const storedItineraries = localStorage.getItem("savedItineraries");
          if (storedItineraries) {
            const parsed = JSON.parse(storedItineraries);
            const filtered = parsed.filter((item: any) => item.id !== id);
            localStorage.setItem("savedItineraries", JSON.stringify(filtered));
          }
        } catch (localStorageError) {
          console.warn(
            "Error updating localStorage after delete:",
            localStorageError,
          );
        }

        resolve();
      };

      request.onerror = (event) => {
        console.error("Error deleting itinerary from IndexedDB:", event);
        reject("Error deleting itinerary");
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("Delete operation error:", error);

    // If all else fails, try to at least update localStorage
    try {
      const storedItineraries = localStorage.getItem("savedItineraries");
      if (storedItineraries) {
        const parsed = JSON.parse(storedItineraries);
        const filtered = parsed.filter((item: any) => item.id !== id);
        localStorage.setItem("savedItineraries", JSON.stringify(filtered));
      }
    } catch (fallbackError) {
      console.error("All delete fallbacks failed:", fallbackError);
    }

    throw error;
  }
};

// Search itineraries by criteria
export const searchItineraries = async (criteria: {
  destination?: string;
  tags?: string[];
  startDateFrom?: Date;
  startDateTo?: Date;
}): Promise<any[]> => {
  try {
    // Get all itineraries and filter in memory
    // This is simpler than using complex IndexedDB queries
    const allItineraries = await getAllItineraries();

    return allItineraries.filter((itinerary) => {
      let matches = true;

      if (criteria.destination && itinerary.destination) {
        matches =
          matches &&
          itinerary.destination
            .toLowerCase()
            .includes(criteria.destination.toLowerCase());
      }

      if (criteria.tags && criteria.tags.length > 0 && itinerary.tags) {
        const itineraryTags = Array.isArray(itinerary.tags)
          ? itinerary.tags
          : [];
        matches =
          matches &&
          criteria.tags.some((tag) =>
            itineraryTags.some((iTag) =>
              iTag.toLowerCase().includes(tag.toLowerCase()),
            ),
          );
      }

      if (criteria.startDateFrom && itinerary.startDate) {
        const itineraryDate = new Date(itinerary.startDate);
        matches = matches && itineraryDate >= criteria.startDateFrom;
      }

      if (criteria.startDateTo && itinerary.startDate) {
        const itineraryDate = new Date(itinerary.startDate);
        matches = matches && itineraryDate <= criteria.startDateTo;
      }

      return matches;
    });
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

// Update an existing itinerary
export const updateItinerary = async (itinerary: any): Promise<void> => {
  try {
    // This uses the same function as saveItinerary since put() will update if the ID exists
    await saveItinerary(itinerary);
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

// Migrate data from localStorage to IndexedDB
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const storedItineraries = localStorage.getItem("savedItineraries");
    if (storedItineraries) {
      const itineraries = JSON.parse(storedItineraries);
      for (const itinerary of itineraries) {
        await saveItinerary(itinerary);
      }
      console.log(
        "Successfully migrated itineraries from localStorage to IndexedDB",
      );
    }
  } catch (error) {
    console.error("Migration error:", error);
  }
};
