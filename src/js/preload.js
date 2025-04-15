import { log, toggleValidateButton } from "./functions.js";
import { props } from "./props.js";
import { setCssProperties } from "./style.js";

/**
 * Maximum number of concurrent image loads.
 * @constant {number}
 */
const MAX_CONCURRENT_LOADS = 100;

/**
 * Whether to prioritize images visible in the viewport.
 * @constant {boolean}
 */
const LOAD_PRIORITY_VIEWPORT = true;

/**
 * Class representing a queue for image loading tasks with limited concurrency.
 */
class ImageLoadQueue {
  /**
   * Create a new image load queue.
   * @param {number} maxConcurrent - Maximum number of concurrent loads.
   */
  constructor(maxConcurrent = 4) {
    this.queue = [];
    this.activeLoads = 0;
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Add an image load task to the queue.
   * @param {Function} loadTask - The image loading function returning a Promise.
   * @param {number} priority - Task priority (lower number = higher priority).
   */
  add(loadTask, priority = 10) {
    this.queue.push({ loadTask, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
    this.processQueue();
  }

  /**
   * Process the queue and start the next image load if possible.
   */
  processQueue() {
    if (this.activeLoads >= this.maxConcurrent || this.queue.length === 0)
      return;

    const { loadTask } = this.queue.shift();
    this.activeLoads++;

    Promise.resolve(loadTask())
      .catch((error) => log(`Image load error: ${error}`))
      .finally(() => {
        this.activeLoads--;
        this.processQueue();
      });
  }
}

/**
 * Global instance of the image load queue.
 * @type {ImageLoadQueue}
 */
const imageQueue = new ImageLoadQueue(MAX_CONCURRENT_LOADS);

/**
 * Calculate loading priority based on image's viewport visibility.
 * @param {HTMLElement} img - Image element.
 * @returns {number} - Priority value.
 */
export const calculateLoadPriority = (img) => {
  if (!LOAD_PRIORITY_VIEWPORT) return 10;
  const rect = img.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top < windowHeight && rect.bottom > 0) {
    const distanceFromCenter = Math.abs(
      (rect.top + rect.bottom) / 2 - windowHeight / 2
    );
    return Math.floor(distanceFromCenter / 100);
  }

  return 20 + Math.floor(rect.top / 100);
};

/**
 * Load image based on calculated priority.
 * @param {HTMLImageElement} img - Image element to populate.
 * @param {string} actualSrc - Actual image source URL.
 */
export const loadImageWithPriority = (img, actualSrc) => {
  const priority = calculateLoadPriority(img);

  imageQueue.add(() => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        img.src = actualSrc;
        img.classList.remove("blink");
        setCssProperties(img, { cursor: "pointer" });
        setupImageInteractions(img);
        resolve();
      };

      image.onerror = () => {
        log(`Image failed to load: ${actualSrc}`);
        img.remove();
        reject(new Error(`Failed to load image: ${actualSrc}`));
      };

      image.src = actualSrc;
    });
  }, priority);
};

/**
 * Attach hover and click interactions to an image.
 * @param {HTMLImageElement} img - Image element.
 */
export const setupImageInteractions = (img) => {
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

/**
 * Preload a number of important images to enhance UX.
 * @param {Array} images - List of image objects with URLs.
 * @param {number} count - Number of images to preload.
 */
export const preloadImportantImages = async (images, count = 6) => {
  const imagesToPreload = images.slice(0, count);

  imagesToPreload.forEach((img, index) => {
    setTimeout(() => {
      const image = new Image();
      image.src = img.url;
      log(`Preloading important image #${index + 1}: ${img.url}`);
    }, index * 50);
  });
};
