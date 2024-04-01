const tabListElement = document.getElementById("tabList");

export function renderTabList(tabList) {
    tabListElement.innerHTML = "";
  
    if (Array.isArray(tabList) && tabList.length > 0) {
      const fragment = document.createDocumentFragment();
  
      tabList.forEach(function(tab) {
        const existingTabElement = tabListElement.querySelector(`[data-tab-id="${tab.tabId}"]`);
  
        if (existingTabElement) {
          // Update the existing tab element
          existingTabElement.textContent = tab.title;
          const favIconElement = existingTabElement.querySelector('.favicon');
          if (favIconElement) {
            favIconElement.src = tab.favIconUrl;
          }
        } else {
          // Create a new tab element
          const tabElement = document.createElement("a");
          tabElement.classList.add("tab");
          tabElement.textContent = tab.title;
          tabElement.href = "#";
          tabElement.dataset.windowId = tab.windowId;
          tabElement.dataset.tabId = tab.tabId;
  
          tabElement.addEventListener("click", function(event) {
            event.preventDefault();
            const windowId = parseInt(this.dataset.windowId);
            const tabId = parseInt(this.dataset.tabId);
            chrome.runtime.sendMessage({ action: "captureTab", windowId: windowId, tabId: tabId }, function(response) {
              if (chrome.runtime.lastError) {
                console.error("Error capturing tab:", chrome.runtime.lastError.message);
              }
            });
          });
  
          if (tab.favIconUrl) {
            const favIconElement = document.createElement("img");
            favIconElement.src = tab.favIconUrl;
            favIconElement.alt = "Favicon";
            favIconElement.classList.add("favicon");
            favIconElement.style.width = "16px";
            favIconElement.style.height = "16px";
            tabElement.prepend(favIconElement);
          }
  
          fragment.appendChild(tabElement);
        }
      });
  
      // Remove deleted tabs
      const existingTabElements = tabListElement.querySelectorAll('.tab');
      existingTabElements.forEach(function(tabElement) {
        const tabId = parseInt(tabElement.dataset.tabId);
        if (!tabList.some(tab => tab.tabId === tabId)) {
          tabElement.remove();
        }
      });
  
      tabListElement.appendChild(fragment);
    } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No tabs found.";
        tabListElement.appendChild(emptyMessage);
      }
    }
  

  export function refreshTabList() {
    chrome.runtime.sendMessage({ action: "getTabList" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving tab list:", chrome.runtime.lastError.message);
        displayResponse("Failed to retrieve tab list. Please try again.");
      } else if (Array.isArray(response.tabList)) {
        renderTabList(response.tabList);
      } else {
        console.error("Invalid tabList format. Expected an array.");
        displayResponse("Invalid tab list data. Please try again.");
      }
    });
  }