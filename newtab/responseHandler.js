const responseElement = document.getElementById("responseContent");
const screenshotPreviewElement = document.getElementById("screenshotPreview");

export function toggleLoading(show) {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (show) {
      loadingOverlay.style.display = "flex";
    } else {
      loadingOverlay.style.display = "none";
    }
  }

export function sendScreenshotToBackground(screenshotUrl, prompt) {
    if (screenshotUrl) {
        toggleLoading(true);
        chrome.runtime.sendMessage({ action: "sendScreenshotToAPI", screenshotUrl: screenshotUrl, prompt: prompt }, function(response) {
            hideLoading();
            if (chrome.runtime.lastError) {
                console.error("Error sending screenshot to background:", chrome.runtime.lastError.message);
            }
        });
    } else {
        displayResponse("No screenshot detected. Please select a tab to capture a screenshot.");
    }
}

export function displayResponse(response) {
    responseElement.textContent = response;
}

export function updateScreenshotPreview(screenshotUrl) {
    screenshotPreviewElement.innerHTML = `
        <div class="screenshot-loading">Loading screenshot...</div>
        <img src="${screenshotUrl}" alt="Screenshot Preview" style="width: 100%; height: 100%; object-fit: cover;">
    `;
    screenshotPreviewElement.querySelector("img").addEventListener("load", function() {
        screenshotPreviewElement.querySelector(".screenshot-loading").remove();
    });
}