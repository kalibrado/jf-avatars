import {
  addImagesToGrid,
  log,
  loadSrcImages,
  isInViewport,
} from "./functions.js";
import { loadImageWithPriority, preloadImportantImages } from "./preload.js";
import { props } from "./props.js";
import { adjustResponsive } from "./style.js";
import { showRippleLoader } from "./ui-elements.js";

/**
 * Lazy load images using IntersectionObserver.
 */
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const actualSrc = img.getAttribute("data-src");
      loadImageWithPriority(img, actualSrc);
      observer.unobserve(img);
    }
  });
});

let lazyImages = () => document.querySelectorAll(".lazy-image");

/**
 * Filter and display images based on search input.
 * @param {Event} event - Input event.
 */
export const applySearchAndFilters = async (event) => {
  let searchTerm = event.target?.value?.toLowerCase();
  showRippleLoader();

  const allSrcImages = (await loadSrcImages()) || [];

  const filteredSrcImages =
    !searchTerm || searchTerm.trim() === ""
      ? allSrcImages
      : allSrcImages.filter((img) => {
          const url = img.url || "";
          log("Search term:", searchTerm);
          log("Image:", img);
          return url.toLowerCase().includes(searchTerm);
        });

  const imgGrid = document.querySelector(`#${props.prefix}-grid-container`);

  if (filteredSrcImages.length > 0) {
    preloadImportantImages(filteredSrcImages);
    if (imgGrid) {
      addImagesToGrid(filteredSrcImages, imgGrid);
      lazyImages().forEach((img) => {
        if (isInViewport(img)) {
          const actualSrc = img.getAttribute("data-src");
          loadImageWithPriority(img, actualSrc);
        } else {
          observer.observe(img);
        }
      });
    }
  } else {
    addImagesToGrid(props.avatarUrls(searchTerm), imgGrid);
    lazyImages().forEach((img) => {
      if (isInViewport(img)) {
        const actualSrc = img.getAttribute("data-src");
        loadImageWithPriority(img, actualSrc);
      } else {
        observer.observe(img);
      }
    });
  }
};

/**
 * Setup event listeners for filtering and image responsiveness.
 */
export const eventListener = () => {
  const searchBar = document.querySelector(`#${props.prefix}-search-input`);
  const dropdown = document.querySelector(
    `#${props.prefix}-dropdown-select-filter`
  );

  searchBar.addEventListener("input", applySearchAndFilters);
  dropdown.addEventListener("change", applySearchAndFilters);
  window.addEventListener("resize", adjustResponsive);

  lazyImages().forEach((img) => {
    if (isInViewport(img)) {
      const actualSrc = img.getAttribute("data-src");
      loadImageWithPriority(img, actualSrc);
    } else {
      observer.observe(img);
    }
  });
};
