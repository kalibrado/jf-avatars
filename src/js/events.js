import {
  addImagesToGrid,
  toggleValidateButton,
  log,
  loadSrcImages,
} from "./functions.js";
import { props } from "./props.js";
import { adjustResponsive, setCssProperties } from "./style.js";
import { showRippleLoader } from "./ui-elements.js";

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
          if (
            (props.selectedImage && props.selectedImage.src === target.src) ||
            target.id === `${props.prefix}-img-selected`
          )
            return;
          setCssProperties(img, {
            transform: "scale(1.1)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
            filter: "brightness(1)",
          });
        };

        img.onmouseout = ({ target }) => {
          if (
            (props.selectedImage && props.selectedImage.src === target.src) ||
            target.id === `${props.prefix}-img-selected`
          )
            return;
          setCssProperties(img, {
            transform: "scale(1)",
            boxShadow: "none",
            filter: "brightness(0.5)",
          });
        };

        img.onclick = ({ target }) => {
          if (!target.src.endsWith(props.imageName)) {
            log(`Clicked img ${img.id}`);
            toggleValidateButton(img);
          }
        };
      };

      // If there's an error loading the image, you can handle it here
      image.onerror = () => {
        log(`Error loading image: ${actualSrc}`);
        img.remove();
      };

      // Stop observing the image since it's now loaded
      observer.unobserve(img);
    }
  });
});

/**
 * Configures event listeners for image search and filtering.
 * Sets up listeners for search bar input and window resize events, and applies filters based on the search term.
 * Initializes lazy loading for images when they enter the viewport.
 *
 * @function eventListener
 * @returns {void}
 */
export const eventListener = () => {
  /** @type {HTMLInputElement} */
  let searchBar = document.querySelector(`#${props.prefix}-search-input`);
  /**
   * @type {NodeListOf<HTMLImageElement>}
   * Collection of images to lazy load.
   */
  let lazyImages = () => document.querySelectorAll(".lazy-image");

  /**
   * Applies filters based on the search bar input and updates the grid.
   * Filters images by URL if a search term is entered, or shows all images if the search term is empty.
   *
   * @function applySearchAndFilters
   * @param {Event} event - The event object triggered by the user input.
   * @returns {void}
   */
  const applySearchAndFilters = async (event) => {
    /** @type {string} */
    let searchTerm = searchBar?.value?.toLowerCase();

    // Show loading indicator
    showRippleLoader();

    // Option 2: If you prefer to rebuild the grid
    // Get the original image sources
    const allSrcImages = (await loadSrcImages()) || [];

    // Filter the source images based on the search term
    const filteredSrcImages =
      !searchTerm || searchTerm.trim() === ""
        ? allSrcImages
        : allSrcImages.filter((img) => {
            const url = img.url || "";
            return url.toLowerCase().includes(searchTerm.toLowerCase());
          });

    // Update the grid with the filtered images
    if (filteredSrcImages.length > 0) {
      const imgGrid = document.querySelector(`#${props.prefix}-grid-container`);
      if (imgGrid) {
        addImagesToGrid(filteredSrcImages, imgGrid);
        lazyImages().forEach((img) => observer.observe(img));
      }
    } else {
      // Génération d'avatars si aucune image correspondante
      const avatarUrls = [
        {
          url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${searchTerm}`,
        },
        {
          url: `https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&facialHairType=BeardLight&seed=${searchTerm}`,
        },
        { url: `https://api.multiavatar.com/${searchTerm}.svg` },
        { url: `https://robohash.org/${searchTerm}.png` },
        {
          url: `https://ui-avatars.com/api/?name=${searchTerm}&background=random`,
        },
      ];
      const imgGrid = document.querySelector(`#${props.prefix}-grid-container`);
      addImagesToGrid(avatarUrls, imgGrid);
      lazyImages().forEach((img) => observer.observe(img));
    }
  };

  // Listener for input in the search bar
  searchBar.addEventListener("input", applySearchAndFilters);

  // Event listener for adjusting layout when the window is resized
  window.addEventListener("resize", adjustResponsive);

  // Initialize lazy loading for images
  lazyImages().forEach((img) => observer.observe(img));
};
