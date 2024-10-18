/**
 * Prefix used for local storage keys and CSS properties.
 * @constant {string}
 */
const prefix = "jf-avatars";

/**
 * Cleans a property by removing unnecessary quotes and spaces.
 * @function
 * @param {string} property - The property to clean.
 * @returns {string} - The cleaned property.
 */
const cleanProperty = (property) => {
  return property.replace(/['"]/g, "").trim();
};

/**
 * Properties object used in the UI.
 * @constant
 * @namespace props
 * @property {function(): string} getTitle - Retrieves the modal title, or the default value if not defined.
 * @property {function(): string} getFilterLabel - Retrieves the filter label, or the default value if not defined.
 * @property {function(): string} getDefaultOptionLabel - Retrieves the default option for the filter, or the default value if not defined.
 * @property {function(): string} getSearchLabel - Retrieves the search label, or the default value if not defined.
 * @property {function(): string} getBtnCancelLabel - Retrieves the cancel button label, or the default value if not defined.
 * @property {function(): string} getBtnValidateLabel - Retrieves the validate button label, or the default value if not defined.
 * @property {function(): string} getBtnShowAvatarsLabel - Retrieves the "show more avatars" button label, or the default value if not defined.
 * @property {?string} selectedImage - Currently selected image, initially null.
 * @property {string} prefix - Prefix used for storage keys and CSS properties.
 * @property {string} jfElementInjectBtnOpenModal - CSS selector for the modal open button injection element.
 */
export const props = {
  /**
   * @returns {string} Modal title.
   */
  getTitle: () =>
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(`--${prefix}-title`)
    ) || "Select your avatar",

  /**
   * @returns {string} Filter label.
   */
  getFilterLabel: () =>
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-filter-label`
      )
    ) || "Filter by",

  /**
   * @returns {string} Default option label for filter.
   */
  getDefaultOptionLabel: () =>
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-filter-default-option`
      )
    ) || "Choose an option",

  /**
   * @returns {string} Search label.
   */
  getSearchLabel: () =>
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-search-label`
      )
    ) || "Search for an avatar...",

  /**
   * @returns {string} Cancel button label.
   */
  getBtnCancelLabel: () =>
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(`--${prefix}-btn-cancel`)
    ) || "Cancel",

  /**
   * @returns {string} Validate button label.
   */
  getBtnValidateLabel: () =>
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-btn-validate`
      )
    ) || "Validate",

  /**
   * @returns {string} Label for showing more avatars.
   */
  getBtnShowAvatarsLabel: () =>
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(`--${prefix}-btn-show`)
    ) || "More avatars",

  selectedImage: null,
  prefix,
  jfElementInjectBtnOpenModal: "#btnDeleteImage",
};
