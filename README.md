# Claude Haiku Screenshot Chrome Extension

The Claude Haiku Chrome Extension is a powerful tool that allows users to capture screenshots from any tab and send them to the Claude Haiku API for analysis. With this extension, users can quickly get insights and answers to questions based on the content of the captured screenshots.

** This requires you to input your own Claude API Key. **

## Features

- Capture screenshots from any tab with a single click
- Send screenshots to the Claude Haiku API for analysis
- Display the API response in a clean and readable format
- Customize and manage prompts for screenshot analysis
- Support for multiple languages (English and Spanish)
- Easy-to-use options page for configuring API key and managing prompts

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the directory where you cloned/downloaded the repository.
5. The Claude Haiku Chrome Extension should now be installed and visible in your extensions list.

## Usage

1. Click on the Claude Haiku extension icon in the Chrome toolbar to open the extension popup. (You may need to pin it to your toolbar to see it)
2. The popup will display a list of your currently open tabs. Click on a tab to capture a screenshot.
3. Once the screenshot is captured, it will be displayed in the extension popup.
4. Select a prompt from the predefined prompt buttons or enter a custom prompt.
5. Click on the selected prompt button to send the screenshot and prompt to the Claude Haiku API for analysis.
6. The API response will be displayed in the extension popup.

## Options

The extension comes with an options page where you can configure your API key and manage prompts.

1. Right-click on the Claude Haiku extension icon and select "Options" from the context menu.
2. Enter your Claude Haiku API key in the provided input field and click "Save API Key".
3. To manage prompts, use the "Prompt Manager" section:
   - Add new prompts by clicking the "Add Prompt" button.
   - Edit existing prompts by modifying the prompt text in the input fields.
   - Delete prompts by clicking the "Delete" button next to the prompt you want to remove.
   - Click "Save Prompts" to save your changes.

## Permissions

The Claude Haiku Chrome Extension requires the following permissions to function properly:

### `"activeTab"`

The `"activeTab"` permission allows the extension to access information about the currently active tab in the browser. This permission is needed to capture screenshots of the active tab when the user clicks on a tab in the extension popup.

### `"tabs"`

The `"tabs"` permission allows the extension to interact with and manipulate browser tabs. It is used to query the list of open tabs, capture screenshots of specific tabs, and update the extension popup with the captured screenshot.

### `"storage"`

The `"storage"` permission allows the extension to store and retrieve data using the Chrome storage API. It is used to store and manage user preferences, such as the API key and custom prompts, and to persist data across browser sessions.

### `"contextMenus"`

The `"contextMenus"` permission enables the extension to create and manage context menu items. This permission is used to provide users with convenient access to extension functionality through the right-click context menu.

### `"clipboardWrite"`

The `"clipboardWrite"` permission allows the extension to write data to the system clipboard. This permission is necessary to enable users to copy the API response to the clipboard for easy sharing or further analysis.

## Host Permissions

The Claude Haiku Chrome Extension requires the following host permissions:

### `"<all_urls>"`

The `"<all_urls>"` permission grants the extension access to all URLs. This broad permission is required to capture screenshots from any web page the user visits. It allows the extension to interact with and capture content from any tab, regardless of the website or domain.

### `"https://api.anthropic.com/*"`

The `"https://api.anthropic.com/*"` permission allows the extension to make requests to the specified URL pattern. This permission is necessary to communicate with the Claude Haiku API endpoint and send screenshots for analysis. It ensures that the extension can only make requests to the intended API server and prevents unauthorized access to other domains.

Please note that while these permissions are necessary for the extension to function as intended, it's important to use them responsibly and ensure that user privacy and security are respected. The extension should only access and use the permissions for the specified purposes and should not abuse or misuse them.

## License

This project is licensed under the [GNU v3 License](LICENSE).