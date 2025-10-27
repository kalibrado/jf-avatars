import { loadLanguage, waitForElement, log } from "./functions.js";
import { injectStyles } from "./style.js";
import { props } from "./props.js";
import { createButton, createModal } from "./ui-elements.js";

/**
 * Observes DOM changes and injects UI components dynamically when necessary.
 * Specifically targets the "userprofile" page for integrating the avatar suggestion feature in Jellyfin.
 *
 * @module index
 */

const addProfileButton = () => {
  log("Attempting to add button");
  // Reinject the button if it's missing from the DOM
  if (!document.getElementById(`${props.prefix}-btn-show-modal`)) {
    waitForElement(props.injectBtnModal(), () => {
      injectStyles();
      document.querySelector(props.injectBtnModal()).before(
        createButton({
          id: "show-modal",
          textContent: props.getBtnShowAvatarsLabel(),
          onClick: () => createModal(),
        })
      );

      // Disconnect the observer once the button is injected
      log("Button injected");
    });
  } else {
    // The button already exists, no need to continue observation
    log("Button already exists");
  }
};

/**
 * Observes DOM changes (useful for Single Page Applications - SPA).
 * When an element is added or recreated, this function dynamically reinjects the "show-modal" button.
 *
 * @function observeDOMChanges
 * @returns {void}
 */
const observeDOMChanges = () => {
  log("Attempting to observe dom changes");
  const targetNode = document.body; // Observe the entire body to capture relevant changes.
  const config = { childList: true, subtree: true }; // Observe added/removed elements.

  /**
   * Callback function for handling DOM mutations.
   *
   * @callback MutationCallback
   * @param {MutationRecord[]} mutationsList - List of observed mutations.
   * @returns {void}
   */
  const callback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (window.location.hash.includes("#/userprofile")) {
          addProfileButton()
          observer.disconnect();
        }
      }
    }
  };

  log("Navigation to userprofile detected.");
  loadLanguage().then(() => {
    if (window.location.hash.includes("#/userprofile")) { // If we loaded directly into the profile page we may execute after all DOM mutations
      addProfileButton();
      return;
    }

    // Create a MutationObserver instance
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config); // Start observing
  });
};

/**
 * MutationObserver to monitor DOM changes for page-specific elements.
 * Specifically checks for the addition of the branding CSS to initialize avatar modal functionality.
 *
 * @constant observer
 * @type {MutationObserver}
 */
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.id === "cssBranding" || node.textContent === "Profile") {
        observeDOMChanges();
        observer.disconnect(); // Stop observing once the tag is found
      }
    });
  });
});

observeDOMChanges(); // If we loaded directly into the profile page we may execute after all DOM mutations
observer.observe(document.body, { childList: true, subtree: true });
