import { eventListener } from "./events.js";
import {
  getImageSaved,
  loadLanguage,
  waitForElement,
  log,
} from "./functions.js";
import { props } from "./props.js";
import { adjustResponsive, injectStyles } from "./style.js";
import { createButton, createModal } from "./ui-elements.js";

/**
 * Observes DOM changes and injects UI components dynamically when necessary.
 * Specifically targets the "userprofile" page for integrating the avatar suggestion feature in Jellyfin.
 * @fileoverview Initializes UI components and styles for avatar selection.
 */

/**
 * Observes DOM changes (useful for Single Page Applications - SPA).
 * When an element is added or recreated, this function dynamically reinjects the "show-modal" button.
 * @function observeDOMChanges
 * @returns {void}
 */
const observeDOMChanges = () => {
  const targetNode = document.body; // Observe the entire body to capture relevant changes.
  const config = { childList: true, subtree: true }; // Observe added/removed elements.

  /**
   * Callback function for handling DOM mutations.
   * @param {MutationRecord[]} mutationsList - List of observed mutations.
   * @returns {void}
   */
  const callback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Reinject the button if it's missing from the DOM
        if (!document.getElementById(`${props.prefix}-btn-show-modal`)) {
          waitForElement(props.jfElementInjectBtnOpenModal, () => {
            injectStyles(); // Inject necessary styles.
            // Create a button to show the modal before the specified element.
            document.querySelector(props.jfElementInjectBtnOpenModal).before(
              createButton({
                id: "show-modal",
                textContent: props.getBtnShowAvatarsLabel(),
                /**
                 * Function executed when the button is clicked.
                 * @param {MouseEvent} event - The button click event.
                 * @returns {void}
                 */
                onClick: () => {
                  /** @type {?string} */
                  let imageSaved = getImageSaved();
                  props.imageName = imageSaved
                    ? imageSaved.substring(imageSaved.lastIndexOf("/") + 1)
                    : null;
                  props.imageSaved = imageSaved;
                  createModal();
                  adjustResponsive();
                  eventListener();
                },
              })
            );
          });
        }
      }
    }
  };

  if (window.location.hash.includes("#/userprofile")) {
    log("Navigation to userprofile detected.");
    loadLanguage().then(() => {
      // Create a MutationObserver instance
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config); // Start observing
    });
  }
};

// MutationObserver to monitor DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.id === "cssBranding") {
        observeDOMChanges();
        observer.disconnect(); // Stop observing once the tag is found
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });