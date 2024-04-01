export function getTabList() {
    return new Promise((resolve) => {
      chrome.tabs.query({}, function(tabs) {
        const tabList = tabs.map(tab => ({
          windowId: tab.windowId,
          tabId: tab.id,
          title: tab.title,
          favIconUrl: tab.favIconUrl
        }));
        resolve(tabList);
      });
    });
  }
  
export function captureTab(windowId, tabId, sendResponse) {
    chrome.tabs.get(tabId, function(tab) {
      if (chrome.runtime.lastError) {
        console.error("Error getting tab:", chrome.runtime.lastError);
        sendResponse({ success: false });
        return;
      }
  
      chrome.windows.update(windowId, { focused: true }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error focusing window:", chrome.runtime.lastError);
          sendResponse({ success: false });
          return;
        }
  
        chrome.tabs.update(tabId, { active: true }, function() {
          if (chrome.runtime.lastError) {
            console.error("Error activating tab:", chrome.runtime.lastError);
            sendResponse({ success: false });
            return;
          }
  
          chrome.tabs.captureVisibleTab(windowId, { format: "png" }, function(screenshotUrl) {
            if (screenshotUrl) {
              chrome.storage.local.get("newtabTabId", function(data) {
                const newtabTabId = data.newtabTabId;
                if (newtabTabId) {
                  chrome.tabs.sendMessage(newtabTabId, { action: "updateScreenshotPreview", screenshotUrl: screenshotUrl }, function(response) {
                    sendResponse({ success: true });
                  });
                } else {
                  console.error("No newtab tab ID found.");
                  sendResponse({ success: false });
                }
              });
            } else {
              console.error("Failed to capture screenshot.");
              sendResponse({ success: false });
            }
          });
        });
      });
    });
  }