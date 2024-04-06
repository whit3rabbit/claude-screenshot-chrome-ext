const responseElement = document.getElementById("responseContent");
const screenshotPreviewElement = document.getElementById("screenshotPreview");

export function toggleLoading(show) {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) { // Check if the element exists
        if (show) {
            loadingOverlay.style.display = "flex";
        } else {
            loadingOverlay.style.display = "none";
        }
    } else {
        console.error("Error: .loading-overlay element not found.");
    }
}

export function sendScreenshotToBackground(screenshotUrl, prompt) {
    if (screenshotUrl) {
        toggleLoading(true);
        chrome.runtime.sendMessage({ action: "sendScreenshotToAPI", screenshotUrl: screenshotUrl, prompt: prompt }, function(response) {
            toggleLoading(false); // This replaces hideLoading();
            if (chrome.runtime.lastError) {
                console.error("Error sending screenshot to background:", chrome.runtime.lastError.message);
            }
        });
    } else {
        displayResponse("No screenshot detected. Please select a tab to capture a screenshot.");
    }
}

export function displayResponse(response) {
    // Assuming this element is correctly assigned in the full context of your code
    responseElement.textContent = response;
}

export function updateScreenshotPreview(screenshotUrl) {
    // Assuming this element is correctly assigned in the full context of your code
    screenshotPreviewElement.innerHTML = `
        <div class="screenshot-loading">Loading screenshot...</div>
        <img src="${screenshotUrl}" alt="Screenshot Preview" style="width: 100%; height: 100%; object-fit: cover;">
    `;
    screenshotPreviewElement.querySelector("img").addEventListener("load", function() {
        screenshotPreviewElement.querySelector(".screenshot-loading").remove();
    });
}