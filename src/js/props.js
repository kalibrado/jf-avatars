/**
 * Prefix used for local storage keys and CSS properties.
 *
 * @constant {string}
 */
const prefix = "jf-avatars";

/**
 * Cleans a property by removing unnecessary quotes and spaces.
 * This function retrieves a CSS property value and trims it.
 *
 * @function
 * @param {string} property - The property to clean.
 * @param {HTMLElement} [element=document.body] - The DOM element from which to retrieve the computed style.
 * @returns {string} - The cleaned property.
 */
const getValue = (property, element = document.body) => {
  const computedStyle = window.getComputedStyle(element);
  const value = computedStyle
    .getPropertyValue(property)
    .replace(/['"]/g, "")
    .trim();
  return value.trim();
};

/**
 * Properties object used in the UI.
 * This object defines various getter functions and properties used throughout the UI, including labels, selected image, and CSS selectors.
 *
 * @constant
 * @namespace props
 *
 * @property {function(): string} getTitle - Retrieves the modal title, or the default value if not defined.
 * @property {function(): string} getFilterLabel - Retrieves the filter label, or the default value if not defined.
 * @property {function(): string} getDefaultOptionLabel - Retrieves the default option for the filter, or the default value if not defined.
 * @property {function(): string} getSearchLabel - Retrieves the search label, or the default value if not defined.
 * @property {function(): string} getBtnCancelLabel - Retrieves the cancel button label, or the default value if not defined.
 * @property {function(): string} getBtnValidateLabel - Retrieves the validate button label, or the default value if not defined.
 * @property {function(): string} getBtnShowAvatarsLabel - Retrieves the "show more avatars" button label, or the default value if not defined.
 * @property {?string} selectedImage - Currently selected image, initially null.
 * @property {string} prefix - Prefix used for storage keys and CSS properties.
 * @property {string} injectBtnModal - CSS selector for the modal open button injection element.
 * @property {boolean} debug - Debug mode
 */
export const props = {
  /**
   * Retrieves the title for the modal from the i18n object.
   *
   * @returns {string} Modal title.
   */
  getTitle: () => window.i18n["title"],

  /**
   * Retrieves the search label from the i18n object.
   *
   * @returns {string} Search label.
   */
  getSearchLabel: () => window.i18n["search-label"],

  /**
   * Retrieves the cancel button label from the i18n object.
   *
   * @returns {string} Cancel button label.
   */
  getBtnCancelLabel: () => window.i18n["btn-cancel"],

  /**
   * Retrieves the validate button label from the i18n object.
   *
   * @returns {string} Validate button label.
   */
  getBtnValidateLabel: () => window.i18n["btn-validate"],

  /**
   * Retrieves the label for showing more avatars from the i18n object.
   *
   * @returns {string} Label for showing more avatars.
   */
  getBtnShowAvatarsLabel: () => window.i18n["btn-show"],

  /**
   * Retrieves the source URL for images metadata.
   * Uses the `getValue` function to retrieve a custom CSS property or returns a default URL.
   *
   * @returns {string} Link to the images JSON.
   */
  getSrcImages: () =>
    getValue(`--${prefix}-url-iamges`) ||
    "https://raw.githubusercontent.com/kalibrado/js-avatars-images/refs/heads/main/images_metadata.json",

  /**
   * Checks if the debug mode is enabled by reading the appropriate CSS property.
   *
   * @returns {boolean} True if debug mode is enabled, false otherwise.
   */
  debug: () => {
    if (getValue(`--${prefix}-debug`)) {
      return true;
    }
    return false;
  },

  /**
   * Retrieves the CSS selector for the modal open button injection element.
   *
   * @returns {string} CSS selector for the button.
   */
  injectBtnModal: () => getValue(`--${prefix}-inject-btn`) || "#btnDeleteImage",

  /**
   * Holds the currently selected image, initially set to null.
   *
   * @type {?string}
   */
  selectedImage: null,

  /**
   * The prefix used for all local storage keys and CSS properties.
   *
   * @type {string}
   */
  prefix,
};
