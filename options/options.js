document.addEventListener("DOMContentLoaded", function() {
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("saveButton");
  const deleteButton = document.getElementById("deleteButton");
  const eyeIcon = document.getElementById("eyeIcon");

  // Set translated messages
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function(element) {
    const messageKey = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(messageKey);
  });


  chrome.storage.sync.get("apiKey", function(data) {
    if (data.apiKey) {
      apiKeyInput.value = "*********";
      apiKeyInput.dataset.apiKey = data.apiKey;
      deleteButton.style.display = "inline";
    }
  });

  saveButton.addEventListener("click", function() {
    const apiKey = apiKeyInput.value;
    saveApiKey(apiKey);
  });

  deleteButton.addEventListener("click", function() {
    deleteApiKey();
  });

  eyeIcon.addEventListener("click", function() {
    toggleApiKeyVisibility();
  });
});

function saveApiKey(apiKey) {
  if (!isValidApiKey(apiKey)) {
    alert('Invalid API key. Please enter a valid API key.');
    return;
  }
  
  chrome.storage.sync.set({ apiKey: apiKey }, () => {
    alert('API key saved successfully!');
    location.reload();
  });
}

function deleteApiKey() {
  chrome.storage.sync.remove("apiKey", () => {
    alert('API key deleted successfully!');
    location.reload();
  });
}

function isValidApiKey(apiKey) {
  // Remove all spaces from the apiKey
  const trimmedApiKey = apiKey.replace(/\s+/g, '');

  // Check if apiKey starts with "sk-"
  return trimmedApiKey.startsWith('sk-');
}

function toggleApiKeyVisibility() {
  const apiKeyInput = document.getElementById("apiKey");
  const apiKey = apiKeyInput.dataset.apiKey;

  if (apiKeyInput.type === "password") {
    apiKeyInput.type = "text";
    apiKeyInput.value = apiKey;
  } else {
    apiKeyInput.type = "password";
    apiKeyInput.value = "*********";
  }
}

// PROMPT SECTION //

const promptList = document.getElementById("promptList");
const addPromptButton = document.getElementById("addPromptButton");
const savePromptsButton = document.getElementById('savePromptsButton');
savePromptsButton.addEventListener('click', savePrompts);

const MAX_PROMPT_LENGTH = 50;
const MAX_PROMPTS = 6;

// Load prompts from storage
chrome.storage.sync.get("prompts", function(data) {
  if (data.prompts) {
    renderPrompts(data.prompts);
  } else {
    // Render an empty list of prompts
    renderPrompts([]);
  }
});

addPromptButton.addEventListener("click", function() {
  addPrompt();
});

function renderPrompts(prompts) {
  promptList.innerHTML = "";

  prompts.forEach(function(prompt, index) {
    const li = document.createElement("li");
    li.classList.add("prompt-item");

    const input = document.createElement("input");
    input.type = "text";
    input.value = prompt;
    input.classList.add("prompt-input");
    input.addEventListener("change", function() {
      updatePrompt(index, this.value);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      deletePrompt(index);
    });

    li.appendChild(input);
    li.appendChild(deleteButton);
    promptList.appendChild(li);
  });
}

function addPrompt() {
  chrome.storage.sync.get("prompts", function(data) {
    const prompts = data.prompts || [];

    if (prompts.length < MAX_PROMPTS) {
      const newPrompt = prompt("Enter a new prompt:");
      if (newPrompt && isValidPrompt(newPrompt)) {
        prompts.push(newPrompt);
        chrome.storage.sync.set({ prompts: prompts }, function() {
          renderPrompts(prompts);
        });
      }
    } else {
      alert(`Maximum limit of ${MAX_PROMPTS} prompts reached.`);
    }
  });
}

function isValidPrompt(prompt) {
  // Check if the prompt is a string
  if (typeof prompt !== 'string') {
    return false;
  }

  // Trim the prompt to remove leading and trailing whitespace
  prompt = prompt.trim();

  // Check if the prompt is empty
  if (prompt === '') {
    return false;
  }

  // Check if the prompt exceeds the maximum allowed length
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return false;
  }

  // Check if the prompt contains any invalid characters
  const invalidCharacters = /[<>]/;
  if (invalidCharacters.test(prompt)) {
    return false;
  }

  // If all checks pass, the prompt is considered valid
  return true;
}

function updatePrompt(index, value) {
  chrome.storage.sync.get("prompts", function(data) {
    const prompts = data.prompts || [];

    if (index >= 0 && index < prompts.length) {
      prompts[index] = value;
      //chrome.storage.sync.set({ prompts: prompts }); // This automatically saves the prompts...we use a button instead
    }
  });
}

function deletePrompt(index) {
  chrome.storage.sync.get("prompts", function(data) {
    const prompts = data.prompts || [];

    if (index >= 0 && index < prompts.length) {
      prompts.splice(index, 1);
      chrome.storage.sync.set({ prompts: prompts }, function() {
        renderPrompts(prompts);
      });
    }
  });
}

function savePrompts() {
  const promptInputs = document.querySelectorAll('.prompt-input');
  const prompts = Array.from(promptInputs)
    .map(input => input.value.trim().slice(0, MAX_PROMPT_LENGTH))
    .filter(prompt => prompt !== '');

  chrome.storage.sync.set({ prompts: prompts }, function() {
    console.log('Prompts saved');
    alert('Prompts saved successfully!');

    chrome.tabs.query({ url: chrome.runtime.getURL('newtab/newtab.html') }, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshPromptButtons' });
      }
    });
  });
}