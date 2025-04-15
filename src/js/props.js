/**
 * Prefix used for local storage keys and CSS properties.
 *
 * @constant {string}
 * @description This prefix is used to avoid naming conflicts with other scripts and to organize the storage keys.
 * @default "jf-avatars"
 * @default {string} prefix - Prefix used for local storage keys and CSS properties.
 */
const prefix = "jf-avatars";

const baseUrl =
  "https://raw.githubusercontent.com/kalibrado/js-avatars-images/refs/heads/main";

const baseUrlImages = `${baseUrl}/images_metadata.json`;
const baseUrlFolders = `${baseUrl}/folders_names.json`;
const fallbackUrl = `https://raw.githubusercontent.com/kalibrado/jf-avatars/refs/heads/main/src/lang/`;

/**
 * Cleans a property by removing unnecessary quotes and spaces.
 * This function retrieves a CSS property value and trims it.
 *
 * @function
 * @description This function is used to retrieve CSS properties from the document and clean them for further use.
 * It removes any quotes and leading/trailing spaces from the property value.
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
 * @property {string} fallbackUrl - Fallback URL to load language files.
 * @property {function(): string} getSrcImages - Retrieves the source URL for images metadata.
 * @property {function(): string} getSrcCatImages - Retrieves the source URL for images folders.
 */
export const props = {
  /**
   * Retrieves the title for the modal from the i18n object.
   *
   * @description This title is used for the modal that displays the avatars.
   * @returns {string} Modal title.
   */
  getTitle: () => window.i18n["title"],

  /**
   * Retrieves the search label from the i18n object.
   *
   * @description This label is used for the search input in the modal.
   * @returns {string} Search label.
   */
  getSearchLabel: () => window.i18n["search-label"],

  /**
   * Retrieves the cancel button label from the i18n object.
   *
   * @description This label is used for the button that closes the modal without saving changes.
   * @returns {string} Cancel button label.
   */
  getBtnCancelLabel: () => window.i18n["btn-cancel"],

  /**
   * Retrieves the validate button label from the i18n object.
   *
   * @description This label is used for the button that confirms the selected avatar.
   * @returns {string} Validate button label.
   */
  getBtnValidateLabel: () => window.i18n["btn-validate"],

  /**
   * Retrieves the label for showing more avatars from the i18n object.
   *
   * @description This label is used for the button that opens the modal to select more avatars.
   * @returns {string} Label for showing more avatars.
   */
  getBtnShowAvatarsLabel: () => window.i18n["btn-show"],

  /**
   * Retrieves the source URL for images metadata.
   * Uses the `getValue` function to retrieve a custom CSS property or returns a default URL.
   *
   * @description This URL is used to load the images metadata.
   * @default "https://raw.githubusercontent.com/kalibrado/js-avatars-images/refs/heads/main/images_metadata.json"
   * @default {string} baseUrlImages - Base URL for images metadata.
   * @returns {string} Link to the images JSON.
   */
  getSrcImages: () => getValue(`--${prefix}-url-images`) || baseUrlImages,
  /**
   * Retrieves the source URL for images folders.
   * Uses the `getValue` function to retrieve a custom CSS property or returns a default URL.
   *
   * @description This URL is used to load the folder names for the images.
   * @default "https://raw.githubusercontent.com/kalibrado/js-avatars-images/refs/heads/main/folders_names.json"
   * @default {string} baseUrlFolders - Base URL for images folders.
   * @returns {string} Link to the folder images JSON.
   */
  getSrcCatImages: () =>
    getValue(`--${prefix}-url-images-cat`) || baseUrlFolders,

  /**
   * Filter label for the modal.
   * @description This label is used to identify the filter option in the modal.
   * @returns {string} The label for the filter.

   */
  getFilterLabel: () => window.i18n["filter-label"],

  /**
   * Default option label for the filter.
   * @description This label is used when no specific filter is selected.
   * @returns {string} The default option label.
   */
  getDefaultOptionLabel: () => window.i18n["default-option"],

  /**
   * Checks if the debug mode is enabled by reading the appropriate CSS property.
   *
   * @description This property is used to control debug logging and other debug-related features.
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
   * @description This selector is used to identify the element where the button will be injected.
   * @returns {string} CSS selector for the button.
   */
  injectBtnModal: () => getValue(`--${prefix}-inject-btn`) || "#btnDeleteImage",

  /**
   * Holds the currently selected image, initially set to null.
   *
   * @type {?string}
   * @description This property is used to store the image that the user has selected in the modal.
   */
  selectedImage: null,

  /**
   * The prefix used for all local storage keys and CSS properties.
   *
   * @type {string}
   * @description This prefix is used to avoid naming conflicts with other scripts and to organize the storage keys.
   */
  prefix,

  /**
   * The fallback url to load lang.
   * @type {string}
   * @description This url is used to load the language files in case the primary source is unavailable.
   * @default "https://raw.githubusercontent.com/kalibrado/jf-avatars/refs/heads/main/src/lang/"
   */
  fallbackUrl,
};
