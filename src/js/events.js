import { constants } from "./constants.js";
import { applyFilter, addImagesToGrid } from "./functions.js";
import { props } from "./props.js";
import { adjustResponsive } from "./style.js";

/**
 * Configures event listeners for image search and filtering.
 * @function
 * @returns {void}
 */
export const eventListener = () => {
  /** @type {HTMLInputElement} */
  let searchBar = document.querySelector(`#${props.prefix}-search-input`);

  /** @type {HTMLSelectElement} */
  let dropdown = document.getElementById(`${props.prefix}-dropdown`);

  /**
   * Applies filters based on both the dropdown and the search bar input.
   * @function
   * @param {Event} event - The event object triggered by the user input.
   * @returns {void}
   */
  const applySearchAndDropdownFilters = (event) => {
    /** @type {string} */
    let searchTerm = searchBar?.value?.toLowerCase();

    /** @type {string} */
    let selectedOption = dropdown?.value?.toLowerCase();

    // Start with all images
    /** @type {Array} */
    let filteredImages = constants.srcImages;

    // If a dropdown option other than the default is selected
    if (selectedOption !== props.getDefaultOptionLabel().toLowerCase()) {
      filteredImages = applyFilter(selectedOption, filteredImages);
    }

    // If a search term is present, further filter the images
    if (searchTerm !== "") {
      filteredImages = applyFilter(searchTerm, filteredImages);
    }

    // Display the filtered images
    addImagesToGrid(filteredImages);
  };

  // Listener for changes in the dropdown selection
  dropdown.addEventListener("change", applySearchAndDropdownFilters);

  // Listener for input in the search bar
  searchBar.addEventListener("input", applySearchAndDropdownFilters);

  // Event listener for adjusting layout when the window is resized
  window.addEventListener("resize", adjustResponsive);
};
