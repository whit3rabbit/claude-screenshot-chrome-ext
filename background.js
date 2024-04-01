import { getApiKey } from './lib/auth.js';
import { getTabList, captureTab } from './lib/utils.js';

// Open new tab on extension icon click
chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: chrome.runtime.getURL("newtab/newtab.html") }, function(tab) {
    chrome.storage.local.set({ newtabTabId: tab.id });
  });
});

// Set default prompts on extension install
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get('prompts', function(data) {
    if (!data.prompts) {
      const defaultPromptsMessage = chrome.i18n.getMessage('defaultPrompts');
      const defaultPrompts = defaultPromptsMessage.split(';');
      chrome.storage.sync.set({ prompts: defaultPrompts }, function() {
        console.log('Default prompts loaded');
      });
    }
  });
});

// Message listener
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "getTabList") {
    getTabList().then(tabList => {
      sendResponse({ tabList: tabList });
    });
    return true;
  } else if (message.action === "captureTab") {
    captureTab(message.windowId, message.tabId, sendResponse);
    return true;
  } else if (message.action === "sendScreenshotToAPI") {
    sendScreenshotToAPI(message.screenshotUrl, message.prompt, sendResponse);
    return true;
  }
});

async function handleApiResponse(response, sendResponse) {
  if (response.status === 401) {
    throw new Error("Unauthorized: Invalid API key");
  } else if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data && data.content && Array.isArray(data.content) && data.content.length > 0 && data.content[0].text) {
    const responseContent = data.content[0].text;
    sendResponseToNewtab(responseContent, sendResponse, true);
  } else {
    throw new Error("Invalid API response format");
  }
}

function sendResponseToNewtab(response, sendResponse, success) {
  chrome.storage.local.get("newtabTabId", function(data) {
    const newtabTabId = data.newtabTabId;
    if (newtabTabId) {
      chrome.tabs.sendMessage(newtabTabId, { action: "updateResponse", response: response }, function(response) {
        sendResponse({ success: success });
      });
    } else {
      console.error("No newtab tab ID found.");
      sendResponse({ success: false });
    }
  });
}

function sendErrorToNewtab(errorMessage, sendResponse) {
  chrome.storage.local.get("newtabTabId", function(data) {
    const newtabTabId = data.newtabTabId;
    if (newtabTabId) {
      chrome.tabs.sendMessage(newtabTabId, { action: "updateResponse", response: errorMessage }, function(response) {
        sendResponse({ success: false });
      });
    } else {
      console.error("No newtab tab ID found.");
      sendResponse({ success: false });
    }
  });
}

// Send screenshot to API
async function sendScreenshotToAPI(screenshotUrl, prompt, sendResponse) {
  const apiKey = await getApiKey();

  if (!apiKey) {
    sendErrorToNewtab(chrome.i18n.getMessage("noApiKey"), sendResponse);
    return;
  }

  const base64Image = screenshotUrl.split(",")[1];

  const payload = {
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "base64",
              "media_type": "image/png",
              "data": base64Image
            }
          },
          {
            "type": "text",
            "text": prompt
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": `${apiKey}`,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload)
    });

    await handleApiResponse(response, sendResponse);
  } catch (error) {
    console.error("Error sending screenshot to API:", error);

    if (error.message.includes("Invalid API key")) {
      sendErrorToNewtab(chrome.i18n.getMessage("invalidApiKey"), sendResponse);
    } else {
      sendErrorToNewtab(chrome.i18n.getMessage("apiError"), sendResponse);
    }
  }
}