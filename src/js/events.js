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
 * Filter and display images based on search input and category selection.
 * @param {Event} event - Input event.
 */
export const applySearchAndFilters = async (event) => {
  let searchTerm = event.target?.value?.toLowerCase();
  let selectedCategory = event.target?.value;
  
  // Determine if this is a search input or dropdown change
  const isSearchInput = event.target?.id?.includes('search-input');
  const isDropdown = event.target?.id?.includes('dropdown-select-filter');
  
  // Get current values from both inputs
  const searchInput = document.querySelector(`#${props.prefix}-search-input`);
  const dropdownSelect = document.querySelector(`#${props.prefix}-dropdown-select-filter`);
  
  const currentSearchTerm = searchInput?.value?.toLowerCase() || "";
  const currentCategory = dropdownSelect?.value || "";
  
  showRippleLoader();

  const allSrcImages = (await loadSrcImages()) || [];

  let filteredSrcImages = allSrcImages;

  // Apply category filter first
  if (currentCategory && currentCategory !== props.getDefaultOptionLabel()) {
    filteredSrcImages = filteredSrcImages.filter((img) => {
      const category = img.category || img.folder || "";
      return category.toLowerCase().includes(currentCategory.toLowerCase());
    });
  }

  // Apply search filter
  if (currentSearchTerm && currentSearchTerm.trim() !== "") {
    filteredSrcImages = filteredSrcImages.filter((img) => {
      const url = img.url || "";
      const name = img.name || "";
      log("Search term:", currentSearchTerm);
      log("Image:", img);
      return url.toLowerCase().includes(currentSearchTerm) || 
             name.toLowerCase().includes(currentSearchTerm);
    });
  }

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
    addImagesToGrid(props.avatarUrls(currentSearchTerm), imgGrid);
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
