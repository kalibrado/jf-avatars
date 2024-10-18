import { constants } from "./constants.js";
import {
  applyFilter,
  addImagesToGrid,
  toggleValidateButton,
} from "./functions.js";
import { props } from "./props.js";
import { adjustResponsive, setCssProperties } from "./style.js";

/**
 * Configures event listeners for image search and filtering.
 * @function eventListener
 * @returns {void}
 */
export const eventListener = () => {
  /** @type {HTMLInputElement} */
  let searchBar = document.querySelector(`#${props.prefix}-search-input`);

  /** @type {HTMLSelectElement} */
  let dropdown = document.getElementById(`${props.prefix}-dropdown`);

  /**
   * Applies filters based on both the dropdown and the search bar input.
   * @function applySearchAndDropdownFilters
   * @param {Event} event - The event object triggered by the user input.
   * @returns {void}
   */
  const applySearchAndDropdownFilters = (event) => {
    /** @type {string} */
    let searchTerm = searchBar?.value?.toLowerCase();

    /** @type {string} */
    let selectedOption = dropdown?.value?.toLowerCase();

    // Start with all images
    /** @type {Array<string>} */
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

  /**
   * @type {NodeListOf<HTMLImageElement>}
   * Collection of images to lazy load.
   */
  let lazyImages = document.querySelectorAll(".lazy-image");

  /**
   * Intersection Observer instance to lazy load images.
   * Observes when images enter the viewport and loads them by replacing the 'data-src' attribute with the 'src' attribute.
   *
   * @param {IntersectionObserverEntry[]} entries - Array of observed elements with information about their intersection state.
   * @param {IntersectionObserver} observer - The IntersectionObserver instance observing the images.
   */
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // Check if the image is intersecting (i.e., visible in the viewport)
      if (entry.isIntersecting) {
        /**
         * @type {HTMLImageElement} img - The target image element being observed.
         */
        const img = entry.target;
        // Replace the 'src' attribute with the actual image source from 'data-src'
        const actualSrc = img.getAttribute("data-src");

        // Create a new Image to preload the actual image
        const image = new Image();
        image.src = actualSrc;
        // Once the actual image is loaded
        image.onload = () => {
          // Replace the loader with the actual image
          img.src = actualSrc;
          img.classList.remove("blink");
          setCssProperties(img, { cursor: "pointer" });

          // Animation effect on hover
          img.onmouseover = ({ target }) => {
            if (props.selectedImage && props.selectedImage.src === target.src)
              return;
            setCssProperties(img, {
              transform: "scale(1.1)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              filter: "brightness(1)",
            });
          };

          img.onmouseout = ({ target }) => {
            if (props.selectedImage && props.selectedImage.src === target.src)
              return;
            setCssProperties(img, {
              transform: "scale(1)",
              boxShadow: "none",
              filter: "brightness(0.5)",
            });
          };

          img.onclick = ({ target }) => {
            if (!target.src.endsWith(props.imageName)) {
              toggleValidateButton(img);
            }
          };
        };

        // If there's an error loading the image, you can handle it here
        image.onerror = () => {
          console.error(`Error loading image: ${actualSrc}`);
          img.remove();
        };

        // Stop observing the image since it's now loaded
        observer.unobserve(img);
      }
    });
  });

  /**
   * Observes each image with the class 'lazy-image' and triggers lazy loading when it becomes visible.
   *
   * @param {NodeListOf<HTMLImageElement>} lazyImages - A collection of image elements to observe for lazy loading.
   */
  lazyImages.forEach((img) => {
    // Start observing each image for intersection
    observer.observe(img);
  });
};
