export async function getApiKey() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['apiKey'], (result) => {
        if (result.apiKey) {
          resolve(result.apiKey);
        } else {
          resolve(null);
        }
      });
    });
  }