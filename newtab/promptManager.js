import { sendScreenshotToBackground } from './responseHandler.js';

export function renderPromptButtons(prompts) {
    const promptButtonsContainer = document.getElementById("promptButtons");
    promptButtonsContainer.innerHTML = "";
  
    prompts.forEach(function(prompt) {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-primary", "promptButton");
      button.textContent = prompt;
      button.addEventListener("click", function() {
        const screenshotPreviewElement = document.getElementById("screenshotPreview");
        const screenshotUrl = screenshotPreviewElement.querySelector("img")?.src;
        sendScreenshotToBackground(screenshotUrl, prompt);
      });
  
      promptButtonsContainer.appendChild(button);
    });
  }