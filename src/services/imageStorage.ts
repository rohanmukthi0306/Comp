/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = 'CampusHub_FindIt_DB';
const DB_VERSION = 1;
const STORE_NAME = 'item_photographs';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });

  return dbPromise;
}

/**
 * Saves an image to IndexedDB.
 * Accepts either a File/Blob or a base64 Data URL and stores it as a Blob or string record.
 * Returns the generated image ID.
 */
export async function saveImageToStorage(fileOrDataUrl: File | Blob | string, customId?: string): Promise<string> {
  const imageId = customId || `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  try {
    const db = await getDB();
    let dataToStore: Blob | string = fileOrDataUrl;

    // If it's a data URL, convert to Blob for efficient storage
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      try {
        const res = await fetch(fileOrDataUrl);
        dataToStore = await res.blob();
      } catch {
        dataToStore = fileOrDataUrl;
      }
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const record = {
        id: imageId,
        data: dataToStore,
        createdAt: new Date().toISOString(),
      };

      const putRequest = store.put(record);

      putRequest.onsuccess = () => {
        resolve(imageId);
      };

      putRequest.onerror = () => {
        reject(putRequest.error || new Error('Failed to store image record in IndexedDB'));
      };
    });
  } catch (err) {
    console.warn('IndexedDB write failed, falling back to memory/session storage:', err);
    // Safe memory fallback if indexedDB is restricted
    try {
      if (typeof window !== 'undefined' && typeof fileOrDataUrl === 'string' && fileOrDataUrl.length < 500000) {
        sessionStorage.setItem(`findit_img_${imageId}`, fileOrDataUrl);
      }
    } catch {
      // Ignore quota error in fallback
    }
    return imageId;
  }
}

/**
 * Retrieves an image Data URL from IndexedDB by imageId.
 */
export async function getImageFromStorage(imageId: string): Promise<string | null> {
  if (!imageId) return null;

  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(imageId);

      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (!result || !result.data) {
          // Check session fallback
          const sessionVal = typeof window !== 'undefined' ? sessionStorage.getItem(`findit_img_${imageId}`) : null;
          resolve(sessionVal);
          return;
        }

        if (typeof result.data === 'string') {
          resolve(result.data);
        } else if (result.data instanceof Blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            resolve(null);
          };
          reader.readAsDataURL(result.data);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => {
        const sessionVal = typeof window !== 'undefined' ? sessionStorage.getItem(`findit_img_${imageId}`) : null;
        resolve(sessionVal);
      };
    });
  } catch (err) {
    console.warn('Error reading from IndexedDB:', err);
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(`findit_img_${imageId}`);
    }
    return null;
  }
}

/**
 * Deletes an image from IndexedDB.
 */
export async function deleteImageFromStorage(imageId: string): Promise<void> {
  if (!imageId) return;
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(imageId);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`findit_img_${imageId}`);
    }
  } catch {
    // Ignore error
  }
}
