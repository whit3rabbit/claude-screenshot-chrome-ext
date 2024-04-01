import { renderTabList, refreshTabList } from './tabList.js';
import { renderPromptButtons } from './promptManager.js';
import {
  displayResponse,
  updateScreenshotPreview,
  sendScreenshotToBackground,
} from './responseHandler.js';

const promptButtons = document.querySelectorAll(".promptButton");

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "updateResponse") {
    displayResponse(message.response);
    sendResponse({ success: true });
  } else if (message.action === "updateTabList") {
    renderTabList(message.tabList);
    sendResponse({ success: true });
  } else if (message.action === "updateScreenshotPreview") {
    updateScreenshotPreview(message.screenshotUrl);
    sendResponse({ success: true });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("refreshButton").addEventListener("click", refreshTabList);

  // Set translated messages
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function(element) {
    const messageKey = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(messageKey);
  });


  promptButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      const prompt = this.textContent;
      sendScreenshotToBackground(prompt);
    });
  });

  refreshTabList();
});

chrome.storage.sync.get("prompts", function(data) {
  const prompts = data.prompts || [];
  renderPromptButtons(prompts);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'refreshPromptButtons') {
    chrome.storage.sync.get('prompts', function(data) {
      const prompts = data.prompts || [];
      renderPromptButtons(prompts);
    });
  }
});